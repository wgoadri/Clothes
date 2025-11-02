import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

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

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Auth">
        <Stack.Screen
          name="Auth"
          component={AuthScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="AddClothes" component={AddClothesScreen} />
        <Stack.Screen
          name="Wardrobe"
          component={WardrobeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TrackUsage"
          component={TrackUsageScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Outfits"
          component={OutfitsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="OutfitCreator" component={OutfitCreatorScreen} />
        <Stack.Screen
          name="DailyOutfitLogger"
          component={DailyOutfitLoggerScreen}
          options={{ title: "Log Today's Outfit" }}
        />
        <Stack.Screen
          name="ClothesDetail"
          component={ClothesDetailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OutfitDetail"
          component={OutfitDetailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
