import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDiw0Sx2IQsZaz2RznrMN9pnRyz_7anjhM",
  authDomain: "verificacao-lunar.firebaseapp.com",
  projectId: "verificacao-lunar",
  storageBucket: "verificacao-lunar.firebasestorage.app",
  messagingSenderId: "465236743868",
  appId: "1:465236743868:web:26ae3b447b1d26e41822b9",
  measurementId: "G-V5LB0PVFC4"
};

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);