import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Avatar, Box, Button, Container, Grid, InputAdornment, Paper, Stack,
  TextField, Typography, Chip, Dialog, DialogTitle, DialogContent,
  DialogActions, Autocomplete, Alert, Select, MenuItem, Divider, IconButton
} from '@mui/material';

// API
import { fetchVolunteers, createVolunteer } from '../api/client';

// Icons
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import ArrowRightAltRoundedIcon from '@mui/icons-material/ArrowRightAltRounded';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import OndemandVideoOutlinedIcon from '@mui/icons-material/OndemandVideoOutlined';
import HealthAndSafetyOutlinedIcon from '@mui/icons-material/HealthAndSafetyOutlined';

// Skills Icons
import TerrainOutlinedIcon from '@mui/icons-material/TerrainOutlined';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined';
import PersonSearchOutlinedIcon from '@mui/icons-material/PersonSearchOutlined';
import LocalFireDepartmentOutlinedIcon from '@mui/icons-material/LocalFireDepartmentOutlined';
import CellTowerOutlinedIcon from '@mui/icons-material/CellTowerOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import FlightOutlinedIcon from '@mui/icons-material/FlightOutlined';

export default function VolunteerPage() {
  const [volunteers, setVolunteers] = useState([]);
  const [volunteerSearch, setVolunteerSearch] = useState('');
  const [radius, setRadius] = useState('10 km Radius');
  
  // Registration Modal State
  const [openRegister, setOpenRegister] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', skills: 'First Aid' });

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

  const allSkills = [
    { name: 'Mountain Rescue', icon: <TerrainOutlinedIcon fontSize="small" /> },
    { name: 'First Aid', icon: <LocalHospitalOutlinedIcon fontSize="small" /> },
    { name: 'Medical Support', icon: <MedicalServicesOutlinedIcon fontSize="small" /> },
    { name: 'Search & Rescue', icon: <PersonSearchOutlinedIcon fontSize="small" /> },
    { name: 'Fire Safety', icon: <LocalFireDepartmentOutlinedIcon fontSize="small" /> },
    { name: 'Communication', icon: <CellTowerOutlinedIcon fontSize="small" /> },
    { name: 'Logistics', icon: <LocalShippingOutlinedIcon fontSize="small" /> },
    { name: 'Drone Operator', icon: <FlightOutlinedIcon fontSize="small" /> },
  ];

  async function handleRegister() {
    if (!form.name || !form.phone) {
        alert("Please enter Name and Phone");
        return;
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          await createVolunteer({ 
            ...form, 
            lat: position.coords.latitude, 
            lng: position.coords.longitude,
            active: 1
          });
          setForm({ name: '', phone: '', skills: 'First Aid' });
          loadVolunteers();
          setOpenRegister(false);
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

  const filteredVolunteers = volunteers.filter(v => {
    if (!volunteerSearch) return true;
    const term = volunteerSearch.toLowerCase();
    return (v.name || '').toLowerCase().includes(term) ||
           (v.skills || v.role || '').toLowerCase().includes(term);
  });

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', pb: 10, fontFamily: "'Inter', sans-serif" }}>
      
      {/* 1. Hero Section */}
      <Box sx={{ 
        position: 'relative',
        height: 450,
        display: 'flex',
        alignItems: 'center',
        backgroundImage: 'url(/mountain-volunteer.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'top',
      }}>
        {/* Hero text removed as requested */}
      </Box>

      {/* 2. Main Content Grid */}
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Grid container spacing={4}>
          
          {/* LEFT COLUMN */}
          <Grid item xs={12} md={7} lg={8}>
            <Stack spacing={4}>
              
              {/* Find Volunteers Near You */}
              <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" fontWeight={800} color="#1a202c">
                    Find Volunteers Near You
                  </Typography>
                  <Button 
                    variant="contained" 
                    startIcon={<GroupAddOutlinedIcon />}
                    onClick={() => setOpenRegister(true)}
                    sx={{ 
                      bgcolor: '#0f4a30', 
                      color: '#fff', 
                      borderRadius: 1.5, 
                      fontWeight: 700,
                      boxShadow: '0 4px 12px rgba(15, 74, 48, 0.2)',
                      '&:hover': { bgcolor: '#0a3622' }
                    }}
                  >
                    Become a Volunteer
                  </Button>
                </Box>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={2}>
                  <TextField 
                    fullWidth 
                    size="small" 
                    placeholder="Enter your location" 
                    value={volunteerSearch}
                    onChange={(e) => setVolunteerSearch(e.target.value)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><LocationOnOutlinedIcon fontSize="small" /></InputAdornment>,
                      sx: { borderRadius: 1.5, bgcolor: '#ffffff' }
                    }}
                  />
                  <Select 
                    size="small" 
                    value={radius} 
                    onChange={(e) => setRadius(e.target.value)} 
                    sx={{ minWidth: 160, borderRadius: 1.5, bgcolor: '#ffffff' }}
                  >
                    <MenuItem value="5 km Radius">5 km Radius</MenuItem>
                    <MenuItem value="10 km Radius">10 km Radius</MenuItem>
                    <MenuItem value="20 km Radius">20 km Radius</MenuItem>
                  </Select>
                  <Button 
                    variant="contained" 
                    startIcon={<SearchRoundedIcon />}
                    sx={{ 
                      bgcolor: '#0f4a30', 
                      color: '#fff', 
                      px: 3, 
                      borderRadius: 1.5, 
                      fontWeight: 700,
                      boxShadow: 'none',
                      whiteSpace: 'nowrap',
                      '&:hover': { bgcolor: '#0a3622', boxShadow: 'none' }
                    }}
                  >
                    Search
                  </Button>
                </Stack>
                <Box sx={{ bgcolor: '#e6f4ea', p: 1.5, borderRadius: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <GroupsOutlinedIcon sx={{ color: '#0f4a30', fontSize: 20 }} />
                  <Typography variant="body2" color="#0f4a30" fontWeight={600}>
                    Showing {filteredVolunteers.length} volunteers within {radius.split(' ')[0]} radius
                  </Typography>
                </Box>
              </Paper>

              {/* Volunteer Skills */}
              <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)' }}>
                <Typography variant="h6" fontWeight={800} color="#1a202c" mb={3}>
                  Volunteer Skills
                </Typography>
                <Grid container spacing={2}>
                  {allSkills.map((skill) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={skill.name}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1.5, 
                        p: 1.5, 
                        border: '1px solid #e2e8f0', 
                        borderRadius: 1.5,
                        transition: 'border-color 0.2s',
                        '&:hover': { borderColor: '#0f4a30' }
                      }}>
                        <Box sx={{ color: '#0f4a30', display: 'flex' }}>
                          {skill.icon}
                        </Box>
                        <Typography variant="body2" fontWeight={600} color="#1a202c">
                          {skill.name}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Paper>

              {/* How It Works */}
              <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)' }}>
                <Typography variant="h6" fontWeight={800} color="#1a202c" mb={4}>
                  How It Works
                </Typography>
                <Grid container spacing={2} sx={{ position: 'relative' }}>
                  {/* Dashed line background */}
                  <Box sx={{ 
                    position: 'absolute', 
                    top: '28px', 
                    left: '10%', 
                    right: '10%', 
                    height: 0, 
                    borderTop: '2px dashed #cbd5e1', 
                    zIndex: 0,
                    display: { xs: 'none', md: 'block' }
                  }} />
                  
                  {[
                    { step: 1, title: 'Register', desc: 'Create your profile and choose your skills.', icon: <PersonOutlineRoundedIcon /> },
                    { step: 2, title: 'Get Notified', desc: 'Receive alerts for disasters near you (within 10km).', icon: <RoomOutlinedIcon /> },
                    { step: 3, title: 'Respond', desc: 'Accept the alert and coordinate with response teams.', icon: <GroupsOutlinedIcon /> },
                    { step: 4, title: 'Make a Difference', desc: 'Help in relief operations and save lives.', icon: <VerifiedUserOutlinedIcon /> },
                  ].map((item) => (
                    <Grid item xs={12} sm={6} md={3} key={item.step} sx={{ position: 'relative', zIndex: 1 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', md: 'center' }, textAlign: { xs: 'left', md: 'center' } }}>
                        <Box sx={{ position: 'relative', mb: 2 }}>
                          <Avatar sx={{ bgcolor: '#e6f4ea', color: '#0f4a30', width: 56, height: 56 }}>
                            {item.icon}
                          </Avatar>
                          <Box sx={{ 
                            position: 'absolute', 
                            bottom: -10, 
                            right: -10, 
                            bgcolor: '#0f4a30', 
                            color: '#fff', 
                            width: 24, height: 24, 
                            borderRadius: '50%', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.75rem', fontWeight: 800, border: '2px solid #fff'
                          }}>
                            {item.step}
                          </Box>
                        </Box>
                        <Typography variant="subtitle2" fontWeight={800} color="#1a202c" mb={0.5}>{item.title}</Typography>
                        <Typography variant="caption" color="#64748b" sx={{ maxWidth: 160 }}>{item.desc}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Paper>

            </Stack>
          </Grid>

          {/* RIGHT COLUMN */}
          <Grid item xs={12} md={5} lg={4}>
            <Stack spacing={4}>
              
              {/* Why Volunteer */}
              <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)' }}>
                <Typography variant="h6" fontWeight={800} color="#1a202c" mb={3}>
                  Why Volunteer?
                </Typography>
                <Stack spacing={3} mb={3}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Avatar sx={{ bgcolor: '#e6f4ea', color: '#0f4a30', width: 48, height: 48 }}>
                      <GroupsOutlinedIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={800} color="#1a202c">Make an Impact</Typography>
                      <Typography variant="caption" color="#64748b">Your skills can save lives and bring hope in critical situations.</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Avatar sx={{ bgcolor: '#e6f4ea', color: '#0f4a30', width: 48, height: 48 }}>
                      <SchoolOutlinedIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={800} color="#1a202c">Get Trained</Typography>
                      <Typography variant="caption" color="#64748b">Access training, resources and guides to enhance your skills.</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Avatar sx={{ bgcolor: '#e6f4ea', color: '#0f4a30', width: 48, height: 48 }}>
                      <BadgeOutlinedIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={800} color="#1a202c">Be Recognized</Typography>
                      <Typography variant="caption" color="#64748b">Receive recognition for your service and dedication.</Typography>
                    </Box>
                  </Box>
                </Stack>
                <Button 
                  endIcon={<ArrowRightAltRoundedIcon />} 
                  sx={{ color: '#0f4a30', fontWeight: 700, p: 0, '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' } }}
                  disableRipple
                >
                  Learn More
                </Button>
              </Paper>

              {/* Active Volunteers */}
              <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" fontWeight={800} color="#1a202c">
                    Active Volunteers
                  </Typography>
                  <Typography component={RouterLink} to="#" variant="body2" color="#0f4a30" fontWeight={700} sx={{ textDecoration: 'none' }}>
                    View All
                  </Typography>
                </Box>
                <Stack spacing={2.5} mb={3}>
                  {filteredVolunteers.slice(0, 4).map((vol, idx) => (
                    <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Avatar sx={{ width: 40, height: 40, bgcolor: '#cbd5e1' }} src={`https://i.pravatar.cc/150?u=${vol.name || idx}`} />
                        <Box>
                          <Typography variant="subtitle2" fontWeight={700} color="#1a202c">{vol.name || 'Anonymous'}</Typography>
                          <Typography variant="caption" color="#64748b">{vol.skills || vol.role || 'General'}</Typography>
                        </Box>
                      </Box>
                      <Box sx={{ bgcolor: '#f1f5f9', px: 1, py: 0.5, borderRadius: 1 }}>
                        <Typography variant="caption" fontWeight={600} color="#475569">{vol.distance || `${(Math.random()*10+1).toFixed(1)} km`}</Typography>
                      </Box>
                    </Box>
                  ))}
                  {filteredVolunteers.length === 0 && (
                    <Typography variant="body2" color="text.secondary" textAlign="center">No active volunteers found.</Typography>
                  )}
                </Stack>
                <Button 
                  fullWidth 
                  variant="outlined" 
                  sx={{ 
                    borderColor: '#cbd5e1', 
                    color: '#0f4a30', 
                    borderRadius: 1.5, 
                    fontWeight: 700, 
                    py: 1,
                    textTransform: 'none',
                    '&:hover': { borderColor: '#0f4a30', bgcolor: 'transparent' }
                  }}
                >
                  View More Volunteers
                </Button>
              </Paper>

              {/* Resources for Volunteers */}
              <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)' }}>
                <Typography variant="h6" fontWeight={800} color="#1a202c" mb={3}>
                  Resources for Volunteers
                </Typography>
                <Stack spacing={0}>
                  {[
                    { title: 'Survival & Rescue Guide', desc: 'Offline guide for emergency situations', icon: <MenuBookOutlinedIcon /> },
                    { title: 'Training Materials', desc: 'Access training videos and documents', icon: <OndemandVideoOutlinedIcon /> },
                    { title: 'Safety Protocols', desc: 'Guidelines to keep you safe in operations', icon: <HealthAndSafetyOutlinedIcon /> },
                  ].map((res, idx) => (
                    <React.Fragment key={idx}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Box sx={{ color: '#0f4a30', mt: 0.5 }}>{res.icon}</Box>
                          <Box>
                            <Typography variant="subtitle2" fontWeight={700} color="#1a202c">{res.title}</Typography>
                            <Typography variant="caption" color="#64748b">{res.desc}</Typography>
                          </Box>
                        </Box>
                        <IconButton size="small" sx={{ color: '#0f4a30' }}>
                          <ArrowRightAltRoundedIcon />
                        </IconButton>
                      </Box>
                      {idx < 2 && <Divider />}
                    </React.Fragment>
                  ))}
                </Stack>
              </Paper>

            </Stack>
          </Grid>
        </Grid>
      </Container>

      {/* Registration Modal Dialog */}
      <Dialog open={openRegister} onClose={() => setOpenRegister(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 800, color: '#1a202c', borderBottom: '1px solid #f1f5f9' }}>
          Official Volunteer Registration
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Stack spacing={3}>
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              <Typography variant="body2" fontWeight={700}>GPS Location Lock</Typography>
              <Typography variant="caption">Submitting this form logs your current location to dispatch you effectively.</Typography>
            </Alert>
            <TextField 
              label="Full Name" 
              fullWidth 
              size="small"
              value={form.name} 
              onChange={e => setForm({...form, name: e.target.value})} 
            />
            <TextField 
              label="Phone Number" 
              fullWidth 
              size="small"
              value={form.phone} 
              onChange={e => setForm({...form, phone: e.target.value})} 
            />
            <Autocomplete
              freeSolo
              size="small"
              options={allSkills.map(s => s.name)}
              value={form.skills}
              onInputChange={(event, newValue) => setForm({...form, skills: newValue || ''})}
              renderInput={(params) => (
                <TextField {...params} label="Primary Skill" fullWidth helperText="Select a skill or type your own" />
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid #f1f5f9' }}>
          <Button onClick={() => setOpenRegister(false)} sx={{ color: '#64748b', fontWeight: 600 }}>Cancel</Button>
          <Button variant="contained" onClick={handleRegister} sx={{ bgcolor: '#0f4a30', fontWeight: 700, borderRadius: 1.5, boxShadow: 'none' }}>
            Register & Lock GPS
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
