import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Alert } from "react-native";
import ScreenLayout from "../components/ScreenLayout";
import OutfitItemCard from "../components/OutfitItemCard";
import ClothesStatsBar from "../components/ClothesStatsBar";
import SearchBar from "../components/SearchBar";
import OutfitsFilterBar from "../components/OutfitsFilterBar";
import EmptyState from "../components/EmptyState";
import { auth } from "../services/firebase";
import {
  getOutfits,
  deleteOutfit,
  toggleOutfitFavorite,
} from "../services/outfitService";
import { logDailyOutfit } from "../services/usageService";

export default function OutfitsScreen({ navigation }) {
  const [outfits, setOutfits] = useState([]);
  const [filteredOutfits, setFilteredOutfits] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [loading, setLoading] = useState(true);
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    fetchOutfits();
  }, []);
  useEffect(() => {
    filterOutfits();
  }, [outfits, searchQuery, filterType]);

  const fetchOutfits = async () => {
    try {
      setLoading(true);
      const data = await getOutfits(userId);
      setOutfits(data);
    } catch (error) {
      console.error("Error fetching outfits:", error);
      Alert.alert("Error", "Failed to load outfits");
    } finally {
      setLoading(false);
    }
  };

  const filterOutfits = () => {
    let filtered = [...outfits];

    // Filter
    if (searchQuery) {
      filtered = filtered.filter(
        (outfit) =>
          outfit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (outfit.description &&
            outfit.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase()))
      );
    }

    // Filter with type
    switch (filterType) {
      case "favorites":
        filtered = filtered.filter((outfit) => outfit.favorite);
        break;
      case "recent":
        filtered = filtered
          .filter((outfit) => outfit.lastWorn)
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

    setFilteredOutfits(filtered);
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
            try {
              await deleteOutfit(userId, outfit.id);
              fetchOutfits();
              Alert.alert("Success", "Outfit deleted successfully");
            } catch (error) {
              Alert.alert("Error", "Failed to delete outfit");
            }
          },
        },
      ]
    );
  };

  const handleToggleFavorite = async (outfit) => {
    try {
      await toggleOutfitFavorite(userId, outfit.id, !outfit.favorite);
      fetchOutfits();
    } catch (error) {
      Alert.alert("Error", "Failed to update favorite status");
    }
  };

  const handleWearToday = async (outfit) => {
    try {
      await logDailyOutfit(userId, { outfitId: outfit.id });
      Alert.alert(
        "Outfit logged! 🎉",
        `"${outfit.name}" has been logged for today. You can add rating and photos later.`,
        [
          { text: "OK" },
          {
            text: "Add Details",
            onPress: () => navigation.navigate("DailyOutfitLogger"),
          },
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to log outfit for today.");
      console.error("Wear today error:", error);
    }
  };

  const handleOutfitPress = (outfit) => {
    navigation.navigate("OutfitDetail", { outfit });
  };

  const renderItem = ({ item }) => (
    <OutfitItemCard
      outfit={item}
      onToggleFavorite={handleToggleFavorite}
      onDelete={handleDelete}
      onWearToday={handleWearToday}
      onPress={handleOutfitPress}
    />
  );

  const renderEmptyState = () => (
    <EmptyState
      searchQuery={searchQuery}
      onCreate={() => navigation.navigate("OutfitCreator")}
    />
  );

  // Combine headers for FlatList
  const renderHeader = () => (
    <>
      <ClothesStatsBar
        total={outfits.length}
        favorites={outfits.filter((o) => o.favorite).length}
        worn={outfits.filter((o) => o.wearCount > 0).length}
      />
      <SearchBar value={searchQuery} onChange={setSearchQuery} />
      <OutfitsFilterBar filterType={filterType} setFilterType={setFilterType} />
    </>
  );

  return (
    <ScreenLayout navigation={navigation} title="Outfits" usesFlatList={true}>
      <FlatList
        data={filteredOutfits}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={fetchOutfits}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    flexGrow: 1,
    padding: 20,
  },
});
