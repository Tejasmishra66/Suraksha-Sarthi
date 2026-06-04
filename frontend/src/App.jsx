import React from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';

// Import only the 7 required pages
import Homepage from './pages/Homepage';
import EmergencyPage from './pages/EmergencyPage';
import VolunteerPage from './pages/VolunteerPage';
import ReportsPage from './pages/ReportsPage';
import IncidentMapPage from './pages/IncidentMapPage';
import EquipmentPage from './pages/EquipmentPage';
import UpdatesPage from './pages/UpdatesPage';
import SignupPage from './pages/SignupPage'; // Import the new SignupPage
import LoginPage from './pages/LoginPage';     // Import the new LoginPage

// Simple, clean routing with only 7 pages
export default function App() {
  return (
    <Routes>
      {/* Main 7 Pages */}
      <Route path="/" element={<Homepage />} />
      <Route path="/home" element={<Homepage />} />
      <Route path="/emergency" element={<EmergencyPage />} />
      <Route path="/volunteer" element={<VolunteerPage />} />
      <Route path="/reports" element={<ReportsPage />} />
      <Route path="/map" element={<IncidentMapPage />} />
      <Route path="/equipment" element={<EquipmentPage />} />
      <Route path="/updates" element={<UpdatesPage />} />
      <Route path="/signup" element={<SignupPage />} /> {/* Add route for Signup */}
      <Route path="/login" element={<LoginPage />} />   {/* Add route for Login */}
      
      {/* Fallback - redirect unknown routes to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
