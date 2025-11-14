/**
 * Global Reusable Styles
 * Common UI patterns used across multiple screens
 * Import these instead of recreating the same styles
 */

import { StyleSheet, Platform } from "react-native";
import theme from "./theme";

export const globalStyles = StyleSheet.create({
  // ============================================
  // CONTAINERS & LAYOUTS
  // ============================================

  // Main container for screens
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary.cream,
  },

  // Safe area container
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.primary.cream,
  },

  // Container with padding
  containerPadded: {
    flex: 1,
    backgroundColor: theme.colors.primary.cream,
    paddingHorizontal: theme.spacing.base,
  },

  // Content wrapper (accounts for bottom bar)
  contentWrapper: {
    flex: 1,
    paddingBottom: 85, // Bottom bar height
  },

  // Scroll view
  scrollView: {
    flex: 1,
  },

  // Scroll content with padding
  scrollContent: {
    paddingHorizontal: theme.spacing.base,
    paddingTop: theme.spacing.base,
    paddingBottom: theme.spacing.base,
  },

  // Centered container
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.primary.cream,
  },

  // ============================================
  // LAYOUT UTILITIES
  // ============================================

  // Flex rows
  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  rowAround: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  rowStart: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },

  rowEnd: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },

  // Flex columns
  column: {
    flexDirection: "column",
  },

  columnCentered: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  // Wrapping
  wrap: {
    flexWrap: "wrap",
  },

  // ============================================
  // TYPOGRAPHY
  // ============================================

  // Page title
  title: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.light,
    color: theme.colors.text.primary,
    letterSpacing: theme.typography.letterSpacing.wide,
  },

  // Large title
  titleLarge: {
    fontSize: theme.typography.fontSize.xxxl,
    fontWeight: theme.typography.fontWeight.light,
    color: theme.colors.text.primary,
    letterSpacing: theme.typography.letterSpacing.wide,
  },

  // Small title
  titleSmall: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.regular,
    color: theme.colors.text.primary,
  },

  // Subtitle
  subtitle: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.tertiary,
    lineHeight: 20,
    letterSpacing: theme.typography.letterSpacing.normal,
  },

  // Section title
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.base,
    letterSpacing: theme.typography.letterSpacing.normal,
  },

  // Body text
  bodyText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    lineHeight: 22,
  },

  // Small text
  smallText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.tertiary,
  },

  // Caption
  caption: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.tertiary,
    letterSpacing: theme.typography.letterSpacing.wide,
  },

  // Label
  label: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },

  // Link text
  link: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.primary.warmBrown,
    textDecorationLine: "underline",
  },

  // Error text
  errorText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.semantic.error,
    marginTop: theme.spacing.xs,
  },

  // Helper text
  helperText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.tertiary,
    marginTop: theme.spacing.xs,
  },

  // ============================================
  // CARDS
  // ============================================

  // Standard card
  card: {
    backgroundColor: theme.colors.neutral.white,
    borderRadius: theme.borderRadius.base,
    padding: theme.spacing.base,
    ...theme.shadows.sm,
  },

  // Card with light background
  cardLight: {
    backgroundColor: theme.colors.primary.lightBeige,
    borderRadius: theme.borderRadius.base,
    padding: theme.spacing.base,
    borderWidth: 1,
    borderColor: theme.colors.border.medium,
  },

  // Card with larger padding
  cardLarge: {
    backgroundColor: theme.colors.neutral.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    ...theme.shadows.md,
  },

  // Elevated card
  cardElevated: {
    backgroundColor: theme.colors.neutral.white,
    borderRadius: theme.borderRadius.base,
    padding: theme.spacing.base,
    ...theme.shadows.lg,
  },

  // ============================================
  // SECTIONS
  // ============================================

  section: {
    marginBottom: theme.spacing.xl,
  },

  sectionWithBorder: {
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },

  sectionPadded: {
    padding: theme.spacing.base,
  },

  // ============================================
  // HEADERS
  // ============================================

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.base,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: theme.spacing.base,
    backgroundColor: "transparent",
  },

  headerTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.light,
    color: theme.colors.text.primary,
    letterSpacing: theme.typography.letterSpacing.wide,
  },

  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary.lightBeige,
    justifyContent: "center",
    alignItems: "center",
  },

  headerSpacer: {
    width: 40, // Keeps title centered when one side has button
  },

  // ============================================
  // EMPTY STATES
  // ============================================

  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.xxxl,
  },

  emptyStateIcon: {
    marginBottom: theme.spacing.base,
  },

  emptyStateTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    textAlign: "center",
  },

  emptyStateText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.tertiary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: theme.spacing.lg,
  },

  // ============================================
  // DIVIDERS
  // ============================================

  divider: {
    height: 1,
    backgroundColor: theme.colors.border.light,
    marginVertical: theme.spacing.base,
  },

  dividerThick: {
    height: 2,
    backgroundColor: theme.colors.border.medium,
    marginVertical: theme.spacing.base,
  },

  dividerVertical: {
    width: 1,
    backgroundColor: theme.colors.border.light,
    marginHorizontal: theme.spacing.base,
  },

  // ============================================
  // BADGES
  // ============================================

  badge: {
    backgroundColor: theme.colors.primary.warmBrown,
    borderRadius: theme.borderRadius.round,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    minWidth: 20,
    minHeight: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  badgeText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.inverse,
  },

  badgeLight: {
    backgroundColor: theme.colors.primary.beige,
  },

  badgeLightText: {
    color: theme.colors.text.secondary,
  },

  // ============================================
  // SPACING UTILITIES
  // ============================================

  // Margins
  m0: { margin: 0 },
  m4: { margin: theme.spacing.xs },
  m8: { margin: theme.spacing.sm },
  m12: { margin: theme.spacing.md },
  m16: { margin: theme.spacing.base },
  m20: { margin: theme.spacing.lg },
  m24: { margin: theme.spacing.xl },

  // Margin Top
  mt0: { marginTop: 0 },
  mt4: { marginTop: theme.spacing.xs },
  mt8: { marginTop: theme.spacing.sm },
  mt12: { marginTop: theme.spacing.md },
  mt16: { marginTop: theme.spacing.base },
  mt20: { marginTop: theme.spacing.lg },
  mt24: { marginTop: theme.spacing.xl },
  mt32: { marginTop: theme.spacing.xxl },

  // Margin Bottom
  mb0: { marginBottom: 0 },
  mb4: { marginBottom: theme.spacing.xs },
  mb8: { marginBottom: theme.spacing.sm },
  mb12: { marginBottom: theme.spacing.md },
  mb16: { marginBottom: theme.spacing.base },
  mb20: { marginBottom: theme.spacing.lg },
  mb24: { marginBottom: theme.spacing.xl },
  mb32: { marginBottom: theme.spacing.xxl },

  // Margin Horizontal
  mh0: { marginHorizontal: 0 },
  mh4: { marginHorizontal: theme.spacing.xs },
  mh8: { marginHorizontal: theme.spacing.sm },
  mh12: { marginHorizontal: theme.spacing.md },
  mh16: { marginHorizontal: theme.spacing.base },
  mh20: { marginHorizontal: theme.spacing.lg },
  mh24: { marginHorizontal: theme.spacing.xl },

  // Margin Vertical
  mv0: { marginVertical: 0 },
  mv4: { marginVertical: theme.spacing.xs },
  mv8: { marginVertical: theme.spacing.sm },
  mv12: { marginVertical: theme.spacing.md },
  mv16: { marginVertical: theme.spacing.base },
  mv20: { marginVertical: theme.spacing.lg },
  mv24: { marginVertical: theme.spacing.xl },

  // Padding
  p0: { padding: 0 },
  p4: { padding: theme.spacing.xs },
  p8: { padding: theme.spacing.sm },
  p12: { padding: theme.spacing.md },
  p16: { padding: theme.spacing.base },
  p20: { padding: theme.spacing.lg },
  p24: { padding: theme.spacing.xl },

  // Padding Top
  pt0: { paddingTop: 0 },
  pt4: { paddingTop: theme.spacing.xs },
  pt8: { paddingTop: theme.spacing.sm },
  pt12: { paddingTop: theme.spacing.md },
  pt16: { paddingTop: theme.spacing.base },
  pt20: { paddingTop: theme.spacing.lg },
  pt24: { paddingTop: theme.spacing.xl },

  // Padding Bottom
  pb0: { paddingBottom: 0 },
  pb4: { paddingBottom: theme.spacing.xs },
  pb8: { paddingBottom: theme.spacing.sm },
  pb12: { paddingBottom: theme.spacing.md },
  pb16: { paddingBottom: theme.spacing.base },
  pb20: { paddingBottom: theme.spacing.lg },
  pb24: { paddingBottom: theme.spacing.xl },

  // Padding Horizontal
  ph0: { paddingHorizontal: 0 },
  ph4: { paddingHorizontal: theme.spacing.xs },
  ph8: { paddingHorizontal: theme.spacing.sm },
  ph12: { paddingHorizontal: theme.spacing.md },
  ph16: { paddingHorizontal: theme.spacing.base },
  ph20: { paddingHorizontal: theme.spacing.lg },
  ph24: { paddingHorizontal: theme.spacing.xl },

  // Padding Vertical
  pv0: { paddingVertical: 0 },
  pv4: { paddingVertical: theme.spacing.xs },
  pv8: { paddingVertical: theme.spacing.sm },
  pv12: { paddingVertical: theme.spacing.md },
  pv16: { paddingVertical: theme.spacing.base },
  pv20: { paddingVertical: theme.spacing.lg },
  pv24: { paddingVertical: theme.spacing.xl },

  // ============================================
  // SHADOWS
  // ============================================

  shadowNone: theme.shadows.none,
  shadowSm: theme.shadows.sm,
  shadowMd: theme.shadows.md,
  shadowLg: theme.shadows.lg,
  shadowXl: theme.shadows.xl,

  // ============================================
  // BORDERS
  // ============================================

  borderLight: {
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },

  borderMedium: {
    borderWidth: 1,
    borderColor: theme.colors.border.medium,
  },

  borderDark: {
    borderWidth: 1,
    borderColor: theme.colors.border.dark,
  },

  borderTop: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },

  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },

  borderDashed: {
    borderWidth: 2,
    borderColor: theme.colors.border.medium,
    borderStyle: "dashed",
  },

  // ============================================
  // BORDER RADIUS
  // ============================================

  roundedSm: { borderRadius: theme.borderRadius.sm },
  rounded: { borderRadius: theme.borderRadius.base },
  roundedLg: { borderRadius: theme.borderRadius.lg },
  roundedXl: { borderRadius: theme.borderRadius.xl },
  roundedFull: { borderRadius: theme.borderRadius.round },

  // ============================================
  // BACKGROUNDS
  // ============================================

  bgPrimary: {
    backgroundColor: theme.colors.primary.cream,
  },

  bgSecondary: {
    backgroundColor: theme.colors.primary.lightBeige,
  },

  bgWhite: {
    backgroundColor: theme.colors.neutral.white,
  },

  bgTransparent: {
    backgroundColor: "transparent",
  },

  // ============================================
  // MISC UTILITIES
  // ============================================

  // Absolute positioning
  absolute: {
    position: "absolute",
  },

  absoluteFill: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  // Opacity
  opacity50: { opacity: 0.5 },
  opacity70: { opacity: 0.7 },
  opacity90: { opacity: 0.9 },

  // Hidden
  hidden: {
    display: "none",
  },

  // Overflow
  overflowHidden: {
    overflow: "hidden",
  },

  // Z-index
  zIndex1: { zIndex: 1 },
  zIndex2: { zIndex: 2 },
  zIndex3: { zIndex: 3 },
  zIndex10: { zIndex: 10 },
});

export default globalStyles;
