import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function FuelScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fuel Management</Text>
      <Text style={styles.description}>This screen will contain fuel monitoring features.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
  }
});