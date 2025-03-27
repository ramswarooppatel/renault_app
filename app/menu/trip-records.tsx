import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Dimensions 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LineChart, BarChart } from 'react-native-chart-kit';
import Card from '../components/Card';

const { width: screenWidth } = Dimensions.get('window');

interface Trip {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  distance: number;
  duration: number;
  fuelConsumed: number;
  avgSpeed: number;
  startLocation: string;
  endLocation: string;
  fuelEfficiency: number;
  co2Emissions: number;
}

const mockTrips: Trip[] = [
  {
    id: '1',
    date: '2024-03-25',
    startTime: '09:30',
    endTime: '10:15',
    distance: 28.5,
    duration: 45,
    fuelConsumed: 2.4,
    avgSpeed: 38,
    startLocation: 'Home',
    endLocation: 'Office',
    fuelEfficiency: 11.87,
    co2Emissions: 5.52
  },
  {
    id: '2',
    date: '2024-03-24',
    startTime: '18:15',
    endTime: '19:05',
    distance: 32.1,
    duration: 50,
    fuelConsumed: 2.8,
    avgSpeed: 42,
    startLocation: 'Office',
    endLocation: 'Home',
    fuelEfficiency: 11.46,
    co2Emissions: 6.44
  },
  // Add more mock trips as needed
];

const weeklyData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [{
    data: [45.2, 38.7, 42.1, 28.5, 32.1, 15.4, 22.8],
    color: (opacity = 1) => `rgba(255, 204, 0, ${opacity})`,
    strokeWidth: 2
  }]
};

const efficiencyData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [{
    data: [11.2, 10.8, 11.5, 11.9, 11.4, 12.1, 11.8],
    color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
    strokeWidth: 2
  }]
};

export default function TripRecordsScreen() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');

  const calculateTotalStats = () => {
    const total = mockTrips.reduce((acc, trip) => ({
      distance: acc.distance + trip.distance,
      fuelConsumed: acc.fuelConsumed + trip.fuelConsumed,
      duration: acc.duration + trip.duration,
      co2Emissions: acc.co2Emissions + trip.co2Emissions
    }), { distance: 0, fuelConsumed: 0, duration: 0, co2Emissions: 0 });

    return {
      ...total,
      avgEfficiency: total.distance / total.fuelConsumed
    };
  };

  const stats = calculateTotalStats();

  const renderTripCard = (trip: Trip) => (
    <Card key={trip.id} style={styles.tripCard}>
      <View style={styles.tripHeader}>
        <View style={styles.tripDate}>
          <MaterialCommunityIcons name="calendar" size={20} color="#666" />
          <Text style={styles.tripDateText}>{trip.date}</Text>
        </View>
        <Text style={styles.tripDistance}>{trip.distance} km</Text>
      </View>

      <View style={styles.tripRoute}>
        <View style={styles.locationContainer}>
          <MaterialCommunityIcons name="map-marker" size={20} color="#FFCC00" />
          <Text style={styles.locationText}>{trip.startLocation}</Text>
          <Text style={styles.timeText}>{trip.startTime}</Text>
        </View>
        <View style={styles.routeLine} />
        <View style={styles.locationContainer}>
          <MaterialCommunityIcons name="map-marker" size={20} color="#FF4444" />
          <Text style={styles.locationText}>{trip.endLocation}</Text>
          <Text style={styles.timeText}>{trip.endTime}</Text>
        </View>
      </View>

      <View style={styles.tripStats}>
        <View style={styles.statItem}>
          <MaterialCommunityIcons name="clock-outline" size={16} color="#666" />
          <Text style={styles.statText}>{trip.duration} min</Text>
        </View>
        <View style={styles.statItem}>
          <MaterialCommunityIcons name="speedometer" size={16} color="#666" />
          <Text style={styles.statText}>{trip.avgSpeed} km/h</Text>
        </View>
        <View style={styles.statItem}>
          <MaterialCommunityIcons name="gas-station" size={16} color="#666" />
          <Text style={styles.statText}>{trip.fuelEfficiency.toFixed(1)} km/L</Text>
        </View>
        <View style={styles.statItem}>
          <MaterialCommunityIcons name="molecule-co2" size={16} color="#666" />
          <Text style={styles.statText}>{trip.co2Emissions.toFixed(1)} kg</Text>
        </View>
      </View>
    </Card>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Trip Records</Text>
        <Text style={styles.headerSubtitle}>Track your journeys and efficiency</Text>
      </View>

      <View style={styles.summaryCards}>
        <Card style={styles.summaryCard}>
          <MaterialCommunityIcons name="map-marker-distance" size={24} color="#FFCC00" />
          <Text style={styles.summaryValue}>{stats.distance.toFixed(1)} km</Text>
          <Text style={styles.summaryLabel}>Total Distance</Text>
        </Card>
        <Card style={styles.summaryCard}>
          <MaterialCommunityIcons name="gas-station" size={24} color="#4CAF50" />
          <Text style={styles.summaryValue}>{stats.avgEfficiency.toFixed(1)}</Text>
          <Text style={styles.summaryLabel}>Avg. km/L</Text>
        </Card>
        <Card style={styles.summaryCard}>
          <MaterialCommunityIcons name="molecule-co2" size={24} color="#FF5722" />
          <Text style={styles.summaryValue}>{stats.co2Emissions.toFixed(1)}</Text>
          <Text style={styles.summaryLabel}>CO₂ (kg)</Text>
        </Card>
      </View>

      <Card style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>Distance Traveled</Text>
          <View style={styles.timeRangeButtons}>
            {['week', 'month', 'year'].map((range) => (
              <TouchableOpacity
                key={range}
                style={[
                  styles.timeRangeButton,
                  timeRange === range && styles.timeRangeButtonActive
                ]}
                onPress={() => setTimeRange(range as 'week' | 'month' | 'year')}
              >
                <Text style={[
                  styles.timeRangeButtonText,
                  timeRange === range && styles.timeRangeButtonTextActive
                ]}>
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <LineChart
          data={weeklyData}
          width={screenWidth - 48}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(255, 204, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#FFCC00"
            }
          }}
          bezier
          style={styles.chart}
        />
      </Card>

      <View style={styles.tripsSection}>
        <Text style={styles.sectionTitle}>Recent Trips</Text>
        {mockTrips.map(renderTripCard)}
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
    padding: 16,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#CCCCCC',
    marginTop: 4,
  },
  summaryCards: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  summaryCard: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222222',
    marginVertical: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666666',
  },
  chartCard: {
    margin: 16,
    padding: 16,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222222',
  },
  timeRangeButtons: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 2,
  },
  timeRangeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  timeRangeButtonActive: {
    backgroundColor: '#222222',
  },
  timeRangeButtonText: {
    fontSize: 12,
    color: '#666666',
  },
  timeRangeButtonTextActive: {
    color: '#FFCC00',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  tripsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 16,
  },
  tripCard: {
    marginBottom: 16,
    padding: 16,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tripDate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tripDateText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 8,
  },
  tripDistance: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222222',
  },
  tripRoute: {
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#222222',
    marginLeft: 8,
    flex: 1,
  },
  timeText: {
    fontSize: 14,
    color: '#666666',
  },
  routeLine: {
    width: 2,
    height: 20,
    backgroundColor: '#EEEEEE',
    marginLeft: 10,
  },
  tripStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 4,
  },
});