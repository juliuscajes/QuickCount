import React, { useState } from "react";
import { View, TextInput, Button, Text, Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Welcome!", "Login successful");
      navigation.replace("Home");
    } catch (error) {
      Alert.alert("Login Error", error.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, textAlign: "center" }}>Login</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
      />
      <Button title="Login" onPress={handleLogin} />
      <Text
        style={{ marginTop: 20, color: "blue", textAlign: "center" }}
        onPress={() => navigation.navigate("Register")}
      >
        Don’t have an account? Register
      </Text>
    </View>
  );
}
