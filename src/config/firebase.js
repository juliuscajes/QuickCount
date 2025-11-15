// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAI5TYEqpaWh1on5PtqFaxMyygceYSsnTU",
  authDomain: "quickcount1-77b62.firebaseapp.com",
  databaseURL: "https://quickcount1-77b62-default-rtdb.firebaseio.com",
  projectId: "quickcount1-77b62",
  storageBucket: "quickcount1-77b62.firebasestorage.app",
  messagingSenderId: "618485523164",
  appId: "1:618485523164:web:85292d054cec1a58688a19",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Firebase Realtime Database
export const db = getDatabase(app);

export default app;
