import { useState, useEffect } from 'react';
import { sendMessage, getMessages } from '../services/api';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

function ChatRoom({ user, onLogout }) {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    useEffect(() => {
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

    const handleSendMessage = async (content) => {
        if (!content.trim()) return;

        setSending(true);
        try {
            const newMessage = await sendMessage(user.id, content);
            setMessages(prev => [...prev, newMessage]);
        } catch (error) {
            console.error('Failed to send message:', error);
            alert('Failed to send message. Please try again.');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-white">
            {/* Header - Minimal */}
            <header className="border-b border-gray-200 bg-white">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-xl">
                            💬
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold text-gray-900">Chat</h1>
                            <p className="text-sm text-gray-500">{user.nickname}</p>
                        </div>
                    </div>

                    <button
                        onClick={onLogout}
                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-hidden bg-gray-50">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-500 text-sm">Loading messages...</p>
                        </div>
                    </div>
                ) : (
                    <MessageList messages={messages} currentUserId={user.id} />
                )}
            </div>

            {/* Input */}
            <MessageInput onSend={handleSendMessage} disabled={sending} />
        </div>
    );
}

export default ChatRoom;