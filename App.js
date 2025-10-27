// import { StatusBar } from "expo-status-bar";
// import { StyleSheet, Text, View } from "react-native";

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Welcome to Closet!</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: "center", alignItems: "center" },
//   title: { fontSize: 24, fontWeight: "bold" },
// });

// import React from "react";
// import AppNavigator from "./src/navigation/AppNavigator";
// import { LogBox } from "react-native";

// export default function App() {
//   LogBox.ignoreAllLogs(); // optional, hides warnings
//   return <AppNavigator />;
// }

import React from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import { WardrobeProvider } from "./src/context/WardrobeContext";

export default function App() {
  return (
    <WardrobeProvider>
      <AppNavigator />
    </WardrobeProvider>
  );
}

// import React from "react";
// import { View, Text, Button, FlatList, StyleSheet } from "react-native";

// // Dummy data for wardrobe items
// const dummyWardrobeItems = [
//   {
//     id: "1",
//     name: "Blue Jacket",
//     category: "Jacket",
//     imageURL: "https://via.placeholder.com/100",
//   },
//   {
//     id: "2",
//     name: "Red Shirt",
//     category: "Shirt",
//     imageURL: "https://via.placeholder.com/100",
//   },
//   {
//     id: "3",
//     name: "Black Pants",
//     category: "Pants",
//     imageURL: "https://via.placeholder.com/100",
//   },
// ];

// // Reusable Wardrobe Item Card Component
// function WardrobeItemCard({ item }) {
//   return (
//     <View style={styles.card}>
//       <Text style={styles.name}>{item.name}</Text>
//       <Text style={styles.category}>{item.category}</Text>
//     </View>
//   );
// }

// // Home Screen (dummy version)
// function HomeScreen({ navigation }) {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Welcome to Closet MVP</Text>
//       <Button
//         title="View Wardrobe"
//         onPress={() => navigation.navigate("Wardrobe")}
//       />
//     </View>
//   );
// }

// // Wardrobe Screen (dummy version)
// function WardrobeScreen() {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Your Wardrobe</Text>
//       <FlatList
//         data={dummyWardrobeItems}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => <WardrobeItemCard item={item} />}
//       />
//     </View>
//   );
// }

// // Simple navigation replacement (for testing without React Navigation)
// export default function App() {
//   const [currentScreen, setCurrentScreen] = React.useState("Home");

//   const navigate = (screenName) => setCurrentScreen(screenName);

//   if (currentScreen === "Home") {
//     return <HomeScreen navigation={{ navigate }} />;
//   }
//   if (currentScreen === "Wardrobe") {
//     return (
//       <View style={{ flex: 1 }}>
//         <Button title="Back to Home" onPress={() => navigate("Home")} />
//         <WardrobeScreen />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text>Screen not found</Text>
//     </View>
//   );
// }

// // Styles
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
//   card: {
//     margin: 10,
//     padding: 10,
//     borderWidth: 1,
//     borderRadius: 8,
//     width: 200,
//     alignItems: "center",
//   },
//   name: { fontWeight: "bold" },
//   category: { color: "gray" },
// });
