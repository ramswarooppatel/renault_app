import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MaintenanceScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Maintenance</Text>
      <Text style={styles.description}>This screen will contain vehicle maintenance information.</Text>
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