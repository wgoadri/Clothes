import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useWardrobe } from "../context/WardrobeContext";

export default function HomeScreen({ navigation }) {
  const { stats } = useWardrobe();

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

  return (
    <View style={styles.container}>
      <Text style={styles.header}>👗 Closet Dashboard</Text>

      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Your Wardrobe Summary</Text>
        <View style={styles.statsRow}>
          <View style={{ marginBottom: 5 }}>
            <Text style={styles.statsText}>
              👕 Total Items: {stats.totalItems}
            </Text>
          </View>
          <View style={{ marginBottom: 5 }}>
            <Text style={styles.statsText}>🔥 Most Worn: {stats.mostWorn}</Text>
          </View>
          <View>
            <Text style={styles.statsText}>
              🧣 Least Worn: {stats.leastWorn}
            </Text>
          </View>
        </View>
      </View>

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
