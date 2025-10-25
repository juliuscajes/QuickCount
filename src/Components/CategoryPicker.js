import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function CategoryPicker({ selectedCategory, onValueChange }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Category:</Text>
      <Picker
        selectedValue={selectedCategory}
        onValueChange={onValueChange}
        style={styles.picker}
      >
        <Picker.Item label="Select Category" value="" />
        <Picker.Item label="Food" value="Food" />
        <Picker.Item label="Transport" value="Transport" />
        <Picker.Item label="Bills" value="Bills" />
        <Picker.Item label="Shopping" value="Shopping" />
        <Picker.Item label="Others" value="Others" />
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 8 },
  label: { fontSize: 16, marginBottom: 4 },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
  },
});
