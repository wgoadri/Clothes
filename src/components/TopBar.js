import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { globalStyles } from "../styles/globalStyles";
import { modalStyles } from "../styles/components/modals";
import { topBarStyles } from "../styles/components/topBar";

export default function TopBar({ navigation, title = "Clothes" }) {
  const [menuVisible, setMenuVisible] = useState(false);

  const handleNavigate = (screen) => {
    setMenuVisible(false);
    navigation.navigate(screen);
  };

  return (
    <>
      <View style={topBarStyles.container}>
        {/* Subtle gradient overlay */}
        <LinearGradient
          colors={["rgba(245, 237, 230, 0.3)", "rgba(255, 255, 255, 0)"]}
          style={topBarStyles.gradientOverlay}
        />

        {/* Avatar with luxury border */}
        <TouchableOpacity
          onPress={() => handleNavigate("Profile")}
          style={topBarStyles.avatarContainer}
        >
          <View style={topBarStyles.avatarBorder}>
            <Image
              source={{
                uri: "https://i.pravatar.cc/150?img=12",
              }}
              style={topBarStyles.avatar}
            />
          </View>
        </TouchableOpacity>

        {/* Title with elegant typography */}
        <Text style={topBarStyles.title}>{title}</Text>

        {/* Menu Button with subtle background */}
        <TouchableOpacity
          onPress={() => setMenuVisible(true)}
          style={topBarStyles.menuButton}
        >
          <Ionicons name="menu-outline" size={26} color="#8B7355" />
        </TouchableOpacity>
      </View>

      {/* MENU MODAL */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
        statusBarTranslucent
      >
        <View style={modalStyles.menuOverlay}>
          <TouchableOpacity
            style={modalStyles.overlayTouchable}
            activeOpacity={1}
            onPress={() => setMenuVisible(false)}
          />

          <View style={modalStyles.menuContainer}>
            {/* Decorative top element */}
            <View style={modalStyles.menuHandle} />

            <TouchableOpacity
              style={modalStyles.menuItem}
              onPress={() => handleNavigate("Profile")}
            >
              <View style={modalStyles.menuIconContainer}>
                <Ionicons name="person-outline" size={20} color="#8B7355" />
              </View>
              <Text style={modalStyles.menuText}>Profile</Text>
              <Ionicons name="chevron-forward" size={18} color="#C4B5A0" />
            </TouchableOpacity>

            <View style={modalStyles.menuDivider} />

            <TouchableOpacity
              style={modalStyles.menuItem}
              onPress={() => handleNavigate("Settings")}
            >
              <View style={modalStyles.menuIconContainer}>
                <Ionicons name="settings-outline" size={20} color="#8B7355" />
              </View>
              <Text style={modalStyles.menuText}>Settings</Text>
              <Ionicons name="chevron-forward" size={18} color="#C4B5A0" />
            </TouchableOpacity>

            <View style={modalStyles.menuDivider} />

            <TouchableOpacity
              style={modalStyles.menuItem}
              onPress={() => handleNavigate("About")}
            >
              <View style={modalStyles.menuIconContainer}>
                <Ionicons
                  name="information-circle-outline"
                  size={20}
                  color="#8B7355"
                />
              </View>
              <Text style={modalStyles.menuText}>About</Text>
              <Ionicons name="chevron-forward" size={18} color="#C4B5A0" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[modalStyles.menuItem, modalStyles.cancelItem]}
              onPress={() => setMenuVisible(false)}
            >
              <Text style={modalStyles.cancelButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}
