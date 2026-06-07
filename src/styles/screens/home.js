import { StyleSheet } from "react-native";
import theme from "../theme";

export const homeStyles = StyleSheet.create({
  // Header Summary
  headerSummary: {
    marginBottom: theme.spacing.xl,
    paddingTop: theme.spacing.sm,
  },

  headerTitle: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.light,
    color: theme.colors.text.primary,
    letterSpacing: theme.typography.letterSpacing.wide,
    marginBottom: theme.spacing.xs,
  },

  headerSubtitle: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.tertiary,
    lineHeight: 20,
    letterSpacing: theme.typography.letterSpacing.normal,
  },

  // Today's Outfit Widget - Filled State
  todayWidget: {
    backgroundColor: theme.colors.primary.lightBeige,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border.medium,
    ...theme.shadows.sm,
  },

  todayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },

  todayTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },

  todayTitle: {
    fontWeight: theme.typography.fontWeight.semibold,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    letterSpacing: theme.typography.letterSpacing.normal,
  },

  editIconContainer: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.base,
    backgroundColor: theme.colors.neutral.white,
    justifyContent: "center",
    alignItems: "center",
  },

  todayOutfitName: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
    letterSpacing: theme.typography.letterSpacing.normal,
  },

  todayRating: {
    flexDirection: "row",
    marginBottom: theme.spacing.xs,
    gap: 2,
  },

  star: {
    fontSize: 16,
  },

  todayNotes: {
    fontStyle: "italic",
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.sm,
    lineHeight: 18,
  },

  // Today's Outfit Widget - Empty State
  todayWidgetEmpty: {
    backgroundColor: theme.colors.neutral.white,
    padding: theme.spacing.xl,
    alignItems: "center",
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.xl,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: theme.colors.border.medium,
  },

  emptyIconContainer: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.primary.lightBeige,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },

  todayEmptyTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
    letterSpacing: theme.typography.letterSpacing.normal,
  },

  todayEmptySubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.tertiary,
    letterSpacing: theme.typography.letterSpacing.normal,
  },

  // Quick Stats
  quickStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing.md,
    gap: theme.spacing.md,
  },

  statCard: {
    backgroundColor: theme.colors.neutral.white,
    borderRadius: theme.borderRadius.base,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    flex: 1,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    ...theme.shadows.sm,
  },

  statNumber: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.primary.warmBrown,
    marginBottom: theme.spacing.xs,
  },

  statLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.tertiary,
    letterSpacing: theme.typography.letterSpacing.wide,
  },

  lastLogText: {
    textAlign: "center",
    color: theme.colors.text.tertiary,
    fontSize: theme.typography.fontSize.xs,
    marginBottom: theme.spacing.xl,
    letterSpacing: theme.typography.letterSpacing.wide,
  },

  // Section Headers
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.base,
  },

  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    letterSpacing: theme.typography.letterSpacing.normal,
  },

  // Highlight Cards
  highlightCards: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },

  highlightCard: {
    flex: 1,
    backgroundColor: theme.colors.neutral.white,
    borderRadius: theme.borderRadius.base,
    padding: theme.spacing.base,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    ...theme.shadows.sm,
  },

  highlightLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.tertiary,
    marginBottom: theme.spacing.xs,
    letterSpacing: theme.typography.letterSpacing.wide,
    textTransform: "uppercase",
  },

  highlightValue: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    letterSpacing: theme.typography.letterSpacing.normal,
  },

  highlightCount: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.tertiary,
    marginTop: theme.spacing.xs,
  },

  // Wardrobe Preview
  previewList: {
    paddingRight: theme.spacing.base,
  },

  previewCard: {
    width: 100,
    height: 100,
    borderRadius: theme.borderRadius.base,
    marginRight: theme.spacing.md,
    overflow: "hidden",
    backgroundColor: theme.colors.primary.lightBeige,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    ...theme.shadows.sm,
  },

  previewImage: {
    width: "100%",
    height: "100%",
  },

  previewPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.sm,
  },

  previewText: {
    fontSize: theme.typography.fontSize.xs,
    textAlign: "center",
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },

  // Usage Insights
  insightSection: {
    marginTop: theme.spacing.base,
  },

  subsectionTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    letterSpacing: theme.typography.letterSpacing.normal,
  },

  insightCard: {
    backgroundColor: theme.colors.neutral.white,
    borderRadius: theme.borderRadius.base,
    padding: theme.spacing.base,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    ...theme.shadows.sm,
  },

  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },

  itemRank: {
    width: 28,
    height: 28,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.primary.lightBeige,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },

  rankNumber: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.primary.warmBrown,
  },

  itemName: {
    flex: 1,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    letterSpacing: theme.typography.letterSpacing.normal,
  },

  countBadge: {
    backgroundColor: theme.colors.primary.beige,
    borderRadius: theme.borderRadius.round,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    minWidth: 40,
    alignItems: "center",
  },

  itemCount: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.secondary,
  },

  // Empty States
  emptyState: {
    backgroundColor: theme.colors.primary.lightBeige,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.base,
    alignItems: "center",
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: theme.colors.border.medium,
  },

  emptyText: {
    color: theme.colors.text.tertiary,
    fontSize: theme.typography.fontSize.sm,
    fontStyle: "italic",
    letterSpacing: theme.typography.letterSpacing.normal,
  },
});

export default homeStyles;
