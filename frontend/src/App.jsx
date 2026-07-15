import React, { Suspense, lazy } from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, CircularProgress, Typography } from '@mui/material';

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
const AboutPage = lazy(() => import('./pages/AboutPage'));

import { getStoredToken } from './api/client';
import { useAuth } from './context/AuthContext';
import OfflineIndicator from './components/OfflineIndicator';

// Import newly extracted components and theme
import theme from './theme';
import Header from './components/Header';
import Footer from './components/Footer';

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
