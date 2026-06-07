import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { MaterialIcons, Ionicons, AntDesign } from "@expo/vector-icons";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import { getItemStats } from "../services/statsService";
import BottomBar from "../components/BottomBar";
import { sharedDetailStyles } from "../styles/shared/detail";
import { clothesDetailStyles } from "../styles/screens/clothesDetail";

export default function ClothesDetailScreen({ route, navigation }) {
  const { item } = route.params;
  const [currentItem, setCurrentItem] = useState(item);
  const [itemStats, setItemStats] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedItem, setEditedItem] = useState({ ...item });
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    fetchItemStats();
  }, []);

  const fetchItemStats = async () => {
    try {
      const stats = await getItemStats(userId, item.id);
      setItemStats(stats);
    } catch (error) {
      console.error("Error fetching item stats:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      const itemRef = doc(db, "users", userId, "wardrobe", item.id);
      await updateDoc(itemRef, {
        ...editedItem,
        updatedAt: new Date().toISOString(),
      });

      setCurrentItem(editedItem);
      setEditModalVisible(false);
      Alert.alert("Success", "Item updated successfully");
    } catch (error) {
      console.error("Error updating item:", error);
      Alert.alert("Error", "Failed to update item");
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Item",
      `Are you sure you want to delete "${currentItem.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const itemRef = doc(db, "users", userId, "wardrobe", item.id);
              await deleteDoc(itemRef);
              Alert.alert("Deleted", "Item removed from wardrobe");
              navigation.goBack();
            } catch (error) {
              Alert.alert("Error", "Failed to delete item");
            }
          },
        },
      ]
    );
  };

  const renderEditModal = () => (
    <Modal visible={editModalVisible} animationType="slide">
      <View style={sharedDetailStyles.modalContainer}>
        <View style={sharedDetailStyles.modalHeader}>
          <TouchableOpacity
            onPress={() => setEditModalVisible(false)}
            style={sharedDetailStyles.modalCloseButton}
          >
            <MaterialIcons name="close" size={24} color="#8B7355" />
          </TouchableOpacity>
          <Text style={sharedDetailStyles.modalTitle}>Edit Item</Text>
          <TouchableOpacity onPress={handleUpdate}>
            <Text style={sharedDetailStyles.saveButton}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={sharedDetailStyles.modalContent}>
          <Text style={sharedDetailStyles.inputLabel}>Item Name</Text>
          <TextInput
            style={sharedDetailStyles.editInput}
            value={editedItem.name}
            onChangeText={(text) =>
              setEditedItem({ ...editedItem, name: text })
            }
            placeholder="Enter item name"
            placeholderTextColor="#A89888"
          />

          <Text style={sharedDetailStyles.inputLabel}>Brand</Text>
          <TextInput
            style={sharedDetailStyles.editInput}
            value={editedItem.brand || ""}
            onChangeText={(text) =>
              setEditedItem({ ...editedItem, brand: text })
            }
            placeholder="Enter brand name"
            placeholderTextColor="#A89888"
          />

          <Text style={sharedDetailStyles.inputLabel}>Price</Text>
          <TextInput
            style={sharedDetailStyles.editInput}
            value={editedItem.price?.toString() || ""}
            onChangeText={(text) =>
              setEditedItem({ ...editedItem, price: parseFloat(text) || null })
            }
            placeholder="Enter price"
            placeholderTextColor="#A89888"
            keyboardType="numeric"
          />

          <Text style={sharedDetailStyles.inputLabel}>Personal Notes</Text>
          <TextInput
            style={[sharedDetailStyles.editInput, sharedDetailStyles.textArea]}
            value={editedItem.notes || ""}
            onChangeText={(text) =>
              setEditedItem({ ...editedItem, notes: text })
            }
            placeholder="Add personal notes"
            placeholderTextColor="#A89888"
            multiline
            numberOfLines={3}
          />
        </ScrollView>
      </View>
    </Modal>
  );

  const renderInfoRow = (label, value, icon) => {
    if (!value) return null;
    return (
      <View style={sharedDetailStyles.infoRow}>
        <MaterialIcons name={icon} size={20} color="#A89888" />
        <Text style={sharedDetailStyles.infoLabel}>{label}:</Text>
        <Text style={sharedDetailStyles.infoValue}>{value}</Text>
      </View>
    );
  };

  const averageRating =
    currentItem.wearCount > 0 && currentItem.totalRating > 0
      ? (currentItem.totalRating / currentItem.wearCount).toFixed(1)
      : null;

  const costPerWear =
    currentItem.price && currentItem.wearCount > 0
      ? `€${(currentItem.price / currentItem.wearCount).toFixed(2)}`
      : currentItem.price
        ? `€${currentItem.price}`
        : "No price set";

  const lastWorn = currentItem.lastWorn
    ? new Date(currentItem.lastWorn).toLocaleDateString()
    : "Never worn";

  return (
    <View style={sharedDetailStyles.container}>
      <ScrollView
        style={sharedDetailStyles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Floating Header Buttons */}
        <View style={sharedDetailStyles.headerFloating}>
          <TouchableOpacity
            style={sharedDetailStyles.headerFloatingButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <MaterialIcons name="arrow-back" size={24} color="#FAF8F5" />
          </TouchableOpacity>

          <TouchableOpacity
            style={sharedDetailStyles.headerFloatingButton}
            onPress={() => setEditModalVisible(true)}
            activeOpacity={0.7}
          >
            <MaterialIcons name="edit" size={24} color="#FAF8F5" />
          </TouchableOpacity>
        </View>

        {/* Main Image */}
        <View style={clothesDetailStyles.imageContainer}>
          {currentItem.image ? (
            <Image
              source={{ uri: currentItem.image }}
              style={clothesDetailStyles.mainImage}
            />
          ) : (
            <View style={clothesDetailStyles.imagePlaceholder}>
              <View style={sharedDetailStyles.emptyIconContainer}>
                <Ionicons name="shirt-outline" size={48} color="#C9A07A" />
              </View>
              <Text style={sharedDetailStyles.emptyText}>No image</Text>
            </View>
          )}
        </View>

        {/* Main Info */}
        <View style={sharedDetailStyles.mainInfo}>
          <View style={sharedDetailStyles.titleRow}>
            <Text style={sharedDetailStyles.itemName}>{currentItem.name}</Text>
            {averageRating && (
              <View style={sharedDetailStyles.ratingBadge}>
                <AntDesign name="star" size={14} color="#D4AF37" />
                <Text style={sharedDetailStyles.ratingText}>
                  {averageRating}
                </Text>
              </View>
            )}
          </View>

          {currentItem.brand && (
            <Text style={clothesDetailStyles.brandText}>
              {currentItem.brand}
            </Text>
          )}

          <View style={clothesDetailStyles.categoryBadge}>
            <Text style={clothesDetailStyles.categoryText}>
              {currentItem.category}
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View style={sharedDetailStyles.statsContainer}>
          <View style={sharedDetailStyles.sectionHeader}>
            <Ionicons name="bar-chart" size={20} color="#C9A07A" />
            <Text style={sharedDetailStyles.sectionTitle}>
              Usage Statistics
            </Text>
          </View>
          <View style={sharedDetailStyles.statsGrid}>
            <View style={sharedDetailStyles.statCard}>
              <View style={sharedDetailStyles.statIconContainer}>
                <MaterialIcons name="loop" size={24} color="#7CB342" />
              </View>
              <Text style={sharedDetailStyles.statValue}>
                {currentItem.wearCount || 0}
              </Text>
              <Text style={sharedDetailStyles.statLabel}>Times Worn</Text>
            </View>

            <View style={sharedDetailStyles.statCard}>
              <View style={sharedDetailStyles.statIconContainer}>
                <AntDesign name="star" size={24} color="#D4AF37" />
              </View>
              <Text style={sharedDetailStyles.statValue}>
                {averageRating || "N/A"}
              </Text>
              <Text style={sharedDetailStyles.statLabel}>Avg Rating</Text>
            </View>

            <View style={sharedDetailStyles.statCard}>
              <View style={sharedDetailStyles.statIconContainer}>
                <MaterialIcons name="euro" size={24} color="#C9A07A" />
              </View>
              <Text style={sharedDetailStyles.statValue}>{costPerWear}</Text>
              <Text style={sharedDetailStyles.statLabel}>Cost/Wear</Text>
            </View>
          </View>
        </View>

        {/* Details */}
        <View style={sharedDetailStyles.detailsContainer}>
          <View style={sharedDetailStyles.sectionHeader}>
            <Ionicons name="pricetag" size={20} color="#C9A07A" />
            <Text style={sharedDetailStyles.sectionTitle}>Item Details</Text>
          </View>

          {renderInfoRow("Size", currentItem.size, "straighten")}
          {renderInfoRow("Color", currentItem.color, "palette")}
          {renderInfoRow("Material", currentItem.material, "texture")}
          {renderInfoRow(
            "Price",
            currentItem.price ? `€${currentItem.price}` : null,
            "euro"
          )}
          {renderInfoRow("Last Worn", lastWorn, "schedule")}

          {currentItem.seasons && currentItem.seasons.length > 0 && (
            <View style={sharedDetailStyles.infoRow}>
              <MaterialIcons name="wb-sunny" size={20} color="#A89888" />
              <Text style={sharedDetailStyles.infoLabel}>Seasons:</Text>
              <View style={sharedDetailStyles.chipsContainer}>
                {currentItem.seasons.map((season, index) => (
                  <View
                    key={index}
                    style={[
                      sharedDetailStyles.chip,
                      sharedDetailStyles.seasonChip,
                    ]}
                  >
                    <Text
                      style={[
                        sharedDetailStyles.chipText,
                        sharedDetailStyles.seasonChipText,
                      ]}
                    >
                      {season.charAt(0).toUpperCase() + season.slice(1)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {currentItem.occasions && currentItem.occasions.length > 0 && (
            <View style={sharedDetailStyles.infoRow}>
              <MaterialIcons name="event" size={20} color="#A89888" />
              <Text style={sharedDetailStyles.infoLabel}>Occasions:</Text>
              <View style={sharedDetailStyles.chipsContainer}>
                {currentItem.occasions.map((occasion, index) => (
                  <View
                    key={index}
                    style={[
                      sharedDetailStyles.chip,
                      sharedDetailStyles.occasionChip,
                    ]}
                  >
                    <Text
                      style={[
                        sharedDetailStyles.chipText,
                        sharedDetailStyles.occasionChipText,
                      ]}
                    >
                      {occasion}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Purchase Info */}
        {(currentItem.purchaseDate || currentItem.purchaseLocation) && (
          <View style={sharedDetailStyles.detailsContainer}>
            <View style={sharedDetailStyles.sectionHeader}>
              <Ionicons name="bag-handle" size={20} color="#C9A07A" />
              <Text style={sharedDetailStyles.sectionTitle}>Purchase Info</Text>
            </View>
            {renderInfoRow(
              "Purchase Date",
              currentItem.purchaseDate,
              "date-range"
            )}
            {renderInfoRow(
              "Purchased At",
              currentItem.purchaseLocation,
              "store"
            )}
          </View>
        )}

        {/* Care Instructions */}
        {currentItem.careInstructions && (
          <View style={sharedDetailStyles.textContentContainer}>
            <View style={sharedDetailStyles.sectionHeader}>
              <Ionicons name="water" size={20} color="#C9A07A" />
              <Text style={sharedDetailStyles.sectionTitle}>
                Care Instructions
              </Text>
            </View>
            <View style={sharedDetailStyles.textContentCard}>
              <Text style={sharedDetailStyles.textContent}>
                {currentItem.careInstructions}
              </Text>
            </View>
          </View>
        )}

        {/* Personal Notes */}
        {currentItem.notes && (
          <View style={sharedDetailStyles.textContentContainer}>
            <View style={sharedDetailStyles.sectionHeader}>
              <Ionicons name="document-text" size={20} color="#C9A07A" />
              <Text style={sharedDetailStyles.sectionTitle}>
                Personal Notes
              </Text>
            </View>
            <View style={sharedDetailStyles.textContentCard}>
              <Text
                style={[
                  sharedDetailStyles.textContent,
                  sharedDetailStyles.textContentItalic,
                ]}
              >
                {currentItem.notes}
              </Text>
            </View>
          </View>
        )}

        {/* Actions */}
        <View style={sharedDetailStyles.actionsContainer}>
          <TouchableOpacity
            style={sharedDetailStyles.primaryAction}
            onPress={() => {
              navigation.navigate("OutfitCreator", {
                preselectedItem: currentItem,
              });
            }}
            activeOpacity={0.8}
          >
            <MaterialIcons name="style" size={20} color="#FAF8F5" />
            <Text style={sharedDetailStyles.primaryActionText}>
              Create Outfit
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              sharedDetailStyles.secondaryAction,
              sharedDetailStyles.deleteAction,
            ]}
            onPress={handleDelete}
            activeOpacity={0.8}
          >
            <MaterialIcons name="delete" size={20} color="#D97757" />
            <Text
              style={[
                sharedDetailStyles.secondaryActionText,
                sharedDetailStyles.deleteActionText,
              ]}
            >
              Delete Item
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal */}
      {renderEditModal()}
    </View>
  );
}
