import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import TopNavBar from '../components/TopNavBar';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

import { createAlert, fetchAlerts, createIncident, uploadIncidentMedia } from '../api/client';
import { addToQueue } from '../utils/offlineQueue';

const HIMACHAL_CENTER = [31.1048, 77.1734];
const HIMACHAL_BOUNDS = [
  [30.2, 75.6],
  [33.5, 79.6],
];

// Fix leaflet default marker icon paths when using Vite.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function LocationSelector({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng);
    },
  });
  return null;
}

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
      await createAlert({
        disasterType: form.disasterType,
        lat: Number(form.lat),
        lng: Number(form.lng),
        radiusKm: Number(form.radiusKm),
        severity: form.severity,
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
      const incident = await createIncident({
        title: e.target.title.value || 'Field report',
        description: e.target.description.value || '',
        disasterType: form.disasterType,
        lat: Number(form.lat) || null,
        lng: Number(form.lng) || null,
        address: e.target.address?.value || '',
        agencyAssigned: 'SDRF',
        offline: false,
      });

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
    localStorage.setItem('sdrf_last_alert_coords', JSON.stringify({ lat: latlng.lat.toFixed(6), lng: latlng.lng.toFixed(6) }));
    setForm((c) => ({ ...c, lat: latlng.lat.toFixed(6), lng: latlng.lng.toFixed(6) }));
  }

  function handleSaveOffline(e) {
    e.preventDefault();
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
        offline: true,
      },
    });
    setForm({ disasterType: 'Flood', lat: '', lng: '', radiusKm: 10, severity: 'medium' });
  }

  const activeAlerts = [
    { title: 'Heavy Rainfall Warning', location: 'Kullu, Mandi, Shimla', time: '19 May 2024, 09:15 AM', severity: 'High' },
    { title: 'Landslide Warning', location: 'Kinnaur, Chamba', time: '19 May 2024, 08:40 AM', severity: 'Medium' },
    { title: 'Rescue Operation Ongoing', location: 'Lahaul & Spiti', time: '19 May 2024, 07:20 AM', severity: 'Low' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <TopNavBar />
      <Box
        sx={{
          backgroundImage: `linear-gradient(135deg, rgba(5,30,19,0.75), rgba(6,40,32,0.4)), url('/assets/heroin.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#fff',
          py: { xs: 8, md: 12 },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Stack spacing={2}>
                <Typography variant="overline" sx={{ color: '#a7f3d0', fontWeight: 700 }}>Live Map & Alerts</Typography>
                <Typography variant="h3" fontWeight={900} sx={{ maxWidth: 680 }}>
                  View real-time situation, disaster zones, alerts and important information on the map.
                </Typography>
                <Typography sx={{ maxWidth: 680, color: 'rgba(255,255,255,0.8)', fontSize: 18 }}>
                  Track Himachal Pradesh state-level hazards, warning pins, rescue teams and weather layers in one unified dashboard.
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={5}>
              <Paper sx={{ p: 3, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)' }}>
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle2" sx={{ color: '#bbf7d0' }}>Last Updated</Typography>
                    <Chip label="Live" color="success" size="small" />
                  </Stack>
                  <Typography variant="h6" fontWeight={800}>19 May 2024, 10:30 AM</Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.75)">Data refreshed with latest hazard pins, rescue team locations and weather layers.</Typography>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Paper sx={{ p: 2, mb: 4, borderRadius: 4, boxShadow: '0 18px 40px rgba(15,23,42,0.08)' }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="space-between">
            {['Live Map', 'Alert Zones', 'Warning Pins', 'Weather Layer', 'Department View'].map((item) => (
              <Button key={item} variant="outlined" sx={{ flex: 1, minWidth: 140, textTransform: 'none' }}>{item}</Button>
            ))}
          </Stack>
        </Paper>

        <Grid container spacing={4}>
          <Grid item xs={12} lg={8}>
            <Card sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 20px 40px rgba(15,23,42,0.08)' }}>
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ height: { xs: 420, md: 640 }, width: '100%' }}>
                  <MapContainer
                    bounds={HIMACHAL_BOUNDS}
                    center={HIMACHAL_CENTER}
                    zoom={8}
                    minZoom={7}
                    maxBounds={HIMACHAL_BOUNDS}
                    maxBoundsViscosity={1}
                    style={{ height: '100%', width: '100%' }}
                  >
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
                </Box>
              </CardContent>
            </Card>

            <Paper sx={{ mt: 3, p: 3, borderRadius: 4, boxShadow: '0 18px 30px rgba(15,23,42,0.06)' }}>
              <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>Map Layers</Typography>
              <Grid container spacing={2}>
                {[
                  { label: 'Disaster Zones', color: 'error' },
                  { label: 'Warning Pins', color: 'warning' },
                  { label: 'Rescue Teams', color: 'success' },
                  { label: 'Weather Radar', color: 'info' },
                ].map((item) => (
                  <Grid item xs={12} sm={6} key={item.label}>
                    <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 3 }}>
                      <Typography>{item.label}</Typography>
                      <Chip label="On" size="small" color={item.color} />
                    </Paper>
                  </Grid>
                ))}
              </Grid>
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>Legend</Typography>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}><Avatar sx={{ bgcolor: '#fee2e2', width: 32, height: 32, mr: 1 }}>!</Avatar><Typography>High Alert Zone</Typography></Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}><Avatar sx={{ bgcolor: '#fef9c3', width: 32, height: 32, mr: 1 }}>⚠️</Avatar><Typography>Warning / Advisory</Typography></Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}><Avatar sx={{ bgcolor: '#d1fae5', width: 32, height: 32, mr: 1 }}>⛑️</Avatar><Typography>Rescue Team</Typography></Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}><Avatar sx={{ bgcolor: '#e0f2fe', width: 32, height: 32, mr: 1 }}>🏕️</Avatar><Typography>Relief Camp</Typography></Box>
                </Stack>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Stack spacing={3}>
              <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 18px 30px rgba(15,23,42,0.06)' }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                  <Typography variant="h6" fontWeight={800}>Active Alerts</Typography>
                  <Button size="small">View All</Button>
                </Stack>
                <Stack spacing={2}>
                  {activeAlerts.map((item) => (
                    <Paper key={item.title} sx={{ p: 2, borderRadius: 3, bgcolor: '#f8fafc' }}>
                      <Stack spacing={1}>
                        <Typography fontWeight={700}>{item.title}</Typography>
                        <Typography variant="caption" color="text.secondary">{item.location}</Typography>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="caption" color="text.secondary">{item.time}</Typography>
                          <Chip label={item.severity} size="small" color={item.severity === 'High' ? 'error' : item.severity === 'Medium' ? 'warning' : 'success'} />
                        </Stack>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              </Paper>

              <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 18px 30px rgba(15,23,42,0.06)' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="h6" fontWeight={800}>Weather Overview</Typography>
                  <Button size="small">View Details</Button>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <Avatar sx={{ bgcolor: '#dbeafe', color: '#1d4ed8' }}>🌦️</Avatar>
                  <Box>
                    <Typography fontWeight={700}>12°C</Typography>
                    <Typography variant="caption" color="text.secondary">Light Rain</Typography>
                  </Box>
                </Stack>
                <Grid container spacing={1}>
                  {['Today', 'Tue', 'Wed', 'Thu'].map((day, idx) => (
                    <Grid item xs={3} key={day}>
                      <Paper sx={{ p: 1, textAlign: 'center', borderRadius: 2, bgcolor: '#f8fafc' }}>
                        <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>{day}</Typography>
                        <Typography variant="subtitle2">{[12,14,13,16][idx]}°C</Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Paper>

              <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 18px 30px rgba(15,23,42,0.06)' }}>
                <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>Quick Information</Typography>
                <Stack spacing={1}>
                  {[
                    { label: 'Active Districts', value: '12' },
                    { label: 'Rescue Teams', value: '7' },
                    { label: 'Affected People', value: '1.2K' },
                    { label: 'Relief Camps', value: '14' },
                  ].map((item) => (
                    <Stack key={item.label} direction="row" justifyContent="space-between" sx={{ py: 1, borderBottom: '1px solid #e5e7eb' }}>
                      <Typography>{item.label}</Typography>
                      <Typography fontWeight={700}>{item.value}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
