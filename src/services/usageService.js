// usageService.js
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  increment,
  serverTimestamp,
  arrayUnion,
  ref,
  uploadBytes,
  getDownloadURL,
  getDoc,
} from "firebase/firestore";
import { db, storage } from "./firebase";

/* ----------------- OUTFIT USAGE LOGS ----------------- */

export const logOutfitUsage = async (
  userId,
  { outfitId, outfitName, items, photoUri }
) => {
  let photoURL = null;

  if (photoUri) {
    try {
      const response = await fetch(photoUri);
      const blob = await response.blob();
      const storageRef = ref(
        storage,
        `users/${userId}/outfitLogs/${Date.now()}.jpg`
      );
      await uploadBytes(storageRef, blob);
      photoURL = await getDownloadURL(storageRef);
    } catch (error) {
      console.warn("Photo upload failed:", error);
    }
  }

  await addDoc(collection(db, "users", userId, "outfitLogs"), {
    outfitId,
    outfitName,
    items,
    photo: photoURL,
    date: new Date().toISOString(),
    timestamp: serverTimestamp(),
  });
};

/* ----------------- FETCH OUTFIT LOGS ----------------- */

// export const getOutfitLogs = async (userId) => {
//   const q = query(
//     collection(db, "users", userId, "outfitLogs"),
//     orderBy("date", "desc")
//   );
//   const snapshot = await getDocs(q);
//   return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// };

/* ----------------- DAILY LOGS ----------------- */

/**
 * Log daily outfit and update outfit + item wear counts.
 * logData must contain: outfitId, (optional) rating, notes, photos
 */
export const logDailyOutfit = async (userId, logData) => {
  const today = new Date().toISOString().split("T")[0];
  const dailyLogRef = collection(db, "users", userId, "dailyLogs");

  try {
    // 1) Create the daily log (minimal fields)
    const logDoc = await addDoc(dailyLogRef, {
      outfitId: logData.outfitId,
      date: today,
      rating: logData.rating || 0,
      notes: logData.notes || "",
      photos: logData.photos || [],
      timestamp: serverTimestamp(),
      createdAt: new Date().toISOString(),
    });

    // 2) Fetch outfit to get its items
    const outfitRef = doc(db, "users", userId, "outfits", logData.outfitId);
    const outfitSnap = await getDoc(outfitRef);

    if (!outfitSnap.exists()) {
      console.warn("Outfit not found:", logData.outfitId);
      return logDoc.id;
    }

    // outfit items can be stored as array of ids, or array of objects with id property
    const outfitData = outfitSnap.data() || {};
    let itemIds = outfitData.items || [];

    // normalize: if items are objects like { id: 'abc' } map to ids
    itemIds = itemIds.map((it) => (typeof it === "string" ? it : it.id || it));

    if (!Array.isArray(itemIds) || itemIds.length === 0) {
      await updateDoc(outfitRef, {
        wearCount: increment(1),
        lastWorn: new Date().toISOString(),
        totalRating: increment(logData.rating || 0),
      });
      return logDoc.id;
    }

    // 3) Increment outfit wearCount
    try {
      await updateDoc(outfitRef, {
        wearCount: increment(1),
        lastWorn: new Date().toISOString(),
        totalRating: increment(logData.rating || 0),
      });
    } catch (err) {
      console.error("Failed to update outfit wearCount:", err);
      // do not throw — continue to try updating items
    }

    // 4) Update all item documents (in parallel)
    const updatePromises = itemIds.map(async (itemId) => {
      try {
        const itemRef = doc(db, "users", userId, "wardrobe", itemId);
        await updateDoc(itemRef, {
          wearCount: increment(1),
          lastWorn: new Date().toISOString(),
          totalRating: increment(logData.rating || 0),
          usageHistory: arrayUnion({
            date: today,
            outfitId: logData.outfitId,
            dailyLogId: logDoc.id,
          }),
        });
        return { itemId, ok: true };
      } catch (err) {
        console.error("Failed to update item:", itemId, err);
        return { itemId, ok: false, error: err };
      }
    });

    const results = await Promise.all(updatePromises);
    const failed = results.filter((r) => !r.ok);
    if (failed.length) {
      console.warn("Some item updates failed:", failed);
    }

    return logDoc.id;
  } catch (error) {
    console.error("Error in logDailyOutfit:", error);
    throw error; // bubble up so callers can show error
  }
};

export const getDailyLogs = async (userId, logLimit = 30) => {
  const logsRef = collection(db, "users", userId, "dailyLogs");
  const q = query(logsRef, orderBy("timestamp", "desc"), limit(logLimit));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const getTodayOutfit = async (userId) => {
  const today = new Date().toISOString().split("T")[0];
  const logsRef = collection(db, "users", userId, "dailyLogs");
  const q = query(logsRef, where("date", "==", today));
  const snapshot = await getDocs(q);

  if (!snapshot.docs.length) return null;
  const dailyLog = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };  
  const outfitRef = doc(db, "users", userId, "outfits", dailyLog.outfitId);
  const outfitSnap = await getDoc(outfitRef);
  
  return {
      ...dailyLog,
      outfit: outfitSnap.exists()
        ? { id: outfitSnap.id, ...outfitSnap.data() }
        : null,
    };
};


export const updateDailyLog = async (userId, logId, updateData) => {
  const logRef = doc(db, "users", userId, "dailyLogs", logId);
  await updateDoc(logRef, {
    ...updateData,
    updatedAt: new Date().toISOString(),
  });
};

/* ----------------- INTERNAL: UPDATE USAGE ----------------- */

export const updateUsageStats = async (userId, itemIds, rating = 0) => {
  const promises = itemIds.map(async (itemId) => {
    const itemRef = doc(db, "users", userId, "wardrobe", itemId);
    await updateDoc(itemRef, {
      wearCount: increment(1),
      lastWorn: new Date().toISOString(),
      totalRating: increment(rating),
      usageHistory: arrayUnion(new Date().toISOString()),
    });
  });

  await Promise.all(promises);
};
