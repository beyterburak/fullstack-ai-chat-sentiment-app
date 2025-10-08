// src/components/MessageItem.jsx
import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * Optimized message item component using React.memo
 * Prevents unnecessary re-renders for better performance
 */

const MessageItem = memo(({ item, isOwn, getSentimentEmoji, getSentimentColors }) => {
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
        {new Date(item.timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Text>
    </View>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for memo
  return (
    prevProps.item.id === nextProps.item.id &&
    prevProps.item.sentiment === nextProps.item.sentiment &&
    prevProps.isOwn === nextProps.isOwn
  );
});

const styles = StyleSheet.create({
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
});

export default MessageItem;