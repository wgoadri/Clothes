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

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Auth">
        <Stack.Screen
          name="Auth"
          component={AuthScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AddClothes" component={AddClothesScreen} />
        <Stack.Screen name="Wardrobe" component={WardrobeScreen} />
        <Stack.Screen name="TrackUsage" component={TrackUsageScreen} />
        <Stack.Screen name="Outfits" component={OutfitsScreen} />
        <Stack.Screen name="OutfitCreator" component={OutfitCreatorScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
