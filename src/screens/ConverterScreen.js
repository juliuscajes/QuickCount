import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
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

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>💱 Currency Converter</Text>

        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="Enter amount"
            placeholderTextColor="#A0AEC0"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />

          <View style={styles.currencySection}>
            <View style={styles.currencyRow}>
              <Text style={styles.label}>From:</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={fromCurrency}
                  onValueChange={(value) => setFromCurrency(value)}
                  style={styles.picker}
                  dropdownIconColor="#4ECDC4"
                >
                  {currencies.map((cur) => (
                    <Picker.Item
                      key={cur}
                      label={cur}
                      value={cur}
                      color="#FFFFFF"
                      style={styles.pickerItem}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            <TouchableOpacity
              style={styles.swapButton}
              onPress={swapCurrencies}
            >
              <Text style={styles.swapIcon}>⇅</Text>
            </TouchableOpacity>

            <View style={styles.currencyRow}>
              <Text style={styles.label}>To:</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={toCurrency}
                  onValueChange={(value) => setToCurrency(value)}
                  style={styles.picker}
                  dropdownIconColor="#4ECDC4"
                >
                  {currencies.map((cur) => (
                    <Picker.Item
                      key={cur}
                      label={cur}
                      value={cur}
                      color="#FFFFFF"
                      style={styles.pickerItem}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.convertButton}
            onPress={handleConvert}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#1E2A3A" />
            ) : (
              <Text style={styles.convertButtonText}>Convert Currency</Text>
            )}
          </TouchableOpacity>

          {typeof result === "number" && (
            <View style={styles.resultCard}>
              <Text style={styles.resultText}>
                {parseFloat(amount).toFixed(2)} {fromCurrency}
              </Text>
              <Text style={styles.equals}>=</Text>
              <Text style={styles.resultValue}>
                {result.toFixed(2)} {toCurrency}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>💡 Quick Tip</Text>
          <Text style={styles.infoText}>
            Real-time exchange rates provided by reliable API. Perfect for
            budgeting and international expense tracking.
          </Text>
        </View>
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
  card: {
    backgroundColor: "#2A3A4A",
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#3A4A5A",
    shadowColor: "#000000",
    shadowOpacity: 0.3,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  input: {
    height: 52,
    backgroundColor: "#3A4A5A",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#4A5A6A",
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "500",
    textAlign: "center",
  },
  currencySection: {
    marginBottom: 24,
  },
  currencyRow: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#B8C5D6",
    marginBottom: 8,
  },
  pickerContainer: {
    backgroundColor: "#3A4A5A",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#4A5A6A",
    overflow: "hidden",
  },
  picker: {
    height: 50,
    color: "#FFFFFF",
  },
  pickerItem: {
    fontSize: 16,
    backgroundColor: "#2A3A4A",
  },
  swapButton: {
    alignSelf: "center",
    backgroundColor: "#3A4A5A",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#4A5A6A",
  },
  swapIcon: {
    fontSize: 20,
    color: "#4ECDC4",
    fontWeight: "bold",
  },
  convertButton: {
    backgroundColor: "#4ECDC4",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#4ECDC4",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  convertButtonText: {
    color: "#1E2A3A",
    fontSize: 16,
    fontWeight: "700",
  },
  resultCard: {
    backgroundColor: "#3A4A5A",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#4ECDC4",
  },
  resultText: {
    fontSize: 18,
    color: "#E8EDF5",
    fontWeight: "500",
    marginBottom: 8,
    textAlign: "center",
  },
  equals: {
    fontSize: 20,
    color: "#4ECDC4",
    fontWeight: "bold",
    marginBottom: 8,
  },
  resultValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#4ECDC4",
    textAlign: "center",
  },
  infoCard: {
    backgroundColor: "#2A3A4A",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#3A4A5A",
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
    textAlign: "center",
  },
  infoText: {
    fontSize: 14,
    color: "#B8C5D6",
    textAlign: "center",
    lineHeight: 20,
  },
});
