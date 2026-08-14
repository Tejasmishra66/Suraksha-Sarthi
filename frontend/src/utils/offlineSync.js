import { get, set } from 'idb-keyval';
import { createIncident } from '../api/client';

const OFFLINE_INCIDENTS_KEY = 'offline_incidents_queue';

/**
 * Saves an incident payload to IndexedDB.
 */
export async function saveIncidentOffline(payload) {
  try {
    const queue = (await get(OFFLINE_INCIDENTS_KEY)) || [];
    queue.push({ ...payload, timestamp: Date.now(), id: crypto.randomUUID() });
    await set(OFFLINE_INCIDENTS_KEY, queue);
    console.log('[Offline Sync] Incident saved to offline queue.');
  } catch (error) {
    console.error('[Offline Sync] Failed to save offline incident:', error);
  }
}

/**
 * Returns all offline incidents currently in the queue.
 */
export async function getOfflineIncidents() {
  try {
    return (await get(OFFLINE_INCIDENTS_KEY)) || [];
  } catch {
    return [];
  }
}

/**
 * Attempts to send all incidents currently in the offline queue.
 * Should be called when the network is restored.
 */
export async function syncOfflineIncidents() {
  if (!navigator.onLine) return;
  
  try {
    const queue = await getOfflineIncidents();
    if (queue.length === 0) return;

    console.log(`[Offline Sync] Found ${queue.length} incidents to sync...`);

    const failedQueue = [];

    // Process each incident
    for (const incident of queue) {
      try {
        // Remove tracking metadata before sending to API
        const { timestamp, id, ...payload } = incident;
        await createIncident(payload);
        console.log(`[Offline Sync] Successfully synced incident ${id}`);
      } catch (error) {
        console.error(`[Offline Sync] Failed to sync incident ${incident.id}:`, error);
        failedQueue.push(incident); // Keep it in the queue to try again later
      }
    }

    // Update queue with only the ones that failed
    await set(OFFLINE_INCIDENTS_KEY, failedQueue);
    
    if (failedQueue.length === 0) {
      console.log('[Offline Sync] All offline incidents synced successfully.');
    }
  } catch (error) {
    console.error('[Offline Sync] Error during sync process:', error);
  }
}
