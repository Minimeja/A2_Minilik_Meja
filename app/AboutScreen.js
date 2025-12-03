import { StyleSheet, Text, View } from 'react-native';

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>About This App</Text>
      <Text style={styles.text}>Name: Minilik Meja</Text>
      <Text style={styles.text}>Student ID: 100516804</Text>

      <Text style={[styles.text, { marginTop: 20 }]}>
        This app converts currencies using a live API. It demonstrates input
        validation, API requests, navigation, and UI rendering in React Native.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 15 },
  text: { fontSize: 16, lineHeight: 22 },
});
