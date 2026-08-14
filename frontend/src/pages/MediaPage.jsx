import React, { useState } from 'react';
import { Box, Container, Typography, Grid, Button, Paper, Chip } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

// Icons
import PlayCircleFilledRoundedIcon from '@mui/icons-material/PlayCircleFilledRounded';
import CameraAltRoundedIcon from '@mui/icons-material/CameraAltRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';

const NAVY = '#0F172A';
const BLUE = '#1D4ED8';
const LIGHT_BLUE = '#EFF6FF';
const RED = '#DC2626';

const MEDIA_DATA = [
  {
    id: 1,
    type: 'image',
    url: '/assets/sdrf_river_rescue_1786531136250.jpg',
    category: 'SDRF Action',
    title: 'River Flood Rescue Operation',
    location: 'Mandi District',
    date: '10 Aug 2026',
    height: 350
  },
  {
    id: 2,
    type: 'video', // we will just show a play button overlay
    url: '/assets/sdrf_helicopter_evacuation_1786531793865.jpg',
    category: 'Incidents',
    title: 'Aerial Evacuation in Flooded Zones',
    location: 'Kangra Region',
    date: '11 Aug 2026',
    height: 400
  },
  {
    id: 3,
    type: 'image',
    url: '/assets/sdrf_landslide_clearance_1786531275551.jpg',
    category: 'SDRF Action',
    title: 'Highway Landslide Clearance',
    location: 'Kullu Manali Highway',
    date: '08 Aug 2026',
    height: 300
  },
  {
    id: 4,
    type: 'image',
    url: '/assets/sdrf_medical_camp_1786531416612.jpg',
    category: 'News & Updates',
    title: 'Medical Relief Camp Setup',
    location: 'Remote Village, Shimla',
    date: '05 Aug 2026',
    height: 450
  },
  {
    id: 5,
    type: 'image',
    url: '/assets/sdrf_mountain_logo_1785925375555.jpg',
    category: 'News & Updates',
    title: 'SDRF Expansion Announcement',
    location: 'Shimla Headquarters',
    date: '01 Aug 2026',
    height: 250
  }
];

export default function MediaPage() {
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'Incidents', 'SDRF Action', 'News & Updates'];

  const filteredMedia = filter === 'All' 
    ? MEDIA_DATA 
    : MEDIA_DATA.filter(m => m.category === filter);

  // Simple Masonry distribution (2 columns for desktop)
  const col1 = [];
  const col2 = [];
  
  filteredMedia.forEach((item, index) => {
    if (index % 2 === 0) col1.push(item);
    else col2.push(item);
  });

  return (
    <Box sx={{ bgcolor: '#F8FAFC', minHeight: 'calc(100vh - 66px)', pb: 8 }}>
      
      {/* Hero Header */}
      <Box sx={{ bgcolor: NAVY, color: '#FFF', py: { xs: 4, md: 8 }, px: 2, textAlign: 'center', backgroundImage: 'linear-gradient(to right, #0F172A, #1E3A8A)' }}>
        <Container maxWidth="md">
          <Typography variant="h3" sx={{ fontWeight: 900, mb: 2, letterSpacing: '-0.02em' }}>Media & Live Operations</Typography>
          <Typography variant="h6" sx={{ color: '#94A3B8', fontWeight: 500, mb: 4 }}>
            Visual updates from the field, news coverage, and live incident media featuring the SDRF rescue teams across Himachal Pradesh.
          </Typography>

          {/* Filtering Tabs */}
          <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap' }}>
            {categories.map(c => (
              <Button
                key={c}
                onClick={() => setFilter(c)}
                variant={filter === c ? 'contained' : 'outlined'}
                sx={{ 
                  borderRadius: 8, px: 3, py: 1, textTransform: 'none', fontWeight: 700,
                  bgcolor: filter === c ? BLUE : 'transparent',
                  borderColor: filter === c ? BLUE : '#475569',
                  color: filter === c ? '#FFF' : '#CBD5E1',
                  '&:hover': { bgcolor: filter === c ? '#1E40AF' : '#1E293B', borderColor: '#1E40AF' }
                }}
              >
                {c}
              </Button>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Masonry Grid */}
      <Container maxWidth="lg" sx={{ mt: 6 }}>
        <Grid container spacing={3}>
          {[col1, col2].map((col, colIndex) => (
            <Grid item xs={12} md={6} key={colIndex}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <AnimatePresence>
                  {col.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.95, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4 }}
                    >
                      <Paper
                        elevation={0}
                        sx={{
                          position: 'relative',
                          borderRadius: 4,
                          overflow: 'hidden',
                          bgcolor: '#FFF',
                          border: '1px solid #E2E8F0',
                          cursor: 'pointer',
                          '&:hover .media-overlay': { opacity: 1 },
                          '&:hover .media-image': { transform: 'scale(1.05)' }
                        }}
                      >
                        {/* Image Container */}
                        <Box sx={{ width: '100%', height: item.height, overflow: 'hidden', position: 'relative' }}>
                          <Box 
                            className="media-image"
                            sx={{ 
                              width: '100%', height: '100%', 
                              backgroundImage: `url(${item.url})`, 
                              backgroundSize: 'cover', 
                              backgroundPosition: 'center',
                              transition: 'transform 0.5s ease'
                            }} 
                          />
                          
                          {/* Video Play Icon overlay */}
                          {item.type === 'video' && (
                            <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(0,0,0,0.3)' }}>
                              <PlayCircleFilledRoundedIcon sx={{ fontSize: 64, color: '#FFF', opacity: 0.9 }} />
                            </Box>
                          )}

                          {/* Hover Overlay */}
                          <Box 
                            className="media-overlay"
                            sx={{ 
                              position: 'absolute', inset: 0, 
                              background: 'linear-gradient(to top, rgba(15,23,42,0.9) 0%, rgba(15,23,42,0) 100%)',
                              opacity: 0, transition: 'opacity 0.3s ease',
                              display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', p: 3
                            }}
                          >
                            <Typography sx={{ color: '#FFF', fontWeight: 800, fontSize: '1.2rem', mb: 1 }}>{item.title}</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: '#CBD5E1' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <LocationOnRoundedIcon sx={{ fontSize: 16 }} />
                                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>{item.location}</Typography>
                              </Box>
                              <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{item.date}</Typography>
                            </Box>
                          </Box>
                        </Box>
                        
                        {/* Bottom Label (always visible) */}
                        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {item.type === 'video' ? <PlayCircleFilledRoundedIcon sx={{ color: RED || '#EF4444', fontSize: 20 }} /> : <CameraAltRoundedIcon sx={{ color: BLUE, fontSize: 20 }} />}
                            <Typography sx={{ fontWeight: 800, color: NAVY, fontSize: '0.9rem' }}>{item.title}</Typography>
                          </Box>
                          <Chip label={item.category} size="small" sx={{ fontWeight: 700, fontSize: '0.7rem', bgcolor: LIGHT_BLUE, color: BLUE }} />
                        </Box>

                      </Paper>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

    </Box>
  );
}
