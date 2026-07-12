import { fallbackSite } from "../affiliate-config.js";
import { getSupabase, isSupabaseConfigured } from "./supabase.js";

function settingsToMap(rows) {
  const m = {};
  for (const r of rows || []) m[r.key] = r.value;
  return m;
}

function onlyWithVideo(rows) {
  return (rows || []).filter((o) => String(o.video_url || "").trim().length > 0);
}

function normalizeOfferIds(rows) {
  return (rows || []).map((o, i) => ({
    ...o,
    id: o.id != null && String(o.id).trim() ? String(o.id) : `offer-${i}`,
  }));
}

/**
 * Link to the watch page. Pass an offer object to prefer SEO slug, or a string id for the legacy id route.
 * @param {string | { id?: string, slug?: string }} offerOrId
 */
export function watchPageHref(offerOrId) {
  if (offerOrId && typeof offerOrId === "object") {
    const slug = String(offerOrId.slug || "").trim();
    if (slug) return `/watch/${encodeURIComponent(slug)}`;
    return watchPageHref(offerOrId.id);
  }
  const id = String(offerOrId || "").trim();
  if (!id) return "/watch";
  return `/watch/id-${encodeURIComponent(id)}`;
}

/** URL-safe slug for SEO paths (a–z, 0–9, hyphens). */
export function slugifyOfferText(raw) {
  return String(raw || "")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

/**
 * Load site_settings + active offers with video (for homepage and watch page).
 * Safe to call from Server Components / route handlers as well as the browser.
 * @returns {Promise<{ ok: boolean, settings: Record<string, string>, offers: object[] }>}
 */
export async function fetchPublicCatalog() {
  if (!isSupabaseConfigured()) {
    return {
      ok: true,
      settings: {
        site_name: fallbackSite.siteName,
        hero_title: fallbackSite.heroTitle,
        hero_lead: fallbackSite.heroLead,
      },
      offers: normalizeOfferIds(onlyWithVideo(fallbackSite.offers)),
    };
  }

  const supabase = getSupabase();
  const [settingsRes, offersRes] = await Promise.all([
    supabase.from("site_settings").select("key, value"),
    supabase
      .from("offers")
      .select(
        "id, title, description, href, video_url, poster_url, slug, meta_title, meta_description, tags, category, series, episode"
      )
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),
  ]);

  if (settingsRes.error || offersRes.error) {
    console.error(settingsRes.error || offersRes.error);
    return {
      ok: false,
      settings: {
        site_name: fallbackSite.siteName,
        hero_title: fallbackSite.heroTitle,
        hero_lead: fallbackSite.heroLead,
      },
      offers: normalizeOfferIds(onlyWithVideo(fallbackSite.offers)),
    };
  }

  const map = settingsToMap(settingsRes.data);
  return {
    ok: true,
    settings: map,
    offers: normalizeOfferIds(onlyWithVideo(offersRes.data)),
  };
}

export function splitBrandLabel(name) {
  const t = String(name || "").trim();
  if (!t) return { w1: "Site", w2: "" };
  const words = t.split(/\s+/);
  if (words.length >= 2) {
    return { w1: words[0], w2: words.slice(1).join(" ") };
  }
  const mid = Math.ceil(t.length / 2);
  return { w1: t.slice(0, mid), w2: t.slice(mid) };
}

export function findOfferBySlugOrId(offers, slugOrId) {
  const raw = String(slugOrId || "").trim();
  if (!raw) return null;
  if (raw.startsWith("id-")) {
    const id = raw.slice(3);
    return offers.find((o) => String(o.id) === id) || null;
  }
  const wanted = raw.toLowerCase();
  return offers.find((o) => String(o.slug || "").trim().toLowerCase() === wanted) || null;
}

/** Deterministic placeholder view count (no analytics backend). */
export function pseudoViewsFromId(id) {
  const s = String(id || "");
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return 1800 + (Math.abs(h) % 9200);
}
