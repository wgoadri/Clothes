// src/services/wardrobeService.js
import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  // getDownloadURL,
} from "firebase/firestore";

/* WARDROBE ITEMS */

// Add new clothing item
export const addWardrobeItem = async (userId, item) => {
  await addDoc(collection(db, "users", userId, "wardrobe"), item);
};

// Fetch all wardrobe items
export const getWardrobeItems = async (userId) => {
  const snapshot = await getDocs(collection(db, "users", userId, "wardrobe"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

/* OUTFITS */

// Create new outfit
export const createOutfit = async (userId, outfit) => {
  await addDoc(collection(db, "users", userId, "outfits"), {
    ...outfit,
    createdAt: new Date(),
  });
};

// Get all outfits
export const getOutfits = async (userId) => {
  const snapshot = await getDocs(collection(db, "users", userId, "outfits"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Delete outfit
export const deleteOutfit = async (userId, outfitId) => {
  const outfitRef = doc(db, "users", userId, "outfits", outfitId);
  await deleteDoc(outfitRef);
};

// Toggle favorite status
export const toggleFavoriteOutfit = async (userId, outfitId, currentStatus) => {
  const outfitRef = doc(db, "users", userId, "outfits", outfitId);
  await updateDoc(outfitRef, { favorite: !currentStatus });
};

import { ref, uploadBytes } from "firebase/storage";

/* OUTFIT USAGE LOGS */

// Add a new outfit usage entry (with optional photo upload)
export const logOutfitUsage = async (
  userId,
  { outfitId, outfitName, items, photoUri }
) => {
  let photoURL = null;

  if (photoUri) {
    const response = await fetch(photoUri);
    const blob = await response.blob();
    const storageRef = ref(
      storage,
      `users/${userId}/outfitLogs/${Date.now()}.jpg`
    );
    await uploadBytes(storageRef, blob);
    photoURL = await getDownloadURL(storageRef);
  }

  await addDoc(collection(db, "users", userId, "outfitLogs"), {
    outfitId,
    outfitName,
    items, // <- store clothing item IDs
    photo: photoURL,
    date: new Date(),
  });
};

// Fetch all outfit logs
export const getOutfitLogs = async (userId) => {
  const snapshot = await getDocs(collection(db, "users", userId, "outfitLogs"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

/**
 * Compute usage stats for outfits and individual wardrobe items
 */
export const getUsageMetrics = async (userId) => {
  // Fetch all outfit logs
  const snapshot = await getDocs(collection(db, "users", userId, "outfitLogs"));
  const logs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  const outfitCountMap = {}; // outfitId -> count
  const itemCountMap = {}; // clothingId -> count

  logs.forEach((log) => {
    // Count outfit usage
    if (log.outfitId) {
      outfitCountMap[log.outfitId] = (outfitCountMap[log.outfitId] || 0) + 1;
    }

    // Count individual item usage
    if (log.items) {
      log.items.forEach((itemId) => {
        itemCountMap[itemId] = (itemCountMap[itemId] || 0) + 1;
      });
    }
  });

  // Convert maps to sorted arrays
  const mostUsedOutfits = Object.entries(outfitCountMap)
    .sort((a, b) => b[1] - a[1])
    .map(([id, count]) => ({ id, count }));

  const mostUsedItems = Object.entries(itemCountMap)
    .sort((a, b) => b[1] - a[1])
    .map(([id, count]) => ({ id, count }));

  return { logs, mostUsedOutfits, mostUsedItems };
};
