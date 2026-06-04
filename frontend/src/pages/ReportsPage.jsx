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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import SyncIcon from '@mui/icons-material/Sync';
import EditIcon from '@mui/icons-material/Edit';
import FileCopyIcon from '@mui/icons-material/FileCopy';

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
  const [templateDialogOpen, setTemplateDialogOpen] = React.useState(false);
  const [selectedTemplate, setSelectedTemplate] = React.useState(null);
  const [filterStatus, setFilterStatus] = React.useState('all');
  
  // New Report Form States
  const [location, setLocation] = React.useState('');
  const [dateTime, setDateTime] = React.useState('2025-10-05T10:30');
  const [description, setDescription] = React.useState('');
  const [reportedBy, setReportedBy] = React.useState('');
  const [contactNumber, setContactNumber] = React.useState('');
  const [photos, setPhotos] = React.useState([]);
  const [videos, setVideos] = React.useState([]);
  const [submitDialogOpen, setSubmitDialogOpen] = React.useState(false);
  const [draftSaved, setDraftSaved] = React.useState(false);
  const [formErrors, setFormErrors] = React.useState({});
  const [photoPreviewOpen, setPhotoPreviewOpen] = React.useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = React.useState(0);

  // Calculate form completion percentage
  const calculateCompletion = () => {
    let completed = 0;
    let total = 7;
    if (location) completed++;
    if (dateTime) completed++;
    if (severity) completed++;
    if (description) completed++;
    if (reportedBy) completed++;
    if (contactNumber) completed++;
    if (photos.length > 0) completed++;
    return Math.round((completed / total) * 100);
  };

  // Auto-save draft to localStorage
  const saveDraft = React.useCallback(() => {
    const draft = {
      reportType,
      department,
      severity,
      location,
      dateTime,
      description,
      reportedBy,
      contactNumber,
      savedAt: new Date().toLocaleTimeString(),
    };
    localStorage.setItem('reportDraft', JSON.stringify(draft));
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 2000);
  }, [reportType, department, severity, location, dateTime, description, reportedBy, contactNumber]);

  // Auto-save every 30 seconds
  React.useEffect(() => {
    if (tab === 0 && (location || description || reportedBy)) {
      const interval = setInterval(saveDraft, 30000);
      return () => clearInterval(interval);
    }
  }, [tab, location, description, reportedBy, saveDraft]);

  // Load draft on mount
  React.useEffect(() => {
    const savedDraft = localStorage.getItem('reportDraft');
    if (savedDraft) {
      const draft = JSON.parse(savedDraft);
      setLocation(draft.location || '');
      setDescription(draft.description || '');
      setReportedBy(draft.reportedBy || '');
      setContactNumber(draft.contactNumber || '');
    }
  }, []);

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!location.trim()) errors.location = 'Location is required';
    if (!description.trim()) errors.description = 'Description is required';
    if (!reportedBy.trim()) errors.reportedBy = 'Reporter name is required';
    if (!contactNumber.trim()) errors.contactNumber = 'Contact number is required';
    if (!/^\d{10}$/.test(contactNumber.replace(/\D/g, ''))) {
      errors.contactNumber = 'Enter a valid 10-digit number';
    }
    if (photos.length === 0) errors.photos = 'At least one photo is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle photo upload
  const handlePhotoUpload = (event) => {
    const files = Array.from(event.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotos([...photos, {
          src: e.target.result,
          name: file.name,
          size: (file.size / 1024).toFixed(2),
          timestamp: new Date().toLocaleString(),
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Handle video upload
  const handleVideoUpload = (event) => {
    const files = Array.from(event.target.files);
    files.forEach((file) => {
      setVideos([...videos, {
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2),
        timestamp: new Date().toLocaleString(),
      }]);
    });
  };

  // Remove photo
  const removePhoto = (index) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

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
                    {/* Form Completion Progress Bar */}
                    <Grid item xs={12}>
                      <Stack spacing={1}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="body2" fontWeight={700}>Form Completion</Typography>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="body2" fontWeight={700} color="primary">{calculateCompletion()}%</Typography>
                            {draftSaved && (
                              <Chip label="Draft Saved" size="small" color="success" variant="outlined" />
                            )}
                          </Stack>
                        </Stack>
                        <Box sx={{ 
                          width: '100%', 
                          height: 8, 
                          bgcolor: '#e2e8f0', 
                          borderRadius: 4,
                          overflow: 'hidden'
                        }}>
                          <Box sx={{
                            width: `${calculateCompletion()}%`,
                            height: '100%',
                            bgcolor: '#0b6b57',
                            transition: 'width 0.3s ease'
                          }} />
                        </Box>
                      </Stack>
                    </Grid>

                    {/* Location Section */}
                    <Grid item xs={12}>
                      <Paper sx={{ p: 2.5, bgcolor: '#f0fdf4', border: '1px solid #86efac' }}>
                        <Stack spacing={2}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <PlaceRoundedIcon sx={{ color: '#0b6b57' }} />
                            <Typography fontWeight={700}>Location & Incident Details</Typography>
                          </Stack>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <FormControl fullWidth>
                                <TextField
                                  select
                                  label="Report Type *"
                                  value={reportType}
                                  onChange={(e) => setReportType(e.target.value)}
                                  error={!!formErrors.reportType}
                                  helperText={formErrors.reportType}
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
                                label="Location *"
                                placeholder="Enter exact location or tap to capture"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                error={!!formErrors.location}
                                helperText={formErrors.location || '📍 GPS will be auto-stamped'}
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <IconButton edge="end" color="primary"><PlaceRoundedIcon /></IconButton>
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="Date & Time *"
                                type="datetime-local"
                                value={dateTime}
                                onChange={(e) => setDateTime(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Box>
                                <Typography variant="body2" fontWeight={700} sx={{ mb: 1.5 }}>Severity Level *</Typography>
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
                          </Grid>
                        </Stack>
                      </Paper>
                    </Grid>

                    {/* Description Section */}
                    <Grid item xs={12}>
                      <Paper sx={{ p: 2.5, bgcolor: '#eff6ff', border: '1px solid #bfdbfe' }}>
                        <Stack spacing={2}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <DescriptionRoundedIcon sx={{ color: '#0b6b57' }} />
                            <Typography fontWeight={700}>Incident Description</Typography>
                          </Stack>
                          <TextField
                            fullWidth
                            label="Description *"
                            placeholder="Provide clear details about what you observed..."
                            multiline
                            minRows={5}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            error={!!formErrors.description}
                            helperText={formErrors.description || `${description.length}/500 characters`}
                            inputProps={{ maxLength: 500 }}
                          />
                        </Stack>
                      </Paper>
                    </Grid>

                    {/* Media Section */}
                    <Grid item xs={12}>
                      <Paper sx={{ p: 2.5, bgcolor: '#fdf2f8', border: '1px solid #fbcfe8' }}>
                        <Stack spacing={2}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <InsertPhotoRoundedIcon sx={{ color: '#0b6b57' }} />
                            <Typography fontWeight={700}>Media & Evidence *</Typography>
                          </Stack>
                          
                          <Grid container spacing={2}>
                            {/* Photo Upload */}
                            <Grid item xs={12} sm={6}>
                              <Paper sx={{ p: 2, border: '2px dashed #cbd5e1', borderRadius: 2, minHeight: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                                <InsertPhotoRoundedIcon sx={{ fontSize: 40, color: '#0b6b57', mb: 1 }} />
                                <Typography fontWeight={700}>Capture Photo</Typography>
                                <Typography variant="caption" color="text.secondary" align="center" sx={{ mb: 1 }}>📸 GPS & Time-stamped</Typography>
                                <Button 
                                  variant="outlined" 
                                  startIcon={<CloudUploadRoundedIcon />}
                                  component="label"
                                >
                                  Upload Photo
                                  <input hidden accept="image/*" multiple type="file" onChange={handlePhotoUpload} />
                                </Button>
                              </Paper>
                              {formErrors.photos && (
                                <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
                                  {formErrors.photos}
                                </Typography>
                              )}
                            </Grid>

                            {/* Video Upload */}
                            <Grid item xs={12} sm={6}>
                              <Paper sx={{ p: 2, border: '2px dashed #cbd5e1', borderRadius: 2, minHeight: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                                <VideocamRoundedIcon sx={{ fontSize: 40, color: '#0b6b57', mb: 1 }} />
                                <Typography fontWeight={700}>Capture Video</Typography>
                                <Typography variant="caption" color="text.secondary" align="center" sx={{ mb: 1 }}>(Optional) 🎥 GPS & Time-stamped</Typography>
                                <Button 
                                  variant="outlined" 
                                  startIcon={<CloudUploadRoundedIcon />}
                                  component="label"
                                >
                                  Upload Video
                                  <input hidden accept="video/*" multiple type="file" onChange={handleVideoUpload} />
                                </Button>
                              </Paper>
                            </Grid>
                          </Grid>

                          {/* Photo Gallery Preview */}
                          {photos.length > 0 && (
                            <Box>
                              <Typography variant="body2" fontWeight={700} sx={{ mb: 1 }}>📸 Photos ({photos.length})</Typography>
                              <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 1 }}>
                                {photos.map((photo, idx) => (
                                  <Paper 
                                    key={idx} 
                                    sx={{ 
                                      position: 'relative', 
                                      width: 100, 
                                      height: 100, 
                                      overflow: 'hidden',
                                      cursor: 'pointer',
                                      flexShrink: 0
                                    }}
                                    onClick={() => {
                                      setSelectedPhotoIndex(idx);
                                      setPhotoPreviewOpen(true);
                                    }}
                                  >
                                    <img src={photo.src} alt={`Photo ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <IconButton 
                                      size="small" 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        removePhoto(idx);
                                      }}
                                      sx={{ 
                                        position: 'absolute', 
                                        top: -8, 
                                        right: -8,
                                        bgcolor: 'rgba(239, 68, 68, 0.9)',
                                        color: 'white',
                                        '&:hover': { bgcolor: 'rgba(220, 38, 38, 1)' }
                                      }}
                                    >
                                      <DeleteIcon sx={{ fontSize: 16 }} />
                                    </IconButton>
                                  </Paper>
                                ))}
                              </Stack>
                            </Box>
                          )}

                          {/* Video List */}
                          {videos.length > 0 && (
                            <Box>
                              <Typography variant="body2" fontWeight={700} sx={{ mb: 1 }}>🎥 Videos ({videos.length})</Typography>
                              <Stack spacing={1}>
                                {videos.map((video, idx) => (
                                  <Paper key={idx} sx={{ p: 1.5, bgcolor: '#f8fafc' }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                      <Typography variant="body2">{video.name}</Typography>
                                      <Chip label={`${video.size} MB`} size="small" />
                                    </Stack>
                                  </Paper>
                                ))}
                              </Stack>
                            </Box>
                          )}
                        </Stack>
                      </Paper>
                    </Grid>

                    {/* Reporter Details Section */}
                    <Grid item xs={12}>
                      <Paper sx={{ p: 2.5, bgcolor: '#f5f3ff', border: '1px solid #e9d5ff' }}>
                        <Stack spacing={2}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Avatar sx={{ bgcolor: '#0b6b57', color: 'white', width: 32, height: 32 }}>👤</Avatar>
                            <Typography fontWeight={700}>Reporter Information</Typography>
                          </Stack>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                              <TextField
                                fullWidth
                                label="Department / Team *"
                                select
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
                              <TextField
                                fullWidth
                                label="Name *"
                                placeholder="Your full name"
                                value={reportedBy}
                                onChange={(e) => setReportedBy(e.target.value)}
                                error={!!formErrors.reportedBy}
                                helperText={formErrors.reportedBy}
                              />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <TextField
                                fullWidth
                                label="Contact Number *"
                                placeholder="10-digit number"
                                value={contactNumber}
                                onChange={(e) => setContactNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                error={!!formErrors.contactNumber}
                                helperText={formErrors.contactNumber}
                              />
                            </Grid>
                          </Grid>
                        </Stack>
                      </Paper>
                    </Grid>

                    {/* Action Buttons */}
                    <Grid item xs={12}>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="flex-end">
                        <Button 
                          variant="outlined" 
                          color="inherit" 
                          startIcon={<RadioButtonUncheckedRoundedIcon />}
                          onClick={saveDraft}
                        >
                          Save as Draft
                        </Button>
                        <Button 
                          variant="contained" 
                          color="error"
                          onClick={() => {
                            if (validateForm()) {
                              setSubmitDialogOpen(true);
                            }
                          }}
                        >
                          Review & Submit Report
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>
                )}

                {tab !== 0 && (
                  <Box>
                    {/* TAB 1: MY REPORTS */}
                    {tab === 1 && (
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
                            <TextField
                              placeholder="Search reports..."
                              size="small"
                              sx={{ flex: 1 }}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    📍
                                  </InputAdornment>
                                ),
                              }}
                            />
                            <TextField
                              select
                              label="Status"
                              value={filterStatus}
                              onChange={(e) => setFilterStatus(e.target.value)}
                              size="small"
                              sx={{ minWidth: 150 }}
                            >
                              <MenuItem value="all">All</MenuItem>
                              <MenuItem value="verified">Verified</MenuItem>
                              <MenuItem value="pending">Pending Review</MenuItem>
                              <MenuItem value="resolved">Resolved</MenuItem>
                            </TextField>
                          </Stack>
                        </Grid>
                        {[
                          { 
                            title: 'Landslide Near NH-5', 
                            location: 'Kullu, Himachal Pradesh', 
                            time: '19 May 2024, 09:15 AM', 
                            severity: 'High',
                            status: 'Verified',
                            description: 'Active landslide blocking NH-5, debris visible on roadside.',
                            images: 2,
                            reportedBy: 'Rajesh Kumar'
                          },
                          { 
                            title: 'Road Blockage Due to Snow', 
                            location: 'Lahaul & Spiti, Himachal', 
                            time: '19 May 2024, 08:40 AM', 
                            severity: 'Medium',
                            status: 'Verified',
                            description: 'Heavy snow accumulation blocking road access.',
                            images: 1,
                            reportedBy: 'Priya Singh'
                          },
                          { 
                            title: 'Bridge Damage Report', 
                            location: 'Mandi, Himachal Pradesh', 
                            time: '19 May 2024, 07:30 AM', 
                            severity: 'Low',
                            status: 'Pending Review',
                            description: 'Minor damage to bridge railing.',
                            images: 3,
                            reportedBy: 'Arjun Sharma'
                          },
                          { 
                            title: 'Flood Warning - River Overflow', 
                            location: 'Sirmour, Himachal Pradesh', 
                            time: '18 May 2024, 04:20 PM', 
                            severity: 'High',
                            status: 'Resolved',
                            description: 'River level rising dangerously near population centers.',
                            images: 4,
                            reportedBy: 'Vikram Patel'
                          },
                        ].map((item, idx) => (
                          <Grid item xs={12} key={idx}>
                            <Paper sx={{ p: 2.5, bgcolor: '#ffffff', border: '1px solid #e2e8f0' }}>
                              <Grid container spacing={2}>
                                <Grid item xs={12} sm={8}>
                                  <Stack spacing={1}>
                                    <Typography fontWeight={700} variant="body1">{item.title}</Typography>
                                    <Typography variant="caption" color="text.secondary">{item.location}</Typography>
                                    <Typography variant="body2" color="text.secondary">{item.description}</Typography>
                                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                      <Chip label={item.reportedBy} size="small" variant="outlined" />
                                      <Chip 
                                        label={`${item.images} images`} 
                                        size="small" 
                                        icon={<InsertPhotoRoundedIcon />}
                                        variant="outlined"
                                      />
                                    </Stack>
                                  </Stack>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                  <Stack spacing={1} alignItems="flex-end">
                                    <Stack direction="row" spacing={1}>
                                      <Chip 
                                        label={item.severity} 
                                        size="small" 
                                        color={item.severity === 'High' ? 'error' : item.severity === 'Medium' ? 'warning' : 'success'} 
                                      />
                                      <Chip 
                                        label={item.status} 
                                        size="small" 
                                        variant="outlined"
                                        color={item.status === 'Verified' ? 'success' : item.status === 'Resolved' ? 'info' : 'warning'}
                                      />
                                    </Stack>
                                    <Typography variant="caption" color="text.secondary">{item.time}</Typography>
                                    <Stack direction="row" spacing={1}>
                                      <IconButton size="small" title="View Details">
                                        <DescriptionRoundedIcon sx={{ fontSize: 18 }} />
                                      </IconButton>
                                      <IconButton size="small" title="Download">
                                        <DownloadIcon sx={{ fontSize: 18 }} />
                                      </IconButton>
                                    </Stack>
                                  </Stack>
                                </Grid>
                              </Grid>
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                    )}

                    {/* TAB 2: OFFLINE REPORTS */}
                    {tab === 2 && (
                      <Grid container spacing={2}>
                        {[
                          { 
                            title: 'Bridge Damage - Temporary Report', 
                            location: 'Mandi District (Last Known)', 
                            severity: 'Low',
                            created: '19 May 2024, 02:15 PM',
                            lastModified: '19 May 2024, 03:45 PM',
                            description: 'Offline report - will sync when internet is available',
                            images: 2
                          },
                          { 
                            title: 'Road Maintenance Required', 
                            location: 'Kangra Valley (Last Known)', 
                            severity: 'Low',
                            created: '19 May 2024, 12:30 PM',
                            lastModified: '19 May 2024, 01:15 PM',
                            description: 'Pothole reported on main road',
                            images: 1
                          },
                          { 
                            title: 'Water Supply Issue', 
                            location: 'Shimla (Last Known)', 
                            severity: 'Medium',
                            created: '19 May 2024, 10:45 AM',
                            lastModified: '19 May 2024, 11:20 AM',
                            description: 'Water pipeline rupture - needs immediate attention',
                            images: 3
                          },
                        ].map((item, idx) => (
                          <Grid item xs={12} key={idx}>
                            <Paper sx={{ p: 2.5, bgcolor: '#fff9e6', border: '2px solid #fbbf24' }}>
                              <Grid container spacing={2}>
                                <Grid item xs={12} sm={8}>
                                  <Stack spacing={1}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                      <SyncIcon sx={{ fontSize: 18, color: '#f59e0b' }} />
                                      <Typography fontWeight={700} variant="body1">{item.title}</Typography>
                                    </Stack>
                                    <Typography variant="caption" color="text.secondary">{item.location}</Typography>
                                    <Typography variant="body2" color="text.secondary">{item.description}</Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      Created: {item.created} • Modified: {item.lastModified}
                                    </Typography>
                                    <Chip 
                                      label={`${item.images} images`} 
                                      size="small" 
                                      icon={<InsertPhotoRoundedIcon />}
                                      variant="outlined"
                                      sx={{ width: 'fit-content' }}
                                    />
                                  </Stack>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                  <Stack spacing={1} alignItems="flex-end">
                                    <Chip 
                                      label={item.severity} 
                                      size="small" 
                                      color={item.severity === 'High' ? 'error' : item.severity === 'Medium' ? 'warning' : 'success'} 
                                    />
                                    <Stack direction="row" spacing={1}>
                                      <Button size="small" startIcon={<EditIcon />} variant="outlined">Edit</Button>
                                      <Button size="small" startIcon={<SyncIcon />} variant="contained">Sync</Button>
                                    </Stack>
                                  </Stack>
                                </Grid>
                              </Grid>
                            </Paper>
                          </Grid>
                        ))}
                        <Grid item xs={12}>
                          <Paper sx={{ p: 3, bgcolor: '#dbeafe', border: '1px solid #0284c7', borderRadius: 2 }}>
                            <Stack direction="row" spacing={2} alignItems="center">
                              <SyncIcon sx={{ fontSize: 28, color: '#0284c7' }} />
                              <Box>
                                <Typography fontWeight={700}>Auto-Sync Enabled</Typography>
                                <Typography variant="body2" color="text.secondary">Your offline reports will automatically sync when internet connection is restored.</Typography>
                              </Box>
                            </Stack>
                          </Paper>
                        </Grid>
                      </Grid>
                    )}

                    {/* TAB 3: REPORT TEMPLATES */}
                    {tab === 3 && (
                      <Grid container spacing={2}>
                        {[
                          { 
                            name: 'Landslide Assessment Template',
                            icon: '🏔️',
                            fields: ['Location', 'Size', 'Active Status', 'Risk Level', 'Photos', 'Recommended Action'],
                            reportType: 'landslide',
                            description: 'Comprehensive landslide evaluation form with GPS verification'
                          },
                          { 
                            name: 'Road Blockage Report',
                            icon: '🚗',
                            fields: ['Location', 'Blockage Type', 'Severity', 'Traffic Impact', 'Photos/Videos'],
                            reportType: 'road-block',
                            description: 'Quick report form for road obstructions and traffic issues'
                          },
                          { 
                            name: 'Bridge/Infrastructure Damage',
                            icon: '🌉',
                            fields: ['Location', 'Damage Type', 'Structural Integrity', 'Safety Risk', 'Photos', 'Estimated Repair Time'],
                            reportType: 'bridge-damage',
                            description: 'Detailed infrastructure damage assessment template'
                          },
                          { 
                            name: 'Flood & Water Level Report',
                            icon: '💧',
                            fields: ['Location', 'Current Water Level', 'Rate of Change', 'Affected Areas', 'Risk Prediction', 'Video'],
                            reportType: 'flood',
                            description: 'Real-time flood monitoring and water level tracking'
                          },
                        ].map((template, idx) => (
                          <Grid item xs={12} sm={6} key={idx}>
                            <Paper 
                              sx={{ 
                                p: 2.5, 
                                borderRadius: 2, 
                                border: '1px solid #e2e8f0',
                                display: 'flex',
                                flexDirection: 'column',
                                height: '100%',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  boxShadow: '0 8px 20px rgba(15,23,42,0.1)',
                                  transform: 'translateY(-2px)'
                                }
                              }}
                            >
                              <Stack spacing={2} sx={{ flex: 1 }}>
                                <Stack direction="row" spacing={2} alignItems="flex-start">
                                  <Typography sx={{ fontSize: 32 }}>{template.icon}</Typography>
                                  <Box sx={{ flex: 1 }}>
                                    <Typography fontWeight={700} variant="body1">{template.name}</Typography>
                                    <Typography variant="caption" color="text.secondary">{template.description}</Typography>
                                  </Box>
                                </Stack>
                                
                                <Box>
                                  <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                                    Fields Included:
                                  </Typography>
                                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                    {template.fields.map((field, fIdx) => (
                                      <Chip 
                                        key={fIdx}
                                        label={field} 
                                        size="small" 
                                        variant="outlined"
                                      />
                                    ))}
                                  </Stack>
                                </Box>
                              </Stack>

                              <Button 
                                variant="contained" 
                                fullWidth 
                                startIcon={<FileCopyIcon />}
                                sx={{ mt: 2 }}
                                onClick={() => {
                                  setSelectedTemplate(template);
                                  setTemplateDialogOpen(true);
                                }}
                              >
                                Use Template
                              </Button>
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                    )}
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

      {/* Template Dialog */}
      <Dialog open={templateDialogOpen} onClose={() => setTemplateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Use Report Template
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {selectedTemplate && (
              <Stack spacing={2}>
                <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary">Selected Template</Typography>
                  <Typography fontWeight={700}>{selectedTemplate.name}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{selectedTemplate.description}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" fontWeight={700} color="text.secondary">This template will include the following fields:</Typography>
                  <Stack spacing={1} sx={{ mt: 1 }}>
                    {selectedTemplate.fields.map((field, idx) => (
                      <Stack key={idx} direction="row" spacing={1} alignItems="center">
                        <CheckCircleRoundedIcon sx={{ fontSize: 18, color: '#16a34a' }} />
                        <Typography variant="body2">{field}</Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Box>
              </Stack>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTemplateDialogOpen(false)} variant="outlined">Cancel</Button>
          <Button 
            onClick={() => {
              setReportType(selectedTemplate.reportType);
              setTab(0);
              setTemplateDialogOpen(false);
            }} 
            variant="contained"
          >
            Create Report with Template
          </Button>
        </DialogActions>
      </Dialog>

      {/* Photo Preview Dialog */}
      <Dialog open={photoPreviewOpen} onClose={() => setPhotoPreviewOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Photo Preview</DialogTitle>
        <DialogContent>
          {photos[selectedPhotoIndex] && (
            <Stack spacing={2}>
              <img 
                src={photos[selectedPhotoIndex].src} 
                alt={`Preview`} 
                style={{ width: '100%', borderRadius: 8, marginTop: 16 }}
              />
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  <strong>File:</strong> {photos[selectedPhotoIndex].name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  <strong>Size:</strong> {photos[selectedPhotoIndex].size} KB
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  <strong>Timestamp:</strong> {photos[selectedPhotoIndex].timestamp}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                {selectedPhotoIndex > 0 && (
                  <Button variant="outlined" onClick={() => setSelectedPhotoIndex(selectedPhotoIndex - 1)}>← Previous</Button>
                )}
                {selectedPhotoIndex < photos.length - 1 && (
                  <Button variant="outlined" onClick={() => setSelectedPhotoIndex(selectedPhotoIndex + 1)}>Next →</Button>
                )}
              </Stack>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPhotoPreviewOpen(false)} variant="contained">Close</Button>
        </DialogActions>
      </Dialog>

      {/* Report Summary & Submission Dialog */}
      <Dialog open={submitDialogOpen} onClose={() => setSubmitDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          ✅ Review Your Report Before Submission
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Stack spacing={3}>
              {/* Incident Summary */}
              <Box sx={{ p: 2, bgcolor: '#f0fdf4', borderRadius: 1, border: '1px solid #86efac' }}>
                <Typography fontWeight={700} sx={{ mb: 1 }}>📍 Incident Details</Typography>
                <Stack spacing={1}>
                  <Typography variant="body2"><strong>Type:</strong> {reportTypes.find(t => t.value === reportType)?.label}</Typography>
                  <Typography variant="body2"><strong>Location:</strong> {location}</Typography>
                  <Typography variant="body2"><strong>Date & Time:</strong> {dateTime}</Typography>
                  <Typography variant="body2"><strong>Severity:</strong> {severity}</Typography>
                </Stack>
              </Box>

              {/* Description */}
              <Box sx={{ p: 2, bgcolor: '#eff6ff', borderRadius: 1, border: '1px solid #bfdbfe' }}>
                <Typography fontWeight={700} sx={{ mb: 1 }}>📝 Description</Typography>
                <Typography variant="body2" color="text.secondary">{description}</Typography>
              </Box>

              {/* Media Summary */}
              <Box sx={{ p: 2, bgcolor: '#fdf2f8', borderRadius: 1, border: '1px solid #fbcfe8' }}>
                <Typography fontWeight={700} sx={{ mb: 1 }}>📸 Media Evidence</Typography>
                <Stack spacing={1}>
                  <Typography variant="body2">📷 Photos: <strong>{photos.length}</strong> attached</Typography>
                  {videos.length > 0 && (
                    <Typography variant="body2">🎥 Videos: <strong>{videos.length}</strong> attached</Typography>
                  )}
                </Stack>
              </Box>

              {/* Reporter Details */}
              <Box sx={{ p: 2, bgcolor: '#f5f3ff', borderRadius: 1, border: '1px solid #e9d5ff' }}>
                <Typography fontWeight={700} sx={{ mb: 1 }}>👤 Reporter Information</Typography>
                <Stack spacing={1}>
                  <Typography variant="body2"><strong>Department:</strong> {departments.find(d => d.value === department)?.label}</Typography>
                  <Typography variant="body2"><strong>Name:</strong> {reportedBy}</Typography>
                  <Typography variant="body2"><strong>Contact:</strong> {contactNumber}</Typography>
                </Stack>
              </Box>

              {/* Quality Checklist */}
              <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 1, border: '1px solid #dee2e6' }}>
                <Typography fontWeight={700} sx={{ mb: 1.5 }}>✓ Quality Checklist</Typography>
                <Stack spacing={1}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CheckCircleRoundedIcon sx={{ fontSize: 18, color: '#16a34a' }} />
                    <Typography variant="body2">Location is accurate with GPS stamp</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CheckCircleRoundedIcon sx={{ fontSize: 18, color: '#16a34a' }} />
                    <Typography variant="body2">{photos.length} verified photo(s) attached</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CheckCircleRoundedIcon sx={{ fontSize: 18, color: '#16a34a' }} />
                    <Typography variant="body2">Contact information provided</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CheckCircleRoundedIcon sx={{ fontSize: 18, color: '#16a34a' }} />
                    <Typography variant="body2">Time stamp locked and verified</Typography>
                  </Stack>
                </Stack>
              </Box>

              {/* Warning */}
              <Box sx={{ p: 2, bgcolor: '#fef3c7', borderRadius: 1, border: '1px solid #fcd34d' }}>
                <Typography variant="caption" color="text.secondary">
                  ⚠️ <strong>Important:</strong> Once submitted, this report cannot be edited. Please verify all details are correct before proceeding.
                </Typography>
              </Box>
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSubmitDialogOpen(false)} variant="outlined">Edit Report</Button>
          <Button 
            variant="contained" 
            color="success"
            onClick={() => {
              setSubmitDialogOpen(false);
              // Clear form after successful submission
              setLocation('');
              setDescription('');
              setReportedBy('');
              setContactNumber('');
              setPhotos([]);
              setVideos([]);
              localStorage.removeItem('reportDraft');
              alert('Report submitted successfully! Reference ID: RPT-' + Math.random().toString(36).substr(2, 9).toUpperCase());
            }}
          >
            ✓ Submit Report
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
