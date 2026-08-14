import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Card, CardActionArea, Button, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { useLocation } from 'react-router-dom';
import LocalLibraryRoundedIcon from '@mui/icons-material/LocalLibraryRounded';
import WaterDropRoundedIcon from '@mui/icons-material/WaterDropRounded';
import LandscapeRoundedIcon from '@mui/icons-material/LandscapeRounded';
import FireExtinguisherRoundedIcon from '@mui/icons-material/FireExtinguisherRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';

const GUIDES = [
  { 
    id: 'earthquake',
    title: 'Earthquake Safety', 
    icon: <LandscapeRoundedIcon fontSize="large" sx={{ color: '#F97316' }}/>, 
    desc: 'What to do before, during, and after an earthquake.',
    dos: ['Drop down onto your hands and knees', 'Cover your head and neck under a sturdy table or desk', 'Hold on to your shelter until shaking stops', 'Stay away from glass, windows, and outside doors'],
    donts: ['Do not run outside during the shaking', 'Do not use elevators', 'Do not light a match or use a lighter (due to possible gas leaks)', 'Do not stand in doorways']
  },
  { 
    id: 'flood',
    title: 'Flood Preparedness', 
    icon: <WaterDropRoundedIcon fontSize="large" sx={{ color: '#3B82F6' }}/>, 
    desc: 'Evacuation plans and safety measures for heavy rains and floods.',
    dos: ['Move to higher ground immediately', 'Listen to radio/TV for updates', 'Disconnect electrical appliances', 'Boil drinking water before use'],
    donts: ['Do not walk through moving water (6 inches can knock you down)', 'Do not drive into flooded areas', 'Do not touch electrical equipment if you are wet or standing in water']
  },
  { 
    id: 'landslide',
    title: 'Landslide Warning', 
    icon: <LandscapeRoundedIcon fontSize="large" sx={{ color: '#8B5CF6' }}/>, 
    desc: 'Recognizing the warning signs of landslides in hilly terrains.',
    dos: ['Stay alert and awake during severe storms', 'Listen for unusual sounds like trees cracking or boulders knocking together', 'Move away from the path of a landslide as quickly as possible', 'Be alert for sudden increases or decreases in water flow in streams'],
    donts: ['Do not assume the danger is over once the first slide has passed', 'Do not return to your home until authorities say it is safe', 'Do not build near steep slopes, close to mountain edges, or near drainage ways']
  },
  { 
    id: 'fire',
    title: 'Fire Emergency', 
    icon: <FireExtinguisherRoundedIcon fontSize="large" sx={{ color: '#EF4444' }}/>, 
    desc: 'Forest and domestic fire prevention and escape strategies.',
    dos: ['Call 112 immediately if you spot an uncontrollable fire', 'Evacuate immediately if ordered to do so', 'Keep windows and doors closed to prevent smoke from entering', 'Crawl low under smoke to escape'],
    donts: ['Do not throw lit cigarettes or matches in dry areas', 'Do not leave campfires or stoves unattended', 'Do not try to extinguish a large fire yourself', 'Do not use elevators during a fire']
  },
];

export default function DisasterGuidesPage() {
  const location = useLocation();
  const [selectedGuide, setSelectedGuide] = useState(null);

  useEffect(() => {
    if (location.hash) {
      const hash = location.hash.replace('#', '');
      const found = GUIDES.find(g => g.id === hash);
      if (found) setSelectedGuide(found);
    }
  }, [location.hash]);

  const handleBack = () => {
    setSelectedGuide(null);
    window.history.replaceState(null, '', '/guides');
  };

  return (
    <Box sx={{ py: 8, flexGrow: 1, bgcolor: '#F8FAFC', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        
        {!selectedGuide ? (
          <Box sx={{ animation: 'fadeIn 0.3s ease' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
              <LocalLibraryRoundedIcon sx={{ fontSize: 40, color: '#10B981' }} />
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#0F172A', fontFamily: '"Outfit", sans-serif' }}>
                Disaster Preparedness Guides
              </Typography>
            </Box>
            <Typography sx={{ mb: 6, color: '#475569', fontSize: '1.1rem' }}>
              Explore our official guides to stay safe and prepared during various natural disasters in Himachal Pradesh. Select a guide below to view detailed Do's and Don'ts.
            </Typography>

            <Grid container spacing={3}>
              {GUIDES.map((guide, i) => (
                <Grid item xs={12} sm={6} md={3} key={i}>
                  <Card sx={{ height: '100%', borderRadius: 4, border: '1px solid #E2E8F0', boxShadow: 'none', transition: 'all 0.2s ease', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 15px 25px -5px rgba(0,0,0,0.1)' } }}>
                    <CardActionArea 
                      sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }} 
                      onClick={() => {
                        setSelectedGuide(guide);
                        window.history.pushState(null, '', `/guides#${guide.id}`);
                      }}
                    >
                      <Box sx={{ mb: 2 }}>{guide.icon}</Box>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', mb: 1, fontFamily: '"Outfit", sans-serif' }}>{guide.title}</Typography>
                      <Typography sx={{ color: '#64748B', fontSize: '0.9rem', lineHeight: 1.5, mb: 2 }}>{guide.desc}</Typography>
                      <Typography sx={{ mt: 'auto', color: '#2563EB', fontWeight: 700, fontSize: '0.85rem' }}>Read Guide →</Typography>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : (
          <Box sx={{ animation: 'fadeIn 0.3s ease' }}>
            <Button 
              startIcon={<ArrowBackRoundedIcon />} 
              onClick={handleBack}
              sx={{ mb: 4, color: '#64748B', fontWeight: 700, textTransform: 'none', '&:hover': { bgcolor: '#E2E8F0' } }}
            >
              Back to All Guides
            </Button>

            <Box sx={{ bgcolor: '#FFF', p: { xs: 3, md: 5 }, borderRadius: 4, border: '1px solid #E2E8F0', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                {selectedGuide.icon}
                <Typography variant="h3" sx={{ fontWeight: 900, color: '#0F172A', fontFamily: '"Outfit", sans-serif' }}>
                  {selectedGuide.title}
                </Typography>
              </Box>
              <Typography sx={{ color: '#475569', fontSize: '1.1rem', mb: 5 }}>
                {selectedGuide.desc}
              </Typography>

              <Grid container spacing={6}>
                {/* DO's */}
                <Grid item xs={12} md={6}>
                  <Box sx={{ bgcolor: '#ECFDF5', p: 3, borderRadius: 3, border: '1px solid #A7F3D0', height: '100%' }}>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#064E3B', mb: 3, fontFamily: '"Outfit", sans-serif' }}>
                      ✔️ DO's
                    </Typography>
                    <List disablePadding>
                      {selectedGuide.dos.map((item, idx) => (
                        <ListItem key={idx} sx={{ px: 0, py: 1, alignItems: 'flex-start' }}>
                          <ListItemIcon sx={{ minWidth: 36, mt: 0.5 }}>
                            <CheckCircleRoundedIcon sx={{ color: '#10B981' }} />
                          </ListItemIcon>
                          <ListItemText 
                            primary={item} 
                            primaryTypographyProps={{ sx: { color: '#064E3B', fontWeight: 600, lineHeight: 1.5 } }} 
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </Grid>

                {/* DONT's */}
                <Grid item xs={12} md={6}>
                  <Box sx={{ bgcolor: '#FEF2F2', p: 3, borderRadius: 3, border: '1px solid #FECACA', height: '100%' }}>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#7F1D1D', mb: 3, fontFamily: '"Outfit", sans-serif' }}>
                      ❌ DON'Ts
                    </Typography>
                    <List disablePadding>
                      {selectedGuide.donts.map((item, idx) => (
                        <ListItem key={idx} sx={{ px: 0, py: 1, alignItems: 'flex-start' }}>
                          <ListItemIcon sx={{ minWidth: 36, mt: 0.5 }}>
                            <CancelRoundedIcon sx={{ color: '#DC2626' }} />
                          </ListItemIcon>
                          <ListItemText 
                            primary={item} 
                            primaryTypographyProps={{ sx: { color: '#7F1D1D', fontWeight: 600, lineHeight: 1.5 } }} 
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
}
