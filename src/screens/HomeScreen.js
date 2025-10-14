import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to QuickCount 🎉</Text>
      <Button
        title="Go to Expense Tracker 💰"
        onPress={() => navigation.navigate("Expense")}
      />
      <Button
        title="View Graph 📊"
        onPress={() => navigation.navigate("Graph")}
      />
      <Button
        title="Currency Converter 💱"
        onPress={() => navigation.navigate("Converter")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, marginBottom: 20 },
});
