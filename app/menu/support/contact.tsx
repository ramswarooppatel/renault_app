import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Linking
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useToast } from '../../../lib/context/ToastContext';
import Card from '../../components/Card';
import Button from '../../components/Button';

interface ContactMethod {
  id: string;
  title: string;
  description: string;
  icon: string;
  action: string;
  value: string;
}

const contactMethods: ContactMethod[] = [
  {
    id: 'phone',
    title: 'Customer Care',
    description: 'Available 24/7 for urgent assistance',
    icon: 'phone',
    action: 'Call',
    value: '+1-800-RENAULT'
  },
  {
    id: 'email',
    title: 'Email Support',
    description: 'Response within 24 hours',
    icon: 'email',
    action: 'Email',
    value: 'support@renault.com'
  },
  {
    id: 'whatsapp',
    title: 'WhatsApp',
    description: 'Chat with our support team',
    icon: 'whatsapp',
    action: 'Chat',
    value: '+1-800-RENAULT'
  }
];

export default function ContactScreen() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.subject || !form.message) {
      showToast('Please fill in all fields');
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      showToast('Message sent successfully');
      setForm({ name: '', email: '', subject: '', message: '' });
    }, 2000);
  };

  const handleContactMethod = async (method: ContactMethod) => {
    try {
      switch (method.id) {
        case 'phone':
          await Linking.openURL(`tel:${method.value}`);
          break;
        case 'email':
          await Linking.openURL(`mailto:${method.value}`);
          break;
        case 'whatsapp':
          await Linking.openURL(`whatsapp://send?phone=${method.value}`);
          break;
      }
    } catch (error) {
      showToast('Could not open the application');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Contact Support</Text>
        <Text style={styles.headerSubtitle}>We're here to help you</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Quick Contact</Text>
        <View style={styles.contactMethods}>
          {contactMethods.map((method) => (
            <Card key={method.id} style={styles.contactCard}>
              <View style={styles.contactCardContent}>
                <MaterialCommunityIcons name={method.icon as any} size={24} color="#FFCC00" />
                <View style={styles.contactInfo}>
                  <Text style={styles.contactTitle}>{method.title}</Text>
                  <Text style={styles.contactDescription}>{method.description}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.contactButton}
                  onPress={() => handleContactMethod(method)}
                >
                  <Text style={styles.contactButtonText}>{method.action}</Text>
                </TouchableOpacity>
              </View>
            </Card>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Send Message</Text>
        <Card style={styles.formCard}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={form.name}
              onChangeText={(text) => setForm({ ...form, name: text })}
              placeholder="Enter your name"
              placeholderTextColor="#666666"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={form.email}
              onChangeText={(text) => setForm({ ...form, email: text })}
              placeholder="Enter your email"
              placeholderTextColor="#666666"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Subject</Text>
            <TextInput
              style={styles.input}
              value={form.subject}
              onChangeText={(text) => setForm({ ...form, subject: text })}
              placeholder="Enter subject"
              placeholderTextColor="#666666"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Message</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={form.message}
              onChangeText={(text) => setForm({ ...form, message: text })}
              placeholder="Type your message here"
              placeholderTextColor="#666666"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <Button
            title={loading ? "Sending..." : "Send Message"}
            onPress={handleSubmit}
            variant="default"
            disabled={loading}
            style={styles.submitButton}
          >
            {loading && <ActivityIndicator color="#FFFFFF" style={styles.loader} />}
          </Button>
        </Card>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 16,
  },
  contactMethods: {
    marginBottom: 24,
  },
  contactCard: {
    marginBottom: 12,
    padding: 16,
  },
  contactCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactInfo: {
    flex: 1,
    marginLeft: 12,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222222',
  },
  contactDescription: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  contactButton: {
    backgroundColor: '#222222',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  contactButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  formCard: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#222222',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    marginTop: 8,
  },
  loader: {
    marginLeft: 8,
  },
});