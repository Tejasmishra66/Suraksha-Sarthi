import React, { useState, useEffect } from 'react';
import {
  Box, Container, Grid, Paper, Stack, Typography, Chip, Button, 
  Select, MenuItem, Tabs, Tab, TextField, InputAdornment, Avatar,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, CircularProgress
} from '@mui/material';
import {
  QrCodeScannerRounded as QrCodeIcon,
  LocalShippingRounded as DispatchIcon,
  CheckCircleOutlineRounded as ConfirmIcon,
  BuildRounded as MaintenanceIcon,
  AddRounded as AddIcon,
  SearchRounded as SearchIcon,
  VisibilityRounded as ViewIcon,
  MoreHorizRounded as MoreIcon,
  ArrowUpwardRounded as ArrowUpIcon,
  SyncRounded as SyncIcon,
  InventoryRounded as BoxIcon,
  WarningRounded as WarningIcon,
  ErrorOutlineRounded as ErrorIcon,
  CheckCircleRounded as SuccessIcon
} from '@mui/icons-material';

import { fetchEquipment, createEquipment } from '../api/client';

const RECENT_ACTIVITY = [];

const CATEGORY_STATS = [];

const getStatusStyles = (status) => {
  const s = status?.toLowerCase() || '';
  if (s === 'in use') return { color: '#2563eb', bg: '#dbeafe' };
  if (s === 'available') return { color: '#16a34a', bg: '#dcfce7' };
  if (s === 'in transit') return { color: '#7c3aed', bg: '#ede9fe' };
  if (s === 'maintenance') return { color: '#ea580c', bg: '#ffedd5' };
  return { color: '#475569', bg: '#f1f5f9' };
};

export default function EquipmentPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [equipment, setEquipment] = useState([]);
  const [addOpen, setAddOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    qr_code: '', name: '', category: 'Rescue Gear', location: '', status: 'available'
  });

  const loadEquipment = () => {
    fetchEquipment().then(data => {
      if (data && data.length > 0) {
        setEquipment(data.map(d => ({
          id: d.qr_code || `EQ-${d.id}`,
          name: d.name || 'Unknown',
          category: d.type || d.category || 'General',
          location: d.location || 'HQ Store',
          status: d.status || 'Available',
          date: new Date(d.last_scanned_at || d.updated_at || Date.now()).toLocaleString()
        })));
      }
    }).catch(e => console.log('Could not load equipment.'));
  };

  useEffect(() => { loadEquipment(); }, []);

  const handleAddSubmit = async () => {
    if (!form.qr_code || !form.name) {
      alert('QR Code and Name are required.');
      return;
    }
    setSubmitting(true);
    try {
      await createEquipment({
        qr_code: form.qr_code,
        name: form.name,
        category: form.category,
        status: form.status,
        location: form.location || 'HQ Store',
      });
      setSuccess(true);
      setForm({ qr_code: '', name: '', category: 'Rescue Gear', location: '', status: 'available' });
      loadEquipment(); // Refresh table live
      setTimeout(() => { setSuccess(false); setAddOpen(false); }, 1500);
    } catch (e) {
      alert('Failed to add equipment: ' + (e?.response?.data?.message || e.message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f4f6f8', fontFamily: "'Inter', sans-serif" }}>
      
      {/* 1. HERO SECTION */}
      <Box sx={{ 
        position: 'relative',
        height: 450,
        backgroundImage: 'url(/mountain-equipment.jpg)', // Using mountain equipment image
        backgroundSize: 'cover',
        backgroundPosition: 'top',
        pt: 8, pb: 4, px: { xs: 2, md: 6 }
      }}>
        {/* Filter removed as requested */}
        
        {/* Hero text removed as requested */}
      </Box>

      {/* 3. MAIN DASHBOARD CONTENT */}
      <Container maxWidth="xl" sx={{ pb: 8, mt: -3, position: 'relative', zIndex: 2 }}>
        
        {/* TOP ROW */}
        <Grid container spacing={3} mb={3}>
          {/* Quick Actions */}
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0', height: '100%' }}>
              <Typography variant="subtitle2" fontWeight={800} color="#0f172a" mb={2}>Quick Actions</Typography>
              <Grid container spacing={2}>
                {[
                  { icon: <QrCodeIcon sx={{ color: '#10b981' }}/>, bg: '#d1fae5', label: 'Scan QR Code', sub: 'Issue or return equipment' },
                  { icon: <DispatchIcon sx={{ color: '#3b82f6' }}/>, bg: '#dbeafe', label: 'Dispatch', sub: 'Send equipment to another unit' },
                  { icon: <ConfirmIcon sx={{ color: '#8b5cf6' }}/>, bg: '#ede9fe', label: 'Confirm Receipt', sub: 'Confirm received equipment' },
                  { icon: <MaintenanceIcon sx={{ color: '#f59e0b' }}/>, bg: '#fef3c7', label: 'Maintenance', sub: 'Mark equipment under maintenance' }
                ].map((action, idx) => (
                  <Grid item xs={6} key={idx}>
                    <Box sx={{ p: 2, border: '1px solid #f1f5f9', borderRadius: 2, textAlign: 'center', cursor: 'pointer', '&:hover': { bgcolor: '#f8fafc', borderColor: '#e2e8f0' }, transition: 'all 0.2s' }}>
                      <Box sx={{ width: 40, height: 40, mx: 'auto', mb: 1.5, borderRadius: 2, bgcolor: action.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {action.icon}
                      </Box>
                      <Typography variant="caption" fontWeight={800} color="#0f172a" display="block">{action.label}</Typography>
                      <Typography variant="caption" color="#64748b" fontSize="0.65rem">{action.sub}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>

          {/* Scan QR Code Center */}
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="subtitle2" fontWeight={800} color="#0f172a" mb={1}>Scan QR Code</Typography>
              <Typography variant="caption" color="#64748b" mb={4}>Scan the QR code on equipment to view details and update status.</Typography>
              
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed #cbd5e1', borderRadius: 2, bgcolor: '#f8fafc', p: 3 }}>
                <QrCodeIcon sx={{ fontSize: 64, color: '#10b981', mb: 2 }} />
                <Button variant="contained" sx={{ bgcolor: '#0f4a30', color: '#fff', fontWeight: 700, px: 4, mb: 1, '&:hover': { bgcolor: '#0a3622' } }}>
                  Start Scanning
                </Button>
                <Typography variant="caption" color="#64748b">or <span style={{ fontWeight: 700, cursor: 'pointer', color: '#0f172a' }}>Enter Equipment ID</span></Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Recent Activity */}
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0', height: '100%' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="subtitle2" fontWeight={800} color="#0f172a">Recent Activity</Typography>
                <Typography variant="caption" fontWeight={700} color="#0f4a30" sx={{ cursor: 'pointer' }}>View All</Typography>
              </Stack>
              {RECENT_ACTIVITY.length === 0 ? (
                <Typography variant="body2" color="#64748b" textAlign="center" py={4}>No recent activity</Typography>
              ) : (
                <Stack spacing={3}>
                  {RECENT_ACTIVITY.map((activity, idx) => (
                    <Box key={idx} sx={{ display: 'flex', gap: 2 }}>
                      <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: activity.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {activity.icon}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="caption" fontWeight={700} color="#0f172a" display="block">{activity.text}</Typography>
                        <Typography variant="caption" color="#64748b">{activity.subtext}</Typography>
                      </Box>
                      <Typography variant="caption" fontWeight={600} color="#64748b">{activity.time}</Typography>
                    </Box>
                  ))}
                </Stack>
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* BOTTOM ROW */}
        <Grid container spacing={3}>
          {/* Equipment List (Left 8 cols) */}
          <Grid item xs={12} lg={8}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="subtitle2" fontWeight={800} color="#0f172a">Equipment List</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setAddOpen(true)}
                  sx={{ bgcolor: '#0f4a30', color: '#fff', fontWeight: 700, borderRadius: 2, '&:hover': { bgcolor: '#0a3622' } }}
                >
                  Add Equipment
                </Button>
              </Stack>

              <Grid container spacing={2} mb={3}>
                <Grid item xs={12} md={8}>
                  <TextField 
                    fullWidth 
                    size="small" 
                    placeholder="Search equipment by ID, Name, or Category..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }} 
                  />
                </Grid>
              </Grid>

              {equipment.length === 0 ? (
                <Box textAlign="center" py={6}>
                  <BoxIcon sx={{ fontSize: 48, color: '#cbd5e1', mb: 2 }} />
                  <Typography variant="subtitle2" fontWeight={700} color="#0f172a" mb={1}>No Equipment Yet</Typography>
                  <Typography variant="body2" color="#64748b" mb={3}>Click "Add Equipment" to register your first item.</Typography>
                  <Button variant="outlined" startIcon={<AddIcon />} onClick={() => setAddOpen(true)} sx={{ color: '#0f4a30', borderColor: '#0f4a30', fontWeight: 700 }}>Add Equipment</Button>
                </Box>
              ) : (
                <TableContainer>
                  <Table sx={{ '& .MuiTableCell-root': { borderBottom: '1px solid #f1f5f9', py: 1.5 } }}>
                    <TableHead>
                      <TableRow>
                        <TableCell><Typography variant="caption" fontWeight={800} color="#64748b">Equipment ID</Typography></TableCell>
                        <TableCell><Typography variant="caption" fontWeight={800} color="#64748b">Name</Typography></TableCell>
                        <TableCell><Typography variant="caption" fontWeight={800} color="#64748b">Category</Typography></TableCell>
                        <TableCell><Typography variant="caption" fontWeight={800} color="#64748b">Location</Typography></TableCell>
                        <TableCell><Typography variant="caption" fontWeight={800} color="#64748b">Status</Typography></TableCell>
                        <TableCell><Typography variant="caption" fontWeight={800} color="#64748b">Last Updated</Typography></TableCell>
                        <TableCell><Typography variant="caption" fontWeight={800} color="#64748b">Action</Typography></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {equipment.filter(e => (e.id || '').toLowerCase().includes(searchQuery.toLowerCase()) || (e.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || (e.category || '').toLowerCase().includes(searchQuery.toLowerCase())).map((row, idx) => {
                        const styles = getStatusStyles(row.status);
                        return (
                          <TableRow key={idx} hover>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Avatar variant="rounded" sx={{ width: 32, height: 32, bgcolor: '#f1f5f9', color: '#64748b' }}>
                                  <BoxIcon fontSize="small" />
                                </Avatar>
                                <Typography variant="body2" fontWeight={700} color="#0f172a">{row.id}</Typography>
                              </Box>
                            </TableCell>
                            <TableCell><Typography variant="body2" fontWeight={600} color="#475569">{row.name}</Typography></TableCell>
                            <TableCell><Typography variant="body2" color="#64748b">{row.category}</Typography></TableCell>
                            <TableCell><Typography variant="body2" color="#64748b">{row.location}</Typography></TableCell>
                            <TableCell>
                              <Chip label={row.status} size="small" sx={{ bgcolor: styles.bg, color: styles.color, fontWeight: 700, fontSize: '0.7rem', height: 22 }} />
                            </TableCell>
                            <TableCell><Typography variant="caption" color="#64748b">{row.date}</Typography></TableCell>
                            <TableCell>
                              <IconButton size="small" sx={{ color: '#64748b' }}><ViewIcon fontSize="small" /></IconButton>
                              <IconButton size="small" sx={{ color: '#64748b' }}><MoreIcon fontSize="small" /></IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
                <Typography variant="caption" color="#64748b">Showing {equipment.filter(e => (e.id || '').toLowerCase().includes(searchQuery.toLowerCase()) || (e.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || (e.category || '').toLowerCase().includes(searchQuery.toLowerCase())).length} of {equipment.length} total items</Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Right Column (4 cols) */}
          <Grid item xs={12} lg={4}>
            <Stack spacing={3}>
              
              {/* Equipment by Category */}
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                  <Typography variant="subtitle2" fontWeight={800} color="#0f172a">Equipment by Category</Typography>
                  <Typography variant="caption" fontWeight={700} color="#0f4a30" sx={{ cursor: 'pointer' }}>View Report</Typography>
                </Stack>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={5}>
                    {/* CSS Donut Chart */}
                    <Box sx={{ 
                      position: 'relative', width: '100%', pb: '100%', borderRadius: '50%', 
                      background: 'conic-gradient(#10b981 0% 34%, #3b82f6 34% 58%, #8b5cf6 58% 74%, #f59e0b 74% 86%, #94a3b8 86% 100%)' 
                    }}>
                      <Box sx={{ position: 'absolute', top: '25%', left: '25%', right: '25%', bottom: '25%', bgcolor: '#fff', borderRadius: '50%' }} />
                    </Box>
                  </Grid>
                  <Grid item xs={7}>
                    <Stack spacing={1.5}>
                      {CATEGORY_STATS.map((stat, idx) => (
                        <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: stat.color }} />
                            <Typography variant="caption" fontWeight={600} color="#475569">{stat.label}</Typography>
                          </Box>
                          <Typography variant="caption" fontWeight={700} color="#0f172a">{stat.value} <span style={{ color: '#94a3b8', fontWeight: 600 }}>({stat.percent})</span></Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Grid>
                </Grid>
              </Paper>

              {/* Low Stock / Alerts */}
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                  <Typography variant="subtitle2" fontWeight={800} color="#0f172a">Low Stock / Maintenance Alerts</Typography>
                  <Typography variant="caption" fontWeight={700} color="#0f4a30" sx={{ cursor: 'pointer' }}>View All</Typography>
                </Stack>
                <Typography variant="body2" color="#64748b" textAlign="center" py={4}>
                  No maintenance alerts at this time.
                </Typography>
              </Paper>

            </Stack>
          </Grid>
        </Grid>
      </Container>

      {/* ── Add Equipment Dialog ── */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 800, color: '#0f172a', pb: 1 }}>
          Add New Equipment
        </DialogTitle>
        <DialogContent dividers>
          {success ? (
            <Box textAlign="center" py={4}>
              <SuccessIcon sx={{ fontSize: 56, color: '#10b981', mb: 2 }} />
              <Typography variant="h6" fontWeight={800} color="#0f172a">Equipment Added!</Typography>
              <Typography variant="body2" color="#64748b">It now appears in the equipment list.</Typography>
            </Box>
          ) : (
            <Stack spacing={3} pt={1}>
              <TextField
                label="QR Code / Equipment ID *"
                placeholder="e.g. EQ-1001"
                value={form.qr_code}
                onChange={e => setForm({ ...form, qr_code: e.target.value })}
                fullWidth
                size="small"
                helperText="Unique identifier printed on the equipment tag"
              />
              <TextField
                label="Equipment Name *"
                placeholder="e.g. Rescue Rope 50m"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                fullWidth
                size="small"
              />
              <FormControl fullWidth size="small">
                <InputLabel>Category</InputLabel>
                <Select label="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  {['Rescue Gear', 'Medical Equipment', 'Communication', 'Power Equipment', 'Transport', 'Relief Supplies', 'Other'].map(c => (
                    <MenuItem key={c} value={c}>{c}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Location / Store"
                placeholder="e.g. Shimla HQ Store"
                value={form.location}
                onChange={e => setForm({ ...form, location: e.target.value })}
                fullWidth
                size="small"
              />
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select label="Status" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                  <MenuItem value="available">✅ Available</MenuItem>
                  <MenuItem value="in use">🔵 In Use</MenuItem>
                  <MenuItem value="in transit">🟣 In Transit</MenuItem>
                  <MenuItem value="maintenance">🟠 Maintenance</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          )}
        </DialogContent>
        {!success && (
          <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
            <Button onClick={() => setAddOpen(false)} sx={{ color: '#64748b', fontWeight: 700 }}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleAddSubmit}
              disabled={submitting}
              startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : <AddIcon />}
              sx={{ bgcolor: '#0f4a30', color: '#fff', fontWeight: 700, borderRadius: 2, px: 3, '&:hover': { bgcolor: '#0a3622' } }}
            >
              {submitting ? 'Saving...' : 'Add Equipment'}
            </Button>
          </DialogActions>
        )}
      </Dialog>

    </Box>
  );
}
