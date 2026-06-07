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
  FlatList,
} from "react-native";
import {
  MaterialIcons,
  FontAwesome,
  AntDesign,
  Ionicons,
} from "@expo/vector-icons";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import { getWardrobeItems } from "../services/wardrobeService";
import { logDailyOutfit } from "../services/outfitService";
import BottomBar from "../components/BottomBar";
import { sharedDetailStyles } from "../styles/shared/detail";
import { outfitDetailStyles } from "../styles/screens/outfitDetail";

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
      Alert.alert("Success", "Outfit updated successfully");
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
        "Outfit Logged",
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
      Alert.alert("Error", "Failed to log outfit for today");
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
      <View style={sharedDetailStyles.modalContainer}>
        <View style={sharedDetailStyles.modalHeader}>
          <TouchableOpacity
            onPress={() => setEditModalVisible(false)}
            style={sharedDetailStyles.modalCloseButton}
          >
            <MaterialIcons name="close" size={24} color="#8B7355" />
          </TouchableOpacity>
          <Text style={sharedDetailStyles.modalTitle}>Edit Outfit</Text>
          <TouchableOpacity onPress={handleUpdate}>
            <Text style={sharedDetailStyles.saveButton}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={sharedDetailStyles.modalContent}>
          <Text style={sharedDetailStyles.inputLabel}>Outfit Name</Text>
          <TextInput
            style={sharedDetailStyles.editInput}
            value={editedOutfit.name}
            onChangeText={(text) =>
              setEditedOutfit({ ...editedOutfit, name: text })
            }
            placeholder="Enter outfit name"
            placeholderTextColor="#A89888"
          />

          <Text style={sharedDetailStyles.inputLabel}>Description</Text>
          <TextInput
            style={[sharedDetailStyles.editInput, sharedDetailStyles.textArea]}
            value={editedOutfit.description || ""}
            onChangeText={(text) =>
              setEditedOutfit({ ...editedOutfit, description: text })
            }
            placeholder="Add a description"
            placeholderTextColor="#A89888"
            multiline
            numberOfLines={3}
          />

          <Text style={sharedDetailStyles.inputLabel}>Personal Notes</Text>
          <TextInput
            style={[sharedDetailStyles.editInput, sharedDetailStyles.textArea]}
            value={editedOutfit.notes || ""}
            onChangeText={(text) =>
              setEditedOutfit({ ...editedOutfit, notes: text })
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

  const renderItemCard = ({ item: itemId }) => {
    const itemDetails = getItemDetails(itemId);
    if (!itemDetails) return null;

    return (
      <TouchableOpacity
        style={outfitDetailStyles.itemCard}
        onPress={() =>
          navigation.navigate("ClothesDetail", { item: itemDetails })
        }
        activeOpacity={0.8}
      >
        {itemDetails.image ? (
          <Image
            source={{ uri: itemDetails.image }}
            style={outfitDetailStyles.itemImage}
          />
        ) : (
          <View style={outfitDetailStyles.itemImagePlaceholder}>
            <Ionicons name="shirt-outline" size={24} color="#C9A07A" />
          </View>
        )}
        <View style={outfitDetailStyles.itemInfo}>
          <Text style={outfitDetailStyles.itemName} numberOfLines={1}>
            {itemDetails.name}
          </Text>
          <Text style={outfitDetailStyles.itemCategory}>
            {itemDetails.category}
          </Text>
          {itemDetails.brand && (
            <Text style={outfitDetailStyles.itemBrand}>
              {itemDetails.brand}
            </Text>
          )}
        </View>
        <MaterialIcons name="chevron-right" size={20} color="#E8DED2" />
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
    <View style={sharedDetailStyles.container}>
      <ScrollView
        style={sharedDetailStyles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={sharedDetailStyles.header}>
          <TouchableOpacity
            style={sharedDetailStyles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#8B7355" />
          </TouchableOpacity>

          <View style={sharedDetailStyles.headerActions}>
            <TouchableOpacity
              style={sharedDetailStyles.headerActionButton}
              onPress={toggleFavorite}
              activeOpacity={0.7}
            >
              <FontAwesome
                name={currentOutfit.favorite ? "heart" : "heart-o"}
                size={22}
                color={currentOutfit.favorite ? "#D97757" : "#A89888"}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={sharedDetailStyles.headerActionButton}
              onPress={() => setEditModalVisible(true)}
              activeOpacity={0.7}
            >
              <MaterialIcons name="edit" size={22} color="#A89888" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Info */}
        <View style={sharedDetailStyles.mainInfo}>
          <View style={sharedDetailStyles.titleRow}>
            <Text style={sharedDetailStyles.itemName}>
              {currentOutfit.name}
            </Text>
            {averageRating && (
              <View style={sharedDetailStyles.ratingBadge}>
                <AntDesign name="star" size={14} color="#D4AF37" />
                <Text style={sharedDetailStyles.ratingText}>
                  {averageRating}
                </Text>
              </View>
            )}
          </View>

          {currentOutfit.description && (
            <Text style={outfitDetailStyles.description}>
              {currentOutfit.description}
            </Text>
          )}

          {/* Tags and badges */}
          <View style={outfitDetailStyles.tagsContainer}>
            {currentOutfit.favorite && (
              <View style={outfitDetailStyles.favoriteTag}>
                <AntDesign name="heart" size={10} color="#D97757" />
                <Text style={outfitDetailStyles.favoriteTagText}>Favorite</Text>
              </View>
            )}

            {currentOutfit.occasions &&
              currentOutfit.occasions.map((occasion, index) => (
                <View key={index} style={outfitDetailStyles.occasionTag}>
                  <Text style={outfitDetailStyles.occasionTagText}>
                    {occasion}
                  </Text>
                </View>
              ))}
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
              <Text style={sharedDetailStyles.statValue}>{wearCount}</Text>
              <Text style={sharedDetailStyles.statLabel}>Times Worn</Text>
            </View>

            <View style={sharedDetailStyles.statCard}>
              <View style={sharedDetailStyles.statIconContainer}>
                <MaterialIcons name="schedule" size={24} color="#C9A07A" />
              </View>
              <Text style={sharedDetailStyles.statValue}>{lastWorn}</Text>
              <Text style={sharedDetailStyles.statLabel}>Last Worn</Text>
            </View>

            {averageRating && (
              <View style={sharedDetailStyles.statCard}>
                <View style={sharedDetailStyles.statIconContainer}>
                  <AntDesign name="star" size={24} color="#D4AF37" />
                </View>
                <Text style={sharedDetailStyles.statValue}>
                  {averageRating}
                </Text>
                <Text style={sharedDetailStyles.statLabel}>Avg Rating</Text>
              </View>
            )}
          </View>
        </View>

        {/* Items */}
        <View style={outfitDetailStyles.itemsContainer}>
          <View style={sharedDetailStyles.sectionHeader}>
            <Ionicons name="shirt" size={20} color="#C9A07A" />
            <Text style={sharedDetailStyles.sectionTitle}>
              Items in this Outfit ({currentOutfit.items?.length || 0})
            </Text>
          </View>

          {currentOutfit.items && currentOutfit.items.length > 0 ? (
            <FlatList
              data={currentOutfit.items}
              keyExtractor={(item) => item}
              renderItem={renderItemCard}
              scrollEnabled={false}
            />
          ) : (
            <View style={sharedDetailStyles.emptyState}>
              <View style={sharedDetailStyles.emptyIconContainer}>
                <MaterialIcons name="style" size={40} color="#C9A07A" />
              </View>
              <Text style={sharedDetailStyles.emptyText}>
                No items in this outfit
              </Text>
            </View>
          )}
        </View>

        {/* Notes */}
        {currentOutfit.notes && (
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
                {currentOutfit.notes}
              </Text>
            </View>
          </View>
        )}

        {/* Actions */}
        <View style={sharedDetailStyles.actionsContainer}>
          <TouchableOpacity
            style={sharedDetailStyles.primaryAction}
            onPress={handleWearToday}
            activeOpacity={0.8}
          >
            <MaterialIcons name="today" size={20} color="#FAF8F5" />
            <Text style={sharedDetailStyles.primaryActionText}>Wear Today</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={sharedDetailStyles.secondaryAction}
            onPress={() =>
              navigation.navigate("OutfitCreator", {
                editOutfit: currentOutfit,
              })
            }
            activeOpacity={0.8}
          >
            <MaterialIcons name="edit" size={20} color="#C9A07A" />
            <Text style={sharedDetailStyles.secondaryActionText}>
              Edit Outfit
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
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal */}
      {renderEditModal()}
    </View>
  );
}
