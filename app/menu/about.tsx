import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  Modal,
  Linking,
  Dimensions 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Card from '../components/Card';

const { width } = Dimensions.get('window');

interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo: string;
  portfolio?: string;
  linkedin: string;
  github: string;
  description: string;
}

const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Ramswaroop Patel',
    role: 'Team Lead',
    photo: 'https://i.ibb.co/Yg3sfkG/RPX.jpg', // Replace with actual photo URL
    linkedin: 'https://linkedin.com/in/ramswarooppatel',
    github: 'https://github.com/ramswarooppatel',
    description: 'Lead developer overseeing the entire project architecture and team coordination.'
  },
  {
    id: '2',
    name: 'Netrang Davey',
    role: 'Developer',
    photo: 'https://i.ibb.co/cXK9XS54/Whats-App-Image-2025-03-21-at-18-04-59-6ecc3026.jpg', // Replace with actual photo URL
    linkedin: 'https://linkedin.com/in/netrangdavey',
    github: 'https://github.com/netrangdavey',
    description: 'Frontend specialist focusing on user interface and experience design.'
  },
  {
    id: '3',
    name: 'Arindam Jaiman',
    role: 'Developer',
    photo: 'https://i.ibb.co/Gvgk2Wnr/IMG-20250301-WA0016.jpg', // Replace with actual photo URL
    linkedin: 'https://www.linkedin.com/in/arindam-jaiman-6149a82ab/',
    github: 'https://github.com/arindamjaiman',
    description: 'Backend developer handling data management and API integration.'
  },
  {
    id: '4',
    name: 'Akhilesh Shukla',
    role: 'Developer',
    photo: 'https://i.ibb.co/1fbJs2hm/Whats-App-Image-2025-03-21-at-17-22-29-497c0eb4.jpg', // Replace with actual photo URL
    linkedin: 'https://www.linkedin.com/in/akhilesh-shukla-5b7283248/',
    github: 'https://github.com/Parthakhil2901',
    description: 'Full-stack developer specializing in feature implementation and testing.'
  }
];

export default function AboutScreen() {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleLinkPress = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Error opening URL:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>About Us</Text>
        <Text style={styles.headerSubtitle}>Meet the team behind Renauvate</Text>
      </View>

      <View style={styles.content}>
        <Card style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>Renauvate</Text>
          <Text style={styles.aboutText}>
            A comprehensive vehicle management application designed to enhance your Renault ownership experience. 
            Built with cutting-edge technology and attention to detail by our dedicated team.
          </Text>
        </Card>

        <Text style={styles.sectionTitle}>Development Team</Text>
        <View style={styles.teamGrid}>
          {teamMembers.map((member) => (
            <TouchableOpacity
              key={member.id}
              style={styles.memberCard}
              onPress={() => {
                setSelectedMember(member);
                setModalVisible(true);
              }}
            >
              <Image
                source={{ uri: member.photo }}
                style={styles.memberPhoto}
                defaultSource={require('../../assets/images/default-avatar.jpg')}
              />
              <Text style={styles.memberName}>{member.name}</Text>
              <Text style={styles.memberRole}>{member.role}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Card style={styles.modalContent}>
            {selectedMember && (
              <>
                <View style={styles.modalHeader}>
                  <Image
                    source={{ uri: selectedMember.photo }}
                    style={styles.modalPhoto}
                    defaultSource={require('../../assets/images/default-avatar.jpg')}
                  />
                  <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <MaterialCommunityIcons name="close" size={24} color="#222222" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.modalName}>{selectedMember.name}</Text>
                <Text style={styles.modalRole}>{selectedMember.role}</Text>
                <Text style={styles.modalDescription}>
                  {selectedMember.description}
                </Text>

                <View style={styles.socialLinks}>
                  {selectedMember.portfolio && (
                    <TouchableOpacity 
                      style={styles.socialButton}
                      onPress={() => handleLinkPress(selectedMember.portfolio!)}
                    >
                      <MaterialCommunityIcons name="web" size={24} color="#FFFFFF" />
                      <Text style={styles.socialButtonText}>Portfolio</Text>
                    </TouchableOpacity>
                  )}
                  
                  <TouchableOpacity 
                    style={styles.socialButton}
                    onPress={() => handleLinkPress(selectedMember.linkedin)}
                  >
                    <MaterialCommunityIcons name="linkedin" size={24} color="#FFFFFF" />
                    <Text style={styles.socialButtonText}>LinkedIn</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.socialButton}
                    onPress={() => handleLinkPress(selectedMember.github)}
                  >
                    <MaterialCommunityIcons name="github" size={24} color="#FFFFFF" />
                    <Text style={styles.socialButtonText}>GitHub</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Card>
        </View>
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
  content: {
    padding: 16,
  },
  aboutCard: {
    padding: 16,
    marginBottom: 24,
  },
  aboutTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 8,
  },
  aboutText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 16,
  },
  teamGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
  memberCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: (width - 48) / 2,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  memberPhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  memberName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222222',
    textAlign: 'center',
    marginBottom: 4,
  },
  memberRole: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 16,
  },
  modalContent: {
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  modalPhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  closeButton: {
    padding: 4,
  },
  modalName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 4,
  },
  modalRole: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 16,
  },
  modalDescription: {
    fontSize: 14,
    color: '#444444',
    lineHeight: 20,
    marginBottom: 24,
  },
  socialLinks: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#222222',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  socialButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
});