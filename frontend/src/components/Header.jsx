import React from 'react';
import { NavLink, useNavigate, Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, Container, Button, IconButton, Menu, MenuItem, ListItemIcon, Divider } from '@mui/material';

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ReportProblemRoundedIcon from '@mui/icons-material/ReportProblemRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';

import { useAuth } from '../context/AuthContext';
import LogoIcon from './LogoIcon';

export default function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleAdminClick = () => { navigate('/admin'); handleClose(); };

  const navItems = [
    { path: '/home', label: 'Home', icon: <HomeRoundedIcon sx={{ fontSize: 24, mb: 0.5 }} />, hasDropdown: false },
    { path: '/emergency', label: 'Emergency', icon: <ReportProblemRoundedIcon sx={{ fontSize: 24, mb: 0.5, color: '#d32f2f' }} />, hasDropdown: true },
    { path: '/volunteer', label: 'Volunteers', icon: <GroupsRoundedIcon sx={{ fontSize: 24, mb: 0.5, color: '#0f4a30' }} />, hasDropdown: true },
    { path: '/reports', label: 'Field Reports', icon: <AssignmentRoundedIcon sx={{ fontSize: 24, mb: 0.5, color: '#3b82f6' }} />, hasDropdown: true, roles: ['admin', 'department'] },
    { path: '/map', label: 'Live Map', icon: <PlaceRoundedIcon sx={{ fontSize: 24, mb: 0.5, color: '#10b981' }} />, hasDropdown: true },
    { path: '/equipment', label: 'Equipment', icon: <Inventory2RoundedIcon sx={{ fontSize: 24, mb: 0.5, color: '#8b5cf6' }} />, hasDropdown: true, roles: ['admin', 'department'] },
    { path: '/updates', label: 'Updates', icon: <CampaignRoundedIcon sx={{ fontSize: 24, mb: 0.5, color: '#f59e0b' }} />, hasDropdown: true, roles: ['admin', 'department'] },
    { path: '/dashboard', label: 'Dashboard', icon: <DashboardRoundedIcon sx={{ fontSize: 24, mb: 0.5, color: '#64748b' }} />, hasDropdown: true, roles: ['admin', 'department'] },
  ];

  return (
    <AppBar 
      position="sticky" 
      elevation={0} 
      sx={{ 
        bgcolor: '#ffffff', 
        borderBottom: '1px solid #f1f5f9',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', height: 75 }}>
          {/* Left: Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, textDecoration: 'none', color: 'inherit' }} component={RouterLink} to="/">
            <LogoIcon color="#0f4a30" />
            <Box>
              <Typography variant="h6" sx={{ color: '#0f4a30', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.5px', fontSize: '1.2rem' }}>
                SDRF
              </Typography>
              <Typography variant="caption" sx={{ color: '#0f4a30', fontWeight: 900, letterSpacing: 0.5, display: 'block', mt: -0.5, fontSize: '0.65rem' }}>
                HELPING HANDS
              </Typography>
              <Typography variant="caption" display="block" sx={{ color: '#94a3b8', fontSize: '0.55rem', marginTop: '-2px', fontWeight: 700 }}>
                HIMACHAL PRADESH
              </Typography>
            </Box>
          </Box>

          {/* Center: Navigation */}
          <Box sx={{ display: { xs: 'none', lg: 'flex' }, gap: 1.5, alignItems: 'center' }}>
            {navItems.filter(item => !item.roles || (user && item.roles.includes(user.role))).map((item) => (
              <Button
                key={item.path}
                component={NavLink}
                to={item.path}
                disableRipple
                sx={{
                  color: '#64748b',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  px: 1,
                  py: 0.5,
                  minWidth: 'auto',
                  borderRadius: 2,
                  transition: 'all 0.2s ease',
                  '&:hover': { bgcolor: '#f8fafc', color: '#0f4a30' },
                  '&.active': { 
                    color: '#0f4a30', 
                    borderBottom: '3px solid #0f4a30',
                    borderRadius: 0,
                    pb: '5px' // adjust padding to account for border
                  }
                }}
              >
                {item.icon}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {item.label}
                  {item.hasDropdown && <KeyboardArrowDownRoundedIcon sx={{ fontSize: 16 }} />}
                </Box>
              </Button>
            ))}
          </Box>

          {/* Right: Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={handleMenu} sx={{ color: '#0f4a30' }}>
              <AccountCircleRoundedIcon fontSize="large" />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              PaperProps={{ elevation: 3, sx: { mt: 1.5, minWidth: 200, borderRadius: 2 } }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              {user ? (
                <>
                  <Box sx={{ px: 2, py: 1.5, bgcolor: '#f8fafc' }}>
                    <Typography variant="subtitle2" fontWeight={700} color="text.primary">{user.name || 'User'}</Typography>
                    <Typography variant="caption" color="text.secondary">{user.email || 'user@example.com'}</Typography>
                  </Box>
                  <Divider />
                  
                  <MenuItem onClick={async () => {
                    handleClose();
                    try {
                      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
                        alert('Push notifications are not supported by your browser.');
                        return;
                      }
                      const { getVapidPublicKey, subscribeToPush } = await import('../api/client');
                      const vapidKeyData = await getVapidPublicKey();
                      
                      const registration = await navigator.serviceWorker.ready;
                      const subscription = await registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: vapidKeyData.publicKey
                      });
                      
                      await subscribeToPush(subscription);
                      alert('Successfully subscribed to push notifications!');
                    } catch (e) {
                      console.error("Failed to subscribe:", e);
                      alert('Failed to subscribe to push notifications.');
                    }
                  }} sx={{ py: 1.5 }}>
                    <ListItemIcon><NotificationsNoneRoundedIcon fontSize="small" sx={{ color: 'primary.main' }} /></ListItemIcon>
                    <Typography fontWeight={500}>Enable Notifications</Typography>
                  </MenuItem>

                  {user.role === 'admin' && (
                    <MenuItem onClick={handleAdminClick} sx={{ py: 1.5 }}>
                      <ListItemIcon><AdminPanelSettingsRoundedIcon fontSize="small" sx={{ color: 'primary.main' }} /></ListItemIcon>
                      <Typography fontWeight={500}>Admin Portal</Typography>
                    </MenuItem>
                  )}
                  <MenuItem onClick={() => { signOut(); handleClose(); }} sx={{ py: 1.5 }}>
                    <ListItemIcon><LogoutRoundedIcon fontSize="small" sx={{ color: 'error.main' }} /></ListItemIcon>
                    <Typography fontWeight={500} color="error.main">Logout</Typography>
                  </MenuItem>
                </>
              ) : (
                <MenuItem onClick={() => { navigate('/login'); handleClose(); }} sx={{ py: 1.5 }}>
                  <ListItemIcon><PersonOutlineRoundedIcon fontSize="small" sx={{ color: 'primary.main' }} /></ListItemIcon>
                  <Typography fontWeight={500} color="primary.main">Login / Register</Typography>
                </MenuItem>
              )}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
