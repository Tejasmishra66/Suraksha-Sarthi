import React, { useMemo, useState } from 'react';
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
  Tab,
  Tabs,
  TextField,
  Typography,
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

const tabs = ['All Updates', 'Alerts', 'Announcements', 'Press Releases', 'Circulars', 'Guidelines'];
const categoryOptions = [
  'All Categories',
  'Weather Alerts',
  'Road & Transport',
  'Health Advisory',
  'Rescue Operations',
  'Training & Drills',
  'General Information',
  'Others',
];
const dateRanges = ['Any Date', 'Last 24 Hours', 'Last 7 Days', 'Last 30 Days'];

const updateCards = [
  {
    id: 1,
    title: 'Heavy Rainfall Warning for Kullu, Mandi & Shimla',
    description: 'Heavy to very heavy rainfall expected in Kullu, Mandi and Shimla districts during next 48 hours. Stay alert and avoid landslide-prone areas.',
    category: 'Weather Alerts',
    time: '19 May 2024, 10:15 AM',
    badge: 'Weather Alert',
    color: '#ef4444',
    icon: WarningAmberRoundedIcon,
  },
  {
    id: 2,
    title: 'Road Blockage Due to Landslide on NH-5',
    description: 'Traffic movement is restricted near 9 Mile, NH-5 (Kullu-Manali). Motorists should use alternate routes and follow authorities on site.',
    category: 'Road & Transport',
    time: '19 May 2024, 09:30 AM',
    badge: 'Road & Transport',
    color: '#f59e0b',
    icon: RouteRoundedIcon,
  },
  {
    id: 3,
    title: 'Rescue Operation Successfully Completed in Spiti',
    description: 'SDRF headquarters rescued 12 tourists stranded near Chandratal. All persons are safe and moving to the nearest shelter.',
    category: 'Rescue Operations',
    time: '18 May 2024, 08:45 PM',
    badge: 'Rescue Operations',
    color: '#10b981',
    icon: GppGoodRoundedIcon,
  },
  {
    id: 4,
    title: 'Health Advisory: Stay Safe During Monsoon',
    description: 'Adopt simple hygiene measures, keep ORS and essential medicines ready, and avoid drinking untreated water.',
    category: 'Health Advisory',
    time: '18 May 2024, 06:20 PM',
    badge: 'Health Advisory',
    color: '#2563eb',
    icon: LocalHospitalRoundedIcon,
  },
  {
    id: 5,
    title: 'Mock Drill for Earthquake Preparedness',
    description: 'State-wide earthquake preparedness mock drill scheduled on 25 May 2024 at 11:00 AM. All departments to participate.',
    category: 'Training & Drills',
    time: '18 May 2024, 04:10 PM',
    badge: 'Training & Drills',
    color: '#8b5cf6',
    icon: SaveRoundedIcon,
  },
];

const latestAlerts = [
  { id: 1, title: 'Heavy Rainfall Warning', meta: 'Kullu, Mandi, Shimla', time: '19 May 2024, 10:15 AM', severity: 'High', color: '#ef4444' },
  { id: 2, title: 'Landslide Warning', meta: 'Kinnaur, Chamba', time: '19 May 2024, 08:40 AM', severity: 'Medium', color: '#f59e0b' },
  { id: 3, title: 'Rescue Operation Ongoing', meta: 'Lahaul & Spiti', time: '19 May 2024, 07:20 AM', severity: 'Low', color: '#10b981' },
];

const departments = [
  { id: 1, label: 'SDRF Himachal Pradesh', followed: true },
  { id: 2, label: 'India Meteorological Department', followed: false },
  { id: 3, label: 'Public Works Department', followed: false },
  { id: 4, label: 'Health Department', followed: false },
  { id: 5, label: 'Disaster Management Dept.', followed: false },
];

export default function UpdatesPage() {
  const [tab, setTab] = useState(0);
  const [category, setCategory] = useState('All Categories');
  const [dateRange, setDateRange] = useState('Any Date');
  const [selectedCategories, setSelectedCategories] = useState({
    'Weather Alerts': true,
    'Road & Transport': true,
    'Health Advisory': true,
    'Rescue Operations': true,
    'Training & Drills': true,
    'General Information': true,
    Others: true,
  });

  const filteredUpdates = useMemo(() => {
    return updateCards.filter((item) => {
      if (category !== 'All Categories' && item.category !== category) {
        return false;
      }
      if (!selectedCategories[item.category] && item.category in selectedCategories) {
        return false;
      }
      return true;
    });
  }, [category, selectedCategories]);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <TopNavBar />
      <Box
        sx={{
          backgroundImage: `linear-gradient(135deg, rgba(6,40,32,0.9), rgba(5,30,19,0.4)), url('/assets/hero.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#fff',
          py: { xs: 8, md: 12 },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography variant="overline" sx={{ color: '#a7f3d0', fontWeight: 700, mb: 2 }}>
                Official Updates & News
              </Typography>
              <Typography variant="h3" fontWeight={900} sx={{ maxWidth: 680, mb: 2 }}>
                Stay informed with verified updates, alerts and announcements from all departments.
              </Typography>
              <Typography sx={{ maxWidth: 680, color: 'rgba(255,255,255,0.85)', fontSize: 18, mb: 4 }}>
                Real-time bulletins keep your field teams and communities aware of threats, resources, and official guidance.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button variant="contained" color="success" sx={{ textTransform: 'none' }}>
                  View Live Alerts
                </Button>
                <Button variant="outlined" color="inherit" sx={{ textTransform: 'none', borderColor: 'rgba(255,255,255,0.8)' }}>
                  Browse All News
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={5}>
              <Paper sx={{ borderRadius: 4, bgcolor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)', p: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar sx={{ bgcolor: '#d1fae5', color: '#047857' }}>
                        <GppGoodRoundedIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" color="rgba(255,255,255,0.85)">Verified Information</Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)' }}>100% official updates</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar sx={{ bgcolor: '#dbEAFE', color: '#1d4ed8' }}>
                        <NotificationsActiveRoundedIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" color="rgba(255,255,255,0.85)">Timely Alerts</Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)' }}>Real-time notifications</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar sx={{ bgcolor: '#ede9fe', color: '#6d28d9' }}>
                        <PublicRoundedIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" color="rgba(255,255,255,0.85)">All Departments</Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)' }}>Unified information</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar sx={{ bgcolor: '#fef9c3', color: '#b45309' }}>
                        <CalendarTodayRoundedIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" color="rgba(255,255,255,0.85)">Secure & Trusted</Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)' }}>From authorized sources</Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 5 }}>
        <Paper sx={{ p: 2, mb: 4, borderRadius: 4, boxShadow: '0 18px 30px rgba(15,23,42,0.08)' }}>
          <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)} variant="scrollable" scrollButtons="auto" allowScrollButtonsMobile>
            {tabs.map((label) => (
              <Tab key={label} label={label} sx={{ textTransform: 'none', fontWeight: 700 }} />
            ))}
          </Tabs>
        </Paper>

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
              <Button variant="outlined" fullWidth>
                Reset Filters
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} lg={6}>
            <Stack spacing={3}>
              {filteredUpdates.map((item) => {
                const Icon = item.icon;
                return (
                  <Paper key={item.id} sx={{ p: 3, borderRadius: 4, boxShadow: '0 18px 30px rgba(15,23,42,0.06)' }}>
                    <Stack direction="row" spacing={2} alignItems="flex-start">
                      <Avatar sx={{ bgcolor: item.color, width: 52, height: 52 }}>
                        <Icon sx={{ color: '#fff' }} />
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2}>
                          <Typography variant="h6" fontWeight={800} sx={{ mb: { xs: 1, sm: 0 } }}>{item.title}</Typography>
                          <Button size="small" variant="outlined" sx={{ textTransform: 'none', borderColor: item.color, color: item.color }}>{item.badge}</Button>
                        </Stack>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>{item.description}</Typography>
                        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                          <Typography variant="caption" color="text.secondary">{item.category}</Typography>
                          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                          <Typography variant="caption" color="text.secondary">{item.time}</Typography>
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
                  <Button size="small" sx={{ textTransform: 'none' }}>View All</Button>
                </Stack>
                <Stack spacing={2}>
                  {latestAlerts.map((item) => (
                    <Paper key={item.id} variant="outlined" sx={{ p: 2, borderRadius: 3, borderColor: '#e5e7eb' }}>
                      <Typography fontWeight={800}>{item.title}</Typography>
                      <Typography variant="body2" color="text.secondary">{item.meta}</Typography>
                      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 1 }}>
                        <Typography variant="caption" color="text.secondary">{item.time}</Typography>
                        <Box sx={{ px: 1, py: 0.5, borderRadius: 1, bgcolor: item.color, color: '#fff', fontSize: 12 }}>{item.severity}</Box>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              </Paper>

              <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 18px 30px rgba(15,23,42,0.08)' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="h6" fontWeight={800}>Follow Departments</Typography>
                  <Button size="small" sx={{ textTransform: 'none' }}>Manage</Button>
                </Stack>
                <Stack spacing={1}>
                  {departments.map((dept) => (
                    <Stack key={dept.id} direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 1.5, borderRadius: 2, bgcolor: '#f8fafc' }}>
                      <Typography variant="body2">{dept.label}</Typography>
                      <Button size="small" variant={dept.followed ? 'contained' : 'outlined'} color={dept.followed ? 'success' : 'inherit'} sx={{ textTransform: 'none' }}>
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
    </Box>
  );
}
