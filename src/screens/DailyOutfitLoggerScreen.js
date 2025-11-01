import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  TextInput
} from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { auth } from "../services/firebase";
import { 
  getOutfits, 
  logDailyOutfit, 
  getTodayOutfit 
} from "../services/wardrobeService";

export default function DailyOutfitLoggerScreen({ navigation }) {
  const [selectedOutfit, setSelectedOutfit] = useState(null);
  const [outfits, setOutfits] = useState([]);
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState("");
  const [photos, setPhotos] = useState([]);
  const [todayLog, setTodayLog] = useState(null);
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [outfitsData, todayData] = await Promise.all([
      getOutfits(userId),
      getTodayOutfit(userId)
    ]);
    
    setOutfits(outfitsData);
    setTodayLog(todayData);
    
    if (todayData) {
      setSelectedOutfit(outfitsData.find(o => o.id === todayData.outfitId));
      setRating(todayData.rating || 0);
      setNotes(todayData.notes || "");
      setPhotos(todayData.photos || []);
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.7,
    });

    if (!result.canceled) {
      setPhotos(prev => [...prev, result.assets[0].uri]);
    }
  };

  const handleSave = async () => {
    if (!selectedOutfit) {
      Alert.alert("Select an outfit", "Please choose an outfit first.");
      return;
    }

    const logData = {
      date: new Date().toISOString().split('T')[0],
      outfitId: selectedOutfit.id,
      outfitName: selectedOutfit.name,
      items: selectedOutfit.items,
      rating,
      notes,
      photos,
      occasion: "daily"
    };

    try {
      await logDailyOutfit(userId, logData);
      Alert.alert(
        "Outfit logged! 🎉", 
        "Your daily outfit has been saved.",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to save outfit log.");
    }
  };

  const renderStars = () => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setRating(star)}
          >
            <AntDesign
              name={star <= rating ? "star" : "staro"}
              size={30}
              color={star <= rating ? "#FFD700" : "#ccc"}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        📅 Today's Outfit {todayLog ? "(Already logged)" : ""}
      </Text>

      {/* Sélection d'outfit */}
      <Text style={styles.sectionTitle}>Choose your outfit:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {outfits.map((outfit) => (
          <TouchableOpacity
            key={outfit.id}
            style={[
              styles.outfitCard,
              selectedOutfit?.id === outfit.id && styles.selectedOutfit
            ]}
            onPress={() => setSelectedOutfit(outfit)}
          >
            <View style={styles.previewRow}>
              {outfit.previewImages?.slice(0, 2).map((uri, index) => (
                <Image key={index} source={{ uri }} style={styles.miniPreview} />
              ))}
            </View>
            <Text style={styles.outfitName}>{outfit.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Rating */}
      <Text style={styles.sectionTitle}>How did it feel?</Text>
      {renderStars()}

      {/* Notes */}
      <Text style={styles.sectionTitle}>Notes (optional):</Text>
      <TextInput
        style={styles.notesInput}
        placeholder="How was your day? Any compliments?"
        value={notes}
        onChangeText={setNotes}
        multiline
      />

      {/* Photos */}
      <View style={styles.photoSection}>
        <Text style={styles.sectionTitle}>Add photos:</Text>
        <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
          <MaterialIcons name="camera-alt" size={24} color="#007AFF" />
          <Text style={styles.photoButtonText}>Take Photo</Text>
        </TouchableOpacity>
        
        <ScrollView horizontal>
          {photos.map((uri, index) => (
            <Image key={index} source={{ uri }} style={styles.photoPreview} />
          ))}
        </ScrollView>
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>
          {todayLog ? "Update Today's Log" : "Log Today's Outfit"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
  },
  outfitCard: {
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    width: 120,
    alignItems: "center",
  },
  selectedOutfit: {
    backgroundColor: "#e3f2fd",
    borderWidth: 2,
    borderColor: "#007AFF",
  },
  previewRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  miniPreview: {
    width: 40,
    height: 40,
    borderRadius: 6,
    marginRight: 4,
  },
  outfitName: {
    fontSize: 12,
    textAlign: "center",
    fontWeight: "500",
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    height: 80,
    textAlignVertical: "top",
  },
  photoSection: {
    marginTop: 20,
  },
  photoButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  photoButtonText: {
    marginLeft: 8,
    color: "#007AFF",
    fontWeight: "500",
  },
  photoPreview: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
