import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function CollaborationScreen() {
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [addedBy, setAddedBy] = useState("");

  const handleAddTransaction = () => {
    if (!description || !amount || !addedBy) {
      Alert.alert("Please fill in all fields");
      return;
    }

    const newTransaction = {
      id: Math.random().toString(),
      description,
      amount: parseFloat(amount),
      addedBy,
      date: new Date().toLocaleDateString(),
    };

    setTransactions([newTransaction, ...transactions]);
    setDescription("");
    setAmount("");
    setAddedBy("");
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View>
        <Text style={styles.itemDescription}>{item.description}</Text>
        <Text style={styles.itemBy}>Added by: {item.addedBy}</Text>
        <Text style={styles.itemDate}>{item.date}</Text>
      </View>
      <Text
        style={[
          styles.itemAmount,
          { color: item.amount > 0 ? "#4CD964" : "#FF4D4D" },
        ]}
      >
        {item.amount > 0 ? "+" : "-"}₱{Math.abs(item.amount)}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👥 Collaboration</Text>
      <Text style={styles.subtitle}>Work together on shared transactions</Text>

      {/* Inputs */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter description"
          placeholderTextColor="#aaa"
          value={description}
          onChangeText={setDescription}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter amount"
          placeholderTextColor="#aaa"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          placeholderTextColor="#aaa"
          value={addedBy}
          onChangeText={setAddedBy}
        />
      </View>

      <TouchableOpacity style={styles.addBtn} onPress={handleAddTransaction}>
        <Ionicons name="add" size={24} color="white" />
        <Text style={styles.addText}>Add Transaction</Text>
      </TouchableOpacity>

      {/* List of Transactions */}
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ marginTop: 15 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8ff",
    padding: 20,
  },
  title: {
    color: "black",
    fontSize: 22,
    fontWeight: "bold",
  },
  subtitle: {
    color: "gray",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#ffffffff",
    color: "black",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  addBtn: {
    flexDirection: "row",
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 10,
  },
  addText: {
    color: "white",
    fontSize: 16,
    marginLeft: 5,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#2C2C2E",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  itemDescription: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  itemBy: {
    color: "gray",
    fontSize: 12,
  },
  itemDate: {
    color: "#aaa",
    fontSize: 11,
  },
  itemAmount: {
    fontWeight: "bold",
    fontSize: 16,
  },
});