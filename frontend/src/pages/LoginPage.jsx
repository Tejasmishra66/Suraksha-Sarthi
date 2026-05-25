import React, { useState } from 'react';
import { Alert, Box, Button, Card, CardContent, Container, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

// Collects credentials and opens the dashboard after JWT login succeeds.
export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn, loading } = useAuth();
  const [form, setForm] = useState({ email: 'officer@sdrf.local', password: 'password123' });
  const [error, setError] = useState('');

  // Updates one login field without touching the other values.
  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  // Submits the login form and redirects into the dashboard shell.
  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    try {
      await signIn(form);
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed');
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: 10 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" fontWeight={800} gutterBottom>
            SDRF Helping Hands
          </Typography>
          <Typography color="text.secondary" gutterBottom>
            Sign in to access the task board, incident pins, and volunteer roster.
          </Typography>
          {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2, mt: 2 }}>
            <TextField label="Email" name="email" value={form.email} onChange={handleChange} fullWidth />
            <TextField label="Password" name="password" type="password" value={form.password} onChange={handleChange} fullWidth />
            <Button type="submit" variant="contained" size="large" disabled={loading}>
              {loading ? 'Signing in...' : 'Login'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
