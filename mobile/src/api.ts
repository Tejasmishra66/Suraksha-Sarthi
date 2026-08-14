import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

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
