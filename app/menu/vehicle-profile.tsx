import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image,
  TouchableOpacity,
  Dimensions 
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useVehicle } from '../../lib/hooks/useVehicle';
import Card from '../components/Card';

const { width } = Dimensions.get('window');

export default function VehicleProfileScreen() {
  const { vehicle } = useVehicle();

  const vehicleDetails = [
    { label: 'Model', value: vehicle.model },
    { label: 'Year', value: vehicle.year },
    { label: 'VIN', value: vehicle.vin },
    { label: 'Odometer', value: `${vehicle.odometerReading} km` },
  ];

  const specifications = [
    { label: 'Engine', value: '1.3L TCe / 1.6L E-Tech Hybrid' },
    { label: 'Power', value: '140-160 PS' },
    { label: 'Transmission', value: '7-speed EDC Auto' },
    { label: 'Fuel Type', value: 'Petrol / E-Tech Hybrid' },
    { label: 'Fuel Tank', value: '48L' },
    { label: 'Boot Space', value: '422-536L' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{vehicle.nickname}</Text>
        <Text style={styles.headerSubtitle}>{vehicle.model} {vehicle.year}</Text>
      </View>

      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: 'https://mediacloud.carbuyer.co.uk/image/private/s--ZeVtZgvg--/f_auto,t_primary-image-desktop@1/v1728388016/carbuyer/2024/10/Renault%20Captur%20UK%20drive%20Carbuyer-9.jpg' }} 
          style={styles.vehicleImage}
          resizeMode="cover"
        />
      </View>

      <View style={styles.content}>
        <Card style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Vehicle Details</Text>
          {vehicleDetails.map((detail, index) => (
            <View key={index} style={styles.detailRow}>
              <Text style={styles.detailLabel}>{detail.label}</Text>
              <Text style={styles.detailValue}>{detail.value}</Text>
            </View>
          ))}
        </Card>

        <Card style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Specifications</Text>
          {specifications.map((spec, index) => (
            <View key={index} style={styles.detailRow}>
              <Text style={styles.detailLabel}>{spec.label}</Text>
              <Text style={styles.detailValue}>{spec.value}</Text>
            </View>
          ))}
        </Card>

        <Card style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Vehicle Status</Text>
          <View style={styles.statusGrid}>
            <View style={styles.statusItem}>
              <MaterialCommunityIcons 
                name="engine" 
                size={24} 
                color={vehicle.isRunning ? "#4CAF50" : "#757575"} 
              />
              <Text style={styles.statusLabel}>Engine</Text>
              <Text style={styles.statusValue}>{vehicle.isRunning ? "Running" : "Off"}</Text>
            </View>
            <View style={styles.statusItem}>
              <MaterialCommunityIcons 
                name="gas-station" 
                size={24} 
                color="#FFCC00" 
              />
              <Text style={styles.statusLabel}>Fuel Level</Text>
              <Text style={styles.statusValue}>{vehicle.fuelLevel}%</Text>
            </View>
            <View style={styles.statusItem}>
              <MaterialCommunityIcons 
                name="battery" 
                size={24} 
                color={vehicle.batteryLevel > 20 ? "#4CAF50" : "#FF5722"} 
              />
              <Text style={styles.statusLabel}>Battery</Text>
              <Text style={styles.statusValue}>{vehicle.batteryLevel}%</Text>
            </View>
            <View style={styles.statusItem}>
              <MaterialCommunityIcons 
                name="lock" 
                size={24} 
                color={vehicle.isLocked ? "#4CAF50" : "#FF5722"} 
              />
              <Text style={styles.statusLabel}>Security</Text>
              <Text style={styles.statusValue}>{vehicle.isLocked ? "Locked" : "Unlocked"}</Text>
            </View>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#222222',
    padding: 20,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#CCCCCC',
    marginTop: 4,
  },
  imageContainer: {
    width: width,
    height: 200,
    backgroundColor: '#000000',
  },
  vehicleImage: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: 16,
  },
  detailsCard: {
    marginBottom: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666666',
  },
  detailValue: {
    fontSize: 14,
    color: '#222222',
    fontWeight: '500',
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statusItem: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusLabel: {
    fontSize: 12,
    color: '#666666',
    marginTop: 8,
  },
  statusValue: {
    fontSize: 14,
    color: '#222222',
    fontWeight: '600',
    marginTop: 4,
  },
});