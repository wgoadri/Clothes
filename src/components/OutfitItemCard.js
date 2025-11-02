import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign, MaterialIcons, FontAwesome, Ionicons } from "@expo/vector-icons";

export default function OutfitItemCard({
  outfit,
  onToggleFavorite,
  onDelete,
  onWearToday,
  onPress,
}) {
  // Stats
  const wearCount = outfit.wearCount || 0;
  const lastWorn = outfit.lastWorn 
    ? new Date(outfit.lastWorn).toLocaleDateString() 
    : "Never worn";
  
  // Mean rating
  const averageRating = wearCount > 0 && outfit.totalRating > 0 
    ? (outfit.totalRating / wearCount).toFixed(1) 
    : null;

  // Usage color
  const getUsageColor = () => {
    if (wearCount === 0) return "#ff6b6b";
    if (wearCount < 3) return "#ffa726";
    return "#4caf50";
  };

  // Season icon if available
  const getSeasonIcon = () => {
    if (!outfit.seasons || outfit.seasons.length === 0) return null;
    const seasonIcons = {
      spring: "flower-outline",
      summer: "sunny-outline", 
      autumn: "leaf-outline",
      winter: "snow-outline",
      all: "calendar-outline"
    };
    return seasonIcons[outfit.seasons[0]];
  };

  // Number of clothes
  const itemCount = outfit.items ? outfit.items.length : 0;

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress && onPress(outfit)}>
      {/* Header with name and actions */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.name} numberOfLines={1}>{outfit.name}</Text>
          <View style={styles.badges}>
            {/* Number of clothes */}
            <View style={styles.itemCountBadge}>
              <MaterialIcons name="checkroom" size={12} color="#666" />
              <Text style={styles.itemCountText}>{itemCount}</Text>
            </View>
            
            {/* Season */}
            {getSeasonIcon() && (
              <View style={styles.seasonBadge}>
                <Ionicons name={getSeasonIcon()} size={12} color="#666" />
              </View>
            )}
            
            {/* Favori */}
            {outfit.favorite && (
              <View style={styles.favoriteBadge}>
                <AntDesign name="heart" size={10} color="#e63946" />
              </View>
            )}
          </View>
        </View>

        <View style={styles.actions}>
          {/* Wear Today */}
          {onWearToday && (
            <TouchableOpacity
              onPress={() => onWearToday(outfit)}
              style={styles.wearTodayButton}
            >
              <MaterialIcons name="today" size={18} color="#007AFF" />
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            onPress={() => onToggleFavorite(outfit)}
            style={styles.actionButton}
          >
            {outfit.favorite ? (
              <AntDesign name="heart" size={18} color="#e63946" />
            ) : (
              <FontAwesome name="heart-o" size={18} color="#666" />
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => onDelete(outfit)}
            style={styles.actionButton}
          >
            <MaterialIcons name="delete" size={18} color="#ff6b6b" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Preview */}
      <View style={styles.previewContainer}>
        <View style={styles.previewRow}>
          {outfit.previewImages?.slice(0, 4).map((uri, index) => (
            <View key={index} style={styles.previewImageContainer}>
              <Image source={{ uri }} style={styles.previewImage} />
              {index === 3 && outfit.previewImages.length > 4 && (
                <View style={styles.moreItemsOverlay}>
                  <Text style={styles.moreItemsText}>+{outfit.previewImages.length - 4}</Text>
                </View>
              )}
            </View>
          ))}
          
          {(!outfit.previewImages || outfit.previewImages.length === 0) && (
            <View style={styles.emptyPreview}>
              <MaterialIcons name="style" size={32} color="#ccc" />
              <Text style={styles.emptyPreviewText}>No items preview</Text>
            </View>
          )}
        </View>

        {/* Usage */}
        {wearCount > 0 && (
          <View style={[styles.usageBadge, { backgroundColor: getUsageColor() }]}>
            <Text style={styles.usageBadgeText}>{wearCount}</Text>
          </View>
        )}
      </View>

      {/* Information */}
      <View style={styles.infoContainer}>
        {/* Tags */}
        {outfit.occasions && outfit.occasions.length > 0 && (
          <View style={styles.occasionsContainer}>
            {outfit.occasions.slice(0, 2).map((occasion, index) => (
              <Text key={index} style={styles.occasionTag}>
                {occasion}
              </Text>
            ))}
            {outfit.occasions.length > 2 && (
              <Text style={styles.moreOccasions}>+{outfit.occasions.length - 2}</Text>
            )}
          </View>
        )}

        {/* Rating stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <MaterialIcons name="schedule" size={14} color="#666" />
            <Text style={styles.statText}>{lastWorn}</Text>
          </View>
          
          {averageRating && (
            <View style={styles.statItem}>
              <AntDesign name="star" size={12} color="#FFD700" />
              <Text style={styles.ratingText}>{averageRating}</Text>
            </View>
          )}
        </View>

        {/* Description */}
        {outfit.description && (
          <Text style={styles.description} numberOfLines={2}>
            {outfit.description}
          </Text>
        )}
      </View>

      {/* View outfit details icon */}
      <View style={styles.clickIndicator}>
        <MaterialIcons name="chevron-right" size={16} color="#ccc" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: "relative",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  badges: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  itemCountBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f8ff",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  itemCountText: {
    fontSize: 10,
    color: "#666",
    marginLeft: 2,
    fontWeight: "500",
  },
  seasonBadge: {
    backgroundColor: "#fff3e0",
    borderRadius: 8,
    padding: 3,
  },
  favoriteBadge: {
    backgroundColor: "#ffebee",
    borderRadius: 8,
    padding: 3,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  wearTodayButton: {
    backgroundColor: "#e3f2fd",
    borderRadius: 8,
    padding: 8,
  },
  actionButton: {
    padding: 4,
  },
  previewContainer: {
    position: "relative",
    marginBottom: 12,
  },
  previewRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  previewImageContainer: {
    position: "relative",
  },
  previewImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  moreItemsOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  moreItemsText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  emptyPreview: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: "#e9ecef",
    borderStyle: "dashed",
  },
  emptyPreviewText: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  usageBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  usageBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  infoContainer: {
    gap: 8,
  },
  occasionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  occasionTag: {
    backgroundColor: "#f0f8ff",
    color: "#1976d2",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    fontSize: 11,
    fontWeight: "500",
  },
  moreOccasions: {
    fontSize: 11,
    color: "#666",
    fontWeight: "500",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  statText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  ratingText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
    fontWeight: "500",
  },
  description: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
    fontStyle: "italic",
  },
  clickIndicator: {
    position: "absolute",
    right: 8,
    top: "50%",
    transform: [{ translateY: -8 }],
  },
});
