import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";

/* ----------------- OUTFIT CRUD ----------------- */

export const createOutfit = async (userId, outfit) => {
  await addDoc(collection(db, "users", userId, "outfits"), {
    ...outfit,
    createdAt: new Date().toISOString(),
  });
};

export const getOutfits = async (userId) => {
  const snapshot = await getDocs(collection(db, "users", userId, "outfits"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const updateOutfit = async (userId, outfitId, updateData) => {
  const outfitRef = doc(db, "users", userId, "outfits", outfitId);
  await updateDoc(outfitRef, {
    ...updateData,
    updatedAt: new Date().toISOString(),
  });
};

export const deleteOutfit = async (userId, outfitId) => {
  const outfitRef = doc(db, "users", userId, "outfits", outfitId);
  await deleteDoc(outfitRef);
};

/* ----------------- FAVORITE TOGGLE ----------------- */

export const toggleOutfitFavorite = async (userId, outfitId, favorite) => {
  const outfitRef = doc(db, "users", userId, "outfits", outfitId);
  await updateDoc(outfitRef, { favorite });
};
