import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';

const NAVY = '#0F172A';
const BLUE = '#1D4ED8';

export default function AboutPage() {
  return (
    <Box sx={{ bgcolor: '#F8FAFC', minHeight: 'calc(100vh - 66px)', py: 6 }}>
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 900, color: NAVY, fontSize: '2.5rem', mb: 2 }}>
            About Suraksha Sarthi
          </Typography>
          <Typography sx={{ fontSize: '1.1rem', color: '#64748B', fontWeight: 500 }}>
            Dedicated to protecting Himachal Pradesh through faster response, better coordination, and safer communities.
          </Typography>
        </Box>
        
        <Box sx={{ bgcolor: '#FFF', borderRadius: 4, p: 4, border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, color: NAVY, fontSize: '1.5rem', mb: 2 }}>
            Our Mission
          </Typography>
          <Typography sx={{ color: '#475569', lineHeight: 1.8, mb: 4 }}>
            Suraksha Sarthi is a unified emergency response platform designed specifically for the State Disaster Response Force (SDRF) of Himachal Pradesh. Our mission is to bridge the gap between citizens in distress and the emergency personnel equipped to save them, leveraging technology to minimize response times during critical situations.
          </Typography>

          <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, color: NAVY, fontSize: '1.5rem', mb: 2 }}>
            Key Features
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 2, bgcolor: '#F1F5F9', borderRadius: 2 }}>
                <Typography sx={{ fontWeight: 700, color: BLUE, mb: 1 }}>Live Incident Mapping</Typography>
                <Typography sx={{ fontSize: '0.85rem', color: '#475569' }}>Real-time tracking of emergencies across the state to coordinate rapid dispatch.</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 2, bgcolor: '#F1F5F9', borderRadius: 2 }}>
                <Typography sx={{ fontWeight: 700, color: BLUE, mb: 1 }}>Resource Management</Typography>
                <Typography sx={{ fontSize: '0.85rem', color: '#475569' }}>Centralized dashboard for tracking equipment, vehicles, and medical supplies.</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 2, bgcolor: '#F1F5F9', borderRadius: 2 }}>
                <Typography sx={{ fontWeight: 700, color: BLUE, mb: 1 }}>Volunteer Network</Typography>
                <Typography sx={{ fontSize: '0.85rem', color: '#475569' }}>Connecting trained civilian volunteers with SDRF teams for localized assistance.</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 2, bgcolor: '#F1F5F9', borderRadius: 2 }}>
                <Typography sx={{ fontWeight: 700, color: BLUE, mb: 1 }}>SOS Alert System</Typography>
                <Typography sx={{ fontSize: '0.85rem', color: '#475569' }}>Instant one-tap emergency reporting system for citizens in danger.</Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
