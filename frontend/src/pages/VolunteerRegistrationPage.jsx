import React, { useState } from 'react';
import { Box, Button, Container, TextField, Typography, Paper, Alert, Divider, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import HandshakeRoundedIcon from '@mui/icons-material/HandshakeRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import LogoIcon from '../components/LogoIcon';

const NAVY = '#0B2545';
const RED  = '#C8102E';
const BLUE = '#1D4ED8';

export default function VolunteerRegistrationPage() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [capabilities, setCapabilities] = useState('');
  const [terrain, setTerrain] = useState('');
  const [place, setPlace] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!capabilities || !place) {
      setError('Please provide your core capabilities and your location/place.');
      return;
    }

    try {
      setError('');
      setLoading(true);

      const payload = {
        name: user.name,
        phone: user.phone || '0000000000', // fallback if phone was null
        lat: null, // Could add geolocator later if needed
        lng: null,
        capabilities,
        terrain_restrictions: terrain,
        place,
        active: true
      };

      await api.post('/volunteers', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to register as volunteer.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4, bgcolor: '#F8FAFC' }}>
        <Paper elevation={0} sx={{ p: 5, maxWidth: 500, width: '100%', textAlign: 'center', borderRadius: 4, border: '1px solid #E2E8F0' }}>
          <CheckCircleRoundedIcon sx={{ fontSize: 80, color: '#10B981', mb: 2 }} />
          <Typography variant="h4" fontWeight={900} color={NAVY} mb={2}>Registration Successful!</Typography>
          <Typography color="#64748B" mb={4}>
            Thank you, {user?.name}. You are now officially registered as an SDRF Volunteer. Your profile is active and you may be contacted during emergencies in your area.
          </Typography>
          <Button variant="contained" onClick={() => navigate('/dashboard')} sx={{ py: 1.5, px: 4, borderRadius: 2, bgcolor: BLUE, fontWeight: 800 }}>
            Return to Dashboard
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: '#F8FAFC' }}>
      {/* Form Container */}
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: { xs: 2, md: 4 } }}>
        <Paper elevation={0} sx={{ width: '100%', maxWidth: 540, p: { xs: 3, md: 5 }, borderRadius: 4, border: '1px solid #E2E8F0' }}>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
            <Box sx={{ p: 1, bgcolor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 1.5, display: 'flex' }}>
              <HandshakeRoundedIcon sx={{ color: BLUE, fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={900} color={NAVY}>Join SDRF Volunteers</Typography>
              <Typography variant="caption" color="#64748b" fontWeight={600}>Help your community during critical emergencies</Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2, fontWeight: 600 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            
            <Box sx={{ mb: 3, p: 2, bgcolor: '#F1F5F9', borderRadius: 2 }}>
              <Typography variant="caption" color="#64748B" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>Account Details</Typography>
              <Typography fontWeight={700} color={NAVY} sx={{ mt: 1 }}>{user?.name}</Typography>
              <Typography variant="body2" color="#64748B">{user?.email}</Typography>
            </Box>

            <FormControl fullWidth margin="normal">
              <InputLabel id="capabilities-label">Core Capabilities / Skills</InputLabel>
              <Select
                labelId="capabilities-label"
                value={capabilities}
                label="Core Capabilities / Skills"
                onChange={(e) => setCapabilities(e.target.value)}
                sx={{ borderRadius: 2, bgcolor: '#fff' }}
              >
                <MenuItem value="Medical & First Aid">Medical & First Aid</MenuItem>
                <MenuItem value="Search & Rescue">Search & Rescue</MenuItem>
                <MenuItem value="Logistics & Transport">Logistics & Transport</MenuItem>
                <MenuItem value="Communications">Communications</MenuItem>
                <MenuItem value="General Support">General Support</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Location (City / District)"
              placeholder="e.g. Shimla City"
              variant="outlined"
              fullWidth
              margin="normal"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#fff' } }}
            />

            <TextField
              label="Terrain Restrictions (Optional)"
              placeholder="e.g. Cannot operate in high altitude"
              variant="outlined"
              fullWidth
              margin="normal"
              value={terrain}
              onChange={(e) => setTerrain(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#fff' } }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                mt: 4, py: 1.5, borderRadius: 2,
                bgcolor: BLUE, color: '#fff',
                fontFamily: '"Outfit", sans-serif', fontWeight: 800, fontSize: '1rem',
                textTransform: 'none', letterSpacing: '0.02em',
                boxShadow: '0 4px 14px rgba(29, 78, 216, 0.25)',
                '&:hover': { bgcolor: '#1E40AF', boxShadow: '0 6px 20px rgba(29, 78, 216, 0.3)' }
              }}
            >
              {loading ? 'Submitting Application...' : 'Register as Volunteer'}
            </Button>
          </form>

        </Paper>
      </Box>
    </Box>
  );
}
