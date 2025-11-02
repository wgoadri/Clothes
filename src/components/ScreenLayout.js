import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // ✅ updated
import TopBar from "./TopBar";
import BottomBar from "./BottomBar";

export default function ScreenLayout({
  children,
  navigation,
  title,
  scrollable = true,
  style,
}) {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      {/* Top bar */}
      <TopBar navigation={navigation} title={title} />

      {/* Main content */}
      <View style={[styles.contentContainer, style]}>{children}</View>

      {/* Bottom bar */}
      <BottomBar navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    flex: 1,
    paddingBottom: 40,
  },
});
