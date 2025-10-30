import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../services/firebase";
import {
  getOutfits,
  deleteOutfit,
  toggleFavoriteOutfit,
} from "../services/wardrobeService";
import OutfitItemCard from "../components/OutfitItemCard";
import { AntDesign } from "@expo/vector-icons";

export default function OutfitsScreen() {
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const userId = auth.currentUser?.uid;

  const fetchOutfits = async () => {
    if (!userId) return;
    setLoading(true);
    const data = await getOutfits(userId);
    setOutfits(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOutfits();
  }, []);

  const handleToggleFavorite = async (outfit) => {
    await toggleFavoriteOutfit(userId, outfit.id, outfit.favorite);
    fetchOutfits();
  };

  const handleDelete = async (outfit) => {
    await deleteOutfit(userId, outfit.id);
    fetchOutfits();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👗 Your Outfits</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#555" />
      ) : outfits.length === 0 ? (
        <Text style={styles.emptyText}>No outfits yet. Create one!</Text>
      ) : (
        <FlatList
          data={outfits}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <OutfitItemCard
              outfit={item}
              onToggleFavorite={handleToggleFavorite}
              onDelete={handleDelete}
            />
          )}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("OutfitCreator")}
      >
        <AntDesign name="plus" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  emptyText: { fontSize: 16, color: "#999", textAlign: "center" },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#007AFF",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});
