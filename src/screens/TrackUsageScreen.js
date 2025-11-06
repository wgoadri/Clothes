import React from "react";
import { View, Text, StyleSheet } from "react-native";
import ScreenLayout from "../components/ScreenLayout";

export default function TrackUsageScreen({ navigation }) {
  return (
    <ScreenLayout navigation={navigation} title="Track Usage">
      <View style={styles.container}>
        <Text style={styles.title}>📸 Track Today's Outfit Nothing Yet</Text>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
});
