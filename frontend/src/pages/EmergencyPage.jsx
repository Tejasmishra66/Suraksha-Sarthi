import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Typography, TextField, Button, Avatar, Select, MenuItem, FormControl, InputLabel, Divider } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

// Icons
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import LocalPoliceRoundedIcon from '@mui/icons-material/LocalPoliceRounded';
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded';
import LocalHospitalRoundedIcon from '@mui/icons-material/LocalHospitalRounded';
import CallRoundedIcon from '@mui/icons-material/CallRounded';
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import AssignmentTurnedInRoundedIcon from '@mui/icons-material/AssignmentTurnedInRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';

import { createIncident, fetchIncidents } from '../api/client';

const NAVY = '#0B2545';
const BLUE = '#1D4ED8';
const LIGHT_BLUE = '#EFF6FF';
const RED = '#DC2626';
const ORANGE = '#F59E0B';
const GREEN = '#10B981';

const SEVERITY_LEVELS = [
  { id: 'High', title: 'High', desc: 'Severe damage, immediate attention needed', icon: <ErrorOutlineRoundedIcon />, color: RED, bg: '#FEE2E2' },
  { id: 'Medium', title: 'Medium', desc: 'Significant impact, requires attention', icon: <WarningAmberRoundedIcon />, color: ORANGE, bg: '#FEF3C7' },
  { id: 'Low', title: 'Low', desc: 'Minor impact, monitoring required', icon: <InfoOutlinedIcon />, color: BLUE, bg: LIGHT_BLUE },
  { id: 'Info', title: 'Info', desc: 'General information or query', icon: <CheckRoundedIcon />, color: GREEN, bg: '#D1FAE5' }
];

export default function EmergencyPage() {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState([]);
  
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('High');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchIncidents()
      .then((d) => setIncidents(d || []))
      .catch(() => {});
  }, []);

  const handleSubmit = async () => {
    if (!title || !description || !mobile) {
      alert("Please fill in title, description, and mobile number.");
      return;
    }
    setLoading(true);
    
    // Simulate getting location
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          await createIncident({
            disaster_type: title, // use title as type for now
            description: description,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            severity: severity,
          });
          alert("Incident Reported Successfully!");
          navigate('/map');
        } catch {
          alert("Failed to report incident. Try again.");
          setLoading(false);
        }
      },
      () => {
        alert("Could not get location. Ensure location services are enabled.");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

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

  return (
    <Box sx={{ bgcolor: '#F8FAFC', minHeight: 'calc(100vh - 66px)', display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth="xl" sx={{ flexGrow: 1, py: 3, display: 'flex', flexDirection: 'column' }}>
        <Grid container spacing={3} sx={{ flexGrow: 1 }}>
          
          {/* ══ LEFT SIDEBAR ══ */}
          <Grid item xs={12} lg={2.5}>
            {/* Header */}
            <Box sx={{ bgcolor: BLUE, color: '#FFF', borderRadius: '12px 12px 0 0', p: 2, textAlign: 'center' }}>
              <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', letterSpacing: '0.05em' }}>REPORT INCIDENT</Typography>
            </Box>
            
            {/* Stepper */}
            <Box sx={{ bgcolor: '#FFF', borderRadius: '0 0 12px 12px', border: '1px solid #E2E8F0', borderTop: 'none', p: 3, mb: 3 }}>
              {[
                { num: '1', title: 'Incident Details', desc: 'Provide basic information', active: true },
                { num: '2', title: 'Location', desc: 'Pinpoint the location' },
                { num: '3', title: 'Incident Type', desc: 'Select type of incident' },
                { num: '4', title: 'Photos & Videos', desc: 'Upload evidence (optional)' },
                { num: '5', title: 'Review & Submit', desc: 'Verify and submit report' },
              ].map((step, i) => (
                <Box key={i} sx={{ display: 'flex', gap: 2, mb: i !== 4 ? 3 : 0, position: 'relative' }}>
                  {i !== 4 && <Box sx={{ position: 'absolute', left: 15, top: 35, bottom: -15, width: 2, bgcolor: '#E2E8F0' }} />}
                  <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: step.active ? BLUE : '#F1F5F9', color: step.active ? '#FFF' : '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 900, fontSize: '0.85rem', zIndex: 1 }}>
                    {step.num}
                  </Box>
                  <Box sx={{ pt: 0.5 }}>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 800, color: step.active ? BLUE : NAVY, mb: 0.2 }}>{step.title}</Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: '#64748B' }}>{step.desc}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            {/* Need Immediate Help */}
            <Box sx={{ bgcolor: '#EFF6FF', borderRadius: 3, p: 2.5, mb: 3, border: '1px solid #BFDBFE' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <WarningAmberRoundedIcon sx={{ color: BLUE, fontSize: 20 }} />
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 900, color: NAVY }}>Need Immediate Help?</Typography>
              </Box>
              <Typography sx={{ fontSize: '0.7rem', color: '#475569', fontWeight: 500, mb: 2 }}>
                If this is a life-threatening emergency, press the SOS button.
              </Typography>
              <Button onClick={handleSOS} variant="contained" fullWidth sx={{ borderRadius: 2, py: 1.2, bgcolor: RED, fontWeight: 800, fontSize: '0.9rem', '&:hover': { bgcolor: '#B91C1C' } }}>
                <CallRoundedIcon sx={{ fontSize: 18, mr: 1 }} /> PRESS SOS
              </Button>
            </Box>

            {/* Helpline Numbers */}
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 900, color: NAVY, mb: 2, px: 1 }}>Helpline Numbers</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, px: 1 }}>
              {[
                { name: 'SDRF Control Room', num: '1070', icon: <SupportAgentRoundedIcon /> },
                { name: 'Police Control Room', num: '100', icon: <LocalPoliceRoundedIcon /> },
                { name: 'Fire Services', num: '101', icon: <LocalFireDepartmentRoundedIcon /> },
                { name: 'Ambulance', num: '108', icon: <LocalHospitalRoundedIcon /> },
                { name: 'Disaster Management', num: '1077', icon: <WarningAmberRoundedIcon /> },
              ].map((h, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: BLUE }}>
                    {React.cloneElement(h.icon, { sx: { fontSize: 16 } })}
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: NAVY }}>{h.name}</Typography>
                  </Box>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 900, color: BLUE }}>{h.num}</Typography>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* ══ CENTER AREA ══ */}
          <Grid item xs={12} lg={6.5}>
            <Box sx={{ bgcolor: '#FFF', borderRadius: 4, border: '1px solid #E2E8F0', p: 4 }}>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: LIGHT_BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center', color: BLUE }}>
                  <AssignmentTurnedInRoundedIcon sx={{ fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '1.4rem', fontWeight: 900, color: NAVY, mb: 0.3 }}>Report a New Incident</Typography>
                  <Typography sx={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 500 }}>Provide accurate information to help us respond faster</Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 4 }} />

              <Typography sx={{ fontSize: '0.95rem', fontWeight: 900, color: NAVY, mb: 3 }}>Basic Information</Typography>

              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={7}>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, color: NAVY, mb: 1 }}>Incident Title <span style={{color:RED}}>*</span></Typography>
                  <TextField fullWidth placeholder="Example: Landslide near NH-3" value={title} onChange={(e)=>setTitle(e.target.value)} size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                </Grid>
                <Grid item xs={12} md={5}>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, color: NAVY, mb: 1 }}>Date & Time <span style={{color:RED}}>*</span></Typography>
                  <TextField fullWidth type="datetime-local" size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} defaultValue="2025-06-03T10:30" />
                </Grid>
              </Grid>

              <Box sx={{ mb: 3 }}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, color: NAVY, mb: 1 }}>Description <span style={{color:RED}}>*</span></Typography>
                <TextField fullWidth multiline rows={4} placeholder="Please provide details about the incident..." value={description} onChange={(e)=>setDescription(e.target.value)} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                <Typography sx={{ fontSize: '0.7rem', color: '#94A3B8', textAlign: 'right', mt: 0.5, fontWeight: 600 }}>0/500</Typography>
              </Box>

              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, color: NAVY, mb: 1 }}>Number of People Affected</Typography>
                  <TextField fullWidth placeholder="Enter approximate number" size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} InputProps={{ startAdornment: <GroupsRoundedIcon sx={{color:'#94A3B8', mr:1, fontSize: 20}} /> }} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, color: NAVY, mb: 1 }}>Any Injuries?</Typography>
                  <FormControl fullWidth size="small">
                    <Select defaultValue="" displayEmpty sx={{ borderRadius: 2 }}>
                      <MenuItem value="" disabled>Select an option</MenuItem>
                      <MenuItem value="yes">Yes</MenuItem>
                      <MenuItem value="no">No</MenuItem>
                      <MenuItem value="unknown">Unknown</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, color: NAVY, mb: 2 }}>Severity Level <span style={{color:RED}}>*</span></Typography>
              <Grid container spacing={2} sx={{ mb: 5 }}>
                {SEVERITY_LEVELS.map((level) => (
                  <Grid item xs={12} sm={6} md={3} key={level.id}>
                    <Box 
                      onClick={() => setSeverity(level.id)}
                      sx={{ 
                        border: '2px solid', 
                        borderColor: severity === level.id ? level.color : '#E2E8F0', 
                        borderRadius: 2, 
                        p: 1.5, 
                        cursor: 'pointer',
                        bgcolor: severity === level.id ? '#FFF' : '#F8FAFC',
                        position: 'relative',
                        height: '100%'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, color: level.color }}>
                        {React.cloneElement(level.icon, { sx: { fontSize: 20 } })}
                        <Typography sx={{ fontSize: '0.9rem', fontWeight: 900 }}>{level.title}</Typography>
                      </Box>
                      <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: '#64748B', lineHeight: 1.3 }}>{level.desc}</Typography>
                      
                      {severity === level.id && (
                        <Box sx={{ position: 'absolute', top: 10, right: 10, width: 16, height: 16, borderRadius: '50%', bgcolor: level.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
                          <CheckRoundedIcon sx={{ fontSize: 12 }} />
                        </Box>
                      )}
                    </Box>
                  </Grid>
                ))}
              </Grid>

              <Typography sx={{ fontSize: '0.95rem', fontWeight: 900, color: NAVY, mb: 3 }}>Contact Information</Typography>
              <Grid container spacing={3} sx={{ mb: 5 }}>
                <Grid item xs={12} md={4}>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, color: NAVY, mb: 1 }}>Your Name <span style={{color:RED}}>*</span></Typography>
                  <TextField fullWidth placeholder="Enter your full name" value={name} onChange={(e)=>setName(e.target.value)} size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, color: NAVY, mb: 1 }}>Mobile Number <span style={{color:RED}}>*</span></Typography>
                  <TextField fullWidth placeholder="Enter 10-digit mobile number" value={mobile} onChange={(e)=>setMobile(e.target.value)} size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, color: NAVY, mb: 1 }}>Email (Optional)</Typography>
                  <TextField fullWidth placeholder="Enter email address" size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                </Grid>
              </Grid>

              <Divider sx={{ mb: 3 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button variant="outlined" component={RouterLink} to="/" sx={{ borderRadius: 2, px: 3, fontWeight: 700, borderColor: '#E2E8F0', color: NAVY, textTransform: 'none' }}>
                  ← Cancel
                </Button>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button variant="outlined" sx={{ borderRadius: 2, px: 3, fontWeight: 700, borderColor: BLUE, color: BLUE, textTransform: 'none' }}>
                    Save Draft
                  </Button>
                  <Button onClick={handleSubmit} disabled={loading} variant="contained" endIcon={<ArrowForwardRoundedIcon />} sx={{ borderRadius: 2, px: 4, fontWeight: 800, bgcolor: BLUE, textTransform: 'none', '&:hover': { bgcolor: '#1D4ED8' } }}>
                    {loading ? 'Submitting...' : 'Submit Report'}
                  </Button>
                </Box>
              </Box>

            </Box>
          </Grid>

          {/* ══ RIGHT SIDEBAR ══ */}
          <Grid item xs={12} lg={3}>
            {/* Guidelines */}
            <Box sx={{ bgcolor: '#FFF', borderRadius: 3, border: '1px solid #E2E8F0', p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <ShieldRoundedIcon sx={{ color: BLUE, fontSize: 22 }} />
                <Typography sx={{ fontSize: '0.95rem', fontWeight: 900, color: NAVY }}>Reporting Guidelines</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {[
                  'Provide accurate and complete information',
                  'Share exact location for faster response',
                  'Upload clear photos if available',
                  'Do not report false information',
                  'Your identity will be kept confidential'
                ].map((tip, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                    <CheckRoundedIcon sx={{ color: BLUE, fontSize: 16, mt: 0.3 }} />
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: NAVY, lineHeight: 1.4 }}>{tip}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Not sure */}
            <Box sx={{ bgcolor: '#F8FAFC', borderRadius: 3, p: 3, mb: 4, border: '1px solid #E2E8F0' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: LIGHT_BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center', color: BLUE }}>
                  <InfoOutlinedIcon sx={{ fontSize: 18 }} />
                </Box>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 900, color: NAVY }}>Not Sure What to Report?</Typography>
              </Box>
              <Typography sx={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500, mb: 2 }}>
                If you're unsure, report it anyway. Our team will verify and take appropriate action.
              </Typography>
              <Button variant="outlined" endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 14 }} />} sx={{ borderRadius: 2, py: 0.8, borderColor: '#E2E8F0', color: NAVY, textTransform: 'none', fontWeight: 800, fontSize: '0.75rem', bgcolor: '#FFF' }}>
                Learn What to Report
              </Button>
            </Box>

            {/* Recent Incidents */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography sx={{ fontSize: '0.95rem', fontWeight: 900, color: NAVY }}>Recent Incidents</Typography>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: BLUE, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>View All</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Combine mock and live data for UI completeness */}
              {[
                ...incidents.slice(0, 3).map(inc => ({
                  title: inc.disaster_type || 'Emergency reported', loc: 'Unknown District', time: 'Just now', severity: inc.severity || 'Medium'
                })),
                { title: 'Flood Warning in Mandi', loc: 'Mandi District', time: '10:30 AM', severity: 'High' },
                { title: 'Landslide Alert in Kullu', loc: 'Kullu District', time: '09:45 AM', severity: 'Medium' },
                { title: 'Road Block on NH-3', loc: 'Lahaul & Spiti', time: '09:10 AM', severity: 'Low' },
                { title: 'SDRF Team Deployed', loc: 'Kangra District', time: '08:50 AM', severity: 'Info' }
              ].slice(0, 4).map((inc, i) => {
                const s = SEVERITY_LEVELS.find(lvl => lvl.id === inc.severity) || SEVERITY_LEVELS[2];
                return (
                  <Box key={i} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                    <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: s.bg, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {React.cloneElement(s.icon, { sx: { fontSize: 18 } })}
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, color: NAVY, lineHeight: 1.2, mb: 0.3 }}>{inc.title}</Typography>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748B' }}>{inc.loc}</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                      <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#94A3B8' }}>{inc.time}</Typography>
                      <Box sx={{ bgcolor: s.color, color: '#FFF', fontSize: '0.6rem', fontWeight: 800, px: 1, py: 0.2, borderRadius: 1 }}>
                        {s.title}
                      </Box>
                    </Box>
                  </Box>
                )
              })}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}