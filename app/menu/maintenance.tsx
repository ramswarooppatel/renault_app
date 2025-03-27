import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  Dimensions,
  ScrollView 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Card from '../components/Card';

const { width } = Dimensions.get('window');

interface MaintenanceRecord {
  id: string;
  type: string;
  date: string;
  mileage: number;
  status: 'Completed' | 'Pending' | 'Scheduled';
  cost: number;
  description?: string;
  technician?: string;
  location?: string;
}

interface UpcomingService {
  id: string;
  service: string;
  dueDate: string;
  dueKm: number;
  estimatedCost: number;
  priority: 'High' | 'Medium' | 'Low';
  description?: string;
}

const maintenanceHistory: MaintenanceRecord[] = [
  {
    id: '1',
    type: 'Oil Change',
    date: '2024-03-15',
    mileage: 15000,
    status: 'Completed',
    cost: 45.99,
    description: 'Regular oil change with filter replacement',
    technician: 'John Smith',
    location: 'Renault Service Center'
  },
  {
    id: '2',
    type: 'Brake Service',
    date: '2024-02-28',
    mileage: 14500,
    status: 'Completed',
    cost: 150.00,
    description: 'Front brake pad replacement',
    technician: 'Mike Johnson',
    location: 'Renault Service Center'
  },
  {
    id: '3',
    type: 'Tire Rotation',
    date: '2024-01-20',
    mileage: 13000,
    status: 'Completed',
    cost: 30.00,
    description: 'Regular tire rotation and pressure check',
    technician: 'Sarah Wilson',
    location: 'Renault Service Center'
  }
];

const upcomingServices: UpcomingService[] = [
  {
    id: '1',
    service: 'Major Service',
    dueDate: '2024-04-15',
    dueKm: 20000,
    estimatedCost: 299.99,
    priority: 'High',
    description: 'Complete vehicle inspection and service'
  },
  {
    id: '2',
    service: 'Air Filter Replacement',
    dueDate: '2024-05-01',
    dueKm: 25000,
    estimatedCost: 45.00,
    priority: 'Medium',
    description: 'Replace air filter and cabin filter'
  },
  {
    id: '3',
    service: 'Wheel Alignment',
    dueDate: '2024-05-15',
    dueKm: 30000,
    estimatedCost: 89.99,
    priority: 'Low',
    description: 'Check and adjust wheel alignment'
  }
];

export default function MaintenanceScreen() {
  const [activeTab, setActiveTab] = useState<'history' | 'upcoming'>('history');

  const renderMaintenanceItem = ({ item }: { item: MaintenanceRecord }) => (
    <Card style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <Text style={styles.cardTitle}>{item.type}</Text>
          <Text style={styles.cardSubtitle}>{item.date}</Text>
        </View>
        <View style={[styles.statusBadge, 
          { backgroundColor: item.status === 'Completed' ? '#4CAF50' : '#FFC107' }
        ]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="speedometer" size={16} color="#666" />
          <Text style={styles.infoText}>{item.mileage} km</Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="currency-usd" size={16} color="#666" />
          <Text style={styles.infoText}>${item.cost.toFixed(2)}</Text>
        </View>
        {item.location && (
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="map-marker" size={16} color="#666" />
            <Text style={styles.infoText}>{item.location}</Text>
          </View>
        )}
        {item.description && (
          <Text style={styles.description}>{item.description}</Text>
        )}
      </View>
    </Card>
  );

  const renderUpcomingItem = ({ item }: { item: UpcomingService }) => (
    <Card style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <Text style={styles.cardTitle}>{item.service}</Text>
          <Text style={styles.cardSubtitle}>Due: {item.dueDate}</Text>
        </View>
        <View style={[styles.priorityBadge, 
          { backgroundColor: 
            item.priority === 'High' ? '#FF5722' : 
            item.priority === 'Medium' ? '#FFC107' : '#4CAF50' 
          }
        ]}>
          <Text style={styles.statusText}>{item.priority}</Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="speedometer" size={16} color="#666" />
          <Text style={styles.infoText}>Due at {item.dueKm} km</Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="currency-usd" size={16} color="#666" />
          <Text style={styles.infoText}>Est. ${item.estimatedCost.toFixed(2)}</Text>
        </View>
        {item.description && (
          <Text style={styles.description}>{item.description}</Text>
        )}
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Maintenance</Text>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
        >
          <MaterialCommunityIcons 
            name="history" 
            size={20} 
            color={activeTab === 'history' ? '#FFCC00' : '#666'} 
          />
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
            History
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('upcoming')}
        >
          <MaterialCommunityIcons 
            name="calendar-clock" 
            size={20} 
            color={activeTab === 'upcoming' ? '#FFCC00' : '#666'} 
          />
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>
            Upcoming
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList<MaintenanceRecord | UpcomingService>
        data={activeTab === 'history' ? maintenanceHistory : upcomingServices}
        renderItem={({ item }) => (
          activeTab === 'history' 
            ? renderMaintenanceItem({ item: item as MaintenanceRecord })
            : renderUpcomingItem({ item: item as UpcomingService })
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    padding: 16,
    paddingTop: 60,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#FFF',
  },
  activeTab: {
    backgroundColor: '#222',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    marginLeft: 8,
  },
  activeTabText: {
    color: '#FFCC00',
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#FFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardHeaderLeft: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFF',
  },
  cardContent: {
    marginTop: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    lineHeight: 20,
  },
});