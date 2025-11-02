import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function OutfitsFilterBar({ filterType, setFilterType }) {
  const filters = [
    { type: "all", label: "All", icon: "apps" },
    { type: "favorites", label: "Favorites", icon: "favorite" },
    { type: "recent", label: "Recent", icon: "schedule" },
    { type: "popular", label: "Popular", icon: "trending-up" },
  ];

  return (
    <View style={styles.container}>
      {filters.map((f) => (
        <TouchableOpacity
          key={f.type}
          style={[styles.button, filterType === f.type && styles.activeButton]}
          onPress={() => setFilterType(f.type)}
        >
          <MaterialIcons
            name={f.icon}
            size={16}
            color={filterType === f.type ? "#fff" : "#666"}
          />
          <Text
            style={[styles.text, filterType === f.type && styles.activeText]}
          >
            {f.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", gap: 8, marginBottom: 16, },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  activeButton: { backgroundColor: "#007AFF", borderColor: "#007AFF" },
  text: { fontSize: 12, color: "#666", marginLeft: 4, fontWeight: "500" },
  activeText: { color: "#fff" },
});
