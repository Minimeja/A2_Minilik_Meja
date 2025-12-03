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

    // Validation
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
      // ✅ Frankfurter API: no key needed
      // Example: https://api.frankfurter.app/latest?from=CAD&to=USD
      const url = `https://api.frankfurter.app/latest?from=${baseCode}&to=${destCode}`;

      const response = await fetch(url);
      const data = await response.json();

      if (!data || !data.rates || !data.rates[destCode]) {
        throw new Error("Rate not found");
      }

      const rateValue = data.rates[destCode];
      const convertedValue = (amt * rateValue).toFixed(2);

      setRate(rateValue);
      setResult(convertedValue);

    } catch (err) {
      console.log("API error:", err);
    setError("Unable to fetch exchange rate. Check internet connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingBottom: 50 }]}
>
      <Text style={styles.title}>Currency Converter</Text>

      <Text style={styles.label}>Base Currency:</Text>
      <TextInput
        style={styles.input}
        value={base}
        onChangeText={setBase}
        autoCapitalize="characters"
        placeholder="CAD"
      />

      <Text style={styles.label}>Destination Currency:</Text>
      <TextInput
        style={styles.input}
        value={dest}
        onChangeText={setDest}
        autoCapitalize="characters"
        laceholder="USD"
      />

      <Text style={styles.label}>Amount:</Text>
      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        placeholder="1"
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {loading ? (
        <ActivityIndicator size="large" color="blue" style={{ marginVertical: 16 }} />
      ) : (
        <Button title="CONVERT" onPress={handleConvert} />
      )}

      {result && (
        <View style={styles.box}>
          <Text style={styles.result}>
            {amount} {base} = {result} {dest}
          </Text>
          <Text style={styles.rateText}>Rate Used: {rate}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f8f8f8",
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 12,
  },
  label: {
    marginTop: 10,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#999",
    padding: 10,
    borderRadius: 6,
    marginTop: 4,
  },
  error: {
    color: "red",
    marginTop: 10,
  },
  box: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  result: {
    fontSize: 20,
    fontWeight: "bold",
  },
  rateText: {
    marginTop: 6,
    fontSize: 16,
    color: "#333",
  },
});
