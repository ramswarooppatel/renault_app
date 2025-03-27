import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  FlatList,
  Dimensions,
  TextInput 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Card from '../components/Card';

const { width } = Dimensions.get('window');

interface ManualSection {
  id: string;
  title: string;
  icon: string;
  sections: {
    title: string;
    content: string;
  }[];
}

const manualData: ManualSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: 'car-key',
    sections: [
      {
        title: 'Vehicle Overview',
        content: 'Your Renault vehicle comes equipped with state-of-the-art features designed for comfort, safety, and efficiency...'
      },
      {
        title: 'Key Functions',
        content: 'Understanding your vehicle\'s key functions is essential for optimal operation...'
      }
    ]
  },
  {
    id: 'operations',
    title: 'Basic Operations',
    icon: 'car-cog',
    sections: [
      {
        title: 'Starting and Stopping',
        content: 'To start your vehicle, ensure the key fob is within range and press the START/STOP button...'
      },
      {
        title: 'Gear Operation',
        content: 'Your vehicle features an advanced transmission system...'
      }
    ]
  },
  {
    id: 'maintenance',
    title: 'Maintenance',
    icon: 'tools',
    sections: [
      {
        title: 'Regular Checks',
        content: 'Perform these essential checks regularly to maintain your vehicles performance...'
      },
      {
        title: 'Service Schedule',
        content: 'Follow the recommended service schedule to ensure optimal vehicle performance...'
      }
    ]
  },
  {
    id: 'safety',
    title: 'Safety Features',
    icon: 'shield-check',
    sections: [
      {
        title: 'Active Safety',
        content: 'Your vehicle includes advanced active safety features like ABS, ESP...'
      },
      {
        title: 'Passive Safety',
        content: 'Multiple airbags and reinforced structure provide excellent passive safety...'
      }
    ]
  },
  {
    id: 'smartfuel',
    title: 'SmartFuel System',
    icon: 'gas-station',
    sections: [
      {
        title: 'System Overview',
        content: 'The SmartFuel system monitors and authenticates fuel quality...'
      },
      {
        title: 'Usage Guidelines',
        content: 'Follow these guidelines to ensure optimal fuel system performance...'
      }
    ]
  }
];

export default function ManualScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState<ManualSection | null>(null);
  const [selectedContent, setSelectedContent] = useState<{title: string, content: string} | null>(null);

  const filteredSections = manualData.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.sections.some(subSection => 
      subSection.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const renderSection = ({ item }: { item: ManualSection }) => (
    <TouchableOpacity 
      style={[
        styles.sectionCard,
        selectedSection?.id === item.id && styles.selectedSection
      ]}
      onPress={() => setSelectedSection(item)}
    >
      <MaterialCommunityIcons 
        name={item.icon as any} 
        size={24} 
        color={selectedSection?.id === item.id ? '#FFCC00' : '#222222'} 
      />
      <Text style={[
        styles.sectionTitle,
        selectedSection?.id === item.id && styles.selectedSectionText
      ]}>
        {item.title}
      </Text>
      <MaterialCommunityIcons 
        name="chevron-right" 
        size={24} 
        color={selectedSection?.id === item.id ? '#FFCC00' : '#666666'} 
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Owner's Manual</Text>
        <Text style={styles.headerSubtitle}>Everything you need to know about your vehicle</Text>
      </View>

      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={20} color="#666666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search manual..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#666666"
        />
      </View>

      <View style={styles.content}>
        {!selectedSection ? (
          <FlatList
            data={filteredSections}
            renderItem={renderSection}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.sectionsList}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.detailView}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => {
                setSelectedSection(null);
                setSelectedContent(null);
              }}
            >
              <MaterialCommunityIcons name="arrow-left" size={24} color="#222222" />
              <Text style={styles.backButtonText}>Back to sections</Text>
            </TouchableOpacity>

            <Text style={styles.detailTitle}>{selectedSection.title}</Text>
            
            {!selectedContent ? (
              <View style={styles.subsectionsList}>
                {selectedSection.sections.map((subsection, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.subsectionCard}
                    onPress={() => setSelectedContent(subsection)}
                  >
                    <Text style={styles.subsectionTitle}>{subsection.title}</Text>
                    <MaterialCommunityIcons name="chevron-right" size={24} color="#666666" />
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <ScrollView style={styles.contentView}>
                <TouchableOpacity 
                  style={styles.backButton}
                  onPress={() => setSelectedContent(null)}
                >
                  <MaterialCommunityIcons name="arrow-left" size={24} color="#222222" />
                  <Text style={styles.backButtonText}>Back to {selectedSection.title}</Text>
                </TouchableOpacity>

                <Text style={styles.contentTitle}>{selectedContent.title}</Text>
                <Text style={styles.contentText}>{selectedContent.content}</Text>
              </ScrollView>
            )}
          </View>
        )}
      </View>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#222222',
  },
  content: {
    flex: 1,
  },
  sectionsList: {
    padding: 16,
  },
  sectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedSection: {
    backgroundColor: '#222222',
  },
  sectionTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#222222',
    marginLeft: 12,
  },
  selectedSectionText: {
    color: '#FFFFFF',
  },
  detailView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
  detailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222222',
    padding: 16,
    paddingTop: 0,
  },
  subsectionsList: {
    padding: 16,
  },
  subsectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  subsectionTitle: {
    flex: 1,
    fontSize: 16,
    color: '#222222',
  },
  contentView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222222',
    padding: 16,
    paddingTop: 0,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444444',
    padding: 16,
    paddingTop: 0,
  },
});