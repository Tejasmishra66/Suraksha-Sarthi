import React, { useEffect, useState } from 'react';
import { Alert, Box, Button, Card, CardContent, Grid, MenuItem, Stack, TextField, Typography } from '@mui/material';

import { broadcastVolunteers, fetchResources, fetchVolunteers, createVolunteer, createResource } from '../api/client';

// Displays volunteer and resource lists plus a simple broadcast form.
export default function VolunteerDashboardPage() {
  const [volunteers, setVolunteers] = useState([]);
  const [resources, setResources] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ lat: '', lng: '', radiusKm: 10, skills: '' });

  useEffect(() => {
    refreshRoster();
  }, []);

  // Loads volunteers and resources together for the operations team.
  async function refreshRoster() {
    try {
      const [volunteerList, resourceList] = await Promise.all([fetchVolunteers(), fetchResources()]);
      setVolunteers(volunteerList);
      setResources(resourceList);
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not load roster');
    }
  }

  // Updates the broadcast draft without touching unrelated fields.
  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  // Broadcasts a notification to volunteers nearby and refreshes the view.
  async function handleBroadcast(event) {
    event.preventDefault();
    setError('');
    try {
      await broadcastVolunteers({
        lat: Number(form.lat),
        lng: Number(form.lng),
        radiusKm: Number(form.radiusKm),
        skills: form.skills.split(',').map((skill) => skill.trim()).filter(Boolean)
      });
      await refreshRoster();
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not broadcast to volunteers');
    }
  }

  async function handleAddVolunteer(e) {
    e.preventDefault();
    setError('');
    try {
      const dept = e.target.department?.value === 'Other' ? (e.target.otherDepartment?.value || 'Other') : e.target.department?.value || null;
      await createVolunteer({
        name: e.target.name.value,
        phone: e.target.phone.value,
        lat: Number(e.target.lat.value) || 0,
        lng: Number(e.target.lng.value) || 0,
        capabilities: e.target.capabilities.value || '',
        department: dept
      });
      await refreshRoster();
      e.target.reset();
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not add volunteer');
    }
  }

  async function handleAddResource(e) {
    e.preventDefault();
    setError('');
    try {
      const rdept = e.target.department?.value === 'Other' ? (e.target.otherDepartment?.value || 'Other') : e.target.department?.value || null;
      await createResource({
        name: e.target.name.value,
        category: e.target.category.value,
        department: rdept,
        quantity: Number(e.target.quantity.value) || 0,
        lat: Number(e.target.lat.value) || null,
        lng: Number(e.target.lng.value) || null
      });
      await refreshRoster();
      e.target.reset();
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not add resource');
    }
  }

  return (
    <Stack spacing={3}>
      {error && <Alert severity="warning">{error}</Alert>}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={800} gutterBottom>
            Broadcast Nearby Volunteers
          </Typography>
          <Box component="form" onSubmit={handleBroadcast} sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' } }}>
            <TextField label="Latitude" name="lat" value={form.lat} onChange={handleChange} />
            <TextField label="Longitude" name="lng" value={form.lng} onChange={handleChange} />
            <TextField label="Radius km" name="radiusKm" value={form.radiusKm} onChange={handleChange} />
            <TextField label="Skills (comma separated)" name="skills" value={form.skills} onChange={handleChange} />
            <Button type="submit" variant="contained" sx={{ gridColumn: { md: '1 / -1' } }}>
              Send Broadcast
            </Button>
          </Box>
        </CardContent>
      </Card>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={800} gutterBottom>Volunteers</Typography>
              <Box component="form" onSubmit={handleAddVolunteer} sx={{ display: 'grid', gap: 1, mb: 2 }}>
                <TextField name="name" label="Name" size="small" />
                <TextField name="phone" label="Phone" size="small" />
                <TextField select name="department" label="Department" size="small">
                  {['SDRF', 'HPEB', 'Police', 'Fire Brigade', 'Other'].map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                </TextField>
                <TextField name="otherDepartment" label="Other department" size="small" />
                <TextField name="capabilities" label="Capabilities (comma separated)" size="small" />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField name="lat" label="Lat" size="small" />
                  <TextField name="lng" label="Lng" size="small" />
                </Box>
                <Button type="submit" variant="contained" size="small" sx={{ mt: 1 }}>Add Volunteer</Button>
              </Box>
              <Stack spacing={1}>
                {volunteers.map((volunteer) => (
                  <Card key={volunteer.id} variant="outlined">
                    <CardContent>
                      <Typography fontWeight={700}>{volunteer.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{volunteer.role || volunteer.agency}</Typography>
                      <Typography variant="caption">Skills: {volunteer.skills || volunteer.capabilities || 'n/a'}</Typography>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={800} gutterBottom>Resources</Typography>
              <Box component="form" onSubmit={handleAddResource} sx={{ display: 'grid', gap: 1, mb: 2 }}>
                <TextField name="name" label="Name" size="small" />
                <TextField name="category" label="Type of thing (category)" size="small" />
                <TextField select name="department" label="Department" size="small">
                  {['SDRF', 'HPEB', 'Police', 'Fire Brigade', 'Other'].map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                </TextField>
                <TextField name="otherDepartment" label="Other department" size="small" />
                <TextField name="quantity" label="Quantity" size="small" />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField name="lat" label="Lat" size="small" />
                  <TextField name="lng" label="Lng" size="small" />
                </Box>
                <Button type="submit" variant="contained" size="small" sx={{ mt: 1 }}>Add Resource</Button>
              </Box>
              <Stack spacing={1}>
                {resources.map((resource) => (
                  <Card key={resource.id} variant="outlined">
                    <CardContent>
                      <Typography fontWeight={700}>{resource.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{resource.type}</Typography>
                      <Typography variant="caption">Status: {resource.status || 'available'}</Typography>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}
