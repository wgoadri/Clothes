import React from "react";
import { View, StyleSheet, ScrollView, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import TopBar from "./TopBar";
import BottomBar from "./BottomBar";

export default function ScreenLayout({
  children,
  navigation,
  title,
  scrollable = true,
  style,
  usesFlatList = false, // New prop to disable outer ScrollView when using FlatList,
  refreshControl,
}) {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      {/* Subtle background gradient */}
      <LinearGradient
        colors={["#FAF8F5", "#F5F0EA", "#FAF8F5"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.backgroundGradient}
      />

      {/* Top bar */}
      <TopBar navigation={navigation} title={title} />

      {/* Main content with subtle inner shadow effect */}
      <View style={styles.contentWrapper}>
        {scrollable && !usesFlatList ? (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[styles.scrollContent, style]}
            showsVerticalScrollIndicator={false}
            refreshControl={refreshControl}
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[styles.contentContainer, style]}>{children}</View>
        )}
      </View>

      {/* Bottom bar */}
      <BottomBar navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FAF8F5",
  },
  backgroundGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  contentWrapper: {
    flex: 1,
    paddingBottom: 59, // Height of bottom bar
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});
