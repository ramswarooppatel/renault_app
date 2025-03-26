import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CardProps {
  title?: string;
  actionIcon?: string;
  onActionPress?: () => void;
  children: React.ReactNode;
  style?: any;
}

const Card: React.FC<CardProps> = ({
  title,
  actionIcon,
  onActionPress,
  children,
  style,
}) => {
  return (
    <View style={[styles.card, style]}>
      {title && (
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          {actionIcon && onActionPress && (
            <TouchableOpacity onPress={onActionPress}>
              <Ionicons name={actionIcon as any} size={22} color="#757575" />
            </TouchableOpacity>
          )}
        </View>
      )}
      <View>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222222',
  },
});

export default Card;