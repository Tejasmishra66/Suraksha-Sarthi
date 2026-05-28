import React, { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Drawer,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import PersonAddAlt1RoundedIcon from '@mui/icons-material/PersonAddAlt1Rounded';
import { useNavigate } from 'react-router-dom';

import { register } from '../api/client';
import { useAuth } from '../context/AuthContext';

// Collects credentials and opens the dashboard after JWT login succeeds.
export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn, loading } = useAuth();
  const [loginForm, setLoginForm] = useState({ email: 'officer@sdrf.local', password: 'password123' });
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    department: 'SDRF',
    address: '',
    place: '',
    district: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [signupOpen, setSignupOpen] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);

  const departmentOptions = useMemo(
    () => ['SDRF', 'Police', 'Medical', 'Utility', 'Fire Brigade', 'Revenue', 'Education', 'Other'],
    []
  );

  // Updates one login field without touching the other values.
  function handleChange(event) {
    setLoginForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function handleSignupChange(event) {
    setRegisterForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  // Submits the login form and redirects into the dashboard shell.
  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    try {
      await signIn(loginForm);
      navigate('/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed');
    }
  }

  async function handleSignupSubmit(event) {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setSignupLoading(true);
    try {
      await register({
        name: registerForm.name,
        email: registerForm.email,
        password: registerForm.password,
        phone: registerForm.phone,
        department: registerForm.department,
        address: registerForm.address,
        place: registerForm.place,
        district: registerForm.district,
      });

      setSuccess('Account created successfully. You can sign in now.');
      setSignupOpen(false);
      setLoginForm((current) => ({ ...current, email: registerForm.email }));
      setRegisterForm({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        department: 'SDRF',
        address: '',
        place: '',
        district: '',
      });
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not create account');
    } finally {
      setSignupLoading(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top left, rgba(139,29,61,0.18), transparent 32%), linear-gradient(180deg, #f6f8fb 0%, #eef3f8 100%)',
        py: { xs: 3, md: 8 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(15,23,42,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.03) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage: 'linear-gradient(180deg, rgba(0,0,0,0.3), transparent 75%)',
          pointerEvents: 'none',
        }}
      />
      <Container maxWidth="lg" sx={{ position: 'relative' }}>
        <Grid container spacing={3} alignItems="stretch">
          <Grid item xs={12} md={7}>
            <Card
              sx={{
                height: '100%',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #101828 0%, #1d3557 45%, #8b1d3d 100%)',
                color: 'white',
                boxShadow: '0 30px 80px rgba(15,23,42,0.22)',
              }}
            >
              <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                <Stack spacing={3}>
                  <Chip
                    icon={<AccountCircleRoundedIcon sx={{ color: 'inherit !important' }} />}
                    label="SDRF Helping Hands"
                    sx={{ alignSelf: 'flex-start', bgcolor: 'rgba(255,255,255,0.12)', color: 'white' }}
                  />
                  <Box>
                    <Typography variant="h3" fontWeight={900} sx={{ lineHeight: 1.05, maxWidth: 560 }}>
                      Secure access for operators and field coordinators
                    </Typography>
                    <Typography sx={{ mt: 2, maxWidth: 620, color: 'rgba(255,255,255,0.8)' }}>
                      Use your user ID and password to enter the dashboard. If you do not have an account yet,
                      create one from the side panel with your contact and department details.
                    </Typography>
                  </Box>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <Button
                      variant="contained"
                      startIcon={<LoginRoundedIcon />}
                      onClick={handleSubmit}
                      disabled={loading}
                      sx={{
                        bgcolor: 'white',
                        color: '#101828',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.92)' },
                        px: 3,
                      }}
                    >
                      {loading ? 'Signing in...' : 'Login'}
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<PersonAddAlt1RoundedIcon />}
                      onClick={() => setSignupOpen(true)}
                      sx={{
                        borderColor: 'rgba(255,255,255,0.4)',
                        color: 'white',
                        px: 3,
                      }}
                    >
                      Create new user
                    </Button>
                  </Stack>
                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.16)' }} />
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    {[
                      ['Login ID', 'Email or user ID'],
                      ['Password', 'Required for login'],
                      ['Signup fields', 'Name, mobile, department, address, email, place, district'],
                    ].map(([label, value]) => (
                      <Box key={label} sx={{ flex: 1, p: 2, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.08)' }}>
                        <Typography variant="caption" sx={{ opacity: 0.7, letterSpacing: 1.2 }}>
                          {label}
                        </Typography>
                        <Typography sx={{ mt: 0.5, fontWeight: 700 }}>{value}</Typography>
                      </Box>
                    ))}
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={5}>
            <Stack spacing={3} sx={{ height: '100%' }}>
              <Card sx={{ flex: 1 }}>
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Typography variant="overline" color="text.secondary">
                    Sign in
                  </Typography>
                  <Typography variant="h4" fontWeight={800} gutterBottom>
                    Login with user ID and password
                  </Typography>
                  <Typography color="text.secondary" sx={{ mb: 3 }}>
                    Existing users can sign in here. New users can create an account from the button below.
                  </Typography>
                  {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                  {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
                  <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
                    <TextField
                      label="User ID / Email"
                      name="email"
                      value={loginForm.email}
                      onChange={handleChange}
                      fullWidth
                    />
                    <TextField
                      label="Password"
                      name="password"
                      type="password"
                      value={loginForm.password}
                      onChange={handleChange}
                      fullWidth
                    />
                    <Button type="submit" variant="contained" size="large" disabled={loading}>
                      {loading ? 'Signing in...' : 'Login'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>

              <Card sx={{ bgcolor: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(12px)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={800} gutterBottom>
                    Need an account?
                  </Typography>
                  <Typography color="text.secondary" sx={{ mb: 2 }}>
                    Open the signup drawer to enter name, mobile number, department, address, email, place,
                    and district.
                  </Typography>
                  <Button variant="outlined" onClick={() => setSignupOpen(true)} startIcon={<PersonAddAlt1RoundedIcon />}>
                    Create new user id
                  </Button>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Container>

      <Drawer
        anchor="right"
        open={signupOpen}
        onClose={() => setSignupOpen(false)}
        PaperProps={{ sx: { width: { xs: '100%', sm: 560 }, p: 0 } }}
      >
        <Box sx={{ p: 3, bgcolor: '#101828', color: 'white' }}>
          <Typography variant="h5" fontWeight={900}>
            Create new user ID
          </Typography>
          <Typography sx={{ opacity: 0.8, mt: 1 }}>
            Fill in the profile details to create login credentials.
          </Typography>
        </Box>
        <Box component="form" onSubmit={handleSignupSubmit} sx={{ p: 3, display: 'grid', gap: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Name"
                name="name"
                value={registerForm.name}
                onChange={handleSignupChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Mobile Number"
                name="phone"
                value={registerForm.phone}
                onChange={handleSignupChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Department"
                name="department"
                value={registerForm.department}
                onChange={handleSignupChange}
                fullWidth
                required
              >
                {departmentOptions.map((department) => (
                  <MenuItem key={department} value={department}>
                    {department}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email ID"
                name="email"
                type="email"
                value={registerForm.email}
                onChange={handleSignupChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Place"
                name="place"
                value={registerForm.place}
                onChange={handleSignupChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="District"
                name="district"
                value={registerForm.district}
                onChange={handleSignupChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Address"
                name="address"
                value={registerForm.address}
                onChange={handleSignupChange}
                fullWidth
                multiline
                minRows={2}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Password"
                name="password"
                type="password"
                value={registerForm.password}
                onChange={handleSignupChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={registerForm.confirmPassword}
                onChange={handleSignupChange}
                fullWidth
                required
              />
            </Grid>
          </Grid>

          <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
            <Button type="submit" variant="contained" disabled={signupLoading}>
              {signupLoading ? 'Creating...' : 'Create account'}
            </Button>
            <Button variant="text" onClick={() => setSignupOpen(false)}>
              Cancel
            </Button>
          </Stack>
        </Box>
      </Drawer>
    </Box>
  );
}
