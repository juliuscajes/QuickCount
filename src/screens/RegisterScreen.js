import React, { useState } from "react";
import { View, TextInput, Button, Text, Alert } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Success", "Account created!");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Registration Error", error.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, textAlign: "center" }}>Register</Text>
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
      <Button title="Sign Up" onPress={handleRegister} />
      <Text
        style={{ marginTop: 20, color: "blue", textAlign: "center" }}
        onPress={() => navigation.navigate("Login")}
      >
        Already have an account? Login
      </Text>
    </View>
  );
}
