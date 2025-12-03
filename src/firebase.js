import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC9VB4EhQEtnPkbiOAzY9jwWrzf9_zqfDo",
  authDomain: "smart-door-lock-53b93.firebaseapp.com",
  projectId: "smart-door-lock-53b93",
  storageBucket: "smart-door-lock-53b93.firebasestorage.app",
  messagingSenderId: "1061062703770",
  appId: "1:1061062703770:web:6e7bfe90e1753547a13d23"
};

const app = initializeApp(firebaseConfig);

// ✅ These two lines MUST exist
export const auth = getAuth(app);
export const db = getFirestore(app);
