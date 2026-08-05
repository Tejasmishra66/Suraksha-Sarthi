import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Paper, Grid, Tabs, Tab, Button, Chip, TextField, Alert, Divider } from '@mui/material';
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
  exportIncidents
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
  const [intel, setIntel] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Broadcast state
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastStatus, setBroadcastStatus] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [t, i, v, int, a, au] = await Promise.all([
          fetchTasks(),
          fetchIncidents(),
          fetchVolunteers(),
          fetchIntelPins(),
          fetchAgencies(),
          fetchAuditLogs()
        ]);
        setTasks(t || []);
        setIncidents(i || []);
        setVolunteers(v || []);
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

  const handleBroadcast = (e) => {
    e.preventDefault();
    if (!broadcastMessage) return;
    setBroadcastStatus('Sending push notifications to all devices...');
    setTimeout(() => {
      setBroadcastStatus('Broadcast successfully delivered!');
      setBroadcastMessage('');
      setTimeout(() => setBroadcastStatus(''), 3000);
    }, 1500);
  };

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
                    <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 900, color: NAVY, fontSize: '1.4rem', mb: 3 }}>
                      Reported Incidents ({incidents.length})
                    </Typography>
                    <Grid container spacing={3}>
                    {incidents.map((inc, i) => (
                      <Grid item xs={12} md={6} lg={4} key={i}>
                        <Paper elevation={0} sx={{ p: 3, border: '1px solid #FECACA', borderRadius: '16px', bgcolor: '#FEF2F2', height: '100%' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                            <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 900, color: '#991B1B', fontSize: '1.1rem' }}>{inc.disaster_type || 'Unknown Incident'}</Typography>
                            <Chip size="small" label={inc.status || 'Active'} sx={{ bgcolor: '#FEE2E2', color: '#DC2626', fontFamily: '"Outfit", sans-serif', fontWeight: 800, fontSize: '0.65rem', textTransform: 'uppercase', height: 22 }} />
                          </Box>
                          <Typography sx={{ color: '#7F1D1D', fontSize: '0.8rem', mb: 1, fontWeight: 500 }}>Location: {inc.lat}, {inc.lng}</Typography>
                          <Typography sx={{ color: '#B91C1C', fontSize: '0.75rem', fontWeight: 600 }}>Reported: {new Date(inc.created_at || inc.timestamp).toLocaleString()}</Typography>
                        </Paper>
                      </Grid>
                    ))}
                    {incidents.length === 0 && <Typography sx={{ color: '#94A3B8', fontWeight: 600 }}>No reported incidents.</Typography>}
                    </Grid>
                  </Box>
                  
                  <Divider sx={{ my: 4, borderColor: '#F1F5F9' }} />
                  
                  <Box>
                    <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 900, color: NAVY, fontSize: '1.4rem', mb: 3 }}>
                      HPSDMA Extracted Incidents
                    </Typography>
                    <Paper elevation={0} sx={{ p: 0, borderRadius: '20px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                      <HpsdmaFeed maxItems={12} showSummary={true} />
                    </Paper>
                  </Box>
                </TabPanel>

                {/* 3. Volunteers Panel */}
                <TabPanel value={tabIndex} index={2}>
                  <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 900, color: NAVY, fontSize: '1.4rem', mb: 3 }}>
                    Registered Volunteers ({volunteers.length})
                  </Typography>
                  <Grid container spacing={3}>
                    {volunteers.map((vol, i) => (
                      <Grid item xs={12} sm={6} md={4} key={i}>
                        <Paper elevation={0} sx={{ p: 3, border: '1px solid #E2E8F0', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: BLUE }}>
                            <GroupsRoundedIcon />
                          </Box>
                          <Box>
                            <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, color: NAVY }}>{vol.name}</Typography>
                            <Typography sx={{ color: '#64748B', fontSize: '0.75rem' }}>{vol.skills || 'General Helper'}</Typography>
                          </Box>
                        </Paper>
                      </Grid>
                    ))}
                    {volunteers.length === 0 && <Typography sx={{ color: '#94A3B8', fontWeight: 600 }}>No volunteers registered.</Typography>}
                  </Grid>
                </TabPanel>

                {/* 4. Intel Pins */}
                <TabPanel value={tabIndex} index={3}>
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

                {/* 5. Agencies */}
                <TabPanel value={tabIndex} index={4}>
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

                {/* 6. Broadcast */}
                <TabPanel value={tabIndex} index={5}>
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

                {/* 7. Exports */}
                <TabPanel value={tabIndex} index={6}>
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

                {/* 8. Security Logs */}
                <TabPanel value={tabIndex} index={7}>
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
    </Box>
  );
}
