import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import CategoryPicker from "../Components/CategoryPicker";

export default function ExpenseScreen({ navigation }) {
  const [budget, setBudget] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [expenses, setExpenses] = useState([]);

  const addExpense = () => {
    if (!amount || !description || !category) {
      return alert("Please fill all fields!");
    }

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

  const totalSpent = useMemo(
    () => expenses.reduce((sum, item) => sum + item.amount, 0),
    [expenses]
  );

  const remaining = budget ? Math.max(budget - totalSpent, 0) : null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expense Tracker</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter total budget (₱)"
        keyboardType="numeric"
        value={budget}
        onChangeText={setBudget}
      />

      {budget ? (
        <View style={styles.summaryBox}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Spent</Text>
            <Text style={styles.summaryValue}>₱{totalSpent.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Remaining</Text>
            <Text style={styles.summaryValueRemaining}>
              ₱{remaining.toFixed(2)}
            </Text>
          </View>
        </View>
      ) : (
        <Text style={styles.note}>Set a budget to track expenses.</Text>
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
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />

      <CategoryPicker
        selectedCategory={category}
        onValueChange={(value) => setCategory(value)}
      />

      <TouchableOpacity style={styles.addButton} onPress={addExpense}>
        <Text style={styles.addButtonText}>Add Expense</Text>
      </TouchableOpacity>

      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={styles.expenseCard}>
            <View style={styles.expenseInfo}>
              <Text style={styles.expenseAmount}>
                ₱{item.amount.toFixed(2)}
              </Text>
              <Text style={styles.expenseDesc}>{item.description}</Text>
              <Text style={styles.expenseCategory}>{item.category}</Text>
            </View>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteExpense(item.id)}
            >
              <Text style={styles.deleteText}>X</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.graphButton}
        onPress={() => navigation.navigate("Graph", { expenses })}
      >
        <Text style={styles.graphButtonText}>View Graph</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 24,
    color: "#333",
  },
  input: {
    height: 48,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
    color: "#333",
  },
  summaryBox: {
    backgroundColor: "#e8f4ff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: "#555",
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#007BFF",
  },
  summaryValueRemaining: {
    fontSize: 18,
    fontWeight: "600",
    color: "#28a745",
  },
  note: {
    textAlign: "center",
    color: "#888",
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  expenseCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginVertical: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // elevation for Android
    elevation: 2,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  expenseDesc: {
    fontSize: 15,
    color: "#666",
    marginTop: 4,
  },
  expenseCategory: {
    fontSize: 13,
    color: "#888",
    marginTop: 2,
    fontStyle: "italic",
  },
  deleteButton: {
    marginLeft: 16,
    padding: 6,
    borderRadius: 4,
    backgroundColor: "#ffdddd",
  },
  deleteText: {
    color: "#cc0000",
    fontWeight: "700",
    fontSize: 16,
  },
  graphButton: {
    backgroundColor: "#28a745",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  graphButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
