import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  Modal,
  FlatList,
} from "react-native";
import { addDoc, collection } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { auth, db } from "../services/firebase";
import BottomBar from "../components/BottomBar";

const CATEGORIES = [
  { id: 'tops', name: 'Tops', icon: 'shirt-outline' },
  { id: 'bottoms', name: 'Bottoms', icon: 'fitness-outline' },
  { id: 'dresses', name: 'Dresses', icon: 'woman-outline' },
  { id: 'outerwear', name: 'Outerwear', icon: 'jacket-outline' },
  { id: 'shoes', name: 'Shoes', icon: 'footsteps-outline' },
  { id: 'accessories', name: 'Accessories', icon: 'watch-outline' },
  { id: 'underwear', name: 'Underwear', icon: 'body-outline' },
  { id: 'activewear', name: 'Activewear', icon: 'fitness-outline' },
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '34', '36', '38', '40', '42', '44', '46'];

const COLORS = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Gray', hex: '#808080' },
  { name: 'Navy', hex: '#000080' },
  { name: 'Blue', hex: '#0066CC' },
  { name: 'Red', hex: '#FF0000' },
  { name: 'Green', hex: '#008000' },
  { name: 'Yellow', hex: '#FFFF00' },
  { name: 'Pink', hex: '#FFC0CB' },
  { name: 'Purple', hex: '#800080' },
  { name: 'Brown', hex: '#8B4513' },
  { name: 'Orange', hex: '#FFA500' },
  { name: 'Beige', hex: '#F5F5DC' },
  { name: 'Burgundy', hex: '#800020' },
];

const SEASONS = [
  { id: 'spring', name: 'Spring', icon: 'flower-outline' },
  { id: 'summer', name: 'Summer', icon: 'sunny-outline' },
  { id: 'autumn', name: 'Autumn', icon: 'leaf-outline' },
  { id: 'winter', name: 'Winter', icon: 'snow-outline' },
  { id: 'all', name: 'All Seasons', icon: 'calendar-outline' },
];

const OCCASIONS = [
  'Casual', 'Work', 'Formal', 'Party', 'Sport', 'Beach', 'Travel', 'Date', 'Wedding'
];

export default function AddClothesScreen({ navigation }) {
  // Basic field
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  
  // Extra fields
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [material, setMaterial] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [purchaseLocation, setPurchaseLocation] = useState("");
  const [seasons, setSeasons] = useState([]);
  const [occasions, setOccasions] = useState([]);
  const [notes, setNotes] = useState("");
  const [careInstructions, setCareInstructions] = useState("");
  
  // Modals
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [colorModalVisible, setColorModalVisible] = useState(false);
  const [sizeModalVisible, setSizeModalVisible] = useState(false);
  const [seasonModalVisible, setSeasonModalVisible] = useState(false);
  const [occasionModalVisible, setOccasionModalVisible] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to add photos.');
      return;
    }

    Alert.alert(
      "Select Image",
      "Choose how you want to add an image",
      [
        { text: "Camera", onPress: () => openCamera() },
        { text: "Gallery", onPress: () => openGallery() },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera permissions.');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const openGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const toggleSeason = (seasonId) => {
    setSeasons(prev => 
      prev.includes(seasonId) 
        ? prev.filter(s => s !== seasonId)
        : [...prev, seasonId]
    );
  };

  const toggleOccasion = (occasion) => {
    setOccasions(prev => 
      prev.includes(occasion) 
        ? prev.filter(o => o !== occasion)
        : [...prev, occasion]
    );
  };

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert("Validation Error", "Please enter an item name");
      return false;
    }
    if (!category) {
      Alert.alert("Validation Error", "Please select a category");
      return false;
    }
    if (price && isNaN(parseFloat(price))) {
      Alert.alert("Validation Error", "Please enter a valid price");
      return false;
    }
    return true;
  };

  const handleAdd = async () => {
    if (!validateForm()) return;

    const userId = auth.currentUser.uid;

    try {
      const itemData = {
        // Basic fields
        name: name.trim(),
        category,
        image,
        
        // Extra fields
        brand: brand.trim(),
        price: price ? parseFloat(price) : null,
        size: size.trim(),
        color,
        material: material.trim(),
        purchaseDate: purchaseDate.trim(),
        purchaseLocation: purchaseLocation.trim(),
        seasons,
        occasions,
        notes: notes.trim(),
        careInstructions: careInstructions.trim(),
        
        // Tracking
        usageHistory: [],
        wearCount: 0,
        lastWorn: null,
        totalRating: 0,
        createdAt: new Date().toISOString(),
        
        // Metadata
        isActive: true,
        tags: [], 
      };

      await addDoc(collection(db, "users", userId, "wardrobe"), itemData);

      // Reset form
      resetForm();

      Alert.alert(
        "Success! 🎉", 
        "Item added to your wardrobe!",
        [
          { text: "Add Another", onPress: () => {} },
          { text: "View Wardrobe", onPress: () => navigation.navigate("Wardrobe") }
        ]
      );
    } catch (error) {
      console.error("Error adding item:", error);
      Alert.alert("Error", "Failed to add item. Please try again.");
    }
  };

  const resetForm = () => {
    setName("");
    setCategory("");
    setImage(null);
    setBrand("");
    setPrice("");
    setSize("");
    setColor("");
    setMaterial("");
    setPurchaseDate("");
    setPurchaseLocation("");
    setSeasons([]);
    setOccasions([]);
    setNotes("");
    setCareInstructions("");
  };

  const renderCategoryModal = () => (
    <Modal visible={categoryModalVisible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Category</Text>
            <TouchableOpacity onPress={() => setCategoryModalVisible(false)}>
              <MaterialIcons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={CATEGORIES}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.modalItem,
                  category === item.name && styles.selectedModalItem
                ]}
                onPress={() => {
                  setCategory(item.name);
                  setCategoryModalVisible(false);
                }}
              >
                <Ionicons name={item.icon} size={24} color="#007AFF" />
                <Text style={styles.modalItemText}>{item.name}</Text>
                {category === item.name && (
                  <MaterialIcons name="check" size={20} color="#007AFF" />
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );

  const renderColorModal = () => (
    <Modal visible={colorModalVisible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Color</Text>
            <TouchableOpacity onPress={() => setColorModalVisible(false)}>
              <MaterialIcons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={COLORS}
            numColumns={3}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.colorItem,
                  color === item.name && styles.selectedColorItem
                ]}
                onPress={() => {
                  setColor(item.name);
                  setColorModalVisible(false);
                }}
              >
                <View style={[styles.colorCircle, { backgroundColor: item.hex }]} />
                <Text style={styles.colorName}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );

  const renderSizeModal = () => (
    <Modal visible={sizeModalVisible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Size</Text>
            <TouchableOpacity onPress={() => setSizeModalVisible(false)}>
              <MaterialIcons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={SIZES}
            numColumns={4}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.sizeItem,
                  size === item && styles.selectedSizeItem
                ]}
                onPress={() => {
                  setSize(item);
                  setSizeModalVisible(false);
                }}
              >
                <Text style={[
                  styles.sizeText,
                  size === item && styles.selectedSizeText
                ]}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>👕 Add New Item</Text>

        {/* Image Section */}
        <View style={styles.imageSection}>
          <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
            {image ? (
              <Image source={{ uri: image }} style={styles.imagePreview} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <MaterialIcons name="add-a-photo" size={40} color="#ccc" />
                <Text style={styles.imagePlaceholderText}>Add Photo</Text>
              </View>
            )}
          </TouchableOpacity>
          {image && (
            <TouchableOpacity 
              style={styles.removeImageButton}
              onPress={() => setImage(null)}
            >
              <MaterialIcons name="close" size={20} color="#fff" />
            </TouchableOpacity>
          )}
        </View>

        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 Basic Information</Text>
          
          <TextInput
            placeholder="Item name (e.g. Red Cotton T-shirt)"
            value={name}
            onChangeText={setName}
            style={styles.input}
            maxLength={50}
          />

          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => setCategoryModalVisible(true)}
          >
            <Text style={[styles.selectButtonText, !category && styles.placeholder]}>
              {category || "Select Category"}
            </Text>
            <MaterialIcons name="keyboard-arrow-down" size={24} color="#666" />
          </TouchableOpacity>

          <TextInput
            placeholder="Brand (e.g. Nike, Zara, H&M)"
            value={brand}
            onChangeText={setBrand}
            style={styles.input}
            maxLength={30}
          />
        </View>

        {/* Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏷️ Details</Text>
          
          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <TextInput
                placeholder="Price (€)"
                value={price}
                onChangeText={setPrice}
                style={styles.input}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.halfWidth}>
              <TouchableOpacity
                style={styles.selectButton}
                onPress={() => setSizeModalVisible(true)}
              >
                <Text style={[styles.selectButtonText, !size && styles.placeholder]}>
                                    {size || "Size"}
                </Text>
                <MaterialIcons name="keyboard-arrow-down" size={24} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => setColorModalVisible(true)}
          >
            <View style={styles.colorPreview}>
              {color && (
                <View style={[
                  styles.colorDot, 
                  { backgroundColor: COLORS.find(c => c.name === color)?.hex || '#ccc' }
                ]} />
              )}
              <Text style={[styles.selectButtonText, !color && styles.placeholder]}>
                {color || "Select Color"}
              </Text>
            </View>
            <MaterialIcons name="keyboard-arrow-down" size={24} color="#666" />
          </TouchableOpacity>

          <TextInput
            placeholder="Material (e.g. Cotton, Polyester, Wool)"
            value={material}
            onChangeText={setMaterial}
            style={styles.input}
            maxLength={30}
          />
        </View>

        {/* Purchase Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🛍️ Purchase Info</Text>
          
          <TextInput
            placeholder="Purchase date (e.g. 2024-01-15)"
            value={purchaseDate}
            onChangeText={setPurchaseDate}
            style={styles.input}
          />

          <TextInput
            placeholder="Where did you buy it? (e.g. Zara Store, Online)"
            value={purchaseLocation}
            onChangeText={setPurchaseLocation}
            style={styles.input}
            maxLength={50}
          />
        </View>

        {/* Seasons */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🌤️ Suitable Seasons</Text>
          <View style={styles.chipContainer}>
            {SEASONS.map((season) => (
              <TouchableOpacity
                key={season.id}
                style={[
                  styles.chip,
                  seasons.includes(season.id) && styles.selectedChip
                ]}
                onPress={() => toggleSeason(season.id)}
              >
                <Ionicons 
                  name={season.icon} 
                  size={16} 
                  color={seasons.includes(season.id) ? "#fff" : "#007AFF"} 
                />
                <Text style={[
                  styles.chipText,
                  seasons.includes(season.id) && styles.selectedChipText
                ]}>
                  {season.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Occasions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎭 Suitable Occasions</Text>
          <View style={styles.chipContainer}>
            {OCCASIONS.map((occasion) => (
              <TouchableOpacity
                key={occasion}
                style={[
                  styles.chip,
                  occasions.includes(occasion) && styles.selectedChip
                ]}
                onPress={() => toggleOccasion(occasion)}
              >
                <Text style={[
                  styles.chipText,
                  occasions.includes(occasion) && styles.selectedChipText
                ]}>
                  {occasion}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Care Instructions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🧼 Care Instructions</Text>
          <TextInput
            placeholder="How to care for this item? (e.g. Machine wash cold, Dry clean only)"
            value={careInstructions}
            onChangeText={setCareInstructions}
            style={[styles.input, styles.textArea]}
            multiline
            numberOfLines={3}
            maxLength={200}
          />
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 Personal Notes</Text>
          <TextInput
            placeholder="Any additional notes? (e.g. Gift from mom, Favorite for dates)"
            value={notes}
            onChangeText={setNotes}
            style={[styles.input, styles.textArea]}
            multiline
            numberOfLines={3}
            maxLength={200}
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.secondaryButton} onPress={resetForm}>
            <MaterialIcons name="refresh" size={20} color="#007AFF" />
            <Text style={styles.secondaryButtonText}>Reset Form</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.primaryButton} onPress={handleAdd}>
            <MaterialIcons name="add" size={20} color="#fff" />
            <Text style={styles.primaryButtonText}>Add to Wardrobe</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom spacing for BottomBar */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Modals */}
      {renderCategoryModal()}
      {renderColorModal()}
      {renderSizeModal()}

      {/* BottomBar */}
      <BottomBar navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff" 
  },
  scrollContainer: { 
    flex: 1, 
    padding: 20 
  },
  title: { 
    fontSize: 24, 
    fontWeight: "bold", 
    marginBottom: 24,
    textAlign: "center"
  },

  // Image Section
  imageSection: {
    alignItems: "center",
    marginBottom: 24,
    position: "relative",
  },
  imageButton: {
    width: 120,
    height: 120,
    borderRadius: 12,
    overflow: "hidden",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e9ecef",
    borderStyle: "dashed",
  },
  imagePlaceholderText: {
    marginTop: 8,
    fontSize: 14,
    color: "#666",
  },
  removeImageButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#ff3b30",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },

  // Sections
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },

  // Form Elements
  input: {
    borderWidth: 1,
    borderColor: "#e9ecef",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  selectButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e9ecef",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  selectButtonText: {
    fontSize: 16,
    color: "#333",
  },
  placeholder: {
    color: "#999",
  },

  // Layout
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfWidth: {
    width: "48%",
  },

  // Color Preview
  colorPreview: {
    flexDirection: "row",
    alignItems: "center",
  },
  colorDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  // Chips
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#007AFF",
    backgroundColor: "#fff",
  },
  selectedChip: {
    backgroundColor: "#007AFF",
  },
  chipText: {
    fontSize: 14,
    color: "#007AFF",
    marginLeft: 4,
  },
  selectedChipText: {
    color: "#fff",
  },

  // Buttons
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  secondaryButtonText: {
    color: "#007AFF",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f8f9fa",
  },
  selectedModalItem: {
    backgroundColor: "#f0f8ff",
  },
  modalItemText: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },

  // Color Modal
  colorItem: {
    flex: 1,
    alignItems: "center",
    padding: 12,
    margin: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  selectedColorItem: {
    borderColor: "#007AFF",
    backgroundColor: "#f0f8ff",
  },
  colorCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  colorName: {
    fontSize: 12,
    textAlign: "center",
  },

  // Size Modal
  sizeItem: {
    flex: 1,
    alignItems: "center",
    padding: 12,
    margin: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
    minHeight: 50,
    justifyContent: "center",
  },
  selectedSizeItem: {
    borderColor: "#007AFF",
    backgroundColor: "#007AFF",
  },
  sizeText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  selectedSizeText: {
    color: "#fff",
  },

  bottomSpacing: {
    height: 100, // Space for BottomBar
  },
});
