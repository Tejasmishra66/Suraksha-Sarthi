import React, { useState, useEffect, useMemo } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
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
  Menu,
  MenuItem,
  Autocomplete
} from '@mui/material';
import TopNavBar from '../components/TopNavBar';
import QrCodeScannerRoundedIcon from '@mui/icons-material/QrCodeScannerRounded';
import { fetchEquipment, createEquipment, scanEquipment } from '../api/client';

const getStatusColor = (status) => {
  const s = (status || '').toLowerCase();
  if (s === 'available' || s === 'confirm') return 'success';
  if (s === 'maintenance') return 'warning';
  if (s === 'in_use' || s === 'in use') return 'primary';
  if (s === 'dispatched' || s === 'in transit' || s === 'dispatch') return 'info';
  return 'default';
};

const equipmentCategoryMap = {
  'Inflatable Rescue Boat': 'Water Rescue',
  'Life Jacket': 'Water Rescue',
  'First Aid Kit': 'Medical Equipment',
  'Ropes & Carabiners': 'Climbing & Rope Rescue',
  'Fire Extinguisher': 'Fire Safety',
  'Satellite Phone': 'Communication',
  'Portable Generator': 'Power & Lighting',
  'High-Capacity Water Pump': 'Water Management',
  'Heavy-Duty Chainsaw': 'Cutting & Clearing',
  'Evacuation Stretcher': 'Medical Equipment',
  'Drone (UAV)': 'Reconnaissance',
  'Thermal Imaging Camera': 'Reconnaissance',
  'Hydraulic Rescue Tool (Jaws of Life)': 'Heavy Rescue',
  'Breathing Apparatus (SCBA)': 'Fire Safety',
  'Emergency Floodlights': 'Power & Lighting'
};

const predefinedEquipmentNames = Object.keys(equipmentCategoryMap);
const predefinedCategories = Array.from(new Set(Object.values(equipmentCategoryMap)));

const predefinedStatuses = [
  'Available',
  'In Use',
  'Maintenance',
  'Dispatched',
  'In Transit'
];

export default function EquipmentPage() {
  const [equipmentRows, setEquipmentRows] = useState([]);
  const [activeView, setActiveView] = useState('inventory');
  const [scanForm, setScanForm] = useState({ qr_code: '', action: 'scan' });
  const [form, setForm] = useState({ name: '', type: 'Rescue Gear', status: 'Available', location: 'HQ Store', quantity: 1 });
  const [anchorEl, setAnchorEl] = useState(null);

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
      setActiveView('inventory');
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
        setActiveView('inventory');
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
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2} sx={{ mb: 4 }}>
          <Box>
            {activeView !== 'inventory' && (
              <Button onClick={() => setActiveView('inventory')} sx={{ mb: 1, textTransform: 'none', fontWeight: 700 }}>← Back to Dashboard</Button>
            )}
            <Typography variant="h4" fontWeight={900} color="#102f25">{activeView === 'inventory' ? 'Equipment Dashboard' : activeView === 'add' ? 'Add New Equipment' : 'Scan Equipment'}</Typography>
          </Box>
          <Button 
            variant="contained" 
            color="success" 
            size="large"
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{ textTransform: 'none', borderRadius: 3, px: 4, fontWeight: 700 }}
          >
            Equipment Actions ▾
          </Button>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)} PaperProps={{ sx: { mt: 1, borderRadius: 2, minWidth: 220, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' } }}>
            <MenuItem onClick={() => { setAnchorEl(null); setActiveView('add'); }} sx={{ fontWeight: 700, color: '#0b6b57', py: 1.5 }}>+ Add New Equipment</MenuItem>
            <MenuItem onClick={() => { setAnchorEl(null); setScanForm({ ...scanForm, action: 'scan' }); setActiveView('scan'); }} sx={{ py: 1.5 }}>Scan QR Code</MenuItem>
            <MenuItem onClick={() => { setAnchorEl(null); setScanForm({ ...scanForm, action: 'dispatch' }); setActiveView('scan'); }} sx={{ py: 1.5 }}>Dispatch to Field</MenuItem>
            <MenuItem onClick={() => { setAnchorEl(null); setScanForm({ ...scanForm, action: 'confirm' }); setActiveView('scan'); }} sx={{ py: 1.5 }}>Confirm Receipt</MenuItem>
            <MenuItem onClick={() => { setAnchorEl(null); setScanForm({ ...scanForm, action: 'maintenance' }); setActiveView('scan'); }} sx={{ py: 1.5 }}>Send to Maintenance</MenuItem>
          </Menu>
        </Stack>

        {activeView === 'inventory' && (
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 18px 30px rgba(15,23,42,0.08)' }}>
                <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>Equipment List</Typography>
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
        )}

        {activeView === 'add' && (
          <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, boxShadow: '0 18px 30px rgba(15,23,42,0.08)', maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h5" fontWeight={800} sx={{ mb: 3 }}>Equipment Details</Typography>
            <Stack spacing={3}>
          <Autocomplete
            freeSolo
            options={predefinedEquipmentNames}
            value={form.name}
            onInputChange={(event, newValue) => {
              const updatedForm = { ...form, name: newValue || '' };
              // Auto-select the category if the equipment matches a predefined one
              if (equipmentCategoryMap[newValue]) {
                updatedForm.type = equipmentCategoryMap[newValue];
              }
              setForm(updatedForm);
            }}
            renderInput={(params) => <TextField {...params} label="Equipment Name" fullWidth />}
          />
              <Autocomplete
                freeSolo
                options={predefinedCategories}
                value={form.type}
                onInputChange={(event, newValue) => setForm({...form, type: newValue || ''})}
                renderInput={(params) => <TextField {...params} label="Category/Type" fullWidth helperText="e.g. Rescue Gear, Medical Equipment" />}
              />
              <TextField label="Location" fullWidth value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
              <Autocomplete
                freeSolo
                options={predefinedStatuses}
                value={form.status}
                onInputChange={(event, newValue) => setForm({...form, status: newValue || ''})}
                renderInput={(params) => <TextField {...params} label="Status" fullWidth />}
              />
              <TextField label="Quantity" type="number" fullWidth value={form.quantity} onChange={e => setForm({...form, quantity: Number(e.target.value)})} />
              <Box sx={{ display: 'flex', gap: 2, pt: 2 }}>
                <Button onClick={() => setActiveView('inventory')} color="inherit" variant="outlined" sx={{ flex: 1, py: 1.5, fontWeight: 700 }}>Cancel</Button>
                <Button onClick={handleAddEquipment} variant="contained" color="success" sx={{ flex: 1, py: 1.5, fontWeight: 700 }}>Save Equipment</Button>
              </Box>
            </Stack>
          </Paper>
        )}

        {activeView === 'scan' && (
          <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, boxShadow: '0 18px 30px rgba(15,23,42,0.08)', maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h5" fontWeight={800} sx={{ mb: 1 }}>Equipment Scanner</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>Select an action and scan the QR code to update the equipment status.</Typography>
            
            <Stack spacing={4}>
              <Box sx={{ textAlign: 'center', p: 4, border: '2px dashed #cbd5e1', borderRadius: 3, bgcolor: '#f8fafc' }}>
                <QrCodeScannerRoundedIcon sx={{ fontSize: 80, color: '#94a3b8', mb: 2 }} />
                <Typography variant="body1" fontWeight={700} color="text.secondary">
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
              
              <Box sx={{ display: 'flex', gap: 2, pt: 2 }}>
                <Button onClick={() => setActiveView('inventory')} color="inherit" variant="outlined" sx={{ flex: 1, py: 1.5, fontWeight: 700 }}>Cancel</Button>
                <Button onClick={handleScanSubmit} variant="contained" color="success" sx={{ flex: 1, py: 1.5, fontWeight: 700 }}>Submit Scan</Button>
              </Box>
            </Stack>
          </Paper>
        )}
      </Container>
    </Box>
  );
}
