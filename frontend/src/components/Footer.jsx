import React from 'react';
import { Box, Container, Grid, Typography, Stack, Divider, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

const LIGHT_GREEN = '#ECFDF5';
const DARK_GREEN = '#064E3B';
const ACCENT = '#10B981';

function FooterLink({ to, children }) {
  return (
    <Typography 
      component={RouterLink} 
      to={to} 
      variant="body2" 
      sx={{ 
        color: '#475569', 
        textDecoration: 'none', 
        fontWeight: 600,
        fontFamily: '"Outfit", sans-serif',
        transition: 'color 0.2s',
        '&:hover': { color: ACCENT }
      }}
    >
      {children}
    </Typography>
  );
}

export default function Footer() {
  return (
    <Box sx={{ bgcolor: LIGHT_GREEN, color: DARK_GREEN, pt: { xs: 8, md: 10 }, pb: 6, mt: 'auto', borderTop: '1px solid #A7F3D0' }}>
      <Container maxWidth="xl">
        <Grid container spacing={8}>
          
          {/* Brand Column */}
          <Grid item xs={12} md={5}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px -1px rgba(16,185,129,0.1)' }}>
                <Box
                  component="img"
                  src="/sdrf-logo.png"
                  alt="SDRF Logo"
                  sx={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '12px' }}
                  onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }}
                />
                <ShieldRoundedIcon sx={{ fontSize: 24, color: ACCENT, display: 'none' }} />
              </Box>
              <Box>
                <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 900, color: DARK_GREEN, letterSpacing: '-0.02em', lineHeight: 1.1, fontSize: '1.4rem' }}>
                  Suraksha Sarthi
                </Typography>
                <Typography sx={{ fontFamily: '"Outfit", sans-serif', color: '#059669', display: 'block', mt: 0.2, lineHeight: 1, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  State Disaster Response Force, HP
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" sx={{ color: '#475569', mb: 4, maxWidth: 400, lineHeight: 1.7 }}>
              The official centralized platform for real-time hazard monitoring, emergency reporting, and crisis management across Himachal Pradesh.
            </Typography>
            <Stack direction="row" spacing={1.5}>
              <IconButton sx={{ color: '#059669', bgcolor: 'rgba(16,185,129,0.1)', '&:hover': { bgcolor: ACCENT, color: '#FFF' } }}>
                <TwitterIcon fontSize="small" />
              </IconButton>
              <IconButton sx={{ color: '#059669', bgcolor: 'rgba(16,185,129,0.1)', '&:hover': { bgcolor: ACCENT, color: '#FFF' } }}>
                <FacebookIcon fontSize="small" />
              </IconButton>
              <IconButton sx={{ color: '#059669', bgcolor: 'rgba(16,185,129,0.1)', '&:hover': { bgcolor: ACCENT, color: '#FFF' } }}>
                <InstagramIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Grid>

          {/* Emergency & Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography sx={{ fontFamily: '"Outfit", sans-serif', color: DARK_GREEN, mb: 3, display: 'block', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Emergency Contacts
            </Typography>
            <Stack direction="row" spacing={3} sx={{ mb: 4 }}>
              <Box>
                <Typography variant="caption" sx={{ color: '#059669', fontWeight: 700, display: 'block', mb: 0.5 }}>STATE HELPLINE</Typography>
                <Typography variant="h5" sx={{ color: '#DC2626', fontWeight: 900, fontFamily: '"Outfit", sans-serif', lineHeight: 1 }}>1070</Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#059669', fontWeight: 700, display: 'block', mb: 0.5 }}>NATIONAL SOS</Typography>
                <Typography variant="h5" sx={{ color: '#DC2626', fontWeight: 900, fontFamily: '"Outfit", sans-serif', lineHeight: 1 }}>112</Typography>
              </Box>
            </Stack>
            
            <Typography sx={{ fontFamily: '"Outfit", sans-serif', color: DARK_GREEN, mb: 2, display: 'block', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Platform
            </Typography>
            <Stack spacing={1.5}>
              <FooterLink to="/">Home</FooterLink>
              <FooterLink to="/emergency">Report Incident</FooterLink>
              <FooterLink to="/login">SDRF Portal Login</FooterLink>
              <FooterLink to="/signup">Citizen Sign Up</FooterLink>
            </Stack>
          </Grid>

          {/* Address */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography sx={{ fontFamily: '"Outfit", sans-serif', color: DARK_GREEN, mb: 3, display: 'block', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              SDRF Headquarters
            </Typography>
            <Box sx={{ p: 3, bgcolor: '#FFF', borderRadius: 3, border: '1px solid #D1FAE5', boxShadow: '0 4px 6px -1px rgba(16,185,129,0.05)' }}>
              <Typography variant="body2" sx={{ color: DARK_GREEN, mb: 1, fontWeight: 700, fontFamily: '"Outfit", sans-serif' }}>
                State Disaster Management Authority
              </Typography>
              <Typography variant="body2" sx={{ color: '#475569', mb: 3, lineHeight: 1.6 }}>
                HP Secretariat, Shimla<br/>
                Himachal Pradesh, India - 171002
              </Typography>
              <Typography variant="body2" sx={{ color: '#059669', fontWeight: 700, fontFamily: '"Outfit", sans-serif' }}>
                contact@sdrf.hp.gov.in
              </Typography>
            </Box>
          </Grid>

        </Grid>

        <Divider sx={{ my: 6, borderColor: '#A7F3D0' }} />

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Typography variant="caption" sx={{ color: '#059669', fontWeight: 700 }}>
            © {new Date().getFullYear()} Government of Himachal Pradesh. All rights reserved.
          </Typography>
          <Stack direction="row" spacing={3}>
            <FooterLink to="/">Privacy Policy</FooterLink>
            <FooterLink to="/">Terms of Service</FooterLink>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
