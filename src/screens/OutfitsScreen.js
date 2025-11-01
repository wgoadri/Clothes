import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
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
import BottomBar from "../components/BottomBar";

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
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      {/* Bottom Bar */}
      <BottomBar navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", margin: 20 },
  emptyText: { fontSize: 16, color: "#999", textAlign: "center" },
});
