import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      alert("Please enter your email and password.");
      return;
    }
    navigation.replace("Main");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={["#685281ff", "#574eceff"]}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.card}>
          <Text style={styles.title}>QuickCount Login</Text>
          <Text style={styles.subtitle}>Welcome back! Please sign in</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter Username"
            placeholderTextColor="#ddd"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.input}
            placeholder="Enter Password"
            placeholderTextColor="#ddd"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <LinearGradient
              colors={["#a100ff", "#00d4ff"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Login</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={styles.forgot}>Forget Password ?</Text>
          </TouchableOpacity>

          <Text style={styles.link} onPress={() => navigation.navigate("Register")}>
            Don’t have an account?{" "}
            <Text style={styles.linkHighlight}>Register</Text>
          </Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "85%",
    backgroundColor: "rgba(0, 0, 0, 1)",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#0c0c0cd5",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: "rgba(161, 155, 155, 0.8)",
    textAlign: "center",
    marginBottom: 25,
  },
  input: {
    width: "100%",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    color: "#fff",
    fontSize: 16,
    marginBottom: 15,
  },
  button: {
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
  },
  buttonGradient: {
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  forgot: {
    color: "#fff",
    fontSize: 14,
    marginTop: 12,
    textDecorationLine: "underline",
  },
  link: {
    color: "#fff",
    fontSize: 14,
    marginTop: 15,
    textAlign: "center",
  },
  linkHighlight: {
    fontWeight: "700",
    color: "#00d4ff",
  },
}
);
