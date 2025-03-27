import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Dimensions 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Card from '../components/Card';

const { width } = Dimensions.get('window');

interface SupportOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
  color: string;
}

const supportOptions: SupportOption[] = [
  {
    id: 'issues',
    title: 'Issue Resolution',
    description: 'Report and track vehicle problems',
    icon: 'wrench',
    route: '/menu/support/issues',
    color: '#FF5722'
  },
  {
    id: 'contact',
    title: 'Contact Support',
    description: '24/7 customer service assistance',
    icon: 'message',
    route: '/menu/support/contact',
    color: '#4CAF50'
  },
  {
    id: 'faq',
    title: 'FAQs',
    description: 'Frequently asked questions',
    icon: 'frequently-asked-questions',
    route: '/menu/support/faq',
    color: '#2196F3'
  },
  {
    id: 'chat',
    title: 'Live Chat',
    description: 'Chat with support team',
    icon: 'chat',
    route: '/menu/support/chat',
    color: '#9C27B0'
  }
];

const quickLinks = [
  {
    title: 'Owner Manual',
    icon: 'book-open-variant',
    route: '/menu/manual'
  },
  {
    title: 'Vehicle Diagrams',
    icon: 'car-info',
    route: '/menu/diagrams'
  },
  {
    title: 'Service Centers',
    icon: 'map-marker',
    route: '/menu/service-centers'
  },
  {
    title: 'Emergency',
    icon: 'car-emergency',
    route: '/menu/emergency'
  }
];

export default function SupportScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <Text style={styles.headerSubtitle}>How can we assist you today?</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.supportGrid}>
          {supportOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.supportCard}
              onPress={() => router.push(option.route)}
            >
              <View style={[styles.iconContainer, { backgroundColor: option.color }]}>
                <MaterialCommunityIcons name={option.icon as any} size={32} color="#FFFFFF" />
              </View>
              <Text style={styles.cardTitle}>{option.title}</Text>
              <Text style={styles.cardDescription}>{option.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Quick Access</Text>
        <Card style={styles.quickLinksCard}>
          {quickLinks.map((link, index) => (
            <React.Fragment key={link.title}>
              <TouchableOpacity 
                style={styles.quickLink}
                onPress={() => router.push(link.route)}
              >
                <MaterialCommunityIcons name={link.icon as any} size={24} color="#222222" />
                <Text style={styles.quickLinkText}>{link.title}</Text>
                <MaterialCommunityIcons name="chevron-right" size={24} color="#666666" />
              </TouchableOpacity>
              {index < quickLinks.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </Card>

        <Card style={styles.emergencyCard}>
          <View style={styles.emergencyHeader}>
            <MaterialCommunityIcons name="phone-ring" size={24} color="#FF5722" />
            <Text style={styles.emergencyTitle}>24/7 Emergency Support</Text>
          </View>
          <Text style={styles.emergencyNumber}>1-800-RENAULT</Text>
          <Text style={styles.emergencyText}>
            Our emergency team is available round the clock for immediate assistance
          </Text>
          <TouchableOpacity 
            style={styles.emergencyButton}
            onPress={() => router.push('/menu/emergency')}
          >
            <Text style={styles.emergencyButtonText}>Get Emergency Help</Text>
          </TouchableOpacity>
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
  supportGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  supportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: (width - 48) / 2,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666666',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 16,
  },
  quickLinksCard: {
    marginBottom: 24,
  },
  quickLink: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  quickLinkText: {
    flex: 1,
    fontSize: 16,
    color: '#222222',
    marginLeft: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
  },
  emergencyCard: {
    backgroundColor: '#FFF5F2',
    padding: 16,
    marginBottom: 24,
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF5722',
    marginLeft: 8,
  },
  emergencyNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 8,
  },
  emergencyText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
  },
  emergencyButton: {
    backgroundColor: '#FF5722',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  emergencyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});