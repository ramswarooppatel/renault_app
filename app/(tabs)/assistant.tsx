import React, { useState, useRef, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useVehicle } from '../../lib/hooks/useVehicle';
import { useToast } from '../../lib/context/ToastContext';
import {
View, 
Text, 
StyleSheet, 
ScrollView, 
TextInput, 
TouchableOpacity, 
Dimensions,
ActivityIndicator,
Animated,
SafeAreaView,
KeyboardAvoidingView,
Platform
} from 'react-native';

// Define MessageType interface
type MessageType = {
id: string;
text: string;
sender: "user" | "bot";
timestamp: Date;
};

// Mock data for demonstration (you would import these from data files)
const chatbotResponses = {
greeting: "Hello! I'm your Renault Smart Fueling Assistant. How can I help you today?",
farewell: "Thank you for using Renault Smart Assistant. Have a great day!",
suggestions: [
    "Battery issues",
    "Engine not starting",
    "Low fuel efficiency",
    "Warning lights",
    "Service schedule"
],
serviceLocations: [
    {
        name: "Renault Chennai Central",
        address: "123 Anna Salai, Chennai 600002",
        phone: "+91 44 1234 5678",
        hours: "Mon-Sat: 9AM-6PM",
        services: ["Maintenance", "Repairs", "Parts"]
    },
    {
        name: "Renault T Nagar Service",
        address: "456 Usman Road, T Nagar, Chennai 600017",
        phone: "+91 44 8765 4321",
        hours: "Mon-Sat: 8AM-8PM, Sun: 10AM-2PM",
        services: ["Express Service", "Battery Replacement", "Diagnostics"]
    }
]
};

const commonIssues = [
{
    id: "1",
    issue: "Battery not charging",
    severity: "High",
    possibleCauses: ["Faulty charging port", "Battery degradation", "Electrical system issue"],
    solutions: ["Check charging cable", "Inspect port for damage", "Schedule battery diagnostic"]
},
{
    id: "2",
    issue: "Warning light on dashboard",
    severity: "Medium",
    possibleCauses: ["Low fluid levels", "Sensor malfunction", "Emissions system issue"],
    solutions: ["Identify specific warning", "Check fluid levels", "Use diagnostic tool"]
},
{
    id: "3",
    issue: "Poor fuel economy",
    severity: "Low",
    possibleCauses: ["Tire pressure", "Driving habits", "Air filter clogged"],
    solutions: ["Check tire pressure", "Adjust driving style", "Replace air filter"]
}
];

const LoadingScreen = () => (
<View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#FFCC00" />
    <Text style={styles.loadingText}>Loading Smart Assistant...</Text>
</View>
);

export default function AssistantScreen() {
const [messages, setMessages] = useState<MessageType[]>([
    {
        id: "initial",
        text: chatbotResponses.greeting,
        sender: "bot",
        timestamp: new Date(),
    },
]);
const [inputMessage, setInputMessage] = useState("");
const [isTyping, setIsTyping] = useState(false);
const [searchQuery, setSearchQuery] = useState("");
const [showIssueList, setShowIssueList] = useState(false);
const scrollViewRef = useRef<ScrollView>(null);
const inputRef = useRef<TextInput>(null);
const { showToast } = useToast();
const [isLoading, setIsLoading] = useState(true);

// Animated values for typing indicators
const typingDot1 = useRef(new Animated.Value(0)).current;
const typingDot2 = useRef(new Animated.Value(0)).current;
const typingDot3 = useRef(new Animated.Value(0)).current;

// Filter issues based on search query
const filteredIssues = commonIssues.filter(
    (issue) =>
        issue.issue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.possibleCauses.some((cause) =>
            cause.toLowerCase().includes(searchQuery.toLowerCase())
        )
);

// Loading timer effect
useEffect(() => {
    const timer = setTimeout(() => {
        setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
}, []);

// Scroll to bottom of messages
useEffect(() => {
    if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true });
    }
}, [messages]);

// Animate typing dots
useEffect(() => {
    if (isTyping) {
        const createAnimation = (value: Animated.Value, delay: number) => {
            return Animated.loop(
                Animated.sequence([
                    Animated.timing(value, {
                        toValue: -5,
                        duration: 400,
                        delay,
                        useNativeDriver: true,
                    }),
                    Animated.timing(value, {
                        toValue: 0,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                ])
            );
        };

        const animation1 = createAnimation(typingDot1, 0);
        const animation2 = createAnimation(typingDot2, 200);
        const animation3 = createAnimation(typingDot3, 400);

        animation1.start();
        animation2.start();
        animation3.start();

        return () => {
            animation1.stop();
            animation2.stop();
            animation3.stop();
        };
    }
}, [isTyping]);

const handleSendMessage = () => {
    if (inputMessage.trim() === "") return;

    // Add user message
    const userMessageId = Date.now().toString();
    const userMessage = {
        id: userMessageId,
        text: inputMessage,
        sender: "user" as const,
        timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate bot processing
    setTimeout(() => {
        generateBotResponse(inputMessage);
        setIsTyping(false);
    }, 1000 + Math.random() * 1000);
};

const generateBotResponse = (userInput: string) => {
    const lowerInput = userInput.toLowerCase();
    let botResponse = "";

    // Check if input matches any common issues
    const matchedIssue = commonIssues.find(
        (issue) => lowerInput.includes(issue.issue.toLowerCase())
    );

    if (matchedIssue) {
        botResponse = `I see you're having an issue with "${matchedIssue.issue}". This is a ${matchedIssue.severity.toLowerCase()} severity issue.\n\nPossible causes:\n${matchedIssue.possibleCauses.map(cause => `• ${cause}`).join('\n')}\n\nRecommended solutions:\n${matchedIssue.solutions.map(solution => `• ${solution}`).join('\n')}\n\nWould you like to schedule a service appointment for this issue?`;
    } 
    // Check for service location queries
    else if (lowerInput.includes("service") || lowerInput.includes("location") || lowerInput.includes("center") || lowerInput.includes("nearby")) {
        const locations = chatbotResponses.serviceLocations;
        botResponse = `Here are Renault service centers in Chennai:\n\n${locations.map(loc => 
            `🔧 ${loc.name}\nAddress: ${loc.address}\nPhone: ${loc.phone}\nHours: ${loc.hours}\nServices: ${loc.services.join(', ')}`
        ).join('\n\n')}\n\nWould you like me to help you schedule an appointment?`;
    }
    // Check for greetings
    else if (lowerInput.includes("hello") || lowerInput.includes("hi") || lowerInput === "hey") {
        botResponse = "Hello! I'm your Renault Smart Fueling Assistant. How can I help you today?";
    }
    // Check for thanks
    else if (lowerInput.includes("thank") || lowerInput.includes("thanks")) {
        botResponse = "You're welcome! Is there anything else I can help you with?";
    }
    // Check for goodbye
    else if (lowerInput.includes("bye") || lowerInput.includes("goodbye")) {
        botResponse = chatbotResponses.farewell;
    }
    // Default response if no matches
    else {
        botResponse = `I'm not sure I understand your query about "${userInput}". Would you like to know about:\n\n${chatbotResponses.suggestions.map(suggestion => `• ${suggestion}`).join('\n')}`;
    }

    // Add bot response to messages
    setMessages((prev) => [
        ...prev,
        {
            id: Date.now().toString(),
            text: botResponse,
            sender: "bot",
            timestamp: new Date(),
        },
    ]);
};

const handleIssueSelect = (issue: typeof commonIssues[0]) => {
    setInputMessage(`I'm having an issue with ${issue.issue}`);
    setShowIssueList(false);
    if (inputRef.current) {
        inputRef.current.focus();
    }
};

const handleFeedback = (positive: boolean) => {
    showToast(positive ? "Thanks for your feedback!" : "We'll improve our responses");
};

const handleScheduleService = () => {
    showToast("Scheduling system will be available in the next update.");
};

const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

if (isLoading) {
    return <LoadingScreen />;
}

return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.headerSubtitle}>ISSUE RESOLUTION</Text>
            <Text style={styles.headerTitle}>Renault Smart Assistant</Text>
            <Text style={styles.headerDescription}>
                Chat with our virtual assistant to resolve issues with your vehicle
            </Text>
        </View>

        <View style={styles.tabButtons}>
            <TouchableOpacity 
                style={[styles.tabButton, !showIssueList && styles.activeTabButton]} 
                onPress={() => setShowIssueList(false)}>
                <Ionicons name="chatbubble-outline" size={20} color={!showIssueList ? "#FFCC00" : "#777"} />
                <Text style={[styles.tabButtonText, !showIssueList && styles.activeTabButtonText]}>Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={[styles.tabButton, showIssueList && styles.activeTabButton]} 
                onPress={() => setShowIssueList(true)}>
                <Ionicons name="warning-outline" size={20} color={showIssueList ? "#FFCC00" : "#777"} />
                <Text style={[styles.tabButtonText, showIssueList && styles.activeTabButtonText]}>Common Issues</Text>
            </TouchableOpacity>
        </View>

        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.contentContainer}
            keyboardVerticalOffset={100}>
            
            {showIssueList ? (
                <View style={styles.issuesContainer}>
                    <View style={styles.searchContainer}>
                        <Ionicons name="search" size={18} color="#777" style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search issues..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                    
                    <ScrollView style={styles.issuesList}>
                        {filteredIssues.length > 0 ? (
                            filteredIssues.map((issue) => (
                                <TouchableOpacity
                                    key={issue.id}
                                    style={styles.issueItem}
                                    onPress={() => handleIssueSelect(issue)}
                                >
                                    <View style={styles.issueHeader}>
                                        <Text style={styles.issueTitle}>{issue.issue}</Text>
                                        <View style={[
                                            styles.severityBadge,
                                            issue.severity === "High" 
                                                ? styles.highSeverity 
                                                : issue.severity === "Medium"
                                                    ? styles.mediumSeverity
                                                    : styles.lowSeverity
                                        ]}>
                                            <Text style={styles.severityText}>{issue.severity}</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.issueCause} numberOfLines={2}>
                                        {issue.possibleCauses[0]}
                                        {issue.possibleCauses.length > 1 ? ", ..." : ""}
                                    </Text>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <View style={styles.noResultsContainer}>
                                <Text style={styles.noResultsText}>No issues found matching "{searchQuery}"</Text>
                                <TouchableOpacity onPress={() => setSearchQuery("")}>
                                    <Text style={styles.clearSearchText}>Clear Search</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </ScrollView>
                    
                    <View style={styles.quickLinks}>
                        <Text style={styles.quickLinksTitle}>Quick Links</Text>
                        <View style={styles.quickLinksButtons}>
                            <TouchableOpacity 
                                style={styles.quickLinkButton}
                                onPress={handleScheduleService}
                            >
                                <Ionicons name="time-outline" size={16} color="#333" />
                                <Text style={styles.quickLinkText}>Schedule Service</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                style={styles.quickLinkButton}
                                onPress={() => {
                                    showToast("Showing nearby Renault service centers");
                                    setInputMessage("Show me nearby service centers");
                                    setShowIssueList(false);
                                    setTimeout(() => handleSendMessage(), 100);
                                }}
                            >
                                <Ionicons name="location-outline" size={16} color="#333" />
                                <Text style={styles.quickLinkText}>Find Service Centers</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            ) : (
                <View style={styles.chatContainer}>
                    <View style={styles.chatHeader}>
                        <View style={styles.avatarContainer}>
                            <Ionicons name="chatbubble" size={20} color="#FFF" />
                        </View>
                        <View style={styles.chatHeaderInfo}>
                            <Text style={styles.chatHeaderTitle}>Renault Smart Assistant</Text>
                            <View style={styles.onlineIndicator}>
                                <View style={styles.onlineDot} />
                                <Text style={styles.onlineText}>Online</Text>
                            </View>
                        </View>
                    </View>

                    <ScrollView 
                        ref={scrollViewRef}
                        style={styles.messagesContainer}
                        contentContainerStyle={styles.messagesContent}
                    >
                        {messages.map((message) => (
                            <View
                                key={message.id}
                                style={[
                                    styles.messageRow,
                                    message.sender === "user" ? styles.userMessageRow : styles.botMessageRow
                                ]}
                            >
                                <View
                                    style={[
                                        styles.messageBubble,
                                        message.sender === "user" ? styles.userBubble : styles.botBubble
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.messageText,
                                            message.sender === "user" ? styles.userMessageText : styles.botMessageText
                                        ]}
                                    >
                                        {message.text}
                                    </Text>
                                    <View style={styles.messageFooter}>
                                        <Text
                                            style={[
                                                styles.messageTime,
                                                message.sender === "user" ? styles.userMessageTime : styles.botMessageTime
                                            ]}
                                        >
                                            {formatTime(message.timestamp)}
                                        </Text>
                                        
                                        {message.sender === "bot" && (
                                            <View style={styles.feedbackButtons}>
                                                <TouchableOpacity 
                                                    style={styles.feedbackButton}
                                                    onPress={() => handleFeedback(true)}
                                                >
                                                    <Ionicons name="thumbs-up-outline" size={12} color="#777" />
                                                </TouchableOpacity>
                                                <TouchableOpacity 
                                                    style={styles.feedbackButton}
                                                    onPress={() => handleFeedback(false)}
                                                >
                                                    <Ionicons name="thumbs-down-outline" size={12} color="#777" />
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                    </View>
                                </View>
                            </View>
                        ))}

                        {isTyping && (
                            <View style={styles.botMessageRow}>
                                <View style={styles.typingContainer}>
                                    <Animated.View 
                                        style={[styles.typingDot, {transform: [{translateY: typingDot1}]}]}
                                    />
                                    <Animated.View 
                                        style={[styles.typingDot, {transform: [{translateY: typingDot2}]}]}
                                    />
                                    <Animated.View 
                                        style={[styles.typingDot, {transform: [{translateY: typingDot3}]}]}
                                    />
                                </View>
                            </View>
                        )}
                    </ScrollView>

                    <View style={styles.inputContainer}>
                        <TextInput
                            ref={inputRef}
                            style={styles.textInput}
                            placeholder="Type your message..."
                            value={inputMessage}
                            onChangeText={setInputMessage}
                            returnKeyType="send"
                            onSubmitEditing={handleSendMessage}
                        />
                        <TouchableOpacity
                            style={[
                                styles.sendButton,
                                inputMessage.trim() === "" ? styles.sendButtonDisabled : {}
                            ]}
                            onPress={handleSendMessage}
                            disabled={inputMessage.trim() === ""}
                        >
                            <Ionicons name="send" size={18} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                    
                    <View style={styles.suggestionContainer}>
                        {chatbotResponses.suggestions.slice(0, 3).map((suggestion, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.suggestionChip}
                                onPress={() => {
                                    setInputMessage(suggestion);
                                    setTimeout(() => handleSendMessage(), 100);
                                }}
                            >
                                <Text style={styles.suggestionText}>{suggestion}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            )}
        </KeyboardAvoidingView>
    </SafeAreaView>
);
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
},
loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
},
loadingText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 16,
    color: '#333',
},
header: {
    padding: 16,
    paddingTop: 10,
    alignItems: 'center',
},
headerSubtitle: {
    color: '#FFCC00',
    fontWeight: '500',
    marginBottom: 8,
    fontSize: 12,
},
headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
},
headerDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
},
tabButtons: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
},
tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 4,
},
activeTabButton: {
    backgroundColor: 'rgba(255, 204, 0, 0.1)',
},
tabButtonText: {
    marginLeft: 4,
    color: '#777',
    fontWeight: '500',
},
activeTabButtonText: {
    color: '#FFCC00',
},
contentContainer: {
    flex: 1,
    marginHorizontal: 16,
},
// Issues tab styles
issuesContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
},
searchContainer: {
    position: 'relative',
    marginBottom: 16,
},
searchIcon: {
    position: 'absolute',
    left: 10,
    top: 12,
    zIndex: 1,
},
searchInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingVertical: 10,
    paddingLeft: 36,
    paddingRight: 10,
    fontSize: 14,
},
issuesList: {
    flex: 1,
    marginBottom: 16,
},
issueItem: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
},
issueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
},
issueTitle: {
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
},
severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
},
highSeverity: {
    backgroundColor: '#FFEBEE',
},
mediumSeverity: {
    backgroundColor: '#FFF8E1',
},
lowSeverity: {
    backgroundColor: '#E8F5E9',
},
severityText: {
    fontSize: 10,
    fontWeight: '500',
},
issueCause: {
    fontSize: 12,
    color: '#666',
},
noResultsContainer: {
    alignItems: 'center',
    padding: 16,
},
noResultsText: {
    color: '#666',
    marginBottom: 8,
},
clearSearchText: {
    color: '#FFCC00',
    fontWeight: '500',
},
quickLinks: {
    marginTop: 8,
},
quickLinksTitle: {
    fontWeight: '500',
    marginBottom: 8,
    fontSize: 16,
},
quickLinksButtons: {
    gap: 8,
},
quickLinkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEE',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
},
quickLinkText: {
    marginLeft: 8,
    color: '#333',
    fontSize: 14,
},
// Chat tab styles
chatContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
},
chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
},
avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFCC00',
    justifyContent: 'center',
    alignItems: 'center',
},
chatHeaderInfo: {
    marginLeft: 12,
},
chatHeaderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
},
onlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
},
onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4CAF50',
    marginRight: 6,
},
onlineText: {
    fontSize: 12,
    color: '#666',
},
messagesContainer: {
    flex: 1,
},
messagesContent: {
    padding: 16,
},
messageRow: {
    marginBottom: 12,
},
userMessageRow: {
    alignItems: 'flex-end',
},
botMessageRow: {
    alignItems: 'flex-start',
},
messageBubble: {
    maxWidth: '80%',
    borderRadius: 16,
    padding: 12,
},
userBubble: {
    backgroundColor: '#FFCC00',
},
botBubble: {
    backgroundColor: '#F0F0F0',
},
messageText: {
    fontSize: 14,
    lineHeight: 20,
},
userMessageText: {
    color: '#FFF',
},
botMessageText: {
    color: '#222',
},
messageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
},
messageTime: {
    fontSize: 10,
},
userMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
},
botMessageTime: {
    color: '#999',
},
feedbackButtons: {
    flexDirection: 'row',
},
feedbackButton: {
    padding: 4,
    marginLeft: 4,
},
typingContainer: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 16,
    padding: 12,
    width: 60,
    justifyContent: 'center',
},
typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#999',
    marginHorizontal: 2,
},
inputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
},
textInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    fontSize: 14,
},
sendButton: {
    width: 40,
    height: 40,
    backgroundColor: '#FFCC00',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
},
sendButtonDisabled: {
    backgroundColor: '#DDDDDD',
},
suggestionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    paddingTop: 4,
    gap: 8,
},
suggestionChip: {
    borderWidth: 1,
    borderColor: '#EEE',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
},
suggestionText: {
    fontSize: 12,
    color: '#666',
},
});