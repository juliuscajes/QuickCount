import React, { useState, useMemo } from "react";
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
  const [budget, setBudget] = useState(""); // 🆕 user-entered budget
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

  // 🧮 Calculate totals automatically when expenses change
  const totalSpent = useMemo(
    () => expenses.reduce((sum, item) => sum + item.amount, 0),
    [expenses]
  );

  const remaining = budget ? Math.max(budget - totalSpent, 0) : null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expense Tracker 💰</Text>

      {/* 🆕 Budget Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter total budget (₱)"
        keyboardType="numeric"
        value={budget}
        onChangeText={setBudget}
      />

      {/* 🧾 Display totals */}
      {budget ? (
        <View style={styles.summaryBox}>
          <Text style={styles.total}>💵 Total Spent: ₱{totalSpent}</Text>
          <Text style={styles.remaining}>
            💸 Remaining Balance: ₱{remaining}
          </Text>
        </View>
      ) : (
        <Text style={styles.note}>
          Set a budget to track remaining balance.
        </Text>
      )}

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
        onPress={() => navigation.navigate("Graph", { expenses })}
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
  summaryBox: {
    backgroundColor: "#eef6ff",
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
  },
  total: { fontSize: 18, color: "#007AFF", fontWeight: "bold" },
  remaining: { fontSize: 18, color: "#28a745", fontWeight: "bold" },
  note: {
    color: "gray",
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 8,
  },
  expenseItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 8,
  },
});
