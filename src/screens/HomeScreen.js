import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
} from "react-native";
import { auth } from "../services/firebase";
import { Ionicons } from "@expo/vector-icons";
import {
  getUsageMetrics,
  getWardrobeItems,
  getOutfits,
} from "../services/wardrobeService";

export default function HomeScreen({ navigation }) {
  const [metrics, setMetrics] = useState(null);
  const [wardrobe, setWardrobe] = useState([]);
  const [outfits, setOutfits] = useState([]);
  const userId = auth.currentUser?.uid;

  const quickActions = [
    {
      id: "1",
      label: "Add Clothes",
      icon: "camera-outline",
      screen: "AddClothes",
    },
    { id: "2", label: "Wardrobe", icon: "shirt-outline", screen: "Wardrobe" },
    {
      id: "3",
      label: "Track Usage",
      icon: "calendar-outline",
      screen: "TrackUsage",
    },
    { id: "4", label: "Outfits", icon: "star-outline", screen: "Outfits" },
  ];

  const renderAction = ({ item }) => (
    <TouchableOpacity
      style={styles.actionCard}
      onPress={() => navigation.navigate(item.screen)}
    >
      <Ionicons name={item.icon} size={28} color="#333" />
      <Text style={styles.actionLabel}>{item.label}</Text>
    </TouchableOpacity>
  );

  useEffect(() => {
    const fetchData = async () => {
      const [wardrobeData, outfitsData, usageData] = await Promise.all([
        getWardrobeItems(userId),
        getOutfits(userId),
        getUsageMetrics(userId),
      ]);

      setWardrobe(wardrobeData);
      setOutfits(outfitsData);

      // Map IDs to names for display
      const outfitMap = Object.fromEntries(
        outfitsData.map((o) => [o.id, o.name])
      );
      const itemMap = Object.fromEntries(
        wardrobeData.map((i) => [i.id, i.name])
      );

      const topOutfits = usageData.mostUsedOutfits.map((o) => ({
        name: outfitMap[o.id] || "Unknown",
        count: o.count,
      }));

      const topItems = usageData.mostUsedItems.map((i) => ({
        name: itemMap[i.id] || "Unknown",
        count: i.count,
      }));

      setMetrics({ topOutfits, topItems });
    };

    fetchData();
  }, []);

  if (!metrics) return <Text style={styles.loading}>Loading metrics...</Text>;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>📊 Usage Metrics</Text>

        <Text style={styles.sectionTitle}>Most Worn Outfits</Text>
        {metrics.topOutfits.length === 0 ? (
          <Text style={styles.empty}>No outfit logs yet.</Text>
        ) : (
          metrics.topOutfits.slice(0, 5).map((o, idx) => (
            <Text key={idx} style={styles.item}>
              {o.name} — {o.count} times
            </Text>
          ))
        )}

        <Text style={styles.sectionTitle}>Most Worn Clothes</Text>
        {metrics.topItems.length === 0 ? (
          <Text style={styles.empty}>No wardrobe usage yet.</Text>
        ) : (
          metrics.topItems.slice(0, 5).map((i, idx) => (
            <Text key={idx} style={styles.item}>
              {i.name} — {i.count} times
            </Text>
          ))
        )}
      </ScrollView>
      <Text style={styles.subHeader}>Quick Actions</Text>
      <FlatList
        data={quickActions}
        renderItem={renderAction}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.actionsContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 8,
  },
  item: { fontSize: 16, marginBottom: 4 },
  empty: { fontSize: 14, color: "#777", fontStyle: "italic" },
  loading: { fontSize: 16, textAlign: "center", marginTop: 50 },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
  },
  statsContainer: {
    backgroundColor: "#f2f2f2",
    padding: 16,
    borderRadius: 12,
    marginVertical: 10,
  },
  statsTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 8 },
  statsRow: { flexDirection: "column", justifyContent: "flex-start" },
  statsText: { fontSize: 14 },
  actionsContainer: { alignItems: "center", justifyContent: "center" },
  actionCard: {
    backgroundColor: "#fafafa",
    borderRadius: 12,
    padding: 20,
    margin: 10,
    width: 140,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },
  actionLabel: { marginTop: 8, fontWeight: "600" },
});
