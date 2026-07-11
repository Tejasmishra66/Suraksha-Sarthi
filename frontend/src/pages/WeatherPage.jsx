import React, { useEffect, useState } from 'react';
import {
  Box, Container, Grid, Paper, Stack, Typography, Chip, Checkbox, 
  Select, MenuItem, Divider, Tabs, Tab
} from '@mui/material';
import {
  WarningRounded as WarningIcon,
  CloudQueueRounded as CloudIcon,
  WaterDropRounded as WaterIcon,
  AirRounded as WindIcon,
  ThermostatRounded as TempIcon,
  MapRounded as MapIcon,
} from '@mui/icons-material';
import { MapContainer, TileLayer, Polygon, Circle } from 'react-leaflet';
import L from 'leaflet';
import { fetchWeatherData, fetchRainViewerTime, getWeatherInfo } from '../utils/weatherUtils';

const HIMACHAL_BOUNDS = [
  [30.2, 75.6],
  [33.5, 79.6],
];

const WEATHER_FORECAST = [
  { day: 'Today', temp: '12°C', desc: 'Light Rain', icon: '🌧️', precip: '80%', wind: '10 km/h' },
  { day: 'Tue', temp: '14°C', desc: 'Partly Cloudy', icon: '⛅', precip: '20%', wind: '8 km/h' },
  { day: 'Wed', temp: '13°C', desc: 'Showers', icon: '🌧️', precip: '90%', wind: '15 km/h' },
  { day: 'Thu', temp: '16°C', desc: 'Sunny Intervals', icon: '⛅', precip: '10%', wind: '5 km/h' },
  { day: 'Fri', temp: '17°C', desc: 'Sunny', icon: '☀️', precip: '0%', wind: '4 km/h' },
  { day: 'Sat', temp: '15°C', desc: 'Mostly Cloudy', icon: '☁️', precip: '30%', wind: '12 km/h' },
  { day: 'Sun', temp: '11°C', desc: 'Heavy Rain', icon: '⛈️', precip: '95%', wind: '20 km/h' },
];

const WEATHER_LAYERS = [
  { id: 'radar', label: 'Precipitation Radar', icon: <WaterIcon fontSize="small" sx={{ color: '#3b82f6' }} />, color: '#3b82f6', checked: true },
  { id: 'temp', label: 'Temperature Map', icon: <TempIcon fontSize="small" sx={{ color: '#ef4444' }} />, color: '#ef4444', checked: false },
  { id: 'wind', label: 'Wind Speed', icon: <WindIcon fontSize="small" sx={{ color: '#8b5cf6' }} />, color: '#8b5cf6', checked: false },
  { id: 'clouds', label: 'Cloud Cover', icon: <CloudIcon fontSize="small" sx={{ color: '#94a3b8' }} />, color: '#94a3b8', checked: false },
];

export default function WeatherPage() {
  const [tabValue, setTabValue] = useState(0);
  const [layers, setLayers] = useState(WEATHER_LAYERS);
  const [maskPositions, setMaskPositions] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [radarTime, setRadarTime] = useState(null);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/udit-001/india-maps-data/main/geojson/himachal-pradesh.geojson')
      .then(res => res.json())
      .then(data => {
        if (!data || !data.features || !data.features[0]) return;
        const feature = data.features[0];
        const extractRings = (coords, type) => {
           if (type === 'Polygon') {
               return coords.map(ring => ring.map(c => [c[1], c[0]]));
           } else if (type === 'MultiPolygon') {
               let allRings = [];
               coords.forEach(poly => {
                   poly.forEach(ring => allRings.push(ring.map(c => [c[1], c[0]])));
               });
               return allRings;
           }
           return [];
        };
        const hpRings = extractRings(feature.geometry.coordinates, feature.geometry.type);
        const worldBounds = [
          [-90, -180], [90, -180], [90, 180], [-90, 180]
        ];
        setMaskPositions([worldBounds, ...hpRings]);
      })
      .catch(e => console.error("Failed to load map bounds:", e));

    async function loadLiveData() {
      const wData = await fetchWeatherData();
      if (wData) setWeatherData(wData);
      
      const rTime = await fetchRainViewerTime();
      if (rTime) setRadarTime(rTime);
    }
    loadLiveData();
  }, []);

  const handleLayerChange = (id) => {
    setLayers(layers.map(l => l.id === id ? { ...l, checked: !l.checked } : l));
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f4f6f8', fontFamily: "'Inter', sans-serif" }}>
      
      {/* 1. HERO SECTION */}
      <Box sx={{ 
        position: 'relative',
        height: 450,
        backgroundImage: 'url(/mountain-weather.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'top',
        pt: 8, pb: 4, px: 4
      }}>
      </Box>

      {/* 2. TAB NAVIGATION BAR */}
      <Container maxWidth="xl" sx={{ mt: -3, position: 'relative', zIndex: 2 }}>
        <Paper elevation={2} sx={{ borderRadius: 2, bgcolor: '#fff', overflow: 'hidden' }}>
          <Tabs 
            value={tabValue} 
            onChange={(e, v) => setTabValue(v)} 
            variant="scrollable"
            sx={{ 
              '& .MuiTab-root': { py: 2, px: 4, fontWeight: 700, color: '#64748b', minHeight: 64 },
              '& .Mui-selected': { color: '#0f4a30 !important' },
              '& .MuiTabs-indicator': { bgcolor: '#0f4a30', height: 3 }
            }}
          >
            <Tab icon={<CloudIcon fontSize="small" />} iconPosition="start" label="Weather Overview" />
            <Tab icon={<MapIcon fontSize="small" />} iconPosition="start" label="Interactive Map" />
            <Tab icon={<WarningIcon fontSize="small" />} iconPosition="start" label="IMD Warnings" />
          </Tabs>
        </Paper>
      </Container>

      {/* 3. MAIN CONTENT GRID */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        
        {/* TAB 0: WEATHER OVERVIEW */}
        {tabValue === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8} lg={9}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #e2e8f0', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'linear-gradient(135deg, #0f4a30 0%, #175e3c 100%)', color: '#fff' }}>
                    <Typography variant="h6" fontWeight={700} mb={2} color="rgba(255,255,255,0.8)">Current Weather, Shimla</Typography>
                    <Stack direction="row" alignItems="center" spacing={3} mb={3}>
                      <Typography fontSize="4.5rem" lineHeight={1}>
                        {weatherData ? getWeatherInfo(weatherData.current.weather_code).icon : '☁️'}
                      </Typography>
                      <Box>
                        <Typography variant="h2" fontWeight={800}>
                          {weatherData ? `${Math.round(weatherData.current.temperature_2m)}°C` : '--°C'}
                        </Typography>
                        <Typography variant="subtitle1" fontWeight={600} color="rgba(255,255,255,0.9)">
                          {weatherData ? getWeatherInfo(weatherData.current.weather_code).desc : 'Loading...'}
                        </Typography>
                      </Box>
                    </Stack>
                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', mb: 2 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="caption" color="rgba(255,255,255,0.7)" display="block">Humidity</Typography>
                        <Typography variant="body2" fontWeight={700}>{weatherData ? `${weatherData.current.relative_humidity_2m}%` : '--'}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="rgba(255,255,255,0.7)" display="block">Wind</Typography>
                        <Typography variant="body2" fontWeight={700}>{weatherData ? `${Math.round(weatherData.current.wind_speed_10m)} km/h` : '--'}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="rgba(255,255,255,0.7)" display="block">Cloud Cover</Typography>
                        <Typography variant="body2" fontWeight={700}>{weatherData ? `${weatherData.current.cloud_cover}%` : '--'}</Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={8}>
                  <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0', height: '100%' }}>
                    <Typography variant="subtitle1" fontWeight={800} color="#0f172a" mb={3}>7-Day Forecast</Typography>
                    <Grid container spacing={2}>
                      {weatherData && weatherData.daily ? weatherData.daily.time.slice(0, 7).map((dateStr, idx) => {
                        const date = new Date(dateStr);
                        const dayName = idx === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' });
                        const code = weatherData.daily.weather_code[idx];
                        const maxT = Math.round(weatherData.daily.temperature_2m_max[idx]);
                        const precipProb = weatherData.daily.precipitation_probability_max[idx];
                        
                        return (
                          <Grid item xs key={idx}>
                            <Box sx={{ textAlign: 'center', p: 1.5, borderRadius: 2, bgcolor: idx === 0 ? '#f0fdf4' : 'transparent', border: idx === 0 ? '1px solid #bbf7d0' : '1px solid transparent', transition: 'all 0.2s', '&:hover': { bgcolor: '#f8fafc' } }}>
                              <Typography variant="caption" fontWeight={800} color={idx === 0 ? '#0f4a30' : '#475569'} display="block">{dayName}</Typography>
                              <Typography fontSize="1.8rem" my={1} display="block">{getWeatherInfo(code).icon}</Typography>
                              <Typography variant="subtitle2" fontWeight={800} color="#0f172a">{maxT}°C</Typography>
                              <Typography variant="caption" color="#64748b" display="block" mt={1}>💧 {precipProb}%</Typography>
                            </Box>
                          </Grid>
                        );
                      }) : WEATHER_FORECAST.map((forecast, idx) => (
                        <Grid item xs key={idx}>
                          <Box sx={{ textAlign: 'center', p: 1.5, borderRadius: 2, bgcolor: idx === 0 ? '#f0fdf4' : 'transparent', border: idx === 0 ? '1px solid #bbf7d0' : '1px solid transparent', transition: 'all 0.2s', '&:hover': { bgcolor: '#f8fafc' } }}>
                            <Typography variant="caption" fontWeight={800} color={idx === 0 ? '#0f4a30' : '#475569'} display="block">{forecast.day}</Typography>
                            <Typography fontSize="1.8rem" my={1} display="block">{forecast.icon}</Typography>
                            <Typography variant="subtitle2" fontWeight={800} color="#0f172a">{forecast.temp}</Typography>
                            <Typography variant="caption" color="#64748b" display="block" mt={1}>💧 {forecast.precip}</Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} md={4} lg={3}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0', height: '100%' }}>
                <Typography variant="subtitle2" fontWeight={800} color="#0f172a" mb={2}>Current Conditions</Typography>
                <Stack spacing={2}>
                   <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <Typography variant="caption" color="#64748b" fontWeight={600}>UV Index Max</Typography>
                     <Chip label={weatherData && weatherData.daily ? weatherData.daily.uv_index_max[0] : 'Loading...'} size="small" sx={{ bgcolor: '#fef3c7', color: '#92400e', fontWeight: 800, fontSize: '0.7rem' }} />
                   </Box>
                   <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <Typography variant="caption" color="#64748b" fontWeight={600}>Sunrise</Typography>
                     <Typography variant="caption" fontWeight={800} color="#0f172a">
                       {weatherData && weatherData.daily ? new Date(weatherData.daily.sunrise[0]).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--'}
                     </Typography>
                   </Box>
                   <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <Typography variant="caption" color="#64748b" fontWeight={600}>Sunset</Typography>
                     <Typography variant="caption" fontWeight={800} color="#0f172a">
                       {weatherData && weatherData.daily ? new Date(weatherData.daily.sunset[0]).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--'}
                     </Typography>
                   </Box>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* TAB 1: INTERACTIVE MAP */}
        {tabValue === 1 && (
          <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #e2e8f0', height: '70vh', overflow: 'hidden', position: 'relative' }}>
            <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 400, display: 'flex', gap: 1 }}>
              <Select size="small" value="terrain" sx={{ bgcolor: '#fff', fontWeight: 700, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                <MenuItem value="terrain">Terrain Map</MenuItem>
                <MenuItem value="satellite">Satellite Map</MenuItem>
              </Select>
            </Box>
            
            <Paper sx={{ position: 'absolute', bottom: 24, left: 24, zIndex: 400, p: 2, borderRadius: 2, width: 220, bgcolor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(5px)' }}>
              <Typography variant="caption" fontWeight={800} color="#0f172a" mb={1} display="block">Weather Overlays</Typography>
              <Stack spacing={0}>
                {layers.map((layer) => (
                  <Box key={layer.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.2 }}>
                    <Checkbox 
                      size="small" 
                      checked={layer.checked} 
                      onChange={() => handleLayerChange(layer.id)}
                      sx={{ p: 0.5, color: '#cbd5e1', '&.Mui-checked': { color: layer.color } }} 
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 0.5, borderRadius: 1, bgcolor: `${layer.color}15` }}>
                      {layer.icon}
                    </Box>
                    <Typography variant="caption" fontWeight={700} color="#475569">{layer.label}</Typography>
                  </Box>
                ))}
              </Stack>
            </Paper>
            
            <MapContainer center={[31.8, 77.2]} zoom={7} minZoom={7} maxZoom={12} maxBounds={HIMACHAL_BOUNDS} maxBoundsViscosity={1.0} style={{ height: '100%', width: '100%', zIndex: 1, backgroundColor: '#ffffff' }}>
              <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}" attribution="Tiles &copy; Esri" />
              {maskPositions && (
                <Polygon 
                  positions={maskPositions} 
                  pathOptions={{ fillColor: '#ffffff', fillOpacity: 0.85, color: '#0f4a30', weight: 3, opacity: 0.8 }} 
                />
              )}
              
              {layers.find(l => l.id === 'radar')?.checked && radarTime && (
                <TileLayer 
                  url={`https://tilecache.rainviewer.com/v2/radar/${radarTime}/256/{z}/{x}/{y}/2/1_1.png`}
                  opacity={0.8}
                  zIndex={100}
                  maxNativeZoom={6}
                />
              )}
              
              {layers.find(l => l.id === 'radar')?.checked && !radarTime && (
                <>
                  <Circle center={[31.9, 77.5]} radius={30000} pathOptions={{ color: 'transparent', fillColor: '#3b82f6', fillOpacity: 0.4 }} />
                  <Circle center={[31.4, 76.9]} radius={45000} pathOptions={{ color: 'transparent', fillColor: '#10b981', fillOpacity: 0.3 }} />
                  <Circle center={[32.2, 76.3]} radius={25000} pathOptions={{ color: 'transparent', fillColor: '#ef4444', fillOpacity: 0.5 }} />
                </>
              )}
            </MapContainer>
          </Paper>
        )}

        {/* TAB 2: IMD WARNINGS */}
        {tabValue === 2 && (
          <Container maxWidth="md">
            <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#fef2f2' }}>
              <Stack direction="row" alignItems="center" gap={1.5} mb={3}>
                <WarningIcon sx={{ color: '#ef4444', fontSize: '2rem' }} />
                <Typography variant="h6" fontWeight={800} color="#991b1b">Severe Weather Alerts</Typography>
              </Stack>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="subtitle2" fontWeight={800} color="#7f1d1d" display="block">Heavy Rainfall / Flash Flood</Typography>
                  <Typography variant="body2" color="#991b1b" mt={0.5}>Expected in Kullu, Mandi, and Kangra over the next 48 hours. Stay away from river banks and low-lying areas. Follow local authorities' instructions.</Typography>
                  <Typography variant="caption" color="#dc2626" fontWeight={700} display="block" mt={1}>Issued by IMD at 10:00 AM Today</Typography>
                </Box>
                <Divider sx={{ borderColor: '#fecaca' }} />
                <Box>
                  <Typography variant="subtitle2" fontWeight={800} color="#7f1d1d" display="block">Landslide Advisory</Typography>
                  <Typography variant="body2" color="#991b1b" mt={0.5}>NH-5 near Shimla is highly susceptible to landslides due to continuous precipitation. Avoid travel unless strictly necessary.</Typography>
                  <Typography variant="caption" color="#dc2626" fontWeight={700} display="block" mt={1}>Issued by IMD at 08:30 AM Today</Typography>
                </Box>
              </Stack>
            </Paper>
          </Container>
        )}

      </Container>
    </Box>
  );
}
