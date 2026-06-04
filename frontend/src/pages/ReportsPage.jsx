import React from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import TopNavBar from '../components/TopNavBar';
import InsertPhotoRoundedIcon from '@mui/icons-material/InsertPhotoRounded';
import VideocamRoundedIcon from '@mui/icons-material/VideocamRounded';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
import LayersRoundedIcon from '@mui/icons-material/LayersRounded';
import RadioButtonUncheckedRoundedIcon from '@mui/icons-material/RadioButtonUncheckedRounded';

const reportTypes = [
  { value: 'landslide', label: 'Landslide' },
  { value: 'road-block', label: 'Road Blockage' },
  { value: 'bridge-damage', label: 'Bridge Damage' },
  { value: 'flood', label: 'Flood' },
];

const departments = [
  { value: 'response', label: 'Response Team' },
  { value: 'medical', label: 'Medical Team' },
  { value: 'logistics', label: 'Logistics Team' },
  { value: 'communications', label: 'Communications' },
];

const severityOptions = [
  { label: 'Low', color: 'success' },
  { label: 'Medium', color: 'warning' },
  { label: 'High', color: 'error' },
];

export default function ReportsPage() {
  const [tab, setTab] = React.useState(0);
  const [reportType, setReportType] = React.useState('landslide');
  const [department, setDepartment] = React.useState('response');
  const [severity, setSeverity] = React.useState('Medium');

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <TopNavBar />
<<<<<<< HEAD
      <Box
        sx={{
          backgroundImage: `linear-gradient(90deg, rgba(239,246,255,0.95), rgba(239,246,255,0.65)), url('/assets/heroin.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          py: { xs: 6, md: 8 },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Stack spacing={2}>
                <Typography variant="overline" color="primary" fontWeight={700}>Field Reports</Typography>
                <Typography variant="h3" fontWeight={900} sx={{ maxWidth: 680 }}>
                  Submit accurate field reports even in offline mode.
                </Typography>
                <Typography color="text.secondary" sx={{ maxWidth: 640, fontSize: 18 }}>
                  All reports are GPS stamped, time locked and photo verified to ensure authentic data. Capture verified observations and sync automatically when internet is available.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button variant="contained" color="primary" size="large">New Report</Button>
                  <Button variant="outlined" color="primary" size="large">View Offline Reports</Button>
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={12} md={5}>
              <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 24px 60px rgba(15,23,42,0.08)' }}>
                <Stack spacing={2}>
                  {[
                    { title: 'Offline Mode', subtitle: 'Works without internet', icon: <LayersRoundedIcon sx={{ color: '#0b6b57' }} /> },
                    { title: 'Fake-Proof Photos', subtitle: 'Capture in-app with GPS & time lock', icon: <InsertPhotoRoundedIcon sx={{ color: '#0b6b57' }} /> },
                    { title: 'Verified Data', subtitle: 'Accurate, trusted and secure', icon: <CheckCircleRoundedIcon sx={{ color: '#0b6b57' }} /> },
                    { title: 'Auto Sync', subtitle: 'Reports sync when internet is available', icon: <CloudUploadRoundedIcon sx={{ color: '#0b6b57' }} /> },
                  ].map((item) => (
                    <Paper key={item.title} sx={{ p: 2, bgcolor: '#ffffff' }}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ bgcolor: '#dbeafe', color: '#0b6b57' }}>{item.icon}</Avatar>
                        <Box>
                          <Typography fontWeight={800}>{item.title}</Typography>
                          <Typography variant="body2" color="text.secondary">{item.subtitle}</Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
=======
>>>>>>> e989cfe2bcc18f846014f035bd635e8ed83f5fc8

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Grid container spacing={4}>
          <Grid item xs={12} lg={8}>
            <Card sx={{ borderRadius: 4, boxShadow: '0 20px 40px rgba(15,23,42,0.08)' }}>
              <CardContent>
                <Tabs value={tab} onChange={(event, value) => setTab(value)} variant="scrollable" scrollButtons="auto" sx={{ mb: 3 }}>
                  <Tab label="New Report" />
                  <Tab label="My Reports" />
                  <Tab label="Offline Reports (3)" />
                  <Tab label="Report Templates" />
                </Tabs>

                {tab === 0 && (
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <TextField
                          select
                          label="Report Type"
                          value={reportType}
                          onChange={(e) => setReportType(e.target.value)}
                        >
                          {reportTypes.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Location"
                        placeholder="Tap to capture location"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton edge="end"><PlaceRoundedIcon /></IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Date & Time"
                        type="datetime-local"
                        defaultValue="2025-10-05T10:30"
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box>
                        <Typography variant="body2" fontWeight={700} sx={{ mb: 1 }}>Severity Level</Typography>
                        <Stack direction="row" spacing={1}>
                          {severityOptions.map((option) => (
                            <Button
                              key={option.label}
                              variant={severity === option.label ? 'contained' : 'outlined'}
                              color={option.color}
                              onClick={() => setSeverity(option.label)}
                              sx={{ textTransform: 'none', minWidth: 96 }}
                            >
                              {option.label}
                            </Button>
                          ))}
                        </Stack>
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Description"
                        placeholder="Provide details about the incident / situation..."
                        multiline
                        minRows={5}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Paper sx={{ p: 2, border: '1px dashed #cbd5e1', borderRadius: 2, minHeight: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                        <InsertPhotoRoundedIcon sx={{ fontSize: 40, color: '#0b6b57' }} />
                        <Typography fontWeight={700} sx={{ mt: 1 }}>Capture Photo</Typography>
                        <Typography variant="caption" color="text.secondary" align="center">Photos will be GPS & time stamped</Typography>
                        <Button variant="outlined" startIcon={<CloudUploadRoundedIcon />} sx={{ mt: 2 }}>Upload Photo</Button>
                      </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Paper sx={{ p: 2, border: '1px dashed #cbd5e1', borderRadius: 2, minHeight: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                        <VideocamRoundedIcon sx={{ fontSize: 40, color: '#0b6b57' }} />
                        <Typography fontWeight={700} sx={{ mt: 1 }}>Capture Video (Optional)</Typography>
                        <Typography variant="caption" color="text.secondary" align="center">Video will be GPS & time stamped</Typography>
                        <Button variant="outlined" startIcon={<CloudUploadRoundedIcon />} sx={{ mt: 2 }}>Upload Video</Button>
                      </Paper>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        select
                        label="Department / Team"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                      >
                        {departments.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField fullWidth label="Reported By" placeholder="Enter your name" />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField fullWidth label="Contact Number" placeholder="Enter mobile number" />
                    </Grid>
                    <Grid item xs={12}>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="flex-end">
                        <Button variant="outlined" color="inherit" startIcon={<RadioButtonUncheckedRoundedIcon />}>Save Draft</Button>
                        <Button variant="contained" color="success">Submit Report</Button>
                      </Stack>
                    </Grid>
                  </Grid>
                )}

                {tab !== 0 && (
                  <Box sx={{ py: 8, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary">Content for this tab is coming soon.</Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Stack spacing={3}>
              <Paper sx={{ p: 3, borderRadius: 4 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                  <Typography variant="h6" fontWeight={800}>Recent Reports</Typography>
                  <Button size="small">View All</Button>
                </Stack>
                {[
                  { title: 'Landslide Near NH-5', location: 'Kullu, Himachal Pradesh', time: '19 May 2024, 09:15 AM', severity: 'High' },
                  { title: 'Road Blockage Due to Snow', location: 'Lahaul & Spiti, Himachal', time: '19 May 2024, 08:40 AM', severity: 'Medium' },
                  { title: 'Bridge Damage Report', location: 'Mandi, Himachal Pradesh', time: '19 May 2024, 07:30 AM', severity: 'Low' },
                ].map((item) => (
                  <Paper key={item.title} sx={{ p: 2, mb: 1, bgcolor: '#f8fafc' }}>
                    <Stack spacing={1}>
                      <Typography fontWeight={700}>{item.title}</Typography>
                      <Typography variant="caption" color="text.secondary">{item.location}</Typography>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="caption" color="text.secondary">{item.time}</Typography>
                        <Chip label={item.severity} size="small" color={item.severity === 'High' ? 'error' : item.severity === 'Medium' ? 'warning' : 'success'} />
                      </Stack>
                    </Stack>
                  </Paper>
                ))}
              </Paper>

<<<<<<< HEAD
              <Paper sx={{ p: 3, borderRadius: 4, bgcolor: '#f8fafc' }}>
                <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>Offline Status</Typography>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                  <Avatar sx={{ bgcolor: '#d1fae5', color: '#047857' }}>↻</Avatar>
                  <Box>
                    <Typography fontWeight={700}>You are currently in Offline Mode</Typography>
                    <Typography variant="body2" color="text.secondary">Reports will be automatically synced when connection is available.</Typography>
                  </Box>
                </Stack>
                <Button variant="contained" size="small">View Offline Reports (3)</Button>
              </Paper>

=======
>>>>>>> e989cfe2bcc18f846014f035bd635e8ed83f5fc8
              <Paper sx={{ p: 3, borderRadius: 4 }}>
                <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>Report Guidelines</Typography>
                <Stack spacing={1} component="ul" sx={{ pl: 2, m: 0, color: 'text.secondary' }}>
                  <Typography component="li">Capture photos using the in-app camera only.</Typography>
                  <Typography component="li">Ensure location is accurate before submitting.</Typography>
                  <Typography component="li">Provide clear and detailed description.</Typography>
                  <Typography component="li">Do not upload old photos from gallery.</Typography>
                </Stack>
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
