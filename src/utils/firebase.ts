"use client";
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

import gservices from '../../google-services-control-acceso.json';

const apiKeyFromFile = gservices?.client?.[0]?.api_key?.[0]?.current_key;
const projectInfo = gservices?.project_info ?? {};

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? apiKeyFromFile ?? undefined,
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ??
    (projectInfo.project_id ? `${projectInfo.project_id}.firebaseapp.com` : undefined),
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? projectInfo.project_id ?? undefined,
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? projectInfo.storage_bucket ?? undefined,
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? projectInfo.project_number ?? undefined,
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? gservices?.client?.[0]?.client_info?.mobilesdk_app_id ?? undefined,
};

let app: FirebaseApp | null = null;

export function initFirebase() {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig as any);
  } else if (!app) {
    app = getApps()[0];
  }
  return app;
}

export async function requestFcmToken(): Promise<string | null> {
  try {
    if (typeof window === "undefined") return null;
    if (!('Notification' in window)) return null;
    const p = await Notification.requestPermission();
    if (p !== 'granted') return null;
    const firebaseApp = initFirebase();
    // Ensure service worker is registered before requesting token
    try {
      if ('serviceWorker' in navigator) {
        await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      }
    } catch (swErr) {
      console.warn('Service worker registration failed', swErr);
      // continue, getToken may still try to register default worker
    }

    const messaging = getMessaging(firebaseApp as any);
    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
    const currentToken = await getToken(messaging, { vapidKey });
    return currentToken ?? null;
  } catch (e) {
    console.error('requestFcmToken error', e);
    return null;
  }
}
