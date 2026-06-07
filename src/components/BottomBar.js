import React, { useState } from "react";
import { View, TouchableOpacity, Text, Modal } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { modalStyles } from "../styles/components/modals";
import { bottomBarStyles } from "../styles/components/bottomBar";

export default function BottomBar({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);

  const handleAddPress = () => setModalVisible(true);

  const handleOption = (screen) => {
    setModalVisible(false);
    navigation.navigate(screen);
  };

  return (
    <>
      <View style={bottomBarStyles.container}>
        {/* Subtle gradient background */}
        <LinearGradient
          colors={["rgba(255, 255, 255, 0)", "rgba(245, 237, 230, 0.2)"]}
          style={bottomBarStyles.gradientBackground}
        />

        {/* Home */}
        <TouchableOpacity
          style={bottomBarStyles.tabButton}
          onPress={() => navigation.navigate("Home")}
        >
          <View style={bottomBarStyles.iconContainer}>
            <Ionicons name="home-outline" size={24} color="#8B7355" />
          </View>
          <Text style={bottomBarStyles.tabLabel}>Home</Text>
        </TouchableOpacity>

        {/* Wardrobe */}
        <TouchableOpacity
          style={bottomBarStyles.tabButton}
          onPress={() => navigation.navigate("Wardrobe")}
        >
          <View style={bottomBarStyles.iconContainer}>
            <Ionicons name="shirt-outline" size={24} color="#8B7355" />
          </View>
          <Text style={bottomBarStyles.tabLabel}>Wardrobe</Text>
        </TouchableOpacity>

        {/* Center circular Add button */}
        <View style={bottomBarStyles.centerButtonWrapper}>
          <TouchableOpacity
            style={bottomBarStyles.centerButton}
            onPress={handleAddPress}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={["#D4A88C", "#C89B7F", "#B88A6F"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={bottomBarStyles.centerGradient}
            >
              <Ionicons name="add" size={32} color="#FAF8F5" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Outfits */}
        <TouchableOpacity
          style={bottomBarStyles.tabButton}
          onPress={() => navigation.navigate("Outfits")}
        >
          <View style={bottomBarStyles.iconContainer}>
            <Ionicons name="star-outline" size={24} color="#8B7355" />
          </View>
          <Text style={bottomBarStyles.tabLabel}>Outfits</Text>
        </TouchableOpacity>

        {/* Track usage */}
        <TouchableOpacity
          style={bottomBarStyles.tabButton}
          onPress={() => navigation.navigate("TrackUsage")}
        >
          <View style={bottomBarStyles.iconContainer}>
            <Ionicons name="calendar-outline" size={24} color="#8B7355" />
          </View>
          <Text style={bottomBarStyles.tabLabel}>Track</Text>
        </TouchableOpacity>
      </View>

      {/* MODAL */}
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
