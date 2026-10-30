import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase web config is public by design; access is enforced by firestore.rules / storage.rules.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDCh9041HYVR2eDDXz8nc0A60-VlsxdHo0",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "adult-affiliate-185c0.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "adult-affiliate-185c0",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "adult-affiliate-185c0.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "297369231808",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:297369231808:web:c76f441348570675c3e825",
};

export function isFirebaseConfigured() {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
}

function getFirebaseApp() {
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

/** Firestore instance, safe on server or in the browser. */
export function getDb() {
  if (!isFirebaseConfigured()) return null;
  return getFirestore(getFirebaseApp());
}

/** Auth instance — browser only. */
export function getFirebaseAuth() {
  if (!isFirebaseConfigured() || typeof window === "undefined") return null;
  return getAuth(getFirebaseApp());
}

/** Cloud Storage instance — browser only. */
export function getFirebaseStorage() {
  if (!isFirebaseConfigured() || typeof window === "undefined") return null;
  return getStorage(getFirebaseApp());
}
