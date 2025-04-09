// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAhNNR-blJdSxpfU_VQBPULrzSgMgGINTM",
  authDomain: "cuidarmais-c7556.firebaseapp.com",
  projectId: "cuidarmais-c7556",
  storageBucket: "cuidarmais-c7556.firebasestorage.app",
  messagingSenderId: "74621327254",
  appId: "1:74621327254:web:a609962ff027137e6dafb7",
  measurementId: "G-BSFZEENHLL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)