import React, { useState, useEffect } from 'react';
import {
  Box, Container, Grid, Paper, Stack, Typography, Chip, Button, 
  Select, MenuItem, Tabs, Tab, TextField, InputAdornment, Avatar,
  Checkbox, FormGroup, FormControlLabel, Pagination
} from '@mui/material';
import {
  VerifiedRounded as VerifiedIcon,
  SearchRounded as SearchIcon,
  FilterListRounded as FilterIcon,
  WarningRounded as WarningIcon,
  RouteRounded as RoadIcon,
  GroupsRounded as GroupsIcon,
  LocalHospitalRounded as MedicalIcon,
  CampaignRounded as CampaignIcon,
  GppGoodRounded as SecureIcon,
  NotificationsActiveRounded as BellIcon,
  DomainRounded as DeptIcon,
  InfoRounded as InfoIcon,
  CheckCircleOutlineRounded as CheckIcon,
  MedicalServicesRounded as BagIcon,
  SyncRounded as SyncIcon
} from '@mui/icons-material';
import { fetchBulletins } from '../api/client';

const CATEGORIES = [
  'Weather Alerts',
  'Road & Transport',
  'Health Advisory',
  'Rescue Operations',
  'Training & Drills',
  'General Information',
  'Others'
];

const getCategoryStyles = (category) => {
  const cat = category?.toLowerCase() || '';
  if (cat.includes('weather')) return { color: '#ef4444', bg: '#fef2f2', icon: <WarningIcon sx={{ color: '#ef4444' }} /> };
  if (cat.includes('road') || cat.includes('transport')) return { color: '#f59e0b', bg: '#fffbeb', icon: <RoadIcon sx={{ color: '#f59e0b' }} /> };
  if (cat.includes('rescue')) return { color: '#10b981', bg: '#f0fdf4', icon: <GroupsIcon sx={{ color: '#10b981' }} /> };
  if (cat.includes('health') || cat.includes('medical')) return { color: '#8b5cf6', bg: '#f3e8ff', icon: <BagIcon sx={{ color: '#8b5cf6' }} /> };
  return { color: '#3b82f6', bg: '#eff6ff', icon: <InfoIcon sx={{ color: '#3b82f6' }} /> };
};

export default function UpdatesPage() {
  const [feedData, setFeedData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState(CATEGORIES);
  
  const handleCategoryToggle = (cat) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter(c => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  useEffect(() => {
    fetchBulletins()
      .then(data => {
        if (data && data.length > 0) {
          setFeedData(data.map(b => ({
            id: b.id,
            title: b.category,
            dept: b.author_agency || b.author_name || 'Official Department',
            desc: b.message,
            date: new Date(b.timestamp).toLocaleString(),
            tag: b.category,
            ...getCategoryStyles(b.category)
          })));
        }
        // No fallback mock data
      })
      .catch(e => console.error(e));
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f4f6f8', fontFamily: "'Inter', sans-serif" }}>
      
      {/* 1. HERO SECTION */}
      <Box sx={{ 
        position: 'relative',
        height: 450,
        backgroundImage: 'url(/mountain-updates.jpg)', // Mountain background
        backgroundSize: 'cover',
        backgroundPosition: 'top',
        pt: 8, pb: 4, px: { xs: 2, md: 6 }
      }}>
        {/* Filter removed as requested */}
        
        {/* Hero text removed as requested */}
      </Box>

      {/* 2. TAB NAVIGATION BAR (Now just Search) */}
      <Container maxWidth="xl" sx={{ mt: -3, position: 'relative', zIndex: 2, mb: 4 }}>
        <Paper elevation={2} sx={{ borderRadius: 2, bgcolor: '#fff', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', p: 2 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField 
              size="small" 
              placeholder="Search updates..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }} 
              sx={{ width: 250, bgcolor: '#f8fafc' }}
            />
          </Box>
        </Paper>
      </Container>

      {/* 3. MAIN DASHBOARD CONTENT */}
      <Container maxWidth="xl" sx={{ pb: 8 }}>
        <Grid container spacing={3}>
          
          {/* LEFT COLUMN: Filters */}
          <Grid item xs={12} md={3}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0' }}>
              <Typography variant="subtitle2" fontWeight={800} color="#0f172a" mb={3}>Filter Categories</Typography>
              
              <FormGroup sx={{ mb: 4 }}>
                {CATEGORIES.map((cat, idx) => (
                  <FormControlLabel 
                    key={idx} 
                    control={
                      <Checkbox 
                        checked={selectedCategories.includes(cat)}
                        onChange={() => handleCategoryToggle(cat)}
                        size="small" 
                        sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#0f4a30' } }} 
                      />
                    } 
                    label={<Typography variant="body2" fontWeight={600} color="#475569">{cat}</Typography>} 
                    sx={{ mb: -0.5 }}
                  />
                ))}
              </FormGroup>

              <Button fullWidth variant="outlined" startIcon={<SyncIcon />} onClick={() => setSelectedCategories(CATEGORIES)} sx={{ color: '#0f4a30', borderColor: '#cbd5e1', fontWeight: 700 }}>
                Reset Filters
              </Button>
            </Paper>
          </Grid>

          {/* CENTER COLUMN: Updates Feed */}
          <Grid item xs={12} md={6}>
            <Stack spacing={2}>
              {feedData.filter(item => 
                ((item.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || (item.desc || '').toLowerCase().includes(searchQuery.toLowerCase())) &&
                selectedCategories.includes(item.tag)
              ).length === 0 ? (
                <Paper elevation={0} sx={{ p: 6, borderRadius: 3, border: '1px solid #e2e8f0', textAlign: 'center' }}>
                  <Typography variant="subtitle1" fontWeight={700} color="#0f172a" mb={1}>No Updates Yet</Typography>
                  <Typography variant="body2" color="#64748b">Official bulletins and alerts will appear here once posted by your department.</Typography>
                </Paper>
              ) : feedData.filter(item => 
                ((item.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || (item.desc || '').toLowerCase().includes(searchQuery.toLowerCase())) &&
                selectedCategories.includes(item.tag)
              ).map((item) => (
                <Paper key={item.id} elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0', transition: 'all 0.2s', '&:hover': { borderColor: '#cbd5e1', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)' } }}>
                  <Grid container spacing={3} wrap="nowrap">
                    <Grid item>
                      <Box sx={{ width: 64, height: 64, borderRadius: 2, bgcolor: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {React.cloneElement(item.icon, { sx: { fontSize: 32, color: item.color } })}
                      </Box>
                    </Grid>
                    <Grid item xs>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={800} color="#0f172a" mb={0.5}>{item.title}</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Typography variant="caption" fontWeight={700} color="#475569">{item.dept}</Typography>
                            <VerifiedIcon sx={{ fontSize: 14, color: '#10b981' }} />
                          </Box>
                        </Box>
                        <Stack alignItems="flex-end">
                          <Typography variant="caption" color="#64748b" mb={1}>{item.date}</Typography>
                          <Chip label={item.tag} size="small" sx={{ bgcolor: item.bg, color: item.color, fontWeight: 700, fontSize: '0.7rem', height: 22 }} />
                        </Stack>
                      </Stack>
                      <Typography variant="body2" color="#64748b" lineHeight={1.6}>{item.desc}</Typography>
                    </Grid>
                  </Grid>
                </Paper>
              ))}

            </Stack>
          </Grid>

          {/* RIGHT COLUMN: Alerts & Following */}
          <Grid item xs={12} md={3}>
            <Stack spacing={3}>
              
              {/* Latest Alerts */}
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                  <Typography variant="subtitle2" fontWeight={800} color="#0f172a">Latest Alerts</Typography>
                  <Typography variant="caption" fontWeight={700} color="#0f4a30" sx={{ cursor: 'pointer' }}>View All</Typography>
                </Stack>
                
              <Stack spacing={2}>
                <Typography variant="body2" color="#64748b" textAlign="center" py={4}>
                  No active alerts at the moment.
                </Typography>
              </Stack>
              </Paper>

              {/* Follow Departments */}
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0' }}>
                <Typography variant="subtitle2" fontWeight={800} color="#0f172a" mb={1}>Follow Departments</Typography>
                <Typography variant="caption" color="#64748b" mb={3} display="block">Get updates from specific departments</Typography>
                
                <Stack spacing={2}>
                  {[
                    { name: 'SDRF Himachal Pradesh', followed: true },
                    { name: 'India Meteorological Department', followed: false },
                    { name: 'Public Works Department', followed: false },
                    { name: 'Health Department', followed: false },
                    { name: 'Disaster Management Dept.', followed: false }
                  ].map((dept, idx) => (
                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 24, height: 24, bgcolor: '#f1f5f9', color: '#0f172a', fontSize: '0.75rem' }}>{dept.name.charAt(0)}</Avatar>
                        <Typography variant="caption" fontWeight={700} color="#0f172a">{dept.name}</Typography>
                      </Box>
                      <Button 
                        size="small" 
                        variant={dept.followed ? "contained" : "outlined"}
                        sx={{ 
                          height: 24, fontSize: '0.65rem', fontWeight: 700, px: 2,
                          ...(dept.followed ? { bgcolor: '#0f4a30', color: '#fff', '&:hover': { bgcolor: '#0a3622' } } : { color: '#475569', borderColor: '#cbd5e1' })
                        }}
                      >
                        {dept.followed ? 'Following' : 'Follow'}
                      </Button>
                    </Box>
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
