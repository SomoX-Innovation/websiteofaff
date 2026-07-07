import { getSupabase, isSupabaseConfigured, getPublicStorageUrl } from "./supabase.js";

/** Link to a story page. Prefers the SEO slug, falls back to the id route. */
export function storyPageHref(storyOrId) {
  if (storyOrId && typeof storyOrId === "object") {
    const slug = String(storyOrId.slug || "").trim();
    if (slug) return `/stories/${encodeURIComponent(slug)}`;
    return storyPageHref(storyOrId.id);
  }
  const id = String(storyOrId || "").trim();
  if (!id) return "/stories";
  return `/stories/id-${encodeURIComponent(id)}`;
}

export function findStoryBySlugOrId(stories, slugOrId) {
  const raw = String(slugOrId || "").trim();
  if (!raw) return null;
  if (raw.startsWith("id-")) {
    const id = raw.slice(3);
    return stories.find((s) => String(s.id) === id) || null;
  }
  const wanted = raw.toLowerCase();
  return stories.find((s) => String(s.slug || "").trim().toLowerCase() === wanted) || null;
}

/** Resolve cover/pdf storage paths to full public URLs. */
function normalizeStoryUrls(rows) {
  return (rows || []).map((s) => ({
    ...s,
    cover_url: getPublicStorageUrl(s.cover_url) || s.cover_url || "",
    pdf_url: getPublicStorageUrl(s.pdf_url) || s.pdf_url || "",
  }));
}

/**
 * Load active PDF stories, ordered by series/episode then sort_order.
 * Safe on the server and in the browser.
 * @returns {Promise<{ ok: boolean, stories: object[] }>}
 */
export async function fetchStories() {
  if (!isSupabaseConfigured()) {
    return { ok: true, stories: [] };
  }

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("stories")
    .select(
      "id, title, slug, description, series, episode, cover_url, pdf_url, pages, tags, category, meta_title, meta_description, sort_order"
    )
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("series", { ascending: true })
    .order("episode", { ascending: true });

  if (error) {
    console.error(error);
    return { ok: false, stories: [] };
  }

  return { ok: true, stories: normalizeStoryUrls(data) };
}
