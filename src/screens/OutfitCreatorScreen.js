import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  ScrollView,
  Modal,
  Image,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { addDoc, collection, updateDoc, doc } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import { getWardrobeItems } from "../services/wardrobeService";
import BottomBar from "../components/BottomBar";

const SEASONS = [
  { id: 'spring', name: 'Spring', icon: 'flower-outline' },
  { id: 'summer', name: 'Summer', icon: 'sunny-outline' },
  { id: 'autumn', name: 'Autumn', icon: 'leaf-outline' },
  { id: 'winter', name: 'Winter', icon: 'snow-outline' },
  { id: 'all', name: 'All Seasons', icon: 'calendar-outline' },
];

const OCCASIONS = [
  'Casual', 'Work', 'Formal', 'Party', 'Sport', 'Beach', 'Travel', 'Date', 'Wedding', 'Meeting'
];

const CATEGORIES = ['All', 'Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Accessories'];

export default function OutfitCreatorScreen({ route, navigation }) {
  const { preselectedItem, editOutfit } = route.params || {};
  const isEditing = !!editOutfit;
  
  const [outfitName, setOutfitName] = useState(editOutfit?.name || "");
  const [description, setDescription] = useState(editOutfit?.description || "");
  const [notes, setNotes] = useState(editOutfit?.notes || "");
  const [seasons, setSeasons] = useState(editOutfit?.seasons || []);
  const [occasions, setOccasions] = useState(editOutfit?.occasions || []);
  
  const [wardrobeItems, setWardrobeItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState(editOutfit?.items || []);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  
  const [loading, setLoading] = useState(true);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    fetchWardrobeItems();
  }, []);

  useEffect(() => {
    if (preselectedItem && !selectedItems.includes(preselectedItem.id)) {
      setSelectedItems([...selectedItems, preselectedItem.id]);
    }
  }, [preselectedItem]);

  useEffect(() => {
    filterItems();
  }, [wardrobeItems, searchQuery, categoryFilter]);

  const fetchWardrobeItems = async () => {
    try {
      setLoading(true);
      const items = await getWardrobeItems(userId);
      setWardrobeItems(items);
    } catch (error) {
      console.error("Error fetching wardrobe items:", error);
      Alert.alert("Error", "Failed to load wardrobe items");
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = [...wardrobeItems];

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.brand && item.brand.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (categoryFilter !== "All") {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    setFilteredItems(filtered);
  };

  const toggleItemSelection = (itemId) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const toggleSeason = (seasonId) => {
    setSeasons(prev =>
      prev.includes(seasonId)
        ? prev.filter(s => s !== seasonId)
        : [...prev, seasonId]
    );
  };

  const toggleOccasion = (occasion) => {
    setOccasions(prev =>
      prev.includes(occasion)
        ? prev.filter(o => o !== occasion)
        : [...prev, occasion]
    );
  };

  const validateForm = () => {
    if (!outfitName.trim()) {
      Alert.alert("Validation Error", "Please enter an outfit name");
      return false;
    }
    if (selectedItems.length === 0) {
      Alert.alert("Validation Error", "Please select at least one item");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const selectedItemsData = wardrobeItems.filter(item => 
        selectedItems.includes(item.id)
      );

      const outfitData = {
        name: outfitName.trim(),
        description: description.trim(),
        notes: notes.trim(),
        items: selectedItems,
        previewImages: selectedItemsData
          .filter(item => item.image)
          .map(item => item.image),
        seasons,
        occasions,
        favorite: editOutfit?.favorite || false,
        wearCount: editOutfit?.wearCount || 0,
        lastWorn: editOutfit?.lastWorn || null,
        totalRating: editOutfit?.totalRating || 0,
        createdAt: editOutfit?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (isEditing) {
        const outfitRef = doc(db, "users", userId, "outfits", editOutfit.id);
        await updateDoc(outfitRef, outfitData);
        Alert.alert("Success! 🎉", "Outfit updated successfully!");
      } else {
        await addDoc(collection(db, "users", userId, "outfits"), outfitData);
        Alert.alert("Success! 🎉", "Outfit created successfully!");
      }

      navigation.navigate("Outfits");
    } catch (error) {
      console.error("Error saving outfit:", error);
      Alert.alert("Error", "Failed to save outfit. Please try again.");
    }
  };

  const renderCategoryFilter = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.categoryFilterContainer}
    >
      {CATEGORIES.map((category) => (
        <TouchableOpacity
          key={category}
          style={[
            styles.categoryFilterButton,
            categoryFilter === category && styles.activeCategoryFilter
          ]}
          onPress={() => setCategoryFilter(category)}
        >
          <Text style={[
            styles.categoryFilterText,
            categoryFilter === category && styles.activeCategoryFilterText
          ]}>
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderWardrobeItem = ({ item }) => {
    const isSelected = selectedItems.includes(item.id);
    
    return (
      <TouchableOpacity
        style={[styles.itemCard, isSelected && styles.selectedItemCard]}
        onPress={() => toggleItemSelection(item.id)}
      >
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.itemImage} />
        ) : (
          <View style={styles.itemImagePlaceholder}>
            <MaterialIcons name="checkroom" size={24} color="#ccc" />
          </View>
        )}
        
        <View style={styles.itemInfo}>
          <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.itemCategory}>{item.category}</Text>
          {item.brand && (
            <Text style={styles.itemBrand}>{item.brand}</Text>
          )}
        </View>

        {isSelected && (
          <View style={styles.selectedIndicator}>
            <MaterialIcons name="check" size={16} color="#fff" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderSelectedItems = () => {
    const selectedItemsData = wardrobeItems.filter(item => 
      selectedItems.includes(item.id)
    );

    if (selectedItemsData.length === 0) {
      return (
        <View style={styles.emptySelection}>
          <MaterialIcons name="style" size={32} color="#ccc" />
          <Text style={styles.emptySelectionText}>No items selected</Text>
        </View>
      );
    }

    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {selectedItemsData.map((item) => (
          <View key={item.id} style={styles.selectedItemPreview}>
            {item.image ? (
              <Image source={{ uri: item.image }} style={styles.selectedItemImage} />
            ) : (
              <View style={styles.selectedItemImagePlaceholder}>
                <MaterialIcons name="checkroom" size={20} color="#ccc" />
              </View>
            )}
            <TouchableOpacity
              style={styles.removeItemButton}
              onPress={() => toggleItemSelection(item.id)}
            >
              <MaterialIcons name="close" size={14} color="#fff" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>
            {isEditing ? "Edit Outfit" : "Create Outfit"}
          </Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.saveButton}>Save</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>📝 Basic Information</Text>

          <TextInput
            style={styles.input}
            placeholder="Outfit name (e.g. Casual Friday)"
            value={outfitName}
            onChangeText={setOutfitName}
            maxLength={50}
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description (optional)"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            maxLength={200}
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>
            👕 Selected Items ({selectedItems.length})
          </Text>
          {renderSelectedItems()}
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>🔍 Add Items to Outfit</Text>

          <View style={styles.searchContainer}>
            <MaterialIcons name="search" size={20} color="#666" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search items..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <MaterialIcons name="clear" size={20} color="#666" />
              </TouchableOpacity>
            )}
          </View>

          {renderCategoryFilter()}
        </View>

        <View style={styles.itemsSection}>
          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item.id}
            renderItem={renderWardrobeItem}
            scrollEnabled={false}
            ListEmptyComponent={
              <View style={styles.emptyItems}>
                <MaterialIcons name="checkroom" size={48} color="#ccc" />
                <Text style={styles.emptyItemsText}>
                  {searchQuery ? "No items found" : "No items in wardrobe"}
                </Text>
              </View>
            }
          />
        </View>

        <View style={styles.formSection}>
          <TouchableOpacity
            style={styles.advancedToggle}
            onPress={() => setShowAdvancedOptions(!showAdvancedOptions)}
          >
            <Text style={styles.sectionTitle}>⚙️ Advanced Options</Text>
            <MaterialIcons
              name={showAdvancedOptions ? "expand-less" : "expand-more"}
              size={24}
              color="#666"
            />
          </TouchableOpacity>

          {showAdvancedOptions && (
            <>
              <View style={styles.optionGroup}>
                <Text style={styles.optionLabel}>Suitable Seasons</Text>
                <View style={styles.chipContainer}>
                  {SEASONS.map((season) => (
                    <TouchableOpacity
                      key={season.id}
                      style={[
                        styles.chip,
                        seasons.includes(season.id) && styles.selectedChip,
                      ]}
                      onPress={() => toggleSeason(season.id)}
                    >
                      <Ionicons
                        name={season.icon}
                        size={14}
                        color={seasons.includes(season.id) ? "#fff" : "#007AFF"}
                      />
                      <Text
                        style={[
                          styles.chipText,
                          seasons.includes(season.id) &&
                            styles.selectedChipText,
                        ]}
                      >
                        {season.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.optionGroup}>
                <Text style={styles.optionLabel}>Suitable Occasions</Text>
                <View style={styles.chipContainer}>
                  {OCCASIONS.map((occasion) => (
                    <TouchableOpacity
                      key={occasion}
                      style={[
                        styles.chip,
                        occasions.includes(occasion) && styles.selectedChip,
                      ]}
                      onPress={() => toggleOccasion(occasion)}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          occasions.includes(occasion) &&
                            styles.selectedChipText,
                        ]}
                      >
                        {occasion}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.optionGroup}>
                <Text style={styles.optionLabel}>Personal Notes</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Any notes about this outfit? (e.g. Perfect for client meetings)"
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  numberOfLines={3}
                  maxLength={200}
                />
              </View>
            </>
          )}
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="cancel" size={20} color="#666" />
            <Text style={styles.secondaryButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.primaryButton} onPress={handleSave}>
            <MaterialIcons name="save" size={20} color="#fff" />
            <Text style={styles.primaryButtonText}>
              {isEditing ? "Update Outfit" : "Create Outfit"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  saveButton: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
  formSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e9ecef",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
  },
  categoryFilterContainer: {
    marginBottom: 16,
  },
  categoryFilterButton: {
    backgroundColor: "#f8f9fa",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  activeCategoryFilter: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  categoryFilterText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  activeCategoryFilterText: {
    color: "#fff",
  },
  emptySelection: {
    alignItems: "center",
    padding: 40,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e9ecef",
    borderStyle: "dashed",
  },
  emptySelectionText: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
  },
  selectedItemPreview: {
    position: "relative",
    marginRight: 8,
  },
  selectedItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  selectedItemImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  removeItemButton: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#ff3b30",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  itemsSection: {
    paddingHorizontal: 20,
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedItemCard: {
    borderColor: "#007AFF",
    backgroundColor: "#f0f8ff",
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  itemImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: "#e9ecef",
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
    color: "#333",
    marginBottom: 2,
  },
  itemCategory: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  itemBrand: {
    fontSize: 11,
    color: "#007AFF",
    fontWeight: "500",
  },
  selectedIndicator: {
    backgroundColor: "#007AFF",
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
    color: "#999",
    marginTop: 8,
    textAlign: "center",
  },
  advancedToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  optionGroup: {
    marginTop: 16,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#007AFF",
    backgroundColor: "#fff",
  },
  selectedChip: {
    backgroundColor: "#007AFF",
  },
  chipText: {
    fontSize: 12,
    color: "#007AFF",
    marginLeft: 4,
  },
  selectedChipText: {
    color: "#fff",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  secondaryButtonText: {
    color: "#666",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },
  bottomSpacing: {
    height: 50,
  },
});
