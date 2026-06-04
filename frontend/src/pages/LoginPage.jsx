import React from 'react';
import { Box, Container, Typography, Button, TextField, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';

export default function LoginPage() {
  const navigate = useNavigate();

  return (
<<<<<<< HEAD
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <TopNavBar />
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Box sx={{ p: 4, borderRadius: 4, boxShadow: '0 18px 30px rgba(15,23,42,0.08)', backgroundColor: '#fff' }}>
          <Typography variant="h5" fontWeight={800} sx={{ mb: 3, textAlign: 'center' }}>
            Login
          </Typography>
          <Stack spacing={2}>
            <TextField fullWidth label="Email Address" type="email" />
            <TextField fullWidth label="Password" type="password" />
            <Button variant="contained" color="success" fullWidth size="large" sx={{ mt: 3 }}>
              Login
            </Button>
            <Typography variant="body2" sx={{ textAlign: 'center', mt: 2 }}>
=======
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url('/assets/img1.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
    }}>
      <TopNavBar />
      <Container maxWidth="sm" sx={{ py: 10 }}>
        <Box sx={{ 
          p: 5, 
          borderRadius: 4, 
          boxShadow: '0 24px 50px rgba(0,0,0,0.5)', 
          backgroundColor: 'transparent', 
          backdropFilter: 'blur(2px)',
          border: '1px solid rgba(255, 255, 255, 0.3)'
        }}>
          <Typography variant="h5" fontWeight={900} sx={{ mb: 3, textAlign: 'center', color: '#ffffff' }}>
            Login
          </Typography>
          <Stack spacing={3}>
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
            <Button variant="contained" color="success" fullWidth size="large" sx={{ mt: 3, fontWeight: 800, py: 1.5, fontSize: '1.1rem' }}>
              Login
            </Button>
            <Typography variant="body1" fontWeight={600} sx={{ textAlign: 'center', mt: 2, color: '#ffffff' }}>
>>>>>>> e989cfe2bcc18f846014f035bd635e8ed83f5fc8
              Don't have an account?{' '}
              <Button 
                variant="text" 
                color="success" 
                onClick={() => navigate('/signup')} 
<<<<<<< HEAD
                sx={{ textTransform: 'none' }}
=======
                sx={{ textTransform: 'none', fontWeight: 800, fontSize: '1rem', color: '#4ade80' }}
>>>>>>> e989cfe2bcc18f846014f035bd635e8ed83f5fc8
              >
                Sign Up
              </Button>
            </Typography>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}