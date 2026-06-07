import { StyleSheet } from "react-native";
import theme from "../theme";

export const outfitCardStyles = StyleSheet.create({
  // Card Container
  card: {
    backgroundColor: theme.colors.neutral.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.base,
    marginBottom: theme.spacing.base,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    position: "relative",
    ...theme.shadows.md,
  },

  // Header Section
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: theme.spacing.md,
  },

  titleContainer: {
    flex: 1,
    marginRight: theme.spacing.md,
  },

  name: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
    letterSpacing: theme.typography.letterSpacing.normal,
  },

  badges: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    flexWrap: "wrap",
  },

  itemCountBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.primary.lightBeige,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 3,
    borderRadius: theme.borderRadius.sm,
  },

  itemCountText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    marginLeft: 2,
    fontWeight: theme.typography.fontWeight.medium,
  },

  seasonBadge: {
    backgroundColor: theme.colors.primary.beige,
    borderRadius: theme.borderRadius.sm,
    padding: 4,
  },

  favoriteBadge: {
    backgroundColor: theme.colors.primary.lightBeige,
    borderRadius: theme.borderRadius.sm,
    padding: 4,
  },

  // Actions
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },

  wearTodayButton: {
    backgroundColor: theme.colors.primary.lightBeige,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border.medium,
  },

  actionButton: {
    padding: theme.spacing.xs,
  },

  // Preview Section
  previewContainer: {
    position: "relative",
    marginBottom: theme.spacing.md,
  },

  previewRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },

  previewImageContainer: {
    position: "relative",
  },

  previewImage: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.base,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },

  moreItemsOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.addOpacity(theme.colors.primary.darkBrown, 0.8),
    borderRadius: theme.borderRadius.base,
    justifyContent: "center",
    alignItems: "center",
  },

  moreItemsText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
  },

  emptyPreview: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary.lightBeige,
    borderRadius: theme.borderRadius.base,
    padding: theme.spacing.lg,
    borderWidth: 2,
    borderColor: theme.colors.border.medium,
    borderStyle: "dashed",
    minHeight: 80,
  },

  emptyIconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.neutral.white,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },

  emptyPreviewText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.tertiary,
    marginTop: theme.spacing.xs,
    letterSpacing: theme.typography.letterSpacing.normal,
  },

  usageBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    borderRadius: theme.borderRadius.base,
    minWidth: 24,
    height: 24,
    paddingHorizontal: theme.spacing.xs,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: theme.colors.neutral.white,
    ...theme.shadows.sm,
  },

  usageBadgeText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
  },

  // Info Section
  infoContainer: {
    gap: theme.spacing.sm,
  },

  occasionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    flexWrap: "wrap",
  },

  occasionTag: {
    backgroundColor: theme.colors.primary.beige,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },

  occasionTagText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium,
    letterSpacing: theme.typography.letterSpacing.normal,
  },

  moreOccasions: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.tertiary,
    fontWeight: theme.typography.fontWeight.medium,
  },

  // Stats
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },

  statText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.tertiary,
    letterSpacing: theme.typography.letterSpacing.normal,
  },

  ratingText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.fontWeight.medium,
  },

  description: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.tertiary,
    lineHeight: 18,
    fontStyle: "italic",
    letterSpacing: theme.typography.letterSpacing.normal,
  },

  // Click Indicator
  clickIndicator: {
    position: "absolute",
    right: theme.spacing.sm,
    top: "50%",
    transform: [{ translateY: -8 }],
  },
});

export default outfitCardStyles;
