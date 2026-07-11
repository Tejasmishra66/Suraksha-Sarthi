import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Stack,
  Tab,
  Tabs,
  TextField,
  Divider,
  ButtonBase,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Paper,
  Avatar,
  Chip,
  InputAdornment,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  ListItemText
} from '@mui/material';
import ReportRoundedIcon from '@mui/icons-material/ReportRounded';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import CallRoundedIcon from '@mui/icons-material/CallRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';

import { createAlert, createIncident, uploadIncidentMedia, fetchTasks, updateTask } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const HIMACHAL_CENTER = [31.1048, 77.1734];
const HIMACHAL_BOUNDS = [
  [30.2, 75.6],
  [33.5, 79.6],
];

function LocationSelector({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng);
    },
  });
  return null;
}

const emergencyTypes = [
  { value: 'medical', label: 'Medical Emergency', icon: <ReportRoundedIcon color="error" /> },
  { value: 'fire', label: 'Fire Incident', icon: <ReportRoundedIcon color="error" /> },
  { value: 'natural-disaster', label: 'Natural Disaster', icon: <WarningRoundedIcon color="warning" /> },
  { value: 'accident', label: 'Accident', icon: <ErrorOutlineRoundedIcon color="warning" /> },
  { value: 'other', label: 'Other', icon: <InfoRoundedIcon color="info" /> },
];

const districts = [
  'Bilaspur', 'Chamba', 'Hamirpur', 'Kangra', 'Kinnaur', 'Kullu', 
  'Lahaul and Spiti', 'Mandi', 'Shimla', 'Sirmaur', 'Solan', 'Una'
];

const departmentOptions = ['Police', 'Medical', 'Fire', 'SDRF', 'NDRF', 'Utility'];

const mockActiveAlerts = [
  { id: 1, title: 'Massive Landslide', location: 'Near Mandi Bus Stand', time: '10 mins ago', severity: 'High', icon: <WarningRoundedIcon fontSize="small" sx={{ color: '#d32f2f' }} /> },
  { id: 2, title: 'Road Block (Debris)', location: 'Mandi Bus Stand approach', time: '1 hour ago', severity: 'Medium', icon: <WarningRoundedIcon fontSize="small" sx={{ color: '#f59e0b' }} /> },
  { id: 3, title: 'Rescue Operation', location: 'Mandi Bus Stand Area', time: '2 hours ago', severity: 'High', icon: <ReportRoundedIcon fontSize="small" sx={{ color: '#d32f2f' }} /> }
];

const safetyTips = [
  'Move to higher ground immediately',
  'Avoid river banks and landslide areas',
  'Stay updated through official channels',
  'Keep emergency contact numbers handy',
];

export default function EmergencyPage() {
  const { user } = useAuth();
  const [tab, setTab] = React.useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emergencyForm, setEmergencyForm] = useState({
    emergencyType: '',
    district: '',
    location: '',
    description: '',
    severity: 'Medium',
    name: '',
    mobile: '',
    peopleAffected: '',
    departments: [],
  });

  const [mapDialogOpen, setMapDialogOpen] = useState(false);
  const [mapLocation, setMapLocation] = useState(null);
  const fileInputRef = useRef(null);

  const handleEmergencyFormChange = (e) => {
    setEmergencyForm({ ...emergencyForm, [e.target.name]: e.target.value });
  };

  const handleSeverityChange = (newSeverity) => {
    setEmergencyForm({ ...emergencyForm, severity: newSeverity });
  };

  const handleReset = () => {
    setEmergencyForm({
      emergencyType: '',
      district: '',
      location: '',
      description: '',
      severity: 'Medium',
      name: '',
      mobile: '',
      peopleAffected: '',
      departments: [],
    });
  };

  const handleEmergencySubmit = async (e) => {
    e.preventDefault();
    if (!emergencyForm.emergencyType) {
      alert('Please select the Type of Emergency.');
      return;
    }
    setIsSubmitting(true);
    let lat = null, lng = null;
    const coords = emergencyForm.location.split(',');
    if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
      lat = parseFloat(coords[0].trim());
      lng = parseFloat(coords[1].trim());
    }

    // Build tags combining district and departments
    let tags = [];
    if (emergencyForm.district) {
      if (emergencyForm.departments && emergencyForm.departments.length > 0) {
        emergencyForm.departments.forEach(dept => {
          tags.push(`${emergencyForm.district}_${dept}`);
          tags.push(dept); // Also let general department see it
        });
      }
      tags.push(emergencyForm.district);
    } else {
      tags = ['State'];
    }

    try {
      const incident = await createIncident({
        title: emergencyForm.emergencyType.toUpperCase() + ' Emergency',
        description: emergencyForm.description,
        disasterType: emergencyForm.emergencyType,
        lat, lng,
        address: lat ? '' : emergencyForm.location,
        agencyAssigned: 'response',
        offline: false,
        officeTags: tags,
      });

      if (lat && lng) {
        await createAlert({
          disasterType: emergencyForm.emergencyType,
          lat, lng, radiusKm: 5, severity: emergencyForm.severity.toLowerCase(),
          officeTags: tags,
        });
      }

      const file = fileInputRef.current?.files?.[0];
      if (file && incident?.id) {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('metadata', JSON.stringify({ lat, lng, timestamp: new Date().toISOString() }));
        await uploadIncidentMedia(incident.id, fd);
      }

      alert('Incident reported successfully!');
      handleReset();
    } catch (error) {
      console.error('Failed to report emergency:', error);
      alert(`Error reporting emergency.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f4f6f8', pb: 8 }}>
      
      {/* HERO SECTION */}
      <Box sx={{
        position: 'relative',
        height: 450,
        backgroundImage: 'url(/mountain-emergency.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'top',
        display: 'flex',
        alignItems: 'center'
      }}>
        {/* Hero text removed as requested */}
      </Box>

      {/* FLOATING TABS (Only for Admin/Department) */}
      {(user?.role === 'admin' || user?.role === 'department') && (
        <Container maxWidth="xl" sx={{ mt: -4, position: 'relative', zIndex: 2 }}>
          <Paper elevation={0} sx={{ 
            borderRadius: 4, 
            display: 'inline-block', 
            bgcolor: '#ffffff',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            p: 1
          }}>
            <Tabs
              value={tab}
              onChange={(e, v) => setTab(v)}
              TabIndicatorProps={{ style: { display: 'none' } }}
              sx={{
                minHeight: 'auto',
                '& .MuiTab-root': {
                  minHeight: 'auto',
                  py: 1.5,
                  px: 3,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  color: '#4a5568',
                  borderRadius: 3,
                  transition: 'all 0.2s',
                  '&:hover': { color: '#2a5a41', bgcolor: 'rgba(42, 90, 65, 0.05)' },
                  '&.Mui-selected': { 
                    color: '#ffffff', 
                    bgcolor: '#2a5a41',
                    boxShadow: '0 4px 12px rgba(42, 90, 65, 0.3)'
                  }
                }
              }}
            >
              <Tab label="Report Emergency" />
              <Tab label="Smart Alerts" />
              <Tab label="Emergency Contacts" />
              <Tab label="My Reports" />
            </Tabs>
          </Paper>
        </Container>
      )}

      {/* MAIN CONTENT */}
      <Container maxWidth="xl" sx={{ mt: 4 }} id="report-form">
        {tab === 0 && (
          <Grid container spacing={4}>
            
            {/* LEFT COLUMN: FORM */}
            <Grid item xs={12} lg={8}>
              <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, border: '1px solid #e2e8f0' }}>
                <Typography variant="h5" fontWeight={800} color="#1a202c" sx={{ mb: 4 }}>
                  Report a New Emergency
                </Typography>
                
                <form onSubmit={handleEmergencySubmit}>
                  <Grid container spacing={3}>
                    {/* Row 1 */}
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: '#1a202c' }}>Type of Emergency <span style={{ color: '#d32f2f' }}>*</span></Typography>
                      <FormControl fullWidth size="medium">
                        <Select 
                          name="emergencyType" 
                          value={emergencyForm.emergencyType} 
                          onChange={handleEmergencyFormChange}
                          displayEmpty
                          sx={{ borderRadius: 2, bgcolor: '#f8fafc', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' } }}
                          renderValue={(selected) => {
                            if (selected.length === 0) return <Typography color="text.secondary">Select Emergency Type</Typography>;
                            const item = emergencyTypes.find(t => t.value === selected);
                            return <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>{item.icon} {item.label}</Box>;
                          }}
                        >
                          <MenuItem disabled value=""><em>Select Emergency Type</em></MenuItem>
                          {emergencyTypes.map((type) => (
                            <MenuItem key={type.value} value={type.value}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                {type.icon} {type.label}
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: '#1a202c' }}>Location <span style={{ color: '#d32f2f' }}>*</span></Typography>
                      <TextField 
                        fullWidth 
                        size="medium" 
                        name="location" 
                        placeholder="Search location or enter address" 
                        value={emergencyForm.location} 
                        onChange={handleEmergencyFormChange} 
                        required 
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#f8fafc', '& fieldset': { borderColor: '#e2e8f0' } } }}
                        InputProps={{ 
                          startAdornment: <InputAdornment position="start"><PlaceRoundedIcon sx={{ color: '#2a5a41' }} /></InputAdornment>,
                          endAdornment: <InputAdornment position="end"><Button size="small" onClick={() => setMapDialogOpen(true)} sx={{ minWidth: 'auto', p: 0.5, color: '#2a5a41' }}>Map</Button></InputAdornment>
                        }} 
                      />
                    </Grid>

                    {/* Row 2 */}
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: '#1a202c' }}>Description <span style={{ color: '#d32f2f' }}>*</span></Typography>
                      <TextField 
                        fullWidth 
                        size="medium" 
                        name="description" 
                        multiline 
                        minRows={4} 
                        placeholder="Provide details about the situation..." 
                        value={emergencyForm.description} 
                        onChange={handleEmergencyFormChange} 
                        required 
                        helperText="Min. 20 characters"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#f8fafc', '& fieldset': { borderColor: '#e2e8f0' } } }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: '#1a202c' }}>District <span style={{ color: '#d32f2f' }}>*</span></Typography>
                          <FormControl fullWidth size="medium">
                            <Select 
                              name="district" 
                              value={emergencyForm.district} 
                              onChange={handleEmergencyFormChange}
                              displayEmpty
                              sx={{ borderRadius: 2, bgcolor: '#f8fafc', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' } }}
                            >
                              <MenuItem disabled value=""><em>Select District</em></MenuItem>
                              {districts.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: '#1a202c' }}>Upload Photo / Video <span style={{ color: '#d32f2f' }}>*</span></Typography>
                          <ButtonBase component="label" sx={{ 
                            border: '2px dashed #cbd5e1', 
                            p: 2.5, 
                            borderRadius: 2, 
                            width: '100%', 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            bgcolor: '#f8fafc', 
                            transition: 'all 0.2s',
                            '&:hover': { bgcolor: '#f1f5f9', borderColor: '#2a5a41' } 
                          }}>
                            <CloudUploadRoundedIcon sx={{ fontSize: 32, color: '#4a5568', mb: 1 }} />
                            <Typography variant="body2" fontWeight={700} color="#1a202c">Click to upload</Typography>
                            <Typography variant="caption" color="text.secondary">Photo will be time & location stamped</Typography>
                            <input type="file" ref={fileInputRef} accept="image/*,video/*" hidden />
                          </ButtonBase>
                        </Grid>
                      </Grid>
                    </Grid>

                    {/* Row 3 */}
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: '#1a202c' }}>Severity Level <span style={{ color: '#d32f2f' }}>*</span></Typography>
                      <Stack direction="row" spacing={2}>
                        {[
                          { label: 'Low', color: '#4ade80', bg: 'rgba(74, 222, 128, 0.1)', border: 'rgba(74, 222, 128, 0.4)' },
                          { label: 'Medium', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.4)' },
                          { label: 'High', color: '#d32f2f', bg: 'rgba(211, 47, 47, 0.1)', border: 'rgba(211, 47, 47, 0.4)' }
                        ].map((sev) => (
                          <Button 
                            key={sev.label} 
                            onClick={() => handleSeverityChange(sev.label)}
                            sx={{ 
                              flex: 1, 
                              borderRadius: 2, 
                              py: 1,
                              fontWeight: 700,
                              textTransform: 'none',
                              border: '1px solid',
                              borderColor: emergencyForm.severity === sev.label ? sev.color : '#e2e8f0',
                              bgcolor: emergencyForm.severity === sev.label ? sev.bg : '#ffffff',
                              color: emergencyForm.severity === sev.label ? sev.color : '#64748b',
                              transition: 'all 0.2s',
                              '&:hover': { borderColor: sev.color, bgcolor: sev.bg, color: sev.color }
                            }}
                          >
                            {sev.label}
                          </Button>
                        ))}
                      </Stack>
                    </Grid>

                    {/* Target Departments */}
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: '#1a202c' }}>Notify Departments (Optional)</Typography>
                      <FormControl fullWidth size="medium">
                        <Select
                          multiple
                          name="departments"
                          value={emergencyForm.departments}
                          onChange={handleEmergencyFormChange}
                          displayEmpty
                          renderValue={(selected) => {
                            if (selected.length === 0) return <Typography color="text.secondary">All Departments</Typography>;
                            return (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => (
                                  <Chip key={value} label={value} size="small" sx={{ bgcolor: '#dbeafe', color: '#1e40af', fontWeight: 600 }} />
                                ))}
                              </Box>
                            );
                          }}
                          sx={{ borderRadius: 2, bgcolor: '#f8fafc', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' } }}
                        >
                          <MenuItem disabled value=""><em>Select specific departments to alert</em></MenuItem>
                          {departmentOptions.map((dept) => (
                            <MenuItem key={dept} value={dept}>
                              <Checkbox checked={emergencyForm.departments.indexOf(dept) > -1} />
                              <ListItemText primary={dept} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Row 4 */}
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: '#1a202c' }}>Your Name <span style={{ color: '#d32f2f' }}>*</span></Typography>
                      <TextField fullWidth size="small" name="name" placeholder="Enter your name" value={emergencyForm.name} onChange={handleEmergencyFormChange} required sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: '#1a202c' }}>Mobile Number <span style={{ color: '#d32f2f' }}>*</span></Typography>
                      <TextField fullWidth size="small" name="mobile" placeholder="Enter mobile number" value={emergencyForm.mobile} onChange={handleEmergencyFormChange} required sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: '#1a202c' }}>People Affected (Approx.)</Typography>
                      <TextField fullWidth size="small" name="peopleAffected" placeholder="Enter number (optional)" value={emergencyForm.peopleAffected} onChange={handleEmergencyFormChange} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                    </Grid>

                  </Grid>

                  {/* Form Footer */}
                  <Divider sx={{ my: 4, borderColor: '#e2e8f0' }} />
                  <Stack direction={{ xs: 'column', md: 'row' }} alignItems="center" justifyContent="space-between" spacing={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#64748b' }}>
                      <LockRoundedIcon fontSize="small" />
                      <Typography variant="caption" fontWeight={500}>All reports are secured and sent to the nearest response teams.</Typography>
                    </Box>
                    <Stack direction="row" spacing={2} sx={{ width: { xs: '100%', md: 'auto' } }}>
                      <Button 
                        variant="outlined" 
                        onClick={handleReset}
                        sx={{ 
                          borderRadius: 2, 
                          px: 3, 
                          py: 1, 
                          fontWeight: 700, 
                          color: '#2a5a41', 
                          borderColor: '#2a5a41',
                          textTransform: 'none',
                          flex: { xs: 1, md: 'none' }
                        }}
                      >
                        Reset
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={isSubmitting} 
                        variant="contained" 
                        startIcon={<SendRoundedIcon />}
                        sx={{ 
                          borderRadius: 2, 
                          px: 4, 
                          py: 1, 
                          fontWeight: 700, 
                          bgcolor: '#2a5a41',
                          textTransform: 'none',
                          boxShadow: '0 4px 12px rgba(42, 90, 65, 0.2)',
                          flex: { xs: 1, md: 'none' },
                          '&:hover': { bgcolor: '#1e422f' }
                        }}
                      >
                        {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Submit Report'}
                      </Button>
                    </Stack>
                  </Stack>
                </form>
              </Paper>
            </Grid>

            {/* RIGHT COLUMN: WIDGETS */}
            <Grid item xs={12} lg={4}>
              <Stack spacing={4}>
                
                {/* Recent Alerts */}
                <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0' }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                    <Typography variant="h6" fontWeight={800} color="#1a202c">Recent Alerts</Typography>
                    <Button size="small" sx={{ color: '#2a5a41', fontWeight: 700, textTransform: 'none' }}>View All</Button>
                  </Stack>
                  <Stack spacing={2} divider={<Divider sx={{ borderColor: '#f1f5f9' }} />}>
                    {mockActiveAlerts.length === 0 ? (
                      <Typography variant="body2" color="#64748b" textAlign="center" py={4}>No recent alerts</Typography>
                    ) : (
                      mockActiveAlerts.map(alert => (
                        <Box key={alert.id} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                          <Box sx={{ mt: 0.5 }}>{alert.icon}</Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle2" fontWeight={800} color="#1a202c">{alert.title}</Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>{alert.location}</Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>{alert.time}</Typography>
                          </Box>
                          <Chip 
                            label={alert.severity} 
                            size="small" 
                            sx={{ 
                              fontWeight: 700, 
                              borderRadius: 1.5, 
                              fontSize: '0.65rem',
                              height: 20,
                              bgcolor: alert.severity === 'High' ? 'rgba(211, 47, 47, 0.1)' : alert.severity === 'Medium' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(74, 222, 128, 0.1)',
                              color: alert.severity === 'High' ? '#d32f2f' : alert.severity === 'Medium' ? '#f59e0b' : '#4ade80'
                            }} 
                          />
                        </Box>
                      ))
                    )}
                  </Stack>
                </Paper>

                {/* Safety Tips */}
                <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0' }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                    <Typography variant="h6" fontWeight={800} color="#1a202c">Safety Tips</Typography>
                    <Button size="small" sx={{ color: '#2a5a41', fontWeight: 700, textTransform: 'none' }}>View All</Button>
                  </Stack>
                  <Stack spacing={2}>
                    {safetyTips.map((tip, index) => (
                      <Box key={index} sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                        <CheckCircleRoundedIcon sx={{ color: '#2a5a41', fontSize: 18 }} />
                        <Typography variant="body2" color="#4a5568" fontWeight={500}>{tip}</Typography>
                      </Box>
                    ))}
                  </Stack>
                </Paper>

              </Stack>
            </Grid>

          </Grid>
        )}

        {/* Placeholders for other tabs just to show they work (Only for Admin/Department) */}
        {(user?.role === 'admin' || user?.role === 'department') && (
          <>
            {tab === 1 && <Typography variant="h6" sx={{ p: 4, textAlign: 'center' }}>Smart Alerts System (To be migrated from previous design)</Typography>}
            {tab === 2 && <Typography variant="h6" sx={{ p: 4, textAlign: 'center' }}>Emergency Contacts List (To be migrated from previous design)</Typography>}
            {tab === 3 && <Typography variant="h6" sx={{ p: 4, textAlign: 'center' }}>My Reports & Dispatch Board (To be migrated from previous design)</Typography>}
          </>
        )}

      </Container>

      {/* Map Selection Dialog */}
      <Dialog open={mapDialogOpen} onClose={() => setMapDialogOpen(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 800, color: '#1a202c' }}>Select Location on Map</DialogTitle>
        <DialogContent dividers sx={{ p: 0, height: 400 }}>
          <MapContainer bounds={HIMACHAL_BOUNDS} center={HIMACHAL_CENTER} zoom={8} minZoom={8} maxBounds={HIMACHAL_BOUNDS} maxBoundsViscosity={1.0} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
            <LocationSelector onSelect={(latlng) => {
              setMapLocation(latlng);
              setEmergencyForm((prev) => ({ ...prev, location: `${latlng.lat.toFixed(6)}, ${latlng.lng.toFixed(6)}` }));
            }} />
            {mapLocation && <Marker position={[mapLocation.lat, mapLocation.lng]} />}
          </MapContainer>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setMapDialogOpen(false)} sx={{ fontWeight: 700, color: '#64748b' }}>Cancel</Button>
          <Button onClick={() => setMapDialogOpen(false)} variant="contained" sx={{ fontWeight: 700, bgcolor: '#2a5a41', '&:hover': { bgcolor: '#1e422f' } }}>Confirm Location</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}