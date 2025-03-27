import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions,
  ActivityIndicator 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LineChart, PieChart } from 'react-native-chart-kit';
import Card from '../components/Card';
import Button from '../components/Button';
import { useVehicle } from '../../lib/hooks/useVehicle';

const { width: screenWidth } = Dimensions.get('window');

const qualityData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      data: [98.2, 98.5, 99.1, 98.7, 99.4, 99.5],
      color: (opacity = 1) => `rgba(255, 204, 0, ${opacity})`,
      strokeWidth: 2
    },
    {
      data: [96, 96, 96, 96, 96, 96],
      color: (opacity = 1) => `rgba(153, 153, 153, ${opacity})`,
      strokeWidth: 2,
      strokeDashArray: [5, 5]
    }
  ],
  legend: ['Fuel Purity', 'Industry Standard']
};

const detectionData = [
  {
    name: 'Clean Fuel',
    percentage: 92,
    color: '#4CAF50'
  },
  {
    name: 'Minor Issues',
    percentage: 6,
    color: '#FFC107'
  },
  {
    name: 'Blocked',
    percentage: 2,
    color: '#FF5722'
  }
];

export default function SmartFuelScreen() {
  const { vehicle } = useVehicle();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const startAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 2000);
  };

  const renderDetectionStats = () => (
    <View style={styles.detectionStats}>
      {detectionData.map((item, index) => (
        <View key={index} style={styles.statItem}>
          <View style={styles.statHeader}>
            <View style={[styles.statusDot, { backgroundColor: item.color }]} />
            <Text style={styles.statLabel}>{item.name}</Text>
          </View>
          <Text style={styles.statValue}>{item.percentage}%</Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${item.percentage}%`,
                  backgroundColor: item.color 
                }
              ]} 
            />
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SmartFuel Hub</Text>
        <Text style={styles.headerSubtitle}>Advanced Fuel Quality Monitoring</Text>
      </View>

      <View style={styles.content}>
        <Card style={styles.currentStatusCard}>
          <View style={styles.statusHeader}>
            <MaterialCommunityIcons 
              name="shield-check" 
              size={24} 
              color="#4CAF50" 
            />
            <Text style={styles.statusTitle}>Current Fuel Status</Text>
          </View>
          
          <View style={styles.statusDetails}>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Quality Rating</Text>
              <Text style={styles.statusValue}>98.5%</Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Last Checked</Text>
              <Text style={styles.statusValue}>2h ago</Text>
            </View>
          </View>

          <Button
            title={isAnalyzing ? "Analyzing..." : "Start New Analysis"}
            onPress={startAnalysis}
            variant="default"
            disabled={isAnalyzing}
            icon={isAnalyzing ? undefined : "analytics"}
          >
            {isAnalyzing && <ActivityIndicator color="#FFFFFF" style={styles.loader} />}
          </Button>
        </Card>

        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>Fuel Quality Trends</Text>
          <Text style={styles.chartSubtitle}>Last 6 months analysis</Text>
          <LineChart
            data={qualityData}
            width={screenWidth - 48}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
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

        <Card style={styles.detectionCard}>
          <Text style={styles.chartTitle}>Detection Statistics</Text>
          <Text style={styles.chartSubtitle}>Last 30 days breakdown</Text>
          {renderDetectionStats()}
        </Card>

        <Card style={styles.featuresCard}>
          <Text style={styles.featuresTitle}>Smart Features</Text>
          
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <MaterialCommunityIcons name="shield-check" size={24} color="#FFCC00" />
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Real-time Monitoring</Text>
                <Text style={styles.featureDescription}>
                  Continuous analysis of fuel quality during refueling
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <MaterialCommunityIcons name="alert-circle" size={24} color="#FFCC00" />
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Fraud Prevention</Text>
                <Text style={styles.featureDescription}>
                  Advanced detection of fuel tampering attempts
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <MaterialCommunityIcons name="chart-line" size={24} color="#FFCC00" />
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Performance Analytics</Text>
                <Text style={styles.featureDescription}>
                  Detailed insights into fuel quality impact on performance
                </Text>
              </View>
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
  content: {
    padding: 16,
  },
  currentStatusCard: {
    padding: 16,
    marginBottom: 16,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  statusDetails: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  statusItem: {
    flex: 1,
  },
  statusLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222222',
  },
  chartCard: {
    padding: 16,
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222222',
  },
  chartSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  detectionCard: {
    padding: 16,
    marginBottom: 16,
  },
  detectionStats: {
    marginTop: 16,
  },
  statItem: {
    marginBottom: 16,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#666666',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 4,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#EEEEEE',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  featuresCard: {
    padding: 16,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 16,
  },
  featuresList: {
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  featureContent: {
    marginLeft: 12,
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222222',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  loader: {
    marginLeft: 8,
  },
});