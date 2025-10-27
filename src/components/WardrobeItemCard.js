import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

export default function WardrobeItemCard({ item }) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: item.imageURL }} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.category}>{item.category}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 5,
    alignItems: "center",
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
  },
  image: { width: 100, height: 100, borderRadius: 8 },
  name: { marginTop: 5, fontWeight: "bold" },
  category: { color: "gray" },
});
