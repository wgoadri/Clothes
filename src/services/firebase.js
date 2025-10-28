import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAnBo-irnmA30OvYCuQ7oV6FBfGfO8HMlU",
  authDomain: "closet-app-df6be.firebaseapp.com",
  projectId: "closet-app-df6be",
  storageBucket: "closet-app-df6be.firebasestorage.app",
  messagingSenderId: "297287821159",
  appId: "1:297287821159:web:b272230285664fa2b3b1c2",
  measurementId: "G-QKD28PDYLE",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
// export const storage = getStorage(app);
