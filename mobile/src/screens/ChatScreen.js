import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { sendMessage, getMessages } from '../services/api';

const ChatScreen = ({ route, navigation }) => {
    const { user } = route.params;
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const flatListRef = useRef(null);

    useEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <View>
                    <Text style={styles.headerTitle}>Chat</Text>
                    <Text style={styles.headerSubtitle}>{user.nickname}</Text>
                </View>
            ),
            headerRight: () => (
                <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            ),
        });

        fetchMessages();
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, []);

    const fetchMessages = async () => {
        try {
            const data = await getMessages();
            setMessages(data);
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async () => {
        if (!inputText.trim() || sending) return;

        const messageText = inputText.trim();
        setInputText('');
        setSending(true);

        try {
            const newMessage = await sendMessage(user.id, messageText);
            setMessages(prev => [...prev, newMessage]);
            setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
        } catch (error) {
            console.error('Failed to send message:', error);
            Alert.alert('Error', 'Failed to send message. Please try again.');
            setInputText(messageText);
        } finally {
            setSending(false);
        }
    };

    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Logout', onPress: () => navigation.replace('Login') },
        ]);
    };

    const getSentimentEmoji = (sentiment) => {
        switch (sentiment?.toLowerCase()) {
            case 'positive': return '😊';
            case 'negative': return '😞';
            default: return '😐';
        }
    };

    const getSentimentColors = (sentiment) => {
        switch (sentiment?.toLowerCase()) {
            case 'positive':
                return { bg: '#DCFCE7', text: '#16A34A' };
            case 'negative':
                return { bg: '#FEE2E2', text: '#DC2626' };
            default:
                return { bg: '#F3F4F6', text: '#6B7280' };
        }
    };

    const renderMessage = ({ item }) => {
        const isOwn = item.userId === user.id;
        const sentimentColors = getSentimentColors(item.sentiment);

        return (
            <View style={[styles.messageContainer, isOwn && styles.ownMessageContainer]}>
                {!isOwn && <Text style={styles.nickname}>{item.nickname}</Text>}

                <View style={[styles.messageBubble, isOwn ? styles.ownBubble : styles.otherBubble]}>
                    <Text style={[styles.messageText, isOwn && styles.ownMessageText]}>
                        {item.content}
                    </Text>

                    <View style={styles.sentimentContainer}>
                        <View style={[styles.sentimentBadge, { backgroundColor: sentimentColors.bg }]}>
                            <Text style={[styles.sentimentText, { color: sentimentColors.text }]}>
                                {getSentimentEmoji(item.sentiment)} {item.sentiment}
                            </Text>
                        </View>
                        <Text style={[styles.score, isOwn && styles.ownScore]}>
                            {(item.sentimentScore * 100).toFixed(0)}%
                        </Text>
                    </View>
                </View>

                <Text style={[styles.timestamp, isOwn && styles.ownTimestamp]}>
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
            </View>
        );
    };

    const sortedMessages = [...messages].sort((a, b) =>
        new Date(a.timestamp) - new Date(b.timestamp)
    );

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <View style={styles.loadingSpinner} />
                <Text style={styles.loadingText}>Loading messages...</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.container}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            <FlatList
                ref={flatListRef}
                data={sortedMessages}
                renderItem={renderMessage}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.messagesList}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyEmoji}>💬</Text>
                        <Text style={styles.emptyText}>No messages yet</Text>
                        <Text style={styles.emptySubtext}>Start the conversation!</Text>
                    </View>
                }
            />

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Type a message..."
                    placeholderTextColor="#9CA3AF"
                    multiline
                    maxLength={1000}
                    editable={!sending}
                />
                <TouchableOpacity
                    style={[styles.sendButton, (!inputText.trim() || sending) && styles.sendButtonDisabled]}
                    onPress={handleSend}
                    disabled={!inputText.trim() || sending}
                    activeOpacity={0.8}
                >
                    {sending ? (
                        <ActivityIndicator color="#fff" size="small" />
                    ) : (
                        <Text style={styles.sendButtonText}>Send</Text>
                    )}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    loadingSpinner: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 3,
        borderColor: '#E5E7EB',
        borderTopColor: '#111827',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 14,
        color: '#6B7280',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#6B7280',
    },
    logoutButton: {
        marginRight: 16,
    },
    logoutText: {
        color: '#6B7280',
        fontSize: 14,
    },
    messagesList: {
        padding: 16,
        paddingBottom: 8,
    },
    messageContainer: {
        marginBottom: 24,
        maxWidth: '80%',
    },
    ownMessageContainer: {
        alignSelf: 'flex-end',
        alignItems: 'flex-end',
    },
    nickname: {
        fontSize: 12,
        fontWeight: '500',
        color: '#6B7280',
        marginBottom: 4,
        marginLeft: 4,
    },
    messageBubble: {
        borderRadius: 16,
        padding: 12,
        maxWidth: '100%',
    },
    ownBubble: {
        backgroundColor: '#111827',
    },
    otherBubble: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    messageText: {
        fontSize: 15,
        lineHeight: 20,
        color: '#111827',
    },
    ownMessageText: {
        color: '#fff',
    },
    sentimentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        gap: 8,
    },
    sentimentBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    sentimentText: {
        fontSize: 12,
        fontWeight: '500',
    },
    score: {
        fontSize: 12,
        color: '#6B7280',
    },
    ownScore: {
        color: '#9CA3AF',
    },
    timestamp: {
        fontSize: 11,
        color: '#9CA3AF',
        marginTop: 4,
        marginLeft: 4,
    },
    ownTimestamp: {
        textAlign: 'right',
        marginRight: 4,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 64,
    },
    emptyEmoji: {
        fontSize: 48,
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 4,
    },
    emptySubtext: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        gap: 12,
    },
    input: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: '#111827',
        maxHeight: 100,
    },
    sendButton: {
        backgroundColor: '#111827',
        borderRadius: 12,
        paddingHorizontal: 24,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 70,
    },
    sendButtonDisabled: {
        opacity: 0.5,
    },
    sendButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ChatScreen;