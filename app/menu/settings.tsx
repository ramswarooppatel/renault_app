import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Switch,
  TouchableOpacity,
  Alert
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useToast } from '../../lib/context/ToastContext';
import Card from '../components/Card';

interface SettingSection {
  title: string;
  icon: string;
  settings: Setting[];
}

interface Setting {
  id: string;
  title: string;
  type: 'toggle' | 'select' | 'action';
  value?: boolean;
  description?: string;
  action?: () => void;
}

export default function SettingsScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const [settings, setSettings] = useState({
    notifications: true,
    locationTracking: true,
    fuelAlerts: true,
    maintenanceReminders: true,
    darkMode: false,
    dataSync: true,
    smartFeatures: true,
    batteryOptimization: true
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    showToast(`${key} ${!settings[key] ? 'enabled' : 'disabled'}`);
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear App Data',
      'Are you sure you want to clear all app data? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            // Add clear data logic here
            showToast('App data cleared');
          }
        }
      ]
    );
  };

  const settingsSections: SettingSection[] = [
    {
      title: 'General',
      icon: 'cog',
      settings: [
        {
          id: 'notifications',
          title: 'Push Notifications',
          type: 'toggle',
          value: settings.notifications,
          description: 'Receive important updates and alerts'
        },
        {
          id: 'darkMode',
          title: 'Dark Mode',
          type: 'toggle',
          value: settings.darkMode,
          description: 'Enable dark theme throughout the app'
        }
      ]
    },
    {
      title: 'Vehicle',
      icon: 'car-cog',
      settings: [
        {
          id: 'locationTracking',
          title: 'Location Tracking',
          type: 'toggle',
          value: settings.locationTracking,
          description: 'Track vehicle location and trips'
        },
        {
          id: 'fuelAlerts',
          title: 'Fuel Alerts',
          type: 'toggle',
          value: settings.fuelAlerts,
          description: 'Get notifications about fuel levels'
        },
        {
          id: 'maintenanceReminders',
          title: 'Maintenance Reminders',
          type: 'toggle',
          value: settings.maintenanceReminders,
          description: 'Receive service due notifications'
        }
      ]
    },
    {
      title: 'Data & Privacy',
      icon: 'shield-lock',
      settings: [
        {
          id: 'dataSync',
          title: 'Background Sync',
          type: 'toggle',
          value: settings.dataSync,
          description: 'Keep data synchronized in background'
        },
        {
          id: 'clearData',
          title: 'Clear App Data',
          type: 'action',
          description: 'Delete all locally stored data',
          action: handleClearData
        }
      ]
    },
    {
      title: 'Advanced',
      icon: 'tune',
      settings: [
        {
          id: 'smartFeatures',
          title: 'Smart Features',
          type: 'toggle',
          value: settings.smartFeatures,
          description: 'Enable AI-powered features'
        },
        {
          id: 'batteryOptimization',
          title: 'Battery Optimization',
          type: 'toggle',
          value: settings.batteryOptimization,
          description: 'Optimize app for better battery life'
        }
      ]
    }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Customize your app preferences</Text>
      </View>

      <ScrollView style={styles.content}>
        {settingsSections.map((section) => (
          <View key={section.title} style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name={section.icon as any} size={20} color="#666666" />
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>

            <Card style={styles.sectionCard}>
              {section.settings.map((setting) => (
                <View 
                  key={setting.id} 
                  style={[
                    styles.settingItem,
                    setting !== section.settings[section.settings.length - 1] && styles.settingDivider
                  ]}
                >
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingTitle}>{setting.title}</Text>
                    {setting.description && (
                      <Text style={styles.settingDescription}>{setting.description}</Text>
                    )}
                  </View>
                  
                  {setting.type === 'toggle' && (
                    <Switch
                      value={setting.value}
                      onValueChange={() => handleToggle(setting.id as keyof typeof settings)}
                      trackColor={{ false: '#DDDDDD', true: '#FFCC00' }}
                      thumbColor={setting.value ? '#222222' : '#FFFFFF'}
                    />
                  )}
                  
                  {setting.type === 'action' && (
                    <TouchableOpacity 
                      onPress={setting.action}
                      style={styles.actionButton}
                    >
                      <MaterialCommunityIcons name="chevron-right" size={24} color="#666666" />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </Card>
          </View>
        ))}
      </ScrollView>
    </View>
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
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginLeft: 8,
    textTransform: 'uppercase',
  },
  sectionCard: {
    marginHorizontal: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#222222',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666666',
  },
  actionButton: {
    padding: 4,
  }
});