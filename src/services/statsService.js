import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "./firebase";

export const getUsageMetrics = async (userId) => {
  try {
    const [dailySnap, outfitsSnap, wardrobeSnap] = await Promise.all([
      getDocs(collection(db, "users", userId, "dailyLogs")),
      getDocs(collection(db, "users", userId, "outfits")),
      getDocs(collection(db, "users", userId, "wardrobe")),
    ]);

    const dailyLogs = dailySnap.docs.map((d) => ({ id: d.id, ...d.data() }));
    const outfits = outfitsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
    const wardrobe = wardrobeSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

    // --- Daily activity ---
    const totalDays = dailyLogs.length;
    const lastLogDate = dailyLogs.length
      ? dailyLogs.sort((a, b) => b.date.localeCompare(a.date))[0].date
      : null;

    // Compute streak (optional, can add later)
    const loggedDates = new Set(dailyLogs.map((d) => d.date));
    const today = new Date().toISOString().split("T")[0];
    let streak = 0;
    for (
      let d = new Date(today);
      loggedDates.has(d.toISOString().split("T")[0]);

    ) {
      streak++;
      d.setDate(d.getDate() - 1);
    }

    // --- Outfits ---
    const mostWornOutfits = [...outfits]
      .sort((a, b) => (b.wearCount || 0) - (a.wearCount || 0))
      .slice(0, 5);

    const topRatedOutfits = outfits
      .filter((o) => o.wearCount > 0)
      .map((o) => ({
        ...o,
        averageRating: o.totalRating / o.wearCount,
      }))
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, 5);

    // --- Wardrobe ---
    const mostWornItems = [...wardrobe]
      .sort((a, b) => (b.wearCount || 0) - (a.wearCount || 0))
      .slice(0, 5);

    const leastWornItems = wardrobe
      .filter((i) => (i.wearCount || 0) === 0)
      .slice(0, 5);

    const topRatedItems = wardrobe
      .filter((i) => i.wearCount > 0)
      .map((i) => ({
        ...i,
        averageRating: i.totalRating / i.wearCount,
      }))
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, 5);

    return {
      summary: {
        totalDays,
        lastLogDate,
        streak,
        totalOutfits: outfits.length,
        totalItems: wardrobe.length,
      },
      outfits: {
        mostWornOutfits,
        topRatedOutfits,
      },
      wardrobe: {
        mostWornItems,
        leastWornItems,
        topRatedItems,
      },
      dailyLogs,
    };
  } catch (error) {
    console.error("Error computing metrics:", error);
    return null;
  }
};

/* ----------------- ITEM STATS ----------------- */
export const getItemStats = async (userId, itemId) => {
  const logsRef = collection(db, "users", userId, "dailyLogs");
  const q = query(logsRef, where("items", "array-contains", itemId));
  const snapshot = await getDocs(q);

  const logs = snapshot.docs.map((doc) => doc.data());
  const totalWears = logs.length;
  const totalRating = logs.reduce((sum, log) => sum + (log.rating || 0), 0);
  const averageRating = totalWears ? totalRating / totalWears : 0;
  const occasions = [
    ...new Set(logs.map((log) => log.occasion).filter(Boolean)),
  ];

  return {
    totalWears,
    averageRating: Math.round(averageRating * 10) / 10,
    occasions,
    lastWorn: logs.length ? logs[0].date : null,
  };
};

/* ----------------- OUTFIT STATS ----------------- */
export const getOutfitStats = async (userId, outfitId) => {
  const logsRef = collection(db, "users", userId, "dailyLogs");
  const q = query(logsRef, where("outfitId", "==", outfitId));
  const snapshot = await getDocs(q);

  const logs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  const sorted = logs.sort((a, b) => new Date(b.date) - new Date(a.date));
  const totalWears = logs.length;
  const avgRating =
    logs.length > 0
      ? logs.reduce((sum, log) => sum + (log.rating || 0), 0) / logs.length
      : 0;

  return {
    totalWears,
    averageRating: avgRating,
    lastWorn: sorted[0]?.date || null,
    wearHistory: sorted,
  };
};
