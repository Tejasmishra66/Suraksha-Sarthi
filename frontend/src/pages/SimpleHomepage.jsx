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

const FEATURES = [
  { icon: <MapRoundedIcon fontSize="small" sx={{ color: '#3B82F6' }}/>, title: 'Live Incident Map', desc: 'Real-time view of incidents & affected areas', bg: '#EFF6FF' },
  { icon: <PhoneInTalkRoundedIcon fontSize="small" sx={{ color: '#10B981' }}/>, title: 'Instant Reporting', desc: 'Report emergencies with photos and location', bg: '#ECFDF5' },
  { icon: <GroupsRoundedIcon fontSize="small" sx={{ color: '#F97316' }}/>, title: 'Volunteer Network', desc: 'Join volunteers and support relief missions', bg: '#FFF7ED' },
  { icon: <BusinessRoundedIcon fontSize="small" sx={{ color: '#8B5CF6' }}/>, title: 'Department Access', desc: 'Connect with Police, Fire, Medical & SDRF teams', bg: '#F5F3FF' },
  { icon: <CampaignRoundedIcon fontSize="small" sx={{ color: '#EF4444' }}/>, title: 'Alerts & Broadcasts', desc: 'Get real-time alerts and important updates', bg: '#FEF2F2' },
  { icon: <InventoryRoundedIcon fontSize="small" sx={{ color: '#0EA5E9' }}/>, title: 'Resource Management', desc: 'Track resources, vehicles and equipment', bg: '#F0F9FF' },
];

const QUICK_ACTIONS = [
  { icon: <AssignmentRoundedIcon fontSize="small" />, label: 'Report Incident', color: '#3B82F6', path: '/emergency' },
  { icon: <ContactPhoneRoundedIcon fontSize="small" />, label: 'Emergency Contacts', color: '#EF4444', path: '/contacts' },
  { icon: <HandshakeRoundedIcon fontSize="small" />, label: 'Volunteer Signup', color: '#F97316', path: '/join-volunteer' },
  { icon: <LocalLibraryRoundedIcon fontSize="small" />, label: 'Disaster Guides', color: '#10B981', path: '/guides' },
  { icon: <CampaignRoundedIcon fontSize="small" />, label: 'Alerts', color: '#0F172A', path: '/updates' },
  { icon: <WarningAmberRoundedIcon fontSize="small" />, label: 'HPSDMA Feed', color: '#DC2626', action: 'OPEN_HPSDMA' },
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
                  component={RouterLink} to="/updates"
                  variant="contained" size="large"
                  startIcon={<WifiTetheringRoundedIcon />}
                  style={{ backgroundColor: BLUE, color: '#FFF' }}
                  sx={{ py: 1.5, px: 3, fontWeight: 800, borderRadius: '50px', '&:hover': { backgroundColor: '#1E40AF' } }}
                >
                  View Live Updates
                </Button>
                <Button 
                  component={RouterLink} to="/emergency"
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

      {/* ─── 2. FEATURES ROW ─── */}
      <Box sx={{ borderBottom: '1px solid #E2E8F0', bgcolor: '#FFFFFF', py: 4 }}>
        <Container maxWidth="xl">
          <Grid container spacing={2} justifyContent="space-between">
            {FEATURES.map((f, i) => (
              <Grid item xs={6} sm={4} md={2} key={i}>
                <Box sx={{ 
                  display: 'flex', flexDirection: 'column', gap: 1.5, 
                  p: 2.5, borderRadius: 3, border: '1px solid #E2E8F0', 
                  bgcolor: '#F8FAFC', transition: 'all 0.2s ease', height: '100%',
                  '&:hover': { 
                    bgcolor: '#FFFFFF', 
                    boxShadow: '0 10px 15px -3px rgba(11,26,62,0.05), 0 4px 6px -2px rgba(11,26,62,0.025)', 
                    transform: 'translateY(-3px)', 
                    borderColor: '#CBD5E1' 
                  }
                }}>
                  <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {f.icon}
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 800, color: NAVY, fontSize: '0.85rem', lineHeight: 1.2 }}>{f.title}</Typography>
                    <Typography sx={{ fontSize: '0.7rem', color: '#64748B', mt: 0.5, lineHeight: 1.3 }}>{f.desc}</Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ─── 3. QUICK ACTIONS (Full Width) ─── */}
      <Box sx={{ py: 6, bgcolor: '#F8FAFC' }}>
        <Container maxWidth="xl">
          <Typography variant="overline" sx={{ fontWeight: 900, color: BLUE, display: 'block', mb: 3 }}>
            QUICK ACTIONS
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)', md: 'repeat(7, 1fr)' }, gap: 3 }}>
            {QUICK_ACTIONS.map((action, i) => (
              <Box key={i}>
                <Button 
                  {...(action.path ? { component: RouterLink, to: action.path } : { onClick: () => { if (action.action === 'OPEN_HPSDMA') setHpsdmaModalOpen(true); } })}
                  sx={{ 
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1.5, 
                    p: 2.5, height: '100%', width: '100%',
                    bgcolor: '#FFFFFF', color: NAVY, textTransform: 'none', borderRadius: 4,
                    border: '1px solid #E2E8F0',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 6px -1px rgba(11,26,62,0.03)',
                    '&:hover': { 
                      borderColor: action.color, 
                      bgcolor: '#FFFFFF',
                      boxShadow: '0 10px 15px -3px rgba(11,26,62,0.08), 0 4px 6px -2px rgba(11,26,62,0.04)',
                      transform: 'translateY(-3px)'
                    }
                  }}
                >
                  <Box sx={{ 
                    width: 48, height: 48, borderRadius: '50%', 
                    bgcolor: `${action.color}15`, color: action.color, 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s ease'
                  }}>
                    {action.icon}
                  </Box>
                  <Typography sx={{ fontWeight: 800, fontSize: '0.8rem', textAlign: 'center', lineHeight: 1.2 }}>{action.label}</Typography>
                </Button>
              </Box>
            ))}
          </Box>
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
            component={RouterLink} to="/emergency"
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
      <Box sx={{ bgcolor: '#FFFFFF', py: { xs: 6, md: 8 }, borderTop: '1px solid #E2E8F0' }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 900, color: NAVY, fontSize: { xs: '1.8rem', md: '2.2rem' }, mb: 1.5, letterSpacing: '-0.02em' }}>
              About Suraksha Sarthi
            </Typography>
            <Typography sx={{ fontSize: '1rem', color: '#64748B', fontWeight: 500, maxWidth: 600, mx: 'auto', lineHeight: 1.7 }}>
              Dedicated to protecting Himachal Pradesh through faster response, better coordination, and safer communities.
            </Typography>
          </Box>

          <Box sx={{ bgcolor: '#F8FAFC', borderRadius: 4, p: { xs: 3, md: 4 }, border: '1px solid #E2E8F0', mb: 4 }}>
            <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, color: NAVY, fontSize: '1.3rem', mb: 1.5 }}>
              Our Mission
            </Typography>
            <Typography sx={{ color: '#475569', lineHeight: 1.8, fontSize: '0.95rem' }}>
              Suraksha Sarthi is a unified emergency response platform designed specifically for the State Disaster Response Force (SDRF) of Himachal Pradesh. Our mission is to bridge the gap between citizens in distress and the emergency personnel equipped to save them, leveraging technology to minimize response times during critical situations.
            </Typography>
          </Box>

          <Grid container spacing={2.5}>
            {[
              { title: 'Live Incident Mapping', desc: 'Real-time tracking of emergencies across the state to coordinate rapid dispatch.', color: '#3B82F6', bg: '#EFF6FF' },
              { title: 'Resource Management', desc: 'Centralized dashboard for tracking equipment, vehicles, and medical supplies.', color: '#10B981', bg: '#ECFDF5' },
              { title: 'Volunteer Network', desc: 'Connecting trained civilian volunteers with SDRF teams for localized assistance.', color: '#F97316', bg: '#FFF7ED' },
              { title: 'SOS Alert System', desc: 'Instant one-tap emergency reporting system for citizens in danger.', color: '#EF4444', bg: '#FEF2F2' },
            ].map((item, i) => (
              <Grid item xs={12} sm={6} key={i}>
                <Box sx={{ p: 2.5, bgcolor: item.bg, borderRadius: 3, height: '100%', transition: 'transform 0.2s ease', '&:hover': { transform: 'translateY(-2px)' } }}>
                  <Typography sx={{ fontWeight: 800, color: item.color, mb: 0.5, fontSize: '0.95rem' }}>{item.title}</Typography>
                  <Typography sx={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.5 }}>{item.desc}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ─── 4. TRUST BADGES ROW ─── */}
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