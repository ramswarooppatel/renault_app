import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Modal
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Card from '../components/Card';

interface LegalDocument {
  id: string;
  title: string;
  type: string;
  lastUpdated: string;
  content: string;
  version: string;
}

const legalDocuments: LegalDocument[] = [
  {
    id: '1',
    title: 'Terms of Service',
    type: 'Terms',
    lastUpdated: '2024-03-01',
    version: 'v2.1',
    content: `1. Acceptance of Terms\n
By accessing and using the Renauvate application ("App"), you agree to be bound by these Terms of Service...\n
2. Service Description\n
Renauvate provides vehicle management and monitoring services...\n
3. User Responsibilities\n
Users must maintain accurate information and secure their accounts...`
  },
  {
    id: '2',
    title: 'Privacy Policy',
    type: 'Privacy',
    lastUpdated: '2024-03-01',
    version: 'v2.0',
    content: `1. Information Collection\n
We collect information that you provide directly to us when using the App...\n
2. Use of Information\n
We use the collected information to provide and improve our services...\n
3. Data Security\n
We implement appropriate security measures to protect your information...`
  },
  {
    id: '3',
    title: 'Data Processing Agreement',
    type: 'Data',
    lastUpdated: '2024-02-15',
    version: 'v1.5',
    content: `1. Data Processing Terms\n
This Data Processing Agreement ("DPA") forms part of the agreement between you and Renauvate...\n
2. Processing Requirements\n
We process your data in accordance with applicable data protection laws...`
  },
  {
    id: '4',
    title: 'Cookie Policy',
    type: 'Privacy',
    lastUpdated: '2024-02-01',
    version: 'v1.2',
    content: `1. Use of Cookies\n
We use cookies and similar technologies to provide and improve our services...\n
2. Types of Cookies\n
The App uses different types of cookies for various purposes...`
  }
];

export default function LegalScreen() {
  const [selectedDocument, setSelectedDocument] = useState<LegalDocument | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const getIconForType = (type: string) => {
    switch (type) {
      case 'Terms':
        return 'file-document-outline';
      case 'Privacy':
        return 'shield-account';
      case 'Data':
        return 'database';
      default:
        return 'file';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Legal Documents</Text>
        <Text style={styles.headerSubtitle}>Terms, policies, and agreements</Text>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {legalDocuments.map((document) => (
          <TouchableOpacity
            key={document.id}
            onPress={() => {
              setSelectedDocument(document);
              setModalVisible(true);
            }}
          >
            <Card style={styles.documentCard}>
              <View style={styles.documentHeader}>
                <MaterialCommunityIcons 
                  name={getIconForType(document.type)} 
                  size={24} 
                  color="#222222" 
                />
                <View style={styles.documentInfo}>
                  <Text style={styles.documentTitle}>{document.title}</Text>
                  <Text style={styles.documentMeta}>
                    Version {document.version} • Updated {document.lastUpdated}
                  </Text>
                </View>
                <MaterialCommunityIcons 
                  name="chevron-right" 
                  size={24} 
                  color="#666666" 
                />
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Card style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                <Text style={styles.modalTitle}>
                  {selectedDocument?.title}
                </Text>
                <Text style={styles.modalSubtitle}>
                  Version {selectedDocument?.version}
                </Text>
              </View>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <MaterialCommunityIcons name="close" size={24} color="#222222" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.documentContent}>
                {selectedDocument?.content}
              </Text>
            </ScrollView>
          </Card>
        </View>
      </Modal>
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
    padding: 16,
  },
  documentCard: {
    marginBottom: 12,
    padding: 16,
  },
  documentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  documentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222222',
  },
  documentMeta: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 16,
  },
  modalContent: {
    maxHeight: '80%',
    padding: 0,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  modalTitleContainer: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222222',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 16,
  },
  documentContent: {
    fontSize: 14,
    lineHeight: 20,
    color: '#444444',
  },
});