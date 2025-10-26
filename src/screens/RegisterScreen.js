import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import InputField from "../Components/InputField";
import ButtonPrimary from "../Components/ButtonPrimary";

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create Your QuickCount Account</Text>
      <Text style={styles.subtitle}>Start tracking your budget today 💼</Text>

      <View style={styles.card}>
        <Text style={styles.title}>Register</Text>

        <InputField
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <InputField
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <ButtonPrimary
          title="Sign Up"
          onPress={() => alert("Register clicked")}
        />

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.link}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F6FC",
    padding: 20,
    justifyContent: "center",
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    color: "#007AFF",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  link: {
    color: "#007AFF",
    textAlign: "center",
    marginTop: 16,
    fontWeight: "500",
  },
});