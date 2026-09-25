// Firebase client for Scheme Sathi AI.
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  browserLocalPersistence,
  setPersistence,
  type Auth,
} from "firebase/auth";
import {
  initializeFirestore,
  getFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  type Firestore,
} from "firebase/firestore";
import { getDatabase, type Database } from "firebase/database";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";
import appletConfig from "../../../firebase-applet-config.json";

export const firebaseConfig = {
  apiKey: appletConfig.apiKey || "AIzaSyDXYaZl9mKDjiu01ugAQ85UZqfuy7k3QCE",
  authDomain: appletConfig.authDomain || "scheme-sathi-ai.firebaseapp.com",
  databaseURL:
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_FIREBASE_DATABASE_URL) ||
    (appletConfig as Record<string, string | undefined>).databaseURL ||
    "https://scheme-sathi-ai-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: appletConfig.projectId || "scheme-sathi-ai",
  storageBucket: appletConfig.storageBucket || "scheme-sathi-ai.firebasestorage.app",
  messagingSenderId: appletConfig.messagingSenderId || "418977626042",
  appId: appletConfig.appId || "1:418977626042:web:55f55d4db1ceb4572c8f83",
  measurementId:
    appletConfig.measurementId ||
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_FIREBASE_MEASUREMENT_ID) ||
    "G-CY592V18TJ",
};

let _app: FirebaseApp | undefined;
let _auth: Auth | undefined;
let _db: Firestore | undefined;
let _rtdb: Database | undefined;
let _analytics: Analytics | undefined;
let _persistenceSet = false;

export function getFirebaseApp(): FirebaseApp {
  if (_app) return _app;
  _app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return _app;
}

export function getFirebaseAuth(): Auth {
  if (_auth) return _auth;
  _auth = getAuth(getFirebaseApp());
  if (typeof window !== "undefined" && !_persistenceSet) {
    _persistenceSet = true;
    setPersistence(_auth, browserLocalPersistence).catch(() => {});
  }
  return _auth;
}

export function getDb(): Firestore {
  if (_db) return _db;
  const app = getFirebaseApp();
  const dbId = appletConfig.firestoreDatabaseId || undefined;

  // Use initializeFirestore with long-polling and multi-tab persistent cache
  // to prevent WebChannel stream disconnections in browser sandboxes/proxies
  if (typeof window !== "undefined") {
    try {
      _db = initializeFirestore(
        app,
        {
          experimentalAutoDetectLongPolling: true,
          localCache: persistentLocalCache({
            tabManager: persistentMultipleTabManager(),
          }),
        },
        dbId,
      );
      return _db;
    } catch {
      try {
        _db = initializeFirestore(
          app,
          {
            experimentalAutoDetectLongPolling: true,
          },
          dbId,
        );
        return _db;
      } catch {
        try {
          _db = dbId ? getFirestore(app, dbId) : getFirestore(app);
        } catch {
          _db = getFirestore(app);
        }
        return _db;
      }
    }
  }

  try {
    _db = dbId ? getFirestore(app, dbId) : getFirestore(app);
  } catch {
    _db = getFirestore(app);
  }
  return _db;
}

export function getRtDb(): Database {
  if (_rtdb) return _rtdb;
  _rtdb = getDatabase(getFirebaseApp(), firebaseConfig.databaseURL);
  return _rtdb;
}

export async function getFirebaseAnalytics(): Promise<Analytics | undefined> {
  if (_analytics) return _analytics;
  if (typeof window !== "undefined") {
    try {
      const supported = await isSupported();
      if (supported) {
        _analytics = getAnalytics(getFirebaseApp());
      }
    } catch {}
  }
  return _analytics;
}

// Auto-initialize analytics if in browser
if (typeof window !== "undefined") {
  getFirebaseAnalytics().catch(() => {});
}

export const googleProvider = new GoogleAuthProvider();
