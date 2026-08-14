import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';

// Machine's local network IP address - update this with your machine's IP if different
const API_BASE_URL = 'http://10.137.94.239:4001';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('jwt');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // Ignore secure store errors
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401 && error.config.url !== '/auth/login') {
      try {
        const token = await SecureStore.getItemAsync('jwt');
        if (token) {
          await SecureStore.deleteItemAsync('jwt');
          await SecureStore.deleteItemAsync('userRole');
          await SecureStore.deleteItemAsync('userName');
          await SecureStore.deleteItemAsync('userPhone');
          Alert.alert(
            "Session Expired",
            "Your secure session has expired. Please restart the application to log in again.",
            [{ text: "OK" }]
          );
        }
      } catch (e) {
        // Ignore store errors
      }
    }
    return Promise.reject(error);
  }
);
