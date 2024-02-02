// src/firebase-config.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: "qwikresume-30e2f.firebaseapp.com",
    projectId: "qwikresume-30e2f",
    storageBucket: "qwikresume-30e2f.appspot.com",
    messagingSenderId: "934072231575",
    appId: "1:934072231575:web:bad76eaaefb39ccf40ebd2"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
