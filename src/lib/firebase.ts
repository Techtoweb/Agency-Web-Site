// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore, doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDxkKD1CUdjjudJqUsy_slHeAztiaUHnX8",
  authDomain: "agency-web-site.firebaseapp.com",
  projectId: "agency-web-site",
  storageBucket: "agency-web-site.firebasestorage.app",
  messagingSenderId: "708647496953",
  appId: "1:708647496953:web:d6520273af6a306fe20628",
  measurementId: "G-S0SYNKPWCQ"
};

// Initialize Firebase App
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

// Initialize Analytics conditionally
export let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== "undefined") {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch(() => {
      // Gracefully handle iframe or restricted cookie environments
    });
}
