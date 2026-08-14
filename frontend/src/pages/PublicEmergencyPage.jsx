import React, { useState } from 'react';
import { Box, Container, Grid, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel, Divider, Alert, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

// Icons
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import CallRoundedIcon from '@mui/icons-material/CallRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import LocalPoliceRoundedIcon from '@mui/icons-material/LocalPoliceRounded';
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded';
import LocalHospitalRoundedIcon from '@mui/icons-material/LocalHospitalRounded';
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded';
import PhotoCameraRoundedIcon from '@mui/icons-material/PhotoCameraRounded';

import { createIncident } from '../api/client';
import { saveIncidentOffline } from '../utils/offlineSync';
import { compressImage } from '../utils/imageCompressor';

const NAVY = '#0B2545';
const BLUE = '#1D4ED8';
const RED = '#DC2626';
const ORANGE = '#F59E0B';
const GREEN = '#10B981';

const severityOptions = [
  { value: 'High', label: 'High', color: RED, desc: 'Severe damage, immediate attention needed' },
  { value: 'Medium', label: 'Medium', color: ORANGE, desc: 'Significant impact, requires attention' },
  { value: 'Low', label: 'Low', color: BLUE, desc: 'Minor impact, monitoring required' },
  { value: 'Info', label: 'Info', color: GREEN, desc: 'General information or query' },
];

export default function PublicEmergencyPage() {
  const [disasterType, setDisasterType] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('High');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [sosStatus, setSosStatus] = useState('');
  const [sosLoading, setSosLoading] = useState(false);

  const handleSOS = () => {
    setSosLoading(true);
    setSosStatus('');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          await createIncident({
            disaster_type: 'SOS',
            description: 'EMERGENCY SOS',
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            severity: 'High'
          });
          setSosStatus('SOS SENT SUCCESSFULLY. SDRF IS RESPONDING.');
        } catch (err) {
          setSosStatus('Failed to send SOS. Please call helpline directly.');
        } finally {
          setSosLoading(false);
        }
      },
      () => {
        setSosStatus('Could not get location. Enable GPS and try again.');
        setSosLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const handleSubmit = async () => {
    if (!disasterType || !description || !mobile) {
      alert('Please fill in disaster type, description, and mobile number.');
      return;
    }
    setLoading(true);
    setSuccess('');
    
    let compressedPhotoBase64 = null;
    if (photo) {
      try {
        compressedPhotoBase64 = await compressImage(photo);
      } catch (err) {
        console.error('Image compression failed', err);
      }
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const payload = {
          disaster_type: disasterType,
          description,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          severity,
          name, // Add name
          mobile,
          photo: compressedPhotoBase64
        };

        if (!navigator.onLine) {
          await saveIncidentOffline(payload);
          setSuccess('You are offline. Report saved locally and will sync when connection restores.');
          setLoading(false);
          return;
        }

        try {
          await createIncident(payload);
          setSuccess('Emergency reported successfully! SDRF teams have been notified.');
          // Reset form
          setDisasterType(''); setDescription(''); setSeverity('High');
          setName(''); setMobile(''); setPhoto(null);
        } catch {
          await saveIncidentOffline(payload);
          setSuccess('Network issue. Report saved locally and will sync automatically.');
        }
        setLoading(false);
      },
      () => {
        alert('Could not get location. Please enable GPS/location services.');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f3f4f6', pb: 8 }}>
      {/* Top Banner */}
      <Box sx={{ backgroundColor: RED, color: 'white', py: 2, px: 3, textAlign: 'center', position: 'relative' }}>
        <Button 
          component={RouterLink} 
          to="/login" 
          startIcon={<ArrowBackRoundedIcon />}
          sx={{ color: 'white', position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', display: { xs: 'none', sm: 'flex' } }}
        >
          Back to Login
        </Button>
        <Typography variant="h5" fontWeight="bold">PUBLIC EMERGENCY REPORTING</Typography>
        <Typography variant="body2">No login required — report emergencies directly</Typography>
      </Box>
      <Box sx={{ display: { xs: 'block', sm: 'none' }, px: 2, pt: 2 }}>
         <Button component={RouterLink} to="/login" startIcon={<ArrowBackRoundedIcon />}>Back to Login</Button>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            {/* SOS Section */}
            <Paper elevation={3} sx={{ p: 4, textAlign: 'center', mb: 4, borderRadius: 2, backgroundColor: '#FEF2F2' }}>
              <Typography variant="h6" color={RED} fontWeight="bold" gutterBottom>
                Life-threatening emergency? Press SOS
              </Typography>
              <Button
                variant="contained"
                onClick={handleSOS}
                disabled={sosLoading}
                sx={{
                  width: 120, height: 120, borderRadius: '50%',
                  backgroundColor: RED, '&:hover': { backgroundColor: '#b91c1c' },
                  fontSize: '2rem', fontWeight: 'bold', my: 2,
                  boxShadow: '0 8px 16px rgba(220, 38, 38, 0.4)'
                }}
              >
                {sosLoading ? '...' : 'SOS'}
              </Button>
              {sosStatus && (
                <Alert severity={sosStatus.includes('SUCCESSFULLY') ? 'success' : 'error'} sx={{ mt: 2, justifyContent: 'center' }}>
                  {sosStatus}
                </Alert>
              )}
            </Paper>

            {/* Report Form */}
            <Paper elevation={2} sx={{ p: { xs: 3, md: 4 }, borderRadius: 2 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Report an Incident
              </Typography>
              <Divider sx={{ mb: 3 }} />

              {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>Disaster Type</InputLabel>
                    <Select
                      value={disasterType}
                      label="Disaster Type"
                      onChange={(e) => setDisasterType(e.target.value)}
                    >
                      {['Landslide', 'Flood', 'Fire', 'Road Accident', 'Earthquake', 'Building Collapse', 'Cloudburst', 'Other'].map(type => (
                        <MenuItem key={type} value={type}>{type}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    label="Description"
                    multiline
                    rows={4}
                    placeholder="Describe the emergency situation..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                    Severity Level *
                  </Typography>
                  <Grid container spacing={2}>
                    {severityOptions.map((opt) => (
                      <Grid item xs={12} sm={6} key={opt.value}>
                        <Paper
                          onClick={() => setSeverity(opt.value)}
                          sx={{
                            p: 2, cursor: 'pointer',
                            border: `2px solid ${severity === opt.value ? opt.color : 'transparent'}`,
                            backgroundColor: severity === opt.value ? `${opt.color}15` : '#f9fafb',
                            transition: 'all 0.2s'
                          }}
                        >
                          <Typography variant="subtitle1" fontWeight="bold" color={opt.color}>
                            {opt.label}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {opt.desc}
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    label="Mobile Number"
                    placeholder="10-digit mobile number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box
                    component="label"
                    sx={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      p: 3, border: '2px dashed #cbd5e1', borderRadius: 2,
                      cursor: 'pointer', '&:hover': { backgroundColor: '#f8fafc' }
                    }}
                  >
                    <PhotoCameraRoundedIcon sx={{ fontSize: 40, color: '#94a3b8', mb: 1 }} />
                    <Typography variant="body1" fontWeight="bold" color="text.secondary">
                      {photo ? photo.name : 'Upload Photo (Optional)'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tap to select image
                    </Typography>
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handlePhotoChange}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleSubmit}
                    disabled={loading}
                    startIcon={<SendRoundedIcon />}
                    sx={{ py: 1.5, backgroundColor: BLUE, fontSize: '1.1rem', fontWeight: 'bold' }}
                  >
                    {loading ? 'Submitting...' : 'SUBMIT EMERGENCY REPORT'}
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            {/* Helpline Numbers Sidebar */}
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2, position: 'sticky', top: 24 }}>
              <Box display="flex" alignItems="center" mb={2}>
                <CallRoundedIcon sx={{ color: RED, mr: 1, fontSize: 28 }} />
                <Typography variant="h6" fontWeight="bold">Helpline Numbers</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              <Box display="flex" flexDirection="column" gap={2}>
                <Box display="flex" alignItems="center">
                  <SupportAgentRoundedIcon sx={{ color: NAVY, mr: 2, fontSize: 32 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">SDRF Control Room</Typography>
                    <Typography variant="h6" fontWeight="bold" color={NAVY}>1070</Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center">
                  <LocalPoliceRoundedIcon sx={{ color: BLUE, mr: 2, fontSize: 32 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Police</Typography>
                    <Typography variant="h6" fontWeight="bold" color={NAVY}>100</Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center">
                  <LocalFireDepartmentRoundedIcon sx={{ color: RED, mr: 2, fontSize: 32 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Fire</Typography>
                    <Typography variant="h6" fontWeight="bold" color={NAVY}>101</Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center">
                  <LocalHospitalRoundedIcon sx={{ color: GREEN, mr: 2, fontSize: 32 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Ambulance</Typography>
                    <Typography variant="h6" fontWeight="bold" color={NAVY}>108</Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center">
                  <WarningAmberRoundedIcon sx={{ color: ORANGE, mr: 2, fontSize: 32 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Disaster Management</Typography>
                    <Typography variant="h6" fontWeight="bold" color={NAVY}>1077</Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
