import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress
} from '@mui/material';
import { createUser, fetchAuditLogs, fetchAgencies, fetchAgencyMembers, createAgencyMember } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const agencies = ['SDRF', 'Police', 'Medical', 'Fire', 'Utility'];

export default function AdminPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState(0);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loadingAudit, setLoadingAudit] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'member',
    department: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Agency Management State
  const [selectedAgency, setSelectedAgency] = useState('');
  const [agencyMembers, setAgencyMembers] = useState([]);
  const [agencyFormData, setAgencyFormData] = useState({ name: '', role: 'officer', phone: '', address: '' });
  const [agencyMsg, setAgencyMsg] = useState('');

  // Protect route
  if (!user || user.role !== 'admin') {
    return <Navigate to="/home" />;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAgencyChange = (e) => {
    setAgencyFormData({ ...agencyFormData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await createUser(formData);
      setSuccess(`User ${formData.email} created successfully!`);
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'member',
        department: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user.');
    }
  };

  const handleAgencyMemberSubmit = async (e) => {
    e.preventDefault();
    setAgencyMsg('');
    try {
      await createAgencyMember(selectedAgency, agencyFormData);
      setAgencyMsg('Member added successfully.');
      setAgencyFormData({ name: '', role: 'officer', phone: '', address: '' });
      loadAgencyMembers(selectedAgency); // Refresh list
    } catch (err) {
      setAgencyMsg(err.response?.data?.message || 'Failed to add member.');
    }
  };

  const loadAgencyMembers = async (agency) => {
    try {
      const data = await fetchAgencyMembers(agency);
      setAgencyMembers(data || []);
    } catch (e) {
      console.error(e);
      setAgencyMembers([]);
    }
  };

  React.useEffect(() => {
    if (tab === 1) {
      setLoadingAudit(true);
      fetchAuditLogs(user.role === 'admin' ? '' : user.district)
        .then(data => setAuditLogs(data))
        .catch(err => console.error("Failed to load audit logs", err))
        .finally(() => setLoadingAudit(false));
    }
  }, [tab, user]);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f4f6f8', py: 6 }}>
      <Container maxWidth="lg">
        <Paper elevation={0} sx={{ p: 4, borderRadius: 0, border: '1px solid #cccccc', borderTop: '4px solid #003366', bgcolor: '#ffffff' }}>
          
          <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 4, borderBottom: '1px solid #e2e8f0' }}>
            <Tab label="User Management" />
            <Tab label="Audit Logs" />
            <Tab label="Agency Management" />
          </Tabs>

          {tab === 0 && (
            <Box maxWidth="sm">
          <Typography variant="h5" fontWeight={700} sx={{ mb: 3, color: '#003366', textTransform: 'uppercase' }}>
            User Management Portal
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
            Only SDRF Admins can create official accounts for agencies.
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                required
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              <TextField
                required
                fullWidth
                type="email"
                label="Official Email Address"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              <TextField
                required
                fullWidth
                type="password"
                label="Temporary Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              <TextField
                required
                fullWidth
                label="Phone Number (Important for SMS Alerts)"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91..."
              />
              
              <FormControl required fullWidth>
                <InputLabel>User Role</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  label="User Role"
                  onChange={handleChange}
                >
                  <MenuItem value="member">Field Officer / Member</MenuItem>
                  <MenuItem value="admin">SDRF Admin</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Agency</InputLabel>
                <Select
                  name="department"
                  value={formData.department}
                  label="Agency"
                  onChange={handleChange}
                >
                  <MenuItem value="">None</MenuItem>
                  {agencies.map((agency) => (
                    <MenuItem key={agency} value={agency}>{agency}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{ mt: 2, bgcolor: '#003366', '&:hover': { bgcolor: '#002244' }, borderRadius: 0, fontWeight: 'bold' }}
              >
                Create Account
              </Button>
            </Stack>
          </form>
          </Box>
          )}

          {tab === 1 && (
            <Box>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 3, color: '#003366' }}>System Audit Logs</Typography>
              {loadingAudit ? <CircularProgress /> : (
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f1f5f9' }}>
                      <TableCell>Time</TableCell>
                      <TableCell>User</TableCell>
                      <TableCell>Office</TableCell>
                      <TableCell>Action</TableCell>
                      <TableCell>Entity</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {auditLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                        <TableCell>{log.user_id}</TableCell>
                        <TableCell>{log.office || 'Global'}</TableCell>
                        <TableCell>{log.action}</TableCell>
                        <TableCell>{log.entity_type} {log.entity_id}</TableCell>
                      </TableRow>
                    ))}
                    {auditLogs.length === 0 && (
                      <TableRow><TableCell colSpan={5} align="center">No logs found</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </Box>
          )}

          {tab === 2 && (
            <Box>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 3, color: '#003366' }}>Agency Management</Typography>
              <FormControl sx={{ minWidth: 200, mb: 4 }}>
                <InputLabel>Select Agency</InputLabel>
                <Select
                  value={selectedAgency}
                  label="Select Agency"
                  onChange={(e) => {
                    setSelectedAgency(e.target.value);
                    loadAgencyMembers(e.target.value);
                  }}
                >
                  {agencies.map((agency) => (
                    <MenuItem key={agency} value={agency}>{agency}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              {selectedAgency && (
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
                  <Box flex={1}>
                    <Typography variant="subtitle1" fontWeight={700} mb={2}>Members</Typography>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ bgcolor: '#f1f5f9' }}>
                          <TableCell>Name</TableCell>
                          <TableCell>Role</TableCell>
                          <TableCell>Phone</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {agencyMembers.map(m => (
                          <TableRow key={m.id}>
                            <TableCell>{m.name}</TableCell>
                            <TableCell>{m.role}</TableCell>
                            <TableCell>{m.phone}</TableCell>
                          </TableRow>
                        ))}
                        {agencyMembers.length === 0 && (
                          <TableRow><TableCell colSpan={3} align="center">No members found</TableCell></TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </Box>

                  <Box flex={1} component="form" onSubmit={handleAgencyMemberSubmit}>
                    <Typography variant="subtitle1" fontWeight={700} mb={2}>Add New Member</Typography>
                    {agencyMsg && <Alert severity="info" sx={{ mb: 2 }}>{agencyMsg}</Alert>}
                    <Stack spacing={2}>
                      <TextField required size="small" label="Name" name="name" value={agencyFormData.name} onChange={handleAgencyChange} />
                      <FormControl required size="small" fullWidth>
                        <InputLabel>Role</InputLabel>
                        <Select name="role" value={agencyFormData.role} label="Role" onChange={handleAgencyChange}>
                          <MenuItem value="officer">Officer</MenuItem>
                          <MenuItem value="worker">Worker</MenuItem>
                          <MenuItem value="volunteer">Volunteer</MenuItem>
                        </Select>
                      </FormControl>
                      <TextField required size="small" label="Phone" name="phone" value={agencyFormData.phone} onChange={handleAgencyChange} />
                      <TextField size="small" label="Address" name="address" value={agencyFormData.address} onChange={handleAgencyChange} />
                      <Button type="submit" variant="contained" sx={{ bgcolor: '#003366' }}>Add Member</Button>
                    </Stack>
                  </Box>
                </Stack>
              )}
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
