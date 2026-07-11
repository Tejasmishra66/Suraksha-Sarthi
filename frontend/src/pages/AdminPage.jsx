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
import { createUser, fetchAuditLogs } from '../api/client';
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

  // Protect route
  if (!user || user.role !== 'admin') {
    return <Navigate to="/home" />;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
        </Paper>
      </Container>
    </Box>
  );
}
