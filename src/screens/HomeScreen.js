import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { auth } from "../services/firebase";
import {
  getUsageMetrics,
  getWardrobeItems,
  getOutfits,
} from "../services/wardrobeService";
import BottomBar from "../components/BottomBar";

export default function HomeScreen({ navigation }) {
  const [metrics, setMetrics] = useState(null);
  const [wardrobe, setWardrobe] = useState([]);
  const [outfits, setOutfits] = useState([]);
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    const fetchData = async () => {
      const [wardrobeData, outfitsData, usageData] = await Promise.all([
        getWardrobeItems(userId),
        getOutfits(userId),
        getUsageMetrics(userId),
      ]);

      setWardrobe(wardrobeData);
      setOutfits(outfitsData);

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
      <ScrollView style={styles.scrollContainer}>
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

      {/* Bottom Bar */}
      <BottomBar navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContainer: { flex: 1, padding: 16 },
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

  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 12,
    backgroundColor: "#f8f8f8",
    elevation: 10,
  },
  iconButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  addButton: {
    position: "absolute",
    bottom: 25,
    alignSelf: "center",
    backgroundColor: "#007AFF",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});
