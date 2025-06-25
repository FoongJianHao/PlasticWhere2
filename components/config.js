import firebase from '@react-native-firebase/app';
import '@react-native-firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCla7gYr0TU4W6FjrXrqoP0cuWQDjGIOVk",
  authDomain: "plasticwhere-e55a0.firebaseapp.com",
  projectId: "plasticwhere-e55a0",
  storageBucket: "plasticwhere-e55a0.firebasestorage.app",
  messagingSenderId: "142116929131",
  appId: "1:142116929131:web:7e8552652379eb31b1bb2e",
  measurementId: "G-ZHYFYGWBP2"
};

// Initialize Firebase app if not already initialized
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Export the storage instance
export const storage = firebase.storage(firebaseConfig);