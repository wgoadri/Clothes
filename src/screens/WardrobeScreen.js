import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useWardrobe } from "../context/WardrobeContext";

export default function WardrobeScreen() {
  const { clothes } = useWardrobe();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧥 Your Wardrobe</Text>
      {clothes.length === 0 ? (
        <Text style={styles.emptyText}>
          No clothes added yet. Add your first piece!
        </Text>
      ) : (
        <FlatList
          data={clothes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.itemCard}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemCategory}>{item.category}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  emptyText: { fontSize: 16, color: "#999" },
  itemCard: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    marginVertical: 6,
    borderRadius: 10,
  },
  itemName: { fontSize: 16, fontWeight: "600" },
  itemCategory: { fontSize: 14, color: "#555" },
});
