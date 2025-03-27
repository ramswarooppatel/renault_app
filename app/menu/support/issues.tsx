import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useToast } from '../../../lib/context/ToastContext';
import Card from '../../components/Card';
import Button from '../../components/Button';

interface Issue {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  priority: 'High' | 'Medium' | 'Low';
  dateCreated: string;
  lastUpdated: string;
}

const mockIssues: Issue[] = [
  {
    id: '1',
    title: 'Check Engine Light On',
    description: 'Check engine light came on while driving on highway',
    category: 'Engine',
    status: 'In Progress',
    priority: 'High',
    dateCreated: '2024-03-20',
    lastUpdated: '2024-03-21'
  },
  {
    id: '2',
    title: 'Unusual Noise When Braking',
    description: 'Squeaking noise when applying brakes',
    category: 'Brakes',
    status: 'Open',
    priority: 'Medium',
    dateCreated: '2024-03-19',
    lastUpdated: '2024-03-19'
  }
];

export default function IssuesScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const [issues, setIssues] = useState<Issue[]>(mockIssues);
  const [newIssueModalVisible, setNewIssueModalVisible] = useState(false);
  const [issueDetailsModalVisible, setIssueDetailsModalVisible] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(false);

  // New issue form state
  const [newIssue, setNewIssue] = useState({
    title: '',
    description: '',
    category: 'General',
    priority: 'Medium' as Issue['priority']
  });

  const handleCreateIssue = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const issue: Issue = {
        id: Date.now().toString(),
        ...newIssue,
        status: 'Open',
        dateCreated: new Date().toISOString().split('T')[0],
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      setIssues([issue, ...issues]);
      setNewIssueModalVisible(false);
      setNewIssue({ title: '', description: '', category: 'General', priority: 'Medium' });
      setLoading(false);
      showToast('Issue created successfully');
    }, 1000);
  };

  const getPriorityColor = (priority: Issue['priority']) => {
    switch (priority) {
      case 'High': return '#FF5722';
      case 'Medium': return '#FFC107';
      case 'Low': return '#4CAF50';
      default: return '#666666';
    }
  };

  const getStatusColor = (status: Issue['status']) => {
    switch (status) {
      case 'Open': return '#FF5722';
      case 'In Progress': return '#FFC107';
      case 'Resolved': return '#4CAF50';
      default: return '#666666';
    }
  };

  const renderIssueCard = (issue: Issue) => (
    <TouchableOpacity 
      key={issue.id}
      onPress={() => {
        setSelectedIssue(issue);
        setIssueDetailsModalVisible(true);
      }}
    >
      <Card style={styles.issueCard}>
        <View style={styles.issueHeader}>
          <View style={styles.issueHeaderLeft}>
            <Text style={styles.issueTitle}>{issue.title}</Text>
            <Text style={styles.issueCategory}>{issue.category}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(issue.status) }]}>
            <Text style={styles.statusText}>{issue.status}</Text>
          </View>
        </View>
        
        <Text style={styles.issueDescription} numberOfLines={2}>
          {issue.description}
        </Text>

        <View style={styles.issueFooter}>
          <View style={styles.priorityBadge}>
            <MaterialCommunityIcons 
              name="flag" 
              size={16} 
              color={getPriorityColor(issue.priority)} 
            />
            <Text style={[styles.priorityText, { color: getPriorityColor(issue.priority) }]}>
              {issue.priority}
            </Text>
          </View>
          <Text style={styles.dateText}>Last updated: {issue.lastUpdated}</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Issue Resolution</Text>
        <Text style={styles.headerSubtitle}>Report and track vehicle issues</Text>
      </View>

      <View style={styles.content}>
        <Button
          title="Report New Issue"
          onPress={() => setNewIssueModalVisible(true)}
          variant="default"
          icon="plus"
          style={styles.newIssueButton}
        />

        <ScrollView showsVerticalScrollIndicator={false}>
          {issues.map(renderIssueCard)}
        </ScrollView>
      </View>

      {/* New Issue Modal */}
      <Modal
        visible={newIssueModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setNewIssueModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Card style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Report New Issue</Text>
              <TouchableOpacity onPress={() => setNewIssueModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#222222" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm}>
              <Text style={styles.inputLabel}>Title</Text>
              <TextInput
                style={styles.input}
                value={newIssue.title}
                onChangeText={(text) => setNewIssue({ ...newIssue, title: text })}
                placeholder="Enter issue title"
                placeholderTextColor="#666666"
              />

              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={newIssue.description}
                onChangeText={(text) => setNewIssue({ ...newIssue, description: text })}
                placeholder="Describe the issue"
                placeholderTextColor="#666666"
                multiline
                numberOfLines={4}
              />

              <Text style={styles.inputLabel}>Category</Text>
              <View style={styles.categoryButtons}>
                {['Engine', 'Brakes', 'Electrical', 'General'].map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryButton,
                      newIssue.category === category && styles.categoryButtonActive
                    ]}
                    onPress={() => setNewIssue({ ...newIssue, category })}
                  >
                    <Text style={[
                      styles.categoryButtonText,
                      newIssue.category === category && styles.categoryButtonTextActive
                    ]}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>Priority</Text>
              <View style={styles.priorityButtons}>
                {(['High', 'Medium', 'Low'] as Issue['priority'][]).map((priority) => (
                  <TouchableOpacity
                    key={priority}
                    style={[
                      styles.priorityButton,
                      newIssue.priority === priority && styles.priorityButtonActive
                    ]}
                    onPress={() => setNewIssue({ ...newIssue, priority })}
                  >
                    <MaterialCommunityIcons 
                      name="flag" 
                      size={16} 
                      color={newIssue.priority === priority ? '#FFFFFF' : getPriorityColor(priority)} 
                    />
                    <Text style={[
                      styles.priorityButtonText,
                      newIssue.priority === priority && styles.priorityButtonTextActive
                    ]}>
                      {priority}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Button
                title={loading ? "Creating..." : "Submit Issue"}
                onPress={handleCreateIssue}
                variant="default"
                disabled={loading || !newIssue.title || !newIssue.description}
                style={styles.submitButton}
              >
                {loading && <ActivityIndicator color="#FFFFFF" style={styles.loader} />}
              </Button>
            </ScrollView>
          </Card>
        </View>
      </Modal>

      {/* Issue Details Modal */}
      <Modal
        visible={issueDetailsModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setIssueDetailsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Card style={styles.modalContent}>
            {selectedIssue && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Issue Details</Text>
                  <TouchableOpacity onPress={() => setIssueDetailsModalVisible(false)}>
                    <MaterialCommunityIcons name="close" size={24} color="#222222" />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.detailsContent}>
                  <View style={styles.detailsHeader}>
                    <Text style={styles.detailsTitle}>{selectedIssue.title}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedIssue.status) }]}>
                      <Text style={styles.statusText}>{selectedIssue.status}</Text>
                    </View>
                  </View>

                  <Text style={styles.detailsDescription}>{selectedIssue.description}</Text>

                  <View style={styles.detailsInfo}>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Category:</Text>
                      <Text style={styles.infoValue}>{selectedIssue.category}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Priority:</Text>
                      <View style={styles.priorityBadge}>
                        <MaterialCommunityIcons 
                          name="flag" 
                          size={16} 
                          color={getPriorityColor(selectedIssue.priority)} 
                        />
                        <Text style={[styles.priorityText, { color: getPriorityColor(selectedIssue.priority) }]}>
                          {selectedIssue.priority}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Created:</Text>
                      <Text style={styles.infoValue}>{selectedIssue.dateCreated}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Last Updated:</Text>
                      <Text style={styles.infoValue}>{selectedIssue.lastUpdated}</Text>
                    </View>
                  </View>
                </ScrollView>
              </>
            )}
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
  newIssueButton: {
    marginBottom: 16,
  },
  issueCard: {
    marginBottom: 12,
    padding: 16,
  },
  issueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  issueHeaderLeft: {
    flex: 1,
    marginRight: 8,
  },
  issueTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222222',
  },
  issueCategory: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  issueDescription: {
    fontSize: 14,
    color: '#444444',
    marginBottom: 12,
  },
  issueFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  dateText: {
    fontSize: 12,
    color: '#666666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 16,
  },
  modalContent: {
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222222',
  },
  modalForm: {
    padding: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    color: '#222222',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  categoryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  categoryButtonActive: {
    backgroundColor: '#222222',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#222222',
  },
  categoryButtonTextActive: {
    color: '#FFFFFF',
  },
  priorityButtons: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  priorityButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    gap: 4,
  },
  priorityButtonActive: {
    backgroundColor: '#222222',
  },
  priorityButtonText: {
    fontSize: 14,
    color: '#222222',
  },
  priorityButtonTextActive: {
    color: '#FFFFFF',
  },
  submitButton: {
    marginTop: 8,
  },
  loader: {
    marginLeft: 8,
  },
  detailsContent: {
    padding: 16,
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  detailsTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222222',
    marginRight: 8,
  },
  detailsDescription: {
    fontSize: 16,
    color: '#444444',
    lineHeight: 24,
    marginBottom: 16,
  },
  detailsInfo: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666666',
  },
  infoValue: {
    fontSize: 14,
    color: '#222222',
    fontWeight: '500',
  },
});