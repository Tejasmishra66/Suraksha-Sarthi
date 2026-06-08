import React from 'react';
import { Box, Container, Typography, Button, TextField, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';

export default function SignupPage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ 
      height: '100vh', 
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #064e3b 0%, #022c22 100%)', // Deep Forest Green Gradient
      overflow: 'hidden',
    }}>
      <TopNavBar />
      <Container maxWidth="sm" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', pb: 4 }}>
        <Box sx={{ 
          p: { xs: 3, sm: 4 }, 
          borderRadius: 4, 
          boxShadow: '0 24px 50px rgba(0,0,0,0.5)', 
          backgroundColor: 'transparent', 
          backdropFilter: 'blur(2px)',
          border: '1px solid rgba(255, 255, 255, 0.3)'
        }}>
          <Typography variant="h5" fontWeight={900} sx={{ mb: 2, textAlign: 'center', color: '#ffffff' }}>
            Sign Up
          </Typography>
          <Stack spacing={2}>
            <TextField 
              fullWidth 
              label="Full Name" 
              sx={{ 
                input: { color: '#ffffff', fontWeight: 600 }, 
                label: { color: 'rgba(255,255,255,0.9)', fontWeight: 600 }, 
                '& .MuiOutlinedInput-root': { 
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.6)', borderWidth: 2 }, 
                  '&:hover fieldset': { borderColor: '#ffffff', borderWidth: 2 },
                  '&.Mui-focused fieldset': { borderColor: '#ffffff', borderWidth: 2 }
                } 
              }} 
            />
            <TextField 
              fullWidth 
              label="Email Address" 
              type="email" 
              sx={{ 
                input: { color: '#ffffff', fontWeight: 600 }, 
                label: { color: 'rgba(255,255,255,0.9)', fontWeight: 600 }, 
                '& .MuiOutlinedInput-root': { 
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.6)', borderWidth: 2 }, 
                  '&:hover fieldset': { borderColor: '#ffffff', borderWidth: 2 },
                  '&.Mui-focused fieldset': { borderColor: '#ffffff', borderWidth: 2 }
                } 
              }} 
            />
            <TextField 
              fullWidth 
              label="Password" 
              type="password" 
              sx={{ 
                input: { color: '#ffffff', fontWeight: 600 }, 
                label: { color: 'rgba(255,255,255,0.9)', fontWeight: 600 }, 
                '& .MuiOutlinedInput-root': { 
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.6)', borderWidth: 2 }, 
                  '&:hover fieldset': { borderColor: '#ffffff', borderWidth: 2 },
                  '&.Mui-focused fieldset': { borderColor: '#ffffff', borderWidth: 2 }
                } 
              }} 
            />
            <TextField 
              fullWidth 
              label="Confirm Password" 
              type="password" 
              sx={{ 
                input: { color: '#ffffff', fontWeight: 600 }, 
                label: { color: 'rgba(255,255,255,0.9)', fontWeight: 600 }, 
                '& .MuiOutlinedInput-root': { 
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.6)', borderWidth: 2 }, 
                  '&:hover fieldset': { borderColor: '#ffffff', borderWidth: 2 },
                  '&.Mui-focused fieldset': { borderColor: '#ffffff', borderWidth: 2 }
                } 
              }} 
            />
            <Button variant="contained" color="success" fullWidth size="large" sx={{ mt: 3, fontWeight: 800, py: 1.5, fontSize: '1.1rem' }}>
              Create Account
            </Button>
            <Typography variant="body1" fontWeight={600} sx={{ textAlign: 'center', mt: 2, color: '#ffffff' }}>
              Already have an account?{' '}
              <Button 
                variant="text" 
                color="success" 
                onClick={() => navigate('/login')} 
                sx={{ textTransform: 'none', fontWeight: 800, fontSize: '1rem', color: '#4ade80' }}
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