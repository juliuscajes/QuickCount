import React from "react";
import { View, Text, Button } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";

export default function HomeScreen({ navigation }) {
  const handleLogout = async () => {
    await signOut(auth);
    navigation.replace("Login");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20 }}>Welcome to QuickCount 🎉</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}
