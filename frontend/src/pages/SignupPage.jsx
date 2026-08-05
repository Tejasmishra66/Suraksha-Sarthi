import React, { useState } from 'react';
import { Box, Button, Container, TextField, Typography, Paper, Alert, Divider } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth }          from '../context/AuthContext';
import SecurityRoundedIcon  from '@mui/icons-material/SecurityRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import LogoIcon             from '../components/LogoIcon';

const NAVY = '#0B2545';
const RED  = '#C8102E';
const BLUE = '#1D4ED8';

export default function SignupPage() {
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [phone,    setPhone]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const { signUp } = useAuth();
  const navigate   = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await signUp({ name, email, phone, password });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: '#F8FAFC' }}>

      {/* Left panel — branding */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '45%',
          bgcolor: NAVY,
          p: 6,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        <Box sx={{ position: 'absolute', bottom: -120, right: -120, width: 400, height: 400, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.06)' }} />
        <Box sx={{ position: 'absolute', bottom: -60, right: -60, width: 240, height: 240, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.08)' }} />
        <Box sx={{ position: 'absolute', top: -100, left: -100, width: 300, height: 300, borderRadius: '50%', bgcolor: BLUE, opacity: 0.07 }} />

        <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 340 }}>
          <LogoIcon color="#fff" />
          <Typography sx={{ color: '#fff', fontWeight: 900, fontSize: '1.3rem', letterSpacing: '0.04em', mt: 3, mb: 1, lineHeight: 1.3 }}>
            SDRF CITIZEN PORTAL
          </Typography>
          <Typography sx={{ color: '#94a3b8', fontSize: '0.72rem', letterSpacing: '0.12em', fontWeight: 700 }}>
            STATE DISASTER RESPONSE FORCE<br />HIMACHAL PRADESH
          </Typography>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 4 }} />

          {[
            { icon: '🤝', text: 'Join as a community responder' },
            { icon: '🔔', text: 'Receive life-saving alerts' },
            { icon: '🗺️', text: 'Access real-time emergency maps' },
          ].map(({ icon, text }) => (
            <Box key={text} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, textAlign: 'left' }}>
              <Typography fontSize="1.2rem">{icon}</Typography>
              <Typography variant="body2" color="#94a3b8" fontWeight={600}>{text}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Right panel — form */}
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}>
        <Box sx={{ width: '100%', maxWidth: 420 }}>

          {/* Mobile logo */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1.5, mb: 4 }}>
            <LogoIcon color={NAVY} />
            <Box>
              <Typography fontWeight={900} color={NAVY} fontSize="0.95rem">HP SDRF Citizen</Typography>
              <Typography variant="caption" color="#64748b" fontWeight={600}>Public Portal</Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
            <Box sx={{ p: 1, bgcolor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 1.5, display: 'flex' }}>
              <AccountCircleRoundedIcon sx={{ color: BLUE, fontSize: 22 }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={900} color={NAVY}>Create Account</Typography>
              <Typography variant="caption" color="#64748b" fontWeight={600}>Join the SDRF community network</Typography>
            </Box>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2, fontWeight: 600, border: '1px solid #FECACA' }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSignup}>
            <TextField
              label="Full Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#fff' } }}
            />
            <TextField
              label="Email Address"
              variant="outlined"
              fullWidth
              margin="normal"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#fff' } }}
            />
            <TextField
              label="Phone Number"
              variant="outlined"
              fullWidth
              margin="normal"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#fff' } }}
            />
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              margin="normal"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#fff' } }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                mt: 3, py: 1.5, borderRadius: 2,
                bgcolor: BLUE, color: '#fff',
                fontFamily: '"Outfit", sans-serif', fontWeight: 800, fontSize: '1rem',
                textTransform: 'none', letterSpacing: '0.02em',
                boxShadow: '0 4px 14px rgba(29, 78, 216, 0.25)',
                '&:hover': { bgcolor: '#1E40AF', boxShadow: '0 6px 20px rgba(29, 78, 216, 0.3)' }
              }}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </form>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="#64748b" fontWeight={500}>
              Already have an account?{' '}
              <Button component={RouterLink} to="/login" sx={{ textTransform: 'none', fontWeight: 700, color: BLUE }}>
                Log in here
              </Button>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
