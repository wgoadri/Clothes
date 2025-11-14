// src/components/shared/ChipSelector.js

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ChipSelector({
  items,
  selectedItems = [],
  onToggle,
  renderIcon,
}) {
  return (
    <View style={styles.container}>
      {items.map((item) => {
        const isSelected = selectedItems.includes(item.id || item);
        const itemId = item.id || item;
        const itemName = item.name || item;
        const itemIcon = item.icon;

        return (
          <TouchableOpacity
            key={itemId}
            style={[styles.chip, isSelected && styles.selectedChip]}
            onPress={() => onToggle(itemId)}
          >
            {itemIcon && (
              <Ionicons
                name={itemIcon}
                size={14}
                color={isSelected ? "#FAF8F5" : "#8B7355"}
              />
            )}
            <Text
              style={[styles.chipText, isSelected && styles.selectedChipText]}
            >
              {itemName}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#C9A07A",
    backgroundColor: "#fff",
  },
  selectedChip: {
    backgroundColor: "#C9A07A",
    borderColor: "#C9A07A",
  },
  chipText: {
    fontSize: 12,
    color: "#8B7355",
    marginLeft: 4,
    fontWeight: "500",
  },
  selectedChipText: {
    color: "#FAF8F5",
  },
});
