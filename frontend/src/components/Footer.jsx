import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Container, Grid, Typography, IconButton, Link, Stack, Button, Divider } from '@mui/material';

import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import XIcon from '@mui/icons-material/X';
import CallRoundedIcon from '@mui/icons-material/CallRounded';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';

import LogoIcon from './LogoIcon';

export default function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: '#0f4a30', color: '#e2e8f0', pt: 8, pb: 4, mt: 'auto' }}>
      <Container maxWidth="xl">
        <Grid container spacing={6} mb={6}>
          {/* Column 1: Logo & Info */}
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <LogoIcon color="#ffffff" />
              <Box>
                <Typography variant="h6" sx={{ color: '#fff', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.5px', fontSize: '1.4rem' }}>
                  SDRF
                </Typography>
                <Typography variant="caption" sx={{ color: '#fff', fontWeight: 900, letterSpacing: 0.5, display: 'block', mt: -0.5 }}>
                  HELPING HANDS
                </Typography>
                <Typography variant="caption" display="block" sx={{ color: '#94a3b8', fontSize: '0.65rem', marginTop: '-2px', fontWeight: 700 }}>
                  HIMACHAL PRADESH
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" sx={{ mb: 3, lineHeight: 1.6, color: '#e2e8f0', pr: 2 }}>
              Committed to saving lives and protecting communities across Himachal Pradesh.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <IconButton size="small" sx={{ color: '#fff', border: '1px solid rgba(255,255,255,0.2)', bgcolor: 'rgba(255,255,255,0.05)', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}><FacebookIcon fontSize="small" /></IconButton>
              <IconButton size="small" sx={{ color: '#fff', border: '1px solid rgba(255,255,255,0.2)', bgcolor: 'rgba(255,255,255,0.05)', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}><XIcon fontSize="small" /></IconButton>
              <IconButton size="small" sx={{ color: '#fff', border: '1px solid rgba(255,255,255,0.2)', bgcolor: 'rgba(255,255,255,0.05)', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}><InstagramIcon fontSize="small" /></IconButton>
              <IconButton size="small" sx={{ color: '#fff', border: '1px solid rgba(255,255,255,0.2)', bgcolor: 'rgba(255,255,255,0.05)', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}><YouTubeIcon fontSize="small" /></IconButton>
            </Box>
          </Grid>

          {/* Column 2: Quick Links */}
          <Grid item xs={12} sm={4} md={2}>
            <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 700, mb: 3 }}>
              Quick Links
            </Typography>
            <Stack spacing={2}>
              <Link component={RouterLink} to="/about" color="inherit" underline="none" sx={{ transition: 'color 0.2s', '&:hover': { color: '#fff' } }}>About Us</Link>
              <Link href="https://hpsdma.nic.in/Home/Index?page=Vision%20and%20Mission" target="_blank" rel="noopener noreferrer" color="inherit" underline="none" sx={{ transition: 'color 0.2s', '&:hover': { color: '#fff' } }}>Our Mission</Link>
              <Link href="https://hpsdma.nic.in/Home/Index?page=Publications" target="_blank" rel="noopener noreferrer" color="inherit" underline="none" sx={{ transition: 'color 0.2s', '&:hover': { color: '#fff' } }}>Resources</Link>
              <Link href="https://hpsdma.nic.in/Home/Index?page=Guidelines" target="_blank" rel="noopener noreferrer" color="inherit" underline="none" sx={{ transition: 'color 0.2s', '&:hover': { color: '#fff' } }}>Training & Guides</Link>
              <Link href="https://ndma.gov.in/Reference_Material/FAQ" target="_blank" rel="noopener noreferrer" color="inherit" underline="none" sx={{ transition: 'color 0.2s', '&:hover': { color: '#fff' } }}>FAQs</Link>
            </Stack>
          </Grid>

          {/* Column 3: Important Links */}
          <Grid item xs={12} sm={4} md={3}>
            <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 700, mb: 3 }}>
              Important Links
            </Typography>
            <Stack spacing={2}>
              <Link href="https://himachal.nic.in/" target="_blank" rel="noopener noreferrer" color="inherit" underline="none" sx={{ transition: 'color 0.2s', '&:hover': { color: '#fff' } }}>Government of Himachal</Link>
              <Link href="https://hpsdma.nic.in/" target="_blank" rel="noopener noreferrer" color="inherit" underline="none" sx={{ transition: 'color 0.2s', '&:hover': { color: '#fff' } }}>Disaster Management Department</Link>
              <Link href="https://mausam.imd.gov.in/shimla/" target="_blank" rel="noopener noreferrer" color="inherit" underline="none" sx={{ transition: 'color 0.2s', '&:hover': { color: '#fff' } }}>IMD Weather Updates</Link>
              <Link href="https://ndma.gov.in/" target="_blank" rel="noopener noreferrer" color="inherit" underline="none" sx={{ transition: 'color 0.2s', '&:hover': { color: '#fff' } }}>NDMA India</Link>
            </Stack>
          </Grid>

          {/* Column 4: 24x7 Helpline */}
          <Grid item xs={12} sm={4} md={4}>
            <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 700, mb: 3 }}>
              24x7 Helpline
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box sx={{ 
                width: 48, 
                height: 48, 
                borderRadius: '50%', 
                border: '1px solid rgba(255,255,255,0.3)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <CallRoundedIcon sx={{ color: '#fff' }} />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight={800} color="#fff">1070</Typography>
                <Typography variant="caption" color="#cbd5e1">State Emergency Operation Centre</Typography>
              </Box>
            </Box>
            <Button 
              variant="outlined" 
              fullWidth
              startIcon={<EmailOutlinedIcon />}
              sx={{ 
                color: '#fff', 
                borderColor: 'rgba(255,255,255,0.3)',
                borderRadius: '6px',
                py: 1,
                '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.05)' }
              }}
            >
              Email Us
            </Button>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 3 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="caption" color="#94a3b8">
              &copy; {new Date().getFullYear()} SDRF Helping Hands. All rights reserved.
            </Typography>
            <Box sx={{ display: 'flex', gap: 3 }}>
                <Link href="#" color="#94a3b8" underline="none" variant="caption" sx={{ transition: 'color 0.2s', '&:hover': { color: '#fff' } }}>Privacy Policy</Link>
                <Link href="#" color="#94a3b8" underline="none" variant="caption" sx={{ transition: 'color 0.2s', '&:hover': { color: '#fff' } }}>Terms of Use</Link>
            </Box>
        </Box>
      </Container>
    </Box>
  );
}
