import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useWardrobe } from "../context/WardrobeContext";

export default function AddClothesScreen({ navigation }) {
  const { addClothingItem } = useWardrobe();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");

  const handleAdd = () => {
    if (!name) return Alert.alert("Please enter a clothing name");

    const newItem = {
      id: Date.now().toString(),
      name,
      category: category || "Uncategorized",
    };

    addClothingItem(newItem);
    setName("");
    setCategory("");
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
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
