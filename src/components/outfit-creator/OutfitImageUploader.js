// src/components/outfit-creator/OutfitImageUploader.js

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import AIPlaceholder from "./AIPlaceholder";

export default function OutfitImageUploader({
  image,
  onImageSelected,
  onGenerateName,
}) {
  const pickImage = async (fromCamera = false) => {
    try {
      const options = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      };

      let result;
      if (fromCamera) {
        result = await ImagePicker.launchCameraAsync(options);
      } else {
        result = await ImagePicker.launchImageLibraryAsync(options);
      }

      if (!result.canceled && result.assets[0]) {
        onImageSelected(result.assets[0].uri);

        // Generate default name if callback provided
        if (onGenerateName) {
          const today = new Date();
          const defaultName = `Outfit - ${today.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}`;
          onGenerateName(defaultName);
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📸 Upload Your Outfit Picture</Text>
      <Text style={styles.subtitle}>
        Start by taking or selecting a photo of your outfit
      </Text>

      {image ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: image }} style={styles.preview} />
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => pickImage(false)}
            >
              <MaterialIcons name="photo-library" size={20} color="#8B7355" />
              <Text style={styles.actionText}>Replace</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => pickImage(true)}
            >
              <MaterialIcons name="camera-alt" size={20} color="#8B7355" />
              <Text style={styles.actionText}>Retake</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.uploadButtons}>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => pickImage(true)}
          >
            <LinearGradient
              colors={["#C9A07A", "#A47E5C"]}
              style={styles.uploadButtonGradient}
            >
              <View style={styles.uploadIconCircle}>
                <MaterialIcons name="camera-alt" size={28} color="#8B7355" />
              </View>
              <View style={styles.uploadTextContainer}>
                <Text style={styles.uploadButtonText}>Take Photo</Text>
                <Text style={styles.uploadButtonSubtext}>Use your camera</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => pickImage(false)}
          >
            <LinearGradient
              colors={["#B89968", "#9A7A54"]}
              style={styles.uploadButtonGradient}
            >
              <View style={styles.uploadIconCircle}>
                <MaterialIcons name="photo-library" size={28} color="#8B7355" />
              </View>
              <View style={styles.uploadTextContainer}>
                <Text style={styles.uploadButtonText}>Choose from Gallery</Text>
                <Text style={styles.uploadButtonSubtext}>
                  Select existing photo
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      <AIPlaceholder />
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
    marginBottom: 24,
    lineHeight: 20,
  },
  previewContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  preview: {
    width: "100%",
    height: 400,
    borderRadius: 16,
    marginBottom: 16,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5EDE5",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E8DED2",
  },
  actionText: {
    fontSize: 14,
    color: "#8B7355",
    fontWeight: "600",
    marginLeft: 8,
  },
  uploadButtons: {
    gap: 12,
    marginBottom: 20,
  },
  uploadButton: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#8B7355",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  uploadButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    minHeight: 80,
  },
  uploadIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(250, 248, 245, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  uploadTextContainer: {
    flex: 1,
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FAF8F5",
    marginBottom: 4,
  },
  uploadButtonSubtext: {
    fontSize: 12,
    color: "rgba(250, 248, 245, 0.75)",
  },
});
