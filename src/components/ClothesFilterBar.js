import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { CLOTHES_CATEGORIES } from "../constants/categories";

export default function ClothesFilterBar({ category, setCategoryFilter }) {
  const filters = CLOTHES_CATEGORIES;
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
    >
      <TouchableOpacity
        key={"all"}
        style={[styles.button, category === "All" && styles.activeButton]}
        onPress={() => setCategoryFilter("All")}
      >
        <Text style={[styles.text, category === "All" && styles.activeText]}>
          {"All"}
        </Text>
      </TouchableOpacity>
      {filters.map((f) => (
        <TouchableOpacity
          key={f.id}
          style={[styles.button, category === f.name && styles.activeButton]}
          onPress={() => setCategoryFilter(f.name)}
        >
          <Text style={[styles.text, category === f.name && styles.activeText]}>
            {f.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", gap: 8, marginBottom: 16 },
  button: {
    backgroundColor: "#f8f9fa",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  activeButton: { backgroundColor: "#007AFF", borderColor: "#007AFF" },
  text: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  activeText: { color: "#fff" },
});
