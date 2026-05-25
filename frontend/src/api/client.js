import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Reads the saved JWT so every request can authenticate automatically.
function getStoredToken() {
  return localStorage.getItem('sdrf_token') || '';
}

// Saves the JWT for later API calls and page refreshes.
export function setAuthToken(token) {
  localStorage.setItem('sdrf_token', token);
}

// Clears the saved JWT when the user logs out.
export function clearAuthToken() {
  localStorage.removeItem('sdrf_token');
}

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Logs the user in and returns the backend-issued JWT payload.
export async function login(payload) {
  const { data } = await api.post('/auth/login', payload);
  return data;
}

// Fetches the current task board for the dashboard view.
export async function fetchTasks() {
  const { data } = await api.get('/tasks');
  return data;
}

// Creates a task card from the quick-add form.
export async function createTask(payload) {
  const { data } = await api.post('/tasks', payload);
  return data;
}

// Updates task status or assignment from the board UI.
export async function updateTask(taskId, payload) {
  const { data } = await api.patch(`/tasks/${taskId}`, payload);
  return data;
}

// Fetches geofenced alert pins for the incident map.
export async function fetchAlerts() {
  const { data } = await api.get('/alerts');
  return data;
}

// Creates a new alert pin with disaster metadata.
export async function createAlert(payload) {
  const { data } = await api.post('/alerts', payload);
  return data;
}

// Fetches the volunteer roster for the dashboard.
export async function fetchVolunteers() {
  const { data } = await api.get('/volunteers');
  return data;
}

// Create a new volunteer
export async function createVolunteer(payload) {
  const { data } = await api.post('/volunteers', payload);
  return data;
}

// Fetches resource availability and inventory data.
export async function fetchResources() {
  const { data } = await api.get('/resources');
  return data;
}

// Create a new resource
export async function createResource(payload) {
  const { data } = await api.post('/resources', payload);
  return data;
}

// Sends a broadcast request to volunteers in a disaster radius.
export async function broadcastVolunteers(payload) {
  const { data } = await api.post('/volunteers/broadcast', payload);
  return data;
}

// Create incident (returns created incident with id)
export async function createIncident(payload) {
  const { data } = await api.post('/incidents', payload);
  return data;
}

// Upload media file for an incident (FormData)
export async function uploadIncidentMedia(incidentId, formData) {
  const { data } = await api.post(`/incidents/${incidentId}/media`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
}

// Offline queue endpoints
export async function postQueue(items) {
  const { data } = await api.post('/sync/queue', { items });
  return data;
}

export async function flushQueue() {
  const { data } = await api.post('/sync/flush');
  return data;
}

export default api;
