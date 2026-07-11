import React, { useState, useEffect } from 'react';
import {
  Box, Container, Grid, Paper, Typography, TextField, MenuItem, Button, 
  Stack, Avatar, Chip, IconButton, Divider, Select, FormControl, InputLabel,
  OutlinedInput, Checkbox, ListItemText
} from '@mui/material';
import {
  CloudUploadOutlined as CloudUploadOutlinedIcon,
  SendRounded as SendRoundedIcon,
  AssignmentTurnedInOutlined as AssignmentTurnedInOutlinedIcon,
  LocalHospitalOutlined as LocalHospitalOutlinedIcon,
  WarningAmberRounded as WarningAmberRoundedIcon,
  SyncRounded as SyncRoundedIcon
} from '@mui/icons-material';
import { createIncident, fetchIncidents } from '../api/client';

const INCIDENT_TYPES = ['Landslide', 'Flash Flood', 'Road Block', 'Fire', 'Earthquake', 'Medical Emergency'];
const RESOURCE_OPTIONS = ['Ambulance', 'JCB / Heavy Machinery', 'Medical Kits', 'Food & Water', 'Search & Rescue Team', 'Helicopter Evac'];

export default function FieldReportPage() {
  const [form, setForm] = useState({
    incidentType: '',
    severity: 'Medium',
    casualties: { safe: 0, injured: 0, critical: 0 },
    resources: [],
    description: ''
  });

  const [feed, setFeed] = useState([]);

  useEffect(() => {
    fetchIncidents()
      .then(data => {
        if (data && data.length > 0) {
          setFeed(data.map(inc => ({
            id: inc.id,
            author: 'Responder',
            role: inc.agency_assigned || 'Field Agent',
            time: new Date(inc.created_at).toLocaleString(),
            type: inc.disaster_type,
            desc: inc.description,
            resources: []
          })));
        }
        // No fallback mock data - show empty state
      })
      .catch(e => console.error(e));
  }, []);

  const handleResourceChange = (event) => {
    const { target: { value } } = event;
    setForm({ ...form, resources: typeof value === 'string' ? value.split(',') : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.incidentType || !form.description) {
      alert('Please fill out the incident type and description.');
      return;
    }
    
    const detailedDescription = `[Severity: ${form.severity}] [Casualties: S:${form.casualties.safe} I:${form.casualties.injured} C:${form.casualties.critical}] [Resources: ${form.resources.join(', ')}] ${form.description}`;
    
    try {
      const response = await createIncident({
        title: `Field Report: ${form.incidentType}`,
        description: detailedDescription,
        disasterType: form.incidentType,
        lat: 31.1048,
        lng: 77.1734,
        address: 'Current Location',
        agencyAssigned: 'SDRF'
      });
      
      const newReport = {
        id: response.id || Date.now(),
        author: 'You (Current Volunteer)',
        role: 'First Responder',
        time: 'Just now',
        type: form.incidentType,
        desc: detailedDescription,
        resources: form.resources
      };
      
      setFeed([newReport, ...feed]);
      setForm({ incidentType: '', severity: 'Medium', casualties: { safe: 0, injured: 0, critical: 0 }, resources: [], description: '' });
      alert('Situation Report saved successfully to the database.');
    } catch (err) {
      console.error(err);
      alert('Failed to save Situation Report.');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', pb: 10, fontFamily: "'Inter', sans-serif" }}>
      
      {/* 1. Hero Section */}
      <Box sx={{ 
        position: 'relative',
        height: 450,
        display: 'flex',
        alignItems: 'center',
        backgroundImage: 'url(/mountain-field.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'top',
        mb: 4
      }}>
        {/* Hero text removed as requested */}
      </Box>

      <Container maxWidth="xl">
        <Grid container spacing={4}>
          
          {/* LEFT COLUMN: Submit SitRep */}
          <Grid item xs={12} md={7}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)' }}>
              <Typography variant="h6" fontWeight={800} color="#1a202c" mb={1}>
                Submit New Situation Report
              </Typography>
              <Typography variant="body2" color="#64748b" mb={4}>
                Provide accurate, on-the-ground details. Do not exaggerate damage.
              </Typography>

              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      select 
                      fullWidth 
                      label="Incident Type" 
                      value={form.incidentType}
                      onChange={(e) => setForm({ ...form, incidentType: e.target.value })}
                      required
                    >
                      {INCIDENT_TYPES.map((type) => (
                        <MenuItem key={type} value={type}>{type}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      select 
                      fullWidth 
                      label="Severity Level" 
                      value={form.severity}
                      onChange={(e) => setForm({ ...form, severity: e.target.value })}
                    >
                      <MenuItem value="Low">Low - Monitored safely</MenuItem>
                      <MenuItem value="Medium">Medium - Intervention required</MenuItem>
                      <MenuItem value="High">High - Critical life-threatening</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="subtitle2" fontWeight={700} color="#1a202c" mb={1.5}>Casualty Estimate</Typography>
                    <Stack direction="row" spacing={2}>
                      <TextField 
                        type="number" label="Safe/Evacuated" size="small" fullWidth
                        value={form.casualties.safe} onChange={(e) => setForm({ ...form, casualties: { ...form.casualties, safe: e.target.value }})}
                      />
                      <TextField 
                        type="number" label="Injured" size="small" fullWidth
                        value={form.casualties.injured} onChange={(e) => setForm({ ...form, casualties: { ...form.casualties, injured: e.target.value }})}
                      />
                      <TextField 
                        type="number" label="Critical/Trapped" size="small" fullWidth color="error"
                        value={form.casualties.critical} onChange={(e) => setForm({ ...form, casualties: { ...form.casualties, critical: e.target.value }})}
                      />
                    </Stack>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Resource Requests (Need Backup)</InputLabel>
                      <Select
                        multiple
                        value={form.resources}
                        onChange={handleResourceChange}
                        input={<OutlinedInput label="Resource Requests (Need Backup)" />}
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                              <Chip key={value} label={value} size="small" sx={{ bgcolor: '#e6f4ea', color: '#0f4a30', fontWeight: 600 }} />
                            ))}
                          </Box>
                        )}
                      >
                        {RESOURCE_OPTIONS.map((name) => (
                          <MenuItem key={name} value={name}>
                            <Checkbox checked={form.resources.indexOf(name) > -1} />
                            <ListItemText primary={name} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField 
                      fullWidth 
                      multiline 
                      rows={4} 
                      label="Detailed Description" 
                      placeholder="Describe the exact situation, landmarks, and what teams need to know..."
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      required
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ 
                      border: '2px dashed #cbd5e1', 
                      borderRadius: 2, 
                      p: 4, 
                      textAlign: 'center',
                      bgcolor: '#f8fafc',
                      cursor: 'pointer',
                      transition: 'border 0.2s',
                      '&:hover': { borderColor: '#0f4a30' }
                    }}>
                      <CloudUploadOutlinedIcon sx={{ fontSize: 40, color: '#94a3b8', mb: 1 }} />
                      <Typography variant="subtitle2" fontWeight={700} color="#475569">
                        Tap to upload "Before" & "After" photos
                      </Typography>
                      <Typography variant="caption" color="#94a3b8">
                        Max 3 files (JPG, PNG). Will sync offline.
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Button 
                      type="submit"
                      fullWidth 
                      variant="contained" 
                      size="large"
                      startIcon={<SendRoundedIcon />}
                      sx={{ bgcolor: '#0f4a30', color: '#fff', py: 1.5, fontWeight: 700, '&:hover': { bgcolor: '#0a3622' } }}
                    >
                      Submit Report (Offline Sync Enabled)
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>

          {/* RIGHT COLUMN: Live Feed */}
          <Grid item xs={12} md={5}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)', height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" fontWeight={800} color="#1a202c">
                  Live Activity Feed
                </Typography>
                <Chip icon={<WarningAmberRoundedIcon fontSize="small" />} label="Live" size="small" color="error" sx={{ fontWeight: 700 }} />
              </Box>

              <Stack spacing={3}>
                {feed.length === 0 ? (
                <Typography variant="body2" color="#64748b" textAlign="center" py={6}>
                  No field reports yet. Submit the first report!
                </Typography>
              ) : (
                feed.map((report) => (
                  <Box key={report.id} sx={{ position: 'relative', pl: 3, borderLeft: '2px solid #e2e8f0' }}>
                    <Box sx={{ position: 'absolute', left: -7, top: 0, width: 12, height: 12, borderRadius: '50%', bgcolor: '#0f4a30', border: '2px solid #fff' }} />
                    <Stack direction="row" spacing={2} mb={1}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: '#cbd5e1', fontSize: '0.9rem', fontWeight: 700 }}>
                        {report.author.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={700} color="#1a202c" lineHeight={1.2}>
                          {report.author}
                        </Typography>
                        <Typography variant="caption" color="#64748b">
                          {report.role} • {report.time}
                        </Typography>
                      </Box>
                    </Stack>
                    <Box sx={{ p: 2, bgcolor: '#f1f5f9', borderRadius: 2 }}>
                      <Typography variant="body2" fontWeight={700} color="#0f4a30" mb={0.5}>
                        {report.type}
                      </Typography>
                      <Typography variant="body2" color="#475569" mb={1.5}>
                        {report.desc}
                      </Typography>
                      {report.resources && report.resources.length > 0 && (
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                          {report.resources.map(res => (
                            <Chip key={res} label={`Req: ${res}`} size="small" variant="outlined" sx={{ borderColor: '#cbd5e1', color: '#64748b', fontSize: '0.7rem', fontWeight: 600 }} />
                          ))}
                        </Stack>
                      )}
                    </Box>
                  </Box>
                ))
              )}
              </Stack>
            </Paper>
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
}
