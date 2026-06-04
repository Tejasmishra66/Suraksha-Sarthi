import React from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
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

const quickActions = [
  { title: 'Scan QR Code', subtitle: 'Issue or return equipment', icon: <QrCodeScannerRoundedIcon />, color: 'success' },
  { title: 'Dispatch', subtitle: 'Send equipment to another unit', icon: <LocalShippingRoundedIcon />, color: 'info' },
  { title: 'Confirm Receipt', subtitle: 'Confirm received equipment', icon: <AssignmentTurnedInRoundedIcon />, color: 'primary' },
  { title: 'Maintenance', subtitle: 'Mark equipment under maintenance', icon: <BuildCircleRoundedIcon />, color: 'warning' },
];

const equipmentRows = [
  { id: 'RS-047', name: 'Rope Set 100m', category: 'Rescue Gear', location: 'Kullu Store', status: 'In Use', updated: '19 May 2024, 10:30 AM' },
  { id: 'GS-012', name: 'Generator Set 5kVA', category: 'Power Equipment', location: 'Mandi Store', status: 'Available', updated: '19 May 2024, 09:45 AM' },
  { id: 'MK-025', name: 'Medical Kit - Advanced', category: 'Medical Equipment', location: 'Spiti Unit', status: 'In Transit', updated: '18 May 2024, 04:15 PM' },
  { id: 'OC-018', name: 'Oxygen Cylinder', category: 'Medical Equipment', location: 'Shimla Store', status: 'Maintenance', updated: '18 May 2024, 11:20 AM' },
  { id: 'STR-009', name: 'Stretcher (Foldable)', category: 'Rescue Gear', location: 'Una Store', status: 'Available', updated: '17 May 2024, 03:10 PM' },
];

const recentActivity = [
  { title: 'Rope Set (RS-047) issued to Kullu Team', time: '10:30 AM', user: 'Manish Thakur' },
  { title: 'GenSet (GS-012) returned by Mandi Team', time: '09:45 AM', user: 'Pooja Verma' },
  { title: 'Medical Kit (MK-025) dispatched to Spiti Unit', time: 'Yesterday', user: 'Vikram Negi' },
  { title: 'Oxygen Cylinder (OC-018) under maintenance at Shimla Store', time: 'Yesterday', user: 'Tara Sharma' },
];

const getStatusColor = (status) => {
  const statusColorMap = {
    Available: 'success',
    Maintenance: 'warning',
    'In Use': 'primary',
    'In Transit': 'info',
    Unknown: 'default',
  };

  return statusColorMap[status] || 'default';
};

export default function EquipmentPage() {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <TopNavBar />
      <Box
        sx={{
          backgroundImage: `linear-gradient(135deg, rgba(5,30,19,0.8), rgba(6,40,32,0.3)), url('/assets/hero.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#fff',
          py: { xs: 8, md: 12 },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <Stack spacing={2}>
                <Typography variant="overline" sx={{ color: '#a7f3d0', fontWeight: 700 }}>Equipment Management</Typography>
                <Typography variant="h3" fontWeight={900} sx={{ maxWidth: 680 }}>
                  Track, manage and monitor all SDRF equipment in real-time.
                </Typography>
                <Typography sx={{ maxWidth: 680, color: 'rgba(255,255,255,0.85)', fontSize: 18 }}>
                  Use QR-based equipment tracking, live location visibility, and maintenance alerts to keep teams ready and supported.
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0,1fr))' }, gap: 1, mt: 2 }}>
                  <Button variant="contained" color="success" sx={{ textTransform: 'none' }}>QR Code Tracking</Button>
                  <Button variant="outlined" color="inherit" sx={{ textTransform: 'none', borderColor: 'rgba(255,255,255,0.7)' }}>Live Equipment Map</Button>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ borderRadius: 4, bgcolor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.14)', p: 3 }}>
                <Typography variant="subtitle2" color="rgba(255,255,255,0.8)">Equipment Overview</Typography>
                <Stack spacing={1} sx={{ mt: 2 }}>
                  {[
                    { label: 'Total Equipment', value: '238' },
                    { label: 'In Use', value: '72' },
                    { label: 'Available', value: '148' },
                    { label: 'Under Maintenance', value: '18' },
                  ].map((item) => (
                    <Box key={item.label} sx={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.92)' }}>
                      <Typography>{item.label}</Typography>
                      <Typography fontWeight={700}>{item.value}</Typography>
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Paper sx={{ p: 2, mb: 3, borderRadius: 4, boxShadow: '0 18px 30px rgba(15,23,42,0.08)' }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} alignItems="center">
            {['Overview', 'All Equipment', 'Issue / Return', 'Transfer', 'Maintenance', 'Live Location'].map((label, index) => (
              <Button key={label} variant={index === 0 ? 'contained' : 'text'} color={index === 0 ? 'success' : 'inherit'} sx={{ textTransform: 'none', flex: 1, minWidth: 120 }}>
                {label}
              </Button>
            ))}
          </Stack>
        </Paper>

        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 18px 30px rgba(15,23,42,0.08)' }}>
              <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>Quick Actions</Typography>
              <Grid container spacing={2}>
                {quickActions.map((action) => (
                  <Grid item xs={12} sm={6} key={action.title}>
                    <Paper sx={{ p: 2, borderRadius: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
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
                <Button variant="contained" color="success" sx={{ textTransform: 'none' }}>Start Scanning</Button>
              </Stack>
            </Paper>

            <Paper sx={{ mt: 3, p: 3, borderRadius: 4, boxShadow: '0 18px 30px rgba(15,23,42,0.08)' }}>
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
                    {equipmentRows.map((row) => (
                      <TableRow key={row.id} hover>
                        <TableCell>{row.id}</TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.category}</TableCell>
                        <TableCell>{row.location}</TableCell>
                        <TableCell>
                          <Chip
                            label={row.status}
                            size="small"
                            color={getStatusColor(row.status)}
                          />
                        </TableCell>
                        <TableCell>{row.updated}</TableCell>
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
                  {recentActivity.map((item) => (
                    <Paper key={item.title} sx={{ p: 2, borderRadius: 3, bgcolor: '#f8fafc' }}>
                      <Typography fontWeight={700}>{item.title}</Typography>
                      <Typography variant="caption" color="text.secondary">{item.user} · {item.time}</Typography>
                    </Paper>
                  ))}
                </Stack>
              </Paper>

              <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 18px 30px rgba(15,23,42,0.08)' }}>
                <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>Equipment by Category</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}> 
                  {[
                    { label: 'Rescue Gear', value: '82 (34%)', color: '#84cc16' },
                    { label: 'Medical Equipment', value: '56 (24%)', color: '#2563eb' },
                    { label: 'Power Equipment', value: '38 (16%)', color: '#f97316' },
                    { label: 'Communication', value: '28 (12%)', color: '#8b5cf6' },
                    { label: 'Others', value: '34 (14%)', color: '#0f766e' },
                  ].map((item) => (
                    <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, borderRadius: 2, bgcolor: '#f8fafc' }}>
                      <Avatar sx={{ bgcolor: item.color, width: 10, height: 10 }} />
                      <Box>
                        <Typography variant="body2">{item.label}</Typography>
                        <Typography variant="caption" color="text.secondary">{item.value}</Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Paper>

              <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 18px 30px rgba(15,23,42,0.08)' }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                  <Typography variant="h6" fontWeight={800}>Low Stock / Maintenance Alerts</Typography>
                  <Button size="small" sx={{ textTransform: 'none' }}>View Details</Button>
                </Stack>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>3 items under maintenance</Typography>
                    <Typography fontWeight={700}>View</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>5 items low in stock</Typography>
                    <Typography fontWeight={700}>View</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>2 items require calibration</Typography>
                    <Typography fontWeight={700}>View</Typography>
                  </Box>
                </Stack>
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
