import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Modal,
  Dimensions,
  Platform,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { modalStyles } from "../styles/components/modals";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function BottomBar({ navigation }) {
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);

  const handleAddPress = () => setModalVisible(true);

  const handleOption = (screen) => {
    setModalVisible(false);
    navigation.navigate(screen);
  };

  return (
    <>
      <View style={styles.container}>
        {/* Subtle gradient background */}
        <LinearGradient
          colors={["rgba(255, 255, 255, 0)", "rgba(245, 237, 230, 0.2)"]}
          style={styles.gradientBackground}
        />

        {/* Home */}
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => navigation.navigate("Home")}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="home-outline" size={24} color="#8B7355" />
          </View>
          <Text style={styles.tabLabel}>Home</Text>
        </TouchableOpacity>

        {/* Wardrobe */}
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => navigation.navigate("Wardrobe")}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="shirt-outline" size={24} color="#8B7355" />
          </View>
          <Text style={styles.tabLabel}>Wardrobe</Text>
        </TouchableOpacity>

        {/* Center circular Add button - Luxury version */}
        <View style={styles.centerButtonWrapper}>
          <TouchableOpacity
            style={styles.centerButton}
            onPress={handleAddPress}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={["#D4A88C", "#C89B7F", "#B88A6F"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.centerGradient}
            >
              <Ionicons name="add" size={32} color="#FAF8F5" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Outfits */}
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => navigation.navigate("Outfits")}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="star-outline" size={24} color="#8B7355" />
          </View>
          <Text style={styles.tabLabel}>Outfits</Text>
        </TouchableOpacity>

        {/* Track usage */}
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => navigation.navigate("TrackUsage")}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="calendar-outline" size={24} color="#8B7355" />
          </View>
          <Text style={styles.tabLabel}>Track</Text>
        </TouchableOpacity>
      </View>

      {/* LUXURY MODAL */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={modalStyles.modalOverlay}>
          <TouchableOpacity
            style={modalStyles.overlayTouchable}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          />

          <View style={modalStyles.modalContent}>
            {/* Decorative element */}
            <View style={modalStyles.modalDecoration} />

            <Text style={modalStyles.modalTitle}>Create Something New</Text>
            <Text style={modalStyles.modalSubtitle}>
              What would you like to add?
            </Text>

            <TouchableOpacity
              style={[modalStyles.modalButton, modalStyles.primaryButton]}
              onPress={() => handleOption("DailyOutfitLogger")}
            >
              <LinearGradient
                colors={["#B8A89A", "#A89888"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={modalStyles.buttonGradient}
              >
                <View style={modalStyles.buttonIconCircle}>
                  <MaterialIcons name="today" size={22} color="#8B7355" />
                </View>
                <View style={modalStyles.buttonTextContainer}>
                  <Text style={modalStyles.modalButtonText}>
                    Log Today's Outfit
                  </Text>
                  <Text style={modalStyles.modalButtonSubtext}>
                    Record what you wore
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color="rgba(255,255,255,0.7)"
                />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={modalStyles.modalButton}
              onPress={() => handleOption("AddClothes")}
            >
              <LinearGradient
                colors={["#C4B5A0", "#B5A690"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={modalStyles.buttonGradient}
              >
                <View style={modalStyles.buttonIconCircle}>
                  <Ionicons name="shirt-outline" size={22} color="#8B7355" />
                </View>
                <View style={modalStyles.buttonTextContainer}>
                  <Text style={modalStyles.modalButtonText}>Add New Item</Text>
                  <Text style={modalStyles.modalButtonSubtext}>
                    Expand your wardrobe
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color="rgba(255,255,255,0.7)"
                />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={modalStyles.modalButton}
              onPress={() => handleOption("OutfitCreator")}
            >
              <LinearGradient
                colors={["#D4C4B0", "#C4B4A0"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={modalStyles.buttonGradient}
              >
                <View style={modalStyles.buttonIconCircle}>
                  <MaterialIcons name="style" size={22} color="#8B7355" />
                </View>
                <View style={modalStyles.buttonTextContainer}>
                  <Text style={modalStyles.modalButtonText}>
                    Create New Outfit
                  </Text>
                  <Text style={modalStyles.modalButtonSubtext}>
                    Design your look
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color="rgba(255,255,255,0.7)"
                />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={[modalStyles.modalButton, modalStyles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={modalStyles.cancelButtonText}>Close</Text>
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
    height: 85,
    backgroundColor: "#FAF8F5",
    borderTopWidth: 1,
    borderTopColor: "#F0EBE3",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === "ios" ? 10 : 8,
    shadowColor: "#8B7355",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
  },
  gradientBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "100%",
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5EDE5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 11,
    color: "#8B7355",
    fontWeight: "400",
    letterSpacing: 0.3,
    marginTop: 2,
  },
  centerButtonWrapper: {
    position: "absolute",
    top: -30,
    alignSelf: "center",
    zIndex: 2,
  },
  centerButton: {
    width: 68,
    height: 68,
    borderRadius: 34,
    shadowColor: "#8B7355",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 8,
  },
  centerGradient: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FAF8F5",
  },
});
