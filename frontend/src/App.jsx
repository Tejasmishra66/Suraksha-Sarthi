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
const EmergencyPageOld = lazy(() => import('./pages/Homepage'));
const EmergencyPage = lazy(() => import('./pages/EmergencyPage'));
const VolunteerPage = lazy(() => import('./pages/VolunteerPage'));
const IncidentMapPage = lazy(() => import('./pages/IncidentMapPage'));
const UpdatesPage = lazy(() => import('./pages/UpdatesPage'));
const EquipmentPage = lazy(() => import('./pages/EquipmentPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const SecurityLogsPage = lazy(() => import('./pages/SecurityLogsPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const VolunteerRegistrationPage = lazy(() => import('./pages/VolunteerRegistrationPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const DisasterGuidesPage = lazy(() => import('./pages/DisasterGuidesPage'));
const EmergencyContactsPage = lazy(() => import('./pages/EmergencyContactsPage'));
const HpsdmaIncidentsPage = lazy(() => import('./pages/HpsdmaIncidentsPage'));

import OfflineIndicator from './components/OfflineIndicator';
import { useAuth, AuthProvider } from './context/AuthContext';

// Import newly extracted components and theme
import theme from './theme';
import Header from './components/Header';
import Footer from './components/Footer';

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
                  <Route path="/emergency" element={<PageWrapper><EmergencyPage /></PageWrapper>} />
                  <Route path="/map" element={<PageWrapper><IncidentMapPage /></PageWrapper>} />
                  <Route path="/guides" element={<PageWrapper><DisasterGuidesPage /></PageWrapper>} />
                  <Route path="/contacts" element={<PageWrapper><EmergencyContactsPage /></PageWrapper>} />
                  <Route path="/incidents" element={<PageWrapper><HpsdmaIncidentsPage /></PageWrapper>} />
                  <Route path="/updates" element={
                    <ProtectedRoute>
                      <PageWrapper><UpdatesPage /></PageWrapper>
                    </ProtectedRoute>
                  } />
                  <Route path="/about" element={
                    <ProtectedRoute>
                      <PageWrapper><AboutPage /></PageWrapper>
                    </ProtectedRoute>
                  } />
                  <Route path="/volunteer" element={
                    <ProtectedRoute>
                      <PageWrapper><VolunteerPage /></PageWrapper>
                    </ProtectedRoute>
                  } />
                  <Route path="/login" element={<PageWrapper><LoginPage /></PageWrapper>} />
                  <Route path="/signup" element={<PageWrapper><SignupPage /></PageWrapper>} />
                  <Route path="/join-volunteer" element={
                    <ProtectedRoute>
                      <PageWrapper><VolunteerRegistrationPage /></PageWrapper>
                    </ProtectedRoute>
                  } />
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <PageWrapper><DashboardPage /></PageWrapper>
                    </ProtectedRoute>
                  } />
                  <Route path="/equipment" element={
                    <ProtectedRoute allowedRoles={['admin', 'agency_head']}>
                      <PageWrapper><EquipmentPage /></PageWrapper>
                    </ProtectedRoute>
                  } />
                  <Route path="/security-logs" element={
                    <ProtectedRoute allowedRoles={['admin', 'agency_head']}>
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
