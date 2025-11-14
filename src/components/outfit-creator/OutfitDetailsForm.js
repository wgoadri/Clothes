// src/components/outfit-creator/OutfitDetailsForm.js

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import ChipSelector from "../ChipSelector";
import { SEASONS, OCCASIONS } from "../../constants/outfitConstants";

export default function OutfitDetailsForm({
  outfitImage,
  selectedItemsCount,
  name,
  description,
  notes,
  seasons,
  occasions,
  onNameChange,
  onDescriptionChange,
  onNotesChange,
  onSeasonsChange,
  onOccasionsChange,
}) {
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  const toggleSeason = (seasonId) => {
    const newSeasons = seasons.includes(seasonId)
      ? seasons.filter((s) => s !== seasonId)
      : [...seasons, seasonId];
    onSeasonsChange(newSeasons);
  };

  const toggleOccasion = (occasion) => {
    const newOccasions = occasions.includes(occasion)
      ? occasions.filter((o) => o !== occasion)
      : [...occasions, occasion];
    onOccasionsChange(newOccasions);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>✨ Final Details</Text>
      <Text style={styles.subtitle}>
        Add a name and optional details to complete your outfit
      </Text>

      {/* Outfit Summary */}
      <View style={styles.summary}>
        {outfitImage && (
          <Image source={{ uri: outfitImage }} style={styles.summaryImage} />
        )}
        <View style={styles.summaryDetails}>
          <Text style={styles.summaryLabel}>Items in outfit</Text>
          <Text style={styles.summaryValue}>{selectedItemsCount} pieces</Text>
        </View>
      </View>

      {/* Basic Info */}
      <View style={styles.section}>
        <Text style={styles.label}>
          Outfit Name <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Casual Friday, Date Night"
          placeholderTextColor="#A89888"
          value={name}
          onChangeText={onNameChange}
          maxLength={50}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="What's special about this outfit?"
          placeholderTextColor="#A89888"
          value={description}
          onChangeText={onDescriptionChange}
          multiline
          numberOfLines={3}
          maxLength={200}
        />
      </View>

      {/* Advanced Options Toggle */}
      <TouchableOpacity
        style={styles.advancedToggle}
        onPress={() => setShowAdvancedOptions(!showAdvancedOptions)}
      >
        <View style={styles.advancedToggleLeft}>
          <Ionicons name="options-outline" size={20} color="#8B7355" />
          <Text style={styles.advancedToggleText}>More Options</Text>
        </View>
        <MaterialIcons
          name={showAdvancedOptions ? "expand-less" : "expand-more"}
          size={24}
          color="#8B7355"
        />
      </TouchableOpacity>

      {showAdvancedOptions && (
        <>
          <View style={styles.section}>
            <Text style={styles.label}>Suitable Seasons</Text>
            <ChipSelector
              items={SEASONS}
              selectedItems={seasons}
              onToggle={toggleSeason}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Suitable Occasions</Text>
            <ChipSelector
              items={OCCASIONS}
              selectedItems={occasions}
              onToggle={toggleOccasion}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Personal Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Any notes about styling, occasions, or tips..."
              placeholderTextColor="#A89888"
              value={notes}
              onChangeText={onNotesChange}
              multiline
              numberOfLines={3}
              maxLength={200}
            />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "300",
    color: "#6B5B4D",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: "#A89888",
    marginBottom: 20,
    lineHeight: 20,
  },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5EDE5",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  summaryImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },
  summaryDetails: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#A89888",
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6B5B4D",
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B5B4D",
    marginBottom: 8,
  },
  required: {
    color: "#D97757",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E8DED2",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#6B5B4D",
  },
  textArea: {
    height: 90,
    textAlignVertical: "top",
  },
  advancedToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F5EDE5",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  advancedToggleLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  advancedToggleText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B5B4D",
    marginLeft: 8,
  },
});
