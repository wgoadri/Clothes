import { StyleSheet } from 'react-native';
import theme from '../theme';

export const dailyOutfitLoggerStyles = StyleSheet.create({
  // ============================================
  // LOADING & CENTERED STATES
  // ============================================

  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: theme.spacing.xxxl,
  },

  // ============================================
  // HEADER
  // ============================================

  pageTitle: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.light,
    color: theme.colors.text.primary,
    letterSpacing: theme.typography.letterSpacing.wide,
    marginBottom: theme.spacing.xs,
  },

  pageTitleAlreadyLogged: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.tertiary,
    letterSpacing: theme.typography.letterSpacing.wide,
    marginBottom: theme.spacing.xl,
  },

  // ============================================
  // SECTION LABELS
  // ============================================

  sectionLabel: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.tertiary,
    letterSpacing: theme.typography.letterSpacing.wider,
    textTransform: 'uppercase',
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.xl,
  },

  // ============================================
  // OUTFIT SELECTION
  // ============================================

  outfitCard: {
    backgroundColor: theme.colors.neutral.white,
    borderRadius: theme.borderRadius.base,
    padding: theme.spacing.md,
    marginRight: theme.spacing.md,
    width: 120,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    ...theme.shadows.sm,
  },

  outfitCardSelected: {
    backgroundColor: theme.colors.primary.lightBeige,
    borderWidth: 2,
    borderColor: theme.colors.primary.warmBrown,
  },

  outfitCardDisabled: {
    opacity: 0.55,
  },

  previewRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
  },

  miniPreview: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.xs,
    marginRight: theme.spacing.xs,
  },

  outfitName: {
    fontSize: theme.typography.fontSize.sm,
    textAlign: 'center',
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
  },

  outfitListContent: {
    paddingBottom: theme.spacing.sm,
  },

  // ============================================
  // RATING
  // ============================================

  starsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },

  starButton: {
    padding: theme.spacing.xs,
  },

  // ============================================
  // READ-ONLY / ALREADY LOGGED STATE
  // ============================================

  readOnlyText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },

  // ============================================
  // NOTES INPUT
  // ============================================

  notesInput: {
    borderWidth: 1,
    borderColor: theme.colors.border.medium,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
    minHeight: 88,
    textAlignVertical: 'top',
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.neutral.white,
  },

  // ============================================
  // PHOTOS
  // ============================================

  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary.lightBeige,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.medium,
    minHeight: theme.dimensions.button.base,
  },

  photoButtonText: {
    marginLeft: theme.spacing.sm,
    color: theme.colors.primary.warmBrown,
    fontWeight: theme.typography.fontWeight.medium,
    fontSize: theme.typography.fontSize.base,
  },

  photoPreview: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.sm,
    marginRight: theme.spacing.sm,
  },

  photoListContent: {
    paddingBottom: theme.spacing.sm,
  },

  // ============================================
  // INLINE ERROR
  // ============================================

  inlineError: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.semantic.error,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },

  // ============================================
  // SAVE BUTTON
  // ============================================

  saveButton: {
    backgroundColor: theme.colors.primary.warmBrown,
    borderRadius: theme.borderRadius.base,
    paddingVertical: theme.spacing.base,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.xxl,
    marginBottom: theme.spacing.xl,
    minHeight: theme.dimensions.button.lg,
    ...theme.shadows.md,
  },

  saveButtonDisabled: {
    opacity: 0.6,
  },

  saveButtonText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    letterSpacing: theme.typography.letterSpacing.wide,
  },
});

export default dailyOutfitLoggerStyles;
