import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { auth } from "../services/firebase";
import { getWardrobeItems, createOutfit } from "../services/wardrobeService";
import { useNavigation } from "@react-navigation/native";

export default function OutfitCreatorScreen() {
  const [name, setName] = useState("");
  const [wardrobe, setWardrobe] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const userId = auth.currentUser?.uid;
  const navigation = useNavigation();

  useEffect(() => {
    const fetchWardrobe = async () => {
      const data = await getWardrobeItems(userId);
      setWardrobe(data);
    };
    fetchWardrobe();
  }, []);

  const toggleSelect = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Name required", "Please enter an outfit name.");
      return;
    }
    if (selectedItems.length === 0) {
      Alert.alert("No items selected", "Select at least one clothing item.");
      return;
    }

    const selectedClothes = wardrobe.filter((item) =>
      selectedItems.includes(item.id)
    );

    const previewImages = selectedClothes
      .map((i) => i.image)
      .filter(Boolean)
      .slice(0, 3);

    await createOutfit(userId, {
      name,
      items: selectedItems,
      favorite: false,
      previewImages,
    });

    Alert.alert("Outfit saved!", "Your outfit has been created.");
    navigation.goBack();
  };

  const renderItem = ({ item }) => {
    const selected = selectedItems.includes(item.id);
    return (
      <TouchableOpacity
        onPress={() => toggleSelect(item.id)}
        style={[styles.itemCard, selected && { backgroundColor: "#d1e7ff" }]}
      >
        {item.image && (
          <Image source={{ uri: item.image }} style={styles.image} />
        )}
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemCategory}>{item.category}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>✨ Create Outfit</Text>
      <TextInput
        placeholder="Outfit name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <FlatList
        data={wardrobe}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Add some clothes first to create outfits!
          </Text>
        }
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Outfit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  itemCard: {
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    padding: 12,
    marginVertical: 6,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginBottom: 6,
  },
  itemName: { fontSize: 16, fontWeight: "600" },
  itemCategory: { fontSize: 13, color: "#666" },
  emptyText: {
    textAlign: "center",
    color: "#999",
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: "#007AFF",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
