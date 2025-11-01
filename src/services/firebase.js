import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Optional, if you plan to use image uploads

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAnBo-irnmA30OvYCuQ7oV6FBfGfO8HMlU",
  authDomain: "closet-app-df6be.firebaseapp.com",
  projectId: "closet-app-df6be",
  storageBucket: "closet-app-df6be.firebasestorage.app",
  messagingSenderId: "297287821159",
  appId: "1:297287821159:web:b272230285664fa2b3b1c2",
  measurementId: "G-QKD28PDYLE",
};

// Initialize the app
const app = initializeApp(firebaseConfig);

// Use persistent Auth for React Native
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// Firestore
export const db = getFirestore(app);

// Optional: Firebase Storage for image uploads
// export const storage = getStorage(app);
