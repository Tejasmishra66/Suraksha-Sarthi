import * as SecureStore from 'expo-secure-store';
import { api } from '../api';

const QUEUE_KEY = 'suraksha_offline_emergency_queue_v2';

export interface OfflineEmergencyReport {
  id: string;
  queuedAt: string;
  title: string;
  description: string;
  disasterType: string;
  reporterPhone: string;
  phone: string;
  lat: number | null;
  lon: number | null;
  address: string;
  status: string;
}

// ─── Get Queue from SecureStore ────────────────────────────────────
export async function getOfflineQueue(): Promise<OfflineEmergencyReport[]> {
  try {
    const raw = await SecureStore.getItemAsync(QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

// ─── Add Report to Offline Queue ──────────────────────────────────
export async function addToOfflineQueue(report: Partial<OfflineEmergencyReport>): Promise<number> {
  try {
    const q = await getOfflineQueue();
    const newItem: OfflineEmergencyReport = {
      id: 'OFFLINE-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      queuedAt: new Date().toISOString(),
      title: report.title || 'Emergency Report',
      description: report.description || '',
      disasterType: report.disasterType || 'General Emergency',
      reporterPhone: report.reporterPhone || report.phone || '',
      phone: report.reporterPhone || report.phone || '',
      lat: report.lat ?? null,
      lon: report.lon ?? null,
      address: report.address || '',
      status: 'active',
    };
    q.push(newItem);
    await SecureStore.setItemAsync(QUEUE_KEY, JSON.stringify(q));
    return q.length;
  } catch (e) {
    console.error('Failed to save to offline queue', e);
    return 0;
  }
}

// ─── Clear Queue ──────────────────────────────────────────────────
export async function clearOfflineQueue(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(QUEUE_KEY);
  } catch (e) {}
}

// ─── Flush / Synchronize Queue to Backend ────────────────────────
export async function flushOfflineQueue(): Promise<{ syncedCount: number; remainingCount: number }> {
  const queue = await getOfflineQueue();
  if (queue.length === 0) return { syncedCount: 0, remainingCount: 0 };

  try {
    // Attempt batch sync optimized for low-bandwidth 2G connections
    const response = await api.post('/sync/batch', { incidents: queue }, { timeout: 8000 });
    const synced = response.data?.syncedCount ?? queue.length;
    await clearOfflineQueue();
    return { syncedCount: synced, remainingCount: 0 };
  } catch (err: any) {
    // If batch sync fails, fallback to flushing individual items
    let synced = 0;
    const remaining: OfflineEmergencyReport[] = [];

    for (const item of queue) {
      try {
        await api.post('/incidents', item, { timeout: 5000 });
        synced++;
      } catch (itemErr) {
        remaining.push(item);
      }
    }

    if (remaining.length < queue.length) {
      await SecureStore.setItemAsync(QUEUE_KEY, JSON.stringify(remaining));
    }

    if (synced === 0) {
      throw new Error('Network unreachable. Queued reports preserved locally.');
    }

    return { syncedCount: synced, remainingCount: remaining.length };
  }
}
