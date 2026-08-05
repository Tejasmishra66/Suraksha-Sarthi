import React from 'react';
import { Box, Container, Grid, Typography, Stack, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';

function FooterLink({ to, children }) {
  return (
    <Typography 
      component={RouterLink} 
      to={to} 
      variant="body2" 
      sx={{ 
        color: '#64748B', 
        textDecoration: 'none', 
        fontWeight: 600,
        fontFamily: '"Outfit", sans-serif',
        transition: 'color 0.15s',
        '&:hover': { color: '#1D4ED8', textDecoration: 'underline' }
      }}
    >
      {children}
    </Typography>
  );
}

export default function Footer() {
  return (
    <Box sx={{ bgcolor: '#fff', color: '#0B1A3E', pt: { xs: 8, md: 10 }, pb: 6, mt: 'auto', borderTop: '1px solid #E2E8F0' }}>
      <Container maxWidth="xl">
        <Grid container spacing={8}>
          
          {/* Brand Column */}
          <Grid item xs={12} md={5}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box sx={{ width: 40, height: 40, borderRadius: '11px', background: 'linear-gradient(135deg, #1D4ED8 0%, #EA580C 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(29,78,216,0.30)' }}>
                <ShieldRoundedIcon sx={{ fontSize: 22, color: '#fff' }} />
              </Box>
              <Box>
                <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 900, color: '#0B1A3E', letterSpacing: '-0.02em', lineHeight: 1.1, fontSize: '1.2rem' }}>
                  Suraksha Sarthi
                </Typography>
                <Typography sx={{ fontFamily: '"Outfit", sans-serif', color: '#64748B', display: 'block', mt: 0.2, lineHeight: 1, fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  State Disaster Response Force, HP
                </Typography>
              </Box>
            </Box>
            <Typography variant="body1" sx={{ color: '#475569', mb: 3, maxWidth: 400, lineHeight: 1.75 }}>
              The official centralized platform for real-time hazard monitoring, emergency reporting, and crisis management across Himachal Pradesh.
            </Typography>
          </Grid>

          {/* Emergency & Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography sx={{ fontFamily: '"Outfit", sans-serif', color: '#94A3B8', mb: 2, display: 'block', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Emergency Contacts
            </Typography>
            <Stack spacing={1.5} sx={{ mb: 4 }}>
              <Typography variant="body2" sx={{ color: '#0B1A3E', fontWeight: 700, fontFamily: '"Outfit", sans-serif' }}>
                State Helpline: <Box component="span" sx={{ color: '#DC2626', fontSize: '1.2rem', fontWeight: 800 }}>1070</Box>
              </Typography>
              <Typography variant="body2" sx={{ color: '#0B1A3E', fontWeight: 700, fontFamily: '"Outfit", sans-serif' }}>
                National SOS: <Box component="span" sx={{ color: '#DC2626', fontSize: '1.2rem', fontWeight: 800 }}>112</Box>
              </Typography>
            </Stack>
            
            <Typography sx={{ fontFamily: '"Outfit", sans-serif', color: '#94A3B8', mb: 2, display: 'block', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
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
            <Typography sx={{ fontFamily: '"Outfit", sans-serif', color: '#94A3B8', mb: 2, display: 'block', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              SDRF Headquarters
            </Typography>
            <Typography variant="body2" sx={{ color: '#0B1A3E', mb: 0.5, fontWeight: 700, fontFamily: '"Outfit", sans-serif' }}>
              State Disaster Management Authority
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748B', mb: 3, lineHeight: 1.6 }}>
              HP Secretariat, Shimla<br/>
              Himachal Pradesh, India - 171002
            </Typography>
            <Typography variant="body2" sx={{ color: '#1D4ED8', fontWeight: 700, fontFamily: '"Outfit", sans-serif' }}>
              contact@sdrf.hp.gov.in
            </Typography>
          </Grid>

        </Grid>

        <Divider sx={{ my: 5, borderColor: '#F1F5F9' }} />

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 600 }}>
            © {new Date().getFullYear()} Government of Himachal Pradesh. All rights reserved.
          </Typography>
          <Stack direction="row" spacing={4}>
            <Typography component={RouterLink} to="#" variant="caption" sx={{ color: '#64748B', textDecoration: 'none', fontWeight: 600, '&:hover': { color: '#1D4ED8' } }}>Privacy Policy</Typography>
            <Typography component={RouterLink} to="#" variant="caption" sx={{ color: '#64748B', textDecoration: 'none', fontWeight: 600, '&:hover': { color: '#1D4ED8' } }}>Terms of Service</Typography>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
