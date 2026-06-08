import React, { useState } from 'react';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Stack,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
} from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ReportRoundedIcon from '@mui/icons-material/ReportRounded';
import VolunteerActivismRoundedIcon from '@mui/icons-material/VolunteerActivismRounded';
import MapRoundedIcon from '@mui/icons-material/MapRounded';
import BuildRoundedIcon from '@mui/icons-material/BuildRounded';
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';
import { useAuth } from '../context/AuthContext';

export default function TopNavBar() {
  const navigate = useNavigate();
  const { isAuthenticated, user, signOut } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => {
    signOut();
    handleMenuClose();
    navigate('/login');
  };

  const navItems = [
    { to: '/home', label: 'Home', icon: <HomeRoundedIcon /> },
    { to: '/emergency', label: 'Emergency', icon: <ReportRoundedIcon /> },
    { to: '/volunteer', label: 'Volunteers', icon: <VolunteerActivismRoundedIcon /> },
    { to: '/map', label: 'Live Map', icon: <MapRoundedIcon /> },
    { to: '/equipment', label: 'Equipment', icon: <BuildRoundedIcon /> },
    { to: '/updates', label: 'Updates', icon: <NotificationsActiveRoundedIcon /> },
  ];

  const palette = {
    primary: '#0b6b57',
    emergency: '#b91c1c',
    volunteer: '#047857',
    map: '#0f766e',
    equipment: '#6d28d9',
    updates: '#c2410c',
    text: '#083827',
    border: 'rgba(11,107,87,0.12)',
  };

  const mountainBg = '/assets/mountain.svg';

  return (
    <AppBar
      position="sticky"
      elevation={1}
      sx={{
        bgcolor: (theme) => 'rgba(255,255,255,0.96)',
        borderBottom: '1px solid #eef2f3',
        backdropFilter: 'blur(6px)',
        zIndex: (theme) => theme.zIndex.appBar,
        backgroundImage: `linear-gradient(rgba(255,255,255,0.96), rgba(255,255,255,0.96)), url(${mountainBg})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'left center',
        backgroundSize: '64px',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar src="/assets/sdrflogo.jpg" alt="SDRF Logo" sx={{ bgcolor: '#0b6b57', width: 48, height: 48 }}>
            SDRF
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={900} sx={{ color: '#083827', lineHeight: 1.2, letterSpacing: 0.5 }}>
              SDRF HELPING HANDS
            </Typography>
            <Typography variant="caption" sx={{ color: '#0b6b57', fontWeight: 700 }}>
              Himachal Pradesh
            </Typography>
          </Box>
        </Stack>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 2, overflowX: 'auto', '&::-webkit-scrollbar': { display: 'none' }, scrollbarWidth: 'none' }}>
          {/* Modern Floating Navigation Pill */}
          <Box sx={{ 
            display: 'flex', 
            gap: 0.5, 
            alignItems: 'center', 
            p: 0.5, 
            borderRadius: 4, 
            bgcolor: 'rgba(255,255,255,0.7)', 
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.9)', 
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
          }}>
            {navItems.map((n) => (
              <Button
                key={n.to}
                component={NavLink}
                to={n.to}
                startIcon={React.cloneElement(n.icon, { sx: { color: palette[n.label.toLowerCase()] || palette.text, transition: 'transform 0.2s' } })}
                variant="text"
                size="small"
                disableRipple
                sx={{
                  textTransform: 'none',
                  color: '#475569',
                  borderRadius: 3,
                  px: { xs: 1.5, md: 2 },
                  py: 0.75,
                  fontWeight: 700,
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  '& .MuiSvgIcon-root': { fontSize: 20 },
                  '&.active': { 
                    bgcolor: 'white', 
                    color: '#0f172a',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    '& .MuiSvgIcon-root': { transform: 'scale(1.15)' }
                  },
                  '&:hover:not(.active)': { 
                    bgcolor: 'rgba(241,245,249,0.8)',
                    color: '#1e293b'
                  },
                }}
              >
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline-block' }, ml: 0.5 }}>{n.label}</Box>
              </Button>
            ))}
          </Box>

          {/* Refined Auth Actions */}
          <Stack direction="row" spacing={1} alignItems="center">
            {isAuthenticated ? (
              <>
                <Button
                  onClick={handleMenuOpen}
                  sx={{
                    textTransform: 'none',
                    color: '#083827',
                    fontWeight: 700,
                    borderRadius: 3,
                    px: 1.5,
                    '&:hover': { bgcolor: 'rgba(11,107,87,0.08)' }
                  }}
                  startIcon={
                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#0b6b57', fontSize: 14 }}>
                      {user?.name?.charAt(0) || 'U'}
                    </Avatar>
                  }
                >
                  {user?.name || 'Profile'}
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  sx={{ mt: 1 }}
                >
                  <MenuItem onClick={() => { handleMenuClose(); navigate('/dashboard'); }} sx={{ fontWeight: 600, color: '#1e293b' }}>Dashboard</MenuItem>
                  <MenuItem onClick={handleLogout} sx={{ fontWeight: 600, color: '#ef4444' }}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button 
                  variant="text"
                  sx={{ 
                    textTransform: 'none', 
                    borderRadius: 3,
                    fontWeight: 700,
                    px: 2,
                    color: '#0b6b57',
                    '&:hover': { bgcolor: 'rgba(11,107,87,0.08)' }
                  }}
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
                <Button 
                  variant="contained"
                  disableElevation
                  sx={{ 
                    textTransform: 'none', 
                    borderRadius: 3,
                    px: 3,
                    py: 0.75,
                    fontWeight: 700,
                    bgcolor: '#10b981',
                    boxShadow: '0 4px 14px rgba(16,185,129,0.3)',
                    '&:hover': { bgcolor: '#059669', boxShadow: '0 6px 20px rgba(16,185,129,0.4)' }
                  }}
                  onClick={() => navigate('/signup')}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Stack>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
