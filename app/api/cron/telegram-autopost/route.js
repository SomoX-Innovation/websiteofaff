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

async function broadcast(bot, text, channelId) {
  await bot.channel(`telegram:${channelId}`).post({ markdown: text });
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

  const { bot, teaserFor, linkFor, siteName } = await import("../../../../src/lib/telegram-bot.js");
  const supabase = getSupabase();

  const [offers, stories] = await Promise.all([
    unpostedItems(supabase, "offers", "offer", 5),
    unpostedItems(supabase, "stories", "story", 5),
  ]);

  let posted = 0;
  for (const offer of offers) {
    const text = `${teaserFor(offer)}\n\n👉 [Watch on ${siteName()}](${linkFor(offer, "offer")})`;
    await broadcast(bot, text, channelId);
    await markPosted(supabase, "offer", offer.id);
    posted += 1;
  }
  for (const story of stories) {
    const text = `${teaserFor(story)}\n\n👉 [Read on ${siteName()}](${linkFor(story, "story")})`;
    await broadcast(bot, text, channelId);
    await markPosted(supabase, "story", story.id);
    posted += 1;
  }

  return Response.json({ ok: true, posted });
}
