import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons, Ionicons, AntDesign } from "@expo/vector-icons";

export default function WardrobeItemCard({ item, onPress }) {
  const wearCount = item.wearCount || 0;
  const lastWorn = item.lastWorn
    ? new Date(item.lastWorn).toLocaleDateString()
    : "Never worn";

  // Mean rating
  const averageRating =
    wearCount > 0 && item.totalRating > 0
      ? (item.totalRating / wearCount).toFixed(1)
      : null;

  // Cost per wear
  const costPerWear =
    item.price && wearCount > 0 ? (item.price / wearCount).toFixed(2) : null;

  const getUsageColor = () => {
    if (wearCount === 0) return "#ff6b6b";
    if (wearCount < 3) return "#ffa726";
    return "#4caf50";
  };

  const getSeasonIcon = () => {
    if (!item.seasons || item.seasons.length === 0) return null;
    const seasonIcons = {
      spring: "flower-outline",
      summer: "sunny-outline",
      autumn: "leaf-outline",
      winter: "snow-outline",
      all: "calendar-outline",
    };
    return seasonIcons[item.seasons[0]];
  };

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(item)}>
      {/* Image with information overlay */}
      <View style={styles.imageContainer}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <MaterialIcons name="checkroom" size={32} color="#ccc" />
          </View>
        )}

        {/* Usage badge */}
        <View style={[styles.usageBadge, { backgroundColor: getUsageColor() }]}>
          <Text style={styles.usageBadgeText}>{wearCount}</Text>
        </View>

        {/* Price */}
        {item.price && (
          <View style={styles.priceBadge}>
            <Text style={styles.priceBadgeText}>€{item.price}</Text>
          </View>
        )}
      </View>

      {/* Main Information */}
      <View style={styles.info}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>
          {averageRating && (
            <View style={styles.ratingContainer}>
              <AntDesign name="star" size={12} color="#FFD700" />
              <Text style={styles.rating}>{averageRating}</Text>
            </View>
          )}
        </View>

        {/* Brand and category */}
        <View style={styles.brandCategory}>
          {item.brand && <Text style={styles.brand}>{item.brand}</Text>}
          <Text style={styles.category}>{item.category}</Text>
        </View>

        {/* More details */}
        <View style={styles.details}>
          {item.size && (
            <View style={styles.detailChip}>
              <Text style={styles.detailText}>{item.size}</Text>
            </View>
          )}
          {item.color && (
            <View style={styles.detailChip}>
              <View
                style={[
                  styles.colorDot,
                  {
                    backgroundColor: getColorHex(item.color),
                  },
                ]}
              />
              <Text style={styles.detailText}>{item.color}</Text>
            </View>
          )}
          {getSeasonIcon() && (
            <View style={styles.detailChip}>
              <Ionicons name={getSeasonIcon()} size={12} color="#666" />
            </View>
          )}
        </View>

        {/* Stats */}
        <View style={styles.usageStats}>
          <View style={styles.statItem}>
            <MaterialIcons name="schedule" size={14} color="#666" />
            <Text style={styles.statText}>{lastWorn}</Text>
          </View>
          {costPerWear && (
            <View style={styles.statItem}>
              <MaterialIcons name="euro" size={14} color="#4caf50" />
              <Text style={styles.costPerWear}>€{costPerWear}/wear</Text>
            </View>
          )}
        </View>
      </View>

      {/* Show details */}
      <MaterialIcons name="chevron-right" size={20} color="#ccc" />
    </TouchableOpacity>
  );
}

const getColorHex = (colorName) => {
  const colors = {
    Black: "#000000",
    White: "#FFFFFF",
    Gray: "#808080",
    Navy: "#000080",
    Blue: "#0066CC",
    Red: "#FF0000",
    Green: "#008000",
    Yellow: "#FFFF00",
    Pink: "#FFC0CB",
    Purple: "#800080",
    Brown: "#8B4513",
    Orange: "#FFA500",
    Beige: "#F5F5DC",
    Burgundy: "#800020",
  };
  return colors[colorName] || "#ccc";
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 12,
    marginVertical: 6,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  imageContainer: {
    position: "relative",
    marginRight: 12,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  usageBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  usageBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  priceBadge: {
    position: "absolute",
    bottom: -4,
    left: -4,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  priceBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "500",
  },
  info: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontSize: 12,
    color: "#666",
    marginLeft: 2,
  },
  brandCategory: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  brand: {
    fontSize: 12,
    color: "#007AFF",
    fontWeight: "500",
    marginRight: 8,
  },
  category: {
    fontSize: 12,
    color: "#666",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  details: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  detailChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 4,
  },
  detailText: {
    fontSize: 10,
    color: "#666",
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 3,
    borderWidth: 0.5,
    borderColor: "#ddd",
  },
  usageStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  statText: {
    fontSize: 11,
    color: "#666",
    marginLeft: 4,
  },
  costPerWear: {
    fontSize: 11,
    color: "#4caf50",
    fontWeight: "500",
    marginLeft: 4,
  },
});
