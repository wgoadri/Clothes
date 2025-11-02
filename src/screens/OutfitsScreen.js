import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
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
  const [filteredOutfits, setFilteredOutfits] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all"); // all, favorites, recent
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
      filtered = filtered.filter(outfit =>
        outfit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (outfit.description && outfit.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter with type
    switch (filterType) {
      case "favorites":
        filtered = filtered.filter(outfit => outfit.favorite);
        break;
      case "recent":
        filtered = filtered.filter(outfit => outfit.lastWorn)
          .sort((a, b) => new Date(b.lastWorn) - new Date(a.lastWorn));
        break;
      case "popular":
        filtered = filtered.sort((a, b) => (b.wearCount || 0) - (a.wearCount || 0));
        break;
      default:
        filtered = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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

  const handleOutfitPress = (outfit) => {
    navigation.navigate("OutfitDetail", { outfit });
  };

  const renderFilterButton = (type, label, icon) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        filterType === type && styles.activeFilterButton
      ]}
      onPress={() => setFilterType(type)}
    >
      <MaterialIcons 
        name={icon} 
        size={16} 
        color={filterType === type ? "#fff" : "#666"} 
      />
      <Text style={[
        styles.filterButtonText,
        filterType === type && styles.activeFilterButtonText
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>👗 My Outfits</Text>
      
      {/* Simple stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{outfits.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {outfits.filter(o => o.favorite).length}
          </Text>
          <Text style={styles.statLabel}>Favorites</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {outfits.filter(o => (o.wearCount || 0) > 0).length}
          </Text>
          <Text style={styles.statLabel}>Worn</Text>
        </View>
      </View>

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search outfits..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <MaterialIcons name="clear" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        {renderFilterButton("all", "All", "apps")}
        {renderFilterButton("favorites", "Favorites", "favorite")}
        {renderFilterButton("recent", "Recent", "schedule")}
        {renderFilterButton("popular", "Popular", "trending-up")}
      </View>
    </View>
  );

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
    <View style={styles.emptyContainer}>
      <MaterialIcons name="style" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>
        {searchQuery ? "No outfits found" : "No outfits yet"}
      </Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery 
          ? `No outfits match "${searchQuery}"`
          : "Create your first outfit to get started!"
        }
      </Text>
      {!searchQuery && (
        <TouchableOpacity
          style={styles.emptyButton}
          onPress={() => navigation.navigate("OutfitCreator")}
        >
          <MaterialIcons name="add" size={20} color="#fff" />
          <Text style={styles.emptyButtonText}>Create First Outfit</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
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
        
        {/* Create outfit */}
        {outfits.length > 0 && (
          <TouchableOpacity
            style={styles.floatingButton}
            onPress={() => navigation.navigate("OutfitCreator")}
          >
            <MaterialIcons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

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
    paddingBottom: 90,
  },
  listContainer: {
    flexGrow: 1,
    padding: 20,
  },
  headerContainer: {
    marginBottom: 20,
  },
  title: { 
    fontSize: 28, 
    fontWeight: "bold", 
    marginBottom: 16,
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007AFF",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
  },
  filtersContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  activeFilterButton: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  filterButtonText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
    fontWeight: "500",
  },
  activeFilterButtonText: {
    color: "#fff",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  emptyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  emptyButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },
  floatingButton: {
    position: "absolute",
    bottom: 100,
    right: 20,
    backgroundColor: "#007AFF",
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
        shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
});
