import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import { borderRadius, colors, spacing, typography } from "../styles/theme";

export default function SettingsScreen() {
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      // AppNavigator reacts to the auth-state change and returns to Auth.
      await signOut(auth);
    } catch {
      setSigningOut(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Settings</Text>

      <TouchableOpacity
        style={[styles.signOutButton, signingOut && styles.disabled]}
        onPress={handleSignOut}
        disabled={signingOut}
      >
        {signingOut ? (
          <ActivityIndicator color={colors.semantic.error} />
        ) : (
          <Text style={styles.signOutText}>Sign Out</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },
  heading: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xl,
  },
  signOutButton: {
    height: 52,
    borderRadius: borderRadius.base,
    borderWidth: 1,
    borderColor: colors.semantic.error,
    justifyContent: "center",
    alignItems: "center",
  },
  disabled: {
    opacity: 0.6,
  },
  signOutText: {
    color: colors.semantic.error,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
  },
});
