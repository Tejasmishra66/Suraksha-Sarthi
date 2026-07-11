import React from 'react';
import { Box, Container, Grid, Typography, Paper, Avatar, Chip, Stack, Button, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';

import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import EmojiObjectsRoundedIcon from '@mui/icons-material/EmojiObjectsRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import SpeedRoundedIcon from '@mui/icons-material/SpeedRounded';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import NaturePeopleRoundedIcon from '@mui/icons-material/NaturePeopleRounded';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';
import ReportProblemRoundedIcon from '@mui/icons-material/ReportProblemRounded';
import HandshakeRoundedIcon from '@mui/icons-material/HandshakeRounded';

const MotionBox = motion(Box);
const MotionPaper = motion(Paper);

const coreValues = [
  { icon: <SpeedRoundedIcon sx={{ fontSize: 32 }} />, title: 'Rapid Response', desc: 'Every second matters in a disaster. Our platform is built for speed — from reporting to deployment in minutes.', color: '#ef4444', bg: '#fee2e2' },
  { icon: <VerifiedRoundedIcon sx={{ fontSize: 32 }} />, title: 'Verified Information', desc: 'All incident reports go through a strict verification pipeline to eliminate false alarms and misinformation.', color: '#3b82f6', bg: '#eff6ff' },
  { icon: <GroupsRoundedIcon sx={{ fontSize: 32 }} />, title: 'Community First', desc: 'Built by and for the people of Himachal Pradesh. Every feature is designed around real field needs.', color: '#0f4a30', bg: '#e6f4ea' },
  { icon: <PublicRoundedIcon sx={{ fontSize: 32 }} />, title: 'Open Coordination', desc: 'Breaks down agency silos. Police, SDRF, Medical, and Fire Services all work from a single source of truth.', color: '#8b5cf6', bg: '#f3e8ff' },
  { icon: <FavoriteRoundedIcon sx={{ fontSize: 32 }} />, title: 'Built with Purpose', desc: 'This is not a commercial product. It is a public service tool built with genuine care for human safety.', color: '#f59e0b', bg: '#fef3c7' },
  { icon: <EmojiObjectsRoundedIcon sx={{ fontSize: 32 }} />, title: 'Always Improving', desc: 'Continuous development based on field feedback. Every release makes disaster response faster and smarter.', color: '#10b981', bg: '#ecfdf5' },
];

const teamMembers = [
  { name: 'SDRF Command Unit', role: 'Operational Authority', department: 'State Disaster Response Force', initials: 'SC', color: '#0f4a30' },
  { name: 'District Police', role: 'Law & Order Partner', department: 'Himachal Pradesh Police', initials: 'DP', color: '#3b82f6' },
  { name: 'Medical Corps', role: 'Healthcare Response', department: 'HP Health Department', initials: 'MC', color: '#ef4444' },
  { name: 'Fire & Rescue', role: 'Structural Response', department: 'Fire Service Directorate', initials: 'FR', color: '#f59e0b' },
  { name: 'Civil Defence', role: 'Volunteer Management', department: 'Civil Defence HP', initials: 'CD', color: '#8b5cf6' },
  { name: 'Revenue Department', role: 'Ground Coordination', department: 'HP Revenue & DM', initials: 'RD', color: '#10b981' },
];

const milestones = [
  { year: '2020', event: 'SDRF Helping Hands concept proposed after severe monsoon floods in Kullu-Manali.', icon: <EmojiObjectsRoundedIcon /> },
  { year: '2021', event: 'Platform design and technology stack finalized. Core team assembled.', icon: <GroupsRoundedIcon /> },
  { year: '2022', event: 'Beta version launched with Emergency Reporting and Volunteer modules.', icon: <SpeedRoundedIcon /> },
  { year: '2023', event: 'Live Map, Equipment Tracking, and Task Board added. First field deployment in Mandi.', icon: <PlaceRoundedIcon /> },
  { year: '2024', event: 'Offline-first support added. Platform expanded to all 12 districts of Himachal Pradesh.', icon: <PublicRoundedIcon /> },
  { year: '2025+', event: 'AI disaster prediction, mobile apps, and satellite connectivity in development.', icon: <StarRoundedIcon /> },
];

const impactStats = [
  { value: '12', label: 'Districts Covered', icon: <PlaceRoundedIcon />, color: '#0f4a30' },
  { value: '1,287+', label: 'Rescue Operations', icon: <ShieldRoundedIcon />, color: '#ef4444' },
  { value: '12,458+', label: 'Active Volunteers', icon: <GroupsRoundedIcon />, color: '#3b82f6' },
  { value: '3,842+', label: 'Equipment Tracked', icon: <SecurityRoundedIcon />, color: '#f59e0b' },
];

export default function AboutPage() {
  return (
    <Box sx={{ width: '100%', fontFamily: "'Inter', sans-serif", bgcolor: '#f8fafc' }}>

      {/* HERO */}
      <Box sx={{ position: 'relative', overflow: 'hidden', bgcolor: '#0f4a30', pt: { xs: 10, md: 16 }, pb: { xs: 12, md: 20 } }}>
        <Box sx={{ position: 'absolute', top: -100, right: -100, width: 500, height: 500, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', bottom: -150, left: -150, width: 600, height: 600, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', top: '20%', left: '60%', width: 200, height: 200, borderRadius: '50%', bgcolor: 'rgba(110,231,183,0.08)', pointerEvents: 'none' }} />
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <MotionBox initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} sx={{ textAlign: 'center', maxWidth: 800, mx: 'auto' }}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, bgcolor: 'rgba(110,231,183,0.15)', border: '1px solid rgba(110,231,183,0.3)', px: 3, py: 0.8, borderRadius: 5, mb: 4 }}>
              <NaturePeopleRoundedIcon sx={{ fontSize: 18, color: '#6ee7b7' }} />
              <Typography variant="caption" sx={{ color: '#6ee7b7', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase' }}>About Suraksha Sarthi</Typography>
            </Box>
            <Typography variant="h1" sx={{ color: '#ffffff', fontWeight: 900, lineHeight: 1.1, mb: 3, letterSpacing: '-2px', fontSize: { xs: '2.8rem', md: '4.5rem' } }}>
              Protecting Himachal,{' '}
              <span style={{ background: 'linear-gradient(90deg, #6ee7b7, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>One Life at a Time</span>
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.75)', fontWeight: 400, lineHeight: 1.8, maxWidth: 640, mx: 'auto', mb: 6, fontSize: '1.15rem' }}>
              SDRF Helping Hands is Himachal Pradesh's unified digital platform for disaster response, volunteer coordination, and real-time emergency management — built by public servants, for the public.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button variant="contained" component={RouterLink} to="/emergency" startIcon={<ReportProblemRoundedIcon />}
                sx={{ bgcolor: '#d32f2f', color: '#fff', px: 4, py: 1.8, borderRadius: 3, fontWeight: 800, fontSize: '1rem', boxShadow: '0 8px 25px rgba(211,47,47,0.4)', '&:hover': { bgcolor: '#b71c1c', transform: 'translateY(-2px)' }, transition: 'all 0.2s' }}>
                Report Emergency
              </Button>
              <Button variant="outlined" component={RouterLink} to="/volunteer" startIcon={<HandshakeRoundedIcon />}
                sx={{ color: '#6ee7b7', borderColor: 'rgba(110,231,183,0.5)', px: 4, py: 1.8, borderRadius: 3, fontWeight: 800, fontSize: '1rem', '&:hover': { bgcolor: 'rgba(110,231,183,0.1)', borderColor: '#6ee7b7', transform: 'translateY(-2px)' }, transition: 'all 0.2s' }}>
                Join as Volunteer
              </Button>
            </Stack>
          </MotionBox>
        </Container>
        <Box sx={{ position: 'absolute', bottom: -2, left: 0, width: '100%', overflow: 'hidden', lineHeight: 0, zIndex: 2 }}>
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', width: '100%', height: '70px' }}>
            <path d="M0 100L60 88C120 76 240 52 360 44C480 36 600 44 720 52C840 60 960 68 1080 64C1200 60 1320 44 1380 36L1440 28V100H1380C1320 100 1200 100 1080 100C960 100 840 100 720 100C600 100 480 100 360 100C240 100 120 100 60 100H0Z" fill="#f8fafc" />
          </svg>
        </Box>
      </Box>

      {/* IMPACT STATS */}
      <Box sx={{ py: 8, bgcolor: '#f8fafc' }}>
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            {impactStats.map((stat, i) => (
              <Grid item xs={6} md={3} key={i}>
                <MotionPaper elevation={0} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                  sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0', textAlign: 'center', bgcolor: '#ffffff', transition: 'all 0.3s', '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 20px 40px rgba(0,0,0,0.06)' } }}>
                  <Box sx={{ width: 56, height: 56, borderRadius: '50%', bgcolor: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2, color: stat.color }}>
                    {stat.icon}
                  </Box>
                  <Typography variant="h3" fontWeight={900} color="#0f172a" sx={{ letterSpacing: '-1px' }}>{stat.value}</Typography>
                  <Typography variant="body2" color="#64748b" fontWeight={600} mt={0.5}>{stat.label}</Typography>
                </MotionPaper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* OUR STORY + TIMELINE */}
      <Box sx={{ py: 10, bgcolor: '#ffffff' }}>
        <Container maxWidth="xl">
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={6}>
              <MotionBox initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
                <Chip label="Our Story" size="small" sx={{ bgcolor: '#e6f4ea', color: '#0f4a30', fontWeight: 800, mb: 3, px: 1 }} />
                <Typography variant="h3" fontWeight={900} color="#0f172a" letterSpacing="-1px" mb={3}>
                  Born from the Mountains,<br />Built for the People
                </Typography>
                <Typography variant="body1" color="#475569" lineHeight={1.9} mb={3}>
                  The valleys and peaks of Himachal Pradesh are among the most beautiful — and most vulnerable — landscapes in India. Every monsoon season brings landslides. Every winter brings snowstorms. Every year, communities are cut off, lives are put at risk, and responders scramble to coordinate across agencies using phone calls and paper forms.
                </Typography>
                <Typography variant="body1" color="#475569" lineHeight={1.9} mb={3}>
                  Suraksha Sarthi was born from the frustration of those gaps. A team of SDRF officers, technology volunteers, and district administrators came together with one goal: <strong style={{ color: '#0f4a30' }}>build a single, real-time platform that makes every second of disaster response count.</strong>
                </Typography>
                <Typography variant="body1" color="#475569" lineHeight={1.9}>
                  Today, the platform connects over 12,000 volunteers, manages equipment across all 12 districts, and provides citizens a live window into the state's emergency response operations.
                </Typography>
              </MotionBox>
            </Grid>
            <Grid item xs={12} md={6}>
              <MotionBox initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
                <Box sx={{ position: 'relative', pl: 4, '&::before': { content: '""', position: 'absolute', left: 18, top: 0, bottom: 0, width: 2, bgcolor: '#e2e8f0' } }}>
                  {milestones.map((m, i) => (
                    <Box key={i} sx={{ display: 'flex', gap: 3, mb: 4, position: 'relative' }}>
                      <Box sx={{ position: 'absolute', left: -26, top: 4, width: 36, height: 36, borderRadius: '50%', bgcolor: '#0f4a30', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', zIndex: 1, flexShrink: 0, boxShadow: '0 0 0 4px #ffffff' }}>
                        {React.cloneElement(m.icon, { sx: { fontSize: 18 } })}
                      </Box>
                      <Box>
                        <Typography variant="caption" fontWeight={900} color="#10b981" sx={{ textTransform: 'uppercase', letterSpacing: '1px' }}>{m.year}</Typography>
                        <Typography variant="body2" color="#334155" fontWeight={500} lineHeight={1.6} mt={0.5}>{m.event}</Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </MotionBox>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* MISSION & VISION */}
      <Box sx={{ py: 10, bgcolor: '#f8fafc' }}>
        <Container maxWidth="xl">
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <MotionPaper elevation={0} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
                sx={{ p: 6, height: '100%', borderRadius: 5, border: '1px solid #e2e8f0', bgcolor: '#ffffff', position: 'relative', overflow: 'hidden' }}>
                <Box sx={{ position: 'absolute', top: -30, right: -30, width: 160, height: 160, borderRadius: '50%', bgcolor: 'rgba(15,74,48,0.04)' }} />
                <Box sx={{ width: 60, height: 60, borderRadius: 3, bgcolor: '#e6f4ea', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                  <ShieldRoundedIcon sx={{ fontSize: 30, color: '#0f4a30' }} />
                </Box>
                <Typography variant="overline" sx={{ color: '#10b981', fontWeight: 800, letterSpacing: '2px', display: 'block', mb: 1 }}>Our Mission</Typography>
                <Typography variant="h4" fontWeight={900} color="#0f172a" mb={3} letterSpacing="-0.5px">Rapid, Coordinated, Lifesaving Response</Typography>
                <Typography variant="body1" color="#475569" lineHeight={1.9}>
                  To create a unified, real-time digital platform that empowers SDRF personnel, volunteers, and citizens of Himachal Pradesh to respond faster, coordinate smarter, and save more lives during every natural disaster and emergency.
                </Typography>
                <Divider sx={{ my: 4, borderColor: '#f1f5f9' }} />
                <Stack direction="row" spacing={2} flexWrap="wrap" gap={1}>
                  {['Real-Time Data', 'Multi-Agency', 'Offline Ready', 'GPS Tracked'].map(tag => (
                    <Chip key={tag} label={tag} size="small" sx={{ bgcolor: '#e6f4ea', color: '#0f4a30', fontWeight: 700 }} />
                  ))}
                </Stack>
              </MotionPaper>
            </Grid>
            <Grid item xs={12} md={6}>
              <MotionPaper elevation={0} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }}
                sx={{ p: 6, height: '100%', borderRadius: 5, bgcolor: '#0f4a30', position: 'relative', overflow: 'hidden' }}>
                <Box sx={{ position: 'absolute', top: -30, right: -30, width: 160, height: 160, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.04)' }} />
                <Box sx={{ position: 'absolute', bottom: -50, left: -20, width: 200, height: 200, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.03)' }} />
                <Box sx={{ width: 60, height: 60, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                  <StarRoundedIcon sx={{ fontSize: 30, color: '#6ee7b7' }} />
                </Box>
                <Typography variant="overline" sx={{ color: '#6ee7b7', fontWeight: 800, letterSpacing: '2px', display: 'block', mb: 1 }}>Our Vision</Typography>
                <Typography variant="h4" fontWeight={900} color="#ffffff" mb={3} letterSpacing="-0.5px">A Disaster-Resilient Himachal Pradesh</Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.9 }}>
                  We envision a Himachal Pradesh where no life is lost due to delayed response or poor coordination. Where every village has a registered volunteer, every piece of rescue equipment is tracked, and every citizen can report an emergency from their phone within seconds.
                </Typography>
                <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.15)' }} />
                <Stack direction="row" spacing={2} flexWrap="wrap" gap={1}>
                  {['Zero Information Gap', 'Smart Alerts', 'Every District', 'AI-Powered'].map(tag => (
                    <Chip key={tag} label={tag} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#6ee7b7', fontWeight: 700, border: '1px solid rgba(110,231,183,0.3)' }} />
                  ))}
                </Stack>
              </MotionPaper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CORE VALUES */}
      <Box sx={{ py: 10, bgcolor: '#ffffff' }}>
        <Container maxWidth="xl">
          <MotionBox initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} textAlign="center" mb={8}>
            <Chip label="Our Values" size="small" sx={{ bgcolor: '#e6f4ea', color: '#0f4a30', fontWeight: 800, mb: 2, px: 1 }} />
            <Typography variant="h3" fontWeight={900} color="#0f172a" letterSpacing="-1px">What Drives Us</Typography>
            <Box sx={{ width: 60, height: 5, background: 'linear-gradient(90deg, #10b981, #0f4a30)', mt: 2, borderRadius: 2, mx: 'auto' }} />
          </MotionBox>
          <Grid container spacing={3}>
            {coreValues.map((val, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <MotionPaper elevation={0} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}
                  sx={{ p: 4, borderRadius: 4, border: '1px solid #f1f5f9', bgcolor: '#ffffff', height: '100%', transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)', '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 20px 40px rgba(0,0,0,0.07)', borderColor: val.color + '40' } }}>
                  <Box sx={{ width: 56, height: 56, borderRadius: 3, bgcolor: val.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3, color: val.color }}>
                    {val.icon}
                  </Box>
                  <Typography variant="h6" fontWeight={800} color="#0f172a" mb={1.5}>{val.title}</Typography>
                  <Typography variant="body2" color="#64748b" lineHeight={1.7}>{val.desc}</Typography>
                </MotionPaper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* PARTNER AGENCIES */}
      <Box sx={{ py: 10, bgcolor: '#f8fafc' }}>
        <Container maxWidth="xl">
          <MotionBox initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} textAlign="center" mb={8}>
            <Chip label="Partner Agencies" size="small" sx={{ bgcolor: '#e6f4ea', color: '#0f4a30', fontWeight: 800, mb: 2, px: 1 }} />
            <Typography variant="h3" fontWeight={900} color="#0f172a" letterSpacing="-1px">The Team Behind the Platform</Typography>
            <Box sx={{ width: 60, height: 5, background: 'linear-gradient(90deg, #10b981, #0f4a30)', mt: 2, borderRadius: 2, mx: 'auto' }} />
            <Typography variant="body1" color="#64748b" mt={3} maxWidth={560} mx="auto" lineHeight={1.7}>
              Suraksha Sarthi is a collaborative effort of six key government agencies working together as one unified force.
            </Typography>
          </MotionBox>
          <Grid container spacing={3}>
            {teamMembers.map((member, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <MotionPaper elevation={0} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }}
                  sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: '#ffffff', display: 'flex', alignItems: 'center', gap: 3, transition: 'all 0.3s', '&:hover': { transform: 'translateX(6px)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', borderLeft: `4px solid ${member.color}` } }}>
                  <Avatar sx={{ width: 56, height: 56, bgcolor: member.color, fontWeight: 900, fontSize: '1rem', flexShrink: 0 }}>{member.initials}</Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={800} color="#0f172a">{member.name}</Typography>
                    <Typography variant="caption" color="#64748b" fontWeight={600} display="block">{member.role}</Typography>
                    <Chip label={member.department} size="small" sx={{ mt: 0.8, height: 20, fontSize: '0.6rem', fontWeight: 700, bgcolor: `${member.color}15`, color: member.color }} />
                  </Box>
                </MotionPaper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA */}
      <Box sx={{ py: 14, bgcolor: '#0f4a30', position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', top: -80, right: -80, width: 400, height: 400, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.04)' }} />
        <Box sx={{ position: 'absolute', bottom: -100, left: -100, width: 500, height: 500, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.03)' }} />
        <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <MotionBox initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <CampaignRoundedIcon sx={{ fontSize: 56, color: '#6ee7b7', mb: 3 }} />
            <Typography variant="h3" fontWeight={900} color="#ffffff" mb={3} letterSpacing="-1px">Ready to Make a Difference?</Typography>
            <Typography variant="h6" color="rgba(255,255,255,0.7)" fontWeight={400} mb={6} lineHeight={1.7}>
              Join thousands of SDRF officers and volunteers who use this platform every day to protect the people of Himachal Pradesh.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center">
              <Button variant="contained" component={RouterLink} to="/signup" size="large" endIcon={<ArrowForwardRoundedIcon />}
                sx={{ bgcolor: '#10b981', color: '#fff', px: 5, py: 2, borderRadius: 3, fontWeight: 800, fontSize: '1.05rem', boxShadow: '0 8px 30px rgba(16,185,129,0.4)', '&:hover': { bgcolor: '#059669', transform: 'translateY(-3px)' }, transition: 'all 0.2s' }}>
                Register Now
              </Button>
              <Button variant="outlined" component={RouterLink} to="/home" size="large" endIcon={<ArrowForwardRoundedIcon />}
                sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)', px: 5, py: 2, borderRadius: 3, fontWeight: 800, fontSize: '1.05rem', '&:hover': { bgcolor: 'rgba(255,255,255,0.08)', borderColor: '#fff' }, transition: 'all 0.2s' }}>
                Explore Platform
              </Button>
            </Stack>
          </MotionBox>
        </Container>
      </Box>

    </Box>
  );
}
