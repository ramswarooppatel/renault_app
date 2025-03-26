import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useToast } from '../../lib/context/ToastContext';
import { useVehicle } from '../../lib/hooks/useVehicle';

interface Vehicle {
  nickname: string;
  model: string;
  year: string | number;
}

export default function VehicleDocumentsScreen() {
  const { vehicle } = useVehicle() as { vehicle: Vehicle };
  const { showToast } = useToast();
  const [selectedCategory, setSelectedCategory] = React.useState('all');

  const documents = [
    {
      id: '1',
      title: 'Vehicle Registration',
      category: 'legal',
      date: '12/05/2023',
      expires: '12/05/2024',
      size: '1.2 MB',
      icon: 'document-text',
    },
    {
      id: '2',
      title: 'Insurance Policy',
      category: 'insurance',
      date: '01/15/2024',
      expires: '01/15/2025',
      size: '3.4 MB',
      icon: 'shield-checkmark',
    },
    {
      id: '3',
      title: 'Vehicle Inspection Report',
      category: 'maintenance',
      date: '02/18/2024',
      expires: '02/18/2025',
      size: '2.1 MB',
      icon: 'clipboard',
    },
    {
      id: '4',
      title: 'Ownership Certificate',
      category: 'legal',
      date: '05/30/2022',
      expires: 'N/A',
      size: '0.8 MB',
      icon: 'ribbon',
    },
    {
      id: '5',
      title: 'Service History',
      category: 'maintenance',
      date: '03/10/2024',
      expires: 'N/A',
      size: '4.7 MB',
      icon: 'construct',
    }
  ];

  const categories = [
    { id: 'all', name: 'All Documents', icon: 'folder' },
    { id: 'legal', name: 'Legal', icon: 'briefcase' },
    { id: 'insurance', name: 'Insurance', icon: 'shield-checkmark' },
    { id: 'maintenance', name: 'Maintenance', icon: 'construct' }
  ];

  const filteredDocuments = selectedCategory === 'all' 
    ? documents 
    : documents.filter(doc => doc.category === selectedCategory);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.vehicleInfoBox}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>R</Text>
          </View>
          <View style={styles.vehicleInfo}>
            <Text style={styles.vehicleName}>{vehicle.nickname}</Text>
            <Text style={styles.vehicleModel}>{vehicle.model} {vehicle.year}</Text>
          </View>
        </View>
        
        <View style={styles.documentInfoBox}>
          <View style={styles.documentStat}>
            <Text style={styles.documentCount}>{documents.length}</Text>
            <Text style={styles.documentLabel}>Documents</Text>
          </View>
          <View style={styles.documentStat}>
            <Text style={styles.documentCount}>2</Text>
            <Text style={styles.documentLabel}>Expiring Soon</Text>
          </View>
        </View>
      </View>

      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && styles.categoryButtonActive
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Ionicons 
              name={category.icon as React.ComponentProps<typeof Ionicons>['name']} 
              size={18} 
              color={selectedCategory === category.id ? '#FFFFFF' : '#222222'} 
              style={styles.categoryIcon}
            />
            <Text 
              style={[
                styles.categoryText,
                selectedCategory === category.id && styles.categoryTextActive
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.documentsContainer}>
        {filteredDocuments.map(doc => (
          <TouchableOpacity
            key={doc.id}
            style={styles.documentCard}
            onPress={() => showToast(`Opening ${doc.title}...`)}
          >
            <View style={styles.documentIconContainer}>
              <Ionicons name={doc.icon as React.ComponentProps<typeof Ionicons>['name']} size={24} color="#FFFFFF" />
            </View>
            <View style={styles.documentInfo}>
              <Text style={styles.documentTitle}>{doc.title}</Text>
              <Text style={styles.documentMeta}>
                Updated: {doc.date} • {doc.size}
              </Text>
              {doc.expires !== 'N/A' && (
                <Text style={styles.documentExpiry}>
                  Expires: {doc.expires}
                </Text>
              )}
            </View>
            <TouchableOpacity 
              style={styles.downloadButton}
              onPress={() => showToast(`Downloading ${doc.title}...`)}
            >
              <Ionicons name="download" size={20} color="#222222" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.uploadSection}>
        <Text style={styles.sectionTitle}>Upload New Document</Text>
        
        <TouchableOpacity 
          style={styles.uploadButton}
          onPress={() => showToast('Upload document feature coming soon...')}
        >
          <View style={styles.uploadIconContainer}>
            <Ionicons name="cloud-upload" size={32} color="#FFCC00" />
          </View>
          <Text style={styles.uploadText}>
            Tap to select file or take a photo
          </Text>
          <Text style={styles.uploadSubtext}>
            Supported formats: PDF, JPG, PNG
          </Text>
        </TouchableOpacity>
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
    padding: 20,
    paddingTop: 60,
  },
  vehicleInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFCC00',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222222',
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  vehicleModel: {
    fontSize: 16,
    color: '#CCCCCC',
  },
  documentInfoBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 16,
  },
  documentStat: {
    flex: 1,
    alignItems: 'center',
  },
  documentCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFCC00',
  },
  documentLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 4,
  },
  categoriesContainer: {
    marginTop: 16,
  },
  categoriesContent: {
    paddingHorizontal: 16,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryButtonActive: {
    backgroundColor: '#FFCC00',
  },
  categoryIcon: {
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#222222',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  documentsContainer: {
    padding: 16,
  },
  documentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  documentIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFCC00',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  documentInfo: {
    flex: 1,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 4,
  },
  documentMeta: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 2,
  },
  documentExpiry: {
    fontSize: 12,
    color: '#FF5722',
  },
  downloadButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 16,
  },
  uploadSection: {
    padding: 16,
    marginBottom: 32,
  },
  uploadButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#CCCCCC',
  },
  uploadIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#222222',
    marginBottom: 8,
  },
  uploadSubtext: {
    fontSize: 12,
    color: '#757575',
  },
});