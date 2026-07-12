import { getSupabase, isSupabaseConfigured } from "../../../../src/lib/supabase.js";

export const maxDuration = 60;

async function unpostedItems(supabase, table, kind, limit) {
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error || !data?.length) return [];

  const ids = data.map((r) => r.id);
  const { data: posted } = await supabase
    .from("telegram_posted")
    .select("content_id")
    .eq("content_type", kind)
    .in("content_id", ids);
  const postedIds = new Set((posted || []).map((p) => p.content_id));
  return data.filter((r) => !postedIds.has(r.id));
}

async function markPosted(supabase, kind, id) {
  await supabase.from("telegram_posted").insert({ content_type: kind, content_id: id });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function broadcast(bot, card, channelId) {
  const channel = bot.channel(`telegram:${channelId}`);
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      await channel.post(card);
      return;
    } catch (err) {
      const retryAfter = err?.retryAfter || err?.code === "RATE_LIMITED" ? err.retryAfter || 3 : null;
      if (retryAfter && attempt < 2) {
        await sleep((retryAfter + 1) * 1000);
        continue;
      }
      throw err;
    }
  }
}

export async function GET(request) {
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (!process.env.TELEGRAM_BOT_TOKEN) {
    return Response.json({ ok: false, reason: "Telegram bot not configured" }, { status: 200 });
  }

  // Separate channels per content type, falling back to the single legacy
  // channel var if only one is configured (videos and stories both post
  // there, same as before this split existed).
  const videosChannelId = process.env.TELEGRAM_ANNOUNCE_CHAT_ID_VIDEOS || process.env.TELEGRAM_ANNOUNCE_CHAT_ID;
  const storiesChannelId = process.env.TELEGRAM_ANNOUNCE_CHAT_ID_STORIES || process.env.TELEGRAM_ANNOUNCE_CHAT_ID;
  if (!videosChannelId && !storiesChannelId) {
    return Response.json(
      { ok: false, reason: "No announce channel configured (set TELEGRAM_ANNOUNCE_CHAT_ID_VIDEOS / _STORIES or TELEGRAM_ANNOUNCE_CHAT_ID)" },
      { status: 200 }
    );
  }

  if (!isSupabaseConfigured()) {
    return Response.json({ ok: false, reason: "Supabase not configured" }, { status: 200 });
  }

  const { bot, itemCard } = await import("../../../../src/lib/telegram-bot.js");
  // Chat normally initializes lazily on the first webhook call; cron runs
  // never hit a webhook, so the adapter (bot user id, etc.) would otherwise
  // stay unset and throw when bot.channel(...).post() tries to use it.
  await bot.initialize();
  const supabase = getSupabase();

  // Default 5/run for the recurring cron; pass ?limit=1000 (capped) for a
  // one-off backfill of every existing unposted video/story.
  const requestedLimit = Number(new URL(request.url).searchParams.get("limit"));
  const limit = Number.isFinite(requestedLimit) && requestedLimit > 0 ? Math.min(requestedLimit, 1000) : 5;

  const [offers, stories] = await Promise.all([
    videosChannelId ? unpostedItems(supabase, "offers", "offer", limit) : [],
    storiesChannelId ? unpostedItems(supabase, "stories", "story", limit) : [],
  ]);

  // Telegram allows roughly 1 message/sec to the same chat — pace posts so a
  // large backfill doesn't get rate-limited partway through.
  let posted = 0;
  for (const offer of offers) {
    if (posted > 0) await sleep(1100);
    await broadcast(bot, itemCard(offer, "offer"), videosChannelId);
    await markPosted(supabase, "offer", offer.id);
    posted += 1;
  }
  for (const story of stories) {
    if (posted > 0) await sleep(1100);
    await broadcast(bot, itemCard(story, "story"), storiesChannelId);
    await markPosted(supabase, "story", story.id);
    posted += 1;
  }

  return Response.json({ ok: true, posted });
}
