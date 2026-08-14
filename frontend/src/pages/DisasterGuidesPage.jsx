import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, CardActionArea } from '@mui/material';
import LocalLibraryRoundedIcon from '@mui/icons-material/LocalLibraryRounded';
import WaterDropRoundedIcon from '@mui/icons-material/WaterDropRounded';
import LandscapeRoundedIcon from '@mui/icons-material/LandscapeRounded';
import FireExtinguisherRoundedIcon from '@mui/icons-material/FireExtinguisherRounded';

const GUIDES = [
  { title: 'Earthquake Safety', icon: <LandscapeRoundedIcon fontSize="large" sx={{ color: '#F97316' }}/>, desc: 'What to do before, during, and after an earthquake.' },
  { title: 'Flood Preparedness', icon: <WaterDropRoundedIcon fontSize="large" sx={{ color: '#3B82F6' }}/>, desc: 'Evacuation plans and safety measures for heavy rains and floods.' },
  { title: 'Landslide Warning', icon: <LandscapeRoundedIcon fontSize="large" sx={{ color: '#8B5CF6' }}/>, desc: 'Recognizing the warning signs of landslides in hilly terrains.' },
  { title: 'Fire Emergency', icon: <FireExtinguisherRoundedIcon fontSize="large" sx={{ color: '#EF4444' }}/>, desc: 'Forest fire prevention and escape strategies.' },
];

export default function DisasterGuidesPage() {
  return (
    <Box sx={{ py: 8, flexGrow: 1 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <LocalLibraryRoundedIcon sx={{ fontSize: 40, color: '#10B981' }} />
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#0F172A', fontFamily: '"Outfit", sans-serif' }}>
            Disaster Preparedness Guides
          </Typography>
        </Box>
        <Typography sx={{ mb: 6, color: '#475569', fontSize: '1.1rem' }}>
          Explore our official guides to stay safe and prepared during various natural disasters in Himachal Pradesh.
        </Typography>

        <Grid container spacing={3}>
          {GUIDES.map((guide, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Card sx={{ height: '100%', borderRadius: 4, border: '1px solid #E2E8F0', boxShadow: 'none', transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' } }}>
                <CardActionArea sx={{ p: 3, height: '100%' }}>
                  <Box sx={{ mb: 2 }}>{guide.icon}</Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', mb: 1 }}>{guide.title}</Typography>
                  <Typography sx={{ color: '#64748B', fontSize: '0.9rem', lineHeight: 1.5 }}>{guide.desc}</Typography>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
