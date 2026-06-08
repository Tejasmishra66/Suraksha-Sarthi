import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Card,
  ButtonGroup,
  CardContent,
  Container,
  Grid,
  Stack,
  Tab,
  Tabs,
  TextField,
  Divider, // Added Divider for better visual separation
  ButtonBase, // Import for clickable image/video upload area
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Typography,
  Paper,
  Avatar,
  Chip,
  List, ListItem, ListItemText, ListItemAvatar, ListItemSecondaryAction, // Added for contacts
  InputAdornment,
  IconButton,
  FormGroup,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  keyframes,
} from '@mui/material';
import ReportRoundedIcon from '@mui/icons-material/ReportRounded';
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'; // Icon for deleting contact
import AddRoundedIcon from '@mui/icons-material/AddRounded'; // Icon for adding contact
import CameraAltRoundedIcon from '@mui/icons-material/CameraAltRounded'; // Icon for image upload
import CallRoundedIcon from '@mui/icons-material/CallRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import TopNavBar from '../components/TopNavBar';
import ContactsRoundedIcon from '@mui/icons-material/ContactsRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded';
import RadioButtonUncheckedRoundedIcon from '@mui/icons-material/RadioButtonUncheckedRounded';
import { createAlert, createIncident, uploadIncidentMedia } from '../api/client';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Fix leaflet default marker icon paths when using Vite.
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
  { value: 'medical', label: 'Medical Emergency' },
  { value: 'fire', label: 'Fire Incident' },
  { value: 'natural-disaster', label: 'Natural Disaster (Flood, Landslide)' },
  { value: 'accident', label: 'Accident' },
  { value: 'other', label: 'Other' },
];

const departments = [
  { value: 'response', label: 'Rapid Response Team' },
  { value: 'medical', label: 'Medical & First Aid' },
  { value: 'logistics', label: 'Logistics & Supply' },
  { value: 'communications', label: 'Communications Ops' },
];

const severityOptions = [
  { label: 'Low', color: 'success' },
  { label: 'Medium', color: 'warning' },
  { label: 'High', color: 'error' },
];

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const mockMyReports = [
  { id: 1, type: 'Natural Disaster', description: 'Landslide blocking road near Kullu', location: 'Kullu, NH-3', time: '2 hours ago', status: 'Pending', color: 'warning' },
  { id: 2, type: 'Medical Emergency', description: 'Person injured in fall at Manali', location: 'Manali, Old Manali', time: '5 hours ago', status: 'Acknowledged', color: 'info' },
  { id: 3, type: 'Accident', description: 'Car accident on Mandi-Shimla highway', location: 'Mandi-Shimla Highway', time: '1 day ago', status: 'Resolved', color: 'success' },
];

const mockActiveAlerts = [
  { id: 1, title: 'Heavy Rainfall Warning', location: 'Kullu, Mandi, Shimla', time: '19 May 2024, 09:15 AM', severity: 'High' },
  { id: 2, title: 'Landslide Warning', location: 'Kinnaur, Chamba', time: '19 May 2024, 08:40 AM', severity: 'Medium' },
  { id: 3, title: 'Rescue Operation Ongoing', location: 'Lahaul & Spiti', time: '19 May 2024, 07:20 AM', severity: 'Low' },
];

const officialHelplines = [
  { label: 'Police', number: '100', icon: <CallRoundedIcon /> },
  { label: 'Fire Service', number: '101', icon: <CallRoundedIcon /> },
  { label: 'Ambulance', number: '102', icon: <CallRoundedIcon /> },
  { label: 'State Emergency Operation Centre', number: '1070', icon: <CallRoundedIcon /> },
  { label: 'National Disaster Response Force', number: '1078', icon: <CallRoundedIcon /> },
];

const mockOperationalContacts = [
  { id: 1, name: 'Cmdr. Rahul Sharma', role: 'Alpha Unit Commander', number: '9876543210' },
  { id: 2, name: 'Dr. Priya Devi', role: 'Chief Field Medic', number: '9988776655' },
];


export default function EmergencyPage() {
  const [tab, setTab] = React.useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emergencyForm, setEmergencyForm] = useState({
    emergencyType: '',
    severity: 'Medium',
    department: 'response',
    location: '',
    description: '',
    name: '',
    mobile: '',
  });
  const [alertPreferences, setAlertPreferences] = useState({
    alertLocation: '',
    alertRadius: 10,
    monitoredDisasters: {
      Flood: true,
      Landslide: true,
      earthquake: false,
      Fire: false,
      Drought: false,
      Other: false,
    },
    notificationMethods: {
      sms: true,
      email: false,
      app: true,
    },
  });
  const [operationalContacts, setOperationalContacts] = useState(mockOperationalContacts);
  const [newContact, setNewContact] = useState({ name: '', role: '', number: '' });
  const [mapDialogOpen, setMapDialogOpen] = useState(false);
  const [mapLocation, setMapLocation] = useState(null);
  const fileInputRef = useRef(null);

  const handleEmergencyFormChange = (e) => {
    setEmergencyForm({ ...emergencyForm, [e.target.name]: e.target.value });
  };

  const handleSeverityChange = (newSeverity) => {
    setEmergencyForm({ ...emergencyForm, severity: newSeverity });
  };

  const handleAlertPreferenceChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    if (type === 'checkbox') {
      if (name === 'monitoredDisasters') {
        // This is a "Monitored Disaster Types" checkbox
        setAlertPreferences((prev) => ({
          ...prev,
          monitoredDisasters: {
            ...prev.monitoredDisasters,
            [value]: checked, // 'value' correctly holds the disaster type (e.g., "Flood")
          },
        }));
      } else {
        // This must be a "Notification Methods" checkbox (e.g., name="sms", name="email", name="app")
        setAlertPreferences((prev) => ({
          ...prev,
          notificationMethods: { ...prev.notificationMethods, [name]: checked },
        }));
      }
    } else {
      setAlertPreferences({ ...alertPreferences, [name]: value });
    }
  };

  const handleNewContactChange = (e) => setNewContact({ ...newContact, [e.target.name]: e.target.value });
  const addOperationalContact = () => {
    if (newContact.name && newContact.number) {
      setOperationalContacts([...operationalContacts, { ...newContact, id: operationalContacts.length + 1 }]);
      setNewContact({ name: '', role: '', number: '' });
    }
  };
  const deleteOperationalContact = (id) => {
    setOperationalContacts(operationalContacts.filter(contact => contact.id !== id));
  };

  const handleEmergencySubmit = async (e) => {
    e.preventDefault();

    if (!emergencyForm.emergencyType) {
      alert('Please select the Type of Emergency.');
      return;
    }

    setIsSubmitting(true);
    
    // Extract latitude and longitude if the location was picked from the map
    let lat = null;
    let lng = null;
    const coords = emergencyForm.location.split(',');
    if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
      lat = parseFloat(coords[0].trim());
      lng = parseFloat(coords[1].trim());
    }

    try {
      // 1. Log the Incident to the database
      const incident = await createIncident({
        title: emergencyForm.emergencyType.toUpperCase() + ' Emergency',
        description: emergencyForm.description,
        disasterType: emergencyForm.emergencyType,
        lat: lat,
        lng: lng,
        address: lat ? '' : emergencyForm.location,
        agencyAssigned: emergencyForm.department,
        offline: false,
      });

      // 2. Broadcast as an Alert so it instantly appears on the Live Incident Map
      if (lat && lng) {
        await createAlert({
          disasterType: emergencyForm.emergencyType,
          lat: lat,
          lng: lng,
          radiusKm: 5,
          severity: emergencyForm.severity.toLowerCase(),
        });
      }

      // 3. Upload Photo/Video if selected
      const file = fileInputRef.current?.files?.[0];
      if (file && incident?.id) {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('metadata', JSON.stringify({ lat, lng, timestamp: new Date().toISOString() }));
        await uploadIncidentMedia(incident.id, fd);
      }

      alert('Incident logged and broadcasted to the Live Map successfully!');
      setEmergencyForm({ 
        emergencyType: '', 
        severity: 'Medium',
        department: 'response',
        location: '', 
        description: '', 
        name: '', 
        mobile: '' 
      });
    } catch (error) {
      console.error('Failed to log emergency:', error);
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message || 'Unknown error';
      alert(`Error logging the emergency: \n${errorMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: '#f4faf4',
      backgroundImage: 'radial-gradient(#bbf7d0 1px, transparent 1px)',
      backgroundSize: '24px 24px', 
    }}>
      <TopNavBar />

      {/* TABS + CONTENT */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 }, animation: `${fadeInUp} 0.6s ease-out forwards` }}>
        <Paper sx={{ p: 1.5, mb: 4, borderRadius: 4, boxShadow: '0 18px 40px rgba(15,23,42,0.08)', border: '1px solid #f1f5f9' }}>
          <Tabs value={tab} onChange={(e, v) => setTab(v)} variant="scrollable" scrollButtons="auto" allowScrollButtonsMobile indicatorColor="error" textColor="error">
            <Tab icon={<CampaignRoundedIcon />} iconPosition="start" label="Log Incident" sx={{ textTransform: 'none', fontWeight: 700, fontSize: '1rem', minHeight: 48 }} />
            <Tab icon={<NotificationsActiveRoundedIcon />} iconPosition="start" label="Sector Alerts" sx={{ textTransform: 'none', fontWeight: 700, fontSize: '1rem', minHeight: 48 }} />
            <Tab icon={<ContactsRoundedIcon />} iconPosition="start" label="Command Contacts" sx={{ textTransform: 'none', fontWeight: 700, fontSize: '1rem', minHeight: 48 }} />
            <Tab icon={<HistoryRoundedIcon />} iconPosition="start" label="Incident Logs" sx={{ textTransform: 'none', fontWeight: 700, fontSize: '1rem', minHeight: 48 }} />
          </Tabs>
        </Paper>

        {tab === 0 && (
          <form onSubmit={handleEmergencySubmit}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, boxShadow: '0 18px 40px rgba(15,23,42,0.08)' }}>
                  <Typography variant="h5" fontWeight={800} sx={{ mb: 3 }}>Log Critical Field Incident</Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth required>
                        <InputLabel id="emergency-type-label">Type of Emergency</InputLabel>
                        <Select
                          labelId="emergency-type-label"
                          id="emergency-type-select"
                          name="emergencyType"
                          value={emergencyForm.emergencyType}
                          label="Type of Emergency"
                          onChange={handleEmergencyFormChange}
                        >
                          {emergencyTypes.map((type) => (
                            <MenuItem key={type.value} value={type.value}>
                              {type.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Location"
                        name="location"
                        placeholder="Search location or enter address"
                        value={emergencyForm.location}
                        onChange={handleEmergencyFormChange}
                        required
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={() => setMapDialogOpen(true)} color="error" title="Select on Map"><PlaceRoundedIcon /></IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Box>
                        <Typography variant="body2" fontWeight={700} sx={{ mb: 1, color: 'text.secondary' }}>Incident Severity</Typography>
                        <Stack direction="row" spacing={1}>
                          {severityOptions.map((option) => (
                            <Button
                              key={option.label}
                              variant={emergencyForm.severity === option.label ? 'contained' : 'outlined'}
                              color={option.color}
                              onClick={() => handleSeverityChange(option.label)}
                              sx={{ textTransform: 'none', flex: 1, fontWeight: 700 }}
                            >
                              {option.label}
                            </Button>
                          ))}
                        </Stack>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Dispatch Department</InputLabel>
                        <Select
                          name="department"
                          value={emergencyForm.department}
                          label="Dispatch Department"
                          onChange={handleEmergencyFormChange}
                        >
                          {departments.map((option) => (
                            <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Description"
                        name="description"
                        multiline
                        minRows={4}
                        placeholder="Provide details about the situation..."
                        value={emergencyForm.description}
                        onChange={handleEmergencyFormChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <ButtonBase
                        component="label"
                        htmlFor="upload-photo-video"
                        sx={{
                          border: '2px dashed #cbd5e1',
                          p: 2,
                          borderRadius: 3,
                          height: '100%',
                          width: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: '#f8fafc',
                          transition: 'all 0.2s',
                          '&:hover': {
                            bgcolor: '#f1f5f9',
                            borderColor: '#94a3b8',
                            transform: 'translateY(-2px)',
                          },
                        }}
                      >
                        <CameraAltRoundedIcon sx={{ fontSize: 40, color: '#0f766e', mb: 1 }} />
                        <Typography variant="body1" fontWeight={700}>Upload Photo / Video</Typography>
                        <Typography variant="caption" color="text.secondary">Max file size 10MB</Typography>
                        <input
                          type="file"
                          id="upload-photo-video"
                          ref={fileInputRef}
                          accept="image/*,video/*"
                          hidden
                        />
                      </ButtonBase>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Reporting Officer Name / ID" name="name" value={emergencyForm.name} onChange={handleEmergencyFormChange} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Radio Callsign / Contact" name="mobile" value={emergencyForm.mobile} onChange={handleEmergencyFormChange} type="tel" />
                    </Grid>
                    <Grid item xs={12}>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2 }} justifyContent="flex-end">
                        <Button variant="outlined" color="inherit" size="large" startIcon={<RadioButtonUncheckedRoundedIcon />} sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 3, px: 4 }}>Save Draft (Offline)</Button>
                        <Button type="submit" disabled={isSubmitting} variant="contained" color="error" size="large" fullWidth sx={{ textTransform: 'none', fontWeight: 800, borderRadius: 3, py: 1.5, fontSize: '1.1rem', boxShadow: '0 8px 20px rgba(239, 68, 68, 0.3)' }}>
                          {isSubmitting ? <CircularProgress size={26} color="inherit" /> : 'Submit Incident Log'}
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              <Grid item xs={12} md={4}>
                <Stack spacing={3}>
                  <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 18px 30px rgba(15,23,42,0.08)' }}>
                    <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 0.5 }}>Recent Sector Alerts</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>Based on your preferences</Typography>
                    <Stack spacing={1.5}>
                      {mockActiveAlerts.slice(0, 2).map(alert => (
                        <Paper key={alert.id} variant="outlined" sx={{ p: 2, borderRadius: 3, bgcolor: '#fdf2f8', borderColor: '#fbcfe8' }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
                            <Typography variant="body2" fontWeight={700} color="#9d174d">{alert.title}</Typography>
                            <Chip label={alert.severity} color={alert.severity === 'High' ? 'error' : alert.severity === 'Medium' ? 'warning' : 'info'} size="small" sx={{ height: 20, fontSize: '0.7rem', fontWeight: 700 }} />
                          </Stack>
                          <Typography variant="caption" color="#be185d" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><PlaceRoundedIcon sx={{ fontSize: 14 }} /> {alert.location}</Typography>
                        </Paper>
                      ))}
                    </Stack>
                  </Paper>

                  <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 18px 30px rgba(15,23,42,0.08)' }}>
                    <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 2 }}>Standard Operating Procedures (SOPs)</Typography>
                    <List sx={{ p: 0 }}>
                      <ListItem disablePadding sx={{ mb: 1 }}>
                        <ListItemText primaryTypographyProps={{ variant: 'body2', color: 'text.secondary', fontWeight: 500 }} primary="• Verify scene safety and cordon off the perimeter." />
                      </ListItem>
                      <ListItem disablePadding sx={{ mb: 1 }}>
                        <ListItemText primaryTypographyProps={{ variant: 'body2', color: 'text.secondary', fontWeight: 500 }} primary="• Establish multi-agency communication link immediately." />
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemText primaryTypographyProps={{ variant: 'body2', color: 'text.secondary', fontWeight: 500 }} primary="• Relay situation updates to Command Center every 15 mins." />
                      </ListItem>
                    </List>
                  </Paper>
                </Stack>
              </Grid>
            </Grid>
          </form>
        )}

        {tab === 1 && (
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, boxShadow: '0 18px 40px rgba(15,23,42,0.08)' }}>
                <Typography variant="h5" fontWeight={800} sx={{ mb: 3 }}>Sector Alert Configuration</Typography>

                <Stack spacing={4}>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Alert Location & Radius</Typography>
                    <TextField
                      fullWidth
                      label="Monitor Location"
                      name="alertLocation"
                      value={alertPreferences.alertLocation}
                      onChange={handleAlertPreferenceChange}
                      placeholder="e.g., Kullu, Manali, Shimla"
                      sx={{ mb: 3 }}
                    />
                    <FormControl fullWidth>
                      <InputLabel>Alert Radius (km)</InputLabel>
                      <Select
                        name="alertRadius"
                        value={alertPreferences.alertRadius}
                        onChange={handleAlertPreferenceChange}
                        label="Alert Radius (km)"
                      >
                        {[5, 10, 20, 50].map(radius => (
                          <MenuItem key={radius} value={radius}>{radius} km</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  <Divider />

                  <Box>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Monitored Disaster Types</Typography>
                    <FormGroup row sx={{ gap: 2 }}>
                      {Object.entries(alertPreferences.monitoredDisasters).map(([type, checked]) => (
                        <FormControlLabel
                          key={type}
                          control={
                            <Checkbox
                              checked={checked}
                              onChange={handleAlertPreferenceChange}
                              name="monitoredDisasters"
                              value={type}
                              color="success"
                            />
                          }
                          label={<Typography variant="body2" fontWeight={600}>{type}</Typography>}
                        />
                      ))}
                    </FormGroup>
                  </Box>

                  <Divider />

                  <Box>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Notification Methods</Typography>
                    <FormGroup row sx={{ gap: 2 }}>
                      {Object.entries(alertPreferences.notificationMethods).map(([method, checked]) => (
                        <FormControlLabel
                          key={method}
                          control={
                            <Checkbox
                              checked={checked}
                              onChange={handleAlertPreferenceChange}
                              name={method}
                              color="success"
                            />
                          }
                          label={<Typography variant="body2" fontWeight={600}>{method.toUpperCase()}</Typography>}
                        />
                      ))}
                    </FormGroup>
                  </Box>

                  <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ pt: 2 }}>
                    <Button variant="outlined" color="inherit" sx={{ textTransform: 'none', borderRadius: 3, px: 3, fontWeight: 700 }}>Reset Defaults</Button>
                    <Button variant="contained" color="success" sx={{ textTransform: 'none', borderRadius: 3, px: 4, fontWeight: 700, boxShadow: '0 8px 16px rgba(16, 185, 129, 0.3)' }}>Save Preferences</Button>
                  </Stack>
                </Stack>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 18px 30px rgba(15,23,42,0.08)' }}>
                <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 2 }}>Active Operational Alerts</Typography>
                <Stack spacing={1.5}>
                  {mockActiveAlerts.map(alert => (
                    <Paper key={alert.id} variant="outlined" sx={{ p: 2, borderRadius: 3, bgcolor: '#f8fafc', borderColor: '#e2e8f0' }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
                        <Typography variant="body2" fontWeight={700} color="#1e293b">{alert.title}</Typography>
                        <Chip label={alert.severity} color={alert.severity === 'High' ? 'error' : alert.severity === 'Medium' ? 'warning' : 'info'} size="small" sx={{ height: 20, fontSize: '0.7rem', fontWeight: 700 }} />
                      </Stack>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><PlaceRoundedIcon sx={{ fontSize: 14 }} /> {alert.location}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}><AccessTimeRoundedIcon sx={{ fontSize: 14 }} /> {alert.time}</Typography>
                    </Paper>
                  ))}
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        )}

        {tab === 2 && (
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, boxShadow: '0 18px 40px rgba(15,23,42,0.08)' }}>
                <Typography variant="h5" fontWeight={800} sx={{ mb: 3 }}>National / State Emergency Lines</Typography>
                <Grid container spacing={2}>
                  {officialHelplines.map((contact, index) => (
                    <Grid item xs={12} sm={6} md={12} lg={6} key={index}>
                      <Paper variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, borderRadius: 3, borderColor: '#fca5a5', bgcolor: '#fff5f5', transition: 'all 0.2s', '&:hover': { borderColor: '#ef4444', boxShadow: '0 4px 12px rgba(239,68,68,0.15)', transform: 'translateY(-2px)' } }}>
                        <Avatar sx={{ bgcolor: '#ef4444', color: '#fff', width: 48, height: 48 }}>{contact.icon}</Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="body2" fontWeight={700} color="text.secondary">{contact.label}</Typography>
                          <Typography variant="h6" fontWeight={900} color="#991b1b">{contact.number}</Typography>
                        </Box>
                        <IconButton edge="end" aria-label="call" href={`tel:${contact.number}`} sx={{ bgcolor: '#22c55e', color: '#fff', '&:hover': { bgcolor: '#16a34a' }, width: 48, height: 48 }}>
                          <CallRoundedIcon />
                        </IconButton>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, boxShadow: '0 18px 40px rgba(15,23,42,0.08)' }}>
                <Typography variant="h5" fontWeight={800} sx={{ mb: 3 }}>Unit & Command Contacts</Typography>
                <List sx={{ p: 0, mb: 3 }}>
                  {operationalContacts.length === 0 && <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>No command contacts added yet.</Typography>}
                  {operationalContacts.map((contact, index) => (
                    <ListItem key={contact.id} divider={index !== operationalContacts.length - 1} sx={{ px: 0, py: 2 }}>
                      <ListItemAvatar><Avatar sx={{ bgcolor: '#e0f2fe', color: '#0369a1', fontWeight: 800 }}>{contact.name.charAt(0)}</Avatar></ListItemAvatar>
                      <ListItemText primaryTypographyProps={{ fontWeight: 700, color: '#0f172a' }} secondaryTypographyProps={{ fontWeight: 600, color: 'text.secondary', mt: 0.5 }} primary={contact.name} secondary={`${contact.role} • ${contact.number}`} />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="call" href={`tel:${contact.number}`} sx={{ mr: 1, bgcolor: '#dcfce7', color: '#16a34a', '&:hover': { bgcolor: '#bbf7d0' } }}><CallRoundedIcon fontSize="small" /></IconButton>
                        <IconButton edge="end" aria-label="delete" onClick={() => deleteOperationalContact(contact.id)} sx={{ bgcolor: '#fee2e2', color: '#ef4444', '&:hover': { bgcolor: '#fecaca' } }}><DeleteRoundedIcon fontSize="small" /></IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
                <Divider sx={{ my: 3 }} />
                <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 2 }}>Add Operational Contact</Typography>
                <Stack spacing={2.5}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={newContact.name}
                    onChange={handleNewContactChange}
                  />
                  <TextField
                    fullWidth
                    label="Role / Unit"
                    name="role"
                    value={newContact.role}
                    onChange={handleNewContactChange}
                    placeholder="e.g., Commander, Field Medic, Dispatcher"
                  />
                  <TextField
                    fullWidth
                    label="Mobile Number"
                    name="number"
                    value={newContact.number}
                    onChange={handleNewContactChange}
                    type="tel"
                  />
                  <Button variant="contained" color="success" size="large" startIcon={<AddRoundedIcon />} onClick={addOperationalContact} sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 3, boxShadow: '0 8px 16px rgba(16, 185, 129, 0.3)' }}>
                    Add Contact
                  </Button>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        )}

        {tab === 3 && (
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, boxShadow: '0 18px 40px rgba(15,23,42,0.08)' }}>
                <Typography variant="h5" fontWeight={800} sx={{ mb: 3 }}>Incidents Logged by You</Typography>
                {mockMyReports.length === 0 ? (
                  <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 8 }}>You haven't logged any incidents yet.</Typography>
                ) : (
                  <Stack spacing={3}>
                    {mockMyReports.map(report => (
                      <Paper key={report.id} variant="outlined" sx={{ p: 3, borderRadius: 3, borderColor: '#e2e8f0', transition: 'all 0.2s', '&:hover': { boxShadow: '0 10px 25px rgba(0,0,0,0.05)', borderColor: '#cbd5e1' } }}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2} sx={{ mb: 2 }}>
                          <Typography variant="h6" fontWeight={800} color="#0f172a">{report.type}</Typography>
                          <Chip
                            label={report.status}
                            color={report.color}
                            size="small"
                            sx={{ fontWeight: 700, borderRadius: 2 }}
                          />
                        </Stack>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>{report.description}</Typography>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ xs: 'flex-start', sm: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 28, height: 28, bgcolor: '#f1f5f9', color: '#64748b' }}><PlaceRoundedIcon sx={{ fontSize: 16 }} /></Avatar>
                            <Typography variant="body2" fontWeight={600} color="text.secondary">{report.location}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 28, height: 28, bgcolor: '#f1f5f9', color: '#64748b' }}><AccessTimeRoundedIcon sx={{ fontSize: 16 }} /></Avatar>
                            <Typography variant="body2" fontWeight={600} color="text.secondary">{report.time}</Typography>
                          </Box>
                          <Box sx={{ flexGrow: 1 }} />
                          <Button size="small" variant="text" color="primary" sx={{ textTransform: 'none', fontWeight: 700 }}>View Details</Button>
                        </Stack>
                      </Paper>
                    ))}
                  </Stack>
                )}
              </Paper>
            </Grid>
          </Grid>
        )}
      </Container>

      {/* Map Selection Dialog */}
      <Dialog open={mapDialogOpen} onClose={() => setMapDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle fontWeight={800}>Select Incident Location on Map</DialogTitle>
        <DialogContent dividers sx={{ p: 0, height: 400 }}>
          <MapContainer
            bounds={HIMACHAL_BOUNDS}
            center={HIMACHAL_CENTER}
            zoom={8}
            minZoom={8}
            maxBounds={HIMACHAL_BOUNDS}
            maxBoundsViscosity={1.0}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer 
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <LocationSelector onSelect={(latlng) => {
              setMapLocation(latlng);
              setEmergencyForm((prev) => ({ ...prev, location: `${latlng.lat.toFixed(6)}, ${latlng.lng.toFixed(6)}` }));
            }} />
            {mapLocation && (
              <Marker position={[mapLocation.lat, mapLocation.lng]} />
            )}
          </MapContainer>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setMapDialogOpen(false)} color="inherit">Cancel</Button>
          <Button onClick={() => setMapDialogOpen(false)} variant="contained" color="success">Confirm Location</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}