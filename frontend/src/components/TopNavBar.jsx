import React from 'react';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ReportRoundedIcon from '@mui/icons-material/ReportRounded';
import VolunteerActivismRoundedIcon from '@mui/icons-material/VolunteerActivismRounded';
import ArticleRoundedIcon from '@mui/icons-material/ArticleRounded';
import MapRoundedIcon from '@mui/icons-material/MapRounded';
import BuildRoundedIcon from '@mui/icons-material/BuildRounded';
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';

export default function TopNavBar() {
  const navigate = useNavigate();

  const navItems = [
    { to: '/home', label: 'Home', icon: <HomeRoundedIcon /> },
    { to: '/emergency', label: 'Emergency', icon: <ReportRoundedIcon /> },
    { to: '/volunteer', label: 'Volunteers', icon: <VolunteerActivismRoundedIcon /> },
    { to: '/reports', label: 'Field Reports', icon: <ArticleRoundedIcon /> },
    { to: '/map', label: 'Live Map', icon: <MapRoundedIcon /> },
    { to: '/equipment', label: 'Equipment', icon: <BuildRoundedIcon /> },
    { to: '/updates', label: 'Updates', icon: <NotificationsActiveRoundedIcon /> },
  ];

  const palette = {
    primary: '#0b6b57',
    emergency: '#b91c1c',
    volunteer: '#047857',
    reports: '#2563eb',
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
          <Avatar src="" sx={{ bgcolor: '#0b6b57', width: 48, height: 48 }}>
            SDRF
          </Avatar>
          <Box>
            <Typography fontWeight={900}>SDRF HELPING HANDS</Typography>
            <Typography variant="caption" color="text.secondary">Himachal Pradesh</Typography>
          </Box>
        </Stack>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', px: 1 }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', p: 0.5, borderRadius: 2, border: '1px solid rgba(6,90,68,0.06)', bgcolor: 'rgba(245,255,250,0.6)', overflowX: 'auto' }}>
            {navItems.map((n) => (
              <Button
                key={n.to}
                component={NavLink}
                to={n.to}
                startIcon={React.cloneElement(n.icon, { sx: { color: palette[n.label.toLowerCase()] || palette.text } })}
                variant="outlined"
                size="small"
                sx={{
                  textTransform: 'none',
                  borderColor: palette.border,
                  color: palette.text,
                  bgcolor: 'transparent',
                  borderRadius: 2,
                  px: 1.5,
                  py: 0.6,
                  fontWeight: 700,
                  '& .MuiSvgIcon-root': { fontSize: 18 },
                  '&.active': { bgcolor: 'rgba(11,107,87,0.06)' },
                  '&:hover': { bgcolor: 'rgba(11,107,87,0.04)' },
                }}
              >
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline-block' }, ml: 0.5 }}>{n.label}</Box>
              </Button>
            ))}

            <Button 
              variant="contained"
              color="success" 
              size="small" 
              sx={{ textTransform: 'none', ml: 1, borderRadius: 2 }}
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </Button>
            <Button 
              variant="outlined"
              color="success"
              size="small" 
              sx={{ textTransform: 'none', ml: 1, borderRadius: 2 }}
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
