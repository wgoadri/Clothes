import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { auth } from "../services/firebase";
import { 
  getOutfits, 
  deleteOutfit, 
  toggleOutfitFavorite,
  logDailyOutfit
} from "../services/wardrobeService";
import OutfitItemCard from "../components/OutfitItemCard";
import BottomBar from "../components/BottomBar";

export default function OutfitsScreen({ navigation }) {
  const [outfits, setOutfits] = useState([]);
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    fetchOutfits();
  }, []);

  const fetchOutfits = async () => {
    const data = await getOutfits(userId);
    setOutfits(data);
  };

  const handleDelete = async (outfit) => {
    Alert.alert(
      "Delete Outfit",
      `Are you sure you want to delete "${outfit.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteOutfit(userId, outfit.id);
            fetchOutfits();
          },
        },
      ]
    );
  };

  const handleToggleFavorite = async (outfit) => {
    await toggleOutfitFavorite(userId, outfit.id, !outfit.favorite);
    fetchOutfits();
  };

  const handleWearToday = async (outfit) => {
    const logData = {
      date: new Date().toISOString().split('T')[0],
      outfitId: outfit.id,
      outfitName: outfit.name,
      items: outfit.items || [],
      rating: 0,
      notes: "",
      photos: [],
      occasion: "daily"
    };

    try {
      await logDailyOutfit(userId, logData);
      Alert.alert(
        "Outfit logged! 🎉", 
        `"${outfit.name}" has been logged for today. You can add rating and photos later.`,
        [
          { text: "OK" },
          { 
            text: "Add Details", 
            onPress: () => navigation.navigate("DailyOutfitLogger")
          }
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to log outfit for today.");
      console.error("Wear today error:", error);
    }
  };

  const renderItem = ({ item }) => (
    <OutfitItemCard
      outfit={item}
      onToggleFavorite={handleToggleFavorite}
      onDelete={handleDelete}
      onWearToday={handleWearToday}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
      <Text style={styles.title}>👗 My Outfits</Text>
      <FlatList
        data={outfits}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
            <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No outfits yet. Create your first outfit!
          </Text>
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => navigation.navigate("OutfitCreator")}
              >
                <Text style={styles.emptyButtonText}>+ Create First Outfit</Text>
              </TouchableOpacity>
            </View>
          }
          showsVerticalScrollIndicator={false}
      />
        
        {outfits.length > 0 && (
      <TouchableOpacity
            style={styles.floatingAddButton}
        onPress={() => navigation.navigate("OutfitCreator")}
      >
        <Text style={styles.addButtonText}>+ Create Outfit</Text>
      </TouchableOpacity>
        )}
      </View>

      {/* 🆕 BottomBar ajoutée */}
      <BottomBar navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff" 
  },
  content: { 
    flex: 1, 
    padding: 20,
    paddingBottom: 90,
  },
  title: { 
    fontSize: 22, 
    fontWeight: "bold", 
    marginBottom: 16 
  },
  listContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    fontSize: 16,
    marginBottom: 20,
  },
  emptyButton: {
    backgroundColor: "#007AFF",
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  emptyButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  floatingAddButton: {
    position: "absolute",
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: "#007AFF",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonText: { 
    color: "#fff", 
    fontWeight: "600", 
    fontSize: 16 
  },
});
