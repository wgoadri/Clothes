import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../services/firebase";
import WardrobeItemCard from "../components/WardrobeItemCard";

export default function WardrobeScreen() {
  const [clothes, setClothes] = useState([]);

  useEffect(() => {
    const fetchWardrobe = async () => {
      const userId = auth.currentUser.uid;
      const snapshot = await getDocs(
        collection(db, "users", userId, "wardrobe")
      );
      setClothes(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchWardrobe();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧥 Your Wardrobe</Text>
      {clothes.length === 0 ? (
        <Text style={styles.emptyText}>
          No clothes added yet. Add your first piece!
        </Text>
      ) : (
        <FlatList
          data={clothes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <WardrobeItemCard item={item} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  emptyText: { fontSize: 16, color: "#999" },
});
