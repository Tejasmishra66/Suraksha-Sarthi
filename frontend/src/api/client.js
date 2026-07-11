import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4001';

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json'
  }
});



// Reads the saved JWT so every request can authenticate automatically.
export function getStoredToken() {
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
  // Do not send the Authorization header for the login request.
  // If an old, expired token is in localStorage, it could cause the login to fail.
  const token = getStoredToken();
  if (token && config.url !== '/auth/login') {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepts responses to check for expired tokens (401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't intercept 401s from the login endpoint, as that's expected for bad credentials.
    // The login page will handle that error itself.
    if (error.response && error.response.status === 401 && error.config.url !== '/auth/login') {
      // Token has expired or is invalid on a protected route
      clearAuthToken();
      window.location.href = '/login'; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

// Logs the user in and returns the backend-issued JWT payload.
export async function login(payload) {
  const { data } = await api.post('/auth/login', payload);
  return data;
}

// Signs up a new public user.
export async function signup(payload) {
  const { data } = await api.post('/auth/signup', payload);
  return data;
}

// Creates a new user account (Admin only).
export async function createUser(payload) {
  const { data } = await api.post('/auth/create-user', payload);
  return data;
}

// Fetches the bulletin feed.
export async function fetchBulletins() {
  const { data } = await api.get('/bulletins');
  return data;
}

// Creates a new bulletin update.
export async function createBulletin(payload) {
  const { data } = await api.post('/bulletins', payload);
  return data;
}

// Fetches intel pins for the map placeholder.
export async function fetchIntelPins() {
  const { data } = await api.get('/intel');
  return data;
}

// Creates a new intel pin.
export async function createIntelPin(payload) {
  const { data } = await api.post('/intel', payload);
  return data;
}

// Fetches the monitored agency status feed.
export async function fetchStatus() {
  const { data } = await api.get('/status');
  return data;
}

// Records a heartbeat for the signed-in user.
export async function sendHeartbeat(payload) {
  const { data } = await api.post('/ping', payload);
  return data;
}

// Fetches the current task board for the dashboard view.
export async function fetchTasks() {
  const { data } = await api.get('/tasks');
  return data;
}

// Fetches the agency list used by the task notification picker.
export async function fetchAgencies() {
  const { data } = await api.get('/agencies');
  return data;
}

// Fetches members registered under a specific agency.
export async function fetchAgencyMembers(agency) {
  const { data } = await api.get(`/agencies/${encodeURIComponent(agency)}/members`);
  return data;
}

// Registers a new member in a specific agency.
export async function createAgencyMember(agency, payload) {
  const { data } = await api.post(`/agencies/${encodeURIComponent(agency)}/members`, payload);
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

// Fetch all incidents
export async function fetchIncidents() {
  const { data } = await api.get('/incidents');
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

// Fetches the equipment catalog and live map coordinates
export async function fetchEquipment() {
  const { data } = await api.get('/equipment');
  return data;
}

// Creates new equipment in the catalog
export async function createEquipment(payload) {
  const { data } = await api.post('/equipment', payload);
  return data;
}

// Logs a QR code scan for tracking or transferring equipment
export async function scanEquipment(equipmentId, payload) {
  // payload expects: { action: 'dispatch' | 'confirm' | 'update_location', lat, lng, receiver_id }
  const { data } = await api.post(`/equipment/${equipmentId}/scan`, payload);
  return data;
}

// Fetches survival guides for offline caching
export async function fetchGuides() {
  const { data } = await api.get('/guides');
  return data;
}

export async function markAlertResponded(alertId, payload) {
  const { data } = await api.post(`/alerts/${alertId}/respond`, payload);
  return data;
}

export async function getVapidPublicKey() {
  const { data } = await api.get('/push/vapid-public-key');
  return data;
}

export async function subscribeToPush(subscription) {
  const { data } = await api.post('/push/subscribe', subscription);
  return data;
}

export async function fetchMutedAlerts() {
  const { data } = await api.get('/mutes');
  return data;
}

export async function muteAlert(payload) {
  const { data } = await api.post('/mutes', payload);
  return data;
}

export async function fetchAuditLogs(office) {
  const url = office ? `/audit?office=${encodeURIComponent(office)}` : '/audit';
  const { data } = await api.get(url);
  return data;
}

export default api;
