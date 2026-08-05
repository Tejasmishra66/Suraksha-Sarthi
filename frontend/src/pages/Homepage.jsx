import React from 'react';
import { Box, Container, Typography, Grid, Button, Stack, Card, CardContent } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import MapRoundedIcon           from '@mui/icons-material/MapRounded';
import CampaignRoundedIcon      from '@mui/icons-material/CampaignRounded';
import GroupsRoundedIcon        from '@mui/icons-material/GroupsRounded';
import ArrowForwardRoundedIcon  from '@mui/icons-material/ArrowForwardRounded';
import ErrorOutlineRoundedIcon  from '@mui/icons-material/ErrorOutlineRounded';
import SecurityRoundedIcon      from '@mui/icons-material/SecurityRounded';
import PhoneInTalkRoundedIcon   from '@mui/icons-material/PhoneInTalkRounded';
import MedicalInformationRoundedIcon from '@mui/icons-material/MedicalInformationRounded';
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded';
import LocalPoliceRoundedIcon   from '@mui/icons-material/LocalPoliceRounded';
import InventoryRoundedIcon     from '@mui/icons-material/InventoryRounded';
import CellTowerRoundedIcon     from '@mui/icons-material/CellTowerRounded';
import WifiOffRoundedIcon       from '@mui/icons-material/WifiOffRounded';
import HandshakeRoundedIcon     from '@mui/icons-material/HandshakeRounded';
import VerifiedUserRoundedIcon  from '@mui/icons-material/VerifiedUserRounded';
import AccessTimeRoundedIcon    from '@mui/icons-material/AccessTimeRounded';

import HpsdmaFeed from '../components/HpsdmaFeed';
import { useAuth } from '../context/AuthContext';

// Color Palette
const RED = '#DC2626';
const NAVY = '#0F172A';

const FEATURES = [
  { icon: <MapRoundedIcon fontSize="large" sx={{ color: '#4F46E5' }}/>, title: 'Live Incident Map', desc: 'Real-time view of incidents and affected areas.' },
  { icon: <PhoneInTalkRoundedIcon fontSize="large" sx={{ color: '#16A34A' }}/>, title: 'Instant Reporting', desc: 'Report emergencies in seconds with location and photos.' },
  { icon: <GroupsRoundedIcon fontSize="large" sx={{ color: '#F59E0B' }}/>, title: 'Volunteer Network', desc: 'Connect with nearby volunteers and join relief missions.' },
  { icon: <SecurityRoundedIcon fontSize="large" sx={{ color: '#2563EB' }}/>, title: 'Department Access', desc: 'Police, Fire, Medical & SDRF teams collaborate seamlessly.' },
  { icon: <CampaignRoundedIcon fontSize="large" sx={{ color: '#D946EF' }}/>, title: 'Alerts & Broadcasts', desc: 'Get instant alerts, safety updates and official announcements.' },
  { icon: <InventoryRoundedIcon fontSize="large" sx={{ color: '#0EA5E9' }}/>, title: 'Resource Management', desc: 'Track resources, vehicles, equipment and relief materials.' },
];

const WHY_USE = [
  { icon: <AccessTimeRoundedIcon fontSize="large" sx={{ color: '#16A34A' }}/>, title: 'Save Precious Time', desc: 'Quick reporting and real-time alerts reduce response time and save more lives.' },
  { icon: <HandshakeRoundedIcon fontSize="large" sx={{ color: '#4F46E5' }}/>, title: 'Better Coordination', desc: 'All departments and volunteers work together on one unified platform.' },
  { icon: <CellTowerRoundedIcon fontSize="large" sx={{ color: '#2563EB' }}/>, title: 'Real-time Information', desc: 'Live data and maps help in better decision making during disasters.' },
  { icon: <VerifiedUserRoundedIcon fontSize="large" sx={{ color: '#F59E0B' }}/>, title: 'Transparent & Reliable', desc: 'Every action is tracked for accountability and transparency.' },
  { icon: <WifiOffRoundedIcon fontSize="large" sx={{ color: '#DC2626' }}/>, title: 'Works Offline', desc: 'Offline support ensures data syncs when connection returns.' },
  { icon: <GroupsRoundedIcon fontSize="large" sx={{ color: '#D946EF' }}/>, title: 'Community Driven', desc: 'Empowering citizens and volunteers to build safer communities.' },
];

const HELPLINES = [
  { number: '112', label: 'Emergency', icon: <PhoneInTalkRoundedIcon sx={{ fontSize: 36, color: RED }} /> },
  { number: '108', label: 'Medical', icon: <MedicalInformationRoundedIcon sx={{ fontSize: 36, color: '#16A34A' }} /> },
  { number: '101', label: 'Fire', icon: <LocalFireDepartmentRoundedIcon sx={{ fontSize: 36, color: '#F59E0B' }} /> },
  { number: '100', label: 'Police', icon: <LocalPoliceRoundedIcon sx={{ fontSize: 36, color: '#2563EB' }} /> },
];

export default function Homepage() {
  const { user } = useAuth();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#FFFFFF' }}>
      
      {/* ─── 1. HERO SECTION ─── */}
      <Box sx={{ 
        position: 'relative', 
        bgcolor: NAVY, 
        color: '#FFF', 
        py: { xs: 10, md: 16 },
        overflow: 'hidden'
      }}>
        {/* Background Image Overlay / Gradient */}
        <Box sx={{ 
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'linear-gradient(to right, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.7) 50%, rgba(15,23,42,0.4) 100%), url("/hero-bg.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0
        }} />

        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ maxWidth: 800 }}>
            <Box sx={{ 
              display: 'inline-flex', alignItems: 'center', gap: 1,
              px: 2, py: 0.5, mb: 3, 
              border: '1px solid rgba(255,255,255,0.3)', 
              borderRadius: '20px',
              backdropFilter: 'blur(10px)'
            }}>
              <Typography variant="overline" sx={{ fontWeight: 800, letterSpacing: 1 }}>SDRF HIMACHAL PRADESH</Typography>
            </Box>
            
            <Typography variant="h1" sx={{ 
              fontSize: { xs: '3rem', md: '5rem', lg: '6rem' }, 
              fontWeight: 900, 
              lineHeight: 1,
              mb: 3,
              fontFamily: '"Outfit", sans-serif'
            }}>
              TOGETHER<br/>
              WE RESPOND.<br/>
              <Box component="span" sx={{ color: RED }}>TOGETHER<br/>WE SAVE LIVES.</Box>
            </Typography>

            <Typography variant="body1" sx={{ 
              fontSize: { xs: '1.1rem', md: '1.4rem' }, 
              color: 'rgba(255,255,255,0.85)', 
              mb: 5, 
              maxWidth: 600 
            }}>
              Suraksha Sarthi is a unified platform connecting citizens, volunteers and emergency teams for faster response, better coordination and safer communities.
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button 
                component={RouterLink} to="/emergency"
                variant="contained" 
                size="large"
                startIcon={<ErrorOutlineRoundedIcon />}
                sx={{ 
                  py: 1.5, px: 4, 
                  bgcolor: RED, 
                  color: '#FFF',
                  fontWeight: 800,
                  fontSize: '1rem',
                  borderRadius: '8px',
                  '&:hover': { bgcolor: '#B91C1C' }
                }}
              >
                Report an Emergency
              </Button>
              <Button 
                component={RouterLink} to="/map"
                variant="outlined" 
                size="large"
                startIcon={<MapRoundedIcon />}
                sx={{ 
                  py: 1.5, px: 4, 
                  borderColor: 'rgba(255,255,255,0.5)', 
                  color: '#FFF',
                  fontWeight: 800,
                  fontSize: '1rem',
                  borderRadius: '8px',
                  backdropFilter: 'blur(10px)',
                  '&:hover': { borderColor: '#FFF', bgcolor: 'rgba(255,255,255,0.1)' }
                }}
              >
                View Live Map
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* ─── 2. WHAT WE PROVIDE ─── */}
      <Box sx={{ py: 10, bgcolor: '#F8FAFC' }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography sx={{ 
              color: NAVY, fontWeight: 800, letterSpacing: 2, 
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2,
              textTransform: 'uppercase'
            }}>
              <Box sx={{ width: 40, height: 2, bgcolor: '#CBD5E1' }} />
              What We Provide
              <Box sx={{ width: 40, height: 2, bgcolor: '#CBD5E1' }} />
            </Typography>
            <Box sx={{ width: 40, height: 3, bgcolor: RED, mx: 'auto', mt: 1 }} />
          </Box>

          <Grid container spacing={3}>
            {FEATURES.map((f, i) => (
              <Grid item xs={12} sm={6} md={4} lg={2} key={i}>
                <Card sx={{ 
                  height: '100%', textAlign: 'center', p: 2, 
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                  border: '1px solid #E2E8F0',
                  borderRadius: 3,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }
                }}>
                  <Box sx={{ 
                    width: 64, height: 64, borderRadius: '50%', 
                    bgcolor: `${f.icon.props.sx.color}15`, 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    mx: 'auto', mb: 2
                  }}>
                    {f.icon}
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1, color: NAVY }}>{f.title}</Typography>
                  <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.85rem' }}>{f.desc}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ─── 3. WHY USE SURAKSHA SARTHI ─── */}
      <Box sx={{ py: 10, bgcolor: '#FFFFFF' }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h4" sx={{ color: NAVY, fontWeight: 900, textTransform: 'uppercase' }}>
              Why Use <Box component="span" sx={{ color: RED }}>Suraksha Sarthi?</Box>
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {WHY_USE.map((w, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Box sx={{ textAlign: 'center', px: 2 }}>
                  <Box sx={{ mb: 2 }}>{w.icon}</Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1, color: NAVY }}>{w.title}</Typography>
                  <Typography variant="body2" sx={{ color: '#64748B' }}>{w.desc}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ─── 4. LIVE SITUATION OVERVIEW (HPSDMA FEED & STATS) ─── */}
      <Box sx={{ py: 10, bgcolor: '#F8FAFC' }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h4" sx={{ color: NAVY, fontWeight: 900, textTransform: 'uppercase' }}>
              Live Situation Overview
            </Typography>
          </Box>

          {/* Quick Stats Row (Placeholder stats for visual parity with design) */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {[
              { label: 'TOTAL INCIDENTS', value: '243', color: '#1E3A8A' },
              { label: 'ACTIVE INCIDENTS', value: '78', color: '#B91C1C' },
              { label: 'RESOLVED INCIDENTS', value: '165', color: '#C2410C' },
              { label: 'VOLUNTEERS ACTIVE', value: '1,248', color: '#15803D' },
            ].map((stat, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Box sx={{ 
                  bgcolor: stat.color, color: '#FFF', 
                  p: 3, borderRadius: 3, 
                  display: 'flex', flexDirection: 'column',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, mb: 1, letterSpacing: 1 }}>
                    <GroupsRoundedIcon sx={{ fontSize: 14, verticalAlign: 'middle', mr: 1 }}/> 
                    {stat.label}
                  </Typography>
                  <Typography sx={{ fontSize: '2.5rem', fontWeight: 900, lineHeight: 1, mb: 2 }}>{stat.value}</Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, opacity: 0.8, display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }}>
                    View All <ArrowForwardRoundedIcon sx={{ fontSize: 14 }} />
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* The Actual HPSDMA Feed Component wrapped elegantly */}
          <Box sx={{ 
            border: '1px solid #E2E8F0', 
            borderRadius: 4, 
            bgcolor: '#FFFFFF', 
            overflow: 'hidden',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)'
          }}>
            <HpsdmaFeed maxItems={10} showSummary={false} />
          </Box>
        </Container>
      </Box>

      {/* ─── 5. SHOS HELPLINES & EMERGENCY SOS BANNER ─── */}
      <Box sx={{ py: 10, bgcolor: '#FFFFFF' }}>
        <Container maxWidth="xl">
          <Grid container spacing={4}>
            
            {/* SHOS Left Column */}
            <Grid item xs={12} lg={6}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: NAVY }}>
                  SHOS – State Helpline Operating System
                </Typography>
                <Typography sx={{ color: '#2563EB', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}>View All</Typography>
              </Box>
              
              <Grid container spacing={2}>
                {HELPLINES.map((h, i) => (
                  <Grid item xs={6} sm={3} key={i}>
                    <Card sx={{ 
                      textAlign: 'center', p: 3, 
                      borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none'
                    }}>
                      <Box sx={{ mb: 1 }}>{h.icon}</Box>
                      <Typography sx={{ fontSize: '1.5rem', fontWeight: 900, color: RED, lineHeight: 1, mb: 0.5 }}>{h.number}</Typography>
                      <Typography sx={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>{h.label}</Typography>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/* SOS Banner Right Column */}
            <Grid item xs={12} lg={6}>
              <Box sx={{ 
                bgcolor: '#991B1B', 
                borderRadius: 4, 
                p: { xs: 3, md: 4 },
                height: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                color: '#FFF',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Background decorative circles */}
                <Box sx={{ position: 'absolute', right: -50, top: -50, width: 200, height: 200, borderRadius: '50%', border: '40px solid rgba(255,255,255,0.05)' }} />
                <Box sx={{ position: 'absolute', right: 20, bottom: -80, width: 150, height: 150, borderRadius: '50%', border: '20px solid rgba(255,255,255,0.05)' }} />

                <Box sx={{ position: 'relative', zIndex: 1, flex: 1 }}>
                  <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>EMERGENCY? NEED IMMEDIATE HELP?</Typography>
                  <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>Press the SOS button to alert nearest responders with your location.</Typography>
                  
                  <Stack spacing={1.5}>
                    {['Your location will be shared', 'Nearest teams will be notified', 'We are here to help you'].map((txt, i) => (
                      <Typography key={i} sx={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <VerifiedUserRoundedIcon sx={{ fontSize: 16, color: '#FCA5A5' }} /> {txt}
                      </Typography>
                    ))}
                  </Stack>
                </Box>

                <Box sx={{ position: 'relative', zIndex: 1, ml: 4 }}>
                  <Button
                    component={RouterLink} to="/emergency"
                    sx={{ 
                      width: { xs: 80, md: 100 }, height: { xs: 80, md: 100 }, 
                      borderRadius: '50%', 
                      bgcolor: '#DC2626', 
                      color: '#FFF',
                      fontSize: { xs: '1.2rem', md: '1.5rem' }, fontWeight: 900,
                      boxShadow: '0 0 0 10px rgba(220,38,38,0.3), 0 0 0 20px rgba(220,38,38,0.1)',
                      '&:hover': { bgcolor: '#B91C1C' }
                    }}
                  >
                    SOS
                  </Button>
                </Box>
              </Box>
            </Grid>

          </Grid>
        </Container>
      </Box>

    </Box>
  );
}