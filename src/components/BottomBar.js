import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Modal,
  Dimensions,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

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
        {/* Home */}
        <TouchableOpacity
          style={styles.extremLeftButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Ionicons name="home-outline" size={26} color="#333" />
        </TouchableOpacity>

        {/* Wardrobe */}
        <TouchableOpacity
          style={styles.leftButton}
          onPress={() => navigation.navigate("Wardrobe")}
        >
          <Ionicons name="shirt-outline" size={26} color="#333" />
        </TouchableOpacity>

        {/* Center circular Add button */}
        <View style={styles.centerButtonWrapper}>
          <TouchableOpacity
            style={styles.centerButton}
            onPress={handleAddPress}
          >
            <Ionicons name="add" size={34} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Outfits */}
        <TouchableOpacity
          style={styles.RightButton}
          onPress={() => navigation.navigate("Outfits")}
        >
          <Ionicons name="star-outline" size={26} color="#333" />
        </TouchableOpacity>

        {/* Track usage */}
        <TouchableOpacity
          style={styles.extremRightButton}
          onPress={() => navigation.navigate("TrackUsage")}
        >
          <Ionicons name="calendar-outline" size={26} color="#333" />
        </TouchableOpacity>
      </View>

      {/* MODAL */}
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
              style={[styles.modalButton, styles.primaryButton]}
              onPress={() => handleOption("DailyOutfitLogger")}
            >
              <View style={styles.buttonContent}>
                <MaterialIcons name="today" size={20} color="#fff" />
                <Text style={styles.modalButtonText}>Log Today's Outfit</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => handleOption("AddClothes")}
            >
              <View style={styles.buttonContent}>
                <Ionicons name="shirt-outline" size={20} color="#fff" />
                <Text style={styles.modalButtonText}>Add New Item</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => handleOption("OutfitCreator")}
            >
              <View style={styles.buttonContent}>
                <MaterialIcons name="style" size={20} color="#fff" />
                <Text style={styles.modalButtonText}>Create New Outfit</Text>
              </View>
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
    width: width,
    height: 70,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  extremLeftButton: {
    paddingRight: 0,
  },
  extremRightButton: {
    paddingLeft: 0,
  },
  LeftButton: {
    paddingRight: 60,
  },
  RightButton: {
    paddingLeft: 60,
  },
  centerButtonWrapper: {
    position: "absolute",
    top: -35,
    alignSelf: "center",
    zIndex: 2,
  },
  centerButton: {
    backgroundColor: "#b64fc4ff",
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: 300,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
  },
  modalButton: {
    width: "100%",
    paddingVertical: 14,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    marginVertical: 6,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#28a745",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
    marginTop: 10,
  },
});
