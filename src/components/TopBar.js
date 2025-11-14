import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { globalStyles } from "../styles/globalStyles";
import { modalStyles } from "../styles/components/modals";

export default function TopBar({ navigation, title = "Clothes" }) {
  const [menuVisible, setMenuVisible] = useState(false);

  const handleNavigate = (screen) => {
    setMenuVisible(false);
    navigation.navigate(screen);
  };

  return (
    <>
      <View style={styles.container}>
        {/* Subtle gradient overlay */}
        <LinearGradient
          colors={["rgba(245, 237, 230, 0.3)", "rgba(255, 255, 255, 0)"]}
          style={styles.gradientOverlay}
        />

        {/* Avatar with luxury border */}
        <TouchableOpacity
          onPress={() => handleNavigate("Profile")}
          style={styles.avatarContainer}
        >
          <View style={styles.avatarBorder}>
            <Image
              source={{
                uri: "https://i.pravatar.cc/150?img=12",
              }}
              style={styles.avatar}
            />
          </View>
        </TouchableOpacity>

        {/* Title with elegant typography */}
        <Text style={styles.title}>{title}</Text>

        {/* Menu Button with subtle background */}
        <TouchableOpacity
          onPress={() => setMenuVisible(true)}
          style={styles.menuButton}
        >
          <Ionicons name="menu-outline" size={26} color="#8B7355" />
        </TouchableOpacity>
      </View>

      {/* LUXURY MENU MODAL */}
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

const styles = StyleSheet.create({
  container: {
    height: 80,
    backgroundColor: "#FAF8F5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#F0EBE3",
    shadowColor: "#8B7355",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  gradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "100%",
  },
  avatarContainer: {
    zIndex: 1,
  },
  avatarBorder: {
    padding: 3,
    borderRadius: 24,
    backgroundColor: "linear-gradient(135deg, #E8DED2, #F5E6D8)",
    borderWidth: 2,
    borderColor: "#F5E6D8",
    shadowColor: "#8B7355",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  title: {
    ...globalStyles.title,
    textTransform: "uppercase",
    zIndex: 1,
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F5EDE5",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#8B7355",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    zIndex: 1,
  },
});
