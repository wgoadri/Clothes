import { StyleSheet, Dimensions, Platform } from "react-native";
import theme from "../theme";

const { width } = Dimensions.get("window");

export const bottomBarStyles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    width: width,
    height: theme.dimensions.bottomBarHeight,
    backgroundColor: theme.colors.primary.cream,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: theme.spacing.base,
    paddingBottom: Platform.OS === "ios" ? 10 : 8,
    shadowColor: theme.colors.primary.mediumBrown,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
  },

  gradientBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "100%",
  },

  tabButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.sm,
    flex: 1,
  },

  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.xl,
    backgroundColor: theme.colors.primary.lightBeige,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },

  tabLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.fontWeight.regular,
    letterSpacing: theme.typography.letterSpacing.wide,
    marginTop: 2,
  },

  centerButtonWrapper: {
    position: "absolute",
    top: -30,
    alignSelf: "center",
    zIndex: 2,
  },

  centerButton: {
    width: 68,
    height: 68,
    borderRadius: 34,
    shadowColor: theme.colors.primary.mediumBrown,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 8,
  },

  centerGradient: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: theme.colors.primary.cream,
  },
});

export default bottomBarStyles;
