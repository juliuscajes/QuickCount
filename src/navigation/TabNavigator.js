import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

// Import your screens
import HomeScreen from "../screens/HomeScreen";
import ExpenseScreen from "../screens/ExpenseScreen";
import GraphScreen from "../screens/GraphScreen";
import ConverterScreen from "../screens/ConverterScreen";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "gray",
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "Expenses") {
            iconName = "wallet";
          } else if (route.name === "Graph") {
            iconName = "bar-chart";
          } else if (route.name === "Converter") {
            iconName = "swap-horizontal";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Expenses" component={ExpenseScreen} />
      <Tab.Screen name="Graph" component={GraphScreen} />
      <Tab.Screen name="Converter" component={ConverterScreen} />
    </Tab.Navigator>
  );
}
