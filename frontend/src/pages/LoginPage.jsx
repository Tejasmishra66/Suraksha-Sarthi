import React, { useState } from 'react';
import { Box, Container, Typography, Button, TextField, Stack, Alert, CircularProgress, Paper, Divider } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.email || !formData.password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setIsLoading(true);

    try {
      await signIn(formData);
      navigate('/');
    } catch (err) {
      console.error('Login Error:', err);
      if (err.message === 'Network Error') {
        setErrorMsg('Network Error: Cannot connect to the backend.');
      } else if (err.response && err.response.status === 401) {
        setErrorMsg('Incorrect email or password.');
      } else {
        setErrorMsg(err.response?.data?.message || err.response?.data?.error || 'An error occurred during login.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ 
      py: { xs: 6, md: 10 }, 
      backgroundImage: 'url(/mountain-login.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: 'calc(100vh - 250px)', // Accounts for the global header and footer height
      display: 'flex', 
      alignItems: 'center' 
    }}>
      <Container maxWidth="sm">
        <Paper elevation={0} sx={{ 
          p: { xs: 4, sm: 5 }, 
          borderRadius: 0, 
          border: '1px solid #cccccc', 
          borderTop: '4px solid #003366', 
          bgcolor: '#ffffff',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
        }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <LockRoundedIcon sx={{ fontSize: 48, color: '#003366', mb: 1 }} />
            <Typography variant="h5" fontWeight={700} color="#003366" textTransform="uppercase">
              Authorized Login
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              State Disaster Response Force Portal
            </Typography>
          </Box>

          {errorMsg && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2, fontWeight: 'bold' }}>
              {errorMsg}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField 
                fullWidth 
                size="small"
                label="Registered Email" 
                name="email"
                type="email" 
                value={formData.email}
                onChange={handleChange}
              />
              <TextField 
                fullWidth 
                size="small"
                label="Password" 
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
              />
              <Button type="submit" disabled={isLoading} variant="contained" color="primary" fullWidth size="large" sx={{ mt: 2, fontWeight: 700, borderRadius: 0, textTransform: 'uppercase' }}>
                {isLoading ? <CircularProgress size={26} color="inherit" /> : 'Secure Login'}
              </Button>
            </Stack>
          </form>

          <Divider sx={{ my: 3 }} />
          
          <Box textAlign="center">
             <Typography variant="body2" color="text.secondary">
               Don't have an account?{' '}
               <Button component={Link} to="/signup" variant="text" sx={{ color: '#003366', fontWeight: 'bold', p: 0, minWidth: 'auto', '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' } }}>
                 Sign up as a Volunteer/Citizen
               </Button>
             </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}