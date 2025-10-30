import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  FlatList,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { auth } from "../services/firebase";
import { getOutfits, logOutfitUsage } from "../services/wardrobeService";
import { useNavigation } from "@react-navigation/native";

export default function TrackUsageScreen() {
  const [photo, setPhoto] = useState(null);
  const [outfits, setOutfits] = useState([]);
  const [selectedOutfit, setSelectedOutfit] = useState(null);
  const userId = auth.currentUser?.uid;
  const navigation = useNavigation();

  const fetchOutfits = async () => {
    const data = await getOutfits(userId);
    setOutfits(data);
  };

  useEffect(() => {
    fetchOutfits();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Camera access is needed.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.7,
    });
    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!selectedOutfit) {
      Alert.alert("Select an outfit", "Please choose or create one.");
      return;
    }
    await logOutfitUsage(userId, {
      outfitId: selectedOutfit.id,
      outfitName: selectedOutfit.name,
      photoUri: photo,
    });
    Alert.alert("Logged!", "Your outfit has been saved for today.");
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📸 Track Today's Outfit</Text>

      <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
        <Text style={styles.photoText}>Take Photo</Text>
      </TouchableOpacity>

      {photo && <Image source={{ uri: photo }} style={styles.preview} />}

      <Text style={styles.subtitle}>Select your outfit:</Text>
      <FlatList
        data={outfits}
        horizontal
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.outfitCard,
              selectedOutfit?.id === item.id && styles.selected,
            ]}
            onPress={() => setSelectedOutfit(item)}
          >
            <Text style={styles.outfitName}>{item.name}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No outfits yet.{" "}
            <Text
              style={styles.link}
              onPress={() => navigation.navigate("OutfitCreator")}
            >
              Create one
            </Text>
          </Text>
        }
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Today's Outfit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  photoButton: {
    backgroundColor: "#007AFF",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  photoText: { color: "#fff", fontWeight: "600" },
  preview: {
    width: "100%",
    height: 300,
    borderRadius: 12,
    marginVertical: 10,
  },
  subtitle: { fontSize: 16, fontWeight: "600", marginVertical: 10 },
  outfitCard: {
    backgroundColor: "#f2f2f2",
    padding: 12,
    borderRadius: 10,
    marginRight: 10,
  },
  selected: { backgroundColor: "#cce5ff" },
  outfitName: { fontSize: 14, fontWeight: "500" },
  saveButton: {
    backgroundColor: "#007AFF",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  emptyText: { color: "#777", marginTop: 20 },
  link: { color: "#007AFF", textDecorationLine: "underline" },
});
