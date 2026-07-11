import React, { useState } from 'react';
import { Box, Container, Typography, Button, TextField, Stack, Alert, CircularProgress, Paper, Divider } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import PersonAddAlt1RoundedIcon from '@mui/icons-material/PersonAddAlt1Rounded';
import { useAuth } from '../context/AuthContext';

export default function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth(); // We'll add this to AuthContext next

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
      setErrorMsg('Please fill in all fields.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      await signUp({ name: formData.name, email: formData.email, phone: formData.phone, password: formData.password });
      setSuccessMsg('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error('Signup Error:', err);
      if (err.message === 'Network Error') {
        setErrorMsg('Network Error: Cannot connect to the backend.');
      } else {
        setErrorMsg(err.response?.data?.message || err.response?.data?.error || 'An error occurred during registration.');
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
      minHeight: 'calc(100vh - 250px)',
      display: 'flex', 
      alignItems: 'center' 
    }}>
      <Container maxWidth="sm">
        <Paper elevation={0} sx={{ 
          p: { xs: 4, sm: 5 }, 
          borderRadius: 0, 
          border: '1px solid #cccccc', 
          borderTop: '4px solid #0f4a30', 
          bgcolor: '#ffffff',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
        }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <PersonAddAlt1RoundedIcon sx={{ fontSize: 48, color: '#0f4a30', mb: 1 }} />
            <Typography variant="h5" fontWeight={700} color="#0f4a30" textTransform="uppercase">
              Public Registration
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Join as a Volunteer / Citizen
            </Typography>
          </Box>

          {errorMsg && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2, fontWeight: 'bold' }}>
              {errorMsg}
            </Alert>
          )}

          {successMsg && (
            <Alert severity="success" sx={{ mb: 3, borderRadius: 2, fontWeight: 'bold' }}>
              {successMsg}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField 
                required
                fullWidth 
                size="small"
                label="Full Name" 
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              <TextField 
                required
                fullWidth 
                size="small"
                label="Email Address" 
                name="email"
                type="email" 
                value={formData.email}
                onChange={handleChange}
              />
              <TextField 
                required
                fullWidth 
                size="small"
                label="Phone Number (For SMS Alerts)" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91..."
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
              <TextField 
                fullWidth 
                size="small"
                label="Confirm Password" 
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <Button type="submit" disabled={isLoading} variant="contained" color="primary" fullWidth size="large" sx={{ mt: 2, fontWeight: 700, borderRadius: 0, textTransform: 'uppercase', bgcolor: '#0f4a30', '&:hover': { bgcolor: '#0a3622' } }}>
                {isLoading ? <CircularProgress size={26} color="inherit" /> : 'Register Account'}
              </Button>
            </Stack>
          </form>

          <Divider sx={{ my: 3 }} />
          
          <Box textAlign="center">
             <Typography variant="body2" color="text.secondary">
               Already have an account?{' '}
               <Link to="/login" style={{ color: '#0f4a30', fontWeight: 'bold', textDecoration: 'none' }}>
                 Log in here
               </Link>
             </Typography>
             <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 2 }}>
               Note: Department officials must contact their administrator to receive an authorized ID.
             </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
