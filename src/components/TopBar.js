import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function TopBar({ navigation, title = "Clothes" }) {
  const [menuVisible, setMenuVisible] = useState(false);

  const handleNavigate = (screen) => {
    setMenuVisible(false);
    navigation.navigate(screen);
  };

  return (
    <>
      <View style={styles.container}>
        {/* Avatar */}
        <TouchableOpacity onPress={() => handleNavigate("Profile")}>
          <Image
            source={{
              uri: "https://i.pravatar.cc/150?img=12",
            }}
            style={styles.avatar}
          />
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.title}>{title}</Text>

        {/* Menu Button */}
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Ionicons name="menu-outline" size={28} color="#333" />
        </TouchableOpacity>
      </View>

      {/* MENU MODAL */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.menuOverlay}>
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavigate("Profile")}
            >
              <Text style={styles.menuText}>👤 Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavigate("Settings")}
            >
              <Text style={styles.menuText}>⚙️ Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavigate("About")}
            >
              <Text style={styles.menuText}>ℹ️ About</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.menuItem,
                { borderTopWidth: 1, borderTopColor: "#eee" },
              ]}
              onPress={() => setMenuVisible(false)}
            >
              <Text style={[styles.menuText, { color: "#007AFF" }]}>
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
    height: 70,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  menuContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 30,
    paddingVertical: 10,
  },
  menuItem: {
    paddingVertical: 14,
    alignItems: "center",
  },
  menuText: {
    fontSize: 16,
    color: "#333",
  },
});
