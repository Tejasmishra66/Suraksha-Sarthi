import React, { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';
import { WarningRounded as WarningIcon } from '@mui/icons-material';
import * as L from 'leaflet';
import { markAlertResponded } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function GeofenceAlert({ alerts = [] }) {
  const map = useMap();
  const { user } = useAuth();
  const [triggeredAlert, setTriggeredAlert] = useState(null);

  useEffect(() => {
    if (!alerts.length) return;

    const onLocationFound = (e) => {
      const userLat = e.latlng.lat;
      const userLng = e.latlng.lng;

      for (const alert of alerts) {
        if (!alert.lat || !alert.lng) continue;
        const alertLatLng = L.latLng(alert.lat, alert.lng);
        const distanceMeters = alertLatLng.distanceTo(e.latlng);
        const radiusMeters = (alert.radius_km || 10) * 1000;

        if (distanceMeters <= radiusMeters) {
          // Verify if already responded, etc. assuming we show if not responded
          setTriggeredAlert(alert);
          break;
        }
      }
    };

    map.on('locationfound', onLocationFound);
    map.locate({ setView: false, watch: true, enableHighAccuracy: true });

    return () => {
      map.off('locationfound', onLocationFound);
      map.stopLocate();
    };
  }, [map, alerts]);

  const handleAcknowledge = async () => {
    if (triggeredAlert && user) {
      try {
        await markAlertResponded(triggeredAlert.id, { userId: user.id });
      } catch (e) {
        console.error("Failed to acknowledge alert", e);
      }
    }
    setTriggeredAlert(null);
  };

  if (!triggeredAlert) return null;

  return (
    <Dialog open={Boolean(triggeredAlert)} onClose={() => setTriggeredAlert(null)} sx={{ zIndex: 9999 }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#ef4444', fontWeight: 'bold' }}>
        <WarningIcon />
        High Risk Zone Alert
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          You have entered a high-risk zone related to a <b>{triggeredAlert.disaster_type}</b>.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Severity: {triggeredAlert.severity}
        </Typography>
        <Box sx={{ mt: 2, p: 2, bgcolor: '#fef2f2', border: '1px solid #fecaca', borderRadius: 1 }}>
          <Typography variant="body2" color="#991b1b" fontWeight="bold">
            Please exercise extreme caution or evacuate if advised. Acknowledge this alert to confirm you are aware and safe.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={handleAcknowledge} variant="contained" color="error" fullWidth>
          Acknowledge & Confirm Safety
        </Button>
      </DialogActions>
    </Dialog>
  );
}
