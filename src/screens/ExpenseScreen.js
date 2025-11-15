import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { getDatabase, ref, set, onValue, off } from "firebase/database";
import { getAuth } from "firebase/auth";
import CategoryPicker from "../Components/CategoryPicker";

export default function ExpenseScreen({ navigation }) {
  const [budget, setBudget] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [expenses, setExpenses] = useState([]);

  const auth = getAuth();
  const db = getDatabase();
  const userId = auth.currentUser?.uid;

  // Load data from Firebase on component mount
  useEffect(() => {
    if (!userId) {
      console.log("No user ID found");
      return;
    }

    console.log("Loading data for user:", userId);
    const userRef = ref(db, `users/${userId}`);

    // Listen for user data changes
    onValue(userRef, (snapshot) => {
      const userData = snapshot.val();
      console.log("Loaded user data:", userData);

      if (userData) {
        setBudget(userData.budget?.toString() || "");
        setExpenses(userData.expenses || []);
      }
    });

    return () => {
      off(userRef);
    };
  }, [userId]);

  const updateBudget = async () => {
    if (!userId) {
      Alert.alert("Error", "User not authenticated");
      return;
    }

    if (!budget) {
      Alert.alert("Error", "Please enter a budget amount");
      return;
    }

    try {
      const budgetValue = parseFloat(budget);
      if (isNaN(budgetValue)) {
        Alert.alert("Error", "Please enter a valid budget amount");
        return;
      }

      // Update budget in Firebase
      await set(ref(db, `users/${userId}/budget`), budgetValue);
      console.log("Budget updated successfully:", budgetValue);

      Alert.alert("Success", "Budget updated successfully!");
    } catch (error) {
      console.error("Error updating budget:", error);
      Alert.alert("Error", "Failed to update budget: " + error.message);
    }
  };

  const addExpense = async () => {
    if (!amount || !description || !category) {
      Alert.alert("Error", "Please fill all fields!");
      return;
    }

    if (!userId) {
      Alert.alert("Error", "User not authenticated");
      return;
    }

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue)) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    const newExpense = {
      id: Date.now().toString(),
      amount: amountValue,
      description,
      category,
      date: new Date().toISOString(),
    };

    const updatedExpenses = [...expenses, newExpense];
    const totalSpent = updatedExpenses.reduce(
      (sum, item) => sum + item.amount,
      0
    );

    try {
      // Get current user data first to preserve existing fields
      const userRef = ref(db, `users/${userId}`);

      // Save updated data to Firebase
      await set(userRef, {
        budget: budget ? parseFloat(budget) : 0,
        expenses: updatedExpenses,
        totalSpent: totalSpent,
        email: auth.currentUser?.email,
        name: auth.currentUser?.displayName || "User",
        createdAt: new Date().toISOString(),
        id: userId,
      });

      setExpenses(updatedExpenses);
      setAmount("");
      setDescription("");
      setCategory("");

      console.log("Expense added successfully:", newExpense);
      Alert.alert("Success", "Expense added successfully!");
    } catch (error) {
      console.error("Error adding expense:", error);
      Alert.alert("Error", "Failed to save expense: " + error.message);
    }
  };

  const deleteExpense = async (id) => {
    if (!userId) return;

    const updatedExpenses = expenses.filter((item) => item.id !== id);
    const totalSpent = updatedExpenses.reduce(
      (sum, item) => sum + item.amount,
      0
    );

    try {
      // Get current user data first to preserve existing fields
      const userRef = ref(db, `users/${userId}`);

      // Save updated data to Firebase
      await set(userRef, {
        budget: budget ? parseFloat(budget) : 0,
        expenses: updatedExpenses,
        totalSpent: totalSpent,
        email: auth.currentUser?.email,
        name: auth.currentUser?.displayName || "User",
        createdAt: new Date().toISOString(),
        id: userId,
      });

      setExpenses(updatedExpenses);
      console.log("Expense deleted successfully");
    } catch (error) {
      console.error("Error deleting expense:", error);
      Alert.alert("Error", "Failed to delete expense: " + error.message);
    }
  };

  const totalSpent = useMemo(
    () => expenses.reduce((sum, item) => sum + item.amount, 0),
    [expenses]
  );

  const remaining = budget
    ? Math.max(parseFloat(budget) - totalSpent, 0)
    : null;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Expense Tracker</Text>

        <View style={styles.budgetContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter total budget (₱)"
            placeholderTextColor="#A0AEC0"
            keyboardType="numeric"
            value={budget}
            onChangeText={setBudget}
            onBlur={updateBudget}
          />
          <TouchableOpacity
            style={styles.saveBudgetButton}
            onPress={updateBudget}
          >
            <Text style={styles.saveBudgetText}>Save Budget</Text>
          </TouchableOpacity>
        </View>

        {budget ? (
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Spent</Text>
              <Text style={styles.summaryValue}>₱{totalSpent.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Remaining Budget</Text>
              <Text
                style={[
                  styles.summaryValueRemaining,
                  remaining < parseFloat(budget) * 0.2 && { color: "#FF6B6B" },
                ]}
              >
                ₱{remaining?.toFixed(2) || "0.00"}
              </Text>
            </View>
          </View>
        ) : (
          <Text style={styles.note}>
            Set a budget to start tracking expenses
          </Text>
        )}

        <Text style={styles.sectionTitle}>Add New Expense</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter amount (₱)"
          placeholderTextColor="#A0AEC0"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          placeholderTextColor="#A0AEC0"
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

        {expenses.length > 0 && (
          <Text style={styles.expensesTitle}>Your Expenses</Text>
        )}

        <FlatList
          data={expenses}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.expensesList}
          renderItem={({ item }) => (
            <View style={styles.expenseCard}>
              <View style={styles.expenseInfo}>
                <Text style={styles.expenseAmount}>
                  ₱{item.amount.toFixed(2)}
                </Text>
                <Text style={styles.expenseDesc}>{item.description}</Text>
                <Text style={styles.expenseCategory}>{item.category}</Text>
                <Text style={styles.expenseDate}>
                  {new Date(item.date).toLocaleDateString()}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteExpense(item.id)}
              >
                <Text style={styles.deleteText}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
        />

        {expenses.length > 0 && (
          <TouchableOpacity
            style={styles.graphButton}
            onPress={() => navigation.navigate("Graph", { expenses })}
          >
            <Text style={styles.graphButtonText}>View Analytics</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E2A3A",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 16,
    marginTop: 8,
  },
  budgetContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 52,
    backgroundColor: "#2A3A4A",
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#3A4A5A",
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  saveBudgetButton: {
    marginLeft: 12,
    backgroundColor: "#4ECDC4",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  saveBudgetText: {
    color: "#1E2A3A",
    fontSize: 14,
    fontWeight: "700",
  },
  summaryBox: {
    backgroundColor: "#2A3A4A",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#3A4A5A",
    shadowColor: "#000000",
    shadowOpacity: 0.3,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: "#B8C5D6",
    fontWeight: "500",
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#4ECDC4",
  },
  summaryValueRemaining: {
    fontSize: 20,
    fontWeight: "700",
    color: "#4ECDC4",
  },
  note: {
    textAlign: "center",
    color: "#8A9BB0",
    marginBottom: 20,
    fontSize: 15,
    fontStyle: "italic",
  },
  addButton: {
    backgroundColor: "#4ECDC4",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#4ECDC4",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  addButtonText: {
    color: "#1E2A3A",
    fontSize: 16,
    fontWeight: "700",
  },
  expensesTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 16,
    textAlign: "center",
  },
  expensesList: {
    paddingBottom: 20,
  },
  expenseCard: {
    backgroundColor: "#2A3A4A",
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#3A4A5A",
    shadowColor: "#000000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  expenseDesc: {
    fontSize: 15,
    color: "#E8EDF5",
    marginTop: 4,
  },
  expenseCategory: {
    fontSize: 13,
    color: "#B8C5D6",
    marginTop: 2,
    fontStyle: "italic",
  },
  expenseDate: {
    fontSize: 12,
    color: "#8A9BB0",
    marginTop: 2,
  },
  deleteButton: {
    marginLeft: 12,
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#3A4A5A",
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#4A5A6A",
  },
  deleteText: {
    color: "#FF6B6B",
    fontWeight: "700",
    fontSize: 16,
  },
  graphButton: {
    backgroundColor: "#3A4A5A",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#4A5A6A",
  },
  graphButtonText: {
    color: "#4ECDC4",
    fontSize: 16,
    fontWeight: "600",
  },
});
