// src/constants/outfitConstants.js

export const SEASONS = [
  { id: "spring", name: "Spring", icon: "flower-outline" },
  { id: "summer", name: "Summer", icon: "sunny-outline" },
  { id: "autumn", name: "Autumn", icon: "leaf-outline" },
  { id: "winter", name: "Winter", icon: "snow-outline" },
  { id: "all", name: "All Seasons", icon: "calendar-outline" },
];

export const OCCASIONS = [
  "Casual",
  "Work",
  "Formal",
  "Party",
  "Sport",
  "Beach",
  "Travel",
  "Date",
  "Wedding",
  "Meeting",
];

export const OUTFIT_STEPS = {
  UPLOAD: 1,
  SELECT: 2,
  DETAILS: 3,
};

export const OUTFIT_STEP_LABELS = {
  [OUTFIT_STEPS.UPLOAD]: "Picture",
  [OUTFIT_STEPS.SELECT]: "Items",
  [OUTFIT_STEPS.DETAILS]: "Details",
};
