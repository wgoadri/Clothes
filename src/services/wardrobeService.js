// wardrobeService.js
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

/* ----------------- WARDROBE CRUD ----------------- */

// Add new clothing item
export const addWardrobeItem = async (userId, item) => {
  await addDoc(collection(db, "users", userId, "wardrobe"), {
    ...item,
    createdAt: new Date().toISOString(),
  });
};

// Fetch all wardrobe items
export const getWardrobeItems = async (userId) => {
  const snapshot = await getDocs(collection(db, "users", userId, "wardrobe"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Update wardrobe item
export const updateWardrobeItem = async (userId, itemId, updateData) => {
  const itemRef = doc(db, "users", userId, "wardrobe", itemId);
  await updateDoc(itemRef, {
    ...updateData,
    updatedAt: new Date().toISOString(),
  });
};

// Delete wardrobe item
export const deleteWardrobeItem = async (userId, itemId) => {
  const itemRef = doc(db, "users", userId, "wardrobe", itemId);
  await deleteDoc(itemRef);
};

/* ----------------- MARK ITEM AS WORN ----------------- */
export const markItemAsWorn = async (userId, itemId, rating = 0) => {
  try {
    const itemRef = doc(db, "users", userId, "wardrobe", itemId);
    await updateDoc(itemRef, {
      wearCount: increment(1),
      lastWorn: new Date().toISOString(),
      totalRating: increment(rating),
    });

    // Add item usage log
    await addDoc(collection(db, "users", userId, "itemLogs"), {
      itemId,
      date: new Date().toISOString().split("T")[0],
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error marking item as worn:", error);
  }
};
