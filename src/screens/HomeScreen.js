import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  RefreshControl,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { auth } from "../services/firebase";
import { getWardrobeItems } from "../services/wardrobeService";
import { getOutfits } from "../services/outfitService";
import { getTodayOutfit } from "../services/usageService";
import { getUsageMetrics } from "../services/statsService";
import ScreenLayout from "../components/ScreenLayout";
import { homeStyles } from "../styles/screens/home";
import { globalStyles } from "../styles/globalStyles";

export default function HomeScreen({ navigation }) {
  const [metrics, setMetrics] = useState(null);
  const [wardrobe, setWardrobe] = useState([]);
  const [outfits, setOutfits] = useState([]);
  const [todayOutfit, setTodayOutfit] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const userId = auth.currentUser?.uid;

  const fetchData = async () => {
    const [wardrobeData, outfitsData, usageData, todayData] = await Promise.all(
      [
        getWardrobeItems(userId),
        getOutfits(userId),
        getUsageMetrics(userId),
        getTodayOutfit(userId),
      ]
    );

    setWardrobe(wardrobeData);
    setOutfits(outfitsData);
    setTodayOutfit(todayData);

    const outfitMap = Object.fromEntries(
      outfitsData.map((o) => [o.id, o.name])
    );
    const itemMap = Object.fromEntries(wardrobeData.map((i) => [i.id, i.name]));

    const topOutfits = outfitsData
      .sort((a, b) => (b.wearCount || 0) - (a.wearCount || 0))
      .slice(0, 5)
      .map((o) => ({
        name: o.name,
        count: o.wearCount || 0,
      }));

    const topItems = wardrobeData
      .sort((a, b) => (b.wearCount || 0) - (a.wearCount || 0))
      .slice(0, 5)
      .map((i) => ({ name: i.name, count: i.wearCount || 0 }));

    setMetrics({
      topOutfits,
      topItems,
      totalDays: usageData.summary.totalDays,
      lastLogDate: usageData.summary.lastLogDate,
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, []);

  const TodayOutfitWidget = () => {
    if (todayOutfit) {
      return (
        <TouchableOpacity
          style={homeStyles.todayWidget}
          onPress={() => navigation.navigate("DailyOutfitLogger")}
          activeOpacity={0.8}
        >
          <View style={homeStyles.todayHeader}>
            <View style={homeStyles.todayTitleContainer}>
              <Ionicons name="calendar" size={20} color="#C9A07A" />
              <Text style={homeStyles.todayTitle}>Today's Outfit</Text>
            </View>
            <View style={homeStyles.editIconContainer}>
              <MaterialIcons name="edit" size={18} color="#8B7355" />
            </View>
          </View>
          <Text style={homeStyles.todayOutfitName}>
            {todayOutfit.outfit.name}
          </Text>
          {todayOutfit.rating > 0 && (
            <View style={homeStyles.todayRating}>
              {[...Array(5)].map((_, i) => (
                <Text key={i} style={homeStyles.star}>
                  {i < todayOutfit.rating ? "⭐" : "☆"}
                </Text>
              ))}
            </View>
          )}
          {todayOutfit.notes && (
            <Text style={homeStyles.todayNotes} numberOfLines={2}>
              "{todayOutfit.notes}"
            </Text>
          )}
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={homeStyles.todayWidgetEmpty}
        onPress={() => navigation.navigate("DailyOutfitLogger")}
        activeOpacity={0.8}
      >
        <View style={homeStyles.emptyIconContainer}>
          <MaterialIcons name="checkroom" size={32} color="#C9A07A" />
        </View>
        <Text style={homeStyles.todayEmptyTitle}>
          What are you wearing today?
        </Text>
        <Text style={homeStyles.todayEmptySubtitle}>
          Tap to log your outfit
        </Text>
      </TouchableOpacity>
    );
  };

  if (!metrics) {
    return (
      <View style={globalStyles.centered}>
        <Text style={globalStyles.bodyText}>Loading metrics...</Text>
      </View>
    );
  }

  return (
    <ScreenLayout
      navigation={navigation}
      title="My Closet"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header Summary */}
      <View style={homeStyles.headerSummary}>
        <Text style={homeStyles.headerTitle}>Welcome back</Text>
        <Text style={homeStyles.headerSubtitle}>
          {todayOutfit
            ? `You've logged today's outfit: ${todayOutfit.outfit.name}`
            : "You haven't logged your outfit yet today"}
        </Text>
      </View>

      {/* Today's Outfit Widget */}
      <TodayOutfitWidget />

      {/* Quick Stats */}
      <View style={homeStyles.quickStats}>
        <View style={homeStyles.statCard}>
          <Text style={homeStyles.statNumber}>{wardrobe.length}</Text>
          <Text style={homeStyles.statLabel}>Items</Text>
        </View>

        <View style={homeStyles.statCard}>
          <Text style={homeStyles.statNumber}>{outfits.length}</Text>
          <Text style={homeStyles.statLabel}>Outfits</Text>
        </View>

        <View style={homeStyles.statCard}>
          <Text style={homeStyles.statNumber}>{metrics.totalDays || 0}</Text>
          <Text style={homeStyles.statLabel}>Days Logged</Text>
        </View>
      </View>

      <Text style={homeStyles.lastLogText}>
        Last logged on {metrics.lastLogDate}
      </Text>

      {/* Highlights */}
      <View style={globalStyles.section}>
        <View style={homeStyles.sectionHeader}>
          <Ionicons name="star" size={20} color="#C9A07A" />
          <Text style={homeStyles.sectionTitle}>Highlights</Text>
        </View>
        <View style={homeStyles.highlightCards}>
          <View style={homeStyles.highlightCard}>
            <Text style={homeStyles.highlightLabel}>Most worn item</Text>
            <Text style={homeStyles.highlightValue}>
              {metrics.topItems?.[0]?.name || "No data"}
            </Text>
            {metrics.topItems?.[0]?.count > 0 && (
              <Text style={homeStyles.highlightCount}>
                {metrics.topItems[0].count} times
              </Text>
            )}
          </View>
          <View style={homeStyles.highlightCard}>
            <Text style={homeStyles.highlightLabel}>Favorite outfit</Text>
            <Text style={homeStyles.highlightValue}>
              {outfits.find((o) => o.favorite)?.name || "None yet"}
            </Text>
          </View>
        </View>
      </View>

      {/* Wardrobe Preview */}
      <View style={globalStyles.section}>
        <View style={homeStyles.sectionHeader}>
          <Ionicons name="shirt" size={20} color="#C9A07A" />
          <Text style={homeStyles.sectionTitle}>Wardrobe Preview</Text>
        </View>
        <FlatList
          horizontal
          data={wardrobe.slice(0, 10)}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={homeStyles.previewCard}
              onPress={() => navigation.navigate("Wardrobe")}
              activeOpacity={0.8}
            >
              {item.image ? (
                <Image
                  source={{ uri: item.image }}
                  style={homeStyles.previewImage}
                />
              ) : (
                <View style={homeStyles.previewPlaceholder}>
                  <Ionicons name="shirt-outline" size={28} color="#C9A07A" />
                  <Text style={homeStyles.previewText} numberOfLines={2}>
                    {item.name}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={homeStyles.previewList}
        />
      </View>

      {/* Usage Insights */}
      <View style={globalStyles.section}>
        <View style={homeStyles.sectionHeader}>
          <Ionicons name="bar-chart" size={20} color="#C9A07A" />
          <Text style={homeStyles.sectionTitle}>Usage Insights</Text>
        </View>

        <View style={homeStyles.insightSection}>
          <Text style={homeStyles.subsectionTitle}>Most Worn Outfits</Text>
          {metrics.topOutfits.length === 0 ? (
            <View style={homeStyles.emptyState}>
              <Text style={homeStyles.emptyText}>No outfit logs yet</Text>
            </View>
          ) : (
            <View style={homeStyles.insightCard}>
              {metrics.topOutfits.slice(0, 5).map((o, idx) => (
                <View key={idx} style={homeStyles.itemRow}>
                  <View style={homeStyles.itemRank}>
                    <Text style={homeStyles.rankNumber}>{idx + 1}</Text>
                  </View>
                  <Text style={homeStyles.itemName}>{o.name}</Text>
                  <View style={homeStyles.countBadge}>
                    <Text style={homeStyles.itemCount}>{o.count}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={homeStyles.insightSection}>
          <Text style={homeStyles.subsectionTitle}>Most Worn Items</Text>
          {metrics.topItems.length === 0 ? (
            <View style={homeStyles.emptyState}>
              <Text style={homeStyles.emptyText}>No wardrobe usage yet</Text>
            </View>
          ) : (
            <View style={homeStyles.insightCard}>
              {metrics.topItems.slice(0, 5).map((i, idx) => (
                <View key={idx} style={homeStyles.itemRow}>
                  <View style={homeStyles.itemRank}>
                    <Text style={homeStyles.rankNumber}>{idx + 1}</Text>
                  </View>
                  <Text style={homeStyles.itemName}>{i.name}</Text>
                  <View style={homeStyles.countBadge}>
                    <Text style={homeStyles.itemCount}>{i.count}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </ScreenLayout>
  );
}
