import React, { useEffect, useState } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  FormControlLabel,
  Divider,
  Switch,
  keyframes,
  InputAdornment
} from '@mui/material';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import TopNavBar from '../components/TopNavBar';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

import { fetchAlerts } from '../api/client';

const pulse = keyframes`
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(22, 163, 74, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(22, 163, 74, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(22, 163, 74, 0); }
`;

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

const getSeverityColor = (severity) => {
  const s = severity?.toLowerCase();
  if (s === 'high' || s === 'critical') return '#ef4444'; // Red
  if (s === 'medium') return '#f59e0b'; // Orange
  return '#3b82f6'; // Blue
};

const getDisasterIcon = (type) => {
  const t = (type || '').toLowerCase();
  if (t.includes('fire')) return '🔥';
  if (t.includes('medical')) return '🚑';
  if (t.includes('flood') || t.includes('water')) return '🌊';
  if (t.includes('landslide') || t.includes('earthquake')) return '⛰️';
  if (t.includes('natural')) return '🌪️';
  if (t.includes('accident')) return '💥';
  return '⚠️';
};

const createMarkerIcon = (severity, type) => {
  const color = getSeverityColor(severity);
  const icon = getDisasterIcon(type);
  return L.divIcon({
    className: 'custom-severity-marker',
    html: `<div style="background-color: ${color}; width: 32px; height: 32px; border-radius: 50%; border: 2px solid white; box-shadow: 0 4px 8px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; font-size: 16px;">${icon}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

const SDRF_OFFICES = [
  { id: 'sdrf-hq', name: 'SDRF Headquarters', location: 'Shimla', lat: 31.1048, lng: 77.1734 },
  { id: 'sdrf-mandi', name: 'SDRF Mandi Unit', location: 'Mandi', lat: 31.7087, lng: 76.9315 },
  { id: 'sdrf-kangra', name: 'SDRF Kangra Unit', location: 'Dharamshala (Kangra region)', lat: 32.2190, lng: 76.3234 },
];

const createSdrfIcon = () => {
  return L.divIcon({
    className: 'custom-sdrf-marker',
    html: `<div style="background-color: #059669; width: 28px; height: 28px; border-radius: 6px; border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 14px; color: white;">🛡️</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
  });
};

function GPSController({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo([coords.lat, coords.lng], 14, { animate: true });
    }
  }, [coords, map]);
  return null;
}

const getWeatherCondition = (code) => {
  if (code === 0) return { label: 'Clear Sky', icon: '☀️' };
  if (code >= 1 && code <= 3) return { label: 'Partly Cloudy', icon: '⛅' };
  if (code === 45 || code === 48) return { label: 'Fog', icon: '🌫️' };
  if ((code >= 51 && code <= 55) || (code >= 61 && code <= 65) || (code >= 80 && code <= 82)) return { label: 'Rain', icon: '🌧️' };
  if (code >= 71 && code <= 77) return { label: 'Snow', icon: '❄️' };
  if (code >= 95 && code <= 99) return { label: 'Thunderstorm', icon: '⛈️' };
  return { label: 'Unknown', icon: '❓' };
};

export default function IncidentMapPage() {
  const [alerts, setAlerts] = useState([]);
  const [layers, setLayers] = useState({
    alertFlood: true,
    alertLandslide: true,
    alertFire: true,
    alertAccident: true,
    alertMedical: true,
    alertOther: true,
  });
  const [gpsFlyTo, setGpsFlyTo] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [alertSearch, setAlertSearch] = useState('');

  useEffect(() => {
    refreshAlerts();
    fetchWeather();

    // Auto-refresh alerts every 30 seconds
    const intervalId = setInterval(refreshAlerts, 30000);
    return () => clearInterval(intervalId);
  }, []);

  async function fetchWeather() {
    const [lat, lng] = HIMACHAL_CENTER; // Change these to any custom coordinates (e.g. [28.6139, 77.2090] for New Delhi)
    try {
      // Fetching weather for the specified coordinates
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weather_code&daily=temperature_2m_max,weather_code&timezone=auto`
      );
      const data = await res.json();
      setWeatherData(data);
    } catch (err) {
      console.error('Failed to fetch weather data', err);
    }
  }

  async function refreshAlerts() {
    try {
      setAlerts(await fetchAlerts());
      setLastUpdated(new Date());
    } catch (err) {
      console.error(err?.response?.data?.message || 'Could not load alerts');
    }
  }

  const filteredAlerts = alerts.filter(alert => {
    if (!alertSearch) return true;
    const term = alertSearch.toLowerCase();
    return (alert.disaster_type || alert.disasterType || '').toLowerCase().includes(term) ||
           (alert.severity || '').toLowerCase().includes(term);
  });

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f4faf4' }}>
      <TopNavBar />

      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
        <Grid container spacing={4}>
          <Grid item xs={12} lg={8}>
            <Stack spacing={4}>
              <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2, px: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="h6" fontWeight={800} color="#0f172a">
                  Live Operational Map
                </Typography>
                <Chip label="LIVE STATUS" size="small" color="success" sx={{ fontWeight: 800, animation: `${pulse} 2s infinite` }} />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                <AccessTimeRoundedIcon fontSize="small" />
                <Typography variant="body2" fontWeight={700}>
                  Updated: {lastUpdated.toLocaleTimeString()}
                </Typography>
              </Box>
            </Stack>
            <Card sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 20px 40px rgba(15,23,42,0.08)' }}>
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ height: { xs: 500, md: 720 }, width: '100%' }}>
                  <MapContainer
                    bounds={HIMACHAL_BOUNDS}
                    center={HIMACHAL_CENTER}
                    zoom={8}
                    minZoom={8}
                    maxBounds={HIMACHAL_BOUNDS}
                    maxBoundsViscosity={1.0}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer 
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <GPSController coords={gpsFlyTo} />
                    {SDRF_OFFICES.map((office) => (
                      <Marker 
                        key={office.id} 
                        position={[office.lat, office.lng]}
                        icon={createSdrfIcon()}
                      >
                        <Popup>
                          <Typography fontWeight={800} color="#0f172a">{office.name}</Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{office.location}</Typography>
                          <Chip label="SDRF Base" size="small" sx={{ bgcolor: '#059669', color: '#fff', fontWeight: 700 }} />
                        </Popup>
                      </Marker>
                    ))}
                    {alerts
                      .filter((alert) => {
                        const t = (alert.disaster_type || alert.disasterType || '').toLowerCase();
                        const isFlood = t.includes('flood') || t.includes('water');
                        const isLandslide = t.includes('landslide') || t.includes('earthquake');
                        const isFire = t.includes('fire');
                        const isAccident = t.includes('accident') || t.includes('crash');
                        const isMedical = t.includes('medical');
                        const isOther = !isFlood && !isLandslide && !isFire && !isAccident && !isMedical;
                        
                        if (isFlood && layers.alertFlood) return true;
                        if (isLandslide && layers.alertLandslide) return true;
                        if (isFire && layers.alertFire) return true;
                        if (isAccident && layers.alertAccident) return true;
                        if (isMedical && layers.alertMedical) return true;
                        if (isOther && layers.alertOther) return true;
                        return false;
                      })
                      .map((alert) => (
                        <Marker 
                          key={alert.id} 
                          position={[Number(alert.lat), Number(alert.lng)]}
                          icon={createMarkerIcon(alert.severity, alert.disaster_type || alert.disasterType)}
                        >
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
              </Box>

            <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, boxShadow: '0 18px 40px rgba(15,23,42,0.08)', height: '100%' }}>
              <Typography variant="h6" fontWeight={800} sx={{ mb: 3 }}>Map Controls & Legend</Typography>
              
              <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1, display: 'block', mb: 1.5 }}>Incident Layers</Typography>
              <Grid container spacing={2} sx={{ mb: 4 }}>
                {[
                  { key: 'alertFlood', label: 'Flood Alerts (🌊)', color: 'info' },
                  { key: 'alertLandslide', label: 'Landslides (⛰️)', color: 'warning' },
                  { key: 'alertFire', label: 'Fire Incidents (🔥)', color: 'error' },
                  { key: 'alertAccident', label: 'Accidents (💥)', color: 'warning' },
                  { key: 'alertMedical', label: 'Medical (🚑)', color: 'error' },
                  { key: 'alertOther', label: 'Other Incidents (⚠️)', color: 'secondary' },
                ].map((item) => (
                  <Grid item xs={12} sm={6} md={4} key={item.key}>
                    <Paper onClick={() => setLayers(prev => ({ ...prev, [item.key]: !prev[item.key] }))} sx={{ cursor: 'pointer', px: 2, py: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 3, border: '1px solid #f1f5f9', bgcolor: layers[item.key] ? '#f8fafc' : '#ffffff', transition: 'all 0.2s', '&:hover': { borderColor: '#cbd5e1', transform: 'translateY(-2px)' } }}>
                      <FormControlLabel
                        control={
                          <Switch
                            size="small"
                            checked={layers[item.key]}
                            onChange={(e) => { e.stopPropagation(); setLayers(prev => ({ ...prev, [item.key]: e.target.checked })); }}
                            color={item.color}
                          />
                        }
                        label={<Typography variant="body2" fontWeight={layers[item.key] ? 700 : 500}>{item.label}</Typography>}
                        sx={{ m: 0, width: '100%', pointerEvents: 'none' }}
                      />
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              <Divider sx={{ mb: 4 }} />

              <Grid container spacing={4}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1, display: 'block', mb: 2 }}>Incident Types</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}><Box sx={{ display: 'flex', alignItems: 'center' }}><Typography sx={{ fontSize: 22, mr: 1 }}>🌊</Typography><Typography variant="body2" fontWeight={600}>Flood</Typography></Box></Grid>
                    <Grid item xs={6}><Box sx={{ display: 'flex', alignItems: 'center' }}><Typography sx={{ fontSize: 22, mr: 1 }}>⛰️</Typography><Typography variant="body2" fontWeight={600}>Landslide</Typography></Box></Grid>
                    <Grid item xs={6}><Box sx={{ display: 'flex', alignItems: 'center' }}><Typography sx={{ fontSize: 22, mr: 1 }}>🔥</Typography><Typography variant="body2" fontWeight={600}>Fire</Typography></Box></Grid>
                    <Grid item xs={6}><Box sx={{ display: 'flex', alignItems: 'center' }}><Typography sx={{ fontSize: 22, mr: 1 }}>💥</Typography><Typography variant="body2" fontWeight={600}>Crash</Typography></Box></Grid>
                    <Grid item xs={6}><Box sx={{ display: 'flex', alignItems: 'center' }}><Typography sx={{ fontSize: 22, mr: 1 }}>🚑</Typography><Typography variant="body2" fontWeight={600}>Medical</Typography></Box></Grid>
                    <Grid item xs={6}><Box sx={{ display: 'flex', alignItems: 'center' }}><Typography sx={{ fontSize: 22, mr: 1 }}>⚠️</Typography><Typography variant="body2" fontWeight={600}>Other</Typography></Box></Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1, display: 'block', mb: 2 }}>Severity Status</Typography>
                  <Stack spacing={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}><Box sx={{ bgcolor: '#ef4444', width: 18, height: 18, borderRadius: '50%', mr: 2, boxShadow: '0 2px 6px rgba(239,68,68,0.4)' }}></Box><Typography variant="body2" fontWeight={700}>High / Critical</Typography></Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}><Box sx={{ bgcolor: '#f59e0b', width: 18, height: 18, borderRadius: '50%', mr: 2, boxShadow: '0 2px 6px rgba(245,158,11,0.4)' }}></Box><Typography variant="body2" fontWeight={700}>Medium Alert</Typography></Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}><Box sx={{ bgcolor: '#3b82f6', width: 18, height: 18, borderRadius: '50%', mr: 2, boxShadow: '0 2px 6px rgba(59,130,246,0.4)' }}></Box><Typography variant="body2" fontWeight={700}>Low / Advisory</Typography></Box>
                  </Stack>
                </Grid>
              </Grid>
            </Paper>
            </Stack>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Stack spacing={4}>
              <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 18px 40px rgba(15,23,42,0.08)' }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                  <Typography variant="h6" fontWeight={800}>Active Alerts</Typography>
                  <Button size="small">View All</Button>
                </Stack>
              <TextField
                fullWidth
                size="small"
                placeholder="Search alerts (e.g. Flood, High)..."
                value={alertSearch}
                onChange={(e) => setAlertSearch(e.target.value)}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRoundedIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
                <Stack spacing={2}>
                {filteredAlerts.length > 0 ? filteredAlerts.slice(0, 5).map((item) => {
                    const severityLower = (item.severity || 'medium').toLowerCase();
                    const chipColor = (severityLower === 'high' || severityLower === 'critical') ? 'error' : severityLower === 'medium' ? 'warning' : 'success';
                    const borderColor = (severityLower === 'high' || severityLower === 'critical') ? '#ef4444' : severityLower === 'medium' ? '#f59e0b' : '#10b981';
                    return (
                      <Paper 
                        key={item.id} 
                        onClick={() => setGpsFlyTo({ lat: Number(item.lat), lng: Number(item.lng) })}
                        sx={{ cursor: 'pointer', p: 2, borderRadius: 3, bgcolor: '#ffffff', borderLeft: `4px solid ${borderColor}`, borderTop: '1px solid #f1f5f9', borderRight: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', boxShadow: '0 4px 12px rgba(15,23,42,0.02)', transition: 'all 0.2s', '&:hover': { transform: 'translateX(4px)', boxShadow: '0 8px 24px rgba(15,23,42,0.06)' } }}
                      >
                        <Stack spacing={1}>
                          <Typography fontWeight={700} sx={{ textTransform: 'capitalize' }}>{item.disaster_type || item.disasterType} Alert</Typography>
                          <Typography variant="caption" color="text.secondary">Coordinates: {Number(item.lat).toFixed(4)}, {Number(item.lng).toFixed(4)}</Typography>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="caption" color="text.secondary">{new Date(item.created_at || Date.now()).toLocaleDateString()}</Typography>
                            <Chip label={item.severity || 'Medium'} size="small" color={chipColor} sx={{ textTransform: 'capitalize' }} />
                          </Stack>
                        </Stack>
                      </Paper>
                    );
                  }) : (
                    <Typography variant="body2" color="text.secondary">No active alerts at this time.</Typography>
                  )}
                </Stack>
              </Paper>

              <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 18px 40px rgba(15,23,42,0.08)' }}>
                <Box sx={{ p: 3, m: -3, mb: 3, borderRadius: '16px 16px 0 0', background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)', color: 'white' }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Typography variant="h6" fontWeight={800}>Weather Overview</Typography>
                    <Button size="small" sx={{ color: '#93c5fd' }}>View Details</Button>
                  </Stack>
              {weatherData ? (
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff' }}>
                        {getWeatherCondition(weatherData.current.weather_code).icon}
                      </Avatar>
                      <Box>
                        <Typography fontWeight={700}>{Math.round(weatherData.current.temperature_2m)}°C</Typography>
                    <Typography variant="caption" sx={{ color: '#bfdbfe' }}>
                          {getWeatherCondition(weatherData.current.weather_code).label}
                        </Typography>
                      </Box>
                    </Stack>
              ) : (
                <Typography variant="body2" sx={{ color: '#bfdbfe' }}>Loading weather data...</Typography>
              )}
                </Box>
            
            {weatherData && (
              <Grid container spacing={1}>
                {weatherData.daily.time.slice(0, 4).map((time, idx) => {
                  const date = new Date(time);
                  const dayName = idx === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' });
                  return (
                    <Grid item xs={3} key={time}>
                      <Paper sx={{ p: 1, textAlign: 'center', borderRadius: 2, bgcolor: '#f8fafc', border: '1px solid #f1f5f9' }}>
                        <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>{dayName}</Typography>
                        <Typography variant="subtitle2">{Math.round(weatherData.daily.temperature_2m_max[idx])}°C</Typography>
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
                )}
              </Paper>

              <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 18px 40px rgba(15,23,42,0.08)' }}>
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
