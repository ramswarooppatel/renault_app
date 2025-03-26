import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { VehicleProvider } from '../../lib/context/VehicleContext';
import { ToastProvider } from '../../lib/context/ToastContext';

// Function to handle conditional values based on platform
const useClientOnlyValue = (web: any, native: any) => {
  return native;
};

export default function TabLayout() {
  return (
    <VehicleProvider>
      <ToastProvider>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: '#FFCC00',
            tabBarInactiveTintColor: '#757575',
            headerShown: useClientOnlyValue(false, true),
            tabBarStyle: {
              backgroundColor: '#222222',
            },
            headerStyle: {
              backgroundColor: '#222222',
            },
            headerTitleStyle: {
              color: '#FFFFFF',
            },
          }}>
          <Tabs.Screen
            name="index"
            options={{
              headerShown: false,
              title: 'Dashboard',
              tabBarIcon: ({ color }) => <Ionicons name="speedometer" size={24} color={color} />,
            }}
          />
          <Tabs.Screen
            name="climate"
            options={{
              title: 'Climate',
              tabBarIcon: ({ color }) => <Ionicons name="thermometer" size={24} color={color} />,
            }}
          />
          <Tabs.Screen
            name="fuel"
            options={{
              title: 'Fuel',
              tabBarIcon: ({ color }) => <Ionicons name="flash" size={24} color={color} />,
            }}
          />
          <Tabs.Screen
            name="maintenance"
            options={{
              title: 'Maintenance',
              tabBarIcon: ({ color }) => <Ionicons name="construct" size={24} color={color} />,
            }}
          />
          <Tabs.Screen
            name="vehicle-documents"
            options={{
              title: 'Documents',
              tabBarIcon: ({ color }) => <Ionicons name="document-text" size={24} color={color} />,
            }}
          />
        </Tabs>
      </ToastProvider>
    </VehicleProvider>
  );
}
