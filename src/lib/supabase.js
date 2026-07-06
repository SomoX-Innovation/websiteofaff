import { createClient } from "@supabase/supabase-js";

const url = String(process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();

/** Anon / public API key (legacy jwt or newer publishable key from Project Settings → API). */
const anon = String(
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
    ""
).trim();

export function isSupabaseConfigured() {
  return Boolean(url && anon && url.startsWith("http"));
}

let browserClient = null;

/** Single client instance, safe to call on server or in the browser. */
export function getSupabase() {
  if (!isSupabaseConfigured()) return null;
  if (typeof window === "undefined") {
    return createClient(url, anon, { auth: { persistSession: false } });
  }
  if (!browserClient) {
    browserClient = createClient(url, anon, {
      auth: {
        flowType: "pkce",
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return browserClient;
}

/**
 * Generate a proper public URL for Supabase Storage files.
 * Handles both old-style URLs and direct storage paths.
 */
export function getPublicStorageUrl(urlOrPath) {
  const input = String(urlOrPath || "").trim();
  if (!input) return null;

  if (input.startsWith("http://") || input.startsWith("https://")) {
    return input;
  }

  if (isSupabaseConfigured() && !input.startsWith("/")) {
    return `${url}/storage/v1/object/public/${input}`;
  }

  return null;
}
