import React, { useState } from 'react';
import { Box, Button, Container, TextField, Typography, Paper, Alert, Divider } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth }          from '../context/AuthContext';
import SecurityRoundedIcon  from '@mui/icons-material/SecurityRounded';
import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded';
import LogoIcon             from '../components/LogoIcon';

const NAVY = '#0B2545';
const RED  = '#C8102E';

export default function LoginPage() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const { signIn } = useAuth();
  const navigate   = useNavigate();

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
        <Box sx={{ position: 'absolute', top: -100, left: -100, width: 300, height: 300, borderRadius: '50%', bgcolor: RED, opacity: 0.07 }} />

        <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 340 }}>
          <LogoIcon color="#fff" />
          <Typography sx={{ color: '#fff', fontWeight: 900, fontSize: '1.3rem', letterSpacing: '0.04em', mt: 3, mb: 1, lineHeight: 1.3 }}>
            SDRF COMMAND PORTAL
          </Typography>
          <Typography sx={{ color: '#94a3b8', fontSize: '0.72rem', letterSpacing: '0.12em', fontWeight: 700 }}>
            STATE DISASTER RESPONSE FORCE<br />HIMACHAL PRADESH
          </Typography>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 4 }} />

          {[
            { icon: '🔒', text: 'End-to-end encrypted session' },
            { icon: '📋', text: 'All actions are audit-logged' },
            { icon: '🛡️', text: 'IT Act 2000 compliant access' },
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
              <Typography fontWeight={900} color={NAVY} fontSize="0.95rem">HP SDRF Command</Typography>
              <Typography variant="caption" color="#64748b" fontWeight={600}>Authorized Personnel Only</Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
            <Box sx={{ p: 1, bgcolor: '#EEF2FF', border: '1px solid #C7D2FE', borderRadius: 1.5, display: 'flex' }}>
              <SecurityRoundedIcon sx={{ color: NAVY, fontSize: 22 }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={900} color={NAVY}>Secure Login</Typography>
              <Typography variant="caption" color="#64748b" fontWeight={600}>SDRF Authorized Personnel Only</Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          <form onSubmit={handleLogin}>
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="body2" fontWeight={700} color={NAVY} mb={0.8}>Official Email Address</Typography>
              <TextField
                fullWidth required type="email"
                placeholder="name@sdrf.hp.gov.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Box>
            <Box sx={{ mb: 4 }}>
              <Typography variant="body2" fontWeight={700} color={NAVY} mb={0.8}>Secure Password</Typography>
              <TextField
                fullWidth required type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Box>

            <Button
              fullWidth type="submit" variant="contained" color="primary" size="large"
              disabled={loading}
              startIcon={<VerifiedUserRoundedIcon />}
              sx={{ py: 1.7, fontWeight: 900, fontSize: '1rem', letterSpacing: '0.04em', borderRadius: 2 }}
            >
              {loading ? 'Authenticating…' : 'AUTHENTICATE & LOGIN'}
            </Button>
          </form>

          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, mt: 4, bgcolor: '#FFFBEB', borderColor: '#FDE68A' }}>
            <Typography variant="caption" color="#92400E" display="block" fontWeight={600} lineHeight={1.7}>
              ⚠️ This system is restricted to SDRF authorized personnel only. All login attempts are monitored and logged. Unauthorized access is a punishable offence under IT Act 2000.
            </Typography>
          </Paper>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="#64748b" fontWeight={500}>
              Don't have an account?{' '}
              <Button component={RouterLink} to="/signup" sx={{ textTransform: 'none', fontWeight: 700, color: NAVY }}>
                Create one here
              </Button>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
