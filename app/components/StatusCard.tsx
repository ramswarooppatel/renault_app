import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface StatusCardProps {
  title: string;
  icon: string;
  value: string;
  status?: 'normal' | 'warning' | 'error';
  children?: React.ReactNode;
}

const StatusCard: React.FC<StatusCardProps> = ({
  title,
  icon,
  value,
  status = 'normal',
  children,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'warning':
        return '#FFC107';
      case 'error':
        return '#F44336';
      default:
        return '#4CAF50';
    }
  };
  
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <MaterialCommunityIcons name={icon as any} size={22} color="#222222" />
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={[styles.value, { color: getStatusColor() }]}>{value}</Text>
      {children && <View style={styles.content}>{children}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    width: '48%',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    color: '#757575',
    marginLeft: 6,
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  content: {
    marginTop: 4,
  },
});

export default StatusCard;