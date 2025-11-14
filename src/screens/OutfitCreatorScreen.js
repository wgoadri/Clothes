// src/screens/OutfitCreatorScreen.js - REFACTORED VERSION

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { addDoc, collection, updateDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "../services/firebase";
import { getWardrobeItems } from "../services/wardrobeService";

// Components
import OutfitProgressSteps from "../components/outfit-creator/OutfitProgressSteps";
import OutfitImageUploader from "../components/outfit-creator/OutfitImageUploader";
import OutfitItemSelector from "../components/outfit-creator/OutfitItemSelector";
import OutfitDetailsForm from "../components/outfit-creator/OutfitDetailsForm";

// Constants
import { OUTFIT_STEPS } from "../constants/outfitConstants";

export default function OutfitCreatorScreen({ route, navigation }) {
  const { preselectedItem, editOutfit } = route.params || {};
  const isEditing = !!editOutfit;
  const userId = auth.currentUser?.uid;

  // Step management
  const [currentStep, setCurrentStep] = useState(
    isEditing ? OUTFIT_STEPS.SELECT : OUTFIT_STEPS.UPLOAD
  );

  // Outfit data
  const [outfitImage, setOutfitImage] = useState(editOutfit?.image || null);
  const [outfitName, setOutfitName] = useState(editOutfit?.name || "");
  const [description, setDescription] = useState(editOutfit?.description || "");
  const [notes, setNotes] = useState(editOutfit?.notes || "");
  const [seasons, setSeasons] = useState(editOutfit?.seasons || []);
  const [occasions, setOccasions] = useState(editOutfit?.occasions || []);

  // Wardrobe items
  const [wardrobeItems, setWardrobeItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState(editOutfit?.items || []);

  // UI state
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchWardrobeItems();
  }, []);

  useEffect(() => {
    if (preselectedItem && !selectedItems.includes(preselectedItem.id)) {
      setSelectedItems([...selectedItems, preselectedItem.id]);
    }
  }, [preselectedItem]);

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

  const uploadImageToStorage = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const filename = `outfits/${userId}/${Date.now()}.jpg`;
      const storageRef = ref(storage, filename);

      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const toggleItemSelection = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const validateStep = () => {
    if (currentStep === OUTFIT_STEPS.UPLOAD && !outfitImage) {
      Alert.alert(
        "Picture Required",
        "Please upload an outfit picture to continue"
      );
      return false;
    }
    if (currentStep === OUTFIT_STEPS.SELECT && selectedItems.length === 0) {
      Alert.alert(
        "Items Required",
        "Please select at least one item for your outfit"
      );
      return false;
    }
    if (currentStep === OUTFIT_STEPS.DETAILS && !outfitName.trim()) {
      Alert.alert("Name Required", "Please enter a name for your outfit");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, OUTFIT_STEPS.DETAILS));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, OUTFIT_STEPS.UPLOAD));
  };

  const handleStepPress = (step) => {
    if (step < currentStep || isEditing) {
      setCurrentStep(step);
    }
  };

  const handleSave = async () => {
    if (!validateStep()) return;

    try {
      setUploading(true);

      // Upload image if it's a local URI
      let imageUrl = outfitImage;
      if (outfitImage && outfitImage.startsWith("file://")) {
        imageUrl = await uploadImageToStorage(outfitImage);
      }

      const selectedItemsData = wardrobeItems.filter((item) =>
        selectedItems.includes(item.id)
      );

      const outfitData = {
        name: outfitName.trim(),
        description: description.trim(),
        notes: notes.trim(),
        image: imageUrl,
        items: selectedItems,
        previewImages: selectedItemsData
          .filter((item) => item.image)
          .map((item) => item.image),
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
    } finally {
      setUploading(false);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case OUTFIT_STEPS.UPLOAD:
        return (
          <OutfitImageUploader
            image={outfitImage}
            onImageSelected={setOutfitImage}
            onGenerateName={setOutfitName}
          />
        );

      case OUTFIT_STEPS.SELECT:
        return (
          <OutfitItemSelector
            outfitImage={outfitImage}
            wardrobeItems={wardrobeItems}
            selectedItems={selectedItems}
            onItemToggle={toggleItemSelection}
            loading={loading}
          />
        );

      case OUTFIT_STEPS.DETAILS:
        return (
          <OutfitDetailsForm
            outfitImage={outfitImage}
            selectedItemsCount={selectedItems.length}
            name={outfitName}
            description={description}
            notes={notes}
            seasons={seasons}
            occasions={occasions}
            onNameChange={setOutfitName}
            onDescriptionChange={setDescription}
            onNotesChange={setNotes}
            onSeasonsChange={setSeasons}
            onOccasionsChange={setOccasions}
          />
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#FAF8F5", "#F5EDE5"]}
        style={styles.backgroundGradient}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color="#6B5B4D" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditing ? "Edit Outfit" : "Create Outfit"}
        </Text>
        <View style={styles.headerRight} />
      </View>

      {/* Progress Steps */}
      {!isEditing && (
        <OutfitProgressSteps
          currentStep={currentStep}
          onStepPress={handleStepPress}
          isEditing={isEditing}
        />
      )}

      {/* Content */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderCurrentStep()}
      </ScrollView>

      {/* Footer Actions */}
      <View style={styles.footer}>
        <LinearGradient
          colors={["rgba(250, 248, 245, 0.95)", "#FAF8F5"]}
          style={styles.footerGradient}
        >
          <View style={styles.footerContent}>
            {currentStep > OUTFIT_STEPS.UPLOAD && (
              <TouchableOpacity
                style={styles.footerSecondaryButton}
                onPress={handleBack}
              >
                <MaterialIcons name="arrow-back" size={20} color="#8B7355" />
                <Text style={styles.footerSecondaryText}>Back</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[
                styles.footerPrimaryButton,
                currentStep === OUTFIT_STEPS.UPLOAD &&
                  styles.footerPrimaryButtonFull,
              ]}
              onPress={
                currentStep === OUTFIT_STEPS.DETAILS ? handleSave : handleNext
              }
              disabled={uploading}
            >
              <LinearGradient
                colors={["#C9A07A", "#A47E5C"]}
                style={styles.footerPrimaryGradient}
              >
                {uploading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text style={styles.footerPrimaryText}>
                      {currentStep === OUTFIT_STEPS.DETAILS
                        ? isEditing
                          ? "Update Outfit"
                          : "Create Outfit"
                        : "Next"}
                    </Text>
                    {currentStep < OUTFIT_STEPS.DETAILS && (
                      <MaterialIcons
                        name="arrow-forward"
                        size={20}
                        color="#fff"
                      />
                    )}
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF8F5",
  },
  backgroundGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 16,
    backgroundColor: "transparent",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5EDE5",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "300",
    color: "#6B5B4D",
    letterSpacing: 0.5,
  },
  headerRight: {
    width: 40,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: "#8B7355",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
  },
  footerGradient: {
    paddingTop: 16,
    paddingBottom: Platform.OS === "ios" ? 34 : 16,
    paddingHorizontal: 16,
  },
  footerContent: {
    flexDirection: "row",
    gap: 12,
  },
  footerSecondaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5EDE5",
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "#E8DED2",
  },
  footerSecondaryText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#8B7355",
    marginLeft: 8,
  },
  footerPrimaryButton: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  footerPrimaryButtonFull: {
    flex: 2,
  },
  footerPrimaryGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  footerPrimaryText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FAF8F5",
    marginRight: 8,
  },
});
