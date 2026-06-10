﻿﻿﻿﻿﻿import React, { useState, useEffect } from 'react';
import {
  Avatar,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
  Badge,
  keyframes,
  Chip,
  Autocomplete
} from '@mui/material';
import TopNavBar from '../components/TopNavBar';
import VolunteerActivismRoundedIcon from '@mui/icons-material/VolunteerActivismRounded';
import MapRoundedIcon from '@mui/icons-material/MapRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import RocketLaunchRoundedIcon from '@mui/icons-material/RocketLaunchRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';

// New imports for specific skill icons
import DirectionsRunRoundedIcon from '@mui/icons-material/DirectionsRunRounded'; // For Mountain Rescue, Search & Rescue
import MedicalServicesRoundedIcon from '@mui/icons-material/MedicalServicesRounded'; // For First Aid, Medical Support
import FireExtinguisherRoundedIcon from '@mui/icons-material/FireExtinguisherRounded'; // For Fire Safety
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded'; // For Communication
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded'; // For Logistics
import FlightRoundedIcon from '@mui/icons-material/FlightRounded'; // For Drone Operator
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded';
import { fetchVolunteers, createVolunteer, broadcastVolunteers } from '../api/client';

const pulse = keyframes`
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(22, 163, 74, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(22, 163, 74, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(22, 163, 74, 0); }
`;

export default function VolunteerPage() {
  const skills = [
    { name: 'Mountain Rescue', icon: <DirectionsRunRoundedIcon /> },
    { name: 'First Aid', icon: <MedicalServicesRoundedIcon /> },
    { name: 'Medical Support', icon: <MedicalServicesRoundedIcon /> },
    { name: 'Search & Rescue', icon: <DirectionsRunRoundedIcon /> },
    { name: 'Fire Safety', icon: <FireExtinguisherRoundedIcon /> },
    { name: 'Communication', icon: <SupportAgentRoundedIcon /> },
    { name: 'Logistics', icon: <LocalShippingRoundedIcon /> },
    { name: 'Drone Operator', icon: <FlightRoundedIcon /> },
  ];

  const whyVolunteer = [
    {
      title: 'Make an Impact',
      description: 'Use your skills to save lives and support communities during crisis response.',
      icon: <CheckCircleRoundedIcon />,
    },
    {
      title: 'Get Trained',
      description: 'Access guided training, resources and rescue best practices.',
      icon: <SchoolRoundedIcon />,
    },
    {
      title: 'Be Recognized',
      description: 'Earn recognition for your volunteer service and leadership.',
      icon: <StarRoundedIcon />,
    },
  ];

  const [volunteers, setVolunteers] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', skills: 'First Aid' });
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [broadcastRadius, setBroadcastRadius] = useState('10');
  const [volunteerSearch, setVolunteerSearch] = useState('');

  useEffect(() => {
    loadVolunteers();
  }, []);

  async function loadVolunteers() {
    try {
      const data = await fetchVolunteers();
      setVolunteers(data || []);
    } catch (e) {
      console.error('Failed to load volunteers', e);
    }
  }

  async function handleRegister() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          await createVolunteer({ 
            ...form, 
            lat: position.coords.latitude, 
            lng: position.coords.longitude,
            active: 1
          });
          setOpen(false);
          setForm({ name: '', phone: '', skills: 'First Aid' });
          loadVolunteers();
          alert("Successfully registered with your live location locked!");
        } catch (e) {
          console.error('Failed to register', e);
          alert("Failed to register. Please try again.");
        }
      }, () => {
        alert("Location access is required to register as a responder.");
      });
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  }

  async function handleBroadcast() {
    if (!broadcastMsg) return alert("Please enter an emergency message to broadcast.");
    
    // Get the commander's current location as the epicenter for the broadcast
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        await broadcastVolunteers({
          message: broadcastMsg,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          radiusKm: parseInt(broadcastRadius)
        });
        alert(`Emergency SMS/Push Broadcast sent to all active volunteers within ${broadcastRadius}km!`);
        setBroadcastMsg('');
      } catch (e) {
        alert("Failed to send broadcast alert.");
      }
    });
  }

  const filteredVolunteers = volunteers.filter(v => {
    if (!volunteerSearch) return true;
    const term = volunteerSearch.toLowerCase();
    return (v.name || '').toLowerCase().includes(term) ||
           (v.skills || v.role || '').toLowerCase().includes(term);
  });

  return (
    <Box sx={{ minHeight: '100vh', background: '#f4faf4' }}>
      <TopNavBar />

      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2} sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h4" fontWeight={900} color="#102f25">Volunteer Command Center</Typography>
            <Chip label="LIVE ROSTER" size="small" color="success" sx={{ fontWeight: 800, animation: `${pulse} 2s infinite` }} />
          </Box>
          <Button variant="contained" color="success" size="large" onClick={() => setOpen(true)} sx={{ textTransform: 'none', borderRadius: 3, px: 4 }}>
            Register as Volunteer
          </Button>
        </Stack>

        <Grid container spacing={4}>
          <Grid item xs={12} lg={8}>
            <Paper sx={{ borderRadius: 4, mb: 4, boxShadow: '0 18px 40px rgba(15,23,42,0.08)', overflow: 'hidden' }}>
              <Box sx={{ p: 3, background: 'linear-gradient(135deg, #991b1b 0%, #7f1d1d 100%)', color: 'white' }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <CampaignRoundedIcon sx={{ fontSize: 32 }} />
                  <Box>
                    <Typography variant="h6" fontWeight={800}>Emergency Radius Broadcast</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>Instantly ping all registered volunteers near your live location.</Typography>
                  </Box>
                </Stack>
              </Box>
              <Box sx={{ p: 3 }}>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                    placeholder="e.g., Need 3 Medics at Sector 9 immediately. Respond if available."
                  value={broadcastMsg}
                  onChange={(e) => setBroadcastMsg(e.target.value)}
                />
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField fullWidth select label="Radius" SelectProps={{ native: true }} value={broadcastRadius} onChange={(e) => setBroadcastRadius(e.target.value)}>
                      <option value="5">5 km Radius</option>
                      <option value="10">10 km Radius</option>
                      <option value="20">20 km Radius</option>
                  </TextField>
                    <Button variant="contained" color="error" fullWidth onClick={handleBroadcast} startIcon={<CampaignRoundedIcon />} sx={{ fontWeight: 800, py: 1.5, fontSize: '1.05rem' }}>
                    Send Broadcast
                  </Button>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  Broadcasts utilize the SMS gateway for guaranteed delivery.
                </Typography>
              </Stack>
              </Box>
            </Paper>

            <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, mb: 4, boxShadow: '0 18px 40px rgba(15,23,42,0.08)' }}>
              <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
                Volunteer Skills
              </Typography>
              <Grid container spacing={2}>
                {skills.map((skill) => (
                  <Grid item xs={6} sm={4} md={3} key={skill.name}>
                    <Paper sx={{ p: 2, borderRadius: 3, border: '1px solid #f1f5f9', transition: 'all 0.2s', '&:hover': { borderColor: '#cbd5e1', transform: 'translateY(-4px)', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' } }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar sx={{ bgcolor: '#def7ec', color: '#047857', width: 38, height: 38 }}>
                          {skill.icon}
                        </Avatar>
                        <Typography>{skill.name}</Typography>
                      </Stack>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Paper>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 18px 40px rgba(15,23,42,0.08)' }}>
                  <Typography variant="subtitle1" fontWeight={800} gutterBottom>
                    How It Works
                  </Typography>
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={2} alignItems="flex-start">
                      <Avatar sx={{ bgcolor: '#dcfce7', color: '#047857' }}>
                        <GroupsRoundedIcon />
                      </Avatar>
                      <Box>
                        <Typography fontWeight={700}>Register</Typography>
                        <Typography variant="body2" color="text.secondary">Create your profile and choose your skills.</Typography>
                      </Box>
                    </Stack>
                    <Stack direction="row" spacing={2} alignItems="flex-start">
                      <Avatar sx={{ bgcolor: '#dcfce7', color: '#047857' }}>
                        <MapRoundedIcon />
                      </Avatar>
                      <Box>
                        <Typography fontWeight={700}>Get Notified</Typography>
                        <Typography variant="body2" color="text.secondary">Receive alerts and updates for nearby incidents.</Typography>
                      </Box>
                    </Stack>
                    <Stack direction="row" spacing={2} alignItems="flex-start">
                      <Avatar sx={{ bgcolor: '#dcfce7', color: '#047857' }}>
                        <RocketLaunchRoundedIcon />
                      </Avatar>
                      <Box>
                        <Typography fontWeight={700}>Respond</Typography>
                        <Typography variant="body2" color="text.secondary">Accept tasks and coordinate with response teams.</Typography>
                      </Box>
                    </Stack>
                    <Stack direction="row" spacing={2} alignItems="flex-start">
                      <Avatar sx={{ bgcolor: '#dcfce7', color: '#047857' }}>
                        <StarRoundedIcon />
                      </Avatar>
                      <Box>
                        <Typography fontWeight={700}>Make a Difference</Typography>
                        <Typography variant="body2" color="text.secondary">Support communities and save lives in the field.</Typography>
                      </Box>
                    </Stack>
                  </Stack>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 18px 40px rgba(15,23,42,0.08)' }}>
                  <Typography variant="subtitle1" fontWeight={800} gutterBottom>
                    Volunteer Benefits
                  </Typography>
                  <Stack spacing={2}>
                    {whyVolunteer.map((item) => (
                      <Paper key={item.title} sx={{ p: 2, borderRadius: 3, background: '#f4faf4' }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar sx={{ bgcolor: '#d1fae5', color: '#047857', width: 42, height: 42 }}>
                            {item.icon}
                          </Avatar>
                          <Box>
                            <Typography fontWeight={700}>{item.title}</Typography>
                            <Typography variant="body2" color="text.secondary">{item.description}</Typography>
                          </Box>
                        </Stack>
                      </Paper>
                    ))}
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 18px 40px rgba(15,23,42,0.08)' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6" fontWeight={800}>Active Volunteers</Typography>
                <Chip label={`${filteredVolunteers.length} Ready`} size="small" color="success" sx={{ fontWeight: 700 }} />
              </Stack>
              
              <TextField
                fullWidth
                size="small"
                placeholder="Search by name or skill..."
                value={volunteerSearch}
                onChange={(e) => setVolunteerSearch(e.target.value)}
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRoundedIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />

              <Stack spacing={2}>
                {filteredVolunteers.length > 0 ? filteredVolunteers.map((volunteer, idx) => (
                  <Box key={volunteer.id || idx} sx={{ p: 2, borderRadius: 3, border: '1px solid #f1f5f9', transition: 'all 0.2s', '&:hover': { borderColor: '#cbd5e1', transform: 'translateX(4px)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' } }}>
                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Badge
                          overlap="circular"
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                          variant="dot"
                          color="success"
                          sx={{ '& .MuiBadge-badge': { border: '2px solid white', width: 12, height: 12, borderRadius: '50%' } }}
                        >
                          <Avatar sx={{ bgcolor: '#dcfce7', color: '#047857' }}>
                            {volunteer.name?.charAt(0) || 'V'}
                          </Avatar>
                        </Badge>
                        <Box>
                          <Typography fontWeight={700}>{volunteer.name || 'Anonymous'}</Typography>
                          <Typography variant="body2" color="text.secondary">{volunteer.skills || volunteer.role || 'General'}</Typography>
                        </Box>
                      </Stack>
                      <Typography variant="body2" color="success.main" fontWeight={700} sx={{ flexShrink: 0 }}>
                        {volunteer.distance || '2.1 km'}
                      </Typography>
                    </Stack>
                  </Box>
                )) : (
                  <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 2 }}>No volunteers found matching your search.</Typography>
                )}
              </Stack>
            </Paper>
            <Paper sx={{ p: 3, borderRadius: 4, mt: 4, boxShadow: '0 18px 40px rgba(15,23,42,0.08)' }}>
              <Typography variant="subtitle1" fontWeight={800} gutterBottom>
                Resources for Volunteers
              </Typography>
              <Stack spacing={2}>
                <Paper sx={{ p: 2, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography fontWeight={700}>Survival & Rescue Guide</Typography>
                    <Typography variant="body2" color="text.secondary">Offline guide for emergency situations</Typography>
                  </Box>
                  <Button size="small" variant="text" sx={{ textTransform: 'none' }}>View</Button>
                </Paper>
                <Paper sx={{ p: 2, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography fontWeight={700}>Training Materials</Typography>
                    <Typography variant="body2" color="text.secondary">Access training videos and documents</Typography>
                  </Box>
                  <Button size="small" variant="text" sx={{ textTransform: 'none' }}>View</Button>
                </Paper>
                <Paper sx={{ p: 2, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography fontWeight={700}>Safety Protocols</Typography>
                    <Typography variant="body2" color="text.secondary">Guidelines to keep you safe in operations</Typography>
                  </Box>
                  <Button size="small" variant="text" sx={{ textTransform: 'none' }}>View</Button>
                </Paper>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4, overflow: 'hidden' } }}>
        <Box sx={{ p: 3, background: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)', color: 'white' }}>
          <Typography variant="h5" fontWeight={800} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <VolunteerActivismRoundedIcon fontSize="large" /> Volunteer Registration
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
            Join the active roster to receive emergency broadcast alerts and assist in live operations.
          </Typography>
        </Box>
        <DialogContent sx={{ p: 4 }}>
          <Stack spacing={3}>
            <TextField 
              label="Full Name" 
              fullWidth 
              value={form.name} 
              onChange={e => setForm({...form, name: e.target.value})} 
              InputProps={{ startAdornment: <InputAdornment position="start"><PersonRoundedIcon color="action" /></InputAdornment> }}
            />
            <TextField 
              label="Phone Number" 
              fullWidth 
              value={form.phone} 
              onChange={e => setForm({...form, phone: e.target.value})} 
              InputProps={{ startAdornment: <InputAdornment position="start"><PhoneRoundedIcon color="action" /></InputAdornment> }}
            />
            <Autocomplete
              freeSolo
              options={skills.map(s => s.name)}
              value={form.skills}
              onInputChange={(event, newValue) => setForm({...form, skills: newValue || ''})}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  label="Primary Skills" 
                  fullWidth 
                  helperText="Select a predefined skill or type your own." 
                  InputProps={{ 
                    ...params.InputProps, 
                    startAdornment: (
                      <>
                        <InputAdornment position="start" sx={{ pl: 1 }}><StarRoundedIcon color="action" /></InputAdornment>
                        {params.InputProps.startAdornment}
                      </>
                    )
                  }}
                />
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1, bgcolor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
          <Button onClick={() => setOpen(false)} color="inherit" sx={{ fontWeight: 700, px: 3 }}>Cancel</Button>
          <Button onClick={handleRegister} variant="contained" color="success" startIcon={<LocationOnRoundedIcon />} sx={{ fontWeight: 800, px: 4, py: 1.5, borderRadius: 3, boxShadow: '0 8px 16px rgba(16, 185, 129, 0.3)' }}>
            Register & Lock GPS
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
