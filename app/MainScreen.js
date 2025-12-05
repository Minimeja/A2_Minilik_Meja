// app/MainScreen.js
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
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

    // validation
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
      // FreecurrencyAPI: base_currency tells what all rates are based on
      const url = `https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_vKzIU8OlPVHJ03oSFLk68iSyPfb3XkpFmCInnWtu&base_currency=${baseCode}`;

      const response = await fetch(url);
      const data = await response.json();

      // Response shape: { data: { USD: 0.72, EUR: ... } }
      if (!data || !data.data || !data.data[destCode]) {
        throw new Error("Rate not found");
      }

      const rateValue = Number(data.data[destCode]); // rate per 1 base unit
      const convertedValue = rateValue * amt;

      const formattedRate = rateValue.toFixed(4);
      const formattedConverted = convertedValue.toFixed(2);

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
      <View style={styles.card}>
        <Text style={styles.title}>CURRENCY CONVERTER</Text>
        <View style={styles.titleUnderline} />

        {/* ENTER AMOUNT */}
        <TextInput
          style={styles.input}
          placeholder="ENTER AMOUNT"
          placeholderTextColor="#ddd"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />

        {/* FROM */}
        <View style={styles.row}>
          <Text style={styles.label}>FROM</Text>
          <TextInput
            style={styles.currencyInput}
            value={base}
            onChangeText={setBase}
            autoCapitalize="characters"
          />
        </View>

        {/* TO */}
        <View style={styles.row}>
          <Text style={styles.label}>TO</Text>
          <TextInput
            style={styles.currencyInput}
            value={dest}
            onChangeText={setDest}
            autoCapitalize="characters"
          />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {loading ? (
          <ActivityIndicator size="large" color="#F5D977" />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleConvert}>
            <Text style={styles.buttonText}>GET EXCHANGE RATE</Text>
          </TouchableOpacity>
        )}

        {result && (
          <View style={styles.resultBox}>
            <Text style={styles.result}>
              {result.amount} {result.base} = {result.converted} {result.dest}
            </Text>
            <Text style={styles.rateText}>
              Conversion Rate: {result.rate ? result.rate : "N/A"}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // whole screen background
  container: {
    flexGrow: 1,
    paddingVertical: 40,
    paddingHorizontal: 16,
    backgroundColor: "#f2f2f2",
    alignItems: "center",
    justifyContent: "center",
  },

  // purple card
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#3F0073", // deep purple
    borderRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },

  title: {
    fontSize: 26,
    fontWeight: "900",
    textAlign: "center",
    color: "#FFFFFF",
    letterSpacing: 1,
  },

  titleUnderline: {
    marginTop: 6,
    alignSelf: "center",
    width: "65%",
    height: 2,
    backgroundColor: "#FFFFFF",
    marginBottom: 24,
  },

  input: {
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    marginBottom: 22,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  label: {
    flex: 0.35,
    fontSize: 14,
    fontWeight: "700",
    color: "#F5E8FF",
  },

  currencyInput: {
    flex: 0.65,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
  },

  button: {
    marginTop: 20,
    backgroundColor: "#F5D977", // light gold
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },

  buttonText: {
    color: "#3F0073",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 0.5,
  },

  resultBox: {
    marginTop: 26,
    paddingVertical: 16,
    paddingHorizontal: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F5D977",
    backgroundColor: "rgba(0,0,0,0.05)",
  },

  result: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 6,
  },

  rateText: {
    fontSize: 14,
    color: "#F5E8FF",
    textAlign: "center",
  },

  error: {
    marginTop: 6,
    color: "#FFB3B3",
    textAlign: "center",
    fontSize: 13,
  },
});
