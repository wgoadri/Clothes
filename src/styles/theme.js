/**
 * Design System Theme
 * Single source of truth for all design tokens
 */

export const colors = {
  // Primary Palette - Warm Earth Tones
  primary: {
    cream: "#FAF8F5",
    lightBeige: "#F5EDE5",
    beige: "#E8DED2",
    warmBrown: "#C9A07A",
    mediumBrown: "#A47E5C",
    darkBrown: "#8B7355",
    richBrown: "#6B5B4D",
  },

  // Neutrals
  neutral: {
    white: "#FFFFFF",
    lightGray: "#F0EBE3",
    gray: "#A89888",
    darkGray: "#6B5B4D",
  },

  // Semantic Colors
  semantic: {
    success: "#7CB342",
    error: "#D97757",
    warning: "#F9A825",
    info: "#42A5F5",
  },

  // Accent Colors
  accent: {
    gold: "#D4AF37",
    rose: "#D97757",
  },

  // Text Colors
  text: {
    primary: "#6B5B4D",
    secondary: "#8B7355",
    tertiary: "#A89888",
    inverse: "#FFFFFF",
    placeholder: "#A89888",
  },

  // Background Colors
  background: {
    primary: "#FAF8F5",
    secondary: "#F5EDE5",
    card: "#FFFFFF",
    overlay: "rgba(107, 91, 77, 0.5)",
  },

  // Border Colors
  border: {
    light: "#F0EBE3",
    medium: "#E8DED2",
    dark: "#C9A07A",
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  huge: 48,
};

export const typography = {
  // Font Sizes
  fontSize: {
    xs: 11,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 28,
    huge: 32,
  },

  // Font Weights
  fontWeight: {
    light: "300",
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },

  // Line Heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },

  // Letter Spacing
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.3,
    wider: 0.5,
  },
};

export const borderRadius = {
  xs: 4,
  sm: 8,
  base: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  round: 999,
};

export const shadows = {
  none: {
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: colors.primary.darkBrown,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: colors.primary.darkBrown,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: colors.primary.darkBrown,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  xl: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
};

export const gradients = {
  primary: [colors.primary.warmBrown, colors.primary.mediumBrown],
  secondary: [colors.primary.lightBeige, colors.primary.beige],
  background: [colors.primary.cream, colors.primary.lightBeige],
  overlay: ["rgba(250, 248, 245, 0.95)", colors.primary.cream],
  gold: ["#D4AF37", "#C9A07A"],
};

export const dimensions = {
  // Bottom bar
  bottomBarHeight: 85,

  // Top bar
  topBarHeight: 60,

  // Icon sizes
  icon: {
    xs: 16,
    sm: 20,
    base: 24,
    lg: 28,
    xl: 32,
    xxl: 40,
  },

  // Button heights
  button: {
    sm: 36,
    base: 44,
    lg: 52,
  },

  // Input heights
  input: {
    base: 44,
    lg: 52,
  },
};

export const layout = {
  containerPadding: spacing.base,
  screenPadding: spacing.base,
  cardPadding: spacing.base,
  sectionSpacing: spacing.xl,
};

export const animation = {
  duration: {
    fast: 150,
    normal: 250,
    slow: 350,
  },
  easing: {
    easeIn: "ease-in",
    easeOut: "ease-out",
    easeInOut: "ease-in-out",
  },
};

// Helper function to add opacity to hex colors
export const addOpacity = (hexColor, opacity) => {
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export default {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
  gradients,
  dimensions,
  layout,
  animation,
  addOpacity,
};
