import React, { useState } from "react";
import {
  ActivityIndicator,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function MainScreen() {
  const [base, setBase] = useState("CAD");
  const [dest, setDest] = useState("USD");
  const [amount, setAmount] = useState("1");

  const [result, setResult] = useState(null);
  const [rate, setRate] = useState(null);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

const handleConvert = async () => {
  const baseCode = base.trim().toUpperCase();
  const destCode = dest.trim().toUpperCase();
  const amt = parseFloat(amount);

  if (baseCode.length !== 3 || destCode.length !== 3) {
    setError("Currency codes must be 3-letter codes like CAD, USD.");
    setResult(null);
    return;
  }

  if (isNaN(amt) || amt <= 0) {
    setError("Amount must be a positive number.");
    setResult(null);
    return;
  }

  setLoading(true);
  setError(null);
  setResult(null);

  try {
    const url = `https://api.frankfurter.app/latest?amount=${amt}&from=${baseCode}&to=${destCode}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data || !data.rates || !data.rates[destCode]) {
      throw new Error("Rate not found");
    }

    const rawRate = data.rates[destCode] / amt; // rate per 1 unit
    const rawConverted = data.rates[destCode];

    // Validate that rawRate and rawConverted are numbers before formatting
    const formattedRate = !isNaN(rawRate) ? Number(rawRate).toFixed(4) : "N/A";
    const formattedConverted = !isNaN(rawConverted) ? Number(rawConverted).toFixed(2) : "N/A";

    setRate(formattedRate);
    setResult({
      rate: formattedRate,
      converted: formattedConverted,
      base: baseCode,
      dest: destCode,
      amount: amt,
    });
  } catch (err) {
    console.log("API error:", err);
    setError("API request failed. Please try again.");
  } finally {
    setLoading(false);
  }
};


  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingBottom: 50 }]}>
      <Text style={styles.title}>Currency Converter</Text>

      <Text style={styles.label}>Base Currency:</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={base}
          onChangeText={setBase}
          autoCapitalize="characters"
          placeholder="Enter Base Currency"
        />
        <Text style={styles.currencySymbol}>CAD</Text>
      </View>

      <Text style={styles.label}>Destination Currency:</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={dest}
          onChangeText={setDest}
          autoCapitalize="characters"
          placeholder="Enter Destination Currency"
        />
        <Text style={styles.currencySymbol}>USD</Text>
      </View>

      <Text style={styles.label}>Amount:</Text>
      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        placeholder="Amount"
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="CONVERT" onPress={handleConvert} />
      )}

{result && (
  <View style={styles.box}>
    <Text style={styles.result}>
      {amount} {base} is equal to {result.converted} {dest}
    </Text>
    <Text style={styles.rateText}>
      Conversion Rate: {result.rate} {/* No need to use .toFixed() again */}
    </Text>
  </View>
)}



    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a0033",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#4a148c",
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 20,
    letterSpacing: 1.5,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  amountInput: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
  },
  currencyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  currencySection: {
    flex: 1,
  },
  currencyLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  pickerContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  pickerText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  flag: {
    fontSize: 20,
    marginLeft: 8,
  },
  swapButton: {
    backgroundColor: "#6a1b9a",
    borderRadius: 25,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 12,
    marginTop: 18,
  },
  swapIcon: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
  },
  conversionText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  button: {
    backgroundColor: "#ffd54f",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4a148c",
    letterSpacing: 1,
  },
});
