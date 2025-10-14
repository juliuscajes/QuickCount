import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
} from "react-native";
import CategoryPicker from "../Components/CategoryPicker";

export default function ExpenseScreen({ navigation }) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [expenses, setExpenses] = useState([]);

  const addExpense = () => {
    if (!amount || !description || !category)
      return alert("Please fill all fields!");

    const newExpense = {
      id: Date.now().toString(),
      amount: parseFloat(amount),
      description,
      category,
    };

    setExpenses([...expenses, newExpense]);
    setAmount("");
    setDescription("");
    setCategory("");
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter((item) => item.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expense Tracker 💰</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter amount (₱)"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter description"
        value={description}
        onChangeText={setDescription}
      />

      {/* 🆕 Add Category Picker here */}
      <CategoryPicker
        selectedCategory={category}
        onValueChange={(value) => setCategory(value)}
      />

      <Button title="Add Expense" onPress={addExpense} />

      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.expenseItem}>
            <Text>
              ₱{item.amount} - {item.description} ({item.category})
            </Text>
            <Button title="Delete" onPress={() => deleteExpense(item.id)} />
          </View>
        )}
      />

      <Button
        title="View Graph 📊"
        onPress={() => navigation.navigate("Graph")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, textAlign: "center", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
  },
  expenseItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 8,
  },
});
