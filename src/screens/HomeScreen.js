import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏠 QuickCount Home</Text>
      <Text style={styles.subtitle}>
        Welcome to your Budget Tracker App!{"\n"}
        Use the tabs below to navigate between features.
      </Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>💸 Expenses</Text>
        <Text style={styles.infoSub}>
          Track and manage your daily spending.
        </Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>📊 Graph</Text>
        <Text style={styles.infoSub}>Visualize your expenses easily.</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>💱 Converter</Text>
        <Text style={styles.infoSub}>Convert currencies instantly.</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>👥 Collaboration</Text>
        <Text style={styles.infoSub}>
          Work with teammates in shared budgets.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F7F9FC",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 15,
  },
  subtitle: {
    textAlign: "center",
    color: "gray",
    marginBottom: 25,
  },
  infoBox: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  infoSub: {
    fontSize: 14,
    color: "gray",
  },
});
