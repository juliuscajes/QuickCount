import React from "react";
import { TextInput, StyleSheet } from "react-native";

export default function InputField({
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
}) {
  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
  },
});
