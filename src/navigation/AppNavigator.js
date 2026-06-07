import React from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useAuth } from "../contexts/AuthContext";
import { colors } from "../styles/theme";

import HomeScreen from "../screens/HomeScreen";
import AddClothesScreen from "../screens/AddClothesScreen";
import WardrobeScreen from "../screens/WardrobeScreen";
import TrackUsageScreen from "../screens/TrackUsageScreen";
import OutfitsScreen from "../screens/OutfitsScreen";
import AuthScreen from "../screens/AuthScreen";
import OutfitCreatorScreen from "../screens/OutfitCreatorScreen";
import DailyOutfitLoggerScreen from "../screens/DailyOutfitLoggerScreen";
import ClothesDetailScreen from "../screens/ClothesDetailScreen";
import OutfitDetailScreen from "../screens/OutfitDetailScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SettingsScreen from "../screens/SettingsScreen";
import AboutScreen from "../screens/AboutScreen";

const Stack = createNativeStackNavigator();

function AppStack() {
  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="AddClothes" component={AddClothesScreen} />
      <Stack.Screen name="Wardrobe" component={WardrobeScreen} />
      <Stack.Screen name="TrackUsage" component={TrackUsageScreen} />
      <Stack.Screen name="Outfits" component={OutfitsScreen} />
      <Stack.Screen name="OutfitCreator" component={OutfitCreatorScreen} />
      <Stack.Screen
        name="DailyOutfitLogger"
        component={DailyOutfitLoggerScreen}
        options={{ headerShown: true, title: "Log Today's Outfit" }}
      />
      <Stack.Screen name="ClothesDetail" component={ClothesDetailScreen} />
      <Stack.Screen name="OutfitDetail" component={OutfitDetailScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: true }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: true }} />
      <Stack.Screen name="About" component={AboutScreen} options={{ headerShown: true }} />
    </Stack.Navigator>
  );
}

function AuthFlow() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Auth" component={AuthScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { user, initializing } = useAuth();

  if (initializing) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background.primary,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary.warmBrown} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthFlow />}
    </NavigationContainer>
  );
}
