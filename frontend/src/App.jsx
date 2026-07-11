import React, { Suspense, lazy } from 'react';
import { Navigate, Routes, Route, NavLink, useNavigate, Link as RouterLink } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppBar, Toolbar, Typography, Box, Container, Grid, Link, Button, IconButton, Menu, MenuItem, ListItemIcon, Avatar, Divider, Stack, CircularProgress } from '@mui/material';

// Lazy load pages for fast rendering on weak networks
const Homepage = lazy(() => import('./pages/Homepage'));
const EmergencyPage = lazy(() => import('./pages/EmergencyPage'));
const VolunteerPage = lazy(() => import('./pages/VolunteerPage'));
const IncidentMapPage = lazy(() => import('./pages/IncidentMapPage'));
const EquipmentPage = lazy(() => import('./pages/EquipmentPage'));
const UpdatesPage = lazy(() => import('./pages/UpdatesPage'));
const FieldReportPage = lazy(() => import('./pages/FieldReportPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const WeatherPage = lazy(() => import('./pages/WeatherPage'));
const TaskBoardPage = lazy(() => import('./pages/TaskBoardPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
import { getStoredToken, flushQueue } from './api/client';
import { useAuth } from './context/AuthContext';
import { getQueue } from './utils/offlineQueue';
import OfflineIndicator from './components/OfflineIndicator';

// Import icons for Header and Footer
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
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import CallRoundedIcon from '@mui/icons-material/CallRounded';

import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import XIcon from '@mui/icons-material/X';

import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';

// Global theme matching the new mockup
const theme = createTheme({
  palette: {
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
    primary: {
      main: '#0f4a30', // Mockup's very dark green
      dark: '#0a3622',
      light: '#175e3c',
    },
    secondary: {
      main: '#d32f2f', // Red for emergency
      dark: '#b71c1c',
      light: '#f44336',
    },
    text: {
      primary: '#1a202c',
      secondary: '#4a5568',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Arial", sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
    h1: { fontSize: '3.5rem', fontWeight: 800, color: '#1a202c' },
    h2: { fontSize: '2.5rem', fontWeight: 800, color: '#1a202c' },
    h3: { fontSize: '2rem', fontWeight: 700 },
    h4: { fontSize: '1.5rem', fontWeight: 700 },
    h5: { fontSize: '1.25rem', fontWeight: 700 },
    h6: { fontSize: '1.1rem', fontWeight: 600 },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '8px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }
        },
      },
    },
  },
});

function ProtectedRoute({ children, allowedRoles }) {
  const token = getStoredToken();
  const { user } = useAuth();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
}

// Custom SVG Logo matching the mockup
const LogoIcon = ({ color = "#0f4a30" }) => (
  <svg width="42" height="42" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M58 85 L78 35 L95 85 Z" fill={color}/>
    <path d="M30 85 L58 15 L82 85 Z" fill={color}/>
    <path d="M5 85 L30 30 L55 85 Z" fill={color}/>
    <path d="M15 65 L32 45 L36 50 L19 70 Z" fill={color === '#0f4a30' ? 'white' : '#0f4a30'}/>
    <path d="M22 80 L39 60 L43 65 L26 85 Z" fill={color === '#0f4a30' ? 'white' : '#0f4a30'}/>
  </svg>
);

// New Header Component matching Mockup (Icons above text, arrows, Contact Us)
function Header() {
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

// New Footer matching Mockup
function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: '#0f4a30', color: '#e2e8f0', pt: 8, pb: 4, mt: 'auto' }}>
      <Container maxWidth="xl">
        <Grid container spacing={6} mb={6}>
          {/* Column 1: Logo & Info */}
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <LogoIcon color="#ffffff" />
              <Box>
                <Typography variant="h6" sx={{ color: '#fff', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.5px', fontSize: '1.4rem' }}>
                  SDRF
                </Typography>
                <Typography variant="caption" sx={{ color: '#fff', fontWeight: 900, letterSpacing: 0.5, display: 'block', mt: -0.5 }}>
                  HELPING HANDS
                </Typography>
                <Typography variant="caption" display="block" sx={{ color: '#94a3b8', fontSize: '0.65rem', marginTop: '-2px', fontWeight: 700 }}>
                  HIMACHAL PRADESH
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" sx={{ mb: 3, lineHeight: 1.6, color: '#e2e8f0', pr: 2 }}>
              Committed to saving lives and protecting communities across Himachal Pradesh.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <IconButton size="small" sx={{ color: '#fff', border: '1px solid rgba(255,255,255,0.2)', bgcolor: 'rgba(255,255,255,0.05)', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}><FacebookIcon fontSize="small" /></IconButton>
              <IconButton size="small" sx={{ color: '#fff', border: '1px solid rgba(255,255,255,0.2)', bgcolor: 'rgba(255,255,255,0.05)', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}><XIcon fontSize="small" /></IconButton>
              <IconButton size="small" sx={{ color: '#fff', border: '1px solid rgba(255,255,255,0.2)', bgcolor: 'rgba(255,255,255,0.05)', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}><InstagramIcon fontSize="small" /></IconButton>
              <IconButton size="small" sx={{ color: '#fff', border: '1px solid rgba(255,255,255,0.2)', bgcolor: 'rgba(255,255,255,0.05)', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}><YouTubeIcon fontSize="small" /></IconButton>
            </Box>
          </Grid>

          {/* Column 2: Quick Links */}
          <Grid item xs={12} sm={4} md={2}>
            <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 700, mb: 3 }}>
              Quick Links
            </Typography>
            <Stack spacing={2}>
              <Link component={RouterLink} to="/about" color="inherit" underline="none" sx={{ transition: 'color 0.2s', '&:hover': { color: '#fff' } }}>About Us</Link>
              <Link href="https://hpsdma.nic.in/Home/Index?page=Vision%20and%20Mission" target="_blank" rel="noopener noreferrer" color="inherit" underline="none" sx={{ transition: 'color 0.2s', '&:hover': { color: '#fff' } }}>Our Mission</Link>
              <Link href="https://hpsdma.nic.in/Home/Index?page=Publications" target="_blank" rel="noopener noreferrer" color="inherit" underline="none" sx={{ transition: 'color 0.2s', '&:hover': { color: '#fff' } }}>Resources</Link>
              <Link href="https://hpsdma.nic.in/Home/Index?page=Guidelines" target="_blank" rel="noopener noreferrer" color="inherit" underline="none" sx={{ transition: 'color 0.2s', '&:hover': { color: '#fff' } }}>Training & Guides</Link>
              <Link href="https://ndma.gov.in/Reference_Material/FAQ" target="_blank" rel="noopener noreferrer" color="inherit" underline="none" sx={{ transition: 'color 0.2s', '&:hover': { color: '#fff' } }}>FAQs</Link>
            </Stack>
          </Grid>

          {/* Column 3: Important Links */}
          <Grid item xs={12} sm={4} md={3}>
            <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 700, mb: 3 }}>
              Important Links
            </Typography>
            <Stack spacing={2}>
              <Link href="https://himachal.nic.in/" target="_blank" rel="noopener noreferrer" color="inherit" underline="none" sx={{ transition: 'color 0.2s', '&:hover': { color: '#fff' } }}>Government of Himachal</Link>
              <Link href="https://hpsdma.nic.in/" target="_blank" rel="noopener noreferrer" color="inherit" underline="none" sx={{ transition: 'color 0.2s', '&:hover': { color: '#fff' } }}>Disaster Management Department</Link>
              <Link href="https://mausam.imd.gov.in/shimla/" target="_blank" rel="noopener noreferrer" color="inherit" underline="none" sx={{ transition: 'color 0.2s', '&:hover': { color: '#fff' } }}>IMD Weather Updates</Link>
              <Link href="https://ndma.gov.in/" target="_blank" rel="noopener noreferrer" color="inherit" underline="none" sx={{ transition: 'color 0.2s', '&:hover': { color: '#fff' } }}>NDMA India</Link>
            </Stack>
          </Grid>

          {/* Column 4: 24x7 Helpline */}
          <Grid item xs={12} sm={4} md={4}>
            <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 700, mb: 3 }}>
              24x7 Helpline
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box sx={{ 
                width: 48, 
                height: 48, 
                borderRadius: '50%', 
                border: '1px solid rgba(255,255,255,0.3)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <CallRoundedIcon sx={{ color: '#fff' }} />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight={800} color="#fff">1070</Typography>
                <Typography variant="caption" color="#cbd5e1">State Emergency Operation Centre</Typography>
              </Box>
            </Box>
            <Button 
              variant="outlined" 
              fullWidth
              startIcon={<EmailOutlinedIcon />}
              sx={{ 
                color: '#fff', 
                borderColor: 'rgba(255,255,255,0.3)',
                borderRadius: '6px',
                py: 1,
                '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.05)' }
              }}
            >
              Email Us
            </Button>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 3 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="caption" color="#94a3b8">
              &copy; {new Date().getFullYear()} SDRF Helping Hands. All rights reserved.
            </Typography>
            <Box sx={{ display: 'flex', gap: 3 }}>
                <Link href="#" color="#94a3b8" underline="none" variant="caption" sx={{ transition: 'color 0.2s', '&:hover': { color: '#fff' } }}>Privacy Policy</Link>
                <Link href="#" color="#94a3b8" underline="none" variant="caption" sx={{ transition: 'color 0.2s', '&:hover': { color: '#fff' } }}>Terms of Use</Link>
            </Box>
        </Box>
      </Container>
    </Box>
  );
}


export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <OfflineIndicator />
        <Header />
        <Box component="main" id="main-content" sx={{ flexGrow: 1 }}>
          <Suspense fallback={
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 2 }}>
              <CircularProgress sx={{ color: '#0f4a30' }} size={48} thickness={4} />
              <Typography variant="caption" color="text.secondary" fontWeight={600}>Loading module for slow networks...</Typography>
            </Box>
          }>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/home" element={<Homepage />} />
              <Route path="/emergency" element={<ProtectedRoute><EmergencyPage /></ProtectedRoute>} />
              <Route path="/volunteer" element={<ProtectedRoute><VolunteerPage /></ProtectedRoute>} />
              <Route path="/reports" element={<ProtectedRoute allowedRoles={['admin', 'department']}><FieldReportPage /></ProtectedRoute>} />
              <Route path="/map" element={<ProtectedRoute><IncidentMapPage /></ProtectedRoute>} />
              <Route path="/equipment" element={<ProtectedRoute allowedRoles={['admin', 'department']}><EquipmentPage /></ProtectedRoute>} />
              <Route path="/updates" element={<ProtectedRoute allowedRoles={['admin', 'department']}><UpdatesPage /></ProtectedRoute>} />
              <Route path="/weather" element={<ProtectedRoute><WeatherPage /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminPage /></ProtectedRoute>} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}
