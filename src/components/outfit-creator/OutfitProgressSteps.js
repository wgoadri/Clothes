// src/components/outfit-creator/OutfitProgressSteps.js

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { OUTFIT_STEP_LABELS } from "../../constants/outfitConstants";

export default function OutfitProgressSteps({
  currentStep,
  onStepPress,
  isEditing,
}) {
  const steps = [1, 2, 3];

  return (
    <View style={styles.container}>
      {steps.map((step) => (
        <View key={step} style={styles.stepWrapper}>
          <TouchableOpacity
            style={[
              styles.stepCircle,
              currentStep >= step && styles.stepCircleActive,
              currentStep === step && styles.stepCircleCurrent,
            ]}
            onPress={() => onStepPress && onStepPress(step)}
            disabled={step > currentStep && !isEditing}
          >
            {currentStep > step ? (
              <MaterialIcons name="check" size={16} color="#fff" />
            ) : (
              <Text
                style={[
                  styles.stepNumber,
                  currentStep >= step && styles.stepNumberActive,
                ]}
              >
                {step}
              </Text>
            )}
          </TouchableOpacity>
          <Text
            style={[
              styles.stepLabel,
              currentStep >= step && styles.stepLabelActive,
            ]}
          >
            {OUTFIT_STEP_LABELS[step]}
          </Text>
          {step < 3 && (
            <View
              style={[
                styles.stepConnector,
                currentStep > step && styles.stepConnectorActive,
              ]}
            />
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 20,
  },
  stepWrapper: {
    flex: 1,
    alignItems: "center",
    position: "relative",
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F5EDE5",
    borderWidth: 2,
    borderColor: "#E8DED2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  stepCircleActive: {
    backgroundColor: "#C9A07A",
    borderColor: "#C9A07A",
  },
  stepCircleCurrent: {
    backgroundColor: "#A47E5C",
    borderColor: "#A47E5C",
    shadowColor: "#8B7355",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: "600",
    color: "#A89888",
  },
  stepNumberActive: {
    color: "#fff",
  },
  stepLabel: {
    fontSize: 11,
    color: "#A89888",
    fontWeight: "400",
    letterSpacing: 0.3,
  },
  stepLabelActive: {
    color: "#6B5B4D",
    fontWeight: "500",
  },
  stepConnector: {
    position: "absolute",
    top: 16,
    left: "50%",
    width: "100%",
    height: 2,
    backgroundColor: "#E8DED2",
    zIndex: -1,
  },
  stepConnectorActive: {
    backgroundColor: "#C9A07A",
  },
});
