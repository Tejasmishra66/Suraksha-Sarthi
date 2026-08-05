import React, { useState } from 'react';
import { Box, Container, Typography, Grid, Button, Stack, Divider, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import MapRoundedIcon           from '@mui/icons-material/MapRounded';
import CampaignRoundedIcon      from '@mui/icons-material/CampaignRounded';
import GroupsRoundedIcon        from '@mui/icons-material/GroupsRounded';
import SecurityRoundedIcon      from '@mui/icons-material/SecurityRounded';
import PhoneInTalkRoundedIcon   from '@mui/icons-material/PhoneInTalkRounded';
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
  { icon: <ContactPhoneRoundedIcon fontSize="small" />, label: 'Emergency Contacts', color: '#EF4444', path: '/emergency' },
  { icon: <HandshakeRoundedIcon fontSize="small" />, label: 'Volunteer Signup', color: '#F97316', path: '/volunteer' },
  { icon: <AddHomeRoundedIcon fontSize="small" />, label: 'Shelter Locations', color: '#8B5CF6', path: '/map' },
  { icon: <LocalLibraryRoundedIcon fontSize="small" />, label: 'Disaster Guides', color: '#10B981', path: '/' },
  { icon: <AssignmentRoundedIcon fontSize="small" />, label: 'Important Numbers', color: '#0F172A', path: '/emergency' },
];

const TRUST_BADGES = [
  { icon: <LocationOnRoundedIcon />, label: 'Your location will be shared' },
  { icon: <GroupsRoundedIcon />, label: 'Nearest teams will be notified' },
  { icon: <VerifiedUserRoundedIcon />, label: 'Your data is secure and confidential' },
  { icon: <HandshakeRoundedIcon />, label: 'We are here to help you' },
];

export default function SimpleHomepage() {
  const [summary, setSummary] = useState({ total: 243, active: 78, resolved: 165, volunteers: '1,248', departments: 12 });

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

            {/* Floating Blue Card on right */}
            <Grid item xs={12} md={5} lg={6} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end', mt: { xs: 8, md: 0 } }}>
              <Box sx={{ 
                bgcolor: BLUE, color: '#FFF', p: 4, borderRadius: 4, maxWidth: 280,
                boxShadow: '0 20px 25px -5px rgba(29, 78, 216, 0.4)', alignSelf: 'flex-end', mb: -4
              }}>
                <ShieldRoundedIcon sx={{ fontSize: 40, mb: 2, color: '#93C5FD' }} />
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, fontFamily: '"Outfit", sans-serif', lineHeight: 1.2 }}>
                  Always Ready.<br/>Always There.
                </Typography>
                <Typography variant="body2" sx={{ color: '#DBEAFE', mb: 3 }}>
                  Dedicated to protect Himachal Pradesh
                </Typography>
                <Typography sx={{ color: '#FCD34D', fontWeight: 900, fontSize: '1.5rem' }}>24x7</Typography>
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ width: 44, height: 44, borderRadius: '50%', bgcolor: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {f.icon}
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 800, color: NAVY, fontSize: '0.8rem', lineHeight: 1.1 }}>{f.title}</Typography>
                    <Typography sx={{ fontSize: '0.65rem', color: '#64748B', mt: 0.5 }}>{f.desc}</Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ─── 3. MIDDLE LAYOUT (Stats + Alerts) ─── */}
      <Box sx={{ py: 8, bgcolor: '#F8FAFC', flexGrow: 1 }}>
        <Container maxWidth="xl">
          <Grid container spacing={6}>
            
            {/* LEFT COLUMN: At a Glance + Quick Actions */}
            <Grid item xs={12} lg={8}>
              
              <Typography variant="overline" sx={{ fontWeight: 900, color: BLUE, display: 'block', mb: 2 }}>
                HIMACHAL PRADESH AT A GLANCE
              </Typography>
              
              <Grid container spacing={2} sx={{ mb: 6 }}>
                {/* Total Incidents */}
                <Grid item xs={12} sm={4}>
                  <Box sx={{ bgcolor: '#FFF', p: 2, borderRadius: 3, border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <WarningAmberRoundedIcon sx={{ color: BLUE }} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: '1.8rem', fontWeight: 900, color: NAVY, lineHeight: 1 }}>{summary.total}</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Total Incidents<br/>This Month</Typography>
                    </Box>
                  </Box>
                </Grid>
                {/* Active */}
                <Grid item xs={6} sm={4}>
                  <Box sx={{ bgcolor: '#FFF', p: 2, borderRadius: 3, border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <LocalFireDepartmentRoundedIcon sx={{ color: RED }} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: '1.8rem', fontWeight: 900, color: NAVY, lineHeight: 1 }}>{summary.active}</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Active<br/>Incidents</Typography>
                    </Box>
                  </Box>
                </Grid>
                {/* Resolved */}
                <Grid item xs={6} sm={4}>
                  <Box sx={{ bgcolor: '#FFF', p: 2, borderRadius: 3, border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CheckCircleOutlineRoundedIcon sx={{ color: '#10B981' }} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: '1.8rem', fontWeight: 900, color: NAVY, lineHeight: 1 }}>{summary.resolved}</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Resolved<br/>Incidents</Typography>
                    </Box>
                  </Box>
                </Grid>
                {/* Volunteers */}
                <Grid item xs={6} sm={4}>
                  <Box sx={{ bgcolor: '#FFF', p: 2, borderRadius: 3, border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <GroupsRoundedIcon sx={{ color: '#8B5CF6' }} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: '1.8rem', fontWeight: 900, color: NAVY, lineHeight: 1 }}>{summary.volunteers}</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Volunteers<br/>Active</Typography>
                    </Box>
                  </Box>
                </Grid>
                {/* Departments */}
                <Grid item xs={6} sm={4}>
                  <Box sx={{ bgcolor: '#FFF', p: 2, borderRadius: 3, border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <BusinessRoundedIcon sx={{ color: '#F97316' }} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: '1.8rem', fontWeight: 900, color: NAVY, lineHeight: 1 }}>{summary.departments}</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Departments<br/>Online</Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              <Typography variant="overline" sx={{ fontWeight: 900, color: BLUE, display: 'block', mb: 2 }}>
                QUICK ACTIONS
              </Typography>

              <Grid container spacing={2}>
                {QUICK_ACTIONS.map((action, i) => (
                  <Grid item xs={6} sm={4} md={2} key={i}>
                    <Button 
                      component={RouterLink} to={action.path}
                      variant="outlined" 
                      sx={{ 
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, 
                        p: 2, height: '100%', width: '100%',
                        borderColor: '#E2E8F0', bgcolor: '#FFF', color: NAVY, textTransform: 'none', borderRadius: 2,
                        '&:hover': { borderColor: action.color, bgcolor: '#F8FAFC' }
                      }}
                    >
                      <Box sx={{ color: action.color }}>{action.icon}</Box>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, textAlign: 'center', lineHeight: 1.1 }}>
                        {action.label.split(' ').map((w, j) => <React.Fragment key={j}>{w}<br/></React.Fragment>)}
                      </Typography>
                    </Button>
                  </Grid>
                ))}
              </Grid>

            </Grid>

            {/* RIGHT COLUMN: Latest Alerts + SOS */}
            <Grid item xs={12} lg={4}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="overline" sx={{ fontWeight: 900, color: BLUE }}>
                  LATEST ALERTS
                </Typography>
                <Typography component={RouterLink} to="/updates" sx={{ fontSize: '0.75rem', fontWeight: 700, color: BLUE, textDecoration: 'none' }}>
                  View All
                </Typography>
              </Box>
              
              <Box sx={{ bgcolor: '#FFF', border: '1px solid #E2E8F0', borderRadius: 3, overflow: 'hidden', mb: 3 }}>
                <HpsdmaFeed maxItems={4} hideHeader={true} showSummary={false} layout="list" onDataLoad={handleDataLoad} />
              </Box>

              {/* SOS Square Box */}
              <Box sx={{ 
                bgcolor: RED, color: '#FFF', borderRadius: 3, p: 3, textAlign: 'center',
                boxShadow: '0 10px 15px -3px rgba(220, 38, 38, 0.3)',
                position: 'relative', overflow: 'hidden'
              }}>
                <Box sx={{ position: 'absolute', top: -50, left: -50, width: 150, height: 150, borderRadius: '50%', border: '20px solid rgba(255,255,255,0.05)' }} />
                
                <Box sx={{ 
                  width: 80, height: 80, borderRadius: '50%', border: '4px solid rgba(255,255,255,0.3)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 
                }}>
                  <Typography sx={{ fontSize: '1.8rem', fontWeight: 900 }}>SOS</Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, fontFamily: '"Outfit", sans-serif' }}>
                  Need Immediate Help?
                </Typography>
                <Typography sx={{ fontSize: '0.8rem', mb: 3, opacity: 0.9 }}>
                  Press the SOS button to alert nearest responders with your location.
                </Typography>
                <Button 
                  component={RouterLink} to="/emergency"
                  variant="contained" 
                  startIcon={<PhoneInTalkRoundedIcon />}
                  style={{ backgroundColor: '#FFFFFF', color: RED }}
                  sx={{ 
                    fontWeight: 900, borderRadius: '50px', px: 3, py: 1, width: '100%',
                    '&:hover': { backgroundColor: '#FEE2E2' }
                  }}
                >
                  PRESS SOS NOW
                </Button>
              </Box>

            </Grid>

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

    </Box>
  );
}