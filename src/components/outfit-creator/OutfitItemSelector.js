// src/components/outfit-creator/OutfitItemSelector.js

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import SearchBar from "../SearchBar";
import ClothesFilterBar from "../ClothesFilterBar";
import SelectedItemsPreview from "./SelectedItemsPreview";

export default function OutfitItemSelector({
  outfitImage,
  wardrobeItems,
  selectedItems,
  onItemToggle,
  loading,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    filterItems();
  }, [wardrobeItems, searchQuery, categoryFilter]);

  const filterItems = () => {
    let filtered = [...wardrobeItems];

    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.brand &&
            item.brand.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (categoryFilter !== "All") {
      filtered = filtered.filter((item) => item.category === categoryFilter);
    }

    setFilteredItems(filtered);
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedItems.includes(item.id);

    return (
      <TouchableOpacity
        style={[styles.itemCard, isSelected && styles.selectedItemCard]}
        onPress={() => onItemToggle(item.id)}
      >
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.itemImage} />
        ) : (
          <View style={styles.itemImagePlaceholder}>
            <MaterialIcons name="checkroom" size={24} color="#A89888" />
          </View>
        )}

        <View style={styles.itemInfo}>
          <Text style={styles.itemName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.itemCategory}>{item.category}</Text>
          {item.brand && <Text style={styles.itemBrand}>{item.brand}</Text>}
        </View>

        {isSelected && (
          <View style={styles.selectedIndicator}>
            <MaterialIcons name="check" size={16} color="#fff" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👕 Select Your Clothes</Text>
      <Text style={styles.subtitle}>
        Choose items from your wardrobe that make up this outfit
      </Text>

      {/* Outfit Image Reference */}
      {outfitImage && (
        <View style={styles.outfitReference}>
          <Image
            source={{ uri: outfitImage }}
            style={styles.outfitReferenceImage}
          />
          <View style={styles.outfitReferenceOverlay}>
            <MaterialIcons name="photo" size={20} color="#fff" />
          </View>
        </View>
      )}

      {/* Selected Items Preview */}
      <SelectedItemsPreview
        items={selectedItems}
        allItems={wardrobeItems}
        onRemove={onItemToggle}
      />

      {/* Search */}
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search your wardrobe..."
      />

      {/* Category Filter */}
      <ClothesFilterBar
        selectedCategory={categoryFilter}
        onSelectCategory={setCategoryFilter}
      />

      {/* Items List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B7355" />
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          scrollEnabled={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyItems}>
              <MaterialIcons name="checkroom" size={48} color="#A89888" />
              <Text style={styles.emptyItemsText}>
                {searchQuery ? "No items found" : "No items in wardrobe"}
              </Text>
              <Text style={styles.emptyItemsSubtext}>
                {searchQuery
                  ? "Try a different search"
                  : "Add items to get started"}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "300",
    color: "#6B5B4D",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: "#A89888",
    marginBottom: 20,
    lineHeight: 20,
  },
  outfitReference: {
    position: "relative",
    alignSelf: "center",
    marginBottom: 20,
  },
  outfitReferenceImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  outfitReferenceOverlay: {
    position: "absolute",
    bottom: 4,
    right: 4,
    backgroundColor: "rgba(107, 91, 77, 0.8)",
    borderRadius: 8,
    padding: 4,
  },
  loadingContainer: {
    padding: 40,
    alignItems: "center",
  },
  listContent: {
    paddingBottom: 20,
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5EDE5",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedItemCard: {
    borderColor: "#C9A07A",
    backgroundColor: "#FFF8F0",
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "#fff",
  },
  itemImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: "#E8DED2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B5B4D",
    marginBottom: 2,
  },
  itemCategory: {
    fontSize: 12,
    color: "#8B7355",
    marginBottom: 2,
  },
  itemBrand: {
    fontSize: 11,
    color: "#C9A07A",
    fontWeight: "500",
  },
  selectedIndicator: {
    backgroundColor: "#C9A07A",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyItems: {
    alignItems: "center",
    padding: 40,
  },
  emptyItemsText: {
    fontSize: 16,
    color: "#8B7355",
    marginTop: 8,
    fontWeight: "500",
  },
  emptyItemsSubtext: {
    fontSize: 12,
    color: "#A89888",
    marginTop: 4,
  },
});
