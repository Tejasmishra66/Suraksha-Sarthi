import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { createAgencyMember, fetchAgencyMembers, fetchAgencies } from '../api/client';

const roleOptions = ['officer', 'volunteer', 'worker'];

export default function AgencyDetailsPage() {
  const navigate = useNavigate();
  const [agencyOptions, setAgencyOptions] = useState([]);
  const [selectedAgency, setSelectedAgency] = useState('');
  const [members, setMembers] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', role: 'officer', phone: '', address: '' });

  useEffect(() => {
    refreshAgencies();
  }, []);

  useEffect(() => {
    if (selectedAgency) {
      refreshMembers(selectedAgency);
    }
  }, [selectedAgency]);

  async function refreshAgencies() {
    try {
      const agencies = await fetchAgencies();
      setAgencyOptions(agencies);
      setSelectedAgency((current) => current || agencies[0] || '');
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not load agencies');
    }
  }

  async function refreshMembers(agency) {
    if (!agency) return;
    setLoading(true);
    try {
      setMembers(await fetchAgencyMembers(agency));
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not load agency members');
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleCreate(event) {
    event.preventDefault();
    setError('');
    setSuccess('');
    try {
      await createAgencyMember(selectedAgency, form);
      setForm({ name: '', role: 'officer', phone: '', address: '' });
      setSuccess('Member registered successfully');
      await refreshMembers(selectedAgency);
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not register member');
    }
  }

  const pageTitle = useMemo(() => selectedAgency || 'Agency Details', [selectedAgency]);

  return (
    <Stack spacing={3}>
      <Box>
        <Button variant="text" onClick={() => navigate('/tasks')} sx={{ mb: 1 }}>
          Back to Tasks
        </Button>
        <Typography variant="h4" fontWeight={800} gutterBottom>
          {pageTitle}
        </Typography>
        <Typography color="text.secondary">
          See the people registered under each agency and add new members from the same screen.
        </Typography>
      </Box>

      {error && <Alert severity="warning">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={800} gutterBottom>
            Select Agency
          </Typography>
          <TextField
            select
            fullWidth
            label="Agency"
            value={selectedAgency}
            onChange={(event) => setSelectedAgency(event.target.value)}
          >
            {agencyOptions.map((agency) => (
              <MenuItem key={agency} value={agency}>{agency}</MenuItem>
            ))}
          </TextField>
        </CardContent>
      </Card>

      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={800} gutterBottom>
                Registered Members
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Mobile</TableCell>
                    <TableCell>Address</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>{member.name}</TableCell>
                      <TableCell>{member.role}</TableCell>
                      <TableCell>{member.phone || '-'}</TableCell>
                      <TableCell>{member.address || '-'}</TableCell>
                    </TableRow>
                  ))}
                  {!loading && members.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4}>No members registered for this agency yet.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={800} gutterBottom>
                Register New Member
              </Typography>
              <Box component="form" onSubmit={handleCreate} sx={{ display: 'grid', gap: 2 }}>
                <TextField label="Name" name="name" value={form.name} onChange={handleChange} />
                <TextField select label="Role" name="role" value={form.role} onChange={handleChange}>
                  {roleOptions.map((role) => (
                    <MenuItem key={role} value={role}>{role}</MenuItem>
                  ))}
                </TextField>
                <TextField label="Mobile Number" name="phone" value={form.phone} onChange={handleChange} />
                <TextField label="Address" name="address" value={form.address} onChange={handleChange} multiline minRows={3} />
                <Button type="submit" variant="contained" disabled={!selectedAgency}>
                  Register Member
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}