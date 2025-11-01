import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function BottomBar({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Leftmost icon — Home */}
      <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <Ionicons name="home-outline" size={26} color="#333" />
      </TouchableOpacity>

      {/* Wardrobe */}
      <TouchableOpacity onPress={() => navigation.navigate("Wardrobe")}>
        <Ionicons name="shirt-outline" size={26} color="#333" />
      </TouchableOpacity>

      {/* Center circular Add button */}
      <View style={styles.centerButtonContainer}>
        <TouchableOpacity
          style={styles.centerButton}
          onPress={() => navigation.navigate("OutfitCreator")}
        >
          <Ionicons name="add" size={32} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Outfits */}
      <TouchableOpacity onPress={() => navigation.navigate("Outfits")}>
        <Ionicons name="star-outline" size={26} color="#333" />
      </TouchableOpacity>

      {/* Rightmost icon — Track details */}
      <TouchableOpacity onPress={() => navigation.navigate("TrackUsage")}>
        <Ionicons name="calendar-outline" size={26} color="#333" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  centerButtonContainer: {
    position: "absolute",
    top: -30,
    alignSelf: "center",
  },
  centerButton: {
    backgroundColor: "#007AFF",
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
});
