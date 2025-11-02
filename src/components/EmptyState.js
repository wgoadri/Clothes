import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function EmptyState({ searchQuery, onCreate }) {
  const hasSearch = searchQuery && searchQuery.length > 0;

  return (
    <View style={styles.container}>
      <MaterialIcons name="style" size={64} color="#ccc" />
      <Text style={styles.title}>
        {hasSearch ? "No items found" : "No items yet"}
      </Text>
      <Text style={styles.subtitle}>
        {hasSearch
          ? `No items match "${searchQuery}"`
          : "Create your first item to get started!"}
      </Text>
      {!hasSearch && (
        <TouchableOpacity style={styles.button} onPress={onCreate}>
          <MaterialIcons name="add" size={20} color="#fff" />
          <Text style={styles.buttonText}>Create First</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16, marginLeft: 8 },
});
