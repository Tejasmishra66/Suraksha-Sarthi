import React, { useEffect, useRef, useState } from 'react';
import { Alert, Box, Button, Card, CardContent, Grid, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

import { createAlert, fetchAlerts, createIncident, uploadIncidentMedia } from '../api/client';
import { addToQueue } from '../utils/offlineQueue';

// Fix leaflet default marker icon paths when using Vite.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

function LocationSelector({ onSelect }) {
  // Captures clicks on the map and reports coordinates.
  useMapEvents({
    click(e) {
      onSelect(e.latlng);
    }
  });
  return null;
}

// Shows incident pins and a fast alert-draft form for operators.
export default function IncidentMapPage() {
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ disasterType: 'Flood', lat: '', lng: '', radiusKm: 10, severity: 'medium' });
  const fileRef = useRef();

  useEffect(() => {
    refreshAlerts();
  }, []);

  async function refreshAlerts() {
    try {
      setAlerts(await fetchAlerts());
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not load alerts');
    }
  }

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    try {
      // Create alert pin (server will notify volunteers)
      await createAlert({
        disasterType: form.disasterType,
        lat: Number(form.lat),
        lng: Number(form.lng),
        radiusKm: Number(form.radiusKm),
        severity: form.severity
      });
      setForm({ disasterType: 'Flood', lat: '', lng: '', radiusKm: 10, severity: 'medium' });
      await refreshAlerts();
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not create alert');
    }
  }

  async function handleCreateIncidentWithMedia(e) {
    e.preventDefault();
    setError('');
    try {
      // Create an incident record on the server
      const incident = await createIncident({
        title: e.target.title.value || 'Field report',
        description: e.target.description.value || '',
        disasterType: form.disasterType,
        lat: Number(form.lat) || null,
        lng: Number(form.lng) || null,
        address: e.target.address?.value || '',
        agencyAssigned: 'SDRF',
        offline: false
      });

      // If a file was selected, upload it to the incident media endpoint
      const file = fileRef.current?.files?.[0];
      if (file) {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('metadata', JSON.stringify({ lat: form.lat, lng: form.lng, timestamp: new Date().toISOString() }));
        await uploadIncidentMedia(incident.id, fd);
      }

      await refreshAlerts();
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not create incident');
    }
  }

  function handleMapSelect(latlng) {
    setForm((c) => ({ ...c, lat: latlng.lat.toFixed(6), lng: latlng.lng.toFixed(6) }));
  }

  function handleSaveOffline(e) {
    e.preventDefault();
    // Queue the incident payload locally for later flush
    addToQueue({
      entityType: 'incident',
      operation: 'create',
      payload: {
        title: e.target.title.value || 'Offline report',
        description: e.target.description.value || '',
        disasterType: form.disasterType,
        lat: Number(form.lat),
        lng: Number(form.lng),
        address: e.target.address?.value || '',
        agencyAssigned: 'SDRF',
        offline: true
      }
    });
    setForm({ disasterType: 'Flood', lat: '', lng: '', radiusKm: 10, severity: 'medium' });
  }

  return (
    <Stack spacing={3}>
      {error && <Alert severity="warning">{error}</Alert>}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={800} gutterBottom>
                Pin a New Incident
              </Typography>
              <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
                <TextField select label="Disaster" name="disasterType" value={form.disasterType} onChange={handleChange}>
                  {['Flood', 'Landslide', 'Fire', 'Cyclone', 'Earthquake'].map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}
                </TextField>
                <TextField label="Latitude" name="lat" value={form.lat} onChange={handleChange} />
                <TextField label="Longitude" name="lng" value={form.lng} onChange={handleChange} />
                <TextField label="Radius km" name="radiusKm" value={form.radiusKm} onChange={handleChange} />
                <TextField select label="Severity" name="severity" value={form.severity} onChange={handleChange}>
                  {['low', 'medium', 'high'].map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}
                </TextField>
                <Button type="submit" variant="contained">Create Alert Pin</Button>
              </Box>
              <Box component="form" onSubmit={handleCreateIncidentWithMedia} sx={{ mt: 3, display: 'grid', gap: 1 }}>
                <Typography variant="subtitle1">Create Incident with Photo</Typography>
                <TextField name="title" label="Title" />
                <TextField name="description" label="Description" />
                <TextField name="address" label="Detailed address (optional)" />
                <input ref={fileRef} type="file" accept="image/*" />
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  <Button type="submit" variant="contained">Create + Upload</Button>
                  <Button onClick={handleSaveOffline} variant="outlined">Save Offline</Button>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={800} gutterBottom>Incident Map</Typography>
              <div style={{ height: 480 }}>
                <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationSelector onSelect={handleMapSelect} />
                  {alerts.map((alert) => (
                    <Marker key={alert.id} position={[Number(alert.lat), Number(alert.lng)]}>
                      <Popup>
                        <Typography fontWeight={700}>{alert.disaster_type || alert.disasterType}</Typography>
                        <div>Severity: {alert.severity}</div>
                        <div>Radius: {alert.radius_km || alert.radiusKm} km</div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}
