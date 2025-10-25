import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function ButtonPrimary({ title, onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 10,
    marginVertical: 8,
  },
  text: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});
