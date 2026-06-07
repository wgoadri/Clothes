import { StyleSheet } from "react-native";
import theme from "../theme";

export const flatListScreenStyles = StyleSheet.create({
  listContainer: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.base,
    paddingTop: theme.spacing.base,
    paddingBottom: theme.spacing.xl,
  },
});

export default flatListScreenStyles;
