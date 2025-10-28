import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

export default function WardrobeItemCard({ item }) {
  return (
    <View style={styles.card}>
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.image} />
      )}
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.category}>{item.category}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    marginVertical: 6,
    borderRadius: 10,
  },
  name: { fontSize: 16, fontWeight: "600" },
  category: { fontSize: 14, color: "#555" },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
  },
});
