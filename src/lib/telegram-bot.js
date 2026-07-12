import { Chat, Card, CardText, Actions, Button, LinkButton } from "chat";
import { createTelegramAdapter } from "@chat-adapter/telegram";
import { createPostgresState } from "@chat-adapter/state-pg";
import { createMemoryState } from "@chat-adapter/state-memory";
import { getSupabase, isSupabaseConfigured, getPublicStorageUrl } from "./supabase.js";
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

/** Public, absolute poster/cover image URL for a Telegram card, or null if none set. */
function posterUrlFor(item, kind) {
  const raw = String((kind === "story" ? item.cover_url : item.poster_url) || "").trim();
  if (!raw) return null;
  const resolved = getPublicStorageUrl(raw) || raw;
  if (!resolved.startsWith("http")) return null;
  return resolved;
}

/** A single item announcement: image (if any) + SFW teaser + link button — never explicit media in-chat. */
function itemCard(item, kind) {
  const poster = posterUrlFor(item, kind);
  const linkLabel = kind === "story" ? `Read on ${siteName()}` : `Watch on ${siteName()}`;
  return Card({
    title: String(item.title || "").trim() || (kind === "story" ? "New story" : "New video"),
    // imageUrl is a top-level Card option, not a nested Image() child.
    ...(poster ? { imageUrl: poster } : {}),
    children: [CardText(teaserFor(item)), Actions([LinkButton({ url: linkFor(item, kind), label: linkLabel })])],
  });
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

const VIDEOS_PAGE_SIZE = 8;

/** One page of active videos, newest first, plus whether more pages exist. */
async function fetchOffersPage(page = 0) {
  if (!isSupabaseConfigured()) return { items: [], hasMore: false, total: 0 };
  const supabase = getSupabase();
  const from = page * VIDEOS_PAGE_SIZE;
  const to = from + VIDEOS_PAGE_SIZE - 1;
  const { data, error, count } = await supabase
    .from("offers")
    .select("*", { count: "exact" })
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .range(from, to);
  if (error) return { items: [], hasMore: false, total: 0 };
  const total = count ?? 0;
  return { items: data || [], hasMore: from + (data?.length || 0) < total, total };
}

function videosCard(page, { items, hasMore, total }) {
  if (!items.length) {
    return Card({ title: `Videos on ${siteName()}`, children: [CardText("No videos found.")] });
  }

  const start = page * VIDEOS_PAGE_SIZE + 1;
  const end = page * VIDEOS_PAGE_SIZE + items.length;
  const buttons = items.map((o) =>
    LinkButton({ url: linkFor(o, "offer"), label: `▶ ${o.title.slice(0, 28)}` })
  );
  const navButtons = [];
  if (page > 0) navButtons.push(Button({ id: "videos_page", value: String(page - 1), label: "◀ Previous" }));
  if (hasMore) navButtons.push(Button({ id: "videos_page", value: String(page + 1), label: "Next ▶" }));

  return Card({
    title: `Videos on ${siteName()}`,
    children: [CardText(`Showing ${start}–${end} of ${total}`), Actions([...buttons, ...navButtons])],
  });
}

bot.onSlashCommand("/videos", async (event) => {
  const page = 0;
  const data = await fetchOffersPage(page);
  await event.channel.post(videosCard(page, data));
});

bot.onAction("videos_page", async (event) => {
  const page = Number(event.value) || 0;
  const data = await fetchOffersPage(page);
  if (!event.thread) return;
  await event.thread.post(videosCard(page, data));
});

bot.onSlashCommand(["/start", "/help"], async (event) => {
  await saveSubscriber(event.user, event.channel.id);
  await event.channel.post(
    [
      `Welcome to *${siteName()}*! 👋`,
      "",
      "Commands:",
      "/latest — see the newest drops",
      "/videos — browse all videos",
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

export { teaserFor, linkFor, posterUrlFor, itemCard, fetchLatest, fetchOffersPage, siteUrl, siteName };
