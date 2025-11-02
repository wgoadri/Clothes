import React from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function SearchBar({ value, onChange }) {
  return (
    <View style={styles.container}>
      <MaterialIcons name="search" size={20} color="#666" />
      <TextInput
        style={styles.input}
        placeholder="Search..."
        value={value}
        onChangeText={onChange}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChange("")}>
          <MaterialIcons name="clear" size={20} color="#666" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#faf8f8ff",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  input: { flex: 1, marginLeft: 8, fontSize: 16, color: "#333" },
});
