import { StyleSheet } from "react-native";
import theme from "../theme";

/**
 * ClothesDetail Screen Specific Styles
 * Only styles unique to ClothesDetail that aren't in shared detail styles
 */
export const clothesDetailStyles = StyleSheet.create({
  // Image Container (unique to clothes - full width hero image)
  imageContainer: {
    height: 300,
    backgroundColor: theme.colors.primary.lightBeige,
  },

  mainImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  imagePlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  // Brand Text (unique to clothes)
  brandText: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.primary.warmBrown,
    fontWeight: theme.typography.fontWeight.semibold,
    marginBottom: theme.spacing.sm,
    letterSpacing: theme.typography.letterSpacing.normal,
  },

  // Category Badge (unique styling for clothes)
  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: theme.colors.primary.beige,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.lg,
  },

  categoryText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.fontWeight.medium,
    letterSpacing: theme.typography.letterSpacing.wide,
  },
});

export default clothesDetailStyles;
