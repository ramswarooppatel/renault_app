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
            name="fuel"
            options={{
              title: 'Fuel',
              tabBarIcon: ({ color }) => <Ionicons name="flash" size={24} color={color} />,
            }}
          />
          <Tabs.Screen
            name="assistant"
            options={{
              title: 'AI Assistant',
              tabBarIcon: ({ color }) => <Ionicons name="chatbubbles" size={24} color={color} />,
            }}
          />
          <Tabs.Screen
            name="carcatalogue"
            options={{
              title: 'Catalogue',
              tabBarIcon: ({ color }) => <Ionicons name="car" size={24} color={color} />,
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
