import React from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import { LogBox } from "react-native";

export default function App() {
  LogBox.ignoreAllLogs(); // optional, hides warnings
  return <AppNavigator />;
}
