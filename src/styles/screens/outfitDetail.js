import { StyleSheet } from "react-native";
import theme from "../theme";

/**
 * OutfitDetail Screen Specific Styles
 * Only styles unique to OutfitDetail that aren't in shared detail styles
 */
export const outfitDetailStyles = StyleSheet.create({
  // Description (unique to outfits - displayed differently than notes)
  description: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    lineHeight: 24,
    marginBottom: theme.spacing.base,
    letterSpacing: theme.typography.letterSpacing.normal,
  },

  // Tags Container (unique to outfits)
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },

  favoriteTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.primary.lightBeige,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    gap: theme.spacing.xs,
  },

  favoriteTagText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.accent.rose,
    fontWeight: theme.typography.fontWeight.medium,
  },

  occasionTag: {
    backgroundColor: theme.colors.primary.beige,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },

  occasionTagText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.fontWeight.medium,
  },

  // Items Section (unique to outfits - shows wardrobe items)
  itemsContainer: {
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },

  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.neutral.white,
    borderRadius: theme.borderRadius.base,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },

  itemImage: {
    width: 50,
    height: 50,
    borderRadius: theme.borderRadius.sm,
    marginRight: theme.spacing.md,
  },

  itemImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.primary.lightBeige,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },

  itemInfo: {
    flex: 1,
  },

  itemName: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: 2,
    letterSpacing: theme.typography.letterSpacing.normal,
  },

  itemCategory: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.tertiary,
    marginBottom: 2,
  },

  itemBrand: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.primary.warmBrown,
    fontWeight: theme.typography.fontWeight.medium,
  },
});

export default outfitDetailStyles;
