import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
  Image,
} from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { auth } from "../services/firebase";
import {
  getUsageMetrics,
  getWardrobeItems,
  getOutfits,
  getTodayOutfit,
} from "../services/wardrobeService";
import BottomBar from "../components/BottomBar";

export default function HomeScreen({ navigation }) {
  const [metrics, setMetrics] = useState(null);
  const [wardrobe, setWardrobe] = useState([]);
  const [outfits, setOutfits] = useState([]);
  const [todayOutfit, setTodayOutfit] = useState(null);
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [wardrobeData, outfitsData, usageData, todayData] = await Promise.all(
      [
        getWardrobeItems(userId),
        getOutfits(userId),
        getUsageMetrics(userId),
        getTodayOutfit(userId),
      ]
    );

    setWardrobe(wardrobeData);
    setOutfits(outfitsData);
    setTodayOutfit(todayData);

    const outfitMap = Object.fromEntries(
      outfitsData.map((o) => [o.id, o.name])
    );
    const itemMap = Object.fromEntries(wardrobeData.map((i) => [i.id, i.name]));

    const topOutfits = usageData.mostUsedOutfits.map((o) => ({
      name: outfitMap[o.id] || "Unknown",
      count: o.count,
    }));

    const topItems = usageData.mostUsedItems.map((i) => ({
      name: itemMap[i.id] || "Unknown",
      count: i.count,
    }));

    setMetrics({
      topOutfits,
      topItems,
      totalLogs: usageData.totalLogs,
      lastLogDate: usageData.lastLogDate,
    });
  };

  // Composant pour le widget "Today's Outfit"
  const TodayOutfitWidget = () => {
    if (todayOutfit) {
      return (
        <TouchableOpacity
          style={styles.todayWidget}
          onPress={() => navigation.navigate("DailyOutfitLogger")}
        >
          <View style={styles.todayHeader}>
            <Text style={styles.todayTitle}>📅 Today's Outfit</Text>
            <MaterialIcons name="edit" size={20} color="#007AFF" />
          </View>
          <Text style={styles.todayOutfitName}>{todayOutfit.outfitName}</Text>
          {todayOutfit.rating > 0 && (
            <View style={styles.todayRating}>
              {[...Array(5)].map((_, i) => (
                <Text key={i} style={styles.star}>
                  {i < todayOutfit.rating ? "⭐" : "☆"}
                </Text>
              ))}
            </View>
          )}
          {todayOutfit.notes && (
            <Text style={styles.todayNotes} numberOfLines={2}>
              "{todayOutfit.notes}"
            </Text>
          )}
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={styles.todayWidgetEmpty}
        onPress={() => navigation.navigate("DailyOutfitLogger")}
      >
        <MaterialIcons name="checkroom" size={32} color="#007AFF" />
        <Text style={styles.todayEmptyTitle}>What are you wearing today?</Text>
        <Text style={styles.todayEmptySubtitle}>Tap to log your outfit</Text>
      </TouchableOpacity>
    );
  };

  if (!metrics) return <Text style={styles.loading}>Loading metrics...</Text>;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.title}>My Closet</Text>

        {/* Widget Today's Outfit */}
        <TodayOutfitWidget />

        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{wardrobe.length}</Text>
            <Text style={styles.statLabel}>Items</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{outfits.length}</Text>
            <Text style={styles.statLabel}>Outfits</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{metrics.totalLogs}</Text>
            <Text style={styles.statLabel}>Logs</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>📊 Usage Insights</Text>

        <Text style={styles.subsectionTitle}>Most Worn Outfits</Text>
        {metrics.topOutfits.length === 0 ? (
          <Text style={styles.empty}>No outfit logs yet.</Text>
        ) : (
          metrics.topOutfits.slice(0, 5).map((o, idx) => (
            <View key={idx} style={styles.itemRow}>
              <Text style={styles.itemName}>{o.name}</Text>
              <Text style={styles.itemCount}>{o.count} times</Text>
            </View>
          ))
        )}

        <Text style={styles.subsectionTitle}>Most Worn Clothes</Text>
        {metrics.topItems.length === 0 ? (
          <Text style={styles.empty}>No wardrobe usage yet.</Text>
        ) : (
          metrics.topItems.slice(0, 5).map((i, idx) => (
            <View key={idx} style={styles.itemRow}>
              <Text style={styles.itemName}>{i.name}</Text>
              <Text style={styles.itemCount}>{i.count} times</Text>
            </View>
          ))
        )}

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>⚡ Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("AddClothes")}
          >
            <MaterialIcons name="add" size={24} color="#007AFF" />
            <Text style={styles.actionText}>Add Item</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("OutfitCreator")}
          >
            <MaterialCommunityIcons
              name="tshirt-crew"
              size={24}
              color="#007AFF"
            />
            <Text style={styles.actionText}>Create Outfit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("TrackUsage")}
          >
            <MaterialIcons name="analytics" size={24} color="#007AFF" />
            <Text style={styles.actionText}>View Stats</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <BottomBar navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContainer: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },

  // Today's Outfit Widget
  todayWidget: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
  },
  todayWidgetEmpty: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
    borderStyle: "dashed",
    borderWidth: 2,
    borderColor: "#007AFF",
  },
  todayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  todayTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  todayOutfitName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 8,
  },
  todayRating: {
    flexDirection: "row",
    marginBottom: 8,
  },
  star: {
    fontSize: 16,
    marginRight: 2,
  },
  todayNotes: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
  todayEmptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 8,
    color: "#007AFF",
  },
  todayEmptySubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },

  // Quick Stats
  quickStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007AFF",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },

  // Sections
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 12,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 12,
    marginBottom: 8,
    color: "#333",
  },

  // Items
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 6,
    marginBottom: 4,
  },
  itemName: {
    fontSize: 14,
    flex: 1,
  },
  itemCount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007AFF",
  },
  empty: {
    fontSize: 14,
    color: "#777",
    fontStyle: "italic",
    textAlign: "center",
    padding: 16,
  },

  // Quick Actions
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
  },
  actionText: {
    fontSize: 12,
    color: "#007AFF",
    marginTop: 4,
    fontWeight: "500",
  },

  loading: { fontSize: 16, textAlign: "center", marginTop: 50 },
});
