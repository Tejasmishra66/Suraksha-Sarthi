import React from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  Avatar,
  keyframes,
  Stack,
  IconButton,
  Link,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import MapRoundedIcon from '@mui/icons-material/MapRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import BuildRoundedIcon from '@mui/icons-material/BuildRounded';
import CallRoundedIcon from '@mui/icons-material/CallRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulseGlow = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(22, 163, 74, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(22, 163, 74, 0); }
  100% { box-shadow: 0 0 0 0 rgba(22, 163, 74, 0); }
`;

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(10px); }
`;

export default function HomePage() {
  const navigate = useNavigate();

  // Main modules configuration makes it easy to add more features later
  const features = [
    {
      title: 'Report Emergency',
      description: 'Report emergencies, track incident status, and request immediate help.',
      icon: <AssignmentRoundedIcon fontSize="large" />,
      color: '#ef4444',
      path: '/emergency'
    },
    {
      title: 'Map Location',
      description: 'Find real-time coordinates, operational zones, and pinpoint disaster locations instantly.',
      icon: <LocationOnRoundedIcon fontSize="large" />,
      color: '#3b82f6',
      path: '/map'
    },
    {
      title: 'Volunteers',
      description: 'Find and manage trained volunteers, capabilities, and radius broadcasts.',
      icon: <GroupsRoundedIcon fontSize="large" />,
      color: '#10b981',
      path: '/volunteer'
    },
    {
      title: 'Equipment',
      description: 'Track SDRF equipment, manage inventory, and view maintenance alerts.',
      icon: <BuildRoundedIcon fontSize="large" />,
      color: '#f59e0b',
      path: '/equipment'
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <TopNavBar />
      
      {/* Hero Section */}
      <Box
        sx={{
          backgroundImage: `url('/assets/heroin.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          minHeight: '100vh',
          display: 'flex',
          position: 'relative',
          alignItems: 'center',
          py: { xs: 12, md: 0 },
          textAlign: 'left',
        }}
      >
        <Container maxWidth={false} sx={{ px: { xs: 3, md: 8, lg: 12 }, position: 'relative', zIndex: 1 }}>
          <Typography 
            variant="h2" 
            fontWeight={900} 
            sx={{ 
              opacity: 0,
              fontSize: { xs: '2rem', md: '3.25rem' },
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              fontStyle: 'italic',
              animation: `${fadeInUp} 0.8s ease-out forwards`,
              textShadow: '0 10px 30px rgba(0,0,0,0.5)',
            }}
          >
            <Box component="span" sx={{ color: '#ffffff' }}>TOGETHER,</Box>
            {' '}
            <Box component="span" sx={{ color: '#4ade80' }}>WE RISE.</Box>
          </Typography>
          <Typography 
            variant="h2"
            fontWeight={900} 
            sx={{ 
              mb: 4, 
              opacity: 0, 
              fontSize: { xs: '2rem', md: '3.25rem' },
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              fontStyle: 'italic',
              animation: `${fadeInUp} 0.8s ease-out 0.2s forwards`,
              textShadow: '0 10px 30px rgba(0,0,0,0.5)',
            }}
          >
            <Box component="span" sx={{ color: '#ffffff' }}>TOGETHER,</Box>
            {' '}
            <Box component="span" sx={{ color: '#4ade80' }}>WE SAVE.</Box>
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              color="success" 
              size="large"
              onClick={() => navigate('/map')}
              sx={{ 
                borderRadius: 8, 
                px: 4, 
                py: 1.5, 
                fontSize: '1.1rem', 
                textTransform: 'none',
                opacity: 0,
                animation: `${fadeInUp} 0.8s ease-out 0.4s forwards`,
                boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.39)',
                '&:hover': {
                  boxShadow: '0 6px 20px 0 rgba(16, 185, 129, 0.5)'
                }
              }}
            >
              Go to Active Incidents
            </Button>
            <Button 
              variant="contained" 
              color="error" 
              size="large"
              onClick={() => navigate('/emergency')}
              sx={{ 
                borderRadius: 8, 
                px: 4, 
                py: 1.5, 
                fontSize: '1.1rem', 
                textTransform: 'none',
                opacity: 0,
                animation: `${fadeInUp} 0.8s ease-out 0.5s forwards`,
                boxShadow: '0 4px 14px 0 rgba(239, 68, 68, 0.39)',
                '&:hover': {
                  boxShadow: '0 6px 20px 0 rgba(239, 68, 68, 0.5)'
                }
              }}
            >
              Report Emergency
            </Button>
          </Box>
        </Container>

        {/* Irregular Wavy Bottom Border */}
        <Box sx={{ position: 'absolute', bottom: -1, left: 0, width: '100%', overflow: 'hidden', lineHeight: 0, zIndex: 0 }}>
          <svg viewBox="0 0 1440 320" style={{ display: 'block', width: '100%', height: '120px' }} preserveAspectRatio="none">
            <path 
              fill="#f8fafc" 
              d="M0,224L48,213.3C96,203,192,181,288,186.7C384,192,480,213,576,213.3C672,213,768,192,864,170.7C960,149,1056,128,1152,133.3C1248,139,1344,171,1392,186.7L1440,203L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </Box>

        {/* Animated Bouncing Arrow */}
        <Box
          sx={{
            position: 'absolute',
            bottom: { xs: 20, md: 40 },
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2,
          }}
        >
          <IconButton
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            sx={{ 
              color: '#10b981',
              animation: `${bounce} 2s ease-in-out infinite`,
              '&:hover': { bgcolor: 'rgba(16, 185, 129, 0.1)' }
            }}
            aria-label="Scroll down"
          >
            <KeyboardArrowDownRoundedIcon sx={{ fontSize: 48, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }} />
          </IconButton>
        </Box>
      </Box>

      {/* Main Features Grid */}
      <Box sx={{ 
        py: 8,
        backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight={800} textAlign="center" sx={{ mb: 6 }}>
            Quick Access
          </Typography>

          <Grid container spacing={4}>
            {features.map((feature) => (
              <Grid item xs={12} sm={6} md={3} key={feature.title}>
                <Paper 
                  sx={{ 
                    p: 4, 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    textAlign: 'center',
                    borderRadius: 4,
                    cursor: 'pointer',
                  transition: 'all 0.3s ease',
                    border: '1px solid #e2e8f0',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                    boxShadow: '0 22px 45px rgba(0,0,0,0.1)',
                    borderColor: `${feature.color}50`,
                    '& .MuiAvatar-root': {
                      transform: 'scale(1.1) translateY(-4px)',
                      bgcolor: feature.color,
                      color: 'white'
                    }
                    }
                  }}
                  onClick={() => navigate(feature.path)}
                  elevation={0}
                  role="button"
                  tabIndex={0}
                  aria-label={`Navigate to ${feature.title}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      navigate(feature.path);
                    }
                  }}
                >
                  <Avatar 
                    sx={{ 
                      bgcolor: `${feature.color}15`, 
                      color: feature.color, 
                      width: 72, 
                      height: 72,
                    mb: 3,
                    transition: 'all 0.3s ease'
                    }}
                  >
                    {feature.icon}
                  </Avatar>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                    {feature.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* About Us Section */}
      <Box 
        sx={{ 
          bgcolor: '#f8fafc', 
          backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          py: { xs: 8, md: 12 }, 
          mt: 'auto' 
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'inline-block', px: 2, py: 0.75, bgcolor: '#dcfce7', color: '#166534', borderRadius: 2, fontWeight: 800, fontSize: '0.875rem', mb: 3, animation: `${pulseGlow} 2s infinite` }}>
                WHO WE ARE
              </Box>
              <Typography variant="h3" fontWeight={900} sx={{ color: '#0f172a', mb: 3, lineHeight: 1.2 }}>
                Empowering Communities in Times of Crisis
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 3, fontWeight: 400, lineHeight: 1.6 }}>
                The State Disaster Response Force (SDRF) Helping Hands is a dedicated platform designed to streamline disaster response, coordinate volunteer efforts, and manage critical resources effectively.
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                Our mission is to empower communities and operational teams with real-time intelligence, ensuring a rapid, unified, and efficient response to emergencies across Himachal Pradesh.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper 
                sx={{ 
                  p: { xs: 4, md: 5 }, 
                  borderRadius: 6, 
                  bgcolor: '#ffffff', 
                  boxShadow: '0 24px 48px rgba(15,23,42,0.08)', 
                  position: 'relative', 
                  overflow: 'hidden' 
                }} 
                elevation={0}
              >
                {/* Decorative shape */}
                <Box sx={{ position: 'absolute', top: -30, right: -30, width: 150, height: 150, bgcolor: '#10b981', borderRadius: '50%', opacity: 0.1 }} />
                
                <Typography variant="h5" fontWeight={800} sx={{ color: '#0f172a', mb: 4 }}>
                  Contact Information
                </Typography>
                <Stack spacing={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                    <Avatar sx={{ bgcolor: '#f0fdf4', color: '#16a34a', width: 48, height: 48 }}><CallRoundedIcon /></Avatar>
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>Emergency Helpline</Typography>
                      <Typography variant="body1" fontWeight={800} color="#0f172a" sx={{ fontSize: '1.1rem' }}>1070</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                    <Avatar sx={{ bgcolor: '#f0fdf4', color: '#16a34a', width: 48, height: 48 }}><EmailRoundedIcon /></Avatar>
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>Email Address</Typography>
                      <Typography variant="body1" fontWeight={800} color="#0f172a" sx={{ fontSize: '1.1rem' }}>support@sdrf-himachal.gov.in</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                    <Avatar sx={{ bgcolor: '#f0fdf4', color: '#16a34a', width: 48, height: 48 }}><LocationOnRoundedIcon /></Avatar>
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>Headquarters</Typography>
                      <Typography variant="body1" fontWeight={800} color="#0f172a" sx={{ fontSize: '1.1rem' }}>SDRF Command Center, Shimla, HP</Typography>
                    </Box>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer Section */}
      <Box component="footer" sx={{ bgcolor: '#0f172a', py: 3, textAlign: 'center', color: 'rgba(255,255,255,0.7)' }}>
        <Typography variant="body2">
          &copy; {new Date().getFullYear()} SDRF Helping Hands. All rights reserved. |{' '}
          <Link href="/terms" color="inherit" underline="hover">
            Terms of Service
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}