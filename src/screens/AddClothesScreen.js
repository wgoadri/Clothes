import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { addDoc, collection } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import { auth, db } from "../services/firebase";

export default function AddClothesScreen({ navigation }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri); // Expo SDK 49+ uses result.assets
    }
  };

  const handleAdd = async () => {
    if (!name) return Alert.alert("Please enter a clothing name");

    const userId = auth.currentUser.uid;

    await addDoc(collection(db, "users", userId, "wardrobe"), {
      name,
      category,
      image,
      usageHistore: [],
    });

    // reset form
    setName("");
    setCategory("");
    setImage(null);

    Alert.alert("Success", "Item added to wardrobe!");
    navigation.navigate("Wardrobe");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👕 Add a Clothing Item</Text>

      <TextInput
        placeholder="Item name (e.g. Red T-shirt)"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Category (e.g. Tops, Pants)"
        value={category}
        onChangeText={setCategory}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Pick Image</Text>
      </TouchableOpacity>

      {image && <Image source={{ uri: image }} style={styles.preview} />}

      <TouchableOpacity style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>Add Item</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#333",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  preview: { width: 100, height: 100, borderRadius: 10, marginVertical: 10 },
});
