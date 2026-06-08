import React, { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet } from "react-native";
import { auth } from '../services/firebase';
import { getWardrobeItems } from '../services/wardrobeService';
import WardrobeItemCard from "../components/WardrobeItemCard";
import ScreenLayout from "../components/ScreenLayout";
import ClothesStatsBar from "../components/ClothesStatsBar";
import SearchBar from "../components/SearchBar";
import ClothesFilterBar from "../components/ClothesFilterBar";
import EmptyState from "../components/EmptyState";
import { flatListScreenStyles } from "../styles/screens/flatList";

export default function WardrobeScreen({ navigation }) {
  const [clothes, setClothes] = useState([]);
  const [filteredClothes, setFilteredClothes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategoryFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWardrobe();
  }, []);
  useEffect(() => {
    filterClothes();
  }, [clothes, searchQuery, category]);

  const fetchWardrobe = async () => {
    try {
      setLoading(true);
      const userId = auth.currentUser.uid;
      const items = await getWardrobeItems(userId);
      setClothes(items);
    } catch (error) {
      console.error('Error fetching clothes:', error);
      Alert.alert('Error', 'Failed to load clothes');
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
    if (category !== "All")
      filtered = filtered.filter((clothes) => clothes.category === category);

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
      <ClothesFilterBar
        category={category}
        setCategoryFilter={setCategoryFilter}
      />
    </>
  );

  return (
    <ScreenLayout navigation={navigation} title="Wardrobe" usesFlatList={true}>
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
        contentContainerStyle={flatListScreenStyles.listContainer}
        ListEmptyComponent={renderEmptyState}
        refreshing={loading}
        onRefresh={fetchWardrobe}
      />
    </ScreenLayout>
  );
}
