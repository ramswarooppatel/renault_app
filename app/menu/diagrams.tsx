import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  Dimensions,
  Modal 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Card from '../components/Card';

const { width } = Dimensions.get('window');

interface DiagramSection {
  id: string;
  title: string;
  image: string;
  parts: {
    id: string;
    name: string;
    description: string;
    position: { x: number; y: number };
  }[];
}

const diagramData: DiagramSection[] = [
  {
    id: 'engine',
    title: 'Engine Components',
    image: 'https://example.com/engine-diagram.png', // Replace with actual diagram image
    parts: [
      {
        id: 'e1',
        name: 'Fuel Injection System',
        description: 'Direct fuel injection system with smart monitoring capabilities',
        position: { x: 30, y: 40 }
      },
      {
        id: 'e2',
        name: 'Turbocharger',
        description: 'Twin-scroll turbocharger with variable geometry',
        position: { x: 60, y: 35 }
      }
    ]
  },
  {
    id: 'transmission',
    title: 'Transmission System',
    image: 'https://example.com/transmission-diagram.png', // Replace with actual diagram image
    parts: [
      {
        id: 't1',
        name: 'EDC Gearbox',
        description: 'Seven-speed efficient dual-clutch transmission',
        position: { x: 45, y: 50 }
      }
    ]
  },
  {
    id: 'suspension',
    title: 'Suspension System',
    image: 'https://example.com/suspension-diagram.png', // Replace with actual diagram image
    parts: [
      {
        id: 's1',
        name: 'Multi-link Suspension',
        description: 'Independent multi-link rear suspension system',
        position: { x: 70, y: 60 }
      }
    ]
  }
];

export default function DiagramsScreen() {
  const [selectedSection, setSelectedSection] = useState<DiagramSection | null>(null);
  const [selectedPart, setSelectedPart] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const renderHotspot = (part: any) => (
    <TouchableOpacity
      key={part.id}
      style={[styles.hotspot, {
        left: `${part.position.x}%`,
        top: `${part.position.y}%`
      }]}
      onPress={() => {
        setSelectedPart(part);
        setModalVisible(true);
      }}
    >
      <View style={styles.hotspotDot} />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Vehicle Diagrams</Text>
        <Text style={styles.headerSubtitle}>Interactive component diagrams</Text>
      </View>

      {!selectedSection ? (
        <View style={styles.sectionsList}>
          {diagramData.map((section) => (
            <TouchableOpacity
              key={section.id}
              onPress={() => setSelectedSection(section)}
            >
              <Card style={styles.sectionCard}>
                <MaterialCommunityIcons 
                  name={
                    section.id === 'engine' ? 'engine' :
                    section.id === 'transmission' ? 'car-shift-pattern' :
                    'car-suspension'
                  } 
                  size={24} 
                  color="#222222" 
                />
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <MaterialCommunityIcons name="chevron-right" size={24} color="#666666" />
              </Card>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.diagramView}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setSelectedSection(null)}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="#222222" />
            <Text style={styles.backButtonText}>Back to sections</Text>
          </TouchableOpacity>

          <Card style={styles.diagramCard}>
            <Text style={styles.diagramTitle}>{selectedSection.title}</Text>
            <View style={styles.diagramContainer}>
              <Image
                source={{ uri: selectedSection.image }}
                style={styles.diagramImage}
                resizeMode="contain"
              />
              {selectedSection.parts.map(renderHotspot)}
            </View>
            <Text style={styles.diagramHelper}>
              Tap on the dots to view component details
            </Text>
          </Card>
        </View>
      )}

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <Card style={styles.partModal}>
            <View style={styles.partModalHeader}>
              <Text style={styles.partModalTitle}>{selectedPart?.name}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#222222" />
              </TouchableOpacity>
            </View>
            <Text style={styles.partModalDescription}>
              {selectedPart?.description}
            </Text>
          </Card>
        </TouchableOpacity>
      </Modal>
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
  sectionsList: {
    padding: 16,
  },
  sectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#222222',
    marginLeft: 12,
  },
  diagramView: {
    flex: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#222222',
    marginLeft: 8,
  },
  diagramCard: {
    margin: 16,
    padding: 16,
  },
  diagramTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 16,
  },
  diagramContainer: {
    width: '100%',
    aspectRatio: 16/9,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    position: 'relative',
  },
  diagramImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  diagramHelper: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginTop: 16,
  },
  hotspot: {
    position: 'absolute',
    width: 24,
    height: 24,
    marginLeft: -12,
    marginTop: -12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hotspotDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFCC00',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  partModal: {
    width: '100%',
    padding: 16,
  },
  partModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  partModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222222',
  },
  partModalDescription: {
    fontSize: 16,
    color: '#444444',
    lineHeight: 24,
  },
});