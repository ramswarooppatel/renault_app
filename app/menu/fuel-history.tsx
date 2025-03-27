import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Dimensions,
  TouchableOpacity 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LineChart, BarChart } from 'react-native-chart-kit';
import Card from '../components/Card';

const { width: screenWidth } = Dimensions.get('window');

interface FuelTransaction {
  id: string;
  date: string;
  amount: number;
  cost: number;
  location: string;
  fuelType: string;
  quality: string;
  mileage: number;
}

const recentTransactions: FuelTransaction[] = [
  {
    id: '1',
    date: '2024-03-20',
    amount: 45.5,
    cost: 89.99,
    location: 'Renault Service Station',
    fuelType: 'Petrol',
    quality: 'Premium',
    mileage: 15420
  },
  {
    id: '2',
    date: '2024-03-10',
    amount: 40.0,
    cost: 78.50,
    location: 'Shell Station',
    fuelType: 'Petrol',
    quality: 'Regular',
    mileage: 15100
  },
  {
    id: '3',
    date: '2024-02-28',
    amount: 42.5,
    cost: 82.75,
    location: 'BP Station',
    fuelType: 'Petrol',
    quality: 'Premium',
    mileage: 14800
  }
];

const monthlyData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      data: [120, 135, 125, 142, 128, 132],
      color: (opacity = 1) => `rgba(255, 204, 0, ${opacity})`,
    }
  ]
};

const consumptionData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      data: [7.2, 7.5, 7.1, 7.4, 7.2, 7.3],
    }
  ]
};

export default function FuelHistoryScreen() {
  const [activeTab, setActiveTab] = useState<'transactions' | 'analytics'>('transactions');

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(34, 34, 34, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(34, 34, 34, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#FFCC00'
    }
  };

  const renderTransaction = (transaction: FuelTransaction) => (
    <Card key={transaction.id} style={styles.transactionCard}>
      <View style={styles.transactionHeader}>
        <View>
          <Text style={styles.transactionDate}>{transaction.date}</Text>
          <Text style={styles.transactionLocation}>{transaction.location}</Text>
        </View>
        <Text style={styles.transactionAmount}>₹{transaction.cost.toFixed(2)}</Text>
      </View>

      <View style={styles.transactionDetails}>
        <View style={styles.detailItem}>
          <MaterialCommunityIcons name="gas-station" size={16} color="#666" />
          <Text style={styles.detailText}>{transaction.amount}L</Text>
        </View>
        <View style={styles.detailItem}>
          <MaterialCommunityIcons name="fuel" size={16} color="#666" />
          <Text style={styles.detailText}>{transaction.fuelType}</Text>
        </View>
        <View style={styles.detailItem}>
          <MaterialCommunityIcons name="check-circle" size={16} color="#666" />
          <Text style={styles.detailText}>{transaction.quality}</Text>
        </View>
        <View style={styles.detailItem}>
          <MaterialCommunityIcons name="speedometer" size={16} color="#666" />
          <Text style={styles.detailText}>{transaction.mileage} km</Text>
        </View>
      </View>
    </Card>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Fuel History</Text>
        <Text style={styles.headerSubtitle}>Track your fuel consumption and expenses</Text>
      </View>

      <View style={styles.summary}>
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Monthly Average</Text>
          <Text style={styles.summaryValue}>₹2,450</Text>
          <Text style={styles.summarySubtext}>132L consumed</Text>
        </Card>
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Efficiency</Text>
          <Text style={styles.summaryValue}>7.3 km/L</Text>
          <Text style={styles.summarySubtext}>Last 30 days</Text>
        </Card>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'transactions' && styles.activeTab]}
          onPress={() => setActiveTab('transactions')}
        >
          <Text style={[styles.tabText, activeTab === 'transactions' && styles.activeTabText]}>
            Transactions
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'analytics' && styles.activeTab]}
          onPress={() => setActiveTab('analytics')}
        >
          <Text style={[styles.tabText, activeTab === 'analytics' && styles.activeTabText]}>
            Analytics
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'transactions' ? (
        <View style={styles.transactions}>
          {recentTransactions.map(renderTransaction)}
        </View>
      ) : (
        <View style={styles.analytics}>
          <Card style={styles.chartCard}>
            <Text style={styles.chartTitle}>Monthly Expenses</Text>
            <LineChart
              data={monthlyData}
              width={screenWidth - 48}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </Card>

          <Card style={styles.chartCard}>
            <Text style={styles.chartTitle}>Fuel Efficiency Trend</Text>
            <BarChart
              data={consumptionData}
              width={screenWidth - 48}
              height={220}
              chartConfig={chartConfig}
              style={styles.chart}
              showValuesOnTopOfBars
            />
          </Card>
        </View>
      )}
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
  summary: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
  },
  summaryCard: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222222',
  },
  summarySubtext: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
  tabs: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  activeTab: {
    backgroundColor: '#222222',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#222222',
  },
  activeTabText: {
    color: '#FFCC00',
  },
  transactions: {
    padding: 16,
  },
  transactionCard: {
    marginBottom: 16,
    padding: 16,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  transactionDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222222',
  },
  transactionLocation: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222222',
  },
  transactionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 4,
  },
  analytics: {
    padding: 16,
  },
  chartCard: {
    marginBottom: 16,
    padding: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222222',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});