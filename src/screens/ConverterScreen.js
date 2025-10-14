import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function ConverterScreen() {
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("PHP");
  const [toCurrency, setToCurrency] = useState("USD");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const currencies = ["PHP", "USD", "EUR", "JPY", "GBP", "AUD", "CAD"];

  const handleConvert = async () => {
    if (!amount) {
      Alert.alert("Missing Amount", "Please enter an amount to convert.");
      return;
    }

    setLoading(true);
    try {
      // ✅ Free & stable API
      const response = await fetch(
        `https://open.er-api.com/v6/latest/${fromCurrency}`
      );
      const data = await response.json();

      if (data && data.result === "success" && data.rates[toCurrency]) {
        const rate = data.rates[toCurrency];
        const converted = rate * parseFloat(amount);
        setResult(converted);
      } else {
        Alert.alert("Conversion Failed", "Could not get conversion data.");
        setResult(null);
      }
    } catch (error) {
      Alert.alert("Error", "Check your internet connection and try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💱 Currency Converter</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <Text style={styles.label}>From:</Text>
      <Picker
        selectedValue={fromCurrency}
        onValueChange={(value) => setFromCurrency(value)}
        style={styles.picker}
      >
        {currencies.map((cur) => (
          <Picker.Item key={cur} label={cur} value={cur} />
        ))}
      </Picker>

      <Text style={styles.label}>To:</Text>
      <Picker
        selectedValue={toCurrency}
        onValueChange={(value) => setToCurrency(value)}
        style={styles.picker}
      >
        {currencies.map((cur) => (
          <Picker.Item key={cur} label={cur} value={cur} />
        ))}
      </Picker>

      <Button title="Convert" onPress={handleConvert} color="#007AFF" />

      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}

      {typeof result === "number" && (
        <Text style={styles.result}>
          {amount} {fromCurrency} = {result.toFixed(2)} {toCurrency}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F7F9FC",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  label: {
    fontWeight: "bold",
    marginTop: 10,
  },
  picker: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
  },
  result: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 18,
    color: "#007AFF",
    fontWeight: "bold",
  },
});
