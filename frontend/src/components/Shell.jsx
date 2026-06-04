import React from 'react';
import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import { flushQueue } from '../api/client';
import { getQueue } from '../utils/offlineQueue';

// Wraps dashboard pages with top navigation and sign-out controls.
export default function Shell({ title, children }) {
  const { user, signOut } = useAuth();

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f6f8fb 0%, #eef3f9 100%)' }}>
      <AppBar position="sticky" color="transparent" elevation={0} sx={{ backdropFilter: 'blur(10px)' }}>
        <Toolbar sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h6" fontWeight={800}>
              SDRF Helping Hands
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {title}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Button component={NavLink} to="/dashboard" color="inherit">Home</Button>
            <Button component={NavLink} to="/tasks" color="inherit">Tasks</Button>
            <Button component={NavLink} to="/updates" color="inherit">Updates</Button>
            <Button component={NavLink} to="/intel" color="inherit">Intel</Button>
            <Button component={NavLink} to="/status" color="inherit">Status</Button>
            <Button component={NavLink} to="/alerts" color="inherit">Alerts</Button>
            <Button component={NavLink} to="/volunteers" color="inherit">Volunteers</Button>
            <Typography variant="body2" sx={{ px: 1 }}>
              {user?.name || 'Guest'}
            </Typography>
            <Button variant="outlined" color="primary" onClick={signOut}>
              Logout
            </Button>
            <Button variant="contained" color="secondary" onClick={async () => { const q = getQueue(); if (!q.length) { alert('No queued items'); return; } const res = await flushQueue(); alert('Flushed: ' + JSON.stringify(res)); }}>
              Sync
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Container sx={{ py: 4 }}>{children}</Container>
    </Box>
  );
}
