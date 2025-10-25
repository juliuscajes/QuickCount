import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen({ navigation }) {
  return (
    <LinearGradient
      colors={["#0f2027", "#203a43", "#2c5364"]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>🏠 QuickCount Home</Text>
        <Text style={styles.subtitle}>
          Welcome to your Budget Tracker App!{"\n"}
          Use the features below to take control of your finances.
        </Text>

        <View style={styles.card}>
          <Ionicons
            name="wallet"
            size={32}
            color="#00C853"
            style={styles.icon}
          />
          <Text style={styles.cardTitle}>💸 Expenses</Text>
          <Text style={styles.cardDesc}>
            Track and manage your daily spending.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Expense")}
          >
            <Text style={styles.buttonText}>View Expenses</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Ionicons
            name="bar-chart"
            size={32}
            color="#00C853"
            style={styles.icon}
          />
          <Text style={styles.cardTitle}>📊 Graph</Text>
          <Text style={styles.cardDesc}>Visualize your expenses easily.</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Graph")}
          >
            <Text style={styles.buttonText}>View Graph</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Ionicons
            name="swap-horizontal"
            size={32}
            color="#00C853"
            style={styles.icon}
          />
          <Text style={styles.cardTitle}>💱 Converter</Text>
          <Text style={styles.cardDesc}>Convert currencies instantly.</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Converter")}
          >
            <Text style={styles.buttonText}>Open Converter</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Ionicons
            name="people"
            size={32}
            color="#00C853"
            style={styles.icon}
          />
          <Text style={styles.cardTitle}>👥 Collaboration</Text>
          <Text style={styles.cardDesc}>
            Work with teammates in shared budgets.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Collaboration")}
          >
            <Text style={styles.buttonText}>Collaborate</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#d0f0c0",
    textAlign: "center",
    marginBottom: 30,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    width: "100%",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 8,
  },
  cardDesc: {
    fontSize: 14,
    color: "#ddd",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 15,
  },
  icon: {
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#00C853",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});
