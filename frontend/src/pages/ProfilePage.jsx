import React, { useState } from 'react';
import { 
  Box, Container, Typography, Grid, Paper, TextField, Button, 
  Avatar, Divider, Alert, Snackbar, IconButton, InputAdornment, Stack
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';

const NAVY = '#0F172A';
const BLUE = '#1D4ED8';
const ORANGE = '#EA580C';

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Personal Info State
  const [personalInfo, setPersonalInfo] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
  });

  // Password State
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  // UI State
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });

  const isOfficial = user?.role === 'admin' || user?.role === 'agency_head' || user?.role === 'officer' || user?.role === 'sdrf_team';
  const roleDisplay = isOfficial ? user.role.replace('_', ' ').toUpperCase() : 'CITIZEN';
  const roleColor = isOfficial ? ORANGE : BLUE;

  const handlePersonalInfoChange = (e) => {
    setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSavePersonalInfo = async (e) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Implement actual API call to update user info
    setTimeout(() => {
      setLoading(false);
      setToast({ open: true, message: 'Profile information updated successfully! (Demo)', severity: 'success' });
    }, 1000);
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      setToast({ open: true, message: 'New passwords do not match.', severity: 'error' });
      return;
    }
    setLoading(true);
    // TODO: Implement actual API call to update password
    setTimeout(() => {
      setLoading(false);
      setPasswords({ current: '', new: '', confirm: '' });
      setToast({ open: true, message: 'Password updated successfully! (Demo)', severity: 'success' });
    }, 1000);
  };

  const handleLogout = () => {
    signOut();
    navigate('/login');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F4F6FB', pb: 10 }}>
      {/* HEADER BACKGROUND */}
      <Box sx={{ 
        height: 280, 
        background: `linear-gradient(135deg, ${NAVY} 0%, #1E3A8A 100%)`,
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Graphic */}
        <Box sx={{ 
          position: 'absolute', right: -100, top: -100, width: 400, height: 400, 
          borderRadius: '50%', background: 'rgba(255,255,255,0.03)' 
        }} />
        <Box sx={{ 
          position: 'absolute', right: 100, top: 100, width: 200, height: 200, 
          borderRadius: '50%', background: 'rgba(255,255,255,0.05)' 
        }} />
      </Box>

      <Container maxWidth="lg" sx={{ mt: -15, position: 'relative', zIndex: 2 }}>
        <Grid container spacing={4}>
          
          {/* LEFT SIDEBAR - USER CARD */}
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ 
              p: 4, borderRadius: 4, textAlign: 'center',
              border: '1px solid rgba(15, 23, 42, 0.05)',
              boxShadow: '0 10px 30px rgba(15, 23, 42, 0.05)'
            }}>
              <Avatar sx={{ 
                width: 120, height: 120, mx: 'auto', mb: 2, 
                bgcolor: `${roleColor}15`, color: roleColor,
                fontSize: '3rem', border: `4px solid #fff`,
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
              }}>
                {personalInfo.name ? personalInfo.name.charAt(0).toUpperCase() : 'U'}
              </Avatar>
              
              <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: '"Outfit", sans-serif', color: NAVY }}>
                {user?.name || 'User Profile'}
              </Typography>
              
              <Box sx={{ 
                display: 'inline-flex', alignItems: 'center', gap: 0.5, 
                bgcolor: `${roleColor}15`, color: roleColor, px: 2, py: 0.5, 
                borderRadius: 20, mt: 1, mb: 3
              }}>
                {isOfficial ? <SecurityRoundedIcon sx={{ fontSize: 16 }} /> : <VerifiedUserRoundedIcon sx={{ fontSize: 16 }} />}
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.05em' }}>
                  {roleDisplay}
                </Typography>
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, textAlign: 'left', mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#F1F5F9', color: '#64748B' }}>
                    <EmailRoundedIcon sx={{ fontSize: 20 }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Email</Typography>
                    <Typography sx={{ fontSize: '0.9rem', color: NAVY, fontWeight: 500 }}>{user?.email || 'N/A'}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#F1F5F9', color: '#64748B' }}>
                    <PhoneRoundedIcon sx={{ fontSize: 20 }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Phone</Typography>
                    <Typography sx={{ fontSize: '0.9rem', color: NAVY, fontWeight: 500 }}>{user?.phone || 'N/A'}</Typography>
                  </Box>
                </Box>
              </Box>

              <Button 
                variant="outlined" 
                fullWidth 
                color="error"
                startIcon={<LogoutRoundedIcon />}
                onClick={handleLogout}
                sx={{ 
                  borderRadius: 2, py: 1.2, fontWeight: 700, fontFamily: '"Outfit", sans-serif',
                  borderWidth: 2, '&:hover': { borderWidth: 2 }
                }}
              >
                Log Out
              </Button>
            </Paper>
          </Grid>

          {/* RIGHT MAIN CONTENT */}
          <Grid item xs={12} md={8}>
            <Stack spacing={4}>
              
              {/* PERSONAL INFO FORM */}
              <Paper elevation={0} sx={{ 
                p: { xs: 3, sm: 5 }, borderRadius: 4,
                border: '1px solid rgba(15, 23, 42, 0.05)',
                boxShadow: '0 10px 30px rgba(15, 23, 42, 0.05)'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
                  <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <AccountCircleRoundedIcon sx={{ color: BLUE }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: '"Outfit", sans-serif', color: NAVY, lineHeight: 1.2 }}>
                      Personal Information
                    </Typography>
                    <Typography sx={{ fontSize: '0.85rem', color: '#64748B' }}>
                      Update your profile details
                    </Typography>
                  </Box>
                </Box>

                <form onSubmit={handleSavePersonalInfo}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        name="name"
                        value={personalInfo.name}
                        onChange={handlePersonalInfoChange}
                        variant="outlined"
                        InputProps={{
                          sx: { borderRadius: 2, bgcolor: '#F8FAFC' }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        name="phone"
                        value={personalInfo.phone}
                        onChange={handlePersonalInfoChange}
                        variant="outlined"
                        InputProps={{
                          sx: { borderRadius: 2, bgcolor: '#F8FAFC' }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        value={personalInfo.email}
                        onChange={handlePersonalInfoChange}
                        variant="outlined"
                        disabled
                        helperText="Email address cannot be changed."
                        InputProps={{
                          sx: { borderRadius: 2, bgcolor: '#F1F5F9' }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                      <Button 
                        type="submit" 
                        variant="contained" 
                        disabled={loading}
                        sx={{ 
                          bgcolor: BLUE, color: '#fff', borderRadius: 2, px: 4, py: 1.2,
                          fontFamily: '"Outfit", sans-serif', fontWeight: 700,
                          '&:hover': { bgcolor: '#1E40AF' }
                        }}
                      >
                        Save Changes
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Paper>

              {/* SECURITY & PASSWORD FORM */}
              <Paper elevation={0} sx={{ 
                p: { xs: 3, sm: 5 }, borderRadius: 4,
                border: '1px solid rgba(15, 23, 42, 0.05)',
                boxShadow: '0 10px 30px rgba(15, 23, 42, 0.05)'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
                  <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShieldRoundedIcon sx={{ color: '#DC2626' }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: '"Outfit", sans-serif', color: NAVY, lineHeight: 1.2 }}>
                      Account Security
                    </Typography>
                    <Typography sx={{ fontSize: '0.85rem', color: '#64748B' }}>
                      Manage your password
                    </Typography>
                  </Box>
                </Box>

                <form onSubmit={handleUpdatePassword}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Current Password"
                        name="current"
                        type={showPassword ? 'text' : 'password'}
                        value={passwords.current}
                        onChange={handlePasswordChange}
                        required
                        InputProps={{
                          sx: { borderRadius: 2, bgcolor: '#F8FAFC' },
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                {showPassword ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="New Password"
                        name="new"
                        type={showPassword ? 'text' : 'password'}
                        value={passwords.new}
                        onChange={handlePasswordChange}
                        required
                        InputProps={{
                          sx: { borderRadius: 2, bgcolor: '#F8FAFC' }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Confirm New Password"
                        name="confirm"
                        type={showPassword ? 'text' : 'password'}
                        value={passwords.confirm}
                        onChange={handlePasswordChange}
                        required
                        InputProps={{
                          sx: { borderRadius: 2, bgcolor: '#F8FAFC' }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                      <Button 
                        type="submit" 
                        variant="contained" 
                        color="secondary"
                        disabled={loading}
                        sx={{ 
                          bgcolor: NAVY, color: '#fff', borderRadius: 2, px: 4, py: 1.2,
                          fontFamily: '"Outfit", sans-serif', fontWeight: 700,
                          '&:hover': { bgcolor: '#1E293B' }
                        }}
                      >
                        Update Password
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Paper>
              
            </Stack>
          </Grid>

        </Grid>
      </Container>

      <Snackbar 
        open={toast.open} 
        autoHideDuration={4000} 
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setToast({ ...toast, open: false })} 
          severity={toast.severity} 
          variant="filled"
          sx={{ width: '100%', borderRadius: 2, boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
