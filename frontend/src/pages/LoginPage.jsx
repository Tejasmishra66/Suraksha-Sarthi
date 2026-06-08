import React, { useState } from 'react';
import { Box, Container, Typography, Button, TextField, Stack, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import { login, setAuthToken } from '../api/client';

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
      const response = await login(formData);
      if (response && response.token) {
        setAuthToken(response.token);
      }
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
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #064e3b 0%, #022c22 100%)', // Deep Forest Green Gradient
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

          {errorMsg && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2, fontWeight: 'bold' }}>
              {errorMsg}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField 
                fullWidth 
                label="Email Address" 
                name="email"
                type="email" 
                value={formData.email}
                onChange={handleChange}
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
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
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
              <Button type="submit" disabled={isLoading} variant="contained" color="success" fullWidth size="large" sx={{ mt: 3, fontWeight: 800, py: 1.5, fontSize: '1.1rem' }}>
                {isLoading ? <CircularProgress size={26} color="inherit" /> : 'Login'}
              </Button>
              <Typography variant="body1" fontWeight={600} sx={{ textAlign: 'center', mt: 2, color: '#ffffff' }}>
                Don't have an account?{' '}
                <Button 
                  variant="text" 
                  color="success" 
                  onClick={() => navigate('/signup')} 
                  sx={{ textTransform: 'none', fontWeight: 800, fontSize: '1rem', color: '#4ade80' }}
                >
                  Sign Up
                </Button>
              </Typography>
            </Stack>
          </form>
        </Box>
      </Container>
    </Box>
  );
}