import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

export default function WardrobeItemCard({ item }) {
  const wearCount = item.wearCount || 0;
  const lastWorn = item.lastWorn ? new Date(item.lastWorn).toLocaleDateString() : "Never";
  
  return (
    <View style={styles.card}>
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.image} />
      )}
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.category}>{item.category}</Text>
        
        {/* Usages */}
        <View style={styles.usageStats}>
          <Text style={styles.usageText}>Worn {wearCount} times</Text>
          <Text style={styles.lastWornText}>Last: {lastWorn}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    marginVertical: 6,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: { 
    fontSize: 16, 
    fontWeight: "600",
    marginBottom: 4,
  },
  category: { 
    fontSize: 14, 
    color: "#555",
    marginBottom: 8,
  },
  usageStats: {
    marginTop: 4,
  },
  usageText: {
    fontSize: 12,
    color: "#007AFF",
    fontWeight: "500",
  },
  lastWornText: {
    fontSize: 11,
    color: "#999",
    marginTop: 2,
  },
});
