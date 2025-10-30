import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";

export default function OutfitItemCard({ outfit, onToggleFavorite, onDelete }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.name}>{outfit.name}</Text>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => onToggleFavorite(outfit)}>
            <AntDesign
              name={outfit.favorite ? "heart" : "hearto"}
              size={20}
              color={outfit.favorite ? "#e63946" : "#555"}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(outfit)}>
            <MaterialIcons name="delete" size={22} color="#999" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.previewRow}>
        {outfit.previewImages?.slice(0, 3).map((uri, index) => (
          <Image key={index} source={{ uri }} style={styles.previewImage} />
        ))}
        {(!outfit.previewImages || outfit.previewImages.length === 0) && (
          <Text style={styles.emptyPreview}>No items preview</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  previewRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  previewImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 8,
  },
  emptyPreview: {
    fontSize: 13,
    color: "#999",
  },
});
