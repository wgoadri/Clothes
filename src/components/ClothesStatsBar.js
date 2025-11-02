import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ClothesStatsBar({ total, favorites, worn }) {
  const stats = [
    { label: "Total", value: total },
    { label: "Favorites", value: favorites },
    { label: "Worn", value: worn },
  ];

  return (
    <View style={styles.container}>
      {stats.map((stat) => (
        <View key={stat.label} style={styles.statItem}>
          <Text style={styles.statNumber}>{stat.value}</Text>
          <Text style={styles.statLabel}>{stat.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  statItem: { alignItems: "center" },
  statNumber: { fontSize: 24, fontWeight: "bold", color: "#007AFF" },
  statLabel: { fontSize: 12, color: "#666", marginTop: 4 },
});
