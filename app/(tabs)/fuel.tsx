import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions, 
  Animated, 
  ActivityIndicator
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useVehicle } from '../../lib/hooks/useVehicle';
import { useToast } from '../../lib/context/ToastContext';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import Card from '../components/Card';
import Button from '../components/Button';
import MenuDrawer from '../components/MenuDrawer';

// Sample data for charts
const fuelTransactionsData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
  datasets: [
    {
      data: [400, 300, 500, 280, 590, 490, 600],
    }
  ]
};

const fuelQualityData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
  datasets: [
    {
      data: [98.2, 98.5, 99.1, 98.7, 99.4, 99.5, 99.6],
      color: (opacity = 1) => `rgba(255, 204, 0, ${opacity})`,
      strokeWidth: 2
    },
    {
      data: [96, 96, 96, 96, 96, 96, 96],
      color: (opacity = 1) => `rgba(153, 153, 153, ${opacity})`,
      strokeWidth: 2,
      strokeDashArray: [5, 5]
    }
  ],
  legend: ['Fuel Purity', 'Industry Standard']
};

const anomalyData = [
  {
    name: 'Detected',
    population: 32,
    color: '#FF8042',
    legendFontColor: '#7F7F7F',
    legendFontSize: 12
  },
  {
    name: 'Prevented',
    population: 28,
    color: '#FFBB28',
    legendFontColor: '#7F7F7F',
    legendFontSize: 12
  },
  {
    name: 'False Positive',
    population: 4,
    color: '#00C49F',
    legendFontColor: '#7F7F7F',
    legendFontSize: 12
  }
];

export default function FuelScreen() {
  const { vehicle } = useVehicle();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('transactions');
  const [isLive, setIsLive] = useState(true);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [loading, setLoading] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const screenWidth = Dimensions.get('window').width - 32;
  const animatedValue = useRef(new Animated.Value(0)).current;

  // Progress bar animation
  const progressWidth = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  useEffect(() => {
    // Animate to the current value
    Animated.timing(animatedValue, {
      toValue: 99.2,
      duration: 1000,
      useNativeDriver: false
    }).start();
    
    // Simulate live data updates
    if (isLive) {
      const interval = setInterval(() => {
        setRefreshCounter(prev => prev + 1);
        // Simulate loading state when updating
        setLoading(true);
        setTimeout(() => setLoading(false), 800);
      }, 10000);
      
      return () => clearInterval(interval);
    }
  }, [isLive]);

  const handleRefresh = () => {
    setLoading(true);
    setRefreshCounter(prev => prev + 1);
    setTimeout(() => setLoading(false), 800);
    showToast('Data refreshed');
  };

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(255, 204, 0, ${opacity})`,
    strokeWidth: 2,
    decimalPlaces: 1,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
    }
  };

  const barChartConfig = {
    ...chartConfig,
    barPercentage: 0.7,
  };

  const renderKPICards = () => (
    <View style={styles.kpiContainer}>
      <Card style={styles.kpiCard}>
        <View style={styles.kpiHeader}>
          <Text style={styles.kpiTitle}>Total Transactions</Text>
          <Ionicons name="analytics" size={20} color="#FFCC00" />
        </View>
        <Text style={styles.kpiValue}>3,249</Text>
        <View style={styles.kpiTrend}>
          <Ionicons name="trending-up" size={16} color="#4CAF50" />
          <Text style={styles.kpiTrendText}>+12.5% from last month</Text>
        </View>
      </Card>

      <Card style={styles.kpiCard}>
        <View style={styles.kpiHeader}>
          <Text style={styles.kpiTitle}>Avg. Fuel Quality</Text>
          <MaterialCommunityIcons name="water" size={20} color="#2196F3" />
        </View>
        <Text style={styles.kpiValue}>99.2%</Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressLabelContainer}>
            <Text style={styles.progressLabel}>Purity Level</Text>
            <Text style={styles.progressLabel}>99.2%</Text>
          </View>
          <View style={styles.progressBar}>
            <Animated.View 
              style={[
                styles.progressFill, 
                {
                  width: progressWidth
                }
              ]} 
            />
          </View>
        </View>
      </Card>

      <Card style={styles.kpiCard}>
        <View style={styles.kpiHeader}>
          <Text style={styles.kpiTitle}>Security Incidents</Text>
          <Ionicons name="shield-checkmark" size={20} color="#4CAF50" />
        </View>
        <Text style={styles.kpiValue}>0</Text>
        <View style={styles.kpiTrend}>
          <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
          <Text style={styles.kpiTrendText}>100% prevention rate</Text>
        </View>
      </Card>
    </View>
  );

  const renderTabContent = () => {
    switch(activeTab) {
      case 'transactions':
        return (
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Monthly Fuel Transactions</Text>
            <BarChart
              data={fuelTransactionsData}
              width={screenWidth}
              height={220}
              chartConfig={barChartConfig}
              style={styles.chart}
              verticalLabelRotation={0}
              showValuesOnTopOfBars
              yAxisLabel=""
              yAxisSuffix=""
            />
          </View>
        );
        
      case 'quality':
        return (
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Fuel Purity Trends</Text>
            <LineChart
              data={fuelQualityData}
              width={screenWidth}
              height={220}
              chartConfig={chartConfig}
              style={styles.chart}
              bezier
            />
          </View>
        );
        
      case 'anomalies':
        return (
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Anomaly Detection Breakdown</Text>
            <PieChart
              data={anomalyData}
              width={screenWidth}
              height={220}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </View>
        );
        
      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Fuel Analytics</Text>
            <Text style={styles.headerSubtitle}>
              Real-time metrics and performance indicators
            </Text>
          </View>
          
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => setMenuVisible(true)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialCommunityIcons name="menu" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      
        <View style={styles.liveIndicatorContainer}>
          <TouchableOpacity 
            style={styles.liveIndicator}
            onPress={() => setIsLive(!isLive)}
          >
            <View style={[
              styles.liveIndicatorDot,
              {backgroundColor: isLive ? '#4CAF50' : '#757575'}
            ]} />
            <Text style={styles.liveIndicatorText}>
              {isLive ? 'Live Data' : 'Paused'}
            </Text>
          </TouchableOpacity>
      
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={handleRefresh}
            disabled={loading}
          >
            <Ionicons 
              name="refresh" 
              size={20} 
              color="#222222"
              style={[loading && styles.rotating]} 
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.vehicleInfoCard}>
        <View style={styles.vehicleInfoHeader}>
          <View style={styles.vehicleIcon}>
            <Text style={styles.vehicleIconText}>R</Text>
          </View>
          <View>
            <Text style={styles.vehicleName}>{vehicle.nickname}</Text>
            <Text style={styles.vehicleModel}>{vehicle.model} • {vehicle.year}</Text>
          </View>
        </View>

        <View style={styles.vehicleInfoStats}>
          <View style={styles.vehicleInfoStat}>
            <Text style={styles.vehicleInfoStatValue}>{vehicle.fuelLevel}%</Text>
            <Text style={styles.vehicleInfoStatLabel}>Fuel Level</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.vehicleInfoStat}>
            <Text style={styles.vehicleInfoStatValue}>450 km</Text>
            <Text style={styles.vehicleInfoStatLabel}>Range</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.vehicleInfoStat}>
            <Text style={styles.vehicleInfoStatValue}>5.8 L</Text>
            <Text style={styles.vehicleInfoStatLabel}>Avg. Consumption</Text>
          </View>
        </View>
      </View>

      {renderKPICards()}

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[
            styles.tabButton, 
            activeTab === 'transactions' && styles.activeTabButton
          ]}
          onPress={() => setActiveTab('transactions')}
        >
          <Text style={[
            styles.tabButtonText,
            activeTab === 'transactions' && styles.activeTabButtonText
          ]}>
            Transactions
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.tabButton, 
            activeTab === 'quality' && styles.activeTabButton
          ]}
          onPress={() => setActiveTab('quality')}
        >
          <Text style={[
            styles.tabButtonText,
            activeTab === 'quality' && styles.activeTabButtonText
          ]}>
            Fuel Quality
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.tabButton, 
            activeTab === 'anomalies' && styles.activeTabButton
          ]}
          onPress={() => setActiveTab('anomalies')}
        >
          <Text style={[
            styles.tabButtonText,
            activeTab === 'anomalies' && styles.activeTabButtonText
          ]}>
            Anomalies
          </Text>
        </TouchableOpacity>
      </View>

      <Card style={styles.chartCard}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FFCC00" />
            <Text style={styles.loadingText}>Loading latest data...</Text>
          </View>
        ) : (
          renderTabContent()
        )}
      </Card>

      <View style={styles.actionsContainer}>
        <Button 
          title="Schedule Refueling" 
          icon="calendar" 
          variant="default" 
          style={styles.actionButton}
          onPress={() => showToast('Refueling scheduled')}
        />

        <Button 
          title="Find Gas Stations" 
          icon="navigate" 
          variant="outline" 
          style={styles.actionButton}
          onPress={() => showToast('Searching for nearby stations...')}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Last updated: {new Date().toLocaleTimeString()} (Refresh count: {refreshCounter})
        </Text>
      </View>

      <MenuDrawer 
        isVisible={menuVisible} 
        onClose={() => setMenuVisible(false)} 
      />
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
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    marginBottom: 12,
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
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  liveIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  liveIndicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  liveIndicatorText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFCC00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rotating: {
    transform: [{ rotate: '360deg' }],
  },
  vehicleInfoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: -20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  vehicleInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  vehicleIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFCC00',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  vehicleIconText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222222',
  },
  vehicleName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222222',
  },
  vehicleModel: {
    fontSize: 14,
    color: '#757575',
  },
  vehicleInfoStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  vehicleInfoStat: {
    flex: 1,
    alignItems: 'center',
  },
  vehicleInfoStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222222',
  },
  vehicleInfoStatLabel: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4,
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: '#EEEEEE',
  },
  kpiContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  kpiCard: {
    width: '100%',
    marginBottom: 12,
    padding: 16,
  },
  kpiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  kpiTitle: {
    fontSize: 14,
    color: '#757575',
  },
  kpiValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 8,
  },
  kpiTrend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  kpiTrendText: {
    fontSize: 12,
    color: '#4CAF50',
    marginLeft: 4,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 12,
    color: '#757575',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#EEEEEE',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2196F3',
    borderRadius: 3,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  tabButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#FFCC00',
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#757575',
  },
  activeTabButtonText: {
    color: '#222222',
    fontWeight: 'bold',
  },
  chartCard: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
  },
  chartContainer: {
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 12,
  },
  chart: {
    borderRadius: 8,
  },
  loadingContainer: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#757575',
    fontSize: 14,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 24,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  footer: {
    marginTop: 24,
    marginBottom: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#757575',
  },
});