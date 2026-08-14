import React from 'react';
import { Box, Container, Grid, Typography, Stack, Divider, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';

const NAVY = '#0F172A';
const BLUE = '#2563EB';
const RED = '#DC2626';
const TEXT_MUTED = '#94A3B8';
const BORDER_COLOR = 'rgba(255,255,255,0.1)';

function FooterLink({ to, children }) {
  return (
    <Typography 
      component={RouterLink} 
      to={to} 
      variant="body2" 
      sx={{ 
        color: TEXT_MUTED, 
        textDecoration: 'none', 
        fontWeight: 500,
        fontFamily: '"Outfit", sans-serif',
        transition: 'all 0.2s',
        display: 'inline-block',
        '&:hover': { color: '#FFF', transform: 'translateX(4px)' }
      }}
    >
      {children}
    </Typography>
  );
}

export default function Footer() {
  return (
    <Box sx={{ bgcolor: NAVY, color: '#FFF', pt: { xs: 8, md: 10 }, pb: 4, mt: 'auto' }}>
      <Container maxWidth="xl">
        <Grid container spacing={8}>
          
          {/* Brand Column */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box sx={{ width: 52, height: 52, borderRadius: '12px', bgcolor: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 0.5 }}>
                <Box
                  component="img"
                  src="/sdrf-logo.png"
                  alt="SDRF Logo"
                  sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }}
                />
                <ShieldRoundedIcon sx={{ fontSize: 32, color: BLUE, display: 'none' }} />
              </Box>
              <Box>
                <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 900, color: '#FFF', letterSpacing: '-0.02em', lineHeight: 1.1, fontSize: '1.6rem', textTransform: 'uppercase' }}>
                  Suraksha Sarthi
                </Typography>
                <Typography sx={{ fontFamily: '"Outfit", sans-serif', color: BLUE, display: 'block', mt: 0.2, lineHeight: 1, fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  State Disaster Response Force, HP
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" sx={{ color: TEXT_MUTED, mb: 4, maxWidth: 380, lineHeight: 1.8, fontSize: '0.9rem' }}>
              The official centralized platform for real-time hazard monitoring, emergency reporting, and crisis management across Himachal Pradesh. Empowering citizens and responders to save lives together.
            </Typography>
            <Stack direction="row" spacing={2}>
              <IconButton sx={{ color: TEXT_MUTED, border: `1px solid ${BORDER_COLOR}`, '&:hover': { bgcolor: BLUE, color: '#FFF', borderColor: BLUE } }}>
                <TwitterIcon fontSize="small" />
              </IconButton>
              <IconButton sx={{ color: TEXT_MUTED, border: `1px solid ${BORDER_COLOR}`, '&:hover': { bgcolor: BLUE, color: '#FFF', borderColor: BLUE } }}>
                <FacebookIcon fontSize="small" />
              </IconButton>
              <IconButton sx={{ color: TEXT_MUTED, border: `1px solid ${BORDER_COLOR}`, '&:hover': { bgcolor: BLUE, color: '#FFF', borderColor: BLUE } }}>
                <InstagramIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={4} md={2}>
            <Typography sx={{ fontFamily: '"Outfit", sans-serif', color: '#FFF', mb: 3, display: 'block', fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Platform
            </Typography>
            <Stack spacing={2}>
              <FooterLink to="/">Home</FooterLink>
              <FooterLink to="/map">Live Incident Map</FooterLink>
              <FooterLink to="/emergency">Report Incident</FooterLink>
              <FooterLink to="/updates">Alerts & Broadcasts</FooterLink>
              <FooterLink to="/volunteer">Volunteer Network</FooterLink>
            </Stack>
          </Grid>

          {/* Resources & Legal */}
          <Grid item xs={12} sm={4} md={2}>
            <Typography sx={{ fontFamily: '"Outfit", sans-serif', color: '#FFF', mb: 3, display: 'block', fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Resources
            </Typography>
            <Stack spacing={2}>
              <FooterLink to="/guides">Disaster Guides</FooterLink>
              <FooterLink to="/contacts">Emergency Contacts</FooterLink>
              <FooterLink to="/login">SDRF Portal Login</FooterLink>
              <FooterLink to="/signup">Citizen Sign Up</FooterLink>
              <FooterLink to="/">Privacy Policy</FooterLink>
            </Stack>
          </Grid>

          {/* Contact & Emergency */}
          <Grid item xs={12} sm={4} md={4}>
            <Typography sx={{ fontFamily: '"Outfit", sans-serif', color: '#FFF', mb: 3, display: 'block', fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              SDRF Headquarters
            </Typography>
            
            <Stack spacing={2.5} sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <LocationOnRoundedIcon sx={{ color: BLUE, mt: 0.5 }} />
                <Box>
                  <Typography variant="body2" sx={{ color: '#FFF', fontWeight: 700, mb: 0.5 }}>State Disaster Management Authority</Typography>
                  <Typography variant="body2" sx={{ color: TEXT_MUTED, lineHeight: 1.6 }}>HP Secretariat, Shimla<br/>Himachal Pradesh, India - 171002</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <EmailRoundedIcon sx={{ color: BLUE }} />
                <Typography variant="body2" sx={{ color: TEXT_MUTED }}>contact@sdrf.hp.gov.in</Typography>
              </Box>
            </Stack>

            <Box sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 3, border: `1px solid ${BORDER_COLOR}` }}>
              <Typography sx={{ fontFamily: '"Outfit", sans-serif', color: '#FFF', mb: 2, display: 'block', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                24/7 Emergency Lines
              </Typography>
              <Stack direction="row" spacing={4}>
                <Box>
                  <Typography variant="caption" sx={{ color: TEXT_MUTED, fontWeight: 600, display: 'block', mb: 0.5 }}>STATE HELPLINE</Typography>
                  <Typography sx={{ color: RED, fontWeight: 900, fontFamily: '"Outfit", sans-serif', fontSize: '1.8rem', lineHeight: 1 }}>1070</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: TEXT_MUTED, fontWeight: 600, display: 'block', mb: 0.5 }}>NATIONAL SOS</Typography>
                  <Typography sx={{ color: RED, fontWeight: 900, fontFamily: '"Outfit", sans-serif', fontSize: '1.8rem', lineHeight: 1 }}>112</Typography>
                </Box>
              </Stack>
            </Box>
          </Grid>

        </Grid>

        <Divider sx={{ my: 5, borderColor: BORDER_COLOR }} />

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Typography variant="caption" sx={{ color: TEXT_MUTED, fontWeight: 500 }}>
            © {new Date().getFullYear()} Government of Himachal Pradesh. All rights reserved.
          </Typography>
          <Stack direction="row" spacing={3} alignItems="center">
            <Typography variant="caption" sx={{ color: TEXT_MUTED, fontWeight: 500 }}>
              Designed for rapid emergency response.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
               <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10B981', mt: 0.5, boxShadow: '0 0 8px #10B981' }} />
               <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 700 }}>Systems Online</Typography>
            </Box>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
