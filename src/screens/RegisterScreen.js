import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import InputField from "../Components/InputField";
import ButtonPrimary from "../Components/ButtonPrimary";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import { auth, db } from "../config/firebase";

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !name) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Create user in Realtime Database
      await set(ref(db, "users/" + user.uid), {
        name: name,
        email: email,
        createdAt: new Date().toISOString(),
        budget: 0,
        totalSpent: 0,
        expenses: {},
      });

      Alert.alert("Success", "Account created successfully!");
      // Navigation handled by AppNavigator
    } catch (error) {
      Alert.alert("Registration Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Create Your Account</Text>
          <Text style={styles.subtitle}>
            Start tracking your budget today 💼
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <Text style={styles.icon}>🚀</Text>
            </View>
          </View>

          <Text style={styles.title}>Join QuickCount</Text>

          <InputField
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            icon="👤"
            placeholderTextColor="#A0AEC0"
            textColor="#FFFFFF"
          />
          <InputField
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            icon="✉️"
            placeholderTextColor="#A0AEC0"
            textColor="#FFFFFF"
          />
          <InputField
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            icon="🔒"
            placeholderTextColor="#A0AEC0"
            textColor="#FFFFFF"
          />

          <ButtonPrimary
            title={loading ? "Creating Account..." : "Sign Up"}
            onPress={handleRegister}
            disabled={loading}
          />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Already have an account?</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.loginText}>
              Sign in to your account{" "}
              <Text style={styles.loginHighlight}>here</Text>
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Secure registration with Firebase
          </Text>
          <Text style={styles.footerSubtext}>Your data is protected</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E2A3A",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    color: "#FFFFFF",
    marginBottom: 8,
    letterSpacing: -0.5,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 17,
    textAlign: "center",
    color: "#E8EDF5",
    marginBottom: 20,
    lineHeight: 24,
    fontWeight: "500",
  },
  card: {
    backgroundColor: "#2A3A4A",
    borderRadius: 24,
    padding: 28,
    shadowColor: "#000000",
    shadowOpacity: 0.4,
    shadowRadius: 25,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    elevation: 12,
    borderWidth: 1,
    borderColor: "#3A4A5A",
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 12,
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#4ECDC4",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#4ECDC4",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  icon: {
    fontSize: 28,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 28,
    color: "#FFFFFF",
    letterSpacing: -0.5,
    lineHeight: 32,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#3A4A5A",
  },
  dividerText: {
    color: "#B8C5D6",
    paddingHorizontal: 16,
    fontWeight: "600",
    fontSize: 14,
    backgroundColor: "#2A3A4A",
  },
  loginButton: {
    marginTop: 8,
    paddingVertical: 12,
    backgroundColor: "#3A4A5A",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#4A5A6A",
  },
  loginText: {
    color: "#E8EDF5",
    textAlign: "center",
    fontWeight: "500",
    fontSize: 16,
  },
  loginHighlight: {
    color: "#4ECDC4",
    fontWeight: "700",
  },
  footer: {
    marginTop: 32,
    alignItems: "center",
    padding: 16,
  },
  footerText: {
    color: "#B8C5D6",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  footerSubtext: {
    color: "#8A9BB0",
    fontSize: 12,
    fontWeight: "400",
  },
});
