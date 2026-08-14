import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Typography, TextField, Button, Avatar, Select, MenuItem, InputAdornment, Checkbox, FormControlLabel, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

// Icons
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import FilterAltRoundedIcon from '@mui/icons-material/FilterAltRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import CloudRoundedIcon from '@mui/icons-material/CloudRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import TrafficRoundedIcon from '@mui/icons-material/TrafficRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CallRoundedIcon from '@mui/icons-material/CallRounded';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import GppGoodRoundedIcon from '@mui/icons-material/GppGoodRounded';
import MedicalServicesRoundedIcon from '@mui/icons-material/MedicalServicesRounded';
import NotListedLocationRoundedIcon from '@mui/icons-material/NotListedLocationRounded';
import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded';
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded';

import { fetchBulletins, createIncident } from '../api/client';

const NAVY = '#0B2545';
const BLUE = '#1D4ED8';
const LIGHT_BLUE = '#EFF6FF';
const RED = '#DC2626';
const ORANGE = '#F59E0B';
const GREEN = '#10B981';

const SEVERITY_LEVELS = {
  High: { color: RED, bg: '#FEE2E2', icon: <ErrorOutlineRoundedIcon /> },
  Medium: { color: ORANGE, bg: '#FEF3C7', icon: <WarningAmberRoundedIcon /> },
  Low: { color: BLUE, bg: LIGHT_BLUE, icon: <InfoOutlinedIcon /> },
  Info: { color: GREEN, bg: '#D1FAE5', icon: <CheckRoundedIcon /> },
  Critical: { color: RED, bg: '#FEE2E2', icon: <ErrorOutlineRoundedIcon /> }, // Fallback for old data
};

export default function UpdatesPage() {
  const [bulletins, setBulletins] = useState([]);
  const [liveAlerts, setLiveAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const alertsPerPage = 6;

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All Alerts');
  const [filterSeverity, setFilterSeverity] = useState({ High: false, Medium: false, Low: false, Info: false });
  const [filterDistrict, setFilterDistrict] = useState('all');
  const [filterDate, setFilterDate] = useState('all');
  const [viewTab, setViewTab] = useState('All');

  const fetchData = async () => {
    try {
      // Fetch internal bulletins
      const bData = await fetchBulletins();
      setBulletins(bData || []);

      // Fetch live HPSDMA incidents to act as real-time alerts
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4002'}/hpsdma/incidents?limit=50`);
      if (res.ok) {
        const hData = await res.json();
        const mappedAlerts = (hData.incidents || []).map(inc => {
          let severity = 'Info';
          if (inc.humanLoss > 0) severity = 'High';
          else if (inc.humanInjured > 0 || inc.type.toLowerCase().includes('fire')) severity = 'Medium';
          else if (inc.type.toLowerCase().includes('road')) severity = 'Low';

          let alertType = 'Disaster Alerts';
          const t = inc.type.toLowerCase();
          if (t.includes('flood') || t.includes('cloudburst') || t.includes('lightning')) alertType = 'Weather Alerts';
          else if (t.includes('road')) alertType = 'Road & Traffic';

          return {
            id: inc.id,
            title: `${inc.type} in ${inc.district}`,
            type: alertType,
            severity,
            desc: `A ${inc.type.toLowerCase()} incident has been reported in ${inc.tehsil !== '-' ? inc.tehsil + ', ' : ''}${inc.district}. ${inc.humanLoss > 0 || inc.humanInjured > 0 ? 'Casualties reported.' : 'Please stay cautious.'}`,
            loc: inc.district,
            lat: inc.lat,
            lon: inc.lon,
            source: 'HPSDMA',
            rawDate: new Date(inc.date || Date.now()),
            time: new Date(inc.date || Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) + ', ' + new Date(inc.date || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
          };
        });
        setLiveAlerts(mappedAlerts);
      }
    } catch (e) {
      console.error('Error fetching alerts:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Auto-fetch alerts every 2 minutes
    const intervalId = setInterval(fetchData, 2 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleSOS = () => {
    if (!navigator.geolocation) { alert('GPS not available.'); return; }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          await createIncident({ disaster_type: 'SOS', description: 'EMERGENCY SOS', lat: pos.coords.latitude, lng: pos.coords.longitude, severity: 'High' });
          alert('SOS SENT SUCCESSFULLY. SDRF IS RESPONDING.');
        } catch { alert('SOS Failed.'); }
      },
      () => alert('Could not get GPS location.'),
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  // Combine and sort real data
  const combinedAlerts = [
    ...bulletins.map(b => ({
      id: b.id || Math.random(),
      title: b.title || 'Official Advisory',
      type: b.type || 'Advisory',
      severity: b.severity || 'Medium',
      desc: b.message || b.content || b.description || 'No details provided.',
      loc: b.location || b.district || 'All Districts',
      source: 'Bulletin',
      rawDate: new Date(b.created_at || b.timestamp || Date.now()),
      time: new Date(b.created_at || b.timestamp || Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) + ', ' + new Date(b.created_at || b.timestamp || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    })),
    ...liveAlerts
  ].sort((a, b) => b.rawDate - a.rawDate);

  // Dynamic counts for filters
  const counts = { type: {}, severity: {} };
  combinedAlerts.forEach(a => {
    counts.type[a.type] = (counts.type[a.type] || 0) + 1;
    counts.severity[a.severity] = (counts.severity[a.severity] || 0) + 1;
  });

  // Apply filters
  const displayAlerts = combinedAlerts.filter(alert => {
    if (searchQuery && !alert.title.toLowerCase().includes(searchQuery.toLowerCase()) && !alert.desc.toLowerCase().includes(searchQuery.toLowerCase()) && !alert.loc.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterType !== 'All Alerts' && alert.type !== filterType) return false;
    
    const activeSeverities = Object.keys(filterSeverity).filter(k => filterSeverity[k]);
    if (activeSeverities.length > 0 && !activeSeverities.includes(alert.severity)) return false;
    
    if (filterDistrict !== 'all' && alert.loc.toLowerCase() !== filterDistrict.toLowerCase()) return false;
    
    if (filterDate === 'today') {
      const today = new Date();
      if (alert.rawDate.toDateString() !== today.toDateString()) return false;
    } else if (filterDate === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      if (alert.rawDate < weekAgo) return false;
    }
    
    if (viewTab === 'Advisories' && alert.source !== 'Bulletin') return false;
    if (viewTab === 'Live Incidents' && alert.source !== 'HPSDMA') return false;

    return true;
  });

  const distinctDistricts = [...new Set(combinedAlerts.map(a => a.loc).filter(d => d && d !== 'All Districts'))].sort();

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterType, filterSeverity, filterDistrict, filterDate]);

  return (
    <Box sx={{ bgcolor: '#F8FAFC', minHeight: 'calc(100vh - 66px)', display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth="xl" sx={{ flexGrow: 1, py: 3, display: 'flex', flexDirection: 'column' }}>
        <Grid container spacing={3} sx={{ flexGrow: 1 }}>
          
          {/* ══ LEFT SIDEBAR ══ */}
          <Grid item xs={12} lg={2.5}>
            {/* Header */}
            <Box sx={{ bgcolor: BLUE, color: '#FFF', borderRadius: '12px 12px 0 0', p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography sx={{ fontWeight: 900, fontSize: '0.85rem', letterSpacing: '0.05em' }}>FILTER ALERTS</Typography>
              <FilterAltRoundedIcon sx={{ fontSize: 18 }} />
            </Box>
            
            {/* Filters */}
            <Box sx={{ bgcolor: '#FFF', borderRadius: '0 0 12px 12px', border: '1px solid #E2E8F0', borderTop: 'none', p: 2.5, mb: 3 }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 900, color: NAVY, mb: 1, textTransform: 'uppercase' }}>Search Alerts</Typography>
              <TextField value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} fullWidth placeholder="Search by keyword, location..." size="small" sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2 } }} InputProps={{ endAdornment: <SearchRoundedIcon sx={{color:'#94A3B8', fontSize: 18}} /> }} />

              <Typography sx={{ fontSize: '0.75rem', fontWeight: 900, color: NAVY, mb: 1.5, textTransform: 'uppercase' }}>Alert Type</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 3 }}>
                {[
                  { label: 'All Alerts', icon: <NotificationsRoundedIcon />, count: combinedAlerts.length, active: filterType === 'All Alerts' },
                  { label: 'Weather Alerts', icon: <CloudRoundedIcon />, count: counts.type['Weather Alerts'] || 0, active: filterType === 'Weather Alerts' },
                  { label: 'Disaster Alerts', icon: <WarningAmberRoundedIcon />, count: counts.type['Disaster Alerts'] || 0, active: filterType === 'Disaster Alerts' },
                  { label: 'Road & Traffic', icon: <TrafficRoundedIcon />, count: counts.type['Road & Traffic'] || 0, active: filterType === 'Road & Traffic' },
                  { label: 'Advisory', icon: <InfoOutlinedIcon />, count: counts.type['Advisory'] || 0, active: filterType === 'Advisory' },
                ].map((t, i) => (
                  <Box onClick={() => setFilterType(t.label)} key={i} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1, borderRadius: 2, cursor: 'pointer', bgcolor: t.active ? LIGHT_BLUE : 'transparent', color: t.active ? BLUE : NAVY, '&:hover': { bgcolor: t.active ? LIGHT_BLUE : '#F1F5F9' } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {React.cloneElement(t.icon, { sx: { fontSize: 16, color: t.active ? BLUE : '#64748B' } })}
                      <Typography sx={{ fontSize: '0.85rem', fontWeight: t.active ? 800 : 600 }}>{t.label}</Typography>
                    </Box>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: t.active ? BLUE : '#94A3B8' }}>{t.count}</Typography>
                  </Box>
                ))}
              </Box>

              <Typography sx={{ fontSize: '0.75rem', fontWeight: 900, color: NAVY, mb: 1, textTransform: 'uppercase' }}>Severity</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 3 }}>
                {[
                  { label: 'High', color: RED, count: counts.severity['High'] || 0, key: 'High' },
                  { label: 'Medium', color: ORANGE, count: counts.severity['Medium'] || 0, key: 'Medium' },
                  { label: 'Low', color: BLUE, count: counts.severity['Low'] || 0, key: 'Low' },
                  { label: 'Info', color: GREEN, count: counts.severity['Info'] || 0, key: 'Info' },
                ].map((s, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <FormControlLabel 
                      control={<Checkbox checked={filterSeverity[s.key]} onChange={(e) => setFilterSeverity({...filterSeverity, [s.key]: e.target.checked})} size="small" sx={{ color: '#CBD5E1', '&.Mui-checked': { color: s.color } }} />} 
                      label={<Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: NAVY }}>{s.label}</Typography>} 
                    />
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8' }}>{s.count}</Typography>
                  </Box>
                ))}
              </Box>

              <Typography sx={{ fontSize: '0.75rem', fontWeight: 900, color: NAVY, mb: 1, textTransform: 'uppercase' }}>District</Typography>
              <Select value={filterDistrict} onChange={(e) => setFilterDistrict(e.target.value)} fullWidth size="small" sx={{ mb: 3, borderRadius: 2 }}>
                <MenuItem value="all">All Districts</MenuItem>
                {distinctDistricts.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
              </Select>

              <Typography sx={{ fontSize: '0.75rem', fontWeight: 900, color: NAVY, mb: 1, textTransform: 'uppercase' }}>Date Range</Typography>
              <Select value={filterDate} onChange={(e) => setFilterDate(e.target.value)} fullWidth size="small" sx={{ mb: 4, borderRadius: 2 }}>
                <MenuItem value="all">All Time</MenuItem>
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="week">This Week</MenuItem>
              </Select>

              <Button 
                onClick={() => {
                  setSearchQuery('');
                  setFilterType('All Alerts');
                  setFilterSeverity({ High: false, Medium: false, Low: false, Info: false });
                  setFilterDistrict('all');
                  setFilterDate('all');
                }}
                variant="text" fullWidth sx={{ borderRadius: 2, py: 1, color: '#64748B', fontWeight: 700, fontSize: '0.8rem', textTransform: 'none' }}
              >
                <RestartAltRoundedIcon sx={{ fontSize: 16, mr: 1 }} /> Reset Filters
              </Button>
            </Box>
          </Grid>

          {/* ══ CENTER AREA ══ */}
          <Grid item xs={12} lg={6.5}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: LIGHT_BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center', color: BLUE }}>
                  <NotificationsRoundedIcon sx={{ fontSize: 20 }} />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '1.2rem', fontWeight: 900, color: NAVY, mb: 0.1 }}>ALERTS & INCIDENTS</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500 }}>Stay informed about the latest alerts and advisories</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B' }}>Sort By:</Typography>
                <Select size="small" defaultValue="latest" sx={{ borderRadius: 2, height: 32, fontSize: '0.8rem', fontWeight: 700 }}>
                  <MenuItem value="latest">Latest First</MenuItem>
                  <MenuItem value="oldest">Oldest First</MenuItem>
                </Select>
              </Box>
            </Box>

            {/* Tabs for Alerts vs Incidents */}
            <Box sx={{ display: 'flex', gap: 1, mb: 3, borderBottom: '1px solid #E2E8F0', pb: 1.5 }}>
              {['All', 'Advisories', 'Live Incidents'].map(tab => (
                <Button 
                  key={tab} 
                  onClick={() => { setViewTab(tab); setCurrentPage(1); }}
                  sx={{ 
                    borderRadius: 5, px: 3, py: 0.5, fontSize: '0.8rem', fontWeight: 800, textTransform: 'none',
                    bgcolor: viewTab === tab ? BLUE : 'transparent',
                    color: viewTab === tab ? '#FFF' : '#64748B',
                    '&:hover': { bgcolor: viewTab === tab ? BLUE : '#F1F5F9' }
                  }}
                >
                  {tab}
                </Button>
              ))}
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
              {displayAlerts.slice((currentPage - 1) * alertsPerPage, currentPage * alertsPerPage).map((alert, i) => {
                const s = SEVERITY_LEVELS[alert.severity] || SEVERITY_LEVELS.Info;
                // Determine icon based on alert type
                let typeIcon = <InfoOutlinedIcon />;
                if(alert.type === 'Weather Alerts') typeIcon = <CloudRoundedIcon />;
                if(alert.type === 'Disaster Alerts') typeIcon = <WarningAmberRoundedIcon />;
                if(alert.type === 'Road & Traffic') typeIcon = <TrafficRoundedIcon />;
                if(alert.type === 'Advisory') typeIcon = <GppGoodRoundedIcon />;

                return (
                  <Box key={i} sx={{ bgcolor: '#FFF', borderRadius: 3, border: '1px solid #E2E8F0', p: 3, display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer', transition: 'all 0.2s', '&:hover': { borderColor: BLUE, boxShadow: '0 4px 12px rgba(29, 78, 216, 0.05)' } }}>
                    {/* Type Icon */}
                    <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: alert.type === 'Disaster Alerts' ? '#FEE2E2' : alert.type === 'Weather Alerts' ? '#FFEDD5' : LIGHT_BLUE, color: alert.type === 'Disaster Alerts' ? RED : alert.type === 'Weather Alerts' ? ORANGE : BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {React.cloneElement(typeIcon, { sx: { fontSize: 24 } })}
                    </Box>
                    
                    <Box sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                        <Typography sx={{ fontSize: '1rem', fontWeight: 900, color: NAVY }}>{alert.title}</Typography>
                        <Box sx={{ bgcolor: s.color, color: '#FFF', fontSize: '0.65rem', fontWeight: 900, px: 1, py: 0.3, borderRadius: 1.5, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                          {alert.severity}
                        </Box>
                      </Box>
                      <Typography sx={{ fontSize: '0.8rem', color: '#475569', fontWeight: 500, lineHeight: 1.4, mb: 0 }}>
                        {alert.desc}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1, flexShrink: 0, minWidth: 140 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#64748B' }}>
                        <NotListedLocationRoundedIcon sx={{ fontSize: 14 }} />
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{alert.loc}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#64748B' }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600 }}>{alert.time}</Typography>
                      </Box>
                      {alert.lat && alert.lon && (
                        <Button 
                          component={RouterLink} 
                          to={`/map?lat=${alert.lat}&lng=${alert.lon}`}
                          size="small"
                          sx={{ mt: 0.5, fontSize: '0.7rem', fontWeight: 700, borderRadius: 2, bgcolor: LIGHT_BLUE, color: BLUE, '&:hover': { bgcolor: '#DBEAFE' } }}
                        >
                          View on Map
                        </Button>
                      )}
                    </Box>

                  </Box>
                );
              })}
            </Box>

            {/* Functional Pagination */}
            {displayAlerts.length > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 4 }}>
                <Button 
                  disabled={currentPage === 1} 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  sx={{ minWidth: 40, height: 40, borderRadius: 1.5, border: '1px solid #E2E8F0', color: currentPage === 1 ? '#CBD5E1' : NAVY, fontWeight: 800 }}
                >
                  {'<'}
                </Button>
                <Typography sx={{ fontWeight: 800, color: NAVY, fontSize: '0.9rem' }}>
                  Page {currentPage} of {Math.ceil(displayAlerts.length / alertsPerPage)}
                </Typography>
                <Button 
                  disabled={currentPage === Math.ceil(displayAlerts.length / alertsPerPage)} 
                  onClick={() => setCurrentPage(p => Math.min(Math.ceil(displayAlerts.length / alertsPerPage), p + 1))}
                  sx={{ minWidth: 40, height: 40, borderRadius: 1.5, border: '1px solid #E2E8F0', color: currentPage === Math.ceil(displayAlerts.length / alertsPerPage) ? '#CBD5E1' : NAVY, fontWeight: 800 }}
                >
                  {'>'}
                </Button>
              </Box>
            )}
          </Grid>

          {/* ══ RIGHT SIDEBAR ══ */}
          <Grid item xs={12} lg={3}>
            {/* Alert Summary */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <NotificationsRoundedIcon sx={{ color: BLUE, fontSize: 18 }} />
                <Typography sx={{ fontSize: '0.95rem', fontWeight: 900, color: NAVY }}>ALERT SUMMARY</Typography>
              </Box>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: BLUE, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>View All</Typography>
            </Box>
            
            <Grid container spacing={2} sx={{ mb: 4 }}>
              {[
                { label: 'High Alerts', count: 8, color: RED, bg: '#FEE2E2', icon: <ErrorOutlineRoundedIcon /> },
                { label: 'Medium Alerts', count: 9, color: ORANGE, bg: '#FEF3C7', icon: <WarningAmberRoundedIcon /> },
                { label: 'Low Alerts', count: 5, color: BLUE, bg: LIGHT_BLUE, icon: <InfoOutlinedIcon /> },
                { label: 'Info Alerts', count: 2, color: GREEN, bg: '#D1FAE5', icon: <CheckRoundedIcon /> },
              ].map((a, i) => (
                <Grid item xs={6} key={i}>
                  <Box sx={{ bgcolor: '#FFF', borderRadius: 3, border: '1px solid #E2E8F0', p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: a.color, color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {React.cloneElement(a.icon, { sx: { fontSize: 14 } })}
                      </Box>
                      <Typography sx={{ fontSize: '1.4rem', fontWeight: 900, color: a.color, lineHeight: 1 }}>{a.count}</Typography>
                    </Box>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>{a.label}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>

            {/* Emergency SOS */}
            <Typography sx={{ fontSize: '0.95rem', fontWeight: 900, color: RED, mb: 2 }}>EMERGENCY SOS</Typography>
            <Box sx={{ bgcolor: '#FFF', borderRadius: 3, p: 3, mb: 4, border: '2px solid #FEE2E2', textAlign: 'center' }}>
              <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                <CallRoundedIcon sx={{ fontSize: 32, color: RED }} />
              </Box>
              <Typography sx={{ fontSize: '1rem', fontWeight: 900, color: NAVY, mb: 1 }}>Need Immediate Help?</Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500, mb: 3 }}>
                Press the SOS button to alert nearest responders.
              </Typography>
              <Button onClick={handleSOS} variant="contained" fullWidth sx={{ borderRadius: 2, py: 1.5, bgcolor: RED, fontWeight: 900, fontSize: '0.9rem', '&:hover': { bgcolor: '#B91C1C' } }}>
                <CallRoundedIcon sx={{ fontSize: 18, mr: 1 }} /> PRESS SOS NOW
              </Button>
            </Box>

            {/* Safety Tips */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography sx={{ fontSize: '0.95rem', fontWeight: 900, color: NAVY }}>SAFETY TIPS</Typography>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: BLUE, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>View All</Typography>
            </Box>
            <Box sx={{ bgcolor: '#FFF', borderRadius: 3, border: '1px solid #E2E8F0', p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  { text: 'Follow official alerts and instructions', icon: <VerifiedUserRoundedIcon /> },
                  { text: 'Avoid traveling during extreme weather', icon: <TrafficRoundedIcon /> },
                  { text: 'Keep emergency kit and essentials ready', icon: <MedicalServicesRoundedIcon /> },
                  { text: 'Stay away from riverbanks and vulnerable areas', icon: <NotListedLocationRoundedIcon /> },
                  { text: 'Report any emergency immediately', icon: <ShieldRoundedIcon /> }
                ].map((tip, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                    <Box sx={{ color: BLUE }}>
                      {React.cloneElement(tip.icon, { sx: { fontSize: 18 } })}
                    </Box>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: NAVY, lineHeight: 1.4 }}>{tip.text}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
      
      {/* ── BOTTOM TRUST BADGES ── */}
      <Box sx={{ bgcolor: LIGHT_BLUE, py: 2, borderTop: '1px solid #BFDBFE', mt: 'auto' }}>
        <Container maxWidth="xl">
          <Grid container spacing={2} justifyContent="space-around">
            {[
              { icon: <NotificationsRoundedIcon />, title: 'Real-time Alerts', desc: 'Get instant updates on emergencies' },
              { icon: <VerifiedUserRoundedIcon />, title: 'Trusted Information', desc: 'Verified alerts from official sources' },
              { icon: <ShieldRoundedIcon />, title: 'Stay Prepared', desc: 'Be ready. Be safe. Protect your family' },
              { icon: <MedicalServicesRoundedIcon />, title: 'Save Lives', desc: 'Your awareness can save lives' }
            ].map((b, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, justifyContent: 'center', px: 2, borderRight: i < 3 ? { xs: 'none', md: '1px solid #BFDBFE' } : 'none' }}>
                  <Box sx={{ color: BLUE, display: 'flex' }}>
                    {React.cloneElement(b.icon, { sx: { fontSize: 32 } })}
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 800, color: NAVY, lineHeight: 1.2 }}>{b.title}</Typography>
                    <Typography sx={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>{b.desc}</Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

    </Box>
  );
}
