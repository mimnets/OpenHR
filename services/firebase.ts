
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const safeGetEnv = (key: string): string => {
  try {
    if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
      if ((import.meta as any).env[key]) return (import.meta as any).env[key];
    }
    if (typeof process !== 'undefined' && process.env) {
      if ((process.env as any)[key]) return (process.env as any)[key];
    }
  } catch (e) {}
  return '';
};

export const getFirebaseConfig = () => {
  const envConfig = {
    apiKey: safeGetEnv('VITE_FIREBASE_API_KEY') || safeGetEnv('FIREBASE_API_KEY'),
    authDomain: safeGetEnv('VITE_FIREBASE_AUTH_DOMAIN') || safeGetEnv('FIREBASE_AUTH_DOMAIN'),
    projectId: safeGetEnv('VITE_FIREBASE_PROJECT_ID') || safeGetEnv('FIREBASE_PROJECT_ID'),
    storageBucket: safeGetEnv('VITE_FIREBASE_STORAGE_BUCKET') || safeGetEnv('FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: safeGetEnv('VITE_FIREBASE_MESSAGING_SENDER_ID') || safeGetEnv('FIREBASE_MESSAGING_SENDER_ID'),
    appId: safeGetEnv('VITE_FIREBASE_APP_ID') || safeGetEnv('FIREBASE_APP_ID'),
    bootstrapAdminEmail: safeGetEnv('VITE_BOOTSTRAP_ADMIN_EMAIL') || safeGetEnv('BOOTSTRAP_ADMIN_EMAIL')
  };

  if (envConfig.apiKey && envConfig.apiKey !== "YOUR_API_KEY" && envConfig.apiKey !== "") {
    return { ...envConfig, source: 'ENV' };
  }

  const saved = localStorage.getItem('firebase_config');
  if (saved) {
    try {
      return { ...JSON.parse(saved), source: 'LOCAL' };
    } catch (e) {
      console.error("Failed to parse local firebase config", e);
    }
  }
  
  return {
    apiKey: "YOUR_API_KEY",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    bootstrapAdminEmail: "",
    source: 'NONE'
  };
};

const config = getFirebaseConfig();

// Initialize Firebase safely
const app = initializeApp(config.apiKey === "YOUR_API_KEY" ? { ...config, apiKey: "AIza-placeholder" } : config);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const updateFirebaseConfig = (config: any) => {
  localStorage.setItem('firebase_config', JSON.stringify(config));
  window.location.reload(); 
};

export const isFirebaseConfigured = () => {
  const current = getFirebaseConfig();
  return !!(current.apiKey && 
         current.apiKey !== "YOUR_API_KEY" && 
         current.apiKey !== "AIza-placeholder" && 
         current.apiKey !== "");
};
