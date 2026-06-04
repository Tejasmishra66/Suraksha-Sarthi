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

const emergencyTypes = [
  { value: 'medical', label: 'Medical Emergency' },
  { value: 'fire', label: 'Fire Incident' },
  { value: 'natural-disaster', label: 'Natural Disaster (Flood, Landslide)' },
  { value: 'accident', label: 'Accident' },
  { value: 'other', label: 'Other' },
];

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

const mockPersonalContacts = [
  { id: 1, name: 'Rahul Sharma', relationship: 'Family', number: '9876543210' },
  { id: 2, name: 'Priya Devi', relationship: 'Friend', number: '9988776655' },
];


export default function EmergencyPage() {
  const [tab, setTab] = React.useState(0);
  const [emergencyForm, setEmergencyForm] = useState({
    emergencyType: '',
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
  const [personalContacts, setPersonalContacts] = useState(mockPersonalContacts);
  const [newContact, setNewContact] = useState({ name: '', relationship: '', number: '' });
  const fileInputRef = useRef(null);

  const handleEmergencyFormChange = (e) => {
    setEmergencyForm({ ...emergencyForm, [e.target.name]: e.target.value });
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
  const addPersonalContact = () => {
    if (newContact.name && newContact.number) {
      setPersonalContacts([...personalContacts, { ...newContact, id: personalContacts.length + 1 }]);
      setNewContact({ name: '', relationship: '', number: '' });
    }
  };
  const deletePersonalContact = (id) => {
    setPersonalContacts(personalContacts.filter(contact => contact.id !== id));
  };

  const handleEmergencySubmit = (e) => {
    e.preventDefault();
    console.log('Emergency Report Submitted:', emergencyForm);
    // Here you would typically send data to a backend API
    // Reset form after submission
    setEmergencyForm({ emergencyType: '', location: '', description: '', name: '', mobile: '' });
    // eslint-disable-next-line no-alert
    alert('Emergency report submitted!'); // Temporary alert for demonstration
  };

  return (
    <Box>
      <TopNavBar />
      {/* HERO */}
      <Box sx={{ backgroundImage: `linear-gradient(0deg, rgba(3,37,27,0.6), rgba(3,37,27,0.25)), url('/assets/heroin.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center', color: 'white', py: 8 }}>
        <Container maxWidth="lg">
          <Grid container alignItems="center">
            <Grid item xs={12} md={8}>
              <Stack spacing={1}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: '#ef4444' }}> <ReportRoundedIcon /> </Avatar>
                  <Typography variant="h4" fontWeight={900}>Emergency</Typography>
                </Stack>
                <Typography variant="body1" sx={{ maxWidth: 700 }}>Report emergencies, raise alerts and get immediate help from the right teams.</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                <Paper sx={{ display: 'inline-block', p: 2, bgcolor: 'rgba(255,255,255,0.08)' }}>
                  <Stack spacing={1}>
                    <Typography variant="subtitle2">24x7 Helpline</Typography>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <CallRoundedIcon />
                      <Box>
                        <Typography fontWeight={800}>1070</Typography>
                        <Typography variant="caption">State Emergency Operation Centre</Typography>
                      </Box>
                    </Stack>
                  </Stack>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box >

      {/* TABS + FORM */}
      <Container maxWidth="lg" sx={{ mt: -6 }}>
        <Card sx={{ borderRadius: 3, p: 0 }}>
          <CardContent>
            <Tabs value={tab} onChange={(e, v) => setTab(v)} variant="fullWidth" sx={{ mb: 3 }}>
              <Tab label="Report Emergency" />
              <Tab label="Smart Alerts" />
              <Tab label="Emergency Contacts" />
              <Tab label="My Reports" />
            </Tabs>

            {tab === 0 && (
              <form onSubmit={handleEmergencySubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={8}>
                    <Card sx={{ p: 2 }}>
                      <CardContent>
                        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Report a New Emergency</Typography>

                        <Grid container spacing={2}>
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
                                    <IconButton><PlaceRoundedIcon /></IconButton>
                                  </InputAdornment>
                                ),
                              }}
                            />
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
                                border: '2px dashed #d1d5db',
                                p: 2,
                                borderRadius: 2,
                                height: '100%',
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: '#fbfbfb',
                                '&:hover': {
                                  bgcolor: '#f5f5f5',
                                  borderColor: '#a0aec0',
                                },
                              }}
                            >
                              <CameraAltRoundedIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
                              <Typography variant="body2" fontWeight={700} sx={{ mt: 1 }}>Upload Photo / Video</Typography>
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
                            <TextField fullWidth label="Your Name" name="name" value={emergencyForm.name} onChange={handleEmergencyFormChange} />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Mobile Number" name="mobile" value={emergencyForm.mobile} onChange={handleEmergencyFormChange} type="tel" />
                          </Grid>
                          <Grid item xs={12}>
                            <Stack direction="row" spacing={2} justifyContent={{ xs: 'flex-start', sm: 'flex-end' }} sx={{ mt: 2 }}>
                              <Button variant="outlined" color="inherit" onClick={() => setEmergencyForm({ emergencyType: '', location: '', description: '', name: '', mobile: '' })}>Reset</Button>
                              <Button type="submit" variant="contained" color="error">Submit Report</Button>
                            </Stack>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Stack spacing={2}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle1" fontWeight={800}>Recent Alerts</Typography>
                        <Typography variant="caption" color="text.secondary">Based on your preferences</Typography>
                        <Stack spacing={1} sx={{ mt: 1 }}>
                          {mockActiveAlerts.slice(0, 2).map(alert => (
                            <Paper key={alert.id} variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
                              <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography variant="body2" fontWeight={600}>{alert.title}</Typography>
                                <Chip label={alert.severity} color={alert.severity === 'High' ? 'error' : alert.severity === 'Medium' ? 'warning' : 'info'} size="small" />
                              </Stack>
                              <Typography variant="caption" color="text.secondary">{alert.location} • {alert.time}</Typography>
                            </Paper>
                          ))}
                        </Stack>
                      </Paper>

                      <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle1" fontWeight={800}>Safety Tips</Typography>
                        <List sx={{ mt: 1, pl: 0 }}>
                          <ListItem disablePadding>
                            <ListItemText primary="• Move to higher ground immediately" />
                          </ListItem>
                          <ListItem disablePadding>
                            <ListItemText primary="• Avoid river banks and landslide areas" />
                          </ListItem>
                          <ListItem disablePadding>
                            <ListItemText primary="• Stay updated through official channels" />
                          </ListItem>
                        </List>
                      </Paper>
                    </Stack>
                  </Grid>
                </Grid>
              </form>
            )}

            {tab === 1 && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Card sx={{ p: 2 }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Smart Alerts Configuration</Typography>

                      <Stack spacing={3}>
                        <Box>
                          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>Alert Location & Radius</Typography>
                          <TextField
                            fullWidth
                            label="Monitor Location"
                            name="alertLocation"
                            value={alertPreferences.alertLocation}
                            onChange={handleAlertPreferenceChange}
                            placeholder="e.g., Kullu, Manali, Shimla"
                            sx={{ mb: 2 }}
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
                          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>Monitored Disaster Types</Typography>
                          <FormGroup row>
                            {Object.entries(alertPreferences.monitoredDisasters).map(([type, checked]) => (
                              <FormControlLabel
                                key={type}
                                control={
                                  <Checkbox
                                    checked={checked}
                                    onChange={handleAlertPreferenceChange}
                                    name="monitoredDisasters"
                                    value={type}
                                  />
                                }
                                label={type}
                              />
                            ))}
                          </FormGroup>
                        </Box>

                        <Divider />

                        <Box>
                          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>Notification Methods</Typography>
                          <FormGroup row>
                            {Object.entries(alertPreferences.notificationMethods).map(([method, checked]) => (
                              <FormControlLabel
                                key={method}
                                control={
                                  <Checkbox
                                    checked={checked}
                                    onChange={handleAlertPreferenceChange}
                                    name={method}
                                  />
                                }
                                label={method.toUpperCase()}
                              />
                            ))}
                          </FormGroup>
                        </Box>

                        <Stack direction="row" spacing={2} justifyContent="flex-end">
                          <Button variant="outlined" color="inherit">Reset</Button>
                          <Button variant="contained" color="primary">Save Preferences</Button>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1" fontWeight={800}>Your Active Alerts</Typography>
                    <Stack spacing={1} sx={{ mt: 1 }}>
                      {mockActiveAlerts.map(alert => (
                        <Paper key={alert.id} variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="body2" fontWeight={600}>{alert.title}</Typography>
                            <Chip label={alert.severity} color={alert.severity === 'High' ? 'error' : alert.severity === 'Medium' ? 'warning' : 'info'} size="small" />
                          </Stack>
                          <Typography variant="caption" color="text.secondary">{alert.location} • {alert.time}</Typography>
                        </Paper>
                      ))}
                    </Stack>
                  </Paper>
                </Grid>
              </Grid>
            )}

            {tab === 2 && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card sx={{ p: 2 }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Official Emergency Helplines</Typography>
                      <List>
                        {officialHelplines.map((contact, index) => (
                          <ListItem key={index} divider>
                            <ListItemAvatar><Avatar sx={{ bgcolor: '#ef4444' }}>{contact.icon}</Avatar></ListItemAvatar>
                            <ListItemText primary={contact.label} secondary={contact.number} />
                            <ListItemSecondaryAction>
                              <IconButton edge="end" aria-label="call" href={`tel:${contact.number}`}><CallRoundedIcon color="primary" /></IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card sx={{ p: 2 }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>My Personal Emergency Contacts</Typography>
                      <List>
                        {personalContacts.length === 0 && <Typography variant="body2" color="text.secondary">No personal contacts added yet.</Typography>}
                        {personalContacts.map((contact) => (
                          <ListItem key={contact.id} divider>
                            <ListItemAvatar><Avatar>{contact.name.charAt(0)}</Avatar></ListItemAvatar>
                            <ListItemText primary={contact.name} secondary={`${contact.relationship} • ${contact.number}`} />
                            <ListItemSecondaryAction>
                              <IconButton edge="end" aria-label="call" href={`tel:${contact.number}`} sx={{ mr: 0.5 }}><CallRoundedIcon color="primary" /></IconButton>
                              <IconButton edge="end" aria-label="delete" onClick={() => deletePersonalContact(contact.id)}><DeleteRoundedIcon color="error" /></IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        ))}
                      </List>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>Add New Contact</Typography>
                      <Stack spacing={2}>
                        <TextField
                          fullWidth
                          label="Name"
                          name="name"
                          value={newContact.name}
                          onChange={handleNewContactChange}
                        />
                        <TextField
                          fullWidth
                          label="Relationship"
                          name="relationship"
                          value={newContact.relationship}
                          onChange={handleNewContactChange}
                          placeholder="e.g., Family, Friend, Colleague"
                        />
                        <TextField
                          fullWidth
                          label="Mobile Number"
                          name="number"
                          value={newContact.number}
                          onChange={handleNewContactChange}
                          type="tel"
                        />
                        <Button variant="contained" color="success" startIcon={<AddRoundedIcon />} onClick={addPersonalContact}>
                          Add Contact
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}

            {tab === 3 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Card sx={{ p: 2 }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>My Submitted Reports</Typography>
                      {mockMyReports.length === 0 ? (
                        <Typography variant="body2" color="text.secondary">You haven't submitted any reports yet.</Typography>
                      ) : (
                        <Stack spacing={2}>
                          {mockMyReports.map(report => (
                            <Paper key={report.id} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                                <Typography variant="body1" fontWeight={700}>{report.type}</Typography>
                                <Chip
                                  label={report.status}
                                  color={report.color}
                                  size="small"
                                />
                              </Stack>
                              <Typography variant="body2" color="text.secondary">{report.description}</Typography>
                              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                                <PlaceRoundedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                                <Typography variant="caption" color="text.secondary">{report.location}</Typography>
                                <AccessTimeRoundedIcon fontSize="small" sx={{ ml: 2, color: 'text.secondary' }} />
                                <Typography variant="caption" color="text.secondary">{report.time}</Typography>
                              </Stack>
                              <Button size="small" variant="text" sx={{ mt: 1, textTransform: 'none' }}>View Details</Button>
                            </Paper>
                          ))}
                        </Stack>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}