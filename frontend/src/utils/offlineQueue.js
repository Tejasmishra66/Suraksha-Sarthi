// Small offline queue helper that stores items in localStorage and can flush to backend.
const QUEUE_KEY = 'sdrf_offline_queue_v1';

export function getQueue() {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function addToQueue(item) {
  const q = getQueue();
  q.push(item);
  localStorage.setItem(QUEUE_KEY, JSON.stringify(q));
}

export function clearQueue() {
  localStorage.removeItem(QUEUE_KEY);
}

export function replaceQueue(items) {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(items));
}
