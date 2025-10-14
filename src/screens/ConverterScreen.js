import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Picker,
  ActivityIndicator,
} from "react-native";

export default function ConverterScreen() {
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("PHP");
  const [toCurrency, setToCurrency] = useState("USD");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const currencies = ["PHP", "USD", "EUR", "JPY", "GBP"];

  const convertCurrency = async () => {
    if (!amount) return alert("Enter an amount first!");
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.exchangerate.host/convert?from=${fromCurrency}&to=${toCurrency}&amount=${amount}`
      );
      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      alert("Failed to fetch conversion rate.");
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

      <View style={styles.row}>
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>From:</Text>
          <Picker
            selectedValue={fromCurrency}
            onValueChange={(val) => setFromCurrency(val)}
            style={styles.picker}
          >
            {currencies.map((cur) => (
              <Picker.Item key={cur} label={cur} value={cur} />
            ))}
          </Picker>
        </View>

        <View style={styles.pickerContainer}>
          <Text style={styles.label}>To:</Text>
          <Picker
            selectedValue={toCurrency}
            onValueChange={(val) => setToCurrency(val)}
            style={styles.picker}
          >
            {currencies.map((cur) => (
              <Picker.Item key={cur} label={cur} value={cur} />
            ))}
          </Picker>
        </View>
      </View>

      <Button title="Convert" onPress={convertCurrency} />

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#007AFF"
          style={{ marginTop: 20 }}
        />
      ) : result !== null ? (
        <Text style={styles.result}>
          {amount} {fromCurrency} = {result.toFixed(2)} {toCurrency}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 24, textAlign: "center", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  pickerContainer: { flex: 1, marginHorizontal: 5 },
  picker: { height: 50 },
  label: { textAlign: "center", marginBottom: 5 },
  result: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
  },
});
