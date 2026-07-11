import React, { useState, useEffect } from 'react';
import { Alert, Snackbar } from '@mui/material';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <Snackbar
      open={!isOnline}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{ top: { xs: 60, sm: 80 } }}
    >
      <Alert severity="warning" variant="filled" sx={{ width: '100%', boxShadow: 3 }}>
        You are offline. Actions will be queued and synced when connection is restored.
      </Alert>
    </Snackbar>
  );
}
