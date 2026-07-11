import React, { useEffect, useState } from 'react';
import {
  Box, Container, Grid, Paper, Stack, Typography, Chip, Button, Checkbox, 
  Select, MenuItem, Divider, Tabs, Tab
} from '@mui/material';
import {
  LocationOnRounded as LocationOnIcon,
  WarningRounded as WarningIcon,
  GroupsRounded as GroupsIcon,
  HomeWorkRounded as HomeWorkIcon,
  MapRounded as MapIcon,
  CloudQueueRounded as CloudIcon,
  AddLocationAltRounded as AddLocationIcon,
  ShareRounded as ShareIcon,
  UpdateRounded as UpdateIcon,
  InfoRounded as InfoIcon
} from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polygon } from 'react-leaflet';
import { fetchAlerts } from '../api/client';
import GeofenceAlert from '../components/GeofenceAlert';

const HIMACHAL_CENTER = [31.1048, 77.1734];
const HIMACHAL_BOUNDS = [
  [29.0, 74.0], // SW
  [34.5, 80.5], // NE
];

// Fix leaflet default marker icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Mock Data matching the UI
const LAYERS = [
  { id: 'disaster', label: 'Disaster Zones', icon: <WarningIcon fontSize="small" sx={{ color: '#ef4444' }} />, color: '#ef4444', checked: true },
  { id: 'warning', label: 'Warning Pins', icon: <LocationOnIcon fontSize="small" sx={{ color: '#f59e0b' }} />, color: '#f59e0b', checked: true },
  { id: 'rescue', label: 'Rescue Teams', icon: <GroupsIcon fontSize="small" sx={{ color: '#3b82f6' }} />, color: '#3b82f6', checked: true },
  { id: 'relief', label: 'Relief Camps', icon: <HomeWorkIcon fontSize="small" sx={{ color: '#10b981' }} />, color: '#10b981', checked: true },
  { id: 'road', label: 'Road Conditions', icon: <MapIcon fontSize="small" sx={{ color: '#8b5cf6' }} />, color: '#8b5cf6', checked: true },
  { id: 'river', label: 'River / Water Level', icon: <CloudIcon fontSize="small" sx={{ color: '#0ea5e9' }} />, color: '#0ea5e9', checked: false },
  { id: 'helipads', label: 'Helipads', icon: <LocationOnIcon fontSize="small" sx={{ color: '#0f172a' }} />, color: '#0f172a', checked: false },
];

const createMarkerIcon = (color, icon) => {
  return L.divIcon({
    className: 'custom-severity-marker',
    html: `<div style="background-color: ${color}; width: 28px; height: 28px; border-radius: 50%; border: 2px solid white; box-shadow: 0 4px 8px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; font-size: 14px; color: white;">${icon}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
};

export default function IncidentMapPage() {
  const [layers, setLayers] = useState(LAYERS);
  const [maskPositions, setMaskPositions] = useState(null);
  const [alertsData, setAlertsData] = useState([]);
  const [intelData, setIntelData] = useState([]);
  const [mapView, setMapView] = useState('terrain');

  useEffect(() => {
    const mandiAlerts = [
      { disaster_type: 'Massive Landslide', severity: 'High', lat: 31.7087, lng: 76.9320, created_at: new Date().toISOString() },
      { disaster_type: 'Road Block (Debris)', severity: 'Medium', lat: 31.7095, lng: 76.9335, created_at: new Date(Date.now() - 3600000).toISOString() },
      { disaster_type: 'Rescue Operation', severity: 'High', lat: 31.7102, lng: 76.9310, created_at: new Date(Date.now() - 7200000).toISOString() }
    ];

    fetchAlerts().then(data => {
      setAlertsData([...mandiAlerts, ...(data || [])]);
    }).catch(e => {
      console.error(e);
      setAlertsData(mandiAlerts); // Fallback to mock data if backend is offline
    });
    import('../api/client').then(({ fetchIntelPins }) => {
      fetchIntelPins().then(data => setIntelData(data || [])).catch(e => console.error(e));
    });

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
        // Outer shape is world bounds, inner hole is the HP border
        setMaskPositions([worldBounds, ...hpRings]);
      })
      .catch(e => console.error("Failed to load map bounds:", e));
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
        backgroundImage: 'url(/mountain-map.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'top',
        pt: 8, pb: 4, px: 4
      }}>
        {/* Hero text removed as requested */}
      </Box>

      {/* 3. MAIN CONTENT GRID */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          
          {/* LEFT COLUMN: Map Layers & Filters */}
          <Grid item xs={12} md={3} lg={2.5}>
            <Stack spacing={3}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid #e2e8f0' }}>
                <Typography variant="subtitle2" fontWeight={800} color="#0f172a" mb={2}>Map Layers</Typography>
                <Stack spacing={0.5}>
                  {layers.map((layer) => (
                    <Box key={layer.id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 0.5 }}>
                      <Checkbox 
                        size="small" 
                        checked={layer.checked} 
                        onChange={() => handleLayerChange(layer.id)}
                        sx={{ p: 0.5, color: '#cbd5e1', '&.Mui-checked': { color: '#0f4a30' } }} 
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 0.5, px: 1, borderRadius: 1, bgcolor: `${layer.color}15` }}>
                        {layer.icon}
                      </Box>
                      <Typography variant="body2" fontWeight={600} color="#475569">{layer.label}</Typography>
                    </Box>
                  ))}
                </Stack>
              </Paper>

              <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid #e2e8f0' }}>
                <Typography variant="subtitle2" fontWeight={800} color="#0f172a" mb={2}>Filter by District</Typography>
                <Select fullWidth size="small" value="all" sx={{ bgcolor: '#f8fafc', fontWeight: 600, color: '#475569' }}>
                  <MenuItem value="all">All Districts</MenuItem>
                  <MenuItem value="kullu">Kullu</MenuItem>
                  <MenuItem value="mandi">Mandi</MenuItem>
                  <MenuItem value="shimla">Shimla</MenuItem>
                </Select>
              </Paper>

              <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid #e2e8f0' }}>
                <Typography variant="subtitle2" fontWeight={800} color="#0f172a" mb={2}>Quick Actions</Typography>
                <Stack spacing={1.5}>
                  <Button variant="outlined" startIcon={<AddLocationIcon />} sx={{ color: '#0f4a30', borderColor: '#0f4a30', bgcolor: '#f0fdf4', fontWeight: 700, justifyContent: 'flex-start', px: 2, py: 1, borderRadius: 2 }}>
                    Add Warning Pin
                  </Button>
                  <Button variant="outlined" startIcon={<ShareIcon />} sx={{ color: '#0f4a30', borderColor: '#cbd5e1', fontWeight: 700, justifyContent: 'flex-start', px: 2, py: 1, borderRadius: 2, '&:hover': { bgcolor: '#f8fafc' } }}>
                    Share Map
                  </Button>
                </Stack>
              </Paper>

              <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid #e2e8f0' }}>
                <Typography variant="subtitle2" fontWeight={800} color="#0f172a" mb={2}>Legend</Typography>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <WarningIcon fontSize="small" sx={{ color: '#ef4444' }} />
                    <Typography variant="body2" fontWeight={600} color="#475569">High Alert Zone</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <LocationOnIcon fontSize="small" sx={{ color: '#f59e0b' }} />
                    <Typography variant="body2" fontWeight={600} color="#475569">Warning / Advisory</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <GroupsIcon fontSize="small" sx={{ color: '#3b82f6' }} />
                    <Typography variant="body2" fontWeight={600} color="#475569">Rescue Team</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <HomeWorkIcon fontSize="small" sx={{ color: '#10b981' }} />
                    <Typography variant="body2" fontWeight={600} color="#475569">Relief Camp</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <MapIcon fontSize="small" sx={{ color: '#8b5cf6' }} />
                    <Typography variant="body2" fontWeight={600} color="#475569">Road Block / Issue</Typography>
                  </Box>
                </Stack>
              </Paper>
            </Stack>
          </Grid>

          {/* CENTER COLUMN: Leaflet Map */}
          <Grid item xs={12} md={6} lg={6.5}>
            <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #e2e8f0', height: 500, overflow: 'hidden', position: 'relative' }}>
              <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 400 }}>
                <Select size="small" value={mapView} onChange={(e) => setMapView(e.target.value)} sx={{ bgcolor: '#fff', fontWeight: 700, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                  <MenuItem value="terrain">Terrain View</MenuItem>
                  <MenuItem value="satellite">Satellite View</MenuItem>
                </Select>
              </Box>
              
              <MapContainer center={[31.5, 77.2]} zoom={7} minZoom={7} maxZoom={16} maxBounds={HIMACHAL_BOUNDS} maxBoundsViscosity={0.8} style={{ height: '100%', width: '100%', zIndex: 1, backgroundColor: '#ffffff' }}>
                <TileLayer 
                  key={mapView}
                  url={mapView === 'terrain' 
                    ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
                    : "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"} 
                  attribution="Tiles &copy; Esri" 
                />
                <GeofenceAlert alerts={alertsData} />
                
                {/* Labels and boundaries overlay for Satellite view */}
                {mapView === 'satellite' && (
                  <TileLayer 
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
                  />
                )}
                
                {/* Inverted Polygon to mask everything outside Himachal Pradesh */}
                {maskPositions && (
                  <Polygon 
                    positions={maskPositions} 
                    pathOptions={{ fillColor: '#ffffff', fillOpacity: 0.95, color: '#0f4a30', weight: 4, opacity: 0.9 }} 
                  />
                )}

                {/* Live Database Markers */}
                {alertsData.filter(a => a && a.lat && a.lng).map((alert, i) => {
                  const isHigh = alert.severity === 'High';
                  const showDisaster = layers.find(l => l.id === 'disaster')?.checked;
                  const showWarning = layers.find(l => l.id === 'warning')?.checked;
                  
                  if (isHigh && !showDisaster) return null;
                  if (!isHigh && !showWarning) return null;

                  let iconEmoji = isHigh ? '🚨' : '⚠️';
                  let iconColor = isHigh ? '#ef4444' : '#f59e0b';
                  const dType = (alert.disaster_type || '').toLowerCase();
                  if (dType.includes('road') || dType.includes('block')) {
                    iconEmoji = '🚧';
                    iconColor = '#8b5cf6'; // Purple road color
                  } else if (dType.includes('rescue')) {
                    iconEmoji = '👥';
                    iconColor = '#3b82f6'; // Blue rescue color
                  }
                  
                  return (
                    <Marker 
                      key={`alert-${i}`} 
                      position={[alert.lat, alert.lng]} 
                      icon={createMarkerIcon(iconColor, iconEmoji)} 
                    >
                      <Popup>
                        <b>{alert.disaster_type}</b><br/>Severity: {alert.severity}
                      </Popup>
                    </Marker>
                  );
                })}
                
                {intelData.filter(a => a && a.lat && a.lon).map((intel, i) => {
                  const dept = (intel.department || '').toLowerCase();
                  const note = (intel.note || '').toLowerCase();
                  const searchStr = `${dept} ${note}`;
                  
                  const isRescue = dept.includes('ndrf') || dept.includes('sdrf') || searchStr.includes('rescue');
                  const isRelief = dept.includes('medical') || dept.includes('health') || searchStr.includes('relief') || searchStr.includes('camp');
                  const isRoad = searchStr.includes('road') || searchStr.includes('block') || searchStr.includes('bridge') || searchStr.includes('landslide');
                  const isRiver = searchStr.includes('water') || searchStr.includes('river') || searchStr.includes('flood') || searchStr.includes('dam');
                  const isHelipad = searchStr.includes('helipad') || searchStr.includes('chopper');
                  
                  const showRescue = layers.find(l => l.id === 'rescue')?.checked;
                  const showRelief = layers.find(l => l.id === 'relief')?.checked;
                  const showRoad = layers.find(l => l.id === 'road')?.checked;
                  const showRiver = layers.find(l => l.id === 'river')?.checked;
                  const showHelipad = layers.find(l => l.id === 'helipads')?.checked;
                  
                  let shouldShow = false;
                  let iconProps = ['#f59e0b', '📍']; // Default fallback

                  if (isHelipad) {
                    if (showHelipad) shouldShow = true;
                    iconProps = ['#0f172a', '🚁'];
                  } else if (isRiver) {
                    if (showRiver) shouldShow = true;
                    iconProps = ['#0ea5e9', '🌊'];
                  } else if (isRoad) {
                    if (showRoad) shouldShow = true;
                    iconProps = ['#8b5cf6', '🚧'];
                  } else if (isRelief) {
                    if (showRelief) shouldShow = true;
                    iconProps = ['#10b981', '🏥'];
                  } else {
                    if (showRescue) shouldShow = true;
                    iconProps = ['#3b82f6', '👥'];
                  }
                  
                  if (!shouldShow) return null;
                  
                  return (
                    <Marker 
                      key={`intel-${i}`} 
                      position={[intel.lat, intel.lon]} 
                      icon={createMarkerIcon(iconProps[0], iconProps[1])} 
                    >
                      <Popup>
                        <b>{intel.department}</b><br/>{intel.note}
                      </Popup>
                    </Marker>
                  );
                })}

                {/* Removed mock markers */}
              </MapContainer>
            </Paper>
          </Grid>

          {/* RIGHT COLUMN: Alerts & Info */}
          <Grid item xs={12} md={3} lg={3}>
            <Stack spacing={3} sx={{ height: '100%' }}>
              
              {/* Active Alerts List */}
              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="subtitle2" fontWeight={800} color="#0f172a">Active Alerts</Typography>
                  <Typography variant="caption" fontWeight={700} color="#0f4a30" sx={{ cursor: 'pointer' }}>View All</Typography>
                </Stack>
                <Stack spacing={2}>
                  {alertsData.length === 0 ? (
                    <Typography variant="body2" color="#64748b" textAlign="center" py={4}>No active alerts at the moment.</Typography>
                  ) : (
                    alertsData.slice(0, 5).map((alert, i) => {
                      const isHigh = alert.severity === 'High';
                      return (
                        <Paper key={i} elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: isHigh ? '#fef2f2' : '#fffbeb', border: `1px solid ${isHigh ? '#fecaca' : '#fde68a'}` }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
                            <Box sx={{ display: 'flex', gap: 1.5 }}>
                              <WarningIcon fontSize="small" sx={{ color: isHigh ? '#ef4444' : '#f59e0b', mt: 0.2 }} />
                              <Box>
                                <Typography variant="subtitle2" fontWeight={800} color={isHigh ? '#7f1d1d' : '#92400e'}>{alert.disaster_type} Warning</Typography>
                              </Box>
                            </Box>
                            <Chip label={alert.severity || 'Medium'} size="small" sx={{ bgcolor: isHigh ? '#fecaca' : '#fde68a', color: isHigh ? '#991b1b' : '#92400e', fontWeight: 800, fontSize: '0.65rem', height: 20 }} />
                          </Stack>
                          <Typography variant="caption" color={isHigh ? '#991b1b' : '#b45309'} sx={{ pl: 4 }}>
                            {new Date(alert.created_at || Date.now()).toLocaleString()}
                          </Typography>
                        </Paper>
                      );
                    })
                  )}
                </Stack>
              </Box>

              <Divider />

              {/* Quick Information */}
              <Box>
                <Typography variant="subtitle2" fontWeight={800} color="#0f172a" mb={2}>Quick Information</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Paper elevation={0} sx={{ p: 1.5, borderRadius: 2, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <MapIcon sx={{ color: '#0f4a30', fontSize: 16 }} />
                        <Typography variant="caption" fontWeight={600} color="#475569">Active Districts</Typography>
                      </Box>
                      <Typography variant="subtitle2" fontWeight={800} color="#0f172a">0</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper elevation={0} sx={{ p: 1.5, borderRadius: 2, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <GroupsIcon sx={{ color: '#0f4a30', fontSize: 16 }} />
                        <Typography variant="caption" fontWeight={600} color="#475569">Rescue Teams</Typography>
                      </Box>
                      <Typography variant="subtitle2" fontWeight={800} color="#0f172a">0</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper elevation={0} sx={{ p: 1.5, borderRadius: 2, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <GroupsIcon sx={{ color: '#0f4a30', fontSize: 16 }} />
                        <Typography variant="caption" fontWeight={600} color="#475569">Affected People</Typography>
                      </Box>
                      <Typography variant="subtitle2" fontWeight={800} color="#0f172a">0</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper elevation={0} sx={{ p: 1.5, borderRadius: 2, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <HomeWorkIcon sx={{ color: '#0f4a30', fontSize: 16 }} />
                        <Typography variant="caption" fontWeight={600} color="#475569">Relief Camps</Typography>
                      </Box>
                      <Typography variant="subtitle2" fontWeight={800} color="#0f172a">0</Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>

            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
