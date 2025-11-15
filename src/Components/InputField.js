import React from "react";
import { TextInput, StyleSheet } from "react-native";

export default function InputField({
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType = "default",
  placeholderTextColor = "#B0B8C4",
  textColor = "#FFFFFF", // White text for dark background
}) {
  return (
    <TextInput
      style={[styles.input, { color: textColor }]}
      placeholder={placeholder}
      placeholderTextColor={placeholderTextColor}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoCapitalize="none"
      autoCorrect={false}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#3A4A5A",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    backgroundColor: "#2A3A4A",
    fontSize: 16,
    fontWeight: "500",
  },
});
