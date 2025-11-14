// src/components/outfit-creator/SelectedItemsPreview.js

import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function SelectedItemsPreview({ items, allItems, onRemove }) {
  const selectedItemsData = allItems.filter((item) => items.includes(item.id));

  if (selectedItemsData.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="style" size={32} color="#A89888" />
        <Text style={styles.emptyText}>No items selected yet</Text>
        <Text style={styles.emptySubtext}>Tap items below to add them</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selected Items ({items.length})</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        {selectedItemsData.map((item) => (
          <View key={item.id} style={styles.itemPreview}>
            {item.image ? (
              <Image source={{ uri: item.image }} style={styles.itemImage} />
            ) : (
              <View style={styles.itemImagePlaceholder}>
                <MaterialIcons name="checkroom" size={20} color="#A89888" />
              </View>
            )}
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => onRemove(item.id)}
            >
              <MaterialIcons name="close" size={14} color="#fff" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B5B4D",
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  scroll: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingRight: 16,
  },
  itemPreview: {
    position: "relative",
    marginRight: 8,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#F5EDE5",
  },
  itemImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#F5EDE5",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E8DED2",
  },
  removeButton: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#D97757",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  emptyContainer: {
    alignItems: "center",
    padding: 32,
    backgroundColor: "#F5EDE5",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E8DED2",
    borderStyle: "dashed",
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 14,
    color: "#8B7355",
    marginTop: 8,
    fontWeight: "500",
  },
  emptySubtext: {
    fontSize: 12,
    color: "#A89888",
    marginTop: 4,
  },
});
