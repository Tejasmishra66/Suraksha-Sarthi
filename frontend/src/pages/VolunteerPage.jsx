import React from 'react';
import {
  Avatar,
  Box,
  Button,
  Container,
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

export default function VolunteerPage() {
  const heroImage = '/assets/heroin.jpg';

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

  const volunteers = [
    { name: 'Rohit Thakur', role: 'Mountain Rescue • First Aid', distance: '2.1 km' },
    { name: 'Anjali Sharma', role: 'Medical Support • First Aid', distance: '3.4 km' },
    { name: 'Vikas Negi', role: 'Search & Rescue • Logistics', distance: '5.2 km' },
    { name: 'Pooja Verma', role: 'Communication • Drone Operator', distance: '6.7 km' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', background: '#f4faf4' }}>
      <TopNavBar />

      <Box
        sx={{
          backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.88), rgba(255,255,255,0.88)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center right',
          py: { xs: 6, md: 10 },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography variant="h3" fontWeight={900} sx={{ mb: 2, color: '#102f25' }}>
                Volunteers. Strength in Unity.
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 620, mb: 4 }}>
                Join our network of trained volunteers and be the strength in times of need.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button variant="contained" color="success" size="large" sx={{ textTransform: 'none', borderRadius: 3, px: 4 }}>
                  Register as Volunteer
                </Button>
                <Button variant="outlined" color="success" size="large" sx={{ textTransform: 'none', borderRadius: 3, px: 4 }}>
                  Learn More
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} lg={7}>
            {/* New section for "Find Volunteers Near You" - moved from Hero */}
            <Paper sx={{ p: 4, borderRadius: 4, mb: 4, boxShadow: '0 20px 40px rgba(15, 40, 20, 0.06)' }}>
              <Typography variant="h6" fontWeight={800} gutterBottom>
                Find Volunteers Near You
              </Typography>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  placeholder="Enter your location"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOnRoundedIcon color="success" />
                      </InputAdornment>
                    ),
                  }}
                />
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField fullWidth select label="Radius" SelectProps={{ native: true }} defaultValue="10 km">
                    <option value="5 km">5 km</option>
                    <option value="10 km">10 km</option>
                    <option value="20 km">20 km</option>
                  </TextField>
                  <Button variant="contained" color="success" fullWidth startIcon={<SearchRoundedIcon />}>
                    Search
                  </Button>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  Showing volunteers within 10 km radius
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
                {volunteers.map((volunteer) => (
                  <Box key={volunteer.name} sx={{ p: 2, borderRadius: 3, border: '1px solid #e6f3ea', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ bgcolor: '#dcfce7', color: '#047857' }}>
                          {volunteer.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography fontWeight={700}>{volunteer.name}</Typography>
                          <Typography variant="body2" color="text.secondary">{volunteer.role}</Typography>
                        </Box>
                      </Stack>
                      <Typography variant="body2" color="success.main" fontWeight={700} sx={{ flexShrink: 0 }}>
                        {volunteer.distance}
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
    </Box>
  );
}
