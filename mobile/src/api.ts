import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

// Use expo-constants to pull the API URL from app.json extra config,
// with fallback to Android emulator host alias.
const API_BASE_URL =
  Constants.expoConfig?.extra?.apiBaseUrl || 'http://10.0.2.2:4002';

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
