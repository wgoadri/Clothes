import { db, storage } from "./firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

export const addWardrobeItem = async (userId, item) => {
  await addDoc(collection(db, "users", userId, "wardrobe"), item);
};

export const getWardrobeItems = async (userId) => {
  const snapshot = await getDocs(collection(db, "users", userId, "wardrobe"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
