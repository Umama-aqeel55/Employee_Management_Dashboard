import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase credentials provided by the user
const firebaseConfig = {
  apiKey: "AIzaSyDr76JpgFR5bb4YWCLW2DydT1zX5alBVhU",
  authDomain: "employee-dashboard-f2a47.firebaseapp.com",
  projectId: "employee-dashboard-f2a47",
  storageBucket: "employee-dashboard-f2a47.firebasestorage.app",
  messagingSenderId: "1097132410895",
  appId: "1:1097132410895:web:24e50af430bfaa3659fb7a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
