import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Container, Grid, Typography, Button, Divider, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Avatar, Chip, Tooltip, IconButton,
  CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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

import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';

import { fetchVolunteers, updateVolunteerStatus } from '../api/client';

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
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'agency_head';

  const [volunteers, setVolunteers]     = useState([]);
  const [loading, setLoading]           = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState(null); // volunteerId being updated

  const loadVolunteers = useCallback(() => {
    setLoading(true);
    fetchVolunteers()
      .then((d) => setVolunteers(Array.isArray(d) ? d : (d?.data || [])))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadVolunteers(); }, [loadVolunteers]);

  const handleStatusUpdate = async (volunteerId, newStatus) => {
    setActionLoading(volunteerId);
    try {
      await updateVolunteerStatus(volunteerId, newStatus);
      setVolunteers(prev =>
        prev.map(v => v.id === volunteerId ? { ...v, status: newStatus } : v)
      );
    } catch (e) {
      alert('Failed to update status: ' + (e?.response?.data?.message || e.message));
    } finally {
      setActionLoading(null);
    }
  };

  const totalVolunteers   = volunteers.length;
  const activeVolunteers  = volunteers.filter(v => v.active).length;
  const pendingCount      = volunteers.filter(v => !v.status || v.status === 'pending').length;
  const approvedCount     = volunteers.filter(v => v.status === 'approved').length;

  const filteredVolunteers = statusFilter === 'all'
    ? volunteers
    : volunteers.filter(v => {
        const s = v.status || 'pending';
        return s === statusFilter;
      });

  // Helper: mask Aadhaar
  const maskAadhaar = (a) => a ? '••••-••••-' + String(a).slice(-4) : '—';

  // Status chip config
  const statusConfig = {
    pending:  { color: '#D97706', bg: '#FEF3C7', border: '#FDE68A', label: 'Pending' },
    approved: { color: '#059669', bg: '#D1FAE5', border: '#6EE7B7', label: 'Approved' },
    rejected: { color: '#DC2626', bg: '#FEE2E2', border: '#FCA5A5', label: 'Rejected' },
  };

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

            {/* ── ADMIN VOLUNTEER MANAGEMENT ── */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, mt: 2 }}>
              <Box>
                <Typography sx={{ fontSize: '1.1rem', fontWeight: 900, color: NAVY }}>Volunteer Applications</Typography>
                {pendingCount > 0 && (
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#D97706' }}>
                    {pendingCount} pending approval{pendingCount > 1 ? 's' : ''}
                  </Typography>
                )}
              </Box>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Tooltip title="Refresh">
                  <IconButton size="small" onClick={loadVolunteers} disabled={loading}>
                    <RefreshRoundedIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            {/* Status Filter Chips */}
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              {[
                { key: 'all',      label: `All (${volunteers.length})`,      color: NAVY },
                { key: 'pending',  label: `Pending (${pendingCount})`,        color: '#D97706' },
                { key: 'approved', label: `Approved (${approvedCount})`,      color: '#059669' },
                { key: 'rejected', label: `Rejected (${volunteers.filter(v => v.status === 'rejected').length})`, color: '#DC2626' },
              ].map(f => (
                <Chip
                  key={f.key}
                  label={f.label}
                  onClick={() => setStatusFilter(f.key)}
                  variant={statusFilter === f.key ? 'filled' : 'outlined'}
                  sx={{
                    fontWeight: 800, fontSize: '0.72rem',
                    bgcolor: statusFilter === f.key ? f.color : 'transparent',
                    color: statusFilter === f.key ? 'white' : f.color,
                    borderColor: f.color,
                    '&:hover': { bgcolor: f.color + '22' },
                  }}
                />
              ))}
            </Box>

            <Box sx={{ bgcolor: '#FFF', borderRadius: 3, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
              <TableContainer>
                <Table size="small">
                  <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                    <TableRow>
                      <TableCell sx={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.05em' }}>NAME</TableCell>
                      <TableCell sx={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.05em' }}>LOCATION</TableCell>
                      <TableCell sx={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.05em' }}>SKILLS</TableCell>
                      <TableCell sx={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.05em' }}>AADHAAR</TableCell>
                      <TableCell sx={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.05em' }}>CERT.</TableCell>
                      <TableCell sx={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.05em' }}>JOINED</TableCell>
                      <TableCell align="center" sx={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.05em' }}>STATUS</TableCell>
                      {isAdmin && <TableCell align="center" sx={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.05em' }}>ACTIONS</TableCell>}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow><TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                        <CircularProgress size={24} />
                      </TableCell></TableRow>
                    ) : filteredVolunteers.length === 0 ? (
                      <TableRow><TableCell colSpan={8} align="center" sx={{ py: 4, color: '#94A3B8', fontWeight: 600, fontSize: '0.8rem' }}>
                        No volunteers found for this filter.
                      </TableCell></TableRow>
                    ) : filteredVolunteers.map((v) => {
                      const vStatus = v.status || 'pending';
                      const sc = statusConfig[vStatus] || statusConfig.pending;
                      const skills = (v.skills || v.capabilities || '').split(',').filter(Boolean);
                      return (
                        <TableRow key={v.id} sx={{ '&:last-child td': { border: 0 }, '&:hover': { bgcolor: '#F8FAFC' } }}>
                          <TableCell sx={{ py: 1.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Avatar sx={{ width: 28, height: 28, bgcolor: BLUE, fontSize: '0.8rem', fontWeight: 700 }}>
                                {v.name?.charAt(0)}
                              </Avatar>
                              <Box>
                                <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: NAVY }}>{v.name}</Typography>
                                <Typography sx={{ fontSize: '0.7rem', color: '#64748B' }}>{v.phone}</Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>
                            {v.place || v.district || '—'}
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.4 }}>
                              {skills.slice(0, 3).map((s, i) => (
                                <Typography key={i} sx={{ fontSize: '0.62rem', fontWeight: 700, color: BLUE, bgcolor: LIGHT_BLUE, px: 0.8, py: 0.2, borderRadius: 0.8, display: 'inline-block' }}>
                                  {s.trim()}
                                </Typography>
                              ))}
                              {skills.length > 3 && (
                                <Typography sx={{ fontSize: '0.62rem', fontWeight: 700, color: '#64748B' }}>+{skills.length - 3}</Typography>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', fontFamily: 'monospace' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              {v.aadhaar && <BadgeRoundedIcon sx={{ fontSize: 14, color: '#059669' }} />}
                              {maskAadhaar(v.aadhaar)}
                            </Box>
                          </TableCell>
                          <TableCell>
                            {v.certification_url ? (
                              <Tooltip title="View Certification">
                                <IconButton size="small" onClick={() => window.open(v.certification_url, '_blank')}>
                                  <OpenInNewRoundedIcon sx={{ fontSize: 16, color: BLUE }} />
                                </IconButton>
                              </Tooltip>
                            ) : <Typography sx={{ fontSize: '0.7rem', color: '#CBD5E1' }}>—</Typography>}
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.72rem', fontWeight: 600, color: '#64748B' }}>
                            {new Date(v.created_at || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{
                              display: 'inline-flex', alignItems: 'center', gap: 0.4,
                              px: 1.2, py: 0.4, borderRadius: 10,
                              bgcolor: sc.bg, border: `1px solid ${sc.border}`,
                            }}>
                              <Typography sx={{ fontSize: '0.65rem', fontWeight: 800, color: sc.color }}>
                                {sc.label.toUpperCase()}
                              </Typography>
                            </Box>
                          </TableCell>
                          {isAdmin && (
                            <TableCell align="center">
                              <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                                {vStatus !== 'approved' && (
                                  <Tooltip title="Approve">
                                    <IconButton
                                      size="small"
                                      disabled={actionLoading === v.id}
                                      onClick={() => handleStatusUpdate(v.id, 'approved')}
                                      sx={{ color: '#059669', bgcolor: '#D1FAE5', '&:hover': { bgcolor: '#A7F3D0' }, borderRadius: 1.5, p: 0.6 }}
                                    >
                                      {actionLoading === v.id ? <CircularProgress size={14} /> : <CheckCircleRoundedIcon sx={{ fontSize: 16 }} />}
                                    </IconButton>
                                  </Tooltip>
                                )}
                                {vStatus !== 'rejected' && (
                                  <Tooltip title="Reject">
                                    <IconButton
                                      size="small"
                                      disabled={actionLoading === v.id}
                                      onClick={() => handleStatusUpdate(v.id, 'rejected')}
                                      sx={{ color: '#DC2626', bgcolor: '#FEE2E2', '&:hover': { bgcolor: '#FECACA' }, borderRadius: 1.5, p: 0.6 }}
                                    >
                                      <CancelRoundedIcon sx={{ fontSize: 16 }} />
                                    </IconButton>
                                  </Tooltip>
                                )}
                              </Box>
                            </TableCell>
                          )}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
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
