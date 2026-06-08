import React from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Import only the 7 required pages
import Homepage from './pages/Homepage';
import EmergencyPage from './pages/EmergencyPage';
import VolunteerPage from './pages/VolunteerPage';
import IncidentMapPage from './pages/IncidentMapPage';
import EquipmentPage from './pages/EquipmentPage';
import UpdatesPage from './pages/UpdatesPage';
import SignupPage from './pages/SignupPage'; // Import the new SignupPage
import LoginPage from './pages/LoginPage';     // Import the new LoginPage

// Create a global theme to scale down the text size across the entire website
const theme = createTheme({
  palette: {
    primary: {
      main: '#0b6b57', // Official SDRF Forest Green
      dark: '#083827',
      light: '#10b981',
    },
    secondary: {
      main: '#ea580c', // Alert Saffron/Orange
    },
  },
  typography: {
    fontFamily: '"Inter", "Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 13, // Default is 14. This scales down most text elements automatically.
    h1: { fontSize: '3rem' },
    h2: { fontSize: '2.5rem' },
    h3: { fontSize: '2rem' },
    h4: { fontSize: '1.5rem' },
    h5: { fontSize: '1.25rem' },
    h6: { fontSize: '1.1rem' },
    body1: { fontSize: '0.95rem' },
    body2: { fontSize: '0.85rem' },
  },
});

// Simple, clean routing with only 7 pages
export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        {/* Main 7 Pages */}
        <Route path="/" element={<Homepage />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/emergency" element={<EmergencyPage />} />
        <Route path="/volunteer" element={<VolunteerPage />} />
        <Route path="/map" element={<IncidentMapPage />} />
        <Route path="/equipment" element={<EquipmentPage />} />
        <Route path="/updates" element={<UpdatesPage />} />
        <Route path="/signup" element={<SignupPage />} /> {/* Add route for Signup */}
        <Route path="/login" element={<LoginPage />} />   {/* Add route for Login */}
        
        {/* Fallback - redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ThemeProvider>
  );
}
