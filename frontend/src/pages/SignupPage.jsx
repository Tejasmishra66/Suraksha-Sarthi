import React from 'react';
import { Box, Container, Typography, Button, TextField, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';

export default function SignupPage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <TopNavBar />
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Box sx={{ p: 4, borderRadius: 4, boxShadow: '0 18px 30px rgba(15,23,42,0.08)', backgroundColor: '#fff' }}>
          <Typography variant="h5" fontWeight={800} sx={{ mb: 3, textAlign: 'center' }}>
            Sign Up
          </Typography>
          <Stack spacing={2}>
            <TextField fullWidth label="Full Name" />
            <TextField fullWidth label="Email Address" type="email" />
            <TextField fullWidth label="Password" type="password" />
            <TextField fullWidth label="Confirm Password" type="password" />
            <Button variant="contained" color="success" fullWidth size="large" sx={{ mt: 3 }}>
              Create Account
            </Button>
            <Typography variant="body2" sx={{ textAlign: 'center', mt: 2 }}>
              Already have an account?{' '}
              <Button 
                variant="text" 
                color="success" 
                onClick={() => navigate('/login')} 
                sx={{ textTransform: 'none' }}
              >
                Login
              </Button>
            </Typography>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}