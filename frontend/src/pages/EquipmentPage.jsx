import React, { useState, useEffect, useMemo } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from '@mui/material';
import TopNavBar from '../components/TopNavBar';
import QrCodeScannerRoundedIcon from '@mui/icons-material/QrCodeScannerRounded';
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded';
import AssignmentTurnedInRoundedIcon from '@mui/icons-material/AssignmentTurnedInRounded';
import BuildCircleRoundedIcon from '@mui/icons-material/BuildCircleRounded';
import SensorsRoundedIcon from '@mui/icons-material/SensorsRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { fetchEquipment, createEquipment, scanEquipment } from '../api/client';

const quickActions = [
  { title: 'Scan QR Code', subtitle: 'Issue or return equipment', icon: <QrCodeScannerRoundedIcon />, color: 'success' },
  { title: 'Dispatch', subtitle: 'Send equipment to another unit', icon: <LocalShippingRoundedIcon />, color: 'info' },
  { title: 'Confirm Receipt', subtitle: 'Confirm received equipment', icon: <AssignmentTurnedInRoundedIcon />, color: 'primary' },
  { title: 'Maintenance', subtitle: 'Mark equipment under maintenance', icon: <BuildCircleRoundedIcon />, color: 'warning' },
];

const getStatusColor = (status) => {
  const s = (status || '').toLowerCase();
  if (s === 'available' || s === 'confirm') return 'success';
  if (s === 'maintenance') return 'warning';
  if (s === 'in_use' || s === 'in use') return 'primary';
  if (s === 'dispatched' || s === 'in transit' || s === 'dispatch') return 'info';
  return 'default';
};

export default function EquipmentPage() {
  const [equipmentRows, setEquipmentRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [scanOpen, setScanOpen] = useState(false);
  const [scanForm, setScanForm] = useState({ qr_code: '', action: 'scan' });
  const [form, setForm] = useState({ name: '', type: 'Rescue Gear', status: 'Available', location: 'HQ Store', quantity: 1 });

  useEffect(() => {
    loadEquipment();
  }, []);

  async function loadEquipment() {
    try {
      const data = await fetchEquipment();
      setEquipmentRows(data || []);
    } catch (e) {
      console.error('Failed to load equipment', e);
    }
  }

  async function handleAddEquipment() {
    try {
      await createEquipment({ ...form, category: form.type });
      setOpen(false);
      setForm({ name: '', type: 'Rescue Gear', status: 'Available', location: 'HQ Store', quantity: 1 });
      loadEquipment();
    } catch (e) {
      console.error('Failed to add equipment', e);
    }
  }

  async function handleScanSubmit() {
    if (!scanForm.qr_code) return alert("Please enter or scan a QR code");
    
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        await scanEquipment(scanForm.qr_code, {
          action: scanForm.action,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
        alert("Equipment status updated and location locked!");
        setScanOpen(false);
        setScanForm({ qr_code: '', action: 'scan' });
        loadEquipment();
      } catch (e) {
        alert("Failed to process scan. Please verify the QR Code.");
      }
    }, () => {
      alert("Location access is required to track equipment.");
    });
  }

  const dynamicRecentActivity = useMemo(() => {
    return [...equipmentRows]
      .sort((a, b) => new Date(b.updated_at || b.last_scanned_at || 0) - new Date(a.updated_at || a.last_scanned_at || 0))
      .slice(0, 4)
      .map(item => ({
        title: `${item.name || 'Item'} (${item.qr_code || `EQ-${item.id}`}) status: ${item.status || 'Available'}`,
        time: new Date(item.updated_at || item.last_scanned_at || Date.now()).toLocaleDateString(),
        user: item.location || 'HQ Store'
      }));
  }, [equipmentRows]);

  const categoryStats = useMemo(() => {
    const counts = {};
    equipmentRows.forEach(item => {
      const cat = item.type || item.category || 'General';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    const total = equipmentRows.length || 1;
    const colors = ['#84cc16', '#2563eb', '#f97316', '#8b5cf6', '#0f766e', '#eab308'];
    return Object.keys(counts).map((key, i) => ({
      label: key,
      value: `${counts[key]} (${Math.round((counts[key]/total)*100)}%)`,
      color: colors[i % colors.length]
    }));
  }, [equipmentRows]);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f4faf4' }}>
      <TopNavBar />

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 18px 30px rgba(15,23,42,0.08)' }}>
              <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>Quick Actions</Typography>
              <Grid container spacing={2}>
                {quickActions.map((action) => (
                  <Grid item xs={12} sm={6} key={action.title}>
                    <Paper 
                      onClick={() => {
                         const mapAction = action.title === 'Maintenance' ? 'maintenance' : action.title === 'Dispatch' ? 'dispatch' : action.title === 'Confirm Receipt' ? 'confirm' : 'scan';
                         setScanForm({ ...scanForm, action: mapAction });
                         setScanOpen(true);
                      }}
                      sx={{ p: 2, borderRadius: 3, display: 'flex', gap: 2, alignItems: 'center', cursor: 'pointer', transition: 'all 0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 20px rgba(0,0,0,0.06)' } }}
                    >
                      <Avatar sx={{ bgcolor: `${action.color}.100`, color: `${action.color}.700` }}>{action.icon}</Avatar>
                      <Box>
                        <Typography fontWeight={700}>{action.title}</Typography>
                        <Typography variant="body2" color="text.secondary">{action.subtitle}</Typography>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Paper>

            <Paper sx={{ mt: 3, p: 3, borderRadius: 4, boxShadow: '0 18px 30px rgba(15,23,42,0.08)' }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" fontWeight={800}>Scan QR Code</Typography>
                  <Typography variant="body2" color="text.secondary">Scan the QR code on equipment to view details and update status.</Typography>
                </Box>
                <Button variant="contained" color="success" onClick={() => setScanOpen(true)} sx={{ textTransform: 'none', px: 4 }}>Scan Tool</Button>
              </Stack>
            </Paper>

            <Paper sx={{ mt: 3, p: 3, borderRadius: 4, boxShadow: '0 18px 30px rgba(15,23,42,0.08)' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6" fontWeight={800}>Equipment List</Typography>
                <Button variant="outlined" color="primary" onClick={() => setOpen(true)} sx={{ textTransform: 'none' }}>+ Add New Tool</Button>
              </Stack>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Equipment ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Last Updated</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {equipmentRows.map((row, idx) => (
                      <TableRow key={row.id || idx} hover>
                        <TableCell>{row.qr_code || `EQ-${row.id}`}</TableCell>
                        <TableCell>{row.name || 'Unknown Item'}</TableCell>
                        <TableCell>{row.type || row.category || 'General'}</TableCell>
                        <TableCell>{row.lat ? `Lat: ${row.lat.toFixed(3)}` : 'HQ Store'}</TableCell>
                        <TableCell>
                          <Chip
                            label={row.status || 'Available'}
                            size="small"
                            color={getStatusColor(row.status || 'Available')}
                            sx={{ textTransform: 'capitalize', fontWeight: 600 }}
                          />
                        </TableCell>
                        <TableCell>{new Date(row.last_scanned_at || row.updated_at || Date.now()).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Stack spacing={3}>
              <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 18px 30px rgba(15,23,42,0.08)' }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                  <Typography variant="h6" fontWeight={800}>Recent Activity</Typography>
                  <Button size="small" sx={{ textTransform: 'none' }}>View All</Button>
                </Stack>
                <Stack spacing={2}>
                  {dynamicRecentActivity.length > 0 ? dynamicRecentActivity.map((item) => (
                    <Paper key={item.title} sx={{ p: 2, borderRadius: 3, bgcolor: '#f8fafc' }}>
                      <Typography fontWeight={700}>{item.title}</Typography>
                      <Typography variant="caption" color="text.secondary">{item.user} · {item.time}</Typography>
                    </Paper>
                  )) : (
                    <Typography variant="body2" color="text.secondary">No recent activity.</Typography>
                  )}
                </Stack>
              </Paper>

              <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 18px 30px rgba(15,23,42,0.08)' }}>
                <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>Equipment by Category</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}> 
                  {categoryStats.length > 0 ? categoryStats.map((item) => (
                    <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, borderRadius: 2, bgcolor: '#f8fafc' }}>
                      <Avatar sx={{ bgcolor: item.color, width: 10, height: 10 }} />
                      <Box>
                        <Typography variant="body2">{item.label}</Typography>
                        <Typography variant="caption" color="text.secondary">{item.value}</Typography>
                      </Box>
                    </Box>
                  )) : (
                    <Typography variant="body2" color="text.secondary" sx={{ gridColumn: 'span 2' }}>No categories available.</Typography>
                  )}
                </Box>
              </Paper>

              <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 18px 30px rgba(15,23,42,0.08)' }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                  <Typography variant="h6" fontWeight={800}>Low Stock / Maintenance Alerts</Typography>
                  <Button size="small" sx={{ textTransform: 'none' }}>View Details</Button>
                </Stack>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>{equipmentRows.filter(e => (e.status || '').toLowerCase() === 'maintenance').length} items under maintenance</Typography>
                    <Typography fontWeight={700}>View</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>{equipmentRows.filter(e => e.quantity && e.quantity <= 2).length} items low in stock</Typography>
                    <Typography fontWeight={700}>View</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>0 items require calibration</Typography>
                    <Typography fontWeight={700}>View</Typography>
                  </Box>
                </Stack>
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </Container>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={800}>Add New Equipment</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Equipment Name" fullWidth value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            <TextField label="Category/Type" fullWidth value={form.type} onChange={e => setForm({...form, type: e.target.value})} helperText="e.g. Rescue Gear, Medical Equipment" />
            <TextField label="Location" fullWidth value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
            <TextField label="Status" fullWidth value={form.status} onChange={e => setForm({...form, status: e.target.value})} />
            <TextField label="Quantity" type="number" fullWidth value={form.quantity} onChange={e => setForm({...form, quantity: Number(e.target.value)})} />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpen(false)} color="inherit">Cancel</Button>
          <Button onClick={handleAddEquipment} variant="contained" color="success">Add Equipment</Button>
        </DialogActions>
      </Dialog>

      {/* QR Code Scanning Dialog */}
      <Dialog open={scanOpen} onClose={() => setScanOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={800}>Scan Equipment QR Code</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Box sx={{ textAlign: 'center', p: 3, border: '2px dashed #cbd5e1', borderRadius: 3, bgcolor: '#f8fafc' }}>
              <QrCodeScannerRoundedIcon sx={{ fontSize: 64, color: '#94a3b8', mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                Point your camera at the QR code, or manually enter the Equipment ID below.
              </Typography>
            </Box>
            <TextField 
              label="Equipment QR ID" 
              fullWidth 
              value={scanForm.qr_code} 
              onChange={e => setScanForm({...scanForm, qr_code: e.target.value})} 
              placeholder="e.g. EQ-1001"
            />
            <TextField
              select
              label="Action to Perform"
              fullWidth
              SelectProps={{ native: true }}
              value={scanForm.action}
              onChange={e => setScanForm({...scanForm, action: e.target.value})}
            >
              <option value="scan">Log Location (Routine Scan)</option>
              <option value="dispatch">Dispatch to Field</option>
              <option value="confirm">Confirm Receipt</option>
              <option value="maintenance">Send to Maintenance</option>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setScanOpen(false)} color="inherit">Cancel</Button>
          <Button onClick={handleScanSubmit} variant="contained" color="success">Submit Scan</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
