import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { MaterialIcons, Ionicons, AntDesign } from "@expo/vector-icons";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import { getItemStats } from "../services/usageService";
import BottomBar from "../components/BottomBar";

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
      Alert.alert("Success", "Item updated successfully!");
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
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setEditModalVisible(false)}>
            <MaterialIcons name="close" size={24} color="#666" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Edit Item</Text>
          <TouchableOpacity onPress={handleUpdate}>
            <Text style={styles.saveButton}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          <TextInput
            style={styles.editInput}
            value={editedItem.name}
            onChangeText={(text) =>
              setEditedItem({ ...editedItem, name: text })
            }
            placeholder="Item name"
          />

          <TextInput
            style={styles.editInput}
            value={editedItem.brand || ""}
            onChangeText={(text) =>
              setEditedItem({ ...editedItem, brand: text })
            }
            placeholder="Brand"
          />

          <TextInput
            style={styles.editInput}
            value={editedItem.price?.toString() || ""}
            onChangeText={(text) =>
              setEditedItem({ ...editedItem, price: parseFloat(text) || null })
            }
            placeholder="Price"
            keyboardType="numeric"
          />

          <TextInput
            style={[styles.editInput, styles.textArea]}
            value={editedItem.notes || ""}
            onChangeText={(text) =>
              setEditedItem({ ...editedItem, notes: text })
            }
            placeholder="Notes"
            multiline
            numberOfLines={3}
          />
        </ScrollView>
      </View>
    </Modal>
  );

  const renderStatCard = (title, value, icon, color = "#007AFF") => (
    <View style={styles.statCard}>
      <MaterialIcons name={icon} size={24} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  const renderInfoRow = (label, value, icon) => {
    if (!value) return null;
    return (
      <View style={styles.infoRow}>
        <MaterialIcons name={icon} size={20} color="#666" />
        <Text style={styles.infoLabel}>{label}:</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    );
  };

  const averageRating =
    currentItem.wearCount > 0 && currentItem.totalRating > 0
      ? (currentItem.totalRating / currentItem.wearCount).toFixed(1)
      : "No ratings yet";

  const costPerWear =
    currentItem.price && currentItem.wearCount > 0
      ? `€${(currentItem.price / currentItem.wearCount).toFixed(2)}`
      : currentItem.price
        ? `€${currentItem.price} (unworn)`
        : "No price set";

  const lastWorn = currentItem.lastWorn
    ? new Date(currentItem.lastWorn).toLocaleDateString()
    : "Never worn";

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with image */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setEditModalVisible(true)}
          >
            <MaterialIcons name="edit" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Main Image */}
        <View style={styles.imageContainer}>
          {currentItem.image ? (
            <Image
              source={{ uri: currentItem.image }}
              style={styles.mainImage}
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <MaterialIcons name="checkroom" size={80} color="#ccc" />
              <Text style={styles.placeholderText}>No image</Text>
            </View>
          )}
        </View>

        {/* Main Informations */}
        <View style={styles.mainInfo}>
          <View style={styles.titleRow}>
            <Text style={styles.itemName}>{currentItem.name}</Text>
            {averageRating !== "No ratings yet" && (
              <View style={styles.ratingBadge}>
                <AntDesign name="star" size={16} color="#FFD700" />
                <Text style={styles.ratingText}>{averageRating}</Text>
              </View>
            )}
          </View>

          {currentItem.brand && (
            <Text style={styles.brandText}>{currentItem.brand}</Text>
          )}

          <View style={styles.categoryContainer}>
            <Text style={styles.categoryText}>{currentItem.category}</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>📊 Usage Statistics</Text>
          <View style={styles.statsGrid}>
            {renderStatCard(
              "Times Worn",
              currentItem.wearCount || 0,
              "loop",
              "#4caf50"
            )}
            {renderStatCard("Avg Rating", averageRating, "star", "#FFD700")}
            {renderStatCard("Cost/Wear", costPerWear, "euro", "#007AFF")}
          </View>
        </View>

        {/* Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.sectionTitle}>🏷️ Item Details</Text>

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
            <View style={styles.infoRow}>
              <MaterialIcons name="wb-sunny" size={20} color="#666" />
              <Text style={styles.infoLabel}>Seasons:</Text>
              <View style={styles.seasonsContainer}>
                {currentItem.seasons.map((season, index) => (
                  <Text key={index} style={styles.seasonChip}>
                    {season.charAt(0).toUpperCase() + season.slice(1)}
                  </Text>
                ))}
              </View>
            </View>
          )}

          {currentItem.occasions && currentItem.occasions.length > 0 && (
            <View style={styles.infoRow}>
              <MaterialIcons name="event" size={20} color="#666" />
              <Text style={styles.infoLabel}>Occasions:</Text>
              <View style={styles.occasionsContainer}>
                {currentItem.occasions.map((occasion, index) => (
                  <Text key={index} style={styles.occasionChip}>
                    {occasion}
                  </Text>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Purchase informations */}
        {(currentItem.purchaseDate || currentItem.purchaseLocation) && (
          <View style={styles.purchaseContainer}>
            <Text style={styles.sectionTitle}>🛍️ Purchase Info</Text>
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

        {/* Care instructions */}
        {currentItem.careInstructions && (
          <View style={styles.careContainer}>
            <Text style={styles.sectionTitle}>🧼 Care Instructions</Text>
            <Text style={styles.careText}>{currentItem.careInstructions}</Text>
          </View>
        )}

        {/* Personal notes */}
        {currentItem.notes && (
          <View style={styles.notesContainer}>
            <Text style={styles.sectionTitle}>📝 Personal Notes</Text>
            <Text style={styles.notesText}>{currentItem.notes}</Text>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              // Navigation vers l'écran de création d'outfit avec cet item pré-sélectionné
              navigation.navigate("OutfitCreator", {
                preselectedItem: currentItem,
              });
            }}
          >
            <MaterialIcons name="style" size={20} color="#007AFF" />
            <Text style={styles.actionButtonText}>Create Outfit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDelete}
          >
            <MaterialIcons name="delete" size={20} color="#ff3b30" />
            <Text style={[styles.actionButtonText, styles.deleteButtonText]}>
              Delete Item
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Modal */}
      {renderEditModal()}

      {/* BottomBar */}
      <BottomBar navigation={navigation} />
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
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    zIndex: 10,
  },
  backButton: {
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    height: 300,
    backgroundColor: "#f8f9fa",
  },
  mainImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    marginTop: 8,
    color: "#999",
    fontSize: 16,
  },
  mainInfo: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  itemName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff3cd",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: "600",
    color: "#856404",
  },
  brandText: {
    fontSize: 18,
    color: "#007AFF",
    fontWeight: "600",
    marginBottom: 8,
  },
  categoryContainer: {
    alignSelf: "flex-start",
  },
  categoryText: {
    backgroundColor: "#e3f2fd",
    color: "#1976d2",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    fontSize: 14,
    fontWeight: "500",
  },
  statsContainer: {
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
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statCard: {
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 12,
    minWidth: 80,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 8,
  },
  statTitle: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    textAlign: "center",
  },
  detailsContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    color: "#666",
    marginLeft: 12,
    minWidth: 100,
  },
  infoValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
    flex: 1,
  },
  seasonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    flex: 1,
  },
  seasonChip: {
    backgroundColor: "#e8f5e8",
    color: "#2e7d32",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 12,
    marginRight: 4,
    marginBottom: 4,
  },
  occasionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    flex: 1,
  },
  occasionChip: {
    backgroundColor: "#fff3e0",
    color: "#ef6c00",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 12,
    marginRight: 4,
    marginBottom: 4,
  },
  purchaseContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  careContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  careText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
  },
  notesContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  notesText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    fontStyle: "italic",
  },
  actionsContainer: {
    padding: 20,
    gap: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#007AFF",
    borderRadius: 8,
    padding: 16,
  },
  actionButtonText: {
    color: "#007AFF",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },
  deleteButton: {
    borderColor: "#ff3b30",
  },
  deleteButtonText: {
    color: "#ff3b30",
  },
  bottomSpacing: {
    height: 100,
  },

  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingTop: 60,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  saveButton: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  editInput: {
    borderWidth: 1,
    borderColor: "#e9ecef",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
});
