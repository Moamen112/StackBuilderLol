// colors.js
export const COLORS = {
  // Primary League of Legends Colors
  primary: "#0AC8B9", // Teal - LoL's signature color
  primaryDark: "#09A89A", // Darker teal for pressed states
  primaryLight: "#E6F7F6", // Light teal for backgrounds

  // Secondary Colors
  secondary: "#C8AA6E", // Gold - LoL's accent color
  secondaryDark: "#B09352", // Darker gold
  secondaryLight: "#F0E6D2", // Light gold/beige

  // Background Colors
  background: "#0A1428", // Dark blue - LoL's main background
  backgroundSecondary: "#142740", // Slightly lighter blue
  backgroundCard: "##091428", // Card background
  backgroundOverlay: "rgba(10, 20, 40, 0.9)", // Overlay with transparency

  // Text Colors
  textPrimary: "#F0E6D2", // Light beige/gold text
  textSecondary: "#C8AA6E", // Gold text
  textTertiary: "#A09B8C", // Muted text
  textWhite: "#FFFFFF",
  textBlack: "#000000",

  // Status Colors
  success: "#32CD32", // Green
  warning: "#FFD700", // Yellow
  error: "#FF4433", // Red
  info: "#1E90FF", // Blue

  // Champion Roles Colors
  roleFighter: "#FF6B35", // Orange
  roleMage: "#9B59B6", // Purple
  roleMarksman: "#3498DB", // Blue
  roleAssassin: "#E74C3C", // Red
  roleTank: "#2ECC71", // Green
  roleSupport: "#F1C40F", // Yellow

  // Difficulty Levels
  difficultyEasy: "#2ECC71", // Green
  difficultyMedium: "#F1C40F", // Yellow
  difficultyHard: "#E74C3C", // Red

  // Utility Colors
  border: "#C8AA6E", // Gold border
  divider: "rgba(200, 170, 110, 0.3)", // Transparent gold divider
  shadow: "rgba(0, 0, 0, 0.5)", // Shadow color
  transparent: "transparent",

  // Gradient Colors (for backgrounds)
  gradientPrimary: ["#0AC8B9", "#09A89A"], // Teal gradient
  gradientSecondary: ["#C8AA6E", "#B09352"], // Gold gradient
  gradientBackground: ["#0A1428", "#142740"], // Background gradient
};

// Export individual color groups for easier import
export const PRIMARY_COLORS = {
  primary: COLORS.primary,
  primaryDark: COLORS.primaryDark,
  primaryLight: COLORS.primaryLight,
};

export const TEXT_COLORS = {
  primary: COLORS.textPrimary,
  secondary: COLORS.textSecondary,
  tertiary: COLORS.textTertiary,
  white: COLORS.textWhite,
  black: COLORS.textBlack,
};
