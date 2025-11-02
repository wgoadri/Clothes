import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../services/firebase";
import WardrobeItemCard from "../components/WardrobeItemCard";
import ScreenLayout from "../components/ScreenLayout";
import ClothesStatsBar from "../components/ClothesStatsBar";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";

export default function WardrobeScreen({ navigation }) {
  const [clothes, setClothes] = useState([]);
  const [filteredClothes, setFilteredClothes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWardrobe();
  }, []);
  useEffect(() => {
    filterClothes();
  }, [clothes, searchQuery, filterType]);

  const fetchWardrobe = async () => {
    try {
      setLoading(true);
      const userId = auth.currentUser.uid;
      const snapshot = await getDocs(
        collection(db, "users", userId, "wardrobe")
      );
      setClothes(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching clothes:", error);
      Alert.alert("Error", "Failed to load clothes");
    } finally {
      setLoading(false);
    }
  };

  const filterClothes = () => {
    let filtered = [...clothes];

    // Filter
    if (searchQuery) {
      filtered = filtered.filter(
        (clothes) =>
          clothes.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (clothes.description &&
            clothes.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase()))
      );
    }

    // Filter with type
    switch (filterType) {
      case "favorites":
        filtered = filtered.filter((clothes) => clothes.wearCount > 4);
        break;
      case "recent":
        filtered = filtered
          .filter((clothes) => clothes.lastWorn)
          .sort((a, b) => new Date(b.lastWorn) - new Date(a.lastWorn));
        break;
      case "popular":
        filtered = filtered.sort(
          (a, b) => (b.wearCount || 0) - (a.wearCount || 0)
        );
        break;
      default:
        filtered = filtered.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
    }

    setFilteredClothes(filtered);
  };

  const renderEmptyState = () => (
    <EmptyState
      searchQuery={searchQuery}
      onCreate={() => navigation.navigate("AddClothes")}
    />
  );

  // Combine headers for FlatList
  const renderHeader = () => (
    <>
      <ClothesStatsBar
        total={clothes.length}
        favorites={clothes.filter((c) => c.wearCount > 4).length}
        worn={clothes.filter((o) => o.wearCount > 0).length}
      />
      <SearchBar value={searchQuery} onChange={setSearchQuery} />
      <FilterBar filterType={filterType} setFilterType={setFilterType} />
    </>
  );

  return (
    <ScreenLayout navigation={navigation} title="Wardrobe">
      <FlatList
        data={filteredClothes}
        ListHeaderComponent={renderHeader}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <WardrobeItemCard
            item={item}
            onPress={(item) => navigation.navigate("ClothesDetail", { item })}
          />
        )}
        contentContainerStyle={styles.listContainer}
        refreshing={loading}
        onRefresh={fetchWardrobe}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    flexGrow: 1,
    padding: 20,
  },
  emptyText: { fontSize: 16, color: "#999", textAlign: "center" },
});
