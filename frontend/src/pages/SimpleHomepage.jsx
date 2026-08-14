import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Button, Stack, Divider, IconButton, Modal, Fade, Backdrop } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import MapRoundedIcon           from '@mui/icons-material/MapRounded';
import CampaignRoundedIcon      from '@mui/icons-material/CampaignRounded';
import GroupsRoundedIcon        from '@mui/icons-material/GroupsRounded';
import SecurityRoundedIcon      from '@mui/icons-material/SecurityRounded';
import PhoneInTalkRoundedIcon   from '@mui/icons-material/PhoneInTalkRounded';
import CloseRoundedIcon         from '@mui/icons-material/CloseRounded';
import InventoryRoundedIcon     from '@mui/icons-material/InventoryRounded';
import SensorsRoundedIcon       from '@mui/icons-material/SensorsRounded';
import ShieldRoundedIcon        from '@mui/icons-material/ShieldRounded';
import AssignmentRoundedIcon    from '@mui/icons-material/AssignmentRounded';
import AddHomeRoundedIcon       from '@mui/icons-material/AddHomeRounded';
import LocalLibraryRoundedIcon  from '@mui/icons-material/LocalLibraryRounded';
import ContactPhoneRoundedIcon  from '@mui/icons-material/ContactPhoneRounded';
import WarningAmberRoundedIcon  from '@mui/icons-material/WarningAmberRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import BusinessRoundedIcon      from '@mui/icons-material/BusinessRounded';
import LocationOnRoundedIcon    from '@mui/icons-material/LocationOnRounded';
import VerifiedUserRoundedIcon  from '@mui/icons-material/VerifiedUserRounded';
import HandshakeRoundedIcon     from '@mui/icons-material/HandshakeRounded';
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import WifiTetheringRoundedIcon from '@mui/icons-material/WifiTetheringRounded';

import HpsdmaFeed from '../components/HpsdmaFeed';
import { fetchIncidents, fetchVolunteers, fetchAgencies, fetchEquipment } from '../api/client';

const BLUE = '#1D4ED8';
const NAVY = '#0F172A';
const RED  = '#DC2626';

const ENHANCED_ACTIONS = [
  { icon: <MapRoundedIcon sx={{ fontSize: 32 }} />, title: 'Live Incident Map', desc: 'Real-time view of incidents & affected areas across the state.', color: '#3B82F6', bg: '#EFF6FF', path: '/map' },
  { icon: <AssignmentRoundedIcon sx={{ fontSize: 32 }} />, title: 'Report Incident', desc: 'Instantly report emergencies with photos and exact location.', color: '#10B981', bg: '#ECFDF5', path: '/emergency' },
  { icon: <HandshakeRoundedIcon sx={{ fontSize: 32 }} />, title: 'Volunteer Network', desc: 'Join hands with local volunteers and support relief missions.', color: '#F97316', bg: '#FFF7ED', path: '/join-volunteer' },
  { icon: <ContactPhoneRoundedIcon sx={{ fontSize: 32 }} />, title: 'Emergency Contacts', desc: 'Direct access to Police, Fire, Medical & SDRF teams.', color: '#8B5CF6', bg: '#F5F3FF', path: '/contacts' },
  { icon: <CampaignRoundedIcon sx={{ fontSize: 32 }} />, title: 'Alerts & Broadcasts', desc: 'Get real-time alerts and important state-wide updates.', color: '#EF4444', bg: '#FEF2F2', path: '/updates' },
  { icon: <WarningAmberRoundedIcon sx={{ fontSize: 32 }} />, title: 'HPSDMA Feed', desc: 'Official live feed from the State Disaster Management Authority.', color: '#D97706', bg: '#FFFBEB', action: 'OPEN_HPSDMA' },
];

const PREPAREDNESS_GUIDES = [
  { id: 'earthquake', title: 'Earthquake Safety', desc: 'Drop, Cover, and Hold On. Learn the essentials.', icon: <CheckCircleOutlineRoundedIcon sx={{ color: '#10B981', fontSize: 32 }} /> },
  { id: 'flood', title: 'Flood Preparedness', desc: 'Move to higher ground. Do not drive through water.', icon: <CheckCircleOutlineRoundedIcon sx={{ color: '#3B82F6', fontSize: 32 }} /> },
  { id: 'landslide', title: 'Landslide Warning', desc: 'Listen for unusual sounds like trees cracking.', icon: <CheckCircleOutlineRoundedIcon sx={{ color: '#F97316', fontSize: 32 }} /> },
];

const TRUST_BADGES = [
  { icon: <LocationOnRoundedIcon />, label: 'Your location will be shared' },
  { icon: <GroupsRoundedIcon />, label: 'Nearest teams will be notified' },
  { icon: <VerifiedUserRoundedIcon />, label: 'Your data is secure and confidential' },
  { icon: <HandshakeRoundedIcon />, label: 'We are here to help you' },
];

export default function SimpleHomepage() {
  const [summary, setSummary] = useState({ active: 0, volunteers: 0, teamMembers: 0, hq: 0, equipments: 0 });
  const [hpsdmaModalOpen, setHpsdmaModalOpen] = useState(false);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [incRes, volRes, eqRes, agRes] = await Promise.all([
          fetchIncidents().catch(() => ({ data: [] })),
          fetchVolunteers().catch(() => ({ data: [] })),
          fetchEquipment().catch(() => ({ data: [] })),
          fetchAgencies().catch(() => ({ data: [] }))
        ]);

        const incidents = incRes.data || [];
        const activeIncidents = incidents.filter(i => i.status !== 'resolved').length;
        
        const volunteers = volRes.data || [];
        
        const equipment = eqRes.data || [];
        
        const agencies = agRes.data || [];
        
        setSummary({ 
          active: activeIncidents, 
          volunteers: volunteers.length, 
          teamMembers: agencies.reduce((acc, a) => acc + (a.memberCount || 0), 0) || agencies.length * 5, 
          hq: agencies.length, 
          equipments: equipment.length 
        });
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
    }
    loadDashboardData();
  }, []);

  const handleDataLoad = (data) => {
    if (data?.summary) {
      // Map HPSDMA real stats into the UI placeholders where applicable
      const total = data.summary.total || 0;
      const active = data.summary.deaths + data.summary.injured + data.summary.missing;
      const resolved = Math.max(0, total - active);
      setSummary(prev => ({
        ...prev,
        total,
        active: active > 0 ? active : prev.active,
        resolved: resolved > 0 ? resolved : prev.resolved,
      }));
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#FFFFFF', display: 'flex', flexDirection: 'column' }}>
      
      {/* ─── 1. HERO SECTION ─── */}
      <Box sx={{ position: 'relative', bgcolor: '#F8FAFC', pt: { xs: 6, md: 10 }, pb: { xs: 8, md: 14 }, overflow: 'hidden' }}>
        {/* Background Image Overlay */}
        <Box sx={{ 
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'linear-gradient(to right, rgba(248,250,252,0.98) 0%, rgba(248,250,252,0.7) 35%, rgba(248,250,252,0) 60%), url("/hero-bg.jpg")',
          backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0
        }} />

        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container alignItems="center">
            <Grid item xs={12} md={7} lg={6}>
              <Box sx={{ display: 'inline-flex', bgcolor: BLUE, color: '#FFF', px: 1.5, py: 0.5, borderRadius: 1, mb: 3 }}>
                <Typography variant="overline" sx={{ fontWeight: 800, lineHeight: 1 }}>HIMACHAL PRADESH</Typography>
              </Box>
              
              <Typography variant="h1" sx={{ fontSize: { xs: '3rem', md: '4.5rem' }, fontWeight: 900, lineHeight: 1.1, color: NAVY, mb: 3, fontFamily: '"Outfit", sans-serif' }}>
                TOGETHER WE RESPOND,<br/>
                <Box component="span" sx={{ color: BLUE }}>TOGETHER WE SAVE LIVES.</Box>
              </Typography>

              <Typography variant="body1" sx={{ fontSize: { xs: '1rem', md: '1.2rem' }, color: '#334155', mb: 5, maxWidth: 500, fontWeight: 500 }}>
                Suraksha Sarthi is a unified platform connecting citizens, volunteers and emergency teams for faster response, better coordination and safer communities.
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button 
                  component={RouterLink} to="/map"
                  variant="contained" size="large"
                  startIcon={<WifiTetheringRoundedIcon />}
                  style={{ backgroundColor: BLUE, color: '#FFF' }}
                  sx={{ py: 1.5, px: 3, fontWeight: 800, borderRadius: '50px', '&:hover': { backgroundColor: '#1E40AF' } }}
                >
                  View Live Updates
                </Button>
                <Button 
                  component={RouterLink} to="/public-emergency"
                  variant="contained" size="large"
                  startIcon={<PhoneInTalkRoundedIcon />}
                  style={{ backgroundColor: RED, color: '#FFF' }}
                  sx={{ py: 1.5, px: 3, fontWeight: 800, borderRadius: '50px', '&:hover': { backgroundColor: '#B91C1C' } }}
                >
                  Emergency? Press SOS
                </Button>
              </Stack>
            </Grid>

            {/* Floating Info Card on right */}
            <Grid item xs={12} md={5} lg={6} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end', mt: { xs: 8, md: 0 } }}>
              <Box sx={{ 
                background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(16px)',
                color: NAVY, p: 4, borderRadius: 4, maxWidth: 280,
                boxShadow: '0 25px 50px -12px rgba(11, 26, 62, 0.15)', alignSelf: 'flex-end', mb: -4,
                border: '1px solid rgba(255, 255, 255, 0.6)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative', overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 30px 60px -12px rgba(11, 26, 62, 0.22)',
                }
              }}>
                {/* Decorative background glow */}
                <Box sx={{ position: 'absolute', top: -30, right: -30, width: 100, height: 100, bgcolor: 'rgba(29, 78, 216, 0.1)', borderRadius: '50%', filter: 'blur(20px)' }} />
                
                <Box sx={{ width: 56, height: 56, borderRadius: '16px', bgcolor: 'rgba(29, 78, 216, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                  <ShieldRoundedIcon sx={{ fontSize: 32, color: BLUE }} />
                </Box>
                
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 1.5, fontFamily: '"Outfit", sans-serif', lineHeight: 1.2 }}>
                  Always Ready.<br/>Always There.
                </Typography>
                <Typography variant="body2" sx={{ color: '#475569', mb: 3, lineHeight: 1.5 }}>
                  Dedicated to protect Himachal Pradesh
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ 
                    width: 10, height: 10, borderRadius: '50%', bgcolor: '#10B981', 
                    boxShadow: '0 0 0 4px rgba(16, 185, 129, 0.2)',
                    animation: 'pulse 2s infinite' 
                  }} />
                  <Typography sx={{ color: NAVY, fontWeight: 900, fontSize: '1.25rem' }}>
                    24x7 <Box component="span" sx={{ fontWeight: 600, fontSize: '1rem', color: '#64748B' }}>Active</Box>
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ─── 2. ENHANCED QUICK ACTIONS & SERVICES ─── */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="overline" sx={{ fontWeight: 900, color: BLUE, letterSpacing: '0.1em' }}>
              OUR SERVICES
            </Typography>
            <Typography variant="h3" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 900, color: NAVY, mt: 1 }}>
              Everything you need, <br />
              <Box component="span" sx={{ color: BLUE }}>one click away.</Box>
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {ENHANCED_ACTIONS.map((action, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Box
                  component={action.path ? RouterLink : 'div'}
                  to={action.path || undefined}
                  onClick={action.action === 'OPEN_HPSDMA' ? () => setHpsdmaModalOpen(true) : undefined}
                  sx={{
                    display: 'flex', alignItems: 'flex-start', gap: 2, p: 3, 
                    bgcolor: '#FFFFFF', borderRadius: 4, textDecoration: 'none',
                    border: '1px solid #E2E8F0', cursor: 'pointer',
                    boxShadow: '0 4px 6px -1px rgba(11,26,62,0.03)',
                    transition: 'all 0.3s ease', height: '100%',
                    '&:hover': {
                      borderColor: action.color,
                      transform: 'translateY(-4px)',
                      boxShadow: '0 15px 25px -5px rgba(11,26,62,0.08), 0 8px 10px -6px rgba(11,26,62,0.04)'
                    }
                  }}
                >
                  <Box sx={{ width: 64, height: 64, borderRadius: '16px', bgcolor: action.bg, color: action.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {action.icon}
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 900, fontSize: '1.1rem', color: NAVY, mb: 0.5, fontFamily: '"Outfit", sans-serif' }}>
                      {action.title}
                    </Typography>
                    <Typography sx={{ color: '#64748B', fontSize: '0.9rem', lineHeight: 1.5 }}>
                      {action.desc}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ─── 3. HOW IT WORKS SECTION ─── */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
        <Container maxWidth="xl">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={5}>
              <Typography variant="overline" sx={{ fontWeight: 900, color: '#EA580C', letterSpacing: '0.1em' }}>
                HOW IT WORKS
              </Typography>
              <Typography variant="h3" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 900, color: NAVY, mt: 1, mb: 3 }}>
                Rapid response <br />
                <Box component="span" sx={{ color: '#EA580C' }}>engineered for speed.</Box>
              </Typography>
              <Typography sx={{ color: '#475569', fontSize: '1.1rem', lineHeight: 1.7, mb: 4 }}>
                When disaster strikes, chaos is the enemy. Suraksha Sarthi organizes chaos into a streamlined pipeline, connecting those in danger with those who can help in seconds.
              </Typography>
              
              <Stack spacing={3}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: '#EFF6FF', color: BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 900, fontSize: '1.2rem' }}>1</Box>
                  <Box>
                    <Typography sx={{ fontWeight: 800, color: NAVY, fontSize: '1.1rem', mb: 0.5 }}>Report & Alert</Typography>
                    <Typography sx={{ color: '#64748B', fontSize: '0.9rem' }}>Citizens report incidents via app or SOS. Data is instantly verified and mapped.</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: '#FFF7ED', color: '#EA580C', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 900, fontSize: '1.2rem' }}>2</Box>
                  <Box>
                    <Typography sx={{ fontWeight: 800, color: NAVY, fontSize: '1.1rem', mb: 0.5 }}>Smart Coordination</Typography>
                    <Typography sx={{ color: '#64748B', fontSize: '0.9rem' }}>The system automatically alerts the nearest SDRF teams and registered volunteers.</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 900, fontSize: '1.2rem' }}>3</Box>
                  <Box>
                    <Typography sx={{ fontWeight: 800, color: NAVY, fontSize: '1.1rem', mb: 0.5 }}>Rapid Rescue</Typography>
                    <Typography sx={{ color: '#64748B', fontSize: '0.9rem' }}>Teams deploy with exact coordinates, live updates, and resource tracking.</Typography>
                  </Box>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} md={7}>
              <Box sx={{ 
                bgcolor: '#F8FAFC', p: 4, borderRadius: 6, border: '1px solid #E2E8F0',
                boxShadow: 'inset 0 4px 6px rgba(0,0,0,0.02)', position: 'relative', overflow: 'hidden'
              }}>
                 {/* Abstract representation of coordination */}
                 <Box sx={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, bgcolor: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%', filter: 'blur(30px)' }} />
                 <Box sx={{ position: 'absolute', bottom: -50, left: -50, width: 200, height: 200, bgcolor: 'rgba(234, 88, 12, 0.1)', borderRadius: '50%', filter: 'blur(30px)' }} />
                 
                 <Grid container spacing={2} sx={{ position: 'relative', zIndex: 1 }}>
                   <Grid item xs={12} sm={6}>
                     <Box sx={{ bgcolor: '#FFF', p: 3, borderRadius: 3, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', mb: 2 }}>
                       <Typography sx={{ fontWeight: 800, color: NAVY, mb: 1 }}>Incident Detected</Typography>
                       <Box sx={{ height: 6, bgcolor: '#E2E8F0', borderRadius: 3, width: '100%', mb: 1 }}>
                         <Box sx={{ height: '100%', bgcolor: RED, borderRadius: 3, width: '40%' }} />
                       </Box>
                       <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>Processing location...</Typography>
                     </Box>
                     <Box sx={{ bgcolor: '#FFF', p: 3, borderRadius: 3, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}>
                       <Typography sx={{ fontWeight: 800, color: NAVY, mb: 1 }}>Volunteers Alerted</Typography>
                       <Box sx={{ display: 'flex', gap: 1 }}>
                         <Box sx={{ width: 30, height: 30, borderRadius: '50%', bgcolor: '#F1F5F9' }} />
                         <Box sx={{ width: 30, height: 30, borderRadius: '50%', bgcolor: '#F1F5F9' }} />
                         <Box sx={{ width: 30, height: 30, borderRadius: '50%', bgcolor: '#F1F5F9' }} />
                       </Box>
                     </Box>
                   </Grid>
                   <Grid item xs={12} sm={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                     <Box sx={{ bgcolor: BLUE, p: 4, borderRadius: 3, boxShadow: '0 20px 25px -5px rgba(29, 78, 216, 0.3)', color: '#FFF' }}>
                       <Typography sx={{ fontWeight: 900, fontSize: '1.2rem', mb: 1, fontFamily: '"Outfit", sans-serif' }}>SDRF Deployed</Typography>
                       <Typography sx={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>Team Alpha en route. ETA: 12 mins.</Typography>
                     </Box>
                   </Grid>
                 </Grid>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ─── 3.5 EMERGENCY PREPAREDNESS SECTION ─── */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="overline" sx={{ fontWeight: 900, color: '#10B981', letterSpacing: '0.1em' }}>
              BE PREPARED
            </Typography>
            <Typography variant="h3" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 900, color: NAVY, mt: 1 }}>
              Knowledge saves lives.
            </Typography>
          </Box>
          <Grid container spacing={3} justifyContent="center">
            {PREPAREDNESS_GUIDES.map((guide, i) => (
              <Grid item xs={12} sm={4} key={i}>
                <Box sx={{ 
                  bgcolor: '#FFF', p: 4, borderRadius: 4, border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 6px -1px rgba(11,26,62,0.03)', height: '100%',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
                }}>
                  <Box sx={{ mb: 2 }}>{guide.icon}</Box>
                  <Typography sx={{ fontWeight: 800, color: NAVY, mb: 1, fontSize: '1.1rem' }}>{guide.title}</Typography>
                  <Typography sx={{ color: '#64748B', fontSize: '0.9rem' }}>{guide.desc}</Typography>
                  <Button 
                    component={RouterLink} to={`/guides#${guide.id}`}
                    sx={{ mt: 'auto', pt: 2, color: BLUE, fontWeight: 700, textTransform: 'none', '&:hover': { background: 'transparent', textDecoration: 'underline' } }}
                  >
                    Read Guide →
                  </Button>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ─── 4. DASHBOARD STATS (Full Width) ─── */}
      <Box sx={{ py: 6, bgcolor: '#FFFFFF', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
        <Container maxWidth="xl">
          <Typography variant="overline" sx={{ fontWeight: 900, color: BLUE, display: 'block', mb: 3 }}>
            HIMACHAL PRADESH AT A GLANCE
          </Typography>
          <Grid container spacing={3} columns={{ xs: 1, sm: 2, md: 5 }}>
            {/* Real Incident Data */}
            <Grid item xs={1}>
              <Box sx={{ bgcolor: '#FFF', p: 3, borderRadius: 3, border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 2, boxShadow: '0 4px 6px -1px rgba(11,26,62,0.03)' }}>
                <Box sx={{ width: 56, height: 56, borderRadius: '50%', bgcolor: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <WarningAmberRoundedIcon sx={{ color: RED, fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '2rem', fontWeight: 900, color: NAVY, lineHeight: 1 }}>{summary.active || 0}</Typography>
                  <Typography sx={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700, mt: 0.5 }}>Active Incidents</Typography>
                </Box>
              </Box>
            </Grid>
            {/* Volunteers Numbers */}
            <Grid item xs={1}>
              <Box sx={{ bgcolor: '#FFF', p: 3, borderRadius: 3, border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 2, boxShadow: '0 4px 6px -1px rgba(11,26,62,0.03)' }}>
                <Box sx={{ width: 56, height: 56, borderRadius: '50%', bgcolor: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <GroupsRoundedIcon sx={{ color: '#8B5CF6', fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '2rem', fontWeight: 900, color: NAVY, lineHeight: 1 }}>{summary.volunteers || 0}</Typography>
                  <Typography sx={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700, mt: 0.5 }}>Active Volunteers</Typography>
                </Box>
              </Box>
            </Grid>
            {/* SDRF Team Members */}
            <Grid item xs={1}>
              <Box sx={{ bgcolor: '#FFF', p: 3, borderRadius: 3, border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 2, boxShadow: '0 4px 6px -1px rgba(11,26,62,0.03)' }}>
                <Box sx={{ width: 56, height: 56, borderRadius: '50%', bgcolor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <ShieldRoundedIcon sx={{ color: BLUE, fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '2rem', fontWeight: 900, color: NAVY, lineHeight: 1 }}>{summary.teamMembers || 0}</Typography>
                  <Typography sx={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700, mt: 0.5 }}>SDRF Team Members</Typography>
                </Box>
              </Box>
            </Grid>
            {/* HQ Data */}
            <Grid item xs={1}>
              <Box sx={{ bgcolor: '#FFF', p: 3, borderRadius: 3, border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 2, boxShadow: '0 4px 6px -1px rgba(11,26,62,0.03)' }}>
                <Box sx={{ width: 56, height: 56, borderRadius: '50%', bgcolor: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <BusinessRoundedIcon sx={{ color: '#F97316', fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '2rem', fontWeight: 900, color: NAVY, lineHeight: 1 }}>{summary.hq || 0}</Typography>
                  <Typography sx={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700, mt: 0.5 }}>HQ Divisions Online</Typography>
                </Box>
              </Box>
            </Grid>
            {/* Equipment Data */}
            <Grid item xs={1}>
              <Box sx={{ bgcolor: '#FFF', p: 3, borderRadius: 3, border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 2, boxShadow: '0 4px 6px -1px rgba(11,26,62,0.03)' }}>
                <Box sx={{ width: 56, height: 56, borderRadius: '50%', bgcolor: '#ECFEFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <InventoryRoundedIcon sx={{ color: '#0EA5E9', fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '2rem', fontWeight: 900, color: NAVY, lineHeight: 1 }}>{summary.equipments || 0}</Typography>
                  <Typography sx={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700, mt: 0.5 }}>Active Equipment</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ─── 5. GIANT SOS SECTION (COMPACT) ─── */}
      <Box sx={{ 
        bgcolor: RED, 
        py: { xs: 5, md: 6 }, 
        position: 'relative', 
        overflow: 'hidden',
        boxShadow: 'inset 0 0 100px rgba(0,0,0,0.2)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center'
      }}>
        {/* Glow rings */}
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, height: 400, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.03)', animation: 'pulse 3s infinite' }} />
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 250, height: 250, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.05)', animation: 'pulse 3s infinite', animationDelay: '0.5s' }} />
        
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          
          <Button 
            component={RouterLink} to="/public-emergency"
            sx={{ 
              width: 110, height: 110, borderRadius: '50%', 
              bgcolor: '#FFFFFF', color: RED,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2.5,
              boxShadow: '0 20px 40px rgba(0,0,0,0.3), 0 0 0 10px rgba(255,255,255,0.2)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': { 
                transform: 'scale(1.05)',
                boxShadow: '0 25px 50px rgba(0,0,0,0.4), 0 0 0 15px rgba(255,255,255,0.3)',
                bgcolor: '#FFFFFF'
              }
            }}
          >
            <Typography sx={{ fontSize: '2.2rem', fontWeight: 900, lineHeight: 1 }}>SOS</Typography>
          </Button>
          
          <Typography variant="h4" sx={{ fontWeight: 900, mb: 1.5, fontFamily: '"Outfit", sans-serif', color: '#FFF' }}>
            Need Immediate Help?
          </Typography>
          <Typography sx={{ fontSize: '1rem', color: 'rgba(255,255,255,0.9)', maxWidth: 600, mx: 'auto' }}>
            Press the SOS button above to instantly alert nearest responders, SDRF teams, and volunteers with your exact location.
          </Typography>
        </Container>
      </Box>


      {/* ─── 6. ABOUT SURAKSHA SARTHI ─── */}
      <Box sx={{ bgcolor: '#FFFFFF', py: { xs: 8, md: 12 }, borderTop: '1px solid #E2E8F0', position: 'relative', overflow: 'hidden' }}>
        {/* Background Decorative Elements */}
        <Box sx={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, bgcolor: 'rgba(29, 78, 216, 0.03)', borderRadius: '50%', zIndex: 0 }} />
        <Box sx={{ position: 'absolute', bottom: -100, left: -100, width: 300, height: 300, bgcolor: 'rgba(16, 185, 129, 0.03)', borderRadius: '50%', zIndex: 0 }} />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={{ xs: 6, md: 10 }} alignItems="center">
            
            {/* Left Content */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, bgcolor: '#EFF6FF', color: BLUE, px: 2, py: 1, borderRadius: 2, mb: 3 }}>
                <ShieldRoundedIcon fontSize="small" />
                <Typography variant="overline" sx={{ fontWeight: 800, lineHeight: 1 }}>OUR MISSION</Typography>
              </Box>
              
              <Typography variant="h2" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 900, color: NAVY, fontSize: { xs: '2.5rem', md: '3.5rem' }, lineHeight: 1.1, mb: 4, letterSpacing: '-0.02em' }}>
                Bridging the gap between <Box component="span" sx={{ color: BLUE }}>crisis and rescue.</Box>
              </Typography>
              
              <Typography sx={{ fontSize: '1.1rem', color: '#475569', lineHeight: 1.8, mb: 3 }}>
                When disaster strikes, every second matters. <b>Suraksha Sarthi</b> was born from a singular vision: to empower the State Disaster Response Force (SDRF) of Himachal Pradesh with the fastest, most reliable emergency coordination platform ever built.
              </Typography>
              
              <Typography sx={{ fontSize: '1.1rem', color: '#475569', lineHeight: 1.8, mb: 4 }}>
                We believe that technology should serve humanity at its most vulnerable moments. By uniting citizens, trained volunteers, and elite rescue teams into a single, cohesive network, we are transforming how our state responds to natural calamities—ensuring that no call for help goes unanswered.
              </Typography>

              <Box sx={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                <Box>
                  <Typography sx={{ fontSize: '2rem', fontWeight: 900, color: NAVY, fontFamily: '"Outfit", sans-serif', lineHeight: 1 }}>24/7</Typography>
                  <Typography sx={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600, mt: 0.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Vigilance</Typography>
                </Box>
                <Divider orientation="vertical" flexItem sx={{ borderColor: '#E2E8F0', my: 1 }} />
                <Box>
                  <Typography sx={{ fontSize: '2rem', fontWeight: 900, color: NAVY, fontFamily: '"Outfit", sans-serif', lineHeight: 1 }}>0s</Typography>
                  <Typography sx={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600, mt: 0.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Delay in SOS</Typography>
                </Box>
              </Box>
            </Grid>

            {/* Right Image/Visual */}
            <Grid item xs={12} md={6}>
              <Box sx={{ position: 'relative' }}>
                <Box sx={{ 
                  position: 'absolute', top: '10%', left: '-5%', width: '110%', height: '80%', 
                  bgcolor: BLUE, borderRadius: 6, transform: 'rotate(-3deg)', opacity: 0.1, zIndex: 0 
                }} />
                <Box 
                  component="img"
                  src="/hero-bg.jpg"
                  alt="SDRF Rescue Operation"
                  sx={{ 
                    width: '100%', 
                    borderRadius: 4, 
                    position: 'relative', 
                    zIndex: 1,
                    boxShadow: '0 25px 50px -12px rgba(11, 26, 62, 0.25)',
                    border: '8px solid #FFFFFF'
                  }} 
                  onError={(e) => { e.target.style.display='none'; }}
                />
                
                {/* Floating Stat Card */}
                <Box sx={{ 
                  position: 'absolute', bottom: -20, right: { xs: 20, md: -20 }, zIndex: 2,
                  bgcolor: '#FFFFFF', p: 3, borderRadius: 3, boxShadow: '0 10px 30px -10px rgba(0,0,0,0.15)',
                  display: 'flex', alignItems: 'center', gap: 2, border: '1px solid #E2E8F0'
                }}>
                  <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <HandshakeRoundedIcon sx={{ color: '#10B981' }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 900, color: NAVY, fontSize: '1.2rem', fontFamily: '"Outfit", sans-serif', lineHeight: 1 }}>United Force</Typography>
                    <Typography sx={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>Citizens & SDRF</Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>

          </Grid>
        </Container>
      </Box>

      {/* ─── 7. TRUST BADGES ROW ─── */}
      <Box sx={{ bgcolor: '#EFF6FF', py: 2, borderTop: '1px solid #BFDBFE' }}>
        <Container maxWidth="xl">
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-around" spacing={2} divider={<Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />}>
            {TRUST_BADGES.map((b, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, justifyContent: 'center' }}>
                <Box sx={{ color: BLUE }}>{b.icon}</Box>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: NAVY }}>{b.label}</Typography>
              </Box>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* ─── HPSDMA MODAL ─── */}
      <Modal
        open={hpsdmaModalOpen}
        onClose={() => setHpsdmaModalOpen(false)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 300, sx: { backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)' } } }}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}
      >
        <Fade in={hpsdmaModalOpen}>
          <Box sx={{ 
            bgcolor: '#F8FAFC', 
            borderRadius: 4, 
            boxShadow: 24, 
            width: '100%', 
            maxWidth: 700, 
            maxHeight: '90vh',
            display: 'flex', 
            flexDirection: 'column',
            overflow: 'hidden',
            border: '1px solid #E2E8F0'
          }}>
            <Box sx={{ p: 2, bgcolor: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0' }}>
              <Typography sx={{ fontWeight: 900, color: NAVY, fontSize: '1.2rem' }}>Live HPSDMA Feed</Typography>
              <IconButton onClick={() => setHpsdmaModalOpen(false)} size="small">
                <CloseRoundedIcon />
              </IconButton>
            </Box>
            <Box sx={{ p: { xs: 2, md: 3 }, overflowY: 'auto', flexGrow: 1, bgcolor: '#FFF' }}>
              <HpsdmaFeed layout="sidebar" maxItems={50} showSummary={true} />
            </Box>
          </Box>
        </Fade>
      </Modal>

    </Box>
  );
}