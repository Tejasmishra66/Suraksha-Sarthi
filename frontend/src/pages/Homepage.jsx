import React from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
  Card,
  CardContent,
  Avatar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ReportRoundedIcon from '@mui/icons-material/ReportRounded';
import VolunteerActivismRoundedIcon from '@mui/icons-material/VolunteerActivismRounded';
import MapRoundedIcon from '@mui/icons-material/MapRounded';
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';
import ArticleRoundedIcon from '@mui/icons-material/ArticleRounded'; // Imported for Field Reporting
import HealthAndSafetyRoundedIcon from '@mui/icons-material/HealthAndSafetyRounded'; // New icon for Rescue Operations
import CallRoundedIcon from '@mui/icons-material/CallRounded';
import BuildRoundedIcon from '@mui/icons-material/BuildRounded';
import TopNavBar from '../components/TopNavBar';

export default function Homepage() {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Emergency Reporting',
      icon: <ReportRoundedIcon sx={{ color: '#b91c1c' }} />,
      desc: 'Report disasters and get immediate help from nearest teams.',
      accent: '#fee2e2',
      cta: 'Explore',
      route: '/emergency',
    },
    {
      title: 'Volunteer Management',
      icon: <VolunteerActivismRoundedIcon sx={{ color: '#047857' }} />,
      desc: 'Connect with trained volunteers and view skill-based teams.',
      accent: '#dcfce7',
      cta: 'Explore',
      route: '/volunteer',
    },
    {
      title: 'Field Reporting',
      icon: <ArticleRoundedIcon sx={{ color: '#2563eb' }} />, // Already updated icon
      desc: 'Submit verified reports with GPS, photos and offline support.',
      accent: '#dbeafe',
      cta: 'Explore',
      route: '/reports',
    },
    {
      title: 'Live Map & Alerts',
      icon: <MapRoundedIcon sx={{ color: '#16a34a' }} />,
      desc: 'View real-time alerts, warning pins and affected locations.',
      accent: '#d1fae5',
      cta: 'Explore',
      route: '/map',
    },
    {
      title: 'Equipment Tracking',
      icon: <BuildRoundedIcon sx={{ color: '#7c3aed' }} />, // Already updated icon
      desc: 'Track equipment using QR code and view live availability.',
      accent: '#ede9fe',
      cta: 'Explore',
      route: '/equipment',
    },
    {
      title: 'Official Updates',
      icon: <NotificationsActiveRoundedIcon sx={{ color: '#ea580c' }} />,
      desc: 'Stay informed with verified updates and department news.',
      accent: '#ffedd5',
      cta: 'Explore',
      route: '/updates',
    },
  ];

  const liveAlerts = [
    { title: 'Heavy Rainfall Warning', meta: 'Kullu, Mandi, Shimla', time: '2 hours ago', color: '#ef4444' },
    { title: 'Landslide Warning', meta: 'Chamba, Kangra', time: '5 hours ago', color: '#f59e0b' },
    { title: 'Rescue Operation Ongoing', meta: 'Lahaul & Spiti', time: '1 day ago', color: '#10b981' },
  ];

  const stats = [
    { label: 'Active Volunteers', value: '12,458+', icon: <VolunteerActivismRoundedIcon sx={{ color: '#fff' }} /> },
    { label: 'Rescue Operations', value: '1,287+', icon: <HealthAndSafetyRoundedIcon sx={{ color: '#fff' }} /> },
    { label: 'Equipment Available', value: '3,842+', icon: <BuildRoundedIcon sx={{ color: '#fff' }} /> },
    { label: 'Districts Covered', value: '12', icon: <MapRoundedIcon sx={{ color: '#fff' }} /> },
  ];

  const mountainBg = '/assets/mountain.svg';

  return (
    <Box sx={{ minHeight: '100vh', background: '#fff' }}>
      <TopNavBar />

      {/* HERO */}
      <Box
        sx={{
          backgroundImage: `linear-gradient(90deg, rgba(255,255,255,0.0), rgba(0,0,0,0.15)), url('/assets/heroin.jpg')`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: { xs: 'center', md: 'center right' },
          color: '#062018',
          minHeight: { xs: '60vh', md: '85vh' },
          display: 'flex',
          alignItems: 'center',
          py: { xs: 6, md: 0 },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h2" fontWeight={900} sx={{ mb: 2, color: '#07241d' }}>Together, <Box component="span" sx={{ color: '#0b6b57' }}>We Rise.</Box><br/>Together, <Box component="span" sx={{ color: '#0b6b57' }}>We Save.</Box></Typography>
              {/* Increased font size and stronger color for body text to improve readability and impact */}
              <Typography variant="body1" sx={{ mb: 4, maxWidth: 640, fontSize: { xs: '1rem', md: '1.15rem' }, color: '#1f2937' }}>
                SDRF Helping Hands is a unified platform for disaster response, coordination and real-time information sharing across Himachal Pradesh.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 4 }}>
                <Button
                  variant="contained"
                  color="error" // Use error color for emergency for urgency
                  size="large"
                  sx={{ textTransform: 'none', px: 4, py: 1.5, fontWeight: 700 }}
                  onClick={() => navigate('/emergency')}
                >
                  Report an Emergency
                </Button>
                <Button variant="outlined" color="success" size="large" sx={{ textTransform: 'none', px: 4, py: 1.5, fontWeight: 700 }} onClick={() => navigate('/volunteer')}>
                  Volunteer Now
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 10 } }}> {/* Increased vertical padding */}
        <Typography variant="h5" fontWeight={800} align="center" sx={{ mb: 3 }}>How We Help</Typography>

        <Grid container spacing={2} sx={{ mb: 6 }} alignItems="stretch">
          {features.map((f, idx) => (
            <Grid item xs={12} sm={6} md={4} lg={2} key={idx}>
              <Card 
                sx={{ 
                  borderRadius: 3, 
                  height: '100%', 
                  border: '1px solid #f1f5f9', 
                  boxShadow: '0 6px 20px rgba(15,23,42,0.04)', 
                  p: 1,
                  transition: 'transform 0.2s, box-shadow 0.2s', // Added transition for smooth hover
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 10px 30px rgba(15,23,42,0.1)' } // Added hover effect
                }}
              >
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 1 }}> 
                  <Avatar sx={{ bgcolor: f.accent, color: 'inherit', width: 56, height: 56 }}>{f.icon}</Avatar>
                  <Typography variant="subtitle2" fontWeight={800}>{f.title}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>{f.desc}</Typography> {/* Description now visible on all screen sizes */}
                  <Button 
                    size="small" 
                    sx={{ mt: 1, textTransform: 'none', fontWeight: 700 }}
                    onClick={() => navigate(f.route)}
                  >
                    {f.cta}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Paper sx={{ p: 3, borderRadius: 3, mb: { xs: 6, md: 8 } }}> {/* Increased margin-bottom for Live Alerts */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h6" fontWeight={800}>Live Alerts</Typography>
            <Button size="small" onClick={() => navigate('/alerts')}>View All Alerts</Button>
          </Stack> 

          <Grid container spacing={2}>
            {liveAlerts.map((a, i) => (
              <Grid item xs={12} md={4} key={i}>
                <Paper sx={{ p: 2, borderRadius: 2, borderLeft: `6px solid ${a.color}`, background: '#fff' }}>
                  <Typography fontWeight={800}>{a.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{a.meta} • {a.time}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Paper>

        <Box sx={{ my: { xs: 6, md: 8 }, borderRadius: 2, overflow: 'hidden' }}> {/* Increased vertical margin for Stats section */}
          <Box sx={{ backgroundImage: `linear-gradient(rgba(6,36,25,0.7), rgba(6,36,25,0.7)), url()`, backgroundSize: 'cover', backgroundPosition: 'center', color: 'white', py: 6 }}>
            <Container maxWidth="lg">
              <Grid container spacing={3}>
                {stats.map((s, i) => (
                  <Grid item xs={6} md={3} key={i}>
                    <Stack alignItems="center">
                      <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.08)', mb: 1 }}>
                        {s.icon}
                      </Avatar>
                      <Typography variant="h5" fontWeight={900}>{s.value}</Typography>
                      <Typography color="white" sx={{ opacity: 0.9 }}>{s.label}</Typography>
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </Container>
          </Box>
        </Box>
      </Container>

      <Box sx={{ background: '#0b3b36', color: 'white', py: { xs: 6, md: 8 } }}> {/* Increased vertical padding for Footer */}
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight={800}>SDRF Helping Hands</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>Committed to saving lives and protecting communities across Himachal Pradesh.</Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight={700}>Quick Links</Typography>
              <Stack sx={{ mt: 1 }} spacing={1}>
                <Typography variant="body2">About Us</Typography>
                <Typography variant="body2">Our Mission</Typography>
                <Typography variant="body2">Resources</Typography>
              </Stack>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight={700}>24x7 Helpline</Typography>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
                <CallRoundedIcon />
                <Box>
                  <Typography variant="h4" fontWeight={900}>1070</Typography>
                  <Typography variant="body2">State Emergency Operation Centre</Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

    </Box>
  );
}
