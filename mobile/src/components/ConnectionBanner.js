// src/components/ConnectionBanner.js
import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

/**
 * Connection status banner component
 * Shows online/offline status and Render cold start warnings
 */

const ConnectionBanner = ({ isOnline, isLoading }) => {
  if (isOnline && !isLoading) return null;

  return (
    <View style={[
      styles.banner,
      !isOnline && styles.offline,
      isLoading && styles.loading
    ]}>
      <Text style={styles.text}>
        {!isOnline && '📡 You are offline. Messages will sync when reconnected.'}
        {isLoading && '⏳ Connecting to server... (Render cold start may take 30-60s)'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  offline: {
    backgroundColor: '#FEE2E2',
  },
  loading: {
    backgroundColor: '#FEF3C7',
  },
  text: {
    fontSize: 12,
    color: '#111827',
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default ConnectionBanner;