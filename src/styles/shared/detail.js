import { StyleSheet } from "react-native";
import theme from "../theme";

/**
 * Shared Detail Screen Styles
 * Common patterns used in OutfitDetail and ClothesDetail screens
 */
export const sharedDetailStyles = StyleSheet.create({
  // ============================================
  // CONTAINER & LAYOUT
  // ============================================
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary.cream,
  },

  scrollContainer: {
    flex: 1,
  },

  // ============================================
  // HEADER (Floating)
  // ============================================
  headerFloating: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.base,
    zIndex: 10,
  },

  headerFloatingButton: {
    backgroundColor: theme.addOpacity(theme.colors.primary.darkBrown, 0.5),
    borderRadius: theme.borderRadius.xl,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    ...theme.shadows.md,
  },

  // Header (Fixed)
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.base,
    paddingTop: 60,
    paddingBottom: theme.spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
    backgroundColor: theme.colors.primary.cream,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.xl,
    backgroundColor: theme.colors.primary.lightBeige,
    justifyContent: "center",
    alignItems: "center",
  },

  headerActions: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },

  headerActionButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.xl,
    backgroundColor: theme.colors.primary.lightBeige,
    justifyContent: "center",
    alignItems: "center",
  },

  // ============================================
  // MAIN INFO SECTION
  // ============================================
  mainInfo: {
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },

  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: theme.spacing.md,
    gap: theme.spacing.md,
  },

  itemName: {
    flex: 1,
    fontSize: theme.typography.fontSize.xxxl,
    fontWeight: theme.typography.fontWeight.light,
    color: theme.colors.text.primary,
    letterSpacing: theme.typography.letterSpacing.wide,
  },

  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.primary.beige,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.base,
    gap: theme.spacing.xs,
  },

  ratingText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },

  // ============================================
  // SECTION HEADERS
  // ============================================
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

  // ============================================
  // STATS SECTION
  // ============================================
  statsContainer: {
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },

  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: theme.spacing.md,
  },

  statCard: {
    flex: 1,
    alignItems: "center",
    backgroundColor: theme.colors.neutral.white,
    padding: theme.spacing.base,
    borderRadius: theme.borderRadius.base,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    ...theme.shadows.sm,
  },

  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.primary.lightBeige,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },

  statValue: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
    textAlign: "center",
  },

  statLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.tertiary,
    textAlign: "center",
    letterSpacing: theme.typography.letterSpacing.wide,
  },

  // ============================================
  // DETAILS SECTION
  // ============================================
  detailsContainer: {
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },

  infoLabel: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.tertiary,
    marginLeft: theme.spacing.md,
    minWidth: 100,
    letterSpacing: theme.typography.letterSpacing.normal,
  },

  infoValue: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.fontWeight.medium,
    flex: 1,
    letterSpacing: theme.typography.letterSpacing.normal,
  },

  // ============================================
  // CHIPS & TAGS
  // ============================================
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    flex: 1,
    gap: theme.spacing.xs,
  },

  chip: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },

  chipText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium,
  },

  // Season chips
  seasonChip: {
    backgroundColor: theme.colors.primary.beige,
  },

  seasonChipText: {
    color: theme.colors.text.secondary,
  },

  // Occasion chips
  occasionChip: {
    backgroundColor: theme.colors.primary.lightBeige,
  },

  occasionChipText: {
    color: theme.colors.text.secondary,
  },

  // ============================================
  // TEXT CONTENT SECTIONS
  // ============================================
  textContentContainer: {
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },

  textContentCard: {
    backgroundColor: theme.colors.primary.lightBeige,
    padding: theme.spacing.base,
    borderRadius: theme.borderRadius.base,
    borderWidth: 1,
    borderColor: theme.colors.border.medium,
  },

  textContent: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    lineHeight: 24,
    letterSpacing: theme.typography.letterSpacing.normal,
  },

  textContentItalic: {
    fontStyle: "italic",
  },

  // ============================================
  // ACTIONS SECTION
  // ============================================
  actionsContainer: {
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.lg,
    gap: theme.spacing.md,
  },

  primaryAction: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary.warmBrown,
    borderRadius: theme.borderRadius.base,
    padding: theme.spacing.base,
    gap: theme.spacing.sm,
    ...theme.shadows.sm,
  },

  primaryActionText: {
    color: theme.colors.text.inverse,
    fontWeight: theme.typography.fontWeight.semibold,
    fontSize: theme.typography.fontSize.base,
    letterSpacing: theme.typography.letterSpacing.normal,
  },

  secondaryAction: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.neutral.white,
    borderWidth: 1,
    borderColor: theme.colors.border.dark,
    borderRadius: theme.borderRadius.base,
    padding: theme.spacing.base,
    gap: theme.spacing.sm,
  },

  secondaryActionText: {
    color: theme.colors.primary.warmBrown,
    fontWeight: theme.typography.fontWeight.semibold,
    fontSize: theme.typography.fontSize.base,
    letterSpacing: theme.typography.letterSpacing.normal,
  },

  deleteAction: {
    borderColor: theme.colors.semantic.error,
  },

  deleteActionText: {
    color: theme.colors.semantic.error,
  },

  bottomSpacing: {
    height: 100,
  },

  // ============================================
  // MODAL STYLES
  // ============================================
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.primary.cream,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.base,
    paddingTop: 60,
    paddingBottom: theme.spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },

  modalCloseButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.xl,
    backgroundColor: theme.colors.primary.lightBeige,
    justifyContent: "center",
    alignItems: "center",
  },

  modalTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    letterSpacing: theme.typography.letterSpacing.normal,
  },

  saveButton: {
    color: theme.colors.primary.warmBrown,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },

  modalContent: {
    flex: 1,
    paddingHorizontal: theme.spacing.base,
    paddingTop: theme.spacing.lg,
  },

  inputLabel: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    letterSpacing: theme.typography.letterSpacing.normal,
  },

  editInput: {
    borderWidth: 1,
    borderColor: theme.colors.border.medium,
    borderRadius: theme.borderRadius.base,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.base,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.neutral.white,
  },

  textArea: {
    height: 100,
    textAlignVertical: "top",
  },

  // ============================================
  // EMPTY STATES
  // ============================================
  emptyState: {
    alignItems: "center",
    padding: theme.spacing.xxxl,
    backgroundColor: theme.colors.primary.lightBeige,
    borderRadius: theme.borderRadius.base,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: theme.colors.border.medium,
  },

  emptyIconContainer: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.neutral.white,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },

  emptyText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.tertiary,
    letterSpacing: theme.typography.letterSpacing.normal,
  },
});

export default sharedDetailStyles;
