import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function MainScreen() {
  const [base, setBase] = useState("INR");
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
    // Ask FreecurrencyAPI only for the two currencies we care about
    const url =
      `https://api.freecurrencyapi.com/v1/latest` +
      `?apikey=fca_live_vKzIU8OlPVHJ03oSFLk68iSyPfb3XkpFmCInnWtu` +
      `&currencies=${baseCode},${destCode}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();
    // FreecurrencyAPI shape: { data: { "USD": 1, "INR": 83.2, ... } }
    const rates = data.data;

    const fromRate = rates[baseCode];
    const toRate = rates[destCode];

    if (!fromRate || !toRate) {
      throw new Error("Rate not found for one of the currencies");
    }

    // Convert: first get rate for 1 baseCode in destCode,
    // then multiply by the amount the user entered
    const unitRate = toRate / fromRate;      // 1 baseCode -> ? destCode
    const convertedAmount = amt * unitRate;  // amt baseCode -> ? destCode

    const formattedRate = unitRate.toFixed(4);
    const formattedConverted = convertedAmount.toFixed(2);

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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>CURRENCY CONVERTER</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />

      <View style={styles.row}>
        <Text style={styles.label}>From</Text>
        <TextInput
          style={styles.currencyInput}
          value={base}
          onChangeText={setBase}
          autoCapitalize="characters"
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>To</Text>
        <TextInput
          style={styles.currencyInput}
          value={dest}
          onChangeText={setDest}
          autoCapitalize="characters"
        />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleConvert}>
          <Text style={styles.buttonText}>GET EXCHANGE RATE</Text>
        </TouchableOpacity>
      )}

      {result && (
        <View style={styles.resultBox}>
          <Text style={styles.result}>
            {amount} {base} = {result.converted} {dest}
          </Text>
          <Text style={styles.rateText}>
            Conversion Rate: {result.rate ? result.rate : "N/A"}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#3e3e3e",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 0.4,
  },
  currencyInput: {
    flex: 0.55,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    fontSize: 16,
    borderRadius: 8,
  },
  button: {
    backgroundColor: "#5cb85c",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  resultBox: {
    marginTop: 30,
    padding: 16,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
  },
  result: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  rateText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
});
