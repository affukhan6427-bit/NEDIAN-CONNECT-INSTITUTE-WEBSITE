import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

// Official Cloud Firebase & Firestore configuration for Nedian Connect Institute
export const FIREBASE_CONFIG = {
  projectId: "gen-lang-client-0767124190",
  appId: "1:361036394658:web:7c21006d5517906ca027fb",
  apiKey: "AIzaSyB8Ah5koAn9kAypSY9FOWMBWnGX-QcHUbQ",
  authDomain: "gen-lang-client-0767124190.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-nedianconnectins-84d98d6f-49e8-4a48-a247-ba740cfbf7b7",
  storageBucket: "gen-lang-client-0767124190.firebasestorage.app",
  messagingSenderId: "361036394658",
  measurementId: "",
  oAuthClientId: "361036394658-uvb9ev0elrhc8vlt1p0uf8bbg5aq2k16.apps.googleusercontent.com",
  recaptchaSiteKey: ""
};

// Singleton Firebase App instance
export const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(FIREBASE_CONFIG);

// Singleton Auth instance
export const auth: Auth = getAuth(app);

// Singleton Firestore database targeting the provisioned database ID
export const db: Firestore = getFirestore(app, FIREBASE_CONFIG.firestoreDatabaseId);
