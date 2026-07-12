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

async function broadcast(bot, card, channelId) {
  await bot.channel(`telegram:${channelId}`).post(card);
}

export async function GET(request) {
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (!process.env.TELEGRAM_BOT_TOKEN) {
    return Response.json({ ok: false, reason: "Telegram bot not configured" }, { status: 200 });
  }

  const channelId = process.env.TELEGRAM_ANNOUNCE_CHAT_ID;
  if (!channelId) {
    return Response.json({ ok: false, reason: "TELEGRAM_ANNOUNCE_CHAT_ID not configured" }, { status: 200 });
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
    unpostedItems(supabase, "offers", "offer", limit),
    unpostedItems(supabase, "stories", "story", limit),
  ]);

  let posted = 0;
  for (const offer of offers) {
    await broadcast(bot, itemCard(offer, "offer"), channelId);
    await markPosted(supabase, "offer", offer.id);
    posted += 1;
  }
  for (const story of stories) {
    await broadcast(bot, itemCard(story, "story"), channelId);
    await markPosted(supabase, "story", story.id);
    posted += 1;
  }

  return Response.json({ ok: true, posted });
}
