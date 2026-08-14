import React, { useState, useEffect } from 'react';
import { Box, Button, IconButton, Typography, Drawer, Stack, Divider, Chip, Popover, List, ListItem, ListItemText, Avatar } from '@mui/material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchIncidents } from '../api/client';

import MenuRoundedIcon          from '@mui/icons-material/MenuRounded';
import CloseRoundedIcon         from '@mui/icons-material/CloseRounded';
import DashboardRoundedIcon     from '@mui/icons-material/DashboardRounded';
import ShieldRoundedIcon        from '@mui/icons-material/ShieldRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import WarningAmberRoundedIcon  from '@mui/icons-material/WarningAmberRounded';
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded';
import GroupsRoundedIcon        from '@mui/icons-material/GroupsRounded';
import MapRoundedIcon           from '@mui/icons-material/MapRounded';
import CampaignRoundedIcon      from '@mui/icons-material/CampaignRounded';
import HomeRoundedIcon          from '@mui/icons-material/HomeRounded';
import LockRoundedIcon          from '@mui/icons-material/LockRounded';
import LogoutRoundedIcon        from '@mui/icons-material/LogoutRounded';
import ErrorRoundedIcon         from '@mui/icons-material/ErrorRounded';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import AssignmentRoundedIcon    from '@mui/icons-material/AssignmentRounded';
import BusinessRoundedIcon      from '@mui/icons-material/BusinessRounded';
import InfoRoundedIcon          from '@mui/icons-material/InfoRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import CameraAltRoundedIcon     from '@mui/icons-material/CameraAltRounded';
import Badge from '@mui/material/Badge';

// ── Design Tokens ─────────────────────────────────────────────────
const NAVY   = '#0F172A';
const BLUE   = '#2563EB';
const ORANGE = '#EA580C';
const RED    = '#DC2626';
const BG     = '#FFFFFF';

export default function Header() {
  const { user, signOut } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [incidents, setIncidents] = useState([]);
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll);
    
    // Fetch recent incidents for notifications only if logged in
    if (user) {
      fetchIncidents().then(data => {
        const active = (data || []).filter(inc => inc.status !== 'resolved').slice(0, 5);
        setIncidents(active);
      }).catch(err => console.error("Failed to load incidents for notifications", err));
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, [user]);

  const handleOpenNotifs = (e) => setNotifAnchorEl(e.currentTarget);
  const handleCloseNotifs = () => setNotifAnchorEl(null);
  const handleClearNotifs = () => {
    setIncidents([]);
    setNotifAnchorEl(null);
  };

  const isOfficial = user?.role === 'admin' || user?.role === 'agency_head' || user?.role === 'officer' || user?.role === 'sdrf_team';
  const displayRole = user?.name ? user.name.toUpperCase() : (isOfficial ? user.role.replace('_', ' ').toUpperCase() : 'CITIZEN');

  const navItems = [
    { path: '/',               label: 'Home',            icon: <HomeRoundedIcon sx={{ fontSize: 18 }} /> },
    { path: '/map',            label: 'Live Map',        icon: <MapRoundedIcon sx={{ fontSize: 18 }} /> },
    { path: '/emergency',      label: 'Report Incident', icon: <AssignmentRoundedIcon sx={{ fontSize: 18 }} /> },
    { path: '/updates',        label: 'Alerts',          icon: <CampaignRoundedIcon sx={{ fontSize: 18 }} /> },
    { path: '/volunteer',      label: 'Volunteers',      icon: <GroupsRoundedIcon sx={{ fontSize: 18 }} /> },
    { path: '/media',          label: 'Media',           icon: <CameraAltRoundedIcon sx={{ fontSize: 18 }} /> },
  ];

  if (isOfficial) {
    navItems.push({ path: '/equipment',    label: 'Resources',       icon: <DirectionsCarRoundedIcon sx={{ fontSize: 18 }} />, dropdown: true });
    navItems.push({ path: '/dashboard',    label: 'Dashboard',       icon: <DashboardRoundedIcon sx={{ fontSize: 18 }} /> });
  }

  navItems.push({ path: '/about',          label: 'About Us',        icon: <InfoRoundedIcon sx={{ fontSize: 18 }} /> });

  const isActive = (path) => path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const handleLogout = () => {
    signOut();
    navigate('/');
    setDrawerOpen(false);
  };

  return (
    <>
      {/* MAIN NAVBAR */}
      <Box
        component="header"
        sx={{
          position: 'sticky', top: 0, zIndex: 1200,
          height: 66,
          display: 'flex', alignItems: 'center', px: { xs: 2, md: 5 },
          justifyContent: 'space-between',
          bgcolor: scrolled ? 'rgba(244,246,251,0.95)' : BG,
          backdropFilter: 'blur(20px)',
          borderBottom: scrolled ? '1px solid rgba(11,26,62,0.10)' : '1px solid rgba(11,26,62,0.07)',
          boxShadow: scrolled ? '0 4px 20px rgba(11,26,62,0.07)' : 'none',
          transition: 'all 0.25s ease',
        }}
      >
        {/* LOGO */}
        <Box component={RouterLink} to="/" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, textDecoration: 'none', flexShrink: 0, transition: 'opacity 0.2s', '&:hover': { opacity: 0.85 } }}>
          
          {/* Circular Logo Box */}
          <Box sx={{ 
            width: 48, height: 48, borderRadius: '50%', overflow: 'hidden',
            background: 'linear-gradient(135deg, #1D4ED8 0%, #EA580C 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(29,78,216,0.25)', position: 'relative'
          }}>
            {/* Fallback Icon (shows if image fails to load) */}
            <ShieldRoundedIcon sx={{ color: '#fff', fontSize: 26, position: 'absolute' }} />
            
            <Box
              component="img"
              src="/sdrf-logo.png"
              alt="SDRF Logo"
              sx={{ width: '100%', height: '100%', objectFit: 'cover', position: 'relative', zIndex: 1 }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography sx={{
              fontFamily: '"Outfit", sans-serif', fontWeight: 900,
              background: `linear-gradient(135deg, ${NAVY} 0%, #1D4ED8 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '1.4rem', lineHeight: 1.1, letterSpacing: '-0.02em',
              textTransform: 'uppercase'
            }}>
              Suraksha Sarthi
            </Typography>
            <Typography sx={{
              fontFamily: '"Inter", sans-serif', color: '#64748B',
              fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.03em'
            }}>
              Respond Together, Save Lives
            </Typography>
          </Box>
        </Box>

        {/* DESKTOP NAV */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
          {navItems.map((n) => (
            <Box
              key={n.path}
              component={RouterLink}
              to={n.path}
              sx={{
                px: 2, py: 1, textDecoration: 'none',
                color: isActive(n.path) ? '#FFF' : NAVY,
                bgcolor: isActive(n.path) ? BLUE : 'transparent',
                borderRadius: '20px',
                fontFamily: '"Outfit", sans-serif', fontWeight: 600, fontSize: '0.88rem',
                display: 'flex', alignItems: 'center', gap: 0.5,
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
                '&:hover': { 
                  color: isActive(n.path) ? '#FFF' : BLUE,
                  bgcolor: isActive(n.path) ? '#1E40AF' : 'rgba(37,99,235,0.05)'
                },
              }}
            >
              {n.icon}
              {n.label}
              {n.dropdown && <KeyboardArrowDownRoundedIcon sx={{ fontSize: 16, ml: -0.5 }} />}
            </Box>
          ))}
        </Box>

        {/* DESKTOP ACTIONS */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1.5 }}>
          {user ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>

              <Avatar
                component={RouterLink}
                to="/profile"
                src={user?.profilePic || user?.avatar}
                alt={user?.name}
                sx={{
                  width: 34, height: 34,
                  bgcolor: isOfficial ? '#FFF7ED' : '#EFF6FF',
                  color: isOfficial ? ORANGE : BLUE,
                  fontFamily: '"Outfit", sans-serif',
                  fontWeight: 800, fontSize: '1rem',
                  border: `2px solid ${isOfficial ? '#FED7AA' : '#BFDBFE'}`,
                  cursor: 'pointer', textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: isOfficial ? '#FFEDD5' : '#DBEAFE',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
                    borderColor: isOfficial ? ORANGE : BLUE
                  }
                }}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </Avatar>

              <IconButton
                size="small"
                onClick={handleLogout}
                title="Logout"
                sx={{
                  color: '#94A3B8',
                  border: '1.5px solid rgba(15,23,42,0.1)',
                  borderRadius: '9px', p: 0.75, bgcolor: '#fff',
                  '&:hover': { color: RED, borderColor: '#FCA5A5', bgcolor: '#FEF2F2' },
                }}
              >
                <LogoutRoundedIcon sx={{ fontSize: 17 }} />
              </IconButton>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>

              <Button
                component={RouterLink} to="/login"
                startIcon={<AccountCircleRoundedIcon sx={{ fontSize: '1rem !important' }} />}
                sx={{
                  color: '#fff',
                  bgcolor: BLUE,
                  fontFamily: '"Outfit", sans-serif', fontWeight: 700, fontSize: '0.87rem',
                  borderRadius: '10px', px: 2.5, py: 0.9, textTransform: 'none',
                  '&:hover': { bgcolor: '#1D4ED8', transform: 'translateY(-1px)' },
                  transition: 'all 0.18s',
                }}
              >
                Login / Sign Up
              </Button>
            </Box>
          )}
        </Box>

        {/* MOBILE TOGGLE */}
        <IconButton
          sx={{
            display: { xs: 'flex', md: 'none' },
            color: NAVY, border: '1.5px solid rgba(11,26,62,0.12)',
            borderRadius: '10px', p: 0.75, bgcolor: '#fff',
          }}
          onClick={() => setDrawerOpen(true)}
        >
          <MenuRoundedIcon />
        </IconButton>
      </Box>

      {/* MOBILE DRAWER — light */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: '100%', maxWidth: 300,
            bgcolor: '#fff', p: 3, border: 'none',
            boxShadow: '-8px 0 40px rgba(11,26,62,0.12)',
          }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 32, height: 32, borderRadius: '8px', background: 'linear-gradient(135deg, #1D4ED8, #EA580C)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldRoundedIcon sx={{ color: '#fff', fontSize: 18 }} />
            </Box>
            <Typography sx={{ fontFamily: '"Outfit", sans-serif', color: NAVY, fontWeight: 800, fontSize: '0.95rem' }}>
              Suraksha Sarthi
            </Typography>
          </Box>
          <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: '#94A3B8', border: '1px solid #E2E8F0', borderRadius: '8px', p: 0.5 }}>
            <CloseRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>

        <Stack spacing={0.5} sx={{ mb: 4 }}>
          {navItems.map((n) => (
            <Button
              key={n.path}
              component={RouterLink}
              to={n.path}
              onClick={() => setDrawerOpen(false)}
              startIcon={n.icon}
              sx={{
                justifyContent: 'flex-start', px: 2, py: 1.4, borderRadius: '10px', textTransform: 'none',
                color: isActive(n.path) ? BLUE : '#475569',
                bgcolor: isActive(n.path) ? '#EFF6FF' : 'transparent',
                fontFamily: '"Outfit", sans-serif', fontWeight: 700, fontSize: '0.92rem',
                '&:hover': { bgcolor: '#F8FAFC', color: NAVY },
              }}
            >
              {n.label}
            </Button>
          ))}
        </Stack>

        <Divider sx={{ mb: 3 }} />

        <Button
          component={RouterLink} to="/emergency" fullWidth
          onClick={() => setDrawerOpen(false)}
          startIcon={<ErrorRoundedIcon />}
          sx={{
            mb: 2, py: 1.4, bgcolor: '#FEF2F2', color: RED,
            border: `1.5px solid #FECACA`,
            borderRadius: '10px', fontFamily: '"Outfit", sans-serif', fontWeight: 700, textTransform: 'none',
            '&:hover': { bgcolor: '#FEE2E2', borderColor: RED },
          }}
        >
          Report Emergency SOS
        </Button>

        <Stack spacing={1.5}>
          {user ? (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 0.5, mb: 0.5 }}>
                <AccountCircleRoundedIcon sx={{ color: '#94A3B8', fontSize: 18 }} />
                <Typography sx={{ color: '#64748B', fontSize: '0.78rem', fontWeight: 600 }}>
                  Logged in as&nbsp;
                  <Box component="span" sx={{ color: isOfficial ? ORANGE : BLUE, fontWeight: 800 }}>
                    {displayRole}
                  </Box>
                </Typography>
              </Box>

              <Button
                fullWidth onClick={handleLogout}
                startIcon={<LogoutRoundedIcon />}
                sx={{
                  py: 1.4, border: `1.5px solid #FECACA`, color: RED, bgcolor: '#FEF2F2',
                  borderRadius: '10px', fontFamily: '"Outfit", sans-serif', fontWeight: 700, textTransform: 'none',
                  '&:hover': { bgcolor: '#FEE2E2', borderColor: RED },
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button
              component={RouterLink} to="/login" fullWidth
              onClick={() => setDrawerOpen(false)}
              startIcon={<AccountCircleRoundedIcon />}
              sx={{
                py: 1.4,
                color: '#fff',
                background: `linear-gradient(135deg, ${BLUE} 0%, #1E3A8A 100%)`,
                borderRadius: '10px', fontFamily: '"Outfit", sans-serif', fontWeight: 700, textTransform: 'none',
                boxShadow: '0 4px 14px rgba(29,78,216,0.25)',
              }}
            >
              Login
            </Button>
          )}
        </Stack>
      </Drawer>

      {/* NOTIFICATIONS POPOVER */}
      <Popover
        open={Boolean(notifAnchorEl)}
        anchorEl={notifAnchorEl}
        onClose={handleCloseNotifs}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ sx: { width: 320, borderRadius: 3, mt: 1, boxShadow: '0 10px 25px rgba(11,26,62,0.1)' } }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0' }}>
          <Typography sx={{ fontWeight: 800, color: NAVY, fontFamily: '"Outfit", sans-serif' }}>Alerts & Incidents</Typography>
          {incidents.length > 0 && (
            <Button size="small" onClick={handleClearNotifs} sx={{ fontSize: '0.7rem', minWidth: 0, fontWeight: 700 }}>Clear All</Button>
          )}
        </Box>
        <List sx={{ p: 0, maxHeight: 300, overflow: 'auto' }}>
          {incidents.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center', color: '#94A3B8' }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>No new notifications</Typography>
            </Box>
          ) : (
            incidents.map((inc, i) => (
              <ListItem key={inc._id || inc.id || i} divider sx={{ alignItems: 'flex-start' }}>
                <ListItemText 
                  primary={inc.title || inc.type || "New Incident Reported"} 
                  secondary={inc.location || "Location pending"}
                  primaryTypographyProps={{ sx: { fontWeight: 700, fontSize: '0.85rem', color: NAVY, mb: 0.5 } }}
                  secondaryTypographyProps={{ sx: { fontSize: '0.75rem', color: '#64748B' } }}
                />
              </ListItem>
            ))
          )}
        </List>
      </Popover>
    </>
  );
}
