import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, Text, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function BottomBar({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);

  const handleAddPress = () => setModalVisible(true);

  const handleOption = (screen) => {
    setModalVisible(false);
    navigation.navigate(screen);
  };

  return (
    <>
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
        <TouchableOpacity style={styles.centerButton} onPress={handleAddPress}>
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

    
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>What do you want to do?</Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => handleOption("TrackUsage")}
            >
              <Text style={styles.modalButtonText}>Log Today's Outfit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => handleOption("OutfitCreator")}
            >
              <Text style={styles.modalButtonText}>Create New Outfit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={[styles.modalButtonText, { color: "#007AFF" }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: 280,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: { fontSize: 18, fontWeight: "600", marginBottom: 16 },
  modalButton: {
    width: "100%",
    paddingVertical: 12,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    marginVertical: 6,
    alignItems: "center",
  },
  modalButtonText: { color: "#fff", fontWeight: "600" },
  cancelButton: { backgroundColor: "#f0f0f0" },
});
