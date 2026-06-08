﻿﻿﻿import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import TopNavBar from '../components/TopNavBar';
import VolunteerActivismRoundedIcon from '@mui/icons-material/VolunteerActivismRounded';
import MapRoundedIcon from '@mui/icons-material/MapRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
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

  return (
    <Box sx={{ minHeight: '100vh', background: '#f4faf4' }}>
      <TopNavBar />

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2} sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={900} color="#102f25">Volunteer Dashboard</Typography>
          <Button variant="contained" color="success" size="large" onClick={() => setOpen(true)} sx={{ textTransform: 'none', borderRadius: 3, px: 4 }}>
            Register as Volunteer
          </Button>
        </Stack>

        <Grid container spacing={4}>
          <Grid item xs={12} lg={7}>
            <Paper sx={{ p: 4, borderRadius: 4, mb: 4, boxShadow: '0 20px 40px rgba(15, 40, 20, 0.06)' }}>
              <Typography variant="h6" fontWeight={800} gutterBottom>
                Emergency Radius Broadcast
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Instantly ping all registered volunteers near your live location.
              </Typography>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  placeholder="e.g., Need 3 Medics at Sector 9 immediately."
                  value={broadcastMsg}
                  onChange={(e) => setBroadcastMsg(e.target.value)}
                />
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField fullWidth select label="Radius" SelectProps={{ native: true }} value={broadcastRadius} onChange={(e) => setBroadcastRadius(e.target.value)}>
                    <option value="5">5 km</option>
                    <option value="10">10 km</option>
                    <option value="20">20 km</option>
                  </TextField>
                  <Button variant="contained" color="error" fullWidth onClick={handleBroadcast} startIcon={<CampaignRoundedIcon />} sx={{ fontWeight: 800 }}>
                    Send Broadcast
                  </Button>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  Broadcasts utilize the SMS gateway for guaranteed delivery.
                </Typography>
              </Stack>
            </Paper>

            <Paper sx={{ p: 4, borderRadius: 4, mb: 4, boxShadow: '0 20px 40px rgba(15, 40, 20, 0.06)' }}>
              <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
                Volunteer Skills
              </Typography>
              <Grid container spacing={2}>
                {skills.map((skill) => (
                  <Grid item xs={6} sm={4} key={skill.name}>
                    <Paper sx={{ p: 2, borderRadius: 3, border: '1px solid #e6f3ea' }}>
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
                <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid #e6f3ea' }}>
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
                <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid #e6f3ea' }}>
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

          <Grid item xs={12} lg={5}>
            <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid #e6f3ea', boxShadow: '0 20px 40px rgba(15, 40, 20, 0.04)' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6" fontWeight={800}>Active Volunteers</Typography>
                <Button size="small" variant="text" sx={{ textTransform: 'none' }}>View All</Button>
              </Stack>
              <Stack spacing={2}>
                {volunteers.map((volunteer, idx) => (
                  <Box key={volunteer.id || idx} sx={{ p: 2, borderRadius: 3, border: '1px solid #e6f3ea', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ bgcolor: '#dcfce7', color: '#047857' }}>
                          {volunteer.name?.charAt(0) || 'V'}
                        </Avatar>
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
                ))}
              </Stack>
            </Paper>
            <Paper sx={{ p: 3, borderRadius: 4, mt: 4, border: '1px solid #e6f3ea' }}>
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
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={800}>Register as Volunteer</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Full Name" fullWidth value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            <TextField label="Phone Number" fullWidth value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
            <TextField label="Primary Skills" fullWidth value={form.skills} onChange={e => setForm({...form, skills: e.target.value})} helperText="e.g., First Aid, Mountain Rescue" />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpen(false)} color="inherit">Cancel</Button>
          <Button onClick={handleRegister} variant="contained" color="success">Register</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
