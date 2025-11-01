import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";

export default function OutfitItemCard({ 
  outfit, 
  onToggleFavorite, 
  onDelete, 
  onWearToday
}) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.name}>{outfit.name}</Text>
        <View style={styles.actions}>
          {/* Wear Today */}
          {onWearToday && (
            <TouchableOpacity 
              onPress={() => onWearToday(outfit)}
              style={styles.wearTodayButton}
            >
              <MaterialIcons name="today" size={20} color="#007AFF" />
            </TouchableOpacity>
          )}
          
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

      {/* Display usage stats if available */}
      {outfit.wearCount > 0 && (
        <View style={styles.usageInfo}>
          <Text style={styles.usageText}>
            Worn {outfit.wearCount} times
          </Text>
          {outfit.lastWorn && (
            <Text style={styles.lastWornText}>
              Last: {new Date(outfit.lastWorn).toLocaleDateString()}
            </Text>
          )}
        </View>
      )}
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
    flex: 1,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  wearTodayButton: {
    backgroundColor: "#e3f2fd",
    borderRadius: 6,
    padding: 4,
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
  usageInfo: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
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
