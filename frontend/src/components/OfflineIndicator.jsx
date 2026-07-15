import React, { useState, useEffect } from 'react';
import { Alert, Snackbar } from '@mui/material';
import { flushQueue } from '../api/client';
import { getQueue } from '../utils/offlineQueue';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState(''); // 'syncing', 'synced', or ''

  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true);
      const queue = getQueue();
      if (queue.length > 0) {
        setSyncStatus('syncing');
        try {
          await flushQueue();
          setSyncStatus('synced');
          setTimeout(() => setSyncStatus(''), 3000);
        } catch (error) {
          console.error("Failed to auto-sync queue", error);
          setSyncStatus('error');
        }
      }
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check on mount
    if (navigator.onLine) {
        const queue = getQueue();
        if (queue.length > 0) {
            handleOnline();
        }
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <>
      <Snackbar
        open={!isOnline}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ top: { xs: 60, sm: 80 } }}
      >
        <Alert severity="warning" variant="filled" sx={{ width: '100%', boxShadow: 3 }}>
          You are offline. Actions will be queued and synced when connection is restored.
        </Alert>
      </Snackbar>

      <Snackbar
        open={syncStatus !== ''}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity={syncStatus === 'syncing' ? 'info' : syncStatus === 'synced' ? 'success' : 'error'} 
          variant="filled" 
          sx={{ width: '100%', boxShadow: 3 }}
        >
          {syncStatus === 'syncing' && "Connection restored. Syncing offline data..."}
          {syncStatus === 'synced' && "Offline data synced successfully!"}
          {syncStatus === 'error' && "Failed to sync offline data. Will try again later."}
        </Alert>
      </Snackbar>
    </>
  );
}
