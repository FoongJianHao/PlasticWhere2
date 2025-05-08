// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCla7gYr0TU4W6FjrXrqoP0cuWQDjGIOVk",
  authDomain: "plasticwhere-e55a0.firebaseapp.com",
  projectId: "plasticwhere-e55a0",
  storageBucket: "plasticwhere-e55a0.firebasestorage.app",
  messagingSenderId: "142116929131",
  appId: "1:142116929131:web:7e8552652379eb31b1bb2e",
  measurementId: "G-ZHYFYGWBP2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);