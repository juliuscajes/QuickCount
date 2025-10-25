// screens/LoginScreen.js
import React, { useState } from "react";
import { View, TextInput, Button, Text, Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase"; // r import
import { View, Text, StyleSheet } from "react-native";
import InputField from "../Components/InputField";
import ButtonPrimary from "../Components/ButtonPrimary";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Welcome!", "Login successful");
      navigation.replace("Main");
    } catch (error) {
      Alert.alert("Login Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>QuickCount Login</Text>

      <InputField placeholder="Email" value={email} onChangeText={setEmail} />
      <InputField
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <ButtonPrimary title="Login" onPress={() => navigation.replace("Main")} />

      <Text style={styles.link} onPress={() => navigation.navigate("Register")}>
        Don’t have an account? Register
      </Text>
    </View>
  );
}
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 24, textAlign: "center", marginBottom: 20 },
  link: { color: "blue", textAlign: "center", marginTop: 10 },
});
