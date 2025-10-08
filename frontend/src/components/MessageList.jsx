import { useEffect, useRef } from 'react';

function MessageList({ messages, currentUserId }) {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const getSentimentEmoji = (sentiment) => {
        switch (sentiment.toLowerCase()) {
            case 'positive': return '😊';
            case 'negative': return '😞';
            default: return '😐';
        }
    };

    const getSentimentColor = (sentiment) => {
        switch (sentiment.toLowerCase()) {
            case 'positive': return 'text-green-600 bg-green-50';
            case 'negative': return 'text-red-600 bg-red-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    if (messages.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-400">
                    <p className="text-4xl mb-3">💬</p>
                    <p className="text-sm">No messages yet</p>
                    <p className="text-xs mt-1">Start the conversation!</p>
                </div>
            </div>
        );
    }

    const sortedMessages = [...messages].sort((a, b) =>
        new Date(a.timestamp) - new Date(b.timestamp)
    );

    return (
        <div className="h-full overflow-y-auto">
            <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">
                {sortedMessages.map((message) => {
                    const isOwn = message.userId === currentUserId;

                    return (
                        <div
                            key={message.id}
                            className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-md ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
                                {/* Nickname */}
                                {!isOwn && (
                                    <div className="text-xs font-medium text-gray-500 mb-1 px-1">
                                        {message.nickname}
                                    </div>
                                )}

                                {/* Message */}
                                <div
                                    className={`
                    px-4 py-3 rounded-2xl
                    ${isOwn
                                            ? 'bg-gray-900 text-white'
                                            : 'bg-white text-gray-900 border border-gray-200'
                                        }
                  `}
                                >
                                    <p className="text-sm leading-relaxed">{message.content}</p>

                                    {/* Sentiment */}
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className={`
                      inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium
                      ${getSentimentColor(message.sentiment)}
                    `}>
                                            <span>{getSentimentEmoji(message.sentiment)}</span>
                                            <span>{message.sentiment}</span>
                                        </span>
                                        <span className={`text-xs ${isOwn ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {(message.sentimentScore * 100).toFixed(0)}%
                                        </span>
                                    </div>
                                </div>

                                {/* Time */}
                                <div className={`text-xs text-gray-400 mt-1 px-1`}>
                                    {new Date(message.timestamp).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
}

export default MessageList;