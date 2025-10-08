// src/hooks/useOfflineSupport.js
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

/**
 * Custom hook for offline support and data caching
 * Persists messages locally and syncs when online
 */

const STORAGE_KEY = '@chat_messages_cache';

export const useOfflineSupport = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [cachedMessages, setCachedMessages] = useState([]);

  useEffect(() => {
    // Monitor network connection
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected);
    });

    // Load cached messages on mount
    loadCachedMessages();

    return () => unsubscribe();
  }, []);

  const loadCachedMessages = async () => {
    try {
      const cached = await AsyncStorage.getItem(STORAGE_KEY);
      if (cached) {
        setCachedMessages(JSON.parse(cached));
      }
    } catch (error) {
      console.error('Failed to load cached messages:', error);
    }
  };

  const cacheMessages = async (messages) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      setCachedMessages(messages);
    } catch (error) {
      console.error('Failed to cache messages:', error);
    }
  };

  const clearCache = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setCachedMessages([]);
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  };

  return {
    isOnline,
    cachedMessages,
    cacheMessages,
    clearCache,
    loadCachedMessages,
  };
};