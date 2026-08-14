import React, { useState, useEffect } from 'react';
import { Alert, Snackbar, Button, Box, Typography } from '@mui/material';
import SyncIcon from '@mui/icons-material/Sync';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import { flushQueue } from '../api/client';
import { getQueue } from '../utils/offlineQueue';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline]     = useState(navigator.onLine);
  const [is2G, setIs2G]             = useState(false);
  const [queueCount, setQueueCount] = useState(0);
  const [syncStatus, setSyncStatus] = useState(''); // 'syncing', 'synced', 'error', or ''

  const checkNetwork = () => {
    const online = navigator.onLine;
    setIsOnline(online);
    // Detect 2G / slow connection
    const conn = (navigator).connection || (navigator).mozConnection || (navigator).webkitConnection;
    if (conn) {
      setIs2G(conn.effectiveType === '2g' || conn.effectiveType === 'slow-2g');
    }
    const q = getQueue();
    setQueueCount(q.length);
  };

  const handleSyncNow = async () => {
    const q = getQueue();
    if (q.length === 0) return;
    setSyncStatus('syncing');
    try {
      await flushQueue();
      setSyncStatus('synced');
      setQueueCount(0);
      setTimeout(() => setSyncStatus(''), 4000);
    } catch (err) {
      console.error('Failed to sync offline data', err);
      setSyncStatus('error');
    }
  };

  useEffect(() => {
    checkNetwork();
    const interval = setInterval(checkNetwork, 3500);

    const handleOnline = async () => {
      setIsOnline(true);
      checkNetwork();
      const q = getQueue();
      if (q.length > 0) {
        handleSyncNow();
      }
    };
    const handleOffline = () => {
      setIsOnline(false);
      checkNetwork();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <>
      {/* ── Offline Banner (0 Network) ── */}
      <Snackbar
        open={!isOnline}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ top: { xs: 60, sm: 80 } }}
      >
        <Alert
          severity="warning"
          variant="filled"
          sx={{ width: '100%', boxShadow: 4, display: 'flex', alignItems: 'center' }}
          action={
            queueCount > 0 ? (
              <Button
                color="inherit"
                size="small"
                startIcon={<SyncIcon />}
                onClick={handleSyncNow}
                sx={{ fontWeight: 800, bgcolor: 'rgba(255,255,255,0.2)' }}
              >
                SYNC NOW ({queueCount})
              </Button>
            ) : undefined
          }
        >
          🚫 <strong>0-Network Offline Mode</strong> — SITREPs are saved in device queue ({queueCount} queued).
        </Alert>
      </Snackbar>

      {/* ── 2G Low-Bandwidth Mode Banner ── */}
      {isOnline && is2G && (
        <Snackbar
          open={true}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          sx={{ top: { xs: 60, sm: 80 } }}
        >
          <Alert
            severity="info"
            variant="filled"
            icon={<SignalCellularAltIcon />}
            sx={{ width: '100%', boxShadow: 4, bgcolor: '#D97706' }}
            action={
              queueCount > 0 ? (
                <Button
                  color="inherit"
                  size="small"
                  startIcon={<SyncIcon />}
                  onClick={handleSyncNow}
                  sx={{ fontWeight: 800, bgcolor: 'rgba(255,255,255,0.2)' }}
                >
                  SYNC NOW ({queueCount})
                </Button>
              ) : undefined
            }
          >
            📶 <strong>2G Network Signal Detected</strong> — Low-bandwidth packet optimization active ({queueCount} queued).
          </Alert>
        </Snackbar>
      )}

      {/* ── Sync Result Alert ── */}
      <Snackbar
        open={syncStatus !== ''}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={syncStatus === 'syncing' ? 'info' : syncStatus === 'synced' ? 'success' : 'error'}
          variant="filled"
          sx={{ width: '100%', boxShadow: 3 }}
        >
          {syncStatus === 'syncing' && '⚡ 2G / Network Restored: Syncing queued emergency reports to SDRF Control Room…'}
          {syncStatus === 'synced' && '✅ All queued emergency reports synchronized successfully!'}
          {syncStatus === 'error' && '⚠️ Network weak or unavailable. SITREPs remain safe in queue.'}
        </Alert>
      </Snackbar>
    </>
  );
}
