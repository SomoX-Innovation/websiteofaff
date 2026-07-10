import { Chat } from "chat";
import { createTelegramAdapter } from "@chat-adapter/telegram";
import { createPostgresState } from "@chat-adapter/state-pg";
import { createMemoryState } from "@chat-adapter/state-memory";
import { getSupabase, isSupabaseConfigured } from "./supabase.js";
import { fallbackSite } from "../affiliate-config.js";

function siteUrl() {
  return String(process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/+$/, "");
}

function siteName() {
  return String(process.env.NEXT_PUBLIC_SITE_NAME || fallbackSite.siteName || "the site");
}

/** SFW teaser text — never send explicit media/links directly into Telegram. */
function teaserFor(item) {
  const title = String(item.title || "Fresh drop").trim();
  const tag = String(item.category || item.series || "").trim();
  const bits = [`New on ${siteName()}: *${title}*`];
  if (tag) bits.push(`Category: ${tag}`);
  return bits.join("\n");
}

function linkFor(item, kind) {
  const base = siteUrl();
  const path =
    kind === "story"
      ? `/stories/${encodeURIComponent(item.slug || item.id)}`
      : `/watch/${encodeURIComponent(item.slug ? item.slug : `id-${item.id}`)}`;
  return base ? `${base}${path}` : path;
}

const hasPostgresState = Boolean(process.env.POSTGRES_URL || process.env.DATABASE_URL);

// Callers (the webhook and cron routes) only import this module after
// confirming TELEGRAM_BOT_TOKEN is set, so it's safe to construct eagerly here.
export const bot = new Chat({
  userName: process.env.TELEGRAM_BOT_USERNAME || "mybot",
  adapters: {
    telegram: createTelegramAdapter(),
  },
  state: hasPostgresState ? createPostgresState() : createMemoryState(),
  logger: "info",
}).registerSingleton();

async function saveSubscriber(user, chatId) {
  if (!isSupabaseConfigured()) return;
  const supabase = getSupabase();
  await supabase
    .from("telegram_subscribers")
    .upsert(
      {
        chat_id: String(chatId),
        username: user?.userName || null,
        first_name: user?.fullName || null,
        is_active: true,
      },
      { onConflict: "chat_id" }
    );
}

async function fetchLatest(kind, limit = 5) {
  if (!isSupabaseConfigured()) return [];
  const supabase = getSupabase();
  const table = kind === "story" ? "stories" : "offers";
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) return [];
  return data || [];
}

bot.onSlashCommand(["/start", "/help"], async (event) => {
  await saveSubscriber(event.user, event.channel.id);
  await event.channel.post(
    [
      `Welcome to *${siteName()}*! 👋`,
      "",
      "Commands:",
      "/latest — see the newest drops",
      "/site — get the site link",
      "/stop — unsubscribe from updates",
    ].join("\n")
  );
});

bot.onSlashCommand("/site", async (event) => {
  const url = siteUrl() || "(site URL not configured yet)";
  await event.channel.post(`Here you go: ${url}`);
});

bot.onSlashCommand("/latest", async (event) => {
  const [offers, stories] = await Promise.all([fetchLatest("offer", 3), fetchLatest("story", 3)]);
  const items = [...offers.map((o) => ({ ...o, kind: "offer" })), ...stories.map((s) => ({ ...s, kind: "story" }))];
  if (!items.length) {
    await event.channel.post("Nothing new right now — check back soon!");
    return;
  }
  const lines = items.map((it) => `• [${it.title}](${linkFor(it, it.kind)})`);
  await event.channel.post({ markdown: `*Latest on ${siteName()}:*\n\n${lines.join("\n")}` });
});

bot.onSlashCommand("/stop", async (event) => {
  if (isSupabaseConfigured()) {
    const supabase = getSupabase();
    await supabase
      .from("telegram_subscribers")
      .update({ is_active: false })
      .eq("chat_id", String(event.channel.id));
  }
  await event.channel.post("You're unsubscribed. Send /start any time to opt back in.");
});

bot.onDirectMessage(async (thread, message) => {
  await saveSubscriber(message.author, thread.channelId);
  await thread.post(
    "Thanks for the message! Use /latest to see what's new, or /site for the main link."
  );
});

export { teaserFor, linkFor, fetchLatest, siteUrl, siteName };
