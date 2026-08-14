import React, { Suspense, lazy } from 'react';
import { Navigate, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, CircularProgress, Typography } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    transition={{ duration: 0.3, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

// Lazy load pages for fast rendering on weak networks
const Homepage = lazy(() => import('./pages/SimpleHomepage'));
const EmergencyPage = lazy(() => import('./pages/EmergencyPage'));
const PublicEmergencyPage = lazy(() => import('./pages/PublicEmergencyPage'));
const VolunteerPage = lazy(() => import('./pages/VolunteerPage'));
const IncidentMapPage = lazy(() => import('./pages/IncidentMapPage'));
const UpdatesPage = lazy(() => import('./pages/UpdatesPage'));
const EquipmentPage = lazy(() => import('./pages/EquipmentPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const SecurityLogsPage = lazy(() => import('./pages/SecurityLogsPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const VolunteerRegistrationPage = lazy(() => import('./pages/VolunteerRegistrationPage'));

const DisasterGuidesPage = lazy(() => import('./pages/DisasterGuidesPage'));
const EmergencyContactsPage = lazy(() => import('./pages/EmergencyContactsPage'));
const MediaPage = lazy(() => import('./pages/MediaPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

import OfflineIndicator from './components/OfflineIndicator';
import { useAuth, AuthProvider } from './context/AuthContext';

import theme from './theme';
import Header from './components/Header';
import Footer from './components/Footer';
import { syncOfflineIncidents } from './utils/offlineSync';

// Protects the responder dashboard
function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default function App() {
  const location = useLocation();

  // Setup background sync for offline incidents
  React.useEffect(() => {
    const handleOnline = () => {
      console.log('Network restored. Attempting to sync offline incidents...');
      syncOfflineIncidents();
    };
    
    window.addEventListener('online', handleOnline);
    // Also try syncing on app load just in case we started online with pending items
    syncOfflineIncidents();
    
    return () => window.removeEventListener('online', handleOnline);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#F4F6FB' }}>
          <OfflineIndicator />
          <Header />
          <Box component="main" id="main-content" sx={{ flexGrow: 1, bgcolor: '#F4F6FB' }}>
            <Suspense fallback={
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 2 }}>
                <CircularProgress sx={{ color: '#0f4a30' }} size={48} thickness={4} />
                <Typography variant="caption" color="text.secondary" fontWeight={600}>Loading module for slow networks...</Typography>
              </Box>
            }>
              <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                  {/* Public Routes */}
                  <Route path="/" element={<PageWrapper><Homepage /></PageWrapper>} />
                  <Route path="/home" element={<PageWrapper><Homepage /></PageWrapper>} />
                  <Route path="/login" element={<PageWrapper><LoginPage /></PageWrapper>} />
                  <Route path="/signup" element={<PageWrapper><SignupPage /></PageWrapper>} />
                  <Route path="/public-emergency" element={<PageWrapper><PublicEmergencyPage /></PageWrapper>} />
                  
                  {/* Citizen & Above Routes */}
                  <Route path="/emergency" element={
                    <ProtectedRoute>
                      <PageWrapper><EmergencyPage /></PageWrapper>
                    </ProtectedRoute>
                  } />
                  <Route path="/map" element={
                    <ProtectedRoute>
                      <PageWrapper><IncidentMapPage /></PageWrapper>
                    </ProtectedRoute>
                  } />
                  <Route path="/guides" element={
                    <ProtectedRoute>
                      <PageWrapper><DisasterGuidesPage /></PageWrapper>
                    </ProtectedRoute>
                  } />
                  <Route path="/contacts" element={
                    <ProtectedRoute>
                      <PageWrapper><EmergencyContactsPage /></PageWrapper>
                    </ProtectedRoute>
                  } />
                  <Route path="/updates" element={
                    <ProtectedRoute>
                      <PageWrapper><UpdatesPage /></PageWrapper>
                    </ProtectedRoute>
                  } />

                  <Route path="/media" element={
                    <ProtectedRoute>
                      <PageWrapper><MediaPage /></PageWrapper>
                    </ProtectedRoute>
                  } />
                  <Route path="/volunteer" element={
                    <ProtectedRoute>
                      <PageWrapper><VolunteerPage /></PageWrapper>
                    </ProtectedRoute>
                  } />
                  <Route path="/join-volunteer" element={
                    <ProtectedRoute>
                      <PageWrapper><VolunteerRegistrationPage /></PageWrapper>
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <PageWrapper><ProfilePage /></PageWrapper>
                    </ProtectedRoute>
                  } />
                  
                  {/* Official/Elevated Routes */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute allowedRoles={['admin', 'agency_head', 'officer', 'sdrf_team']}>
                      <PageWrapper><DashboardPage /></PageWrapper>
                    </ProtectedRoute>
                  } />
                  <Route path="/equipment" element={
                    <ProtectedRoute allowedRoles={['admin', 'agency_head', 'officer', 'sdrf_team']}>
                      <PageWrapper><EquipmentPage /></PageWrapper>
                    </ProtectedRoute>
                  } />
                  <Route path="/security-logs" element={
                    <ProtectedRoute allowedRoles={['admin', 'agency_head', 'officer', 'sdrf_team']}>
                      <PageWrapper><SecurityLogsPage /></PageWrapper>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </AnimatePresence>
            </Suspense>
          </Box>
          <Footer />
        </Box>
      </AuthProvider>
    </ThemeProvider>
  );
}
