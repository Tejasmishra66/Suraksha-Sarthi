import React, { useMemo, useState, useEffect } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import TopNavBar from '../components/TopNavBar';
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import RouteRoundedIcon from '@mui/icons-material/RouteRounded';
import LocalHospitalRoundedIcon from '@mui/icons-material/LocalHospitalRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import GppGoodRoundedIcon from '@mui/icons-material/GppGoodRounded';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { fetchBulletins, fetchAlerts, createBulletin } from '../api/client';

const categoryOptions = [
  'All Categories',
  'Weather Alerts',
  'Road & Transport',
  'Health Advisory',
  'Rescue Operations',
  'Training & Drills',
  'General Information',
  'Connectivity',
  'Utility Status',
  'Others',
];
const dateRanges = ['Any Date', 'Last 24 Hours', 'Last 7 Days', 'Last 30 Days'];

const getCategoryStyles = (category) => {
  switch(category) {
    case 'Weather Alerts': return { color: '#ef4444', icon: WarningAmberRoundedIcon };
    case 'Road & Transport': return { color: '#f59e0b', icon: RouteRoundedIcon };
    case 'Rescue Operations': return { color: '#10b981', icon: GppGoodRoundedIcon };
    case 'Health Advisory': return { color: '#2563eb', icon: LocalHospitalRoundedIcon };
    case 'Training & Drills': return { color: '#8b5cf6', icon: SaveRoundedIcon };
    case 'Connectivity': return { color: '#14b8a6', icon: PublicRoundedIcon };
    case 'Utility Status': return { color: '#f97316', icon: RouteRoundedIcon };
    default: return { color: '#64748b', icon: PublicRoundedIcon };
  }
};

const getSeverityColor = (severity) => {
  const s = severity?.toLowerCase();
  if (s === 'high' || s === 'critical') return '#ef4444'; // Red
  if (s === 'medium') return '#f59e0b'; // Orange
  return '#3b82f6'; // Blue
};

const initialDepartments = [
  { id: 1, label: 'SDRF Himachal Pradesh', followed: true },
  { id: 2, label: 'India Meteorological Department', followed: false },
  { id: 3, label: 'Public Works Department', followed: false },
  { id: 4, label: 'Health Department', followed: false },
  { id: 5, label: 'Disaster Management Dept.', followed: false },
];

export default function UpdatesPage() {
  const [category, setCategory] = useState('All Categories');
  const [dateRange, setDateRange] = useState('Any Date');
  const [selectedCategories, setSelectedCategories] = useState({
    'Weather Alerts': true,
    'Road & Transport': true,
    'Health Advisory': true,
    'Rescue Operations': true,
    'Training & Drills': true,
    'General Information': true,
    'Connectivity': true,
    'Utility Status': true,
    Others: true,
  });

  const [departmentsList, setDepartmentsList] = useState(initialDepartments);
  const [bulletins, setBulletins] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [openBulletinDialog, setOpenBulletinDialog] = useState(false);
  const [newBulletin, setNewBulletin] = useState({ category: 'General Information', message: '' });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setBulletins((await fetchBulletins()) || []);
      setAlerts((await fetchAlerts()) || []);
    } catch (err) {
      console.error("Failed to load updates page data", err);
    }
  }

  const handlePostBulletin = async () => {
    if (!newBulletin.message) return;
    try {
      await createBulletin({ category: newBulletin.category, message: newBulletin.message });
      setOpenBulletinDialog(false);
      setNewBulletin({ category: 'General Information', message: '' });
      loadData(); // Refresh the feed
    } catch(err) {
      console.error("Failed to post bulletin", err);
      alert("Failed to post bulletin.");
    }
  };

  const handleResetFilters = () => {
    setCategory('All Categories');
    setDateRange('Any Date');
    setSelectedCategories({
      'Weather Alerts': true,
      'Road & Transport': true,
      'Health Advisory': true,
      'Rescue Operations': true,
      'Training & Drills': true,
      'General Information': true,
      'Connectivity': true,
      'Utility Status': true,
      Others: true,
    });
  };

  const toggleFollow = (id) => {
    setDepartmentsList((prev) =>
      prev.map((d) => (d.id === id ? { ...d, followed: !d.followed } : d))
    );
  };

  const filteredUpdates = useMemo(() => {
    return bulletins.filter((item) => {
      if (category !== 'All Categories' && item.category !== category) {
        return false;
      }
      if (!selectedCategories[item.category] && item.category in selectedCategories) {
        return false;
      }
      if (dateRange !== 'Any Date') {
        const itemDate = new Date(item.created_at || Date.now());
        const now = new Date();
        const diffTime = Math.abs(now - itemDate);
        const diffHours = diffTime / (1000 * 60 * 60);
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        if (dateRange === 'Last 24 Hours' && diffHours > 24) return false;
        if (dateRange === 'Last 7 Days' && diffDays > 7) return false;
        if (dateRange === 'Last 30 Days' && diffDays > 30) return false;
      }
      return true;
    });
  }, [bulletins, category, selectedCategories, dateRange]);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f4faf4' }}>
      <TopNavBar />

      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2} sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight={900} color="#102f25">Updates & Announcements</Typography>
          <Button variant="contained" color="primary" onClick={() => setOpenBulletinDialog(true)} sx={{ textTransform: 'none', borderRadius: 3, px: 4, fontWeight: 700 }}>
            Post Official Update
          </Button>
        </Stack>

        <Grid container spacing={3}>
          <Grid item xs={12} lg={3}>
            <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 18px 30px rgba(15,23,42,0.08)' }}>
              <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>Filter Updates</Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Category</InputLabel>
                <Select value={category} label="Category" onChange={(e) => setCategory(e.target.value)}>
                  {categoryOptions.map((option) => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>Categories</Typography>
              <FormGroup>
                {categoryOptions.slice(1).map((option) => (
                  <FormControlLabel
                    key={option}
                    control={
                      <Checkbox
                        checked={selectedCategories[option]}
                        onChange={(e) => setSelectedCategories((current) => ({ ...current, [option]: e.target.checked }))}
                      />
                    }
                    label={option}
                  />
                ))}
              </FormGroup>
              <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
                <InputLabel>Date Range</InputLabel>
                <Select value={dateRange} label="Date Range" onChange={(e) => setDateRange(e.target.value)}>
                  {dateRanges.map((option) => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button variant="outlined" fullWidth onClick={handleResetFilters}>
                Reset Filters
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} lg={6}>
            <Stack spacing={3}>
              {filteredUpdates.length === 0 ? (
                <Typography sx={{ p: 3, textAlign: 'center' }} color="text.secondary">No updates found for the selected filters.</Typography>
              ) : filteredUpdates.map((item) => {
                const style = getCategoryStyles(item.category);
                const Icon = style.icon;
                return (
                  <Paper key={item.id} sx={{ p: 3, borderRadius: 4, boxShadow: '0 18px 30px rgba(15,23,42,0.06)' }}>
                    <Stack direction="row" spacing={2} alignItems="flex-start">
                      <Avatar sx={{ bgcolor: style.color, width: 52, height: 52 }}>
                        <Icon sx={{ color: '#fff' }} />
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2}>
                          <Typography variant="h6" fontWeight={800} sx={{ mb: { xs: 1, sm: 0 } }}>{item.category} Update</Typography>
                          <Button size="small" variant="outlined" sx={{ textTransform: 'none', borderColor: style.color, color: style.color }}>{item.category}</Button>
                        </Stack>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>{item.message}</Typography>
                        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                          <Typography variant="caption" color="text.secondary">By Officer ID: {item.author_id || 'System'}</Typography>
                          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                          <Typography variant="caption" color="text.secondary">{new Date(item.created_at || Date.now()).toLocaleString()}</Typography>
                        </Stack>
                      </Box>
                    </Stack>
                  </Paper>
                );
              })}
            </Stack>
          </Grid>

          <Grid item xs={12} lg={3}>
            <Stack spacing={3}>
              <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 18px 30px rgba(15,23,42,0.08)' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="h6" fontWeight={800}>Latest Alerts</Typography>
                </Stack>
                <Stack spacing={2}>
                  {alerts.slice(0, 5).map((item) => (
                    <Paper key={item.id} variant="outlined" sx={{ p: 2, borderRadius: 3, borderColor: '#e2e8f0' }}>
                      <Typography fontWeight={800}>{item.disaster_type || item.disasterType} Alert</Typography>
                      <Typography variant="body2" color="text.secondary">Coordinates: {item.lat}, {item.lng}</Typography>
                      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 1 }}>
                        <Typography variant="caption" color="text.secondary">{new Date(item.created_at || Date.now()).toLocaleDateString()}</Typography>
                        <Box sx={{ px: 1, py: 0.5, borderRadius: 1, bgcolor: getSeverityColor(item.severity), color: '#fff', fontSize: 12, textTransform: 'capitalize' }}>{item.severity || 'Medium'}</Box>
                      </Stack>
                    </Paper>
                  ))}
                  {alerts.length === 0 && <Typography variant="body2" color="text.secondary">No active alerts.</Typography>}
                </Stack>
              </Paper>

              <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 18px 30px rgba(15,23,42,0.08)' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="h6" fontWeight={800}>Follow Departments</Typography>
                </Stack>
                <Stack spacing={1}>
                  {departmentsList.map((dept) => (
                    <Stack key={dept.id} direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 1.5, borderRadius: 2, bgcolor: '#f8fafc' }}>
                      <Typography variant="body2">{dept.label}</Typography>
                      <Button 
                        size="small" 
                        onClick={() => toggleFollow(dept.id)}
                        variant={dept.followed ? 'contained' : 'outlined'} 
                        color={dept.followed ? 'success' : 'inherit'} 
                        sx={{ textTransform: 'none' }}
                      >
                        {dept.followed ? 'Following' : 'Follow'}
                      </Button>
                    </Stack>
                  ))}
                </Stack>
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </Container>

      <Dialog open={openBulletinDialog} onClose={() => setOpenBulletinDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={800}>Post Official Update</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select 
                value={newBulletin.category} 
                label="Category" 
                onChange={(e) => setNewBulletin({...newBulletin, category: e.target.value})}
              >
                {categoryOptions.slice(1).map((option) => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField 
              label="Message / Content" 
              multiline 
              rows={4} 
              fullWidth 
              value={newBulletin.message} 
              onChange={(e) => setNewBulletin({...newBulletin, message: e.target.value})} 
              placeholder="Enter official announcement details here..."
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenBulletinDialog(false)} color="inherit">Cancel</Button>
          <Button onClick={handlePostBulletin} variant="contained" color="primary">Post Update</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
