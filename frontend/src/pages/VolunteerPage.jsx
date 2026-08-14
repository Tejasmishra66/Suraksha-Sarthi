import React, { useState, useEffect } from 'react';
import {
  Box, Container, Grid, Typography, Button, Divider, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, IconButton
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

// Icons
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import EventRoundedIcon from '@mui/icons-material/EventRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import VolunteerActivismRoundedIcon from '@mui/icons-material/VolunteerActivismRounded';
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import TerrainRoundedIcon from '@mui/icons-material/TerrainRounded';
import MedicalServicesRoundedIcon from '@mui/icons-material/MedicalServicesRounded';
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded';
import HandshakeRoundedIcon from '@mui/icons-material/HandshakeRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import Diversity1RoundedIcon from '@mui/icons-material/Diversity1Rounded';
import LibraryBooksRoundedIcon from '@mui/icons-material/LibraryBooksRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';

import { fetchVolunteers } from '../api/client';

const NAVY = '#0B2545';
const BLUE = '#1D4ED8';
const LIGHT_BLUE = '#EFF6FF';
const RED = '#DC2626';

const PROGRAMS = [
  { icon: <TerrainRoundedIcon />, color: '#10B981', bg: '#D1FAE5', title: 'Disaster Response Volunteer', desc: 'Assist in rescue, relief and evacuation during disasters.' },
  { icon: <MedicalServicesRoundedIcon />, color: '#3B82F6', bg: '#DBEAFE', title: 'First Aid Volunteer', desc: 'Provide first aid and medical assistance to victims in need.' },
  { icon: <CampaignRoundedIcon />, color: '#F59E0B', bg: '#FEF3C7', title: 'Awareness Campaign Volunteer', desc: 'Spread awareness and educate communities on disaster preparedness.' },
  { icon: <HandshakeRoundedIcon />, color: '#8B5CF6', bg: '#EDE9FE', title: 'Community Support Volunteer', desc: 'Support vulnerable groups and help in community rebuilding.' }
];

const WHY_US = [
  'Be a part of life-saving missions',
  'Gain hands-on experience',
  'Learn new skills and get trained',
  'Build a safer and stronger community',
  'Get recognition for your contribution'
];

const EVENTS = [
  { date: 'JUN 05', title: 'Disaster Preparedness Drive', loc: 'Mandi, Himachal Pradesh', time: '10:00 AM - 01:00 PM' },
  { date: 'JUN 12', title: 'First Aid Training Camp', loc: 'Kangra, Himachal Pradesh', time: '09:30 AM - 02:30 PM' },
  { date: 'JUN 18', title: 'Community Awareness Rally', loc: 'Shimla, Himachal Pradesh', time: '10:00 AM - 12:00 PM' }
];

export default function VolunteerPage() {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  const isOfficial = user?.role === 'admin' || user?.role === 'agency_head' || user?.role === 'officer' || user?.role === 'sdrf_team';

  useEffect(() => {
    fetchVolunteers()
      .then((d) => setVolunteers(d || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalVolunteers = volunteers.length;
  const activeVolunteers = volunteers.filter(v => v.active).length;

  return (
    <Box sx={{ bgcolor: '#F8FAFC', minHeight: 'calc(100vh - 66px)', display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth="xl" sx={{ flexGrow: 1, py: 3, display: 'flex', flexDirection: 'column' }}>
        <Grid container spacing={3} sx={{ flexGrow: 1 }}>
          
          {/* ══ LEFT SIDEBAR ══ */}
          <Grid item xs={12} lg={2.5}>
            {/* Header Block */}
            <Box sx={{ bgcolor: BLUE, color: '#FFF', borderRadius: 3, p: 2.5, mb: 3 }}>
              <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', mb: 0.5 }}>VOLUNTEERS</Typography>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, opacity: 0.9 }}>
                Join hands with SDRF and become a part of the disaster response mission.
              </Typography>
            </Box>

            {/* Nav Menu */}
            <Box sx={{ mb: 3 }}>
              {[
                { icon: <HomeRoundedIcon />, label: 'Overview', active: true },
                { icon: <InfoRoundedIcon />, label: 'How to Join' },
                { icon: <GroupsRoundedIcon />, label: 'Volunteer Programs' },
                { icon: <VerifiedUserRoundedIcon />, label: 'Active Volunteers' },
                { icon: <EventRoundedIcon />, label: 'Events & Drives' },
                { icon: <SchoolRoundedIcon />, label: 'Training Sessions' },
                { icon: <HelpOutlineRoundedIcon />, label: 'FAQ' },
              ].map((item, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, borderRadius: 2, mb: 0.5, cursor: 'pointer', bgcolor: item.active ? LIGHT_BLUE : 'transparent', color: item.active ? BLUE : NAVY, '&:hover': { bgcolor: item.active ? LIGHT_BLUE : '#F1F5F9' } }}>
                  <Box sx={{ display: 'flex' }}>{React.cloneElement(item.icon, { sx: { fontSize: 18 } })}</Box>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 700 }}>{item.label}</Typography>
                </Box>
              ))}
            </Box>

            {/* Make a Difference */}
            <Box sx={{ bgcolor: '#F1F5F9', borderRadius: 3, p: 2.5, mb: 2, textAlign: 'left' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                <VolunteerActivismRoundedIcon sx={{ color: BLUE, fontSize: 24 }} />
                <Typography sx={{ fontSize: '0.9rem', fontWeight: 800, color: NAVY, lineHeight: 1.2 }}>Make a Difference</Typography>
              </Box>
              <Typography sx={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500, mb: 2 }}>
                Your time and skills can save lives and build a safer community.
              </Typography>
              <Button component={RouterLink} to="/join-volunteer" variant="contained" fullWidth sx={{ borderRadius: 2, py: 1.2, bgcolor: BLUE, textTransform: 'none', fontWeight: 700, fontSize: '0.8rem', '&:hover': { bgcolor: '#1D4ED8' } }}>
                <VerifiedUserRoundedIcon sx={{ fontSize: 16, mr: 1 }} /> Register as Volunteer
              </Button>
            </Box>

            {/* Need Help */}
            <Box sx={{ bgcolor: '#FFF', borderRadius: 3, border: '1px solid #E2E8F0', p: 2.5, textAlign: 'left' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <SupportAgentRoundedIcon sx={{ color: BLUE, fontSize: 22 }} />
                <Typography sx={{ fontSize: '0.9rem', fontWeight: 800, color: NAVY }}>Need Help?</Typography>
              </Box>
              <Typography sx={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500, mb: 2 }}>
                Contact our Volunteer Support Team for any queries.
              </Typography>
              <Button variant="outlined" fullWidth endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 14 }} />} sx={{ borderRadius: 2, py: 1, borderColor: '#E2E8F0', color: NAVY, textTransform: 'none', fontWeight: 700, fontSize: '0.8rem', '&:hover': { bgcolor: '#F8FAFC' } }}>
                Contact Support
              </Button>
            </Box>
          </Grid>


          {/* ══ CENTER AREA ══ */}
          <Grid item xs={12} lg={6.5}>
            <Box sx={{ mb: 4 }}>
              <Typography sx={{ fontSize: '1.4rem', fontWeight: 900, color: NAVY, mb: 0.5 }}>Volunteer With Suraksha Sarthi</Typography>
              <Typography sx={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 500 }}>Together we can build a stronger, safer and more prepared Himachal Pradesh.</Typography>
            </Box>

            {/* Stats Row */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
              {[
                { icon: <GroupsRoundedIcon />, color: BLUE, bg: LIGHT_BLUE, num: totalVolunteers.toLocaleString(), label: 'Total Volunteers', sub: '+156 this month' },
                { icon: <CheckCircleOutlineRoundedIcon />, color: '#10B981', bg: '#D1FAE5', num: activeVolunteers.toLocaleString(), label: 'Active Volunteers', sub: 'On Field' },
                { icon: <EventRoundedIcon />, color: '#F59E0B', bg: '#FEF3C7', num: '24', label: 'Events This Month', sub: 'Across HP' },
                { icon: <LibraryBooksRoundedIcon />, color: '#8B5CF6', bg: '#EDE9FE', num: '15', label: 'Training Sessions', sub: 'This Month' },
              ].map((s, i) => (
                <Grid item xs={6} md={3} key={i}>
                  <Box sx={{ bgcolor: '#FFF', borderRadius: 3, border: '1px solid #E2E8F0', p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                      <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: s.bg, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {React.cloneElement(s.icon, { sx: { fontSize: 22 } })}
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: '1.25rem', fontWeight: 900, color: NAVY, lineHeight: 1 }}>{s.num}</Typography>
                        <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748B', mt: 0.5 }}>{s.label}</Typography>
                      </Box>
                    </Box>
                    <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: s.color, mt: 'auto' }}>{s.sub}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>

            {/* Volunteer Programs */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography sx={{ fontSize: '1.1rem', fontWeight: 900, color: NAVY }}>Volunteer Programs</Typography>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: BLUE, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>View All Programs</Typography>
            </Box>
            <Grid container spacing={2} sx={{ mb: 4 }}>
              {PROGRAMS.map((p, i) => (
                <Grid item xs={12} md={6} lg={3} key={i}>
                  <Box sx={{ bgcolor: '#FFF', borderRadius: 3, border: '1px solid #E2E8F0', p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: p.bg, color: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                      {React.cloneElement(p.icon, { sx: { fontSize: 20 } })}
                    </Box>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 900, color: NAVY, mb: 1, lineHeight: 1.3 }}>{p.title}</Typography>
                    <Typography sx={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 500, mb: 3, flexGrow: 1 }}>{p.desc}</Typography>
                    <Button component={RouterLink} to="/join-volunteer" variant="outlined" endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 14 }} />} sx={{ borderRadius: 2, py: 0.8, borderColor: `${p.color}40`, color: p.color, textTransform: 'none', fontWeight: 700, fontSize: '0.75rem', '&:hover': { bgcolor: p.bg, borderColor: p.color } }}>
                      Join Program
                    </Button>
                  </Box>
                </Grid>
              ))}
            </Grid>


          </Grid>


          {/* ══ RIGHT SIDEBAR ══ */}
          <Grid item xs={12} lg={3}>
            {/* Why Volunteer With Us */}
            <Typography sx={{ fontSize: '1rem', fontWeight: 900, color: NAVY, mb: 2 }}>Why Volunteer With Us?</Typography>
            <Box sx={{ bgcolor: '#FFF', borderRadius: 3, border: '1px solid #E2E8F0', p: 3, mb: 4 }}>
              {WHY_US.map((item, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: i !== WHY_US.length - 1 ? 2 : 0 }}>
                  <Box sx={{ color: BLUE, mt: 0.2 }}><VerifiedUserRoundedIcon sx={{ fontSize: 16 }} /></Box>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: NAVY, lineHeight: 1.4 }}>{item}</Typography>
                </Box>
              ))}
            </Box>

            {/* Upcoming Events */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography sx={{ fontSize: '1rem', fontWeight: 900, color: NAVY }}>Upcoming Events</Typography>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: BLUE, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>View All</Typography>
            </Box>
            <Box sx={{ bgcolor: '#FFF', borderRadius: 3, border: '1px solid #E2E8F0', p: 2, mb: 4 }}>
              {EVENTS.map((evt, i) => (
                <Box key={i} sx={{ display: 'flex', gap: 2, mb: i !== EVENTS.length - 1 ? 2.5 : 0 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, minWidth: 40 }}>
                    <Typography sx={{ fontSize: '0.65rem', fontWeight: 800, color: RED, lineHeight: 1 }}>{evt.date.split(' ')[0]}</Typography>
                    <Typography sx={{ fontSize: '1.2rem', fontWeight: 900, color: NAVY, lineHeight: 1, mt: 0.3 }}>{evt.date.split(' ')[1]}</Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 800, color: NAVY, mb: 0.5, lineHeight: 1.2 }}>{evt.title}</Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748B', mb: 0.5 }}>{evt.loc}</Typography>
                    <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: NAVY }}>{evt.time}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            {/* Steps to Join */}
            <Typography sx={{ fontSize: '1rem', fontWeight: 900, color: NAVY, mb: 2 }}>Steps to Join</Typography>
            <Box sx={{ bgcolor: '#FFF', borderRadius: 3, border: '1px solid #E2E8F0', p: 3 }}>
              {[
                { title: 'Register Online', desc: 'Fill the volunteer registration form.' },
                { title: 'Verification', desc: 'Our team will verify your details.' },
                { title: 'Training', desc: 'Attend orientation and training sessions.' },
                { title: 'Start Volunteering', desc: 'Get involved in activities and events.' },
              ].map((step, i) => (
                <Box key={i} sx={{ display: 'flex', gap: 2, position: 'relative', pb: i !== 3 ? 3 : 0 }}>
                  {i !== 3 && <Box sx={{ position: 'absolute', left: 15, top: 30, bottom: 0, width: 2, borderLeft: '2px dashed #CBD5E1' }} />}
                  <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: LIGHT_BLUE, color: BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid #BFDBFE', zIndex: 1 }}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 800 }}>0{i+1}</Typography>
                  </Box>
                  <Box sx={{ pt: 0.5 }}>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 800, color: NAVY, mb: 0.3 }}>{step.title}</Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: '#64748B' }}>{step.desc}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* ── BOTTOM TRUST BADGES ── */}
      <Box sx={{ bgcolor: LIGHT_BLUE, py: 2, borderTop: '1px solid #BFDBFE', mt: 'auto' }}>
        <Container maxWidth="xl">
          <Grid container spacing={2} justifyContent="space-around">
            {[
              { icon: <GroupsRoundedIcon />, title: 'Join the Mission', desc: 'Be a hero in someone\'s life' },
              { icon: <SchoolRoundedIcon />, title: 'Learn & Grow', desc: 'Training and skill development' },
              { icon: <VolunteerActivismRoundedIcon />, title: 'Serve Your Community', desc: 'Together for a safer tomorrow' },
              { icon: <EmojiEventsRoundedIcon />, title: 'Recognized & Valued', desc: 'Your efforts make a difference' }
            ].map((b, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, justifyContent: 'center', px: 2, borderRight: i < 3 ? { xs: 'none', md: '1px solid #BFDBFE' } : 'none' }}>
                  <Box sx={{ color: BLUE, display: 'flex' }}>
                    {React.cloneElement(b.icon, { sx: { fontSize: 32 } })}
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 800, color: NAVY, lineHeight: 1.2 }}>{b.title}</Typography>
                    <Typography sx={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>{b.desc}</Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

    </Box>
  );
}
