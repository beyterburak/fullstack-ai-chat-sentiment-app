import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { registerUser } from '../services/api';

const LoginScreen = ({ navigation }) => {
    const [nickname, setNickname] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!nickname.trim()) {
            setError('Please enter a nickname');
            return;
        }

        if (nickname.length < 3) {
            setError('Nickname must be at least 3 characters');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const user = await registerUser(nickname.trim());
            navigation.replace('Chat', { user });
        } catch (err) {
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('Failed to register. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.content}>
                {/* Logo & Title */}
                <View style={styles.header}>
                    <View style={styles.logo}>
                        <Text style={styles.logoEmoji}>💬</Text>
                    </View>
                    <Text style={styles.title}>Welcome to AI Chat</Text>
                    <Text style={styles.subtitle}>Real-time sentiment analysis</Text>
                </View>

                {/* Form */}
                <View style={styles.form}>
                    <Text style={styles.label}>Nickname</Text>
                    <TextInput
                        style={styles.input}
                        value={nickname}
                        onChangeText={setNickname}
                        placeholder="Enter your nickname"
                        placeholderTextColor="#9CA3AF"
                        maxLength={50}
                        autoCapitalize="none"
                        autoCorrect={false}
                        editable={!loading}
                        autoFocus
                    />

                    {error && (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    )}

                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleSubmit}
                        disabled={loading}
                        activeOpacity={0.8}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Join Chat</Text>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Footer */}
                <Text style={styles.footer}>
                    Your messages will be analyzed for sentiment
                </Text>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 48,
    },
    logo: {
        width: 64,
        height: 64,
        backgroundColor: '#111827',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    logoEmoji: {
        fontSize: 32,
    },
    title: {
        fontSize: 28,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
    },
    form: {
        marginBottom: 32,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#111827',
        marginBottom: 20,
    },
    errorContainer: {
        backgroundColor: '#FEF2F2',
        borderWidth: 1,
        borderColor: '#FCA5A5',
        borderRadius: 12,
        padding: 12,
        marginBottom: 20,
    },
    errorText: {
        color: '#DC2626',
        fontSize: 14,
    },
    button: {
        backgroundColor: '#111827',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    footer: {
        textAlign: 'center',
        fontSize: 14,
        color: '#9CA3AF',
    },
});

export default LoginScreen;