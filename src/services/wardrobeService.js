import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  increment,
  serverTimestamp,
  query,
  where,
  orderBy
} from "firebase/firestore";
import { db } from "./firebase";
import { ref, uploadBytes } from "firebase/storage";

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

// Toggle favorite status
export const toggleFavoriteOutfit = async (userId, outfitId, currentStatus) => {
  const outfitRef = doc(db, "users", userId, "outfits", outfitId);
  await updateDoc(outfitRef, { favorite: !currentStatus });
};

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

// Log daily outfit
export const logDailyOutfit = async (userId, logData) => {
  try {
    const dailyLogRef = collection(db, "users", userId, "dailyLogs");
    
    const logDoc = await addDoc(dailyLogRef, {
      ...logData,
      timestamp: serverTimestamp(),
      createdAt: new Date().toISOString()
    });

    if (logData.items && logData.items.length > 0) {
      await updateUsageStats(userId, logData.items, logData.rating);
    }

    return logDoc.id;
  } catch (error) {
    console.error("Error logging daily outfit:", error);
    throw error;
  }
};

// Update clothes stats
const updateUsageStats = async (userId, itemIds, rating) => {
  try {
    const promises = itemIds.map(async (itemId) => {
      const itemRef = doc(db, "users", userId, "wardrobe", itemId);
      
      await updateDoc(itemRef, {
        wearCount: increment(1),
        lastWorn: new Date().toISOString(),
        totalRating: increment(rating || 0),
        usageHistory: increment(1)
      });
    });

    await Promise.all(promises);
  } catch (error) {
    console.error("Error updating usage stats:", error);
  }
};

export const getDailyLogs = async (userId, limit = 30) => {
  try {
    const logsRef = collection(db, "users", userId, "dailyLogs");
    const q = query(logsRef, orderBy("timestamp", "desc"));
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching daily logs:", error);
    return [];
  }
};

export const getTodayOutfit = async (userId) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const logsRef = collection(db, "users", userId, "dailyLogs");
    const q = query(logsRef, where("date", "==", today));
    
    const snapshot = await getDocs(q);
    return snapshot.docs.length > 0 ? {
      id: snapshot.docs[0].id,
      ...snapshot.docs[0].data()
    } : null;
  } catch (error) {
    console.error("Error checking today's outfit:", error);
    return null;
  }
};


export const deleteOutfit = async (userId, outfitId) => {
  try {
    const outfitRef = doc(db, "users", userId, "outfits", outfitId);
    await deleteDoc(outfitRef);
  } catch (error) {
    console.error("Error deleting outfit:", error);
    throw error;
  }
};

export const toggleOutfitFavorite = async (userId, outfitId, favorite) => {
  try {
    const outfitRef = doc(db, "users", userId, "outfits", outfitId);
    await updateDoc(outfitRef, { favorite });
  } catch (error) {
    console.error("Error toggling outfit favorite:", error);
    throw error;
  }
};

export const updateDailyLog = async (userId, logId, updateData) => {
  try {
    const logRef = doc(db, "users", userId, "dailyLogs", logId);
    await updateDoc(logRef, {
      ...updateData,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error updating daily log:", error);
    throw error;
  }
};

export const getItemStats = async (userId, itemId) => {
  try {
    const logsRef = collection(db, "users", userId, "dailyLogs");
    const q = query(logsRef, where("items", "array-contains", itemId));
    
    const snapshot = await getDocs(q);
    const logs = snapshot.docs.map(doc => doc.data());
    
    const totalWears = logs.length;
    const totalRating = logs.reduce((sum, log) => sum + (log.rating || 0), 0);
    const averageRating = totalWears > 0 ? totalRating / totalWears : 0;
    
    const occasions = [...new Set(logs.map(log => log.occasion).filter(Boolean))];
    
    return {
      totalWears,
      averageRating: Math.round(averageRating * 10) / 10,
      occasions,
      lastWorn: logs.length > 0 ? logs[0].date : null
    };
  } catch (error) {
    console.error("Error getting item stats:", error);
    return { totalWears: 0, averageRating: 0, occasions: [], lastWorn: null };
  }
};

export const updateWardrobeItem = async (userId, itemId, updateData) => {
  try {
    const itemRef = doc(db, "users", userId, "wardrobe", itemId);
    await updateDoc(itemRef, {
      ...updateData,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error updating wardrobe item:", error);
    throw error;
  }
};

export const deleteWardrobeItem = async (userId, itemId) => {
  try {
    const itemRef = doc(db, "users", userId, "wardrobe", itemId);
    await deleteDoc(itemRef);
  } catch (error) {
    console.error("Error deleting wardrobe item:", error);
    throw error;
  }
};
