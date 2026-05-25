import React from 'react';
import { Box, Button, Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import { Routes, Route, NavLink } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';
import Shell from './components/Shell';
// StatCard removed from dashboard
import LoginPage from './pages/LoginPage';
import TaskBoardPage from './pages/TaskBoardPage';
import IncidentMapPage from './pages/IncidentMapPage';
import VolunteerDashboardPage from './pages/VolunteerDashboardPage';
import { useAuth } from './context/AuthContext';

// Builds the router and top-level landing experience for the web app.
export default function App() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route
          path="/"
          element={
            <Shell title="Operations overview">
              <HomeDashboard userName={user?.name || 'Officer'} />
            </Shell>
          }
        />
        <Route
          path="/tasks"
          element={
            <Shell title="Task board">
              <TaskBoardPage />
            </Shell>
          }
        />
        <Route
          path="/alerts"
          element={
            <Shell title="Incident map">
              <IncidentMapPage />
            </Shell>
          }
        />
        <Route
          path="/volunteers"
          element={
            <Shell title="Volunteer dashboard">
              <VolunteerDashboardPage />
            </Shell>
          }
        />
      </Route>
      {!isAuthenticated && <Route path="*" element={<LoginPage />} />}
    </Routes>
  );
}

// Renders the landing dashboard with quick links and summary cards.
function HomeDashboard({ userName }) {
  return (
    <Stack spacing={3}>
      <Card>
        <CardContent>
          <Typography variant="overline" color="text.secondary">
            Welcome back
          </Typography>
          <Typography variant="h4" fontWeight={800} gutterBottom>
            {userName}
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 700 }}>
            This minimal web console keeps the backend-first disaster workflow visible: tasks, alerts, volunteers, and resources all flow from the existing Express APIs.
          </Typography>
          <Box sx={{ mt: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button component={NavLink} to="/tasks" variant="contained">Open Tasks</Button>
            <Button component={NavLink} to="/alerts" variant="outlined">Open Alerts</Button>
            <Button component={NavLink} to="/volunteers" variant="outlined">Open Volunteers</Button>
          </Box>
        </CardContent>
      </Card>
      {/* Project metadata removed from main dashboard per UX request */}
    </Stack>
  );
}
