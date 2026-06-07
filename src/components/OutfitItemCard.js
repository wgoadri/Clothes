import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import {
  AntDesign,
  MaterialIcons,
  FontAwesome,
  Ionicons,
} from "@expo/vector-icons";
import { globalStyles } from "../styles/globalStyles";
import { outfitCardStyles } from "../styles/components/outfitCard";

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
  const averageRating =
    wearCount > 0 && outfit.totalRating > 0
      ? (outfit.totalRating / wearCount).toFixed(1)
      : null;

  // Usage color
  const getUsageColor = () => {
    if (wearCount === 0) return "#D97757"; // theme error color
    if (wearCount < 3) return "#F9A825"; // theme warning color
    return "#7CB342"; // theme success color
  };

  // Season icon if available
  const getSeasonIcon = () => {
    if (!outfit.seasons || outfit.seasons.length === 0) return null;
    const seasonIcons = {
      spring: "flower-outline",
      summer: "sunny-outline",
      autumn: "leaf-outline",
      winter: "snow-outline",
      all: "calendar-outline",
    };
    return seasonIcons[outfit.seasons[0]];
  };

  // Number of clothes
  const itemCount = outfit.items ? outfit.items.length : 0;

  return (
    <TouchableOpacity
      style={outfitCardStyles.card}
      onPress={() => onPress && onPress(outfit)}
      activeOpacity={0.8}
    >
      {/* Header with name and actions */}
      <View style={outfitCardStyles.header}>
        <View style={outfitCardStyles.titleContainer}>
          <Text style={outfitCardStyles.name} numberOfLines={1}>
            {outfit.name}
          </Text>
          <View style={outfitCardStyles.badges}>
            {/* Number of clothes */}
            <View style={outfitCardStyles.itemCountBadge}>
              <MaterialIcons name="checkroom" size={12} color="#8B7355" />
              <Text style={outfitCardStyles.itemCountText}>{itemCount}</Text>
            </View>

            {/* Season */}
            {getSeasonIcon() && (
              <View style={outfitCardStyles.seasonBadge}>
                <Ionicons name={getSeasonIcon()} size={12} color="#C9A07A" />
              </View>
            )}

            {/* Favorite */}
            {outfit.favorite && (
              <View style={outfitCardStyles.favoriteBadge}>
                <AntDesign name="heart" size={10} color="#D97757" />
              </View>
            )}
          </View>
        </View>

        <View style={outfitCardStyles.actions}>
          {/* Wear Today */}
          {onWearToday && (
            <TouchableOpacity
              onPress={() => onWearToday(outfit)}
              style={outfitCardStyles.wearTodayButton}
              activeOpacity={0.7}
            >
              <MaterialIcons name="today" size={18} color="#C9A07A" />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() => onToggleFavorite(outfit)}
            style={outfitCardStyles.actionButton}
            activeOpacity={0.7}
          >
            {outfit.favorite ? (
              <AntDesign name="heart" size={18} color="#D97757" />
            ) : (
              <FontAwesome name="heart-o" size={18} color="#A89888" />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onDelete(outfit)}
            style={outfitCardStyles.actionButton}
            activeOpacity={0.7}
          >
            <MaterialIcons name="delete" size={18} color="#D97757" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Preview */}
      <View style={outfitCardStyles.previewContainer}>
        <View style={outfitCardStyles.previewRow}>
          {outfit.previewImages?.slice(0, 4).map((uri, index) => (
            <View key={index} style={outfitCardStyles.previewImageContainer}>
              <Image source={{ uri }} style={outfitCardStyles.previewImage} />
              {index === 3 && outfit.previewImages.length > 4 && (
                <View style={outfitCardStyles.moreItemsOverlay}>
                  <Text style={outfitCardStyles.moreItemsText}>
                    +{outfit.previewImages.length - 4}
                  </Text>
                </View>
              )}
            </View>
          ))}

          {(!outfit.previewImages || outfit.previewImages.length === 0) && (
            <View style={outfitCardStyles.emptyPreview}>
              <View style={outfitCardStyles.emptyIconContainer}>
                <MaterialIcons name="style" size={32} color="#C9A07A" />
              </View>
              <Text style={outfitCardStyles.emptyPreviewText}>
                No items preview
              </Text>
            </View>
          )}
        </View>

        {/* Usage Badge */}
        {wearCount > 0 && (
          <View
            style={[
              outfitCardStyles.usageBadge,
              { backgroundColor: getUsageColor() },
            ]}
          >
            <Text style={outfitCardStyles.usageBadgeText}>{wearCount}</Text>
          </View>
        )}
      </View>

      {/* Information */}
      <View style={outfitCardStyles.infoContainer}>
        {/* Tags */}
        {outfit.occasions && outfit.occasions.length > 0 && (
          <View style={outfitCardStyles.occasionsContainer}>
            {outfit.occasions.slice(0, 2).map((occasion, index) => (
              <View key={index} style={outfitCardStyles.occasionTag}>
                <Text style={outfitCardStyles.occasionTagText}>{occasion}</Text>
              </View>
            ))}
            {outfit.occasions.length > 2 && (
              <Text style={outfitCardStyles.moreOccasions}>
                +{outfit.occasions.length - 2}
              </Text>
            )}
          </View>
        )}

        {/* Rating stats */}
        <View style={outfitCardStyles.statsRow}>
          <View style={outfitCardStyles.statItem}>
            <MaterialIcons name="schedule" size={14} color="#A89888" />
            <Text style={outfitCardStyles.statText}>{lastWorn}</Text>
          </View>

          {averageRating && (
            <View style={outfitCardStyles.statItem}>
              <AntDesign name="star" size={12} color="#D4AF37" />
              <Text style={outfitCardStyles.ratingText}>{averageRating}</Text>
            </View>
          )}
        </View>

        {/* Description */}
        {outfit.description && (
          <Text style={outfitCardStyles.description} numberOfLines={2}>
            {outfit.description}
          </Text>
        )}
      </View>

      {/* View outfit details icon */}
      <View style={outfitCardStyles.clickIndicator}>
        <MaterialIcons name="chevron-right" size={16} color="#E8DED2" />
      </View>
    </TouchableOpacity>
  );
}
