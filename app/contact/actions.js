"use server";

import { addDoc, collection } from "firebase/firestore";
import { getDb } from "../../src/lib/firebase.js";

export async function submitContactMessage({ name, email, message }) {
  if (!message || !message.trim()) {
    return { ok: false, error: "Please enter a message." };
  }

  const db = getDb();
  if (!db) {
    return { ok: false, error: "Messaging is temporarily unavailable. Please try again later." };
  }

  try {
    await addDoc(collection(db, "contact_messages"), {
      name: name || null,
      email: email || null,
      message: message.trim(),
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error(error);
    return { ok: false, error: "Could not send your message. Please try again later." };
  }

  return { ok: true };
}
