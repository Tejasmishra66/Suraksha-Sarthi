import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Paper, Alert, Divider, InputAdornment } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';
import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import LogoIcon from '../components/LogoIcon';

const NAVY = '#0B2545';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const slides = [
    { title: "Rapid Response", subtitle: "Securing the Himalayan region with unyielding support." },
    { title: "Encrypted Control", subtitle: "End-to-end encrypted session for command operations." },
    { title: "Real-Time Analytics", subtitle: "Live disaster tracking and resource allocation." },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await signIn({ email, password });
      navigate('/dashboard');
    } catch {
      setError('Invalid credentials. Unauthorized access is logged and monitored.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: '#F8FAFC' }}>
      {/* Left panel — Mountain Theme */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '50%',
          position: 'relative',
          overflow: 'hidden',
          backgroundImage: `url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 400, p: 4 }}>
          <LogoIcon color="#fff" />
          <Typography sx={{ color: '#fff', fontWeight: 900, fontSize: '1.8rem', letterSpacing: '0.04em', mt: 4, mb: 1, lineHeight: 1.2, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
            SDRF COMMAND PORTAL
          </Typography>
          <Typography sx={{ color: '#e2e8f0', fontSize: '0.85rem', letterSpacing: '0.15em', fontWeight: 700, mb: 6, textShadow: '0 1px 8px rgba(0,0,0,0.5)' }}>
            STATE DISASTER RESPONSE FORCE<br />HIMACHAL PRADESH
          </Typography>

          <Box sx={{ position: 'relative', height: 120, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'left', bgcolor: 'rgba(255, 255, 255, 0.05)', p: 4, borderRadius: 4, backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)', overflow: 'hidden' }}>
            {slides.map((slide, index) => (
              <Box
                key={index}
                sx={{
                  position: 'absolute',
                  left: 32, right: 32,
                  opacity: activeSlide === index ? 1 : 0,
                  transform: activeSlide === index ? 'translateY(0)' : 'translateY(10px)',
                  transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                  pointerEvents: activeSlide === index ? 'auto' : 'none',
                }}
              >
                <Typography variant="h6" color="#fff" fontWeight={800} mb={0.5} sx={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
                  {slide.title}
                </Typography>
                <Typography variant="body2" color="#e2e8f0" fontWeight={600} lineHeight={1.5} sx={{ textShadow: '0 1px 6px rgba(0,0,0,0.4)' }}>
                  {slide.subtitle}
                </Typography>
              </Box>
            ))}
            
            {/* Carousel Indicators */}
            <Box sx={{ position: 'absolute', bottom: 16, left: 32, display: 'flex', gap: 1 }}>
              {slides.map((_, index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    width: activeSlide === index ? 24 : 8, 
                    height: 4, 
                    borderRadius: 2, 
                    bgcolor: activeSlide === index ? '#fff' : 'rgba(255,255,255,0.3)',
                    transition: 'all 0.4s ease',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.3)'
                  }} 
                />
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Right panel — Form */}
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: { xs: 4, md: 8 }, bgcolor: '#ffffff' }}>
        <Box sx={{ width: '100%', maxWidth: 420 }}>
          
          {/* Mobile logo */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1.5, mb: 4 }}>
            <LogoIcon color={NAVY} />
            <Box>
              <Typography fontWeight={900} color={NAVY} fontSize="1.1rem">HP SDRF Command</Typography>
              <Typography variant="caption" color="#64748b" fontWeight={600}>Authorized Personnel Only</Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Box sx={{ p: 1.5, bgcolor: '#F1F5F9', borderRadius: 2, display: 'flex' }}>
              <SecurityRoundedIcon sx={{ color: NAVY, fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight={800} color={NAVY} letterSpacing="-0.02em">Secure Login</Typography>
              <Typography variant="body2" color="#64748b" fontWeight={500}>Welcome back, authorized personnel.</Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 4 }} />

          {error && <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>{error}</Alert>}

          <form onSubmit={handleLogin}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" fontWeight={700} color={NAVY} mb={1}>Official Email Address</Typography>
              <TextField
                fullWidth required type="email"
                placeholder="name@sdrf.hp.gov.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailRoundedIcon sx={{ color: '#94a3b8' }} />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 2, bgcolor: '#F8FAFC' }
                }}
              />
            </Box>
            <Box sx={{ mb: 4 }}>
              <Typography variant="body2" fontWeight={700} color={NAVY} mb={1}>Secure Password</Typography>
              <TextField
                fullWidth required type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockRoundedIcon sx={{ color: '#94a3b8' }} />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 2, bgcolor: '#F8FAFC' }
                }}
              />
            </Box>

            <Button
              fullWidth type="submit" variant="contained" color="primary" size="large"
              disabled={loading}
              startIcon={<VerifiedUserRoundedIcon />}
              sx={{ 
                py: 2, 
                fontWeight: 800, 
                fontSize: '1.05rem', 
                letterSpacing: '0.02em', 
                borderRadius: 2,
                bgcolor: NAVY,
                '&:hover': { bgcolor: '#081c36' },
                boxShadow: '0 4px 14px 0 rgba(11, 37, 69, 0.39)'
              }}
            >
              {loading ? 'Authenticating…' : 'AUTHENTICATE & LOGIN'}
            </Button>
          </form>

          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, mt: 5, bgcolor: '#FFFBEB', border: '1px solid #FDE68A' }}>
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
              <Typography fontSize="1.2rem">⚠️</Typography>
              <Typography variant="caption" color="#92400E" display="block" fontWeight={600} lineHeight={1.6}>
                This system is restricted to SDRF authorized personnel only. All login attempts are monitored and logged. Unauthorized access is a punishable offence under IT Act 2000.
              </Typography>
            </Box>
          </Paper>

          <Box sx={{ mt: 5, textAlign: 'center' }}>
            <Typography variant="body2" color="#64748b" fontWeight={500}>
              Don't have an account?{' '}
              <Button component={RouterLink} to="/signup" sx={{ textTransform: 'none', fontWeight: 700, color: NAVY }}>
                Create one here
              </Button>
            </Typography>
          </Box>

          <Divider sx={{ my: 4 }}>
            <Typography variant="caption" color="#64748b" fontWeight={700} sx={{ px: 1 }}>OR</Typography>
          </Divider>

          <Button
            fullWidth component={RouterLink} to="/emergency" variant="outlined" color="error" size="large"
            startIcon={<WarningAmberRoundedIcon />}
            sx={{ py: 1.5, fontWeight: 800, borderRadius: 2, borderWidth: 2, '&:hover': { borderWidth: 2 } }}
          >
            Report Emergency (Public)
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
