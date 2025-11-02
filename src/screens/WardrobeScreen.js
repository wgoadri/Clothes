import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../services/firebase";
import { useNavigation } from "@react-navigation/native";
import WardrobeItemCard from "../components/WardrobeItemCard";
import ScreenLayout from "../components/ScreenLayout";

export default function WardrobeScreen() {
  const [clothes, setClothes] = useState([]);
  const navigation = useNavigation();

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
    <ScreenLayout navigation={navigation} title="🧥 Your Wardrobe">
      {clothes.length === 0 ? (
        <Text style={styles.emptyText}>
          No clothes added yet. Add your first piece!
        </Text>
      ) : (
        <FlatList
          data={clothes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <WardrobeItemCard
              item={item}
              onPress={(item) => navigation.navigate("ClothesDetail", { item })}
            />
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", margin: 20 },
  emptyText: { fontSize: 16, color: "#999", textAlign: "center" },
});
