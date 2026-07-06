"use server";

import { getSupabase, isSupabaseConfigured } from "../../src/lib/supabase.js";

export async function submitContactMessage({ name, email, message }) {
  if (!message || !message.trim()) {
    return { ok: false, error: "Please enter a message." };
  }

  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Messaging is temporarily unavailable. Please try again later." };
  }

  const supabase = getSupabase();
  const { error } = await supabase
    .from("contact_messages")
    .insert({ name: name || null, email: email || null, message: message.trim() });

  if (error) {
    console.error(error);
    return { ok: false, error: "Could not send your message. Please try again later." };
  }

  return { ok: true };
}
