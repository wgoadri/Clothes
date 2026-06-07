import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../services/firebase";
import { borderRadius, colors, spacing, typography } from "../styles/theme";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Map Firebase error codes to friendly, inline messages.
function messageForError(error) {
  switch (error?.code) {
    case "auth/invalid-email":
      return "That email address looks invalid.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Incorrect email or password.";
    case "auth/email-already-in-use":
      return "An account already exists with this email.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";
    default:
      return "Something went wrong. Please try again.";
  }
}

export default function AuthScreen() {
  const [mode, setMode] = useState("login"); // 'login' | 'signup'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const isSignup = mode === "signup";

  const validate = () => {
    if (!EMAIL_REGEX.test(email.trim())) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setError("");
    setInfo("");
    if (!validate()) return;

    setLoading(true);
    try {
      // No manual navigation — AuthProvider + AppNavigator react to the
      // auth-state change and swap to the app stack automatically.
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }
    } catch (e) {
      setError(messageForError(e));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    setError("");
    setInfo("");
    if (!EMAIL_REGEX.test(email.trim())) {
      setError("Enter your email above first, then tap reset.");
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setInfo("Password reset email sent. Check your inbox.");
    } catch (e) {
      setError(messageForError(e));
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setError("");
    setInfo("");
    setMode(isSignup ? "login" : "signup");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Clothes</Text>
        <Text style={styles.subtitle}>
          {isSignup ? "Create your account" : "Welcome back"}
        </Text>

        <TextInput
          placeholder="Email"
          placeholderTextColor={colors.text.placeholder}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          editable={!loading}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor={colors.text.placeholder}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          editable={!loading}
          style={styles.input}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}
        {info ? <Text style={styles.info}>{info}</Text> : null}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.text.inverse} />
          ) : (
            <Text style={styles.buttonText}>
              {isSignup ? "Sign Up" : "Log In"}
            </Text>
          )}
        </TouchableOpacity>

        {!isSignup && (
          <TouchableOpacity onPress={handlePasswordReset} disabled={loading}>
            <Text style={styles.link}>Forgot password?</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={toggleMode} disabled={loading}>
          <Text style={styles.link}>
            {isSignup
              ? "Already have an account? Log in"
              : "No account yet? Sign up"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  title: {
    fontSize: typography.fontSize.huge,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    textAlign: "center",
  },
  subtitle: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
    textAlign: "center",
    marginTop: spacing.xs,
    marginBottom: spacing.xxl,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: colors.border.medium,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.base,
    paddingHorizontal: spacing.base,
    marginBottom: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
  },
  button: {
    height: 52,
    backgroundColor: colors.primary.warmBrown,
    borderRadius: borderRadius.base,
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.sm,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.text.inverse,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
  },
  link: {
    color: colors.primary.mediumBrown,
    textAlign: "center",
    marginTop: spacing.base,
    fontSize: typography.fontSize.base,
  },
  error: {
    color: colors.semantic.error,
    textAlign: "center",
    marginBottom: spacing.sm,
    fontSize: typography.fontSize.base,
  },
  info: {
    color: colors.semantic.success,
    textAlign: "center",
    marginBottom: spacing.sm,
    fontSize: typography.fontSize.base,
  },
});
