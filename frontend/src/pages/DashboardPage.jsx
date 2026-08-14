import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Paper, Grid, Tabs, Tab, Button, Chip, TextField, Alert, Divider, Select, MenuItem, FormControl, InputLabel, InputAdornment, IconButton, ToggleButtonGroup, ToggleButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
  fetchTasks, 
  fetchIncidents, 
  fetchVolunteers, 
  fetchIntelPins,
  fetchAgencies,
  fetchAuditLogs,
  exportIncidents,
  fetchResources,
  broadcastVolunteers
} from '../api/client';

import HpsdmaFeed from '../components/HpsdmaFeed';

import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import CellTowerRoundedIcon from '@mui/icons-material/CellTowerRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import MapRoundedIcon from '@mui/icons-material/MapRounded';
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded';

const NAVY   = '#0B1A3E';
const BLUE   = '#1D4ED8';
const ORANGE = '#EA580C';
const RED    = '#DC2626';

const fadeUp = {
  hidden:  { opacity: 0, y: 15 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.3, delay: i * 0.05, ease: 'easeOut' } }),
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other} style={{ width: '100%', outline: 'none' }}>
      {value === index && (
        <motion.div variants={fadeUp} initial="hidden" animate="visible">
          <Box sx={{ pt: 3 }}>{children}</Box>
        </motion.div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [tabIndex, setTabIndex] = useState(0);
  
  const [tasks, setTasks] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [intel, setIntel] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [incidentSearch, setIncidentSearch] = useState('');
  const [incidentSeverity, setIncidentSeverity] = useState('All');
  const [incidentSource, setIncidentSource] = useState('Local');
  const [selectedIncident, setSelectedIncident] = useState(null);
  
  const [volunteerSearch, setVolunteerSearch] = useState('');
  const [volunteerStatus, setVolunteerStatus] = useState('All');
  
  const [equipmentSearch, setEquipmentSearch] = useState('');
  const [equipmentType, setEquipmentType] = useState('All');

  // Broadcast state
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastStatus, setBroadcastStatus] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [t, i, v, eq, int, a, au] = await Promise.all([
          fetchTasks(),
          fetchIncidents(),
          fetchVolunteers(),
          fetchResources(),
          fetchIntelPins(),
          fetchAgencies(),
          fetchAuditLogs()
        ]);
        setTasks(t || []);
        setIncidents(i || []);
        setVolunteers(v || []);
        setEquipment(eq || []);
        setIntel(int || []);
        setAgencies(a || []);
        setAuditLogs(au || []);
      } catch (err) {
        console.error("Dashboard data load failed:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleLogout = () => {
    signOut();
    navigate('/');
  };

  const handleExport = async () => {
    try {
      const blob = await exportIncidents();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `SDRF_Incidents_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {
      alert('Failed to export data.');
    }
  };

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastMessage) return;
    setBroadcastStatus('Sending push notifications to all devices...');
    try {
      await broadcastVolunteers({ message: broadcastMessage });
      setBroadcastStatus('Broadcast successfully delivered!');
      setBroadcastMessage('');
    } catch (err) {
      setBroadcastStatus('Failed to send broadcast.');
    } finally {
      setTimeout(() => setBroadcastStatus(''), 3000);
    }
  };

  const filteredIncidents = incidents.filter(inc => {
    const searchLower = incidentSearch.toLowerCase();
    const matchesSearch = (inc.disaster_type || '').toLowerCase().includes(searchLower) || 
                          (inc.lat || '').toString().includes(searchLower) ||
                          (inc.lng || '').toString().includes(searchLower);
    const matchesSeverity = incidentSeverity === 'All' || inc.severity === incidentSeverity;
    return matchesSearch && matchesSeverity;
  });

  const filteredVolunteers = volunteers.filter(vol => {
    const searchLower = volunteerSearch.toLowerCase();
    const matchesSearch = (vol.name || '').toLowerCase().includes(searchLower) || 
                          (vol.skills || '').toLowerCase().includes(searchLower);
    const volStatusStr = vol.active ? 'Active' : 'Inactive';
    const matchesStatus = volunteerStatus === 'All' || volStatusStr === volunteerStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredEquipment = equipment.filter(eq => {
    const searchLower = equipmentSearch.toLowerCase();
    const matchesSearch = (eq.name || '').toLowerCase().includes(searchLower);
    const matchesType = equipmentType === 'All' || eq.type === equipmentType;
    return matchesSearch && matchesType;
  });

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F4F6FB', py: { xs: 4, md: 5 } }}>
      <Container maxWidth="xl">
        
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ width: 56, height: 56, borderRadius: '16px', background: `linear-gradient(135deg, ${BLUE} 0%, #1E3A8A 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(29,78,216,0.3)' }}>
              <SecurityRoundedIcon sx={{ color: '#fff', fontSize: 28 }} />
            </Box>
            <Box>
              <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 900, color: NAVY, fontSize: { xs: '1.6rem', md: '2rem' }, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                Responder Dashboard
              </Typography>
              <Typography sx={{ color: '#64748B', fontWeight: 500, fontSize: '0.85rem', mt: 0.5 }}>
                Welcome, {user?.name || 'Staff'}. Secure dispatch and management portal.
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="outlined" onClick={() => navigate('/')} startIcon={<ArrowBackRoundedIcon />} sx={{ borderRadius: '10px', fontWeight: 700, fontFamily: '"Outfit", sans-serif', color: NAVY, borderColor: '#E2E8F0', bgcolor: '#fff', '&:hover': { bgcolor: '#F1F5F9', borderColor: '#CBD5E1' } }}>
              Home
            </Button>
            <Button variant="outlined" color="error" onClick={handleLogout} sx={{ borderRadius: '10px', fontWeight: 700, fontFamily: '"Outfit", sans-serif', bgcolor: '#FEF2F2', borderColor: '#FECACA', '&:hover': { bgcolor: '#FEE2E2', borderColor: '#F87171' } }}>
              Sign Out
            </Button>
          </Box>
        </Box>

        <Paper elevation={0} sx={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid #E2E8F0', display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, minHeight: '75vh', bgcolor: '#fff', boxShadow: '0 10px 40px rgba(11,26,62,0.04)' }}>
          
          <Box sx={{ borderRight: { lg: '1px solid #E2E8F0' }, borderBottom: { xs: '1px solid #E2E8F0', lg: 'none' }, bgcolor: '#F8FAFC', minWidth: 240 }}>
            <Tabs 
              value={tabIndex} 
              onChange={(e, val) => setTabIndex(val)} 
              orientation={window.innerWidth >= 1200 ? 'vertical' : 'horizontal'}
              variant="scrollable"
              sx={{
                '& .MuiTabs-indicator': { bgcolor: BLUE, width: { lg: 3 }, height: { xs: 3, lg: 'auto' } },
                '& .MuiTab-root': {
                  fontFamily: '"Outfit", sans-serif', fontWeight: 700, fontSize: '0.88rem',
                  py: 2.5, px: 3, alignItems: 'flex-start', color: '#64748B', minHeight: 56,
                  '&.Mui-selected': { color: BLUE, bgcolor: '#EFF6FF' }
                }
              }}
            >
              <Tab icon={<AssignmentRoundedIcon sx={{ mb: { xs: 0, lg: '0 !important' }, mr: { xs: 1, lg: 1.5 } }} />} iconPosition="start" label="Tasks" />
              <Tab icon={<WarningRoundedIcon sx={{ mb: { xs: 0, lg: '0 !important' }, mr: { xs: 1, lg: 1.5 } }} />} iconPosition="start" label="Incidents" />
              <Tab icon={<GroupsRoundedIcon sx={{ mb: { xs: 0, lg: '0 !important' }, mr: { xs: 1, lg: 1.5 } }} />} iconPosition="start" label="Volunteers" />
              <Tab icon={<DirectionsCarRoundedIcon sx={{ mb: { xs: 0, lg: '0 !important' }, mr: { xs: 1, lg: 1.5 } }} />} iconPosition="start" label="Equipment" />
              <Tab icon={<PlaceRoundedIcon sx={{ mb: { xs: 0, lg: '0 !important' }, mr: { xs: 1, lg: 1.5 } }} />} iconPosition="start" label="Field Intel" />
              <Tab icon={<BusinessRoundedIcon sx={{ mb: { xs: 0, lg: '0 !important' }, mr: { xs: 1, lg: 1.5 } }} />} iconPosition="start" label="Agencies" />
              <Tab icon={<CellTowerRoundedIcon sx={{ mb: { xs: 0, lg: '0 !important' }, mr: { xs: 1, lg: 1.5 } }} />} iconPosition="start" label="Broadcast" />
              <Tab icon={<DownloadRoundedIcon sx={{ mb: { xs: 0, lg: '0 !important' }, mr: { xs: 1, lg: 1.5 } }} />} iconPosition="start" label="Exports" />
              <Tab icon={<SecurityRoundedIcon sx={{ mb: { xs: 0, lg: '0 !important' }, mr: { xs: 1, lg: 1.5 } }} />} iconPosition="start" label="Security Logs" />
            </Tabs>
          </Box>

          <Box sx={{ p: { xs: 3, md: 5 }, flexGrow: 1 }}>
            {loading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#94A3B8' }}>Loading secure data...</Typography>
              </Box>
            ) : (
              <>
                {/* 1. Tasks Panel */}
                <TabPanel value={tabIndex} index={0}>
                  <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 900, color: NAVY, fontSize: '1.4rem', mb: 3 }}>
                    Active Tasks ({tasks.length})
                  </Typography>
                  <Grid container spacing={3}>
                    {tasks.map((task, i) => (
                      <Grid item xs={12} md={6} lg={4} key={i}>
                        <Paper elevation={0} sx={{ p: 3, border: '1px solid #E2E8F0', borderRadius: '16px', height: '100%', transition: 'all 0.2s', '&:hover': { borderColor: '#CBD5E1', boxShadow: '0 4px 20px rgba(11,26,62,0.05)' } }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                            <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, color: NAVY, fontSize: '1.1rem' }}>{task.title}</Typography>
                            <Chip size="small" label={task.status} sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, fontSize: '0.65rem', textTransform: 'uppercase', height: 22, bgcolor: task.status === 'Completed' ? '#DCFCE7' : '#FEF3C7', color: task.status === 'Completed' ? '#166534' : '#92400E' }} />
                          </Box>
                          <Typography sx={{ color: '#475569', fontSize: '0.85rem', mb: 2, lineHeight: 1.6 }}>{task.description}</Typography>
                          <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: BLUE, fontSize: '0.75rem' }}>Assigned to: {task.assignee || 'Unassigned'}</Typography>
                        </Paper>
                      </Grid>
                    ))}
                    {tasks.length === 0 && <Typography sx={{ color: '#94A3B8', fontWeight: 600 }}>No active tasks.</Typography>}
                  </Grid>
                </TabPanel>

                {/* 2. Incidents Panel */}
                <TabPanel value={tabIndex} index={1}>
                  <Box sx={{ mb: 5 }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                        <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 900, color: NAVY, fontSize: '1.4rem', m: 0 }}>
                          Reported Incidents
                        </Typography>
                        <ToggleButtonGroup
                          color="primary"
                          value={incidentSource}
                          exclusive
                          onChange={(e, val) => { if (val) setIncidentSource(val); }}
                          size="small"
                          sx={{ bgcolor: '#fff' }}
                        >
                          <ToggleButton value="Local" sx={{ textTransform: 'none', fontWeight: 700, px: 2 }}>Local ({filteredIncidents.length})</ToggleButton>
                          <ToggleButton value="HPSDMA" sx={{ textTransform: 'none', fontWeight: 700, px: 2 }}>HPSDMA</ToggleButton>
                        </ToggleButtonGroup>
                      </Box>
                      
                      {incidentSource === 'Local' && (
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                          <TextField 
                            size="small" 
                            placeholder="Search incidents..." 
                            value={incidentSearch}
                            onChange={(e) => setIncidentSearch(e.target.value)}
                            InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon fontSize="small" /></InputAdornment> }}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#fff' } }}
                          />
                          <FormControl size="small" sx={{ minWidth: 150 }}>
                            <Select 
                              value={incidentSeverity} 
                              onChange={(e) => setIncidentSeverity(e.target.value)}
                              sx={{ borderRadius: 2, bgcolor: '#fff' }}
                              displayEmpty
                            >
                              <MenuItem value="All">All Severities</MenuItem>
                              <MenuItem value="High">High</MenuItem>
                              <MenuItem value="Medium">Medium</MenuItem>
                              <MenuItem value="Low">Low</MenuItem>
                              <MenuItem value="Info">Info</MenuItem>
                            </Select>
                          </FormControl>
                        </Box>
                      )}
                    </Box>

                    {incidentSource === 'Local' ? (
                      <Grid container spacing={3}>
                      {filteredIncidents.map((inc, i) => (
                        <Grid item xs={12} md={6} lg={4} key={i}>
                          <Paper 
                            elevation={0} 
                            onClick={() => setSelectedIncident(inc)}
                            sx={{ p: 3, border: '1px solid', borderColor: inc.severity === 'High' ? '#FECACA' : '#E2E8F0', borderRadius: '16px', bgcolor: inc.severity === 'High' ? '#FEF2F2' : '#FFF', height: '100%', cursor: 'pointer', transition: 'all 0.2s', '&:hover': { boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderColor: BLUE } }}
                          >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5, alignItems: 'center' }}>
                              <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 900, color: inc.severity === 'High' ? '#991B1B' : NAVY, fontSize: '1.1rem' }}>{inc.disaster_type || 'Unknown Incident'}</Typography>
                              <Chip size="small" label={inc.status || 'Active'} sx={{ bgcolor: inc.severity === 'High' ? '#FEE2E2' : '#F1F5F9', color: inc.severity === 'High' ? '#DC2626' : NAVY, fontFamily: '"Outfit", sans-serif', fontWeight: 800, fontSize: '0.65rem', textTransform: 'uppercase', height: 22 }} />
                            </Box>
                            <Typography sx={{ color: inc.severity === 'High' ? '#7F1D1D' : '#64748B', fontSize: '0.8rem', mb: 1, fontWeight: 500 }}>Location: {inc.lat}, {inc.lng}</Typography>
                            <Typography sx={{ color: inc.severity === 'High' ? '#B91C1C' : BLUE, fontSize: '0.75rem', fontWeight: 600 }}>Reported: {new Date(inc.created_at || inc.timestamp || Date.now()).toLocaleString()}</Typography>
                          </Paper>
                        </Grid>
                      ))}
                      {filteredIncidents.length === 0 && <Typography sx={{ color: '#94A3B8', fontWeight: 600 }}>No reported incidents match your filters.</Typography>}
                      </Grid>
                    ) : (
                      <Box>
                        <Paper elevation={0} sx={{ p: 0, borderRadius: '20px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                          <HpsdmaFeed maxItems={12} showSummary={true} />
                        </Paper>
                      </Box>
                    )}
                  </Box>
                </TabPanel>

                {/* 3. Volunteers Panel */}
                <TabPanel value={tabIndex} index={2}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2 }}>
                    <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 900, color: NAVY, fontSize: '1.4rem', m: 0 }}>
                      Registered Volunteers ({filteredVolunteers.length})
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                      <TextField 
                        size="small" 
                        placeholder="Search by name or skills..." 
                        value={volunteerSearch}
                        onChange={(e) => setVolunteerSearch(e.target.value)}
                        InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon fontSize="small" /></InputAdornment> }}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#fff' } }}
                      />
                      <FormControl size="small" sx={{ minWidth: 150 }}>
                        <Select 
                          value={volunteerStatus} 
                          onChange={(e) => setVolunteerStatus(e.target.value)}
                          sx={{ borderRadius: 2, bgcolor: '#fff' }}
                          displayEmpty
                        >
                          <MenuItem value="All">All Statuses</MenuItem>
                          <MenuItem value="Active">Active</MenuItem>
                          <MenuItem value="Inactive">Inactive</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </Box>

                  <Grid container spacing={3}>
                    {filteredVolunteers.map((vol, i) => (
                      <Grid item xs={12} sm={6} md={4} key={i}>
                        <Paper elevation={0} sx={{ p: 3, border: '1px solid #E2E8F0', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: vol.active ? '#ECFCCB' : '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: vol.active ? '#4D7C0F' : '#94A3B8' }}>
                            <GroupsRoundedIcon />
                          </Box>
                          <Box>
                            <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, color: NAVY }}>{vol.name}</Typography>
                            <Typography sx={{ color: '#64748B', fontSize: '0.75rem' }}>{vol.skills || 'General Helper'}</Typography>
                          </Box>
                        </Paper>
                      </Grid>
                    ))}
                    {filteredVolunteers.length === 0 && <Typography sx={{ color: '#94A3B8', fontWeight: 600 }}>No volunteers match your filters.</Typography>}
                  </Grid>
                </TabPanel>

                {/* 4. Equipment Panel */}
                <TabPanel value={tabIndex} index={3}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2 }}>
                    <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 900, color: NAVY, fontSize: '1.4rem', m: 0 }}>
                      Equipment Registry ({filteredEquipment.length})
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                      <TextField 
                        size="small" 
                        placeholder="Search equipment..." 
                        value={equipmentSearch}
                        onChange={(e) => setEquipmentSearch(e.target.value)}
                        InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon fontSize="small" /></InputAdornment> }}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#fff' } }}
                      />
                      <FormControl size="small" sx={{ minWidth: 150 }}>
                        <Select 
                          value={equipmentType} 
                          onChange={(e) => setEquipmentType(e.target.value)}
                          sx={{ borderRadius: 2, bgcolor: '#fff' }}
                          displayEmpty
                        >
                          <MenuItem value="All">All Types</MenuItem>
                          {[...new Set(equipment.map(e => e.type).filter(Boolean))].map(type => (
                            <MenuItem key={type} value={type}>{type}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </Box>

                  <Grid container spacing={3}>
                    {filteredEquipment.map((eq, i) => (
                      <Grid item xs={12} sm={6} md={4} key={i}>
                        <Paper elevation={0} sx={{ p: 3, border: '1px solid #E2E8F0', borderRadius: '16px' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <DirectionsCarRoundedIcon sx={{ color: BLUE, fontSize: 18 }} />
                              <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, color: NAVY }}>{eq.name}</Typography>
                            </Box>
                            <Chip size="small" label={eq.status || 'Available'} sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, fontSize: '0.65rem', textTransform: 'uppercase', height: 22, bgcolor: eq.status === 'Deployed' ? '#FEF3C7' : '#DCFCE7', color: eq.status === 'Deployed' ? '#92400E' : '#166534' }} />
                          </Box>
                          <Typography sx={{ color: '#64748B', fontSize: '0.8rem', mb: 1 }}>Type: {eq.type || 'N/A'}</Typography>
                          <Typography sx={{ color: '#94A3B8', fontSize: '0.75rem' }}>Total Quantity: {eq.quantity || 0}</Typography>
                        </Paper>
                      </Grid>
                    ))}
                    {filteredEquipment.length === 0 && <Typography sx={{ color: '#94A3B8', fontWeight: 600 }}>No equipment matches your filters.</Typography>}
                  </Grid>
                </TabPanel>

                {/* 5. Intel Pins */}
                <TabPanel value={tabIndex} index={4}>
                  <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 900, color: NAVY, fontSize: '1.4rem', mb: 3 }}>
                    Field Intel Pins ({intel.length})
                  </Typography>
                  <Grid container spacing={3}>
                    {intel.map((pin, i) => (
                      <Grid item xs={12} sm={6} md={4} key={i}>
                        <Paper elevation={0} sx={{ p: 3, border: '1px solid #E2E8F0', borderRadius: '16px' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <PlaceRoundedIcon sx={{ color: ORANGE, fontSize: 18 }} />
                            <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, color: NAVY }}>{pin.category || 'Observation'}</Typography>
                          </Box>
                          <Typography sx={{ color: '#475569', fontSize: '0.85rem', mb: 1 }}>{pin.description}</Typography>
                          <Typography sx={{ color: '#94A3B8', fontSize: '0.7rem' }}>Lat: {pin.lat}, Lng: {pin.lng}</Typography>
                        </Paper>
                      </Grid>
                    ))}
                    {intel.length === 0 && <Typography sx={{ color: '#94A3B8', fontWeight: 600 }}>No intel pins dropped.</Typography>}
                  </Grid>
                </TabPanel>

                {/* 6. Agencies */}
                <TabPanel value={tabIndex} index={5}>
                  <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 900, color: NAVY, fontSize: '1.4rem', mb: 3 }}>
                    Partner Agencies ({agencies.length})
                  </Typography>
                  <Grid container spacing={3}>
                    {agencies.map((ag, i) => (
                      <Grid item xs={12} sm={6} md={4} key={i}>
                        <Paper elevation={0} sx={{ p: 3, border: '1px solid #E2E8F0', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#166534' }}>
                            <BusinessRoundedIcon />
                          </Box>
                          <Box>
                            <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, color: NAVY }}>{ag.name}</Typography>
                            <Typography sx={{ color: '#64748B', fontSize: '0.75rem' }}>{ag.type}</Typography>
                          </Box>
                        </Paper>
                      </Grid>
                    ))}
                    {agencies.length === 0 && <Typography sx={{ color: '#94A3B8', fontWeight: 600 }}>No partner agencies found.</Typography>}
                  </Grid>
                </TabPanel>

                {/* 7. Broadcast */}
                <TabPanel value={tabIndex} index={6}>
                  <Box sx={{ maxWidth: 600 }}>
                    <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 900, color: NAVY, fontSize: '1.4rem', mb: 1 }}>
                      Emergency Broadcast
                    </Typography>
                    <Typography sx={{ color: '#64748B', fontSize: '0.85rem', mb: 4, lineHeight: 1.6 }}>
                      Send an immediate push notification and SMS to all registered responders and agencies in the network.
                    </Typography>
                    
                    <Paper elevation={0} sx={{ p: 4, border: '1px solid #E2E8F0', borderRadius: '20px', bgcolor: '#F8FAFC' }}>
                      <form onSubmit={handleBroadcast}>
                        <TextField 
                          fullWidth multiline rows={4} 
                          placeholder="Type emergency alert message..."
                          value={broadcastMessage}
                          onChange={(e) => setBroadcastMessage(e.target.value)}
                          sx={{ mb: 3, '& .MuiOutlinedInput-root': { bgcolor: '#fff', borderRadius: '12px' } }}
                        />
                        <Button 
                          type="submit" variant="contained" disabled={!broadcastMessage} 
                          startIcon={<CellTowerRoundedIcon />}
                          sx={{ background: `linear-gradient(135deg, ${RED} 0%, #991B1B 100%)`, fontFamily: '"Outfit", sans-serif', fontWeight: 700, borderRadius: '10px', px: 4, py: 1.2, '&:hover': { boxShadow: '0 4px 14px rgba(220,38,38,0.3)' } }}
                        >
                          Send Broadcast
                        </Button>
                        {broadcastStatus && (
                          <Alert severity="success" sx={{ mt: 3, borderRadius: '12px', fontWeight: 600 }}>{broadcastStatus}</Alert>
                        )}
                      </form>
                    </Paper>
                  </Box>
                </TabPanel>

                {/* 8. Exports */}
                <TabPanel value={tabIndex} index={7}>
                  <Box sx={{ maxWidth: 600 }}>
                    <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 900, color: NAVY, fontSize: '1.4rem', mb: 1 }}>
                      Data Exports
                    </Typography>
                    <Typography sx={{ color: '#64748B', fontSize: '0.85rem', mb: 4, lineHeight: 1.6 }}>
                      Download official SDRF records in CSV format for reporting and analysis.
                    </Typography>

                    <Paper elevation={0} sx={{ p: 4, border: '1px solid #E2E8F0', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                      <Box>
                        <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, color: NAVY, fontSize: '1.1rem' }}>All Incidents Report</Typography>
                        <Typography sx={{ color: '#64748B', fontSize: '0.8rem', mt: 0.5 }}>Export all incidents from the database as a CSV file.</Typography>
                      </Box>
                      <Button 
                        variant="outlined" startIcon={<DownloadRoundedIcon />} onClick={handleExport}
                        sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 700, borderRadius: '10px', color: BLUE, borderColor: BLUE, '&:hover': { bgcolor: '#EFF6FF' } }}
                      >
                        Download CSV
                      </Button>
                    </Paper>
                  </Box>
                </TabPanel>

                {/* 9. Security Logs */}
                <TabPanel value={tabIndex} index={8}>
                  <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 900, color: NAVY, fontSize: '1.4rem', mb: 3 }}>
                    System Audit Logs ({auditLogs.length})
                  </Typography>
                  <Paper elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '20px', overflow: 'hidden' }}>
                    {auditLogs.length === 0 ? (
                      <Box sx={{ p: 4, textAlign: 'center' }}>
                        <Typography sx={{ color: '#94A3B8', fontWeight: 600 }}>No audit logs found.</Typography>
                      </Box>
                    ) : (
                      <Box sx={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 600 }}>
                          <thead style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                            <tr>
                              <th style={{ padding: '16px 24px', color: '#64748B', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Timestamp</th>
                              <th style={{ padding: '16px 24px', color: '#64748B', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>User ID</th>
                              <th style={{ padding: '16px 24px', color: '#64748B', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {auditLogs.map((log, i) => (
                              <tr key={i} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                <td style={{ padding: '16px 24px', color: '#475569', fontSize: '0.85rem' }}>{new Date(log.timestamp).toLocaleString()}</td>
                                <td style={{ padding: '16px 24px', color: NAVY, fontWeight: 600, fontSize: '0.85rem' }}>{log.user_id}</td>
                                <td style={{ padding: '16px 24px', color: '#475569', fontSize: '0.85rem' }}>{log.action}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </Box>
                    )}
                  </Paper>
                </TabPanel>
              </>
            )}
          </Box>
        </Paper>
      </Container>

      {/* Incident Detail Modal */}
      {selectedIncident && (
        <Dialog open={Boolean(selectedIncident)} onClose={() => setSelectedIncident(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 2 }}>
            <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 900, color: NAVY, fontSize: '1.3rem' }}>
              Incident Details
            </Typography>
            <IconButton onClick={() => setSelectedIncident(null)} size="small" sx={{ bgcolor: '#F1F5F9' }}>
              <CloseRoundedIcon fontSize="small" />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Box>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.05em', mb: 0.5 }}>EMERGENCY TYPE</Typography>
                <Typography sx={{ fontSize: '1.1rem', fontWeight: 800, color: NAVY }}>{selectedIncident.disaster_type || 'Unknown'}</Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.05em', mb: 0.5 }}>SEVERITY & STATUS</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip size="small" label={`Severity: ${selectedIncident.severity || 'Unknown'}`} sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, fontSize: '0.75rem' }} />
                  <Chip size="small" label={`Status: ${selectedIncident.status || 'Active'}`} sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, fontSize: '0.75rem' }} />
                </Box>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.05em', mb: 0.5 }}>REPORTED BY</Typography>
                <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: NAVY }}>{selectedIncident.mobile_number || 'N/A'}</Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.05em', mb: 0.5 }}>LOCATION (LAT, LNG)</Typography>
                <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: NAVY }}>{selectedIncident.lat}, {selectedIncident.lng}</Typography>
                <Typography sx={{ fontSize: '0.85rem', color: '#64748B' }}>{selectedIncident.location || 'No address provided'}</Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.05em', mb: 0.5 }}>DESCRIPTION</Typography>
                <Typography sx={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6 }}>{selectedIncident.description || 'No additional details provided.'}</Typography>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2, px: 3, justifyContent: 'space-between' }}>
            <Button onClick={() => setSelectedIncident(null)} sx={{ color: '#64748B', fontWeight: 700, textTransform: 'none' }}>
              Close
            </Button>
            <Button 
              variant="contained" 
              startIcon={<MapRoundedIcon />}
              onClick={() => {
                navigate(`/map?lat=${selectedIncident.lat}&lng=${selectedIncident.lng}`);
              }}
              sx={{ bgcolor: BLUE, color: '#fff', fontWeight: 700, textTransform: 'none', borderRadius: '10px', px: 3 }}
            >
              Go to Map
            </Button>
          </DialogActions>
        </Dialog>
      )}

    </Box>
  );
}
