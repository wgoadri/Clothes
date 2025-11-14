import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { auth } from "../services/firebase";
import { getWardrobeItems } from "../services/wardrobeService";
import { getOutfits } from "../services/outfitService";
import { getTodayOutfit } from "../services/usageService";
import { getUsageMetrics } from "../services/statsService";
import ScreenLayout from "../components/ScreenLayout";

export default function HomeScreen({ navigation }) {
  const [metrics, setMetrics] = useState(null);
  const [wardrobe, setWardrobe] = useState([]);
  const [outfits, setOutfits] = useState([]);
  const [todayOutfit, setTodayOutfit] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const userId = auth.currentUser?.uid;

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

    const topOutfits = outfitsData
      .sort((a, b) => (b.wearCount || 0) - (a.wearCount || 0))
      .slice(0, 5)
      .map((o) => ({
        name: o.name,
        count: o.wearCount || 0,
      }));

    const topItems = wardrobeData
      .sort((a, b) => (b.wearCount || 0) - (a.wearCount || 0))
      .slice(0, 5)
      .map((i) => ({ name: i.name, count: i.wearCount || 0 }));

    setMetrics({
      topOutfits,
      topItems,
      totalDays: usageData.summary.totalDays,
      lastLogDate: usageData.summary.lastLogDate,
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, []);

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
          <Text style={styles.todayOutfitName}>{todayOutfit.outfit.name}</Text>
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
    <ScreenLayout
      navigation={navigation}
      title="My Closet"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Remove ScrollView - just put content directly */}

      {/* Header Summary */}
      <View style={styles.headerSummary}>
        <Text style={styles.headerTitle}>👋 Welcome back!</Text>
        <Text style={styles.headerSubtitle}>
          {todayOutfit
            ? `You've logged today's outfit: ${todayOutfit.outfit.name}`
            : "You haven't logged your outfit yet today."}
        </Text>
      </View>

      {/* Today's Outfit Widget */}
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
          <Text style={styles.statNumber}>{metrics.totalDays || 0}</Text>
          <Text style={styles.statLabel}>Days Logged</Text>
        </View>
      </View>

      <Text style={styles.lastLogText}>
        Last logged on {metrics.lastLogDate}
      </Text>

      {/* Highlights */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🌟 Highlights</Text>
        <View style={styles.highlightCards}>
          <View style={styles.highlightCard}>
            <Text style={styles.highlightLabel}>Most worn item</Text>
            <Text style={styles.highlightValue}>
              {metrics.topItems?.[0]?.name || "No data"}
            </Text>
          </View>
          <View style={styles.highlightCard}>
            <Text style={styles.highlightLabel}>Favorite outfit</Text>
            <Text style={styles.highlightValue}>
              {outfits.find((o) => o.favorite)?.name || "None yet"}
            </Text>
          </View>
        </View>
      </View>

      {/* Wardrobe Preview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>👕 Wardrobe Preview</Text>
        <FlatList
          horizontal
          data={wardrobe.slice(0, 10)}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.previewCard}>
              {item.image ? (
                <Image
                  source={{ uri: item.image }}
                  style={styles.previewImage}
                />
              ) : (
                <View style={styles.previewPlaceholder}>
                  <Text style={styles.previewText}>{item.name}</Text>
                </View>
              )}
            </View>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* Usage Insights */}
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
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  loading: { textAlign: "center", marginTop: 50 },
  headerSummary: { marginBottom: 16 },
  headerTitle: { fontSize: 20, fontWeight: "700", marginBottom: 4 },
  headerSubtitle: { fontSize: 14, color: "#555" },
  todayWidget: {
    backgroundColor: "#E8F0FE",
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  todayWidgetEmpty: {
    backgroundColor: "#F1F3F6",
    padding: 20,
    alignItems: "center",
    borderRadius: 16,
    marginBottom: 20,
  },
  todayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  todayTitle: { fontWeight: "600", fontSize: 16 },
  todayOutfitName: { fontSize: 18, fontWeight: "700", marginBottom: 4 },
  todayRating: { flexDirection: "row", marginBottom: 4 },
  star: { fontSize: 18 },
  todayNotes: { fontStyle: "italic", color: "#444" },
  todayEmptyTitle: { fontSize: 16, fontWeight: "600", marginTop: 8 },
  todayEmptySubtitle: { fontSize: 13, color: "#666" },
  quickStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
    flex: 1,
    alignItems: "center",
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "700",
    color: "#007AFF",
  },
  statLabel: {
    fontSize: 13,
    color: "#555",
  },
  lastLogText: {
    textAlign: "center",
    color: "#777",
    fontSize: 13,
    marginBottom: 10,
  },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  subsectionTitle: { fontSize: 15, fontWeight: "600", marginTop: 12 },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderColor: "#ddd",
  },
  itemName: { fontSize: 14 },
  itemCount: { fontSize: 14, color: "#333" },
  empty: { color: "#888", fontStyle: "italic" },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 40,
  },
  highlightCards: { flexDirection: "row", gap: 12 },
  highlightCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  highlightLabel: { fontSize: 13, color: "#666" },
  highlightValue: { fontSize: 16, fontWeight: "700", color: "#007AFF" },
  previewCard: {
    width: 100,
    height: 100,
    borderRadius: 16,
    marginRight: 10,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  previewImage: { width: "100%", height: "100%" },
  previewPlaceholder: { padding: 8 },
  previewText: { fontSize: 12, textAlign: "center", color: "#333" },
});
