// Firebase setup.
// 1. Create a project at https://console.firebase.google.com
// 2. Enable Firestore (Build > Firestore Database > Create database)
// 3. Add a Web App in Project Settings, copy the config values into .env.local
//    (see .env.local.example in the project root)
// 4. Restart `npm run dev` after adding env vars.

import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const hasConfig = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

let app = null;
let db = null;

if (hasConfig) {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  db = getFirestore(app);
}

// `db` is null until you fill in .env.local — every place that uses it
// (homebrew + character sheet saving) checks for this and falls back to
// browser localStorage so the app still works with zero setup.
export { app, db, hasConfig };
