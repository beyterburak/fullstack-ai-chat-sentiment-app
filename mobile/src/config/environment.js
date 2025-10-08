// src/config/environment.js

/**
 * Environment configuration for different deployment stages
 * Handles API endpoints, timeouts, and feature flags
 */

const ENV = {
  development: {
    apiUrl: 'http://10.0.2.2:7211/api', // Android emulator localhost
    // apiUrl: 'http://localhost:7211/api', // iOS simulator
    wsUrl: 'ws://10.0.2.2:7211/chat',
    timeout: 10000,
    pollingInterval: 3000,
    enableLogs: true,
  },
  staging: {
    apiUrl: 'https://your-staging.onrender.com/api',
    wsUrl: 'wss://your-staging.onrender.com/chat',
    timeout: 15000,
    pollingInterval: 5000,
    enableLogs: true,
  },
  production: {
    apiUrl: 'https://fullstack-ai-chat-sentiment-app.onrender.com/api',
    wsUrl: 'wss://fullstack-ai-chat-sentiment-app.onrender.com/chat',
    timeout: 30000, // Render cold start için
    pollingInterval: 5000,
    enableLogs: false,
  },
};

// Detect current environment
const getEnvVars = () => {
  if (__DEV__) {
    return ENV.development;
  }
  // Production'da staging/production ayarlamak için
  return ENV.production;
};

export default getEnvVars();