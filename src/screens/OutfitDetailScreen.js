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
  FlatList,
} from "react-native";
import { MaterialIcons, FontAwesome, AntDesign } from "@expo/vector-icons";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import { getWardrobeItems } from "../services/wardrobeService";
import { logDailyOutfit } from "../services/outfitService";
import BottomBar from "../components/BottomBar";

export default function OutfitDetailScreen({ route, navigation }) {
  const { outfit } = route.params;
  const [currentOutfit, setCurrentOutfit] = useState(outfit);
  const [wardrobeItems, setWardrobeItems] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedOutfit, setEditedOutfit] = useState({ ...outfit });
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    fetchWardrobeItems();
  }, []);

  const fetchWardrobeItems = async () => {
    try {
      const items = await getWardrobeItems(userId);
      setWardrobeItems(items);
    } catch (error) {
      console.error("Error fetching wardrobe items:", error);
    }
  };

  const getItemDetails = (itemId) => {
    return wardrobeItems.find((item) => item.id === itemId);
  };

  const handleUpdate = async () => {
    try {
      const outfitRef = doc(db, "users", userId, "outfits", outfit.id);
      await updateDoc(outfitRef, {
        ...editedOutfit,
        updatedAt: new Date().toISOString(),
      });

      setCurrentOutfit(editedOutfit);
      setEditModalVisible(false);
      Alert.alert("Success", "Outfit updated successfully!");
    } catch (error) {
      console.error("Error updating outfit:", error);
      Alert.alert("Error", "Failed to update outfit");
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Outfit",
      `Are you sure you want to delete "${currentOutfit.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const outfitRef = doc(db, "users", userId, "outfits", outfit.id);
              await deleteDoc(outfitRef);
              Alert.alert("Deleted", "Outfit removed from collection");
              navigation.goBack();
            } catch (error) {
              Alert.alert("Error", "Failed to delete outfit");
            }
          },
        },
      ]
    );
  };

  const handleWearToday = async () => {
    try {
      await logDailyOutfit(userId, { outfitId: currentOutfit.id });
      Alert.alert(
        "Outfit logged! 🎉",
        `"${currentOutfit.name}" has been logged for today. You can add rating and photos later.`,
        [
          { text: "OK" },
          {
            text: "Add Details",
            onPress: () => navigation.navigate("DailyOutfitLogger"),
          },
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to log outfit for today.");
      console.error("Wear today error:", error);
    }
  };

  const toggleFavorite = async () => {
    try {
      const outfitRef = doc(db, "users", userId, "outfits", outfit.id);
      const newFavoriteStatus = !currentOutfit.favorite;

      await updateDoc(outfitRef, { favorite: newFavoriteStatus });
      setCurrentOutfit({ ...currentOutfit, favorite: newFavoriteStatus });
    } catch (error) {
      Alert.alert("Error", "Failed to update favorite status");
    }
  };

  const renderEditModal = () => (
    <Modal visible={editModalVisible} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setEditModalVisible(false)}>
            <MaterialIcons name="close" size={24} color="#666" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Edit Outfit</Text>
          <TouchableOpacity onPress={handleUpdate}>
            <Text style={styles.saveButton}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          <TextInput
            style={styles.editInput}
            value={editedOutfit.name}
            onChangeText={(text) =>
              setEditedOutfit({ ...editedOutfit, name: text })
            }
            placeholder="Outfit name"
          />

          <TextInput
            style={[styles.editInput, styles.textArea]}
            value={editedOutfit.description || ""}
            onChangeText={(text) =>
              setEditedOutfit({ ...editedOutfit, description: text })
            }
            placeholder="Description"
            multiline
            numberOfLines={3}
          />

          <TextInput
            style={[styles.editInput, styles.textArea]}
            value={editedOutfit.notes || ""}
            onChangeText={(text) =>
              setEditedOutfit({ ...editedOutfit, notes: text })
            }
            placeholder="Personal notes"
            multiline
            numberOfLines={3}
          />
        </ScrollView>
      </View>
    </Modal>
  );

  const renderItemCard = ({ item: itemId }) => {
    const itemDetails = getItemDetails(itemId);
    if (!itemDetails) return null;

    return (
      <TouchableOpacity
        style={styles.itemCard}
        onPress={() =>
          navigation.navigate("ClothesDetail", { item: itemDetails })
        }
      >
        {itemDetails.image ? (
          <Image source={{ uri: itemDetails.image }} style={styles.itemImage} />
        ) : (
          <View style={styles.itemImagePlaceholder}>
            <MaterialIcons name="checkroom" size={24} color="#ccc" />
          </View>
        )}
        <View style={styles.itemInfo}>
          <Text style={styles.itemName} numberOfLines={1}>
            {itemDetails.name}
          </Text>
          <Text style={styles.itemCategory}>{itemDetails.category}</Text>
          {itemDetails.brand && (
            <Text style={styles.itemBrand}>{itemDetails.brand}</Text>
          )}
        </View>
        <MaterialIcons name="chevron-right" size={20} color="#ccc" />
      </TouchableOpacity>
    );
  };

  const wearCount = currentOutfit.wearCount || 0;
  const lastWorn = currentOutfit.lastWorn
    ? new Date(currentOutfit.lastWorn).toLocaleDateString()
    : "Never worn";
  const averageRating =
    wearCount > 0 && currentOutfit.totalRating > 0
      ? (currentOutfit.totalRating / wearCount).toFixed(1)
      : null;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header avec actions */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>

          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerActionButton}
              onPress={toggleFavorite}
            >
              <FontAwesome
                name={currentOutfit.favorite ? "heart" : "heart-o"}
                size={24}
                color={currentOutfit.favorite ? "#e63946" : "#666"}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.headerActionButton}
              onPress={() => setEditModalVisible(true)}
            >
              <MaterialIcons name="edit" size={24} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Informations principales */}
        <View style={styles.mainInfo}>
          <View style={styles.titleRow}>
            <Text style={styles.outfitName}>{currentOutfit.name}</Text>
            {averageRating && (
              <View style={styles.ratingBadge}>
                <AntDesign name="star" size={16} color="#FFD700" />
                <Text style={styles.ratingText}>{averageRating}</Text>
              </View>
            )}
          </View>

          {currentOutfit.description && (
            <Text style={styles.description}>{currentOutfit.description}</Text>
          )}

          {/* Tags and badges */}
          <View style={styles.tagsContainer}>
            {currentOutfit.favorite && (
              <View style={styles.favoriteTag}>
                <AntDesign name="heart" size={12} color="#e63946" />
                <Text style={styles.favoriteTagText}>Favorite</Text>
              </View>
            )}

            {currentOutfit.occasions &&
              currentOutfit.occasions.map((occasion, index) => (
                <View key={index} style={styles.occasionTag}>
                  <Text style={styles.occasionTagText}>{occasion}</Text>
                </View>
              ))}
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>📊 Usage Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <MaterialIcons name="loop" size={24} color="#4caf50" />
              <Text style={styles.statValue}>{wearCount}</Text>
              <Text style={styles.statLabel}>Times Worn</Text>
            </View>

            <View style={styles.statCard}>
              <MaterialIcons name="schedule" size={24} color="#007AFF" />
              <Text style={styles.statValue}>{lastWorn}</Text>
              <Text style={styles.statLabel}>Last Worn</Text>
            </View>

            {averageRating && (
              <View style={styles.statCard}>
                <AntDesign name="star" size={24} color="#FFD700" />
                <Text style={styles.statValue}>{averageRating}</Text>
                <Text style={styles.statLabel}>Avg Rating</Text>
              </View>
            )}
          </View>
        </View>

        {/* Items */}
        <View style={styles.itemsContainer}>
          <Text style={styles.sectionTitle}>
            👕 Items in this Outfit ({currentOutfit.items?.length || 0})
          </Text>

          {currentOutfit.items && currentOutfit.items.length > 0 ? (
            <FlatList
              data={currentOutfit.items}
              keyExtractor={(item) => item}
              renderItem={renderItemCard}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyItems}>
              <MaterialIcons name="style" size={48} color="#ccc" />
              <Text style={styles.emptyItemsText}>No items in this outfit</Text>
            </View>
          )}
        </View>

        {/* Rating */}
        {currentOutfit.notes && (
          <View style={styles.notesContainer}>
            <Text style={styles.sectionTitle}>📝 Personal Notes</Text>
            <Text style={styles.notesText}>{currentOutfit.notes}</Text>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.primaryAction}
            onPress={handleWearToday}
          >
            <MaterialIcons name="today" size={20} color="#fff" />
            <Text style={styles.primaryActionText}>Wear Today</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryAction}
            onPress={() =>
              navigation.navigate("OutfitCreator", {
                editOutfit: currentOutfit,
              })
            }
          >
            <MaterialIcons name="edit" size={20} color="#007AFF" />
            <Text style={styles.secondaryActionText}>Edit Outfit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryAction, styles.deleteAction]}
            onPress={handleDelete}
          >
            <MaterialIcons name="delete" size={20} color="#ff3b30" />
            <Text style={[styles.secondaryActionText, styles.deleteActionText]}>
              Delete
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    padding: 8,
  },
  headerActions: {
    flexDirection: "row",
    gap: 16,
  },
  headerActionButton: {
    padding: 8,
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
    marginBottom: 12,
  },
  outfitName: {
    fontSize: 28,
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
  description: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  favoriteTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffebee",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  favoriteTagText: {
    marginLeft: 4,
    fontSize: 12,
    color: "#e63946",
    fontWeight: "500",
  },
  occasionTag: {
    backgroundColor: "#e3f2fd",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  occasionTagText: {
    fontSize: 12,
    color: "#1976d2",
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
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 8,
    textAlign: "center",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    textAlign: "center",
  },
  itemsContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
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
  emptyItems: {
    alignItems: "center",
    padding: 40,
  },
  emptyItemsText: {
    fontSize: 16,
    color: "#999",
    marginTop: 8,
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
  primaryAction: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    borderRadius: 12,
    padding: 16,
  },
  primaryActionText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },
  secondaryAction: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#007AFF",
    borderRadius: 12,
    padding: 16,
  },
  secondaryActionText: {
    color: "#007AFF",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },
  deleteAction: {
    borderColor: "#ff3b30",
  },
  deleteActionText: {
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
