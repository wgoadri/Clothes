import { StyleSheet } from "react-native";
import theme from "../theme";
import { globalStyles } from "../globalStyles";

export const topBarStyles = StyleSheet.create({
  container: {
    height: 80,
    backgroundColor: theme.colors.primary.cream,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
    shadowColor: theme.colors.primary.mediumBrown,
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
    borderRadius: theme.borderRadius.xl,
    borderWidth: 2,
    borderColor: "#F5E6D8",
    shadowColor: theme.colors.primary.mediumBrown,
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
    backgroundColor: theme.colors.primary.lightBeige,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: theme.colors.primary.mediumBrown,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    zIndex: 1,
  },
});

export default topBarStyles;
