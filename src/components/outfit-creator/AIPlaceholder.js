import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";

export default function AIPlaceholder() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="sparkles" size={20} color="#A89888" />
        <Text style={styles.title}>AI Analysis</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Coming Soon</Text>
        </View>
      </View>
      <Text style={styles.description}>
        Soon, AI will automatically detect clothes in your photo and help you
        link them to your wardrobe.
      </Text>
      <TouchableOpacity style={styles.button} disabled>
        <MaterialIcons name="auto-awesome" size={18} color="#A89888" />
        <Text style={styles.buttonText}>Auto-Detect Clothes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5EDE5",
    borderRadius: 16,
    padding: 20,
    marginTop: 24,
    borderWidth: 1,
    borderColor: "#E8DED2",
    borderStyle: "dashed",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B5B4D",
    marginLeft: 8,
    flex: 1,
  },
  badge: {
    backgroundColor: "#E8DED2",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    color: "#8B7355",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 14,
    color: "#8B7355",
    lineHeight: 20,
    marginBottom: 16,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E8DED2",
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 14,
    color: "#A89888",
    fontWeight: "600",
    marginLeft: 8,
  },
});
