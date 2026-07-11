import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Typography, Button, Paper, Avatar, Stack, Chip, Divider, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { fetchBulletins, fetchAlerts } from '../api/client';
import { fetchWeatherData, getWeatherInfo } from '../utils/weatherUtils';
import { motion } from 'framer-motion';

// Map Imports
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

function MapUpdater({ selectedAlert }) {
  const map = useMap();
  useEffect(() => {
    if (selectedAlert && selectedAlert.lat && selectedAlert.lng) {
      map.flyTo([selectedAlert.lat, selectedAlert.lng], 12, { duration: 1.5 });
    }
  }, [selectedAlert, map]);
  return null;
}

// Icons for Buttons
import ReportProblemRoundedIcon from '@mui/icons-material/ReportProblemRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CloudQueueRoundedIcon from '@mui/icons-material/CloudQueueRounded';

// Icons for How We Help
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import QrCodeScannerRoundedIcon from '@mui/icons-material/QrCodeScannerRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';

// Icons for Stats
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import ShieldIcon from '@mui/icons-material/Shield';
import MapIcon from '@mui/icons-material/Map';

// Icons for Alerts & Dial
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import PhoneInTalkRoundedIcon from '@mui/icons-material/PhoneInTalkRounded';
import LocalHospitalRoundedIcon from '@mui/icons-material/LocalHospitalRounded';
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded';
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded';
import DirectionsCarFilledRoundedIcon from '@mui/icons-material/DirectionsCarFilledRounded';
import RemoveRoadRoundedIcon from '@mui/icons-material/RemoveRoadRounded';

// Fix Leaflet Default Icon Issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const highIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

const medIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

const infoIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

const MotionPaper = motion(Paper);
const MotionGrid = motion(Grid);
const MotionBox = motion(Box);

export default function Homepage() {
  const [notices, setNotices] = useState([]);
  const [news, setNews] = useState([]);
  const [weather, setWeather] = useState(null);
  const [selectedAlert, setSelectedAlert] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchBulletins();
        const sorted = (data || []).sort((a, b) => new Date(b.created_at || b.timestamp) - new Date(a.created_at || a.timestamp));
        setNews(sorted.slice(0, 3));
      } catch (err) {
        console.error("Failed to load notices:", err);
      }
    }
    loadData();

    async function loadAlerts() {
      const mandiAlerts = [
        { id: 1, disaster_type: 'Massive Landslide', severity: 'High', lat: 31.7087, lng: 76.9320, created_at: new Date().toISOString(), radius_km: 5 },
        { id: 2, disaster_type: 'Road Block (Debris)', severity: 'Medium', lat: 31.7095, lng: 76.9335, created_at: new Date(Date.now() - 3600000).toISOString(), radius_km: 2 },
        { id: 3, disaster_type: 'Rescue Operation', severity: 'High', lat: 31.7102, lng: 76.9310, created_at: new Date(Date.now() - 7200000).toISOString(), radius_km: 1 }
      ];

      try {
        const data = await fetchAlerts();
        const combined = [...mandiAlerts, ...(data || [])];
        const sorted = combined.sort((a, b) => new Date(b.created_at || b.timestamp) - new Date(a.created_at || a.timestamp));
        setNotices(sorted.slice(0, 5)); // Keep up to 5 for the map
      } catch (err) {
        console.error("Failed to load alerts:", err);
        setNotices(mandiAlerts.slice(0, 5)); // Fallback to mock data
      }
    }
    loadAlerts();

    async function loadWeather() {
      const data = await fetchWeatherData();
      if (data && data.current) {
        setWeather(data.current);
      }
    }
    loadWeather();
  }, []);

  const emergencyContacts = [
    { label: 'Police', number: '112', icon: <PhoneInTalkRoundedIcon fontSize="large" />, color: '#3b82f6', bg: '#eff6ff' },
    { label: 'Ambulance', number: '108', icon: <LocalHospitalRoundedIcon fontSize="large" />, color: '#ef4444', bg: '#fee2e2' },
    { label: 'Fire Service', number: '101', icon: <LocalFireDepartmentRoundedIcon fontSize="large" />, color: '#f59e0b', bg: '#fef3c7' },
    { label: 'SDRF Helpline', number: '1070', icon: <SupportAgentRoundedIcon fontSize="large" />, color: '#10b981', bg: '#ecfdf5' },
  ];

  const howWeHelpCards = [
    { icon: <ReportProblemRoundedIcon sx={{ color: '#d32f2f', fontSize: 32 }} />, bg: '#fee2e2', title: 'Emergency Reporting', desc: 'Report disasters and get immediate help from nearest teams.', color: '#d32f2f', link: '/emergency' },
    { icon: <GroupsRoundedIcon sx={{ color: '#0f4a30', fontSize: 32 }} />, bg: '#e6f4ea', title: 'Volunteer Management', desc: 'Connect with trained volunteers and view skill-based teams.', color: '#0f4a30', link: '/volunteer' },
    { icon: <AssignmentRoundedIcon sx={{ color: '#3b82f6', fontSize: 32 }} />, bg: '#eff6ff', title: 'Field Reporting', desc: 'Submit verified reports with GPS, photos and offline support.', color: '#3b82f6', link: '/emergency' },
    { icon: <PlaceRoundedIcon sx={{ color: '#10b981', fontSize: 32 }} />, bg: '#ecfdf5', title: 'Live Map & Alerts', desc: 'View real-time alerts, warning pins and affected locations.', color: '#10b981', link: '/map' },
    { icon: <QrCodeScannerRoundedIcon sx={{ color: '#8b5cf6', fontSize: 32 }} />, bg: '#f3e8ff', title: 'Equipment Tracking', desc: 'Track equipment using QR code and view live availability.', color: '#8b5cf6', link: '/equipment' },
    { icon: <CampaignRoundedIcon sx={{ color: '#f59e0b', fontSize: 32 }} />, bg: '#fef3c7', title: 'Official Updates', desc: 'Stay informed with verified updates and department news.', color: '#f59e0b', link: '/updates' },
  ];

  const dosAndDonts = [
    {
      title: 'Landslide', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Landslide_in_Khandala.jpg/800px-Landslide_in_Khandala.jpg',
      dos: ['Prepare tour to hilly region according to information given by weather department.', 'Move away from landslide path or downstream valleys quickly.'],
      donts: ['Avoid construction and staying in vulnerable areas.', 'Do not panic and lose energy.']
    },
    {
      title: 'Flash Flood', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Flood_in_Brisbane_2011.jpg/800px-Flood_in_Brisbane_2011.jpg',
      dos: ['Move to higher ground immediately.', 'Turn off utilities at the main switches if instructed.'],
      donts: ['Do not walk through moving water.', 'Do not drive into flooded areas.']
    },
    {
      title: 'Earthquake', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Earthquake_damage_in_San_Francisco_1906.jpg/800px-Earthquake_damage_in_San_Francisco_1906.jpg',
      dos: ['Drop, Cover, and Hold on. Stay indoors until shaking stops.', 'If outdoors, move away from buildings and utility wires.'],
      donts: ['Do not use elevators during or after the earthquake.', 'Do not light a match in case of gas leaks.']
    },
    {
      title: 'Forest Fire', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Wildfire_in_California.jpg/800px-Wildfire_in_California.jpg',
      dos: ['Keep emergency contact numbers of district fire service handy.', 'Immediately inform authorities of unattended fires.'],
      donts: ['Do not burn municipal waste next to a forest area.', 'Do not discard lit matchsticks in the forest.']
    }
  ];

  return (
    <Box sx={{ width: '100%', fontFamily: "'Inter', sans-serif" }}>
      
      {/* 1. Hero Section */}
      <Box sx={{ 
        position: 'relative',
        height: { xs: 'auto', md: '750px' },
        minHeight: '650px',
        pt: { xs: 8, md: 16 },
        pb: { xs: 15, md: 20 },
        backgroundImage: 'url(/mountain-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        overflow: 'hidden'
      }}>
        <Container maxWidth="xl" sx={{ height: '100%', position: 'relative' }}>
          
          {/* Weather Indicator Widget */}
          <MotionPaper 
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, type: 'spring' }}
            component={RouterLink} to="/weather" elevation={0}
            sx={{
              position: 'absolute', top: { xs: 0, md: -16 }, right: 16,
              bgcolor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.25)', borderRadius: 4, p: 2,
              display: 'flex', alignItems: 'center', gap: 2, textDecoration: 'none',
              color: '#fff', transition: 'all 0.3s', cursor: 'pointer', zIndex: 10,
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.15)', transform: 'translateY(-5px)', boxShadow: '0 12px 40px rgba(0,0,0,0.5)' }
            }}
          >
            {weather ? (
              <>
                <Typography fontSize="2.5rem" lineHeight={1} sx={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>{getWeatherInfo(weather.weather_code).icon}</Typography>
                <Box>
                  <Typography variant="h5" fontWeight={800} color="#fff" sx={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>{Math.round(weather.temperature_2m)}°C</Typography>
                  <Typography variant="caption" fontWeight={600} color="rgba(255,255,255,0.9)" display="block">{getWeatherInfo(weather.weather_code).desc}</Typography>
                </Box>
                <Box sx={{ borderLeft: '1px solid rgba(255,255,255,0.3)', pl: 2, ml: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="caption" fontWeight={700} display="flex" alignItems="center" gap={0.5} color="#fff">
                       <CloudQueueRoundedIcon fontSize="small" /> Shimla
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#6ee7b7', mt: 0.5, fontWeight: 800, textShadow: '0 1px 5px rgba(0,0,0,0.5)' }}>View Details &rarr;</Typography>
                </Box>
              </>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                 <Typography variant="caption" color="rgba(255,255,255,0.8)">Loading weather...</Typography>
              </Box>
            )}
          </MotionPaper>

          <Grid container sx={{ height: '100%', position: 'relative', zIndex: 1 }}>
            <Grid item xs={12} md={8} lg={7}>
              <MotionBox initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
                <Typography variant="h1" sx={{ fontWeight: 900, color: '#ffffff', lineHeight: 1.1, mb: 1, letterSpacing: '-1.5px', textShadow: '0 4px 20px rgba(0,0,0,0.6)' }}>
                  Together, <span style={{ background: 'linear-gradient(90deg, #6ee7b7, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>We Rise.</span><br/>
                  Together, <span style={{ background: 'linear-gradient(90deg, #6ee7b7, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>We Save.</span>
                </Typography>
                <Typography variant="h6" sx={{ color: '#f8fafc', fontWeight: 500, mb: 5, pr: { md: 4 }, lineHeight: 1.6, mt: 3, maxWidth: 550, textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
                  SDRF Helping Hands is a unified platform for disaster response, coordination and real-time information sharing across Himachal Pradesh.
                </Typography>
                
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button 
                    variant="contained" component={RouterLink} to="/emergency" startIcon={<ReportProblemRoundedIcon />} 
                    sx={{ 
                      bgcolor: '#d32f2f', color: '#fff', px: 4, py: 1.8, borderRadius: '8px', fontWeight: 800, fontSize: '1.05rem',
                      boxShadow: '0 8px 25px rgba(211, 47, 47, 0.4)', animation: 'pulse 2s infinite',
                      '@keyframes pulse': { '0%': { boxShadow: '0 0 0 0 rgba(211, 47, 47, 0.7)' }, '70%': { boxShadow: '0 0 0 15px rgba(211, 47, 47, 0)' }, '100%': { boxShadow: '0 0 0 0 rgba(211, 47, 47, 0)' } },
                      '&:hover': { bgcolor: '#b71c1c', transform: 'translateY(-2px)' }, transition: 'all 0.2s'
                    }}
                  >
                    Report Emergency
                  </Button>
                  <Button 
                    variant="contained" component={RouterLink} to="/volunteer" startIcon={<GroupsRoundedIcon />} 
                    sx={{ 
                      bgcolor: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', 
                      px: 4, py: 1.8, borderRadius: '8px', fontWeight: 700, fontSize: '1.05rem', boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                      '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.25)', transform: 'translateY(-2px)' }, transition: 'all 0.2s'
                    }}
                  >
                    Join as Volunteer
                  </Button>
                </Stack>
              </MotionBox>
            </Grid>
          </Grid>
        </Container>

        {/* Custom SVG Wave Divider */}
        <Box sx={{ position: 'absolute', bottom: -2, left: 0, width: '100%', overflow: 'hidden', lineHeight: 0, zIndex: 2 }}>
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', width: '100%', height: '90px' }}>
              <path d="M0 120L48 105C96 90 192 60 288 45C384 30 480 30 576 45C672 60 768 90 864 100C960 110 1056 100 1152 80C1248 60 1344 30 1392 15L1440 0V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z" fill="#f8fafc"/>
            </svg>
        </Box>
      </Box>

      {/* 2. How We Help Section */}
      <Box sx={{ pt: 10, pb: 12, bgcolor: '#f8fafc' }}>
        <Container maxWidth="xl">
          <MotionBox initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} textAlign="center" mb={8} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h3" sx={{ color: '#0f172a', fontWeight: 900, letterSpacing: '-1px' }}>How We Help</Typography>
            <Box sx={{ width: 60, height: 5, background: 'linear-gradient(90deg, #10b981, #0f4a30)', mt: 2, borderRadius: 2 }} />
          </MotionBox>
          
          <Grid container spacing={4}>
            {howWeHelpCards.map((card, index) => (
              <MotionGrid item xs={12} sm={6} md={4} lg={2} key={index} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }}>
                <Paper elevation={0} sx={{ p: 3, height: '100%', borderRadius: 4, border: '1px solid #f1f5f9', bgcolor: '#ffffff', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)', borderColor: card.color } }}>
                  <Avatar sx={{ bgcolor: card.bg, width: 56, height: 56, mb: 3 }}>{card.icon}</Avatar>
                  <Typography variant="h6" fontWeight={800} sx={{ mb: 1.5, color: '#0f172a', lineHeight: 1.2 }}>{card.title}</Typography>
                  <Typography variant="body2" sx={{ color: '#475569', mb: 3, flexGrow: 1, lineHeight: 1.6 }}>{card.desc}</Typography>
                  <Button component={RouterLink} to={card.link} endIcon={<ArrowForwardRoundedIcon fontSize="small" />} sx={{ color: card.color, fontWeight: 800, fontSize: '0.9rem', p: 0, '&:hover': { bgcolor: 'transparent', gap: 1 } }} disableRipple>Explore</Button>
                </Paper>
              </MotionGrid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Live Alerts & Mini-Map */}
      <Box sx={{ py: 8, bgcolor: '#ffffff' }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h3" fontWeight={900} color="#0f172a" letterSpacing="-1px">Live Alerts Feed</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#fee2e2', px: 2, py: 0.5, borderRadius: 5 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#ef4444', animation: 'pulse 1.5s infinite' }} />
                <Typography variant="caption" fontWeight={800} color="#ef4444" sx={{ textTransform: 'uppercase', letterSpacing: '1px' }}>Live</Typography>
              </Box>
            </Box>
            <Button component={RouterLink} to="/map" endIcon={<ArrowForwardRoundedIcon fontSize="small" />} sx={{ color: '#0f4a30', fontWeight: 800, fontSize: '1rem', bgcolor: '#f8fafc', px: 2, py: 1, borderRadius: 3, '&:hover': { bgcolor: '#f1f5f9' } }}>
              Full Map
            </Button>
          </Box>

          <Grid container spacing={4}>
            {/* Alerts List */}
            <Grid item xs={12} md={7}>
              <Stack spacing={2} sx={{ maxHeight: '420px', overflowY: 'auto', pr: 2, pb: 1, '&::-webkit-scrollbar': { width: '6px' }, '&::-webkit-scrollbar-thumb': { bgcolor: '#cbd5e1', borderRadius: '4px' } }}>
                {notices.length === 0 ? (
                  <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>No active alerts.</Typography>
                ) : (
                  notices.map((alert, i) => {
                    const isHigh = alert.severity === 'high' || alert.severity === 'High';
                    const isMedium = alert.severity === 'medium' || alert.severity === 'Medium';
                    const icon = isHigh ? <ReportProblemRoundedIcon sx={{ color: '#991b1b', fontSize: 24 }} /> : isMedium ? <WarningAmberRoundedIcon sx={{ color: '#92400e', fontSize: 24 }} /> : <InfoRoundedIcon sx={{ color: '#065f46', fontSize: 24 }} />;
                    const borderColor = isHigh ? '#ef4444' : isMedium ? '#f59e0b' : '#10b981';

                    return (
                      <MotionPaper 
                        key={alert.id || i} elevation={0}
                        onClick={() => setSelectedAlert(alert)}
                        initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: i * 0.1 }}
                        sx={{ flexShrink: 0, p: 2, borderRadius: 3, border: '1px solid #e2e8f0', borderLeft: `5px solid ${borderColor}`, bgcolor: selectedAlert?.id === alert.id ? '#ffffff' : '#f8fafc', cursor: 'pointer', transition: 'all 0.3s', '&:hover': { transform: 'translateX(4px)', borderColor: borderColor, boxShadow: '0 8px 20px rgba(0,0,0,0.04)', bgcolor: '#ffffff' }, display: 'flex', gap: 2, alignItems: 'center', boxShadow: selectedAlert?.id === alert.id ? '0 8px 20px rgba(0,0,0,0.08)' : 'none' }}
                      >
                        <Box sx={{ p: 1.5, borderRadius: '50%', bgcolor: `${borderColor}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {icon}
                        </Box>
                        
                        <Box sx={{ flexGrow: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                            <Typography variant="subtitle1" fontWeight={800} color="#0f172a" lineHeight={1.2}>{alert.disaster_type}</Typography>
                            <Chip label={`${alert.severity} SEVERITY`} size="small" sx={{ height: 22, fontSize: '0.65rem', fontWeight: 800, bgcolor: `${borderColor}15`, color: borderColor, border: `1px solid ${borderColor}30` }} />
                          </Box>
                          <Typography variant="caption" color="#64748b" fontWeight={600} display="flex" alignItems="center" gap={0.5}>
                            <LocationOnOutlinedIcon sx={{ fontSize: 14 }} /> 
                            Lat: {alert.lat ? alert.lat.toFixed(3) : 'N/A'}, Lng: {alert.lng ? alert.lng.toFixed(3) : 'N/A'} • {alert.radius_km}km impact zone
                          </Typography>
                        </Box>
                      </MotionPaper>
                    );
                  })
                )}
              </Stack>
            </Grid>

            {/* Interactive Mini Map */}
            <Grid item xs={12} md={5}>
              <MotionPaper 
                elevation={0} 
                initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
                sx={{ height: '420px', borderRadius: 4, overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', position: 'relative' }}
              >
                <Box sx={{ position: 'absolute', top: 10, left: 10, zIndex: 400, bgcolor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(5px)', px: 2, py: 1, borderRadius: 3, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                  <Typography variant="caption" fontWeight={800} color="#0f172a" sx={{ letterSpacing: '0.5px' }}><PlaceRoundedIcon sx={{ fontSize: 16, color: '#ef4444', verticalAlign: 'middle', mr: 0.5 }} /> LIVE ACTIVITY MAP</Typography>
                </Box>
                <MapContainer center={[31.7087, 76.9320]} zoom={8} scrollWheelZoom={false} style={{ height: '100%', width: '100%', zIndex: 0 }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
                  <MapUpdater selectedAlert={selectedAlert} />
                  {notices.filter(a => a.lat && a.lng).map((alert, i) => {
                    const isHigh = alert.severity === 'high' || alert.severity === 'High';
                    const isMedium = alert.severity === 'medium' || alert.severity === 'Medium';
                    const mIcon = isHigh ? highIcon : isMedium ? medIcon : infoIcon;
                    const fillColor = isHigh ? '#ef4444' : isMedium ? '#f59e0b' : '#10b981';

                    return (
                      <React.Fragment key={alert.id || i}>
                        <Marker position={[alert.lat, alert.lng]} icon={mIcon}>
                          <Popup>
                            <Typography variant="subtitle2" fontWeight={800}>{alert.disaster_type}</Typography>
                            <Typography variant="caption" color="text.secondary">Severity: {alert.severity}</Typography>
                          </Popup>
                        </Marker>
                        <Circle center={[alert.lat, alert.lng]} radius={(alert.radius_km || 1) * 1000} pathOptions={{ color: fillColor, fillColor: fillColor, fillOpacity: 0.2, weight: 1 }} />
                      </React.Fragment>
                    );
                  })}
                </MapContainer>
              </MotionPaper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 3.5 News / Operations Section */}
      <Box sx={{ py: 10, bgcolor: '#f8fafc' }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
            <Typography variant="h3" fontWeight={900} color="#0f172a" letterSpacing="-1px">Operations News</Typography>
            <Button component={RouterLink} to="/updates" endIcon={<ArrowForwardRoundedIcon fontSize="small" />} sx={{ color: '#0f4a30', fontWeight: 800, fontSize: '1.05rem' }}>View Feed</Button>
          </Box>
          
          <Grid container spacing={4}>
            {news.length === 0 ? (
              <Grid item xs={12}><Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>No recent operations news available.</Typography></Grid>
            ) : (
              news.map((item, i) => (
                <MotionGrid item xs={12} md={4} key={item.id || i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                  <Paper elevation={0} sx={{ p: 4, borderRadius: 5, border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)', height: '100%', display: 'flex', flexDirection: 'column', transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.06)', borderColor: '#cbd5e1' } }}>
                    <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip label={item.category || 'Update'} size="small" sx={{ bgcolor: '#ecfdf5', color: '#059669', fontWeight: 800, px: 1 }} />
                      <Typography variant="caption" color="#64748b" fontWeight={700}>{new Date(item.created_at || item.timestamp).toLocaleDateString()}</Typography>
                    </Box>
                    <Typography variant="h6" fontWeight={800} color="#0f172a" sx={{ mb: 2, lineHeight: 1.4 }}>{item.title || item.category || 'Official Update'}</Typography>
                    <Typography variant="body1" color="#475569" sx={{ mb: 4, flexGrow: 1, lineHeight: 1.6 }}>{item.message || item.content || item.description || 'Details regarding the recent operation are currently being updated.'}</Typography>
                    <Button variant="text" sx={{ color: '#0f4a30', fontWeight: 800, p: 0, '&:hover': { bgcolor: 'transparent', gap: 1 }, alignSelf: 'flex-start' }} endIcon={<ArrowForwardRoundedIcon fontSize="small"/>} disableRipple>Read Story</Button>
                  </Paper>
                </MotionGrid>
              ))
            )}
          </Grid>
        </Container>
      </Box>

      {/* 3.7 Do's and Don'ts Section */}
      <Box sx={{ py: 12, bgcolor: '#f8fafc' }}>
        <Container maxWidth="xl">
          <MotionBox initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} textAlign="center" mb={8} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h3" sx={{ color: '#0f172a', fontWeight: 900, letterSpacing: '-1px' }}>Disaster Guidelines</Typography>
            <Box sx={{ width: 60, height: 5, background: 'linear-gradient(90deg, #10b981, #0f4a30)', mt: 2, borderRadius: 2 }} />
          </MotionBox>

          <Grid container spacing={4}>
            {dosAndDonts.map((item, index) => (
              <MotionGrid item xs={12} sm={6} lg={3} key={index} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }}>
                <Paper elevation={0} sx={{ height: '100%', borderRadius: 5, overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s', '&:hover': { transform: 'translateY(-10px)', boxShadow: '0 25px 50px rgba(0,0,0,0.12)' }, '&:hover .card-bg': { transform: 'scale(1.08)' } }}>
                  <Box sx={{ overflow: 'hidden', position: 'relative', height: 200 }}>
                    <Box className="card-bg" sx={{ height: '100%', width: '100%', backgroundImage: `url(${item.image})`, backgroundSize: 'cover', backgroundPosition: 'center', transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }} />
                    <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.9), transparent)', p: 3, pt: 6 }}>
                      <Typography variant="h5" fontWeight={800} color="#fff" align="center">{item.title}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 3, bgcolor: '#fff' }}>
                    <Box>
                      {item.dos.map((doItem, i) => (
                        <Box key={i} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'flex-start' }}><CheckCircleRoundedIcon sx={{ color: '#10b981', fontSize: 22, mt: 0.1 }} /><Typography variant="body2" color="#334155" fontWeight={600} sx={{ lineHeight: 1.6 }}>{doItem}</Typography></Box>
                      ))}
                    </Box>
                    <Divider sx={{ borderStyle: 'dashed', borderColor: '#cbd5e1' }} />
                    <Box>
                      {item.donts.map((dontItem, i) => (
                        <Box key={i} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'flex-start' }}><CancelRoundedIcon sx={{ color: '#ef4444', fontSize: 22, mt: 0.1 }} /><Typography variant="body2" color="#334155" fontWeight={600} sx={{ lineHeight: 1.6 }}>{dontItem}</Typography></Box>
                      ))}
                    </Box>
                  </Box>
                </Paper>
              </MotionGrid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* NEW: Emergency Quick Dial Section */}
      <Box sx={{ bgcolor: '#ffffff', py: 10 }}>
        <Container maxWidth="xl">
          <MotionBox 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Paper elevation={0} sx={{ p: 6, borderRadius: 5, boxShadow: '0 10px 40px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
              <Typography variant="h4" fontWeight={900} color="#0f172a" textAlign="center" mb={5} sx={{ letterSpacing: '-0.5px' }}>
                Emergency Quick Dial
              </Typography>
              <Grid container spacing={4} justifyContent="center">
                {emergencyContacts.map((contact, i) => (
                  <Grid item xs={12} sm={6} md={3} key={i}>
                    <Button 
                      component="a" href={`tel:${contact.number}`}
                      fullWidth variant="outlined"
                      sx={{ 
                        display: 'flex', flexDirection: 'column', py: 4, gap: 1.5, borderRadius: 4,
                        borderColor: 'transparent', bgcolor: contact.bg, color: contact.color,
                        transition: 'all 0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: `0 15px 30px ${contact.bg}`, borderColor: contact.color, bgcolor: contact.bg }
                      }}
                    >
                      {contact.icon}
                      <Box textAlign="center">
                        <Typography variant="h4" fontWeight={900} display="block" lineHeight={1.2}>{contact.number}</Typography>
                        <Typography variant="subtitle2" fontWeight={800} sx={{ textTransform: 'uppercase', letterSpacing: '1px' }}>{contact.label}</Typography>
                      </Box>
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </MotionBox>
        </Container>
      </Box>

      {/* 4. Stats Parallax Section */}
      <Box sx={{ position: 'relative', py: 12, backgroundImage: 'linear-gradient(rgba(15, 74, 48, 0.8), rgba(0, 0, 0, 0.8)), url("https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', color: '#fff' }}>
        <Container maxWidth="xl">
          <Grid container spacing={4} justifyContent="center">
            {[{ icon: <GroupsRoundedIcon fontSize="large" />, stat: '12,458+', label: 'Active Volunteers' }, { icon: <ShieldIcon fontSize="large" />, stat: '1,287+', label: 'Rescue Operations' }, { icon: <BusinessCenterIcon fontSize="large" />, stat: '3,842+', label: 'Equipment Available' }, { icon: <MapIcon fontSize="large" />, stat: '12', label: 'Districts Covered' }].map((item, index) => (
              <MotionGrid item xs={12} sm={6} md={3} sx={{ textAlign: 'center' }} key={index} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }}>
                <Box sx={{ width: 80, height: 80, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3, bgcolor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', transition: 'all 0.3s', '&:hover': { transform: 'scale(1.1)', bgcolor: 'rgba(255,255,255,0.2)' } }}>{item.icon}</Box>
                <Typography variant="h2" fontWeight={900} mb={1} sx={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>{item.stat}</Typography>
                <Typography variant="h6" fontWeight={700} sx={{ color: '#a7f3d0' }}>{item.label}</Typography>
              </MotionGrid>
            ))}
          </Grid>
        </Container>
      </Box>

    </Box>
  );
}