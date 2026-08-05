import React, { useState, useEffect } from 'react';
import {
  Box, Container, Grid, Typography, Button, TextField,
  InputAdornment, Stack, Divider, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Pagination, MenuItem, Select
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import SearchRoundedIcon        from '@mui/icons-material/SearchRounded';
import FilterListRoundedIcon    from '@mui/icons-material/FilterListRounded';
import FileDownloadRoundedIcon  from '@mui/icons-material/FileDownloadRounded';
import AddRoundedIcon           from '@mui/icons-material/AddRounded';
import LocationOnRoundedIcon    from '@mui/icons-material/LocationOnRounded';
import BusinessRoundedIcon      from '@mui/icons-material/BusinessRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import BuildRoundedIcon         from '@mui/icons-material/BuildRounded';
import AccessTimeRoundedIcon    from '@mui/icons-material/AccessTimeRounded';
import WarningAmberRoundedIcon  from '@mui/icons-material/WarningAmberRounded';
import Inventory2RoundedIcon    from '@mui/icons-material/Inventory2Rounded';
import SyncRoundedIcon          from '@mui/icons-material/SyncRounded';
import ShieldRoundedIcon        from '@mui/icons-material/ShieldRounded';
import VerifiedUserRoundedIcon  from '@mui/icons-material/VerifiedUserRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded';
import CellWifiRoundedIcon      from '@mui/icons-material/CellWifiRounded';
import MedicalServicesRoundedIcon from '@mui/icons-material/MedicalServicesRounded';
import SearchOffRoundedIcon     from '@mui/icons-material/SearchOffRounded';
import ConstructionRoundedIcon  from '@mui/icons-material/ConstructionRounded';
import PhishingRoundedIcon      from '@mui/icons-material/PhishingRounded';

import { fetchResources } from '../api/client';

const NAVY = '#0F172A';
const BLUE = '#1D4ED8';
const LIGHT_BLUE = '#EFF6FF';

const CAT_COLORS = {
  'Rescue & Search':     { hex: '#EF4444', icon: <SearchOffRoundedIcon sx={{ fontSize: 16 }} /> },
  'Water Rescue':        { hex: '#3B82F6', icon: <PhishingRoundedIcon sx={{ fontSize: 16 }} /> },
  'Medical & First Aid': { hex: '#10B981', icon: <MedicalServicesRoundedIcon sx={{ fontSize: 16 }} /> },
  'Vehicles':            { hex: '#F59E0B', icon: <LocalShippingRoundedIcon sx={{ fontSize: 16 }} /> },
  'Communication':       { hex: '#8B5CF6', icon: <CellWifiRoundedIcon sx={{ fontSize: 16 }} /> },
  'Tools & Accessories': { hex: '#06B6D4', icon: <ConstructionRoundedIcon sx={{ fontSize: 16 }} /> },
  'Safety & Protection': { hex: '#EAB308', icon: <ShieldRoundedIcon sx={{ fontSize: 16 }} /> },
};

const STATUS_STYLE = {
  'Available':   { color: '#166534', bg: '#DCFCE7', icon: <CheckCircleOutlineRoundedIcon sx={{ fontSize: 14 }} /> },
  'In Use':      { color: '#1E40AF', bg: '#DBEAFE', icon: <AccessTimeRoundedIcon sx={{ fontSize: 14 }} /> },
  'Maintenance': { color: '#92400E', bg: '#FEF3C7', icon: <BuildRoundedIcon sx={{ fontSize: 14 }} /> },
};

const MOCK_DATA = [];

const TRUST_BADGES = [
  { icon: <Inventory2RoundedIcon />, label: 'Centralized Inventory', sub: 'All equipment in one place' },
  { icon: <SyncRoundedIcon />, label: 'Real-time Availability', sub: 'Live status and location tracking' },
  { icon: <BuildRoundedIcon />, label: 'Maintenance Tracking', sub: 'Track service and expiry dates' },
  { icon: <VerifiedUserRoundedIcon />, label: 'Better Preparedness', sub: 'Right equipment, right time' },
];

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState(MOCK_DATA);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchResources()
      .then((d) => {
        if (d && d.length > 0) {
          // Map real data to table format if it exists, otherwise keep mock data for perfect blueprint match
          const mapped = d.map((e, i) => ({
            id: `EQP-${(e.category || 'GEN').substring(0,3).toUpperCase()}-00${i+1}`,
            name: e.name,
            category: e.category || 'Rescue & Search',
            department: e.department || 'Shimla HQ',
            status: e.status === 'deployed' ? 'In Use' : e.status === 'in_transit' ? 'Maintenance' : 'Available',
            quantity: e.quantity || 1,
            available: (e.status === 'available' || !e.status) ? (e.quantity || 1) : 0
          }));
          setEquipment(mapped);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = equipment.filter(e => !search || e.name.toLowerCase().includes(search.toLowerCase()) || e.id.toLowerCase().includes(search.toLowerCase()));

  // Stats Calculations
  const totalEq = equipment.reduce((acc, curr) => acc + curr.quantity, 0) || 0;
  const availEq = equipment.reduce((acc, curr) => acc + curr.available, 0) || 0;
  const inUseEq = equipment.filter(e => e.status === 'In Use').reduce((acc, curr) => acc + curr.quantity, 0) || 0;
  const maintEq = equipment.filter(e => e.status === 'Maintenance').reduce((acc, curr) => acc + curr.quantity, 0) || 0;

  // HQ Calculations
  const hqs = ['Mandi HQ', 'Kangra HQ', 'Shimla HQ'];
  const hqStats = hqs.map(hq => {
    const hqItems = equipment.filter(e => e.department === hq);
    return {
      name: hq,
      total: hqItems.length || 0,
      avail: hqItems.filter(e => e.status === 'Available').length || 0
    };
  });

  // SVG Donut Chart generation
  const catStats = Object.entries(CAT_COLORS).map(([name, meta]) => {
    const count = equipment.filter(e => e.category === name).reduce((a, c) => a + c.quantity, 0);
    return { name, count, hex: meta.hex };
  }).filter(c => c.count > 0).sort((a, b) => b.count - a.count);
  
  // Removed fallback data, use calculated stats
  const finalCatStats = catStats;

  let currentOffset = 0;
  const chartData = finalCatStats.map(stat => {
    const percentage = (stat.count / totalEq) * 100;
    const strokeDasharray = `${percentage} 100`;
    const strokeDashoffset = -currentOffset;
    currentOffset += percentage;
    return { ...stat, strokeDasharray, strokeDashoffset, percentage };
  });

  return (
    <Box sx={{ bgcolor: '#F8FAFC', minHeight: 'calc(100vh - 66px)', display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth="xl" sx={{ flexGrow: 1, py: 3, display: 'flex', flexDirection: 'column' }}>
        <Grid container spacing={3} sx={{ flexGrow: 1 }}>
          
          {/* ══ LEFT SIDEBAR ══ */}
          <Grid item xs={12} lg={2.5}>
            {/* Header Block */}
            <Box sx={{ bgcolor: BLUE, color: '#FFF', borderRadius: 3, p: 2.5, mb: 3 }}>
              <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', mb: 0.5 }}>RESOURCES & EQUIPMENT</Typography>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, opacity: 0.9 }}>
                View and manage all equipment available with SDRF across Himachal Pradesh.
              </Typography>
            </Box>

            {/* Locations List */}
            <Box sx={{ mb: 4 }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: NAVY, mb: 1.5, letterSpacing: '0.05em' }}>LOCATIONS</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: LIGHT_BLUE, p: 1.5, borderRadius: 2, mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOnRoundedIcon sx={{ fontSize: 16, color: BLUE }} />
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: BLUE }}>All Locations</Typography>
                </Box>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, color: BLUE }}>{totalEq}</Typography>
              </Box>
              {hqStats.map(hq => (
                <Box key={hq.name} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, borderRadius: 2, cursor: 'pointer', '&:hover': { bgcolor: '#F1F5F9' } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BusinessRoundedIcon sx={{ fontSize: 16, color: '#64748B' }} />
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: NAVY }}>{hq.name.replace(' HQ', ' Headquarters')}</Typography>
                  </Box>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B' }}>{hq.total}</Typography>
                </Box>
              ))}
            </Box>

            {/* Equipment Categories */}
            <Box sx={{ mb: 4 }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: NAVY, mb: 1.5, letterSpacing: '0.05em' }}>EQUIPMENT CATEGORIES</Typography>
              {finalCatStats.map(cat => (
                <Box key={cat.name} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, borderRadius: 2, cursor: 'pointer', '&:hover': { bgcolor: '#F1F5F9' } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ color: cat.hex, display: 'flex' }}>{CAT_COLORS[cat.name]?.icon || <BuildRoundedIcon sx={{ fontSize: 16 }} />}</Box>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: NAVY }}>{cat.name}</Typography>
                  </Box>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>{cat.count}</Typography>
                </Box>
              ))}
            </Box>

            {/* Need New Equipment */}
            <Box sx={{ bgcolor: '#FFF', borderRadius: 3, border: '1px solid #E2E8F0', p: 2, textAlign: 'center' }}>
              <Box sx={{ display: 'inline-flex', p: 1, bgcolor: LIGHT_BLUE, borderRadius: 2, color: BLUE, mb: 1 }}>
                <BuildRoundedIcon sx={{ fontSize: 20 }} />
              </Box>
              <Typography sx={{ fontSize: '0.85rem', fontWeight: 800, color: NAVY, mb: 0.5 }}>Need New Equipment?</Typography>
              <Typography sx={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 500, mb: 2 }}>Request new equipment or report damaged items.</Typography>
              <Button variant="outlined" size="small" fullWidth sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, borderColor: '#E2E8F0', color: BLUE, '&:hover': { bgcolor: LIGHT_BLUE } }}>
                <SyncRoundedIcon sx={{ fontSize: 16, mr: 0.5 }} /> Request Equipment
              </Button>
            </Box>
          </Grid>


          {/* ══ CENTER AREA ══ */}
          <Grid item xs={12} lg={6.5}>
            {/* Top Bar */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
              <Box>
                <Typography sx={{ fontSize: '1.2rem', fontWeight: 900, color: NAVY, mb: 0.5 }}>All Equipment</Typography>
                <Typography sx={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500 }}>Complete inventory of SDRF equipment across all headquarters</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField 
                  size="small" 
                  placeholder="Search equipment.."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  InputProps={{
                    endAdornment: <InputAdornment position="end"><SearchRoundedIcon sx={{ fontSize: 18, color: '#94A3B8' }} /></InputAdornment>
                  }}
                  sx={{ width: 180, '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#FFF', fontSize: '0.8rem', fontWeight: 600 } }}
                />
                <Button variant="outlined" startIcon={<FilterListRoundedIcon />} sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, color: NAVY, borderColor: '#E2E8F0', bgcolor: '#FFF' }}>Filter</Button>
                <Button variant="outlined" startIcon={<FileDownloadRoundedIcon />} sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, color: NAVY, borderColor: '#E2E8F0', bgcolor: '#FFF' }}>Export</Button>
              </Box>
            </Box>

            {/* HQ Summary Cards */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {[
                { hq: 'Mandi Headquarters', icon: <BusinessRoundedIcon />, bg: '#ECFCCB', color: '#166534', num: 34, avail: 24 },
                { hq: 'Kangra Headquarters', icon: <BusinessRoundedIcon />, bg: '#DBEAFE', color: '#1E40AF', num: 32, avail: 21 },
                { hq: 'Shimla Headquarters', icon: <BusinessRoundedIcon />, bg: '#FEF3C7', color: '#92400E', num: 32, avail: 20 },
              ].map((c, i) => (
                <Grid item xs={4} key={i}>
                  <Box sx={{ bgcolor: '#FFF', borderRadius: 3, border: '1px solid #E2E8F0', p: 1.5, display: 'flex', gap: 1.5, alignItems: 'center', cursor: 'pointer', '&:hover': { borderColor: c.color } }}>
                    <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: c.bg, color: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {c.icon}
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: NAVY }}>{c.hq}</Typography>
                      <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                        <Typography sx={{ fontSize: '0.65rem', fontWeight: 800, color: NAVY }}>{c.num} Items</Typography>
                        <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#10B981' }}>{c.avail} Available</Typography>
                      </Box>
                    </Box>
                    <KeyboardArrowRightRoundedIcon sx={{ color: '#94A3B8', fontSize: 16 }} />
                  </Box>
                </Grid>
              ))}
            </Grid>

            {/* Data Table */}
            <Box sx={{ bgcolor: '#FFF', borderRadius: 3, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
              <TableContainer sx={{ minHeight: 400 }}>
                <Table size="small">
                  <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                    <TableRow>
                      <TableCell sx={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.05em' }}>EQUIPMENT</TableCell>
                      <TableCell sx={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.05em' }}>CATEGORY</TableCell>
                      <TableCell sx={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.05em' }}>LOCATION</TableCell>
                      <TableCell sx={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.05em' }}>STATUS</TableCell>
                      <TableCell sx={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.05em', textAlign: 'center' }}>QUANTITY</TableCell>
                      <TableCell sx={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.05em', textAlign: 'center' }}>AVAILABLE</TableCell>
                      <TableCell sx={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.05em', textAlign: 'center' }}>ACTION</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filtered.slice(0, 8).map((row, i) => {
                      const statusConf = STATUS_STYLE[row.status] || STATUS_STYLE['Available'];
                      const catConf = CAT_COLORS[row.category] || { hex: NAVY, icon: <BuildRoundedIcon sx={{ fontSize: 16 }} /> };
                      return (
                        <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: '#F8FAFC' } }}>
                          <TableCell sx={{ py: 1.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Box sx={{ width: 32, height: 32, borderRadius: 2, bgcolor: `${catConf.hex}15`, color: catConf.hex, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {catConf.icon}
                              </Box>
                              <Box>
                                <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, color: NAVY }}>{row.name}</Typography>
                                <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: '#94A3B8' }}>{row.id}</Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'inline-flex', px: 1, py: 0.3, borderRadius: '4px', bgcolor: `${catConf.hex}10`, color: catConf.hex, fontSize: '0.65rem', fontWeight: 800 }}>
                              {row.category}
                            </Box>
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600, color: NAVY }}>{row.department}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 1, py: 0.3, borderRadius: '4px', bgcolor: statusConf.bg, color: statusConf.color, fontSize: '0.65rem', fontWeight: 800 }}>
                              {statusConf.icon} {row.status}
                            </Box>
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.8rem', fontWeight: 700, color: NAVY, textAlign: 'center' }}>{row.quantity}</TableCell>
                          <TableCell sx={{ fontSize: '0.8rem', fontWeight: 700, color: NAVY, textAlign: 'center' }}>{row.available}</TableCell>
                          <TableCell sx={{ textAlign: 'center' }}>
                            <Button size="small" variant="outlined" sx={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'none', py: 0.2, borderColor: '#E2E8F0', color: BLUE, '&:hover': { bgcolor: LIGHT_BLUE } }}>
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              <Box sx={{ p: 1.5, borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>Showing 1 to 8 of 98 items</Typography>
                <Pagination count={13} shape="rounded" color="primary" size="small" sx={{ '& .MuiPaginationItem-root': { fontWeight: 700, fontSize: '0.75rem' } }} />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>Items per page:</Typography>
                  <Select size="small" value={8} sx={{ height: 28, fontSize: '0.75rem', fontWeight: 700 }}>
                    <MenuItem value={8}>8</MenuItem>
                  </Select>
                </Box>
              </Box>
            </Box>
          </Grid>


          {/* ══ RIGHT SIDEBAR ══ */}
          <Grid item xs={12} lg={3}>
            {/* Equipment Overview */}
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: NAVY, mb: 1.5, letterSpacing: '0.05em' }}>EQUIPMENT OVERVIEW</Typography>
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid item xs={6}>
                <Box sx={{ bgcolor: '#FFF', p: 2, borderRadius: 3, border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ color: BLUE }}><Inventory2RoundedIcon /></Box>
                  <Box>
                    <Typography sx={{ fontSize: '1.2rem', fontWeight: 900, color: NAVY, lineHeight: 1 }}>{totalEq}</Typography>
                    <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: '#64748B' }}>Total Equipment</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ bgcolor: '#FFF', p: 2, borderRadius: 3, border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ color: '#10B981' }}><CheckCircleOutlineRoundedIcon /></Box>
                  <Box>
                    <Typography sx={{ fontSize: '1.2rem', fontWeight: 900, color: NAVY, lineHeight: 1 }}>{availEq}</Typography>
                    <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: '#64748B' }}>Available</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ bgcolor: '#FFF', p: 2, borderRadius: 3, border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ color: '#F59E0B' }}><AccessTimeRoundedIcon /></Box>
                  <Box>
                    <Typography sx={{ fontSize: '1.2rem', fontWeight: 900, color: NAVY, lineHeight: 1 }}>{inUseEq}</Typography>
                    <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: '#64748B' }}>In Use</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ bgcolor: '#FFF', p: 2, borderRadius: 3, border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ color: '#EF4444' }}><BuildRoundedIcon /></Box>
                  <Box>
                    <Typography sx={{ fontSize: '1.2rem', fontWeight: 900, color: NAVY, lineHeight: 1 }}>{maintEq}</Typography>
                    <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: '#64748B' }}>Under Maintenance</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>

            {/* Categories Donut Chart */}
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: NAVY, mb: 1.5, letterSpacing: '0.05em' }}>EQUIPMENT CATEGORIES</Typography>
            <Box sx={{ bgcolor: '#FFF', p: 3, borderRadius: 3, border: '1px solid #E2E8F0', mb: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
              {/* SVG Donut */}
              <Box sx={{ width: 100, height: 100, position: 'relative' }}>
                <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                  <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#E2E8F0" strokeWidth="4" />
                  {chartData.map((d, i) => (
                    <circle
                      key={i}
                      cx="18" cy="18" r="15.91549430918954"
                      fill="transparent" stroke={d.hex} strokeWidth="4"
                      strokeDasharray={d.strokeDasharray}
                      strokeDashoffset={d.strokeDashoffset}
                    />
                  ))}
                </svg>
                <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography sx={{ fontSize: '1.1rem', fontWeight: 900, color: NAVY }}>{totalEq}</Typography>
                </Box>
              </Box>

              {/* Chart Legend */}
              <Box sx={{ flexGrow: 1 }}>
                {chartData.map((d, i) => (
                  <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: d.hex }} />
                      <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: NAVY }}>{d.name.length > 12 ? d.name.substring(0, 12) + '..' : d.name}</Typography>
                    </Box>
                    <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748B' }}>{d.count} ({Math.round(d.percentage)}%)</Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Quick Actions */}
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: NAVY, mb: 1.5, letterSpacing: '0.05em' }}>QUICK ACTIONS</Typography>
            <Box sx={{ bgcolor: '#FFF', borderRadius: 3, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
              {[
                { icon: <AddRoundedIcon />, label: 'Add New Equipment' },
                { icon: <WarningAmberRoundedIcon />, label: 'Report Damaged Equipment' },
                { icon: <SyncRoundedIcon />, label: 'Equipment Request' },
                { icon: <BuildRoundedIcon />, label: 'View Maintenance Log' },
              ].map((a, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, borderBottom: i < 3 ? '1px solid #E2E8F0' : 'none', cursor: 'pointer', '&:hover': { bgcolor: '#F8FAFC' } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ color: '#64748B', display: 'flex' }}>{React.cloneElement(a.icon, { sx: { fontSize: 18 } })}</Box>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: NAVY }}>{a.label}</Typography>
                  </Box>
                  <KeyboardArrowRightRoundedIcon sx={{ color: '#94A3B8', fontSize: 18 }} />
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* ── BOTTOM TRUST BADGES ── */}
      <Box sx={{ bgcolor: LIGHT_BLUE, py: 2, borderTop: '1px solid #BFDBFE', mt: 'auto' }}>
        <Container maxWidth="xl">
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-around" spacing={2} divider={<Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' }, borderColor: '#BFDBFE' }} />}>
            {TRUST_BADGES.map((b, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, justifyContent: 'center' }}>
                <Box sx={{ color: BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {React.cloneElement(b.icon, { sx: { fontSize: 32 } })}
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, color: NAVY, lineHeight: 1.1 }}>{b.label}</Typography>
                  <Typography sx={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 500 }}>{b.sub}</Typography>
                </Box>
              </Box>
            ))}
          </Stack>
        </Container>
      </Box>

    </Box>
  );
}
