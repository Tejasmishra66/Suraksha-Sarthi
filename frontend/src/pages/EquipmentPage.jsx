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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  InputAdornment,
  IconButton,
  Divider,
  LinearProgress,
  TablePagination,
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
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import SortRoundedIcon from '@mui/icons-material/SortRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MapRoundedIcon from '@mui/icons-material/MapRounded';
import InventoryRoundedIcon from '@mui/icons-material/InventoryRounded';

const quickActions = [
  { title: 'Scan QR Code', subtitle: 'Issue or return equipment', icon: <QrCodeScannerRoundedIcon />, color: 'success' },
  { title: 'Dispatch', subtitle: 'Send equipment to another unit', icon: <LocalShippingRoundedIcon />, color: 'info' },
  { title: 'Confirm Receipt', subtitle: 'Confirm received equipment', icon: <AssignmentTurnedInRoundedIcon />, color: 'primary' },
  { title: 'Maintenance', subtitle: 'Mark equipment under maintenance', icon: <BuildCircleRoundedIcon />, color: 'warning' },
];

const equipmentRows = [
  { id: 'RS-047', name: 'Rope Set 100m', category: 'Rescue Gear', location: 'Kullu Store', center: 'Kullu SDRF Center', status: 'In Use', quantity: 2, maxQuantity: 5, updated: '19 May 2024, 10:30 AM', issuedTo: 'Kullu Team', inUseCount: 3, maintenance: 0, available: 2 },
  { id: 'GS-012', name: 'Generator Set 5kVA', category: 'Power Equipment', location: 'Mandi Store', center: 'Mandi SDRF Center', status: 'Available', quantity: 5, maxQuantity: 5, updated: '19 May 2024, 09:45 AM', issuedTo: 'None', inUseCount: 0, maintenance: 0, available: 5 },
  { id: 'MK-025', name: 'Medical Kit - Advanced', category: 'Medical Equipment', location: 'Spiti Unit', center: 'Spiti SDRF Center', status: 'In Transit', quantity: 3, maxQuantity: 4, updated: '18 May 2024, 04:15 PM', issuedTo: 'Spiti Team', inUseCount: 1, maintenance: 0, available: 3 },
  { id: 'OC-018', name: 'Oxygen Cylinder', category: 'Medical Equipment', location: 'Shimla Store', center: 'Shimla SDRF Center', status: 'Maintenance', quantity: 1, maxQuantity: 8, updated: '18 May 2024, 11:20 AM', issuedTo: 'None', inUseCount: 0, maintenance: 2, available: 6 },
  { id: 'STR-009', name: 'Stretcher (Foldable)', category: 'Rescue Gear', location: 'Una Store', center: 'Una SDRF Center', status: 'Available', quantity: 4, maxQuantity: 6, updated: '17 May 2024, 03:10 PM', issuedTo: 'None', inUseCount: 0, maintenance: 0, available: 6 },
  { id: 'PU-031', name: 'Pump Unit (Submersible)', category: 'Power Equipment', location: 'Solan Store', center: 'Solan SDRF Center', status: 'Available', quantity: 2, maxQuantity: 3, updated: '19 May 2024, 08:20 AM', issuedTo: 'None', inUseCount: 0, maintenance: 1, available: 2 },
  { id: 'RD-056', name: 'Radio (Walkie-Talkie)', category: 'Communication', location: 'Kullu Store', center: 'Kullu SDRF Center', status: 'In Use', quantity: 8, maxQuantity: 12, updated: '19 May 2024, 11:15 AM', issuedTo: 'Kullu Team', inUseCount: 4, maintenance: 0, available: 8 },
  { id: 'HA-044', name: 'Hand Pump', category: 'Power Equipment', location: 'Mandi Store', center: 'Mandi SDRF Center', status: 'Available', quantity: 3, maxQuantity: 4, updated: '19 May 2024, 07:50 AM', issuedTo: 'None', inUseCount: 0, maintenance: 1, available: 3 },
];

const sdfrCenters = [
  { id: 1, name: 'Kullu SDRF Center', location: 'Kullu District', contact: '01902-XXXXX' },
  { id: 2, name: 'Mandi SDRF Center', location: 'Mandi District', contact: '01905-XXXXX' },
  { id: 3, name: 'Spiti SDRF Center', location: 'Spiti Valley', contact: '01900-XXXXX' },
  { id: 4, name: 'Shimla SDRF Center', location: 'Shimla District', contact: '0177-XXXXX' },
  { id: 5, name: 'Una SDRF Center', location: 'Una District', contact: '01968-XXXXX' },
  { id: 6, name: 'Solan SDRF Center', location: 'Solan District', contact: '01792-XXXXX' },
];

const recentActivity = [
  { title: 'Rope Set (RS-047) issued to Kullu Team', time: '10:30 AM', user: 'Manish Thakur' },
  { title: 'GenSet (GS-012) returned by Mandi Team', time: '09:45 AM', user: 'Pooja Verma' },
  { title: 'Medical Kit (MK-025) dispatched to Spiti Unit', time: 'Yesterday', user: 'Vikram Negi' },
  { title: 'Oxygen Cylinder (OC-018) under maintenance at Shimla Store', time: 'Yesterday', user: 'Tara Sharma' },
];

export default function EquipmentPage() {
  // Tab State
  const [activeTab, setActiveTab] = React.useState(0);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filterCategory, setFilterCategory] = React.useState('all');
  const [filterStatus, setFilterStatus] = React.useState('all');
  const [sortBy, setSortBy] = React.useState('name');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // Dialog States
  const [qrScannerOpen, setQrScannerOpen] = React.useState(false);
  const [scannedQRCode, setScannedQRCode] = React.useState('');
  const [issueReturnOpen, setIssueReturnOpen] = React.useState(false);
  const [transferOpen, setTransferOpen] = React.useState(false);
  const [equipmentDetailsOpen, setEquipmentDetailsOpen] = React.useState(false);
  const [selectedEquipment, setSelectedEquipment] = React.useState(null);
  const [maintenanceOpen, setMaintenanceOpen] = React.useState(false);

  // Form States
  const [issueForm, setIssueForm] = React.useState({ equipmentId: '', quantity: 1, issuedTo: '', date: new Date().toISOString().split('T')[0] });
  const [transferForm, setTransferForm] = React.useState({ equipmentId: '', fromCenter: '', toCenter: '', quantity: 1, date: new Date().toISOString().split('T')[0] });
  const [maintenanceForm, setMaintenanceForm] = React.useState({ equipmentId: '', issueDescription: '', estimatedDays: '', date: new Date().toISOString().split('T')[0] });
  const [selectedCenter, setSelectedCenter] = React.useState(1);

  // Get filtered and sorted equipment
  const getFilteredEquipment = () => {
    let filtered = equipmentRows.filter(eq => {
      const matchesSearch = eq.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          eq.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'all' || eq.category === filterCategory;
      const matchesStatus = filterStatus === 'all' || eq.status === filterStatus;
      const matchesCenter = selectedCenter === 0 || eq.center.includes(sdfrCenters[selectedCenter - 1]?.name);
      
      return matchesSearch && matchesCategory && matchesStatus && matchesCenter;
    });

    // Sort
    filtered.sort((a, b) => {
      switch(sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'status':
          return a.status.localeCompare(b.status);
        case 'quantity':
          return b.available - a.available;
        case 'recent':
          return new Date(b.updated) - new Date(a.updated);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredEquipment = getFilteredEquipment();

  // Get unique categories
  const categories = [...new Set(equipmentRows.map(eq => eq.category))];
  const statuses = ['Available', 'In Use', 'In Transit', 'Maintenance'];

  // Handle QR scan simulation
  const handleSimulateQRScan = () => {
    const randomEquipment = equipmentRows[Math.floor(Math.random() * equipmentRows.length)];
    setScannedQRCode(randomEquipment.id);
    setSelectedEquipment(randomEquipment);
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedEquipment = filteredEquipment.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Calculate statistics
  const totalEquipment = equipmentRows.reduce((sum, eq) => sum + eq.available + eq.inUseCount + eq.maintenance, 0);
  const inUse = equipmentRows.reduce((sum, eq) => sum + eq.inUseCount, 0);
  const available = equipmentRows.reduce((sum, eq) => sum + eq.available, 0);
  const maintenance = equipmentRows.reduce((sum, eq) => sum + eq.maintenance, 0);
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <TopNavBar />
      
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        {/* Header Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2.5, borderRadius: 2, bgcolor: '#f0fdf4', border: '1px solid #86efac' }}>
              <Stack spacing={1}>
                <Typography variant="body2" color="text.secondary">Total Equipment</Typography>
                <Typography variant="h4" fontWeight={900}>{totalEquipment}</Typography>
                <Typography variant="caption" color="text.secondary">Across all centers</Typography>
              </Stack>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2.5, borderRadius: 2, bgcolor: '#dbeafe', border: '1px solid #7dd3fc' }}>
              <Stack spacing={1}>
                <Typography variant="body2" color="text.secondary">In Use</Typography>
                <Typography variant="h4" fontWeight={900}>{inUse}</Typography>
                <Typography variant="caption" color="text.secondary">Deployed in field</Typography>
              </Stack>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2.5, borderRadius: 2, bgcolor: '#fef3c7', border: '1px solid #fcd34d' }}>
              <Stack spacing={1}>
                <Typography variant="body2" color="text.secondary">Under Maintenance</Typography>
                <Typography variant="h4" fontWeight={900}>{maintenance}</Typography>
                <Typography variant="caption" color="text.secondary">Getting serviced</Typography>
              </Stack>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2.5, borderRadius: 2, bgcolor: '#dcfce7', border: '1px solid #86efac' }}>
              <Stack spacing={1}>
                <Typography variant="body2" color="text.secondary">Available</Typography>
                <Typography variant="h4" fontWeight={900}>{available}</Typography>
                <Typography variant="caption" color="text.secondary">Ready to deploy</Typography>
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        {/* Tab Navigation */}
        <Paper sx={{ p: 1.5, mb: 3, borderRadius: 4, boxShadow: '0 18px 30px rgba(15,23,42,0.08)' }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={1}>
            {['Overview', 'All Equipment', 'Issue/Return', 'Transfer', 'Maintenance', 'Live Location'].map((label, index) => (
              <Button 
                key={label}
                variant={activeTab === index ? 'contained' : 'text'} 
                color={activeTab === index ? 'success' : 'inherit'}
                onClick={() => setActiveTab(index)}
                sx={{ textTransform: 'none', flex: { md: 1 } }}
              >
                {label}
              </Button>
            ))}
          </Stack>
        </Paper>

        {/* TAB 0: OVERVIEW */}
        {activeTab === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 18px 30px rgba(15,23,42,0.08)' }}>
                <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>Quick Actions</Typography>
                <Grid container spacing={2}>
                  {[
                    { title: 'Scan QR Code', subtitle: 'Issue or return equipment', icon: <QrCodeScannerRoundedIcon />, color: 'success', action: () => setQrScannerOpen(true) },
                    { title: 'Issue Equipment', subtitle: 'Dispatch to teams', icon: <LocalShippingRoundedIcon />, color: 'info', action: () => setIssueReturnOpen(true) },
                    { title: 'Transfer', subtitle: 'Move between centers', icon: <AssignmentTurnedInRoundedIcon />, color: 'primary', action: () => setTransferOpen(true) },
                    { title: 'Maintenance', subtitle: 'Mark for servicing', icon: <BuildCircleRoundedIcon />, color: 'warning', action: () => setMaintenanceOpen(true) },
                  ].map((action) => (
                    <Grid item xs={12} sm={6} key={action.title}>
                      <Paper sx={{ p: 2, borderRadius: 3, display: 'flex', gap: 2, alignItems: 'center', cursor: 'pointer', transition: 'all 0.3s', '&:hover': { boxShadow: '0 8px 16px rgba(0,0,0,0.1)', transform: 'translateY(-2px)' } }} onClick={action.action}>
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
                <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>Recent Equipment Activity</Typography>
                <Stack spacing={2}>
                  {[
                    { title: 'Rope Set (RS-047) issued to Kullu Team', time: '10:30 AM', user: 'Manish Thakur', status: 'Issued' },
                    { title: 'GenSet (GS-012) returned by Mandi Team', time: '09:45 AM', user: 'Pooja Verma', status: 'Returned' },
                    { title: 'Medical Kit (MK-025) dispatched to Spiti Unit', time: 'Yesterday', user: 'Vikram Negi', status: 'Transferred' },
                    { title: 'Oxygen Cylinder (OC-018) under maintenance', time: 'Yesterday', user: 'Tara Sharma', status: 'Maintenance' },
                  ].map((item) => (
                    <Paper key={item.title} sx={{ p: 2, borderRadius: 2, bgcolor: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography fontWeight={700}>{item.title}</Typography>
                        <Typography variant="caption" color="text.secondary">{item.user} · {item.time}</Typography>
                      </Box>
                      <Chip label={item.status} size="small" color={item.status === 'Issued' ? 'primary' : item.status === 'Transferred' ? 'info' : item.status === 'Maintenance' ? 'warning' : 'success'} />
                    </Paper>
                  ))}
                </Stack>
              </Paper>
            </Grid>

            <Grid item xs={12} lg={4}>
              <Stack spacing={3}>
                <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 18px 30px rgba(15,23,42,0.08)' }}>
                  <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>Equipment by Category</Typography>
                  <Stack spacing={2}>
                    {[
                      { label: 'Rescue Gear', value: 82, color: '#84cc16' },
                      { label: 'Medical Equipment', value: 56, color: '#2563eb' },
                      { label: 'Power Equipment', value: 38, color: '#f97316' },
                      { label: 'Communication', value: 28, color: '#8b5cf6' },
                      { label: 'Others', value: 34, color: '#0f766e' },
                    ].map((item) => (
                      <Box key={item.label}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                          <Typography variant="body2">{item.label}</Typography>
                          <Typography variant="body2" fontWeight={700}>{item.value}</Typography>
                        </Stack>
                        <LinearProgress variant="determinate" value={(item.value / 82) * 100} sx={{ borderRadius: 1, backgroundColor: 'rgba(0,0,0,0.1)', '& .MuiLinearProgress-bar': { backgroundColor: item.color } }} />
                      </Box>
                    ))}
                  </Stack>
                </Paper>

                <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 18px 30px rgba(15,23,42,0.08)' }}>
                  <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>Alerts & Notifications</Typography>
                  <Stack spacing={1}>
                    <Box sx={{ p: 1.5, bgcolor: '#fee2e2', borderRadius: 1, border: '1px solid #fecaca' }}>
                      <Typography variant="body2" fontWeight={700}>⚠️ 3 items under maintenance</Typography>
                    </Box>
                    <Box sx={{ p: 1.5, bgcolor: '#fef3c7', borderRadius: 1, border: '1px solid #fcd34d' }}>
                      <Typography variant="body2" fontWeight={700}>⚡ 5 items low in stock</Typography>
                    </Box>
                    <Box sx={{ p: 1.5, bgcolor: '#dbeafe', borderRadius: 1, border: '1px solid #7dd3fc' }}>
                      <Typography variant="body2" fontWeight={700}>ℹ️ 2 items need calibration</Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Stack>
            </Grid>
          </Grid>
        )}

        {/* TAB 1: ALL EQUIPMENT */}
        {activeTab === 1 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper sx={{ p: 2.5, borderRadius: 4, boxShadow: '0 18px 30px rgba(15,23,42,0.08)' }}>
                <Stack spacing={2}>
                  <Grid container spacing={2} alignItems="flex-end">
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        fullWidth
                        placeholder="Search equipment..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchRoundedIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                      <TextField
                        select
                        fullWidth
                        label="Category"
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                      >
                        <MenuItem value="all">All Categories</MenuItem>
                        {categories.map(cat => (
                          <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                      <TextField
                        select
                        fullWidth
                        label="Status"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                      >
                        <MenuItem value="all">All Status</MenuItem>
                        {statuses.map(status => (
                          <MenuItem key={status} value={status}>{status}</MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                      <TextField
                        select
                        fullWidth
                        label="Sort By"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                      >
                        <MenuItem value="name">Equipment Name</MenuItem>
                        <MenuItem value="status">Status</MenuItem>
                        <MenuItem value="quantity">Available Qty</MenuItem>
                        <MenuItem value="recent">Most Recent</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                      <TextField
                        select
                        fullWidth
                        label="Center"
                        value={selectedCenter}
                        onChange={(e) => setSelectedCenter(e.target.value)}
                      >
                        <MenuItem value={0}>All Centers</MenuItem>
                        {sdfrCenters.map(center => (
                          <MenuItem key={center.id} value={center.id}>{center.name.split(' SDRF')[0]}</MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>
                  <Typography variant="caption" color="text.secondary">
                    Found {filteredEquipment.length} equipment
                  </Typography>
                </Stack>
              </Paper>

              <Paper sx={{ mt: 3, borderRadius: 4, boxShadow: '0 18px 30px rgba(15,23,42,0.08)', overflow: 'auto' }}>
                <TableContainer>
                  <Table>
                    <TableHead sx={{ bgcolor: '#f8fafc' }}>
                      <TableRow>
                        <TableCell><strong>Equipment ID</strong></TableCell>
                        <TableCell><strong>Name</strong></TableCell>
                        <TableCell><strong>Category</strong></TableCell>
                        <TableCell><strong>Location</strong></TableCell>
                        <TableCell><strong>Available</strong></TableCell>
                        <TableCell><strong>Status</strong></TableCell>
                        <TableCell><strong>Action</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedEquipment.map((row) => (
                        <TableRow key={row.id} hover>
                          <TableCell><strong>{row.id}</strong></TableCell>
                          <TableCell>{row.name}</TableCell>
                          <TableCell>{row.category}</TableCell>
                          <TableCell>{row.location}</TableCell>
                          <TableCell>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Typography>{row.available}/{row.maxQuantity}</Typography>
                              <LinearProgress 
                                variant="determinate" 
                                value={(row.available / row.maxQuantity) * 100} 
                                sx={{ width: 50, borderRadius: 1 }}
                              />
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={row.status}
                              size="small"
                              color={row.status === 'Available' ? 'success' : row.status === 'In Use' ? 'primary' : row.status === 'Maintenance' ? 'warning' : 'info'}
                            />
                          </TableCell>
                          <TableCell>
                            <Button 
                              size="small" 
                              variant="outlined"
                              onClick={() => {
                                setSelectedEquipment(row);
                                setEquipmentDetailsOpen(true);
                              }}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={filteredEquipment.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* TAB 2: ISSUE/RETURN */}
        {activeTab === 2 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 18px 30px rgba(15,23,42,0.08)' }}>
                <Typography variant="h6" fontWeight={800} sx={{ mb: 3 }}>Issue Equipment</Typography>
                <Stack spacing={2}>
                  <TextField
                    select
                    label="Select Equipment *"
                    value={issueForm.equipmentId}
                    onChange={(e) => setIssueForm({...issueForm, equipmentId: e.target.value})}
                  >
                    {equipmentRows.filter(eq => eq.status === 'Available').map(eq => (
                      <MenuItem key={eq.id} value={eq.id}>{eq.name} ({eq.id})</MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    type="number"
                    label="Quantity *"
                    value={issueForm.quantity}
                    onChange={(e) => setIssueForm({...issueForm, quantity: parseInt(e.target.value)})}
                    inputProps={{ min: 1 }}
                  />
                  <TextField
                    label="Issue To (Team/Person) *"
                    placeholder="Enter team name"
                    value={issueForm.issuedTo}
                    onChange={(e) => setIssueForm({...issueForm, issuedTo: e.target.value})}
                  />
                  <TextField
                    type="date"
                    label="Issue Date"
                    value={issueForm.date}
                    onChange={(e) => setIssueForm({...issueForm, date: e.target.value})}
                    InputLabelProps={{ shrink: true }}
                  />
                  <Button variant="contained" color="primary" onClick={() => {
                    alert(`✓ Equipment ${issueForm.equipmentId} issued to ${issueForm.issuedTo}`);
                    setIssueForm({ equipmentId: '', quantity: 1, issuedTo: '', date: new Date().toISOString().split('T')[0] });
                  }}>
                    Issue Equipment
                  </Button>
                </Stack>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 18px 30px rgba(15,23,42,0.08)' }}>
                <Typography variant="h6" fontWeight={800} sx={{ mb: 3 }}>Return Equipment</Typography>
                <Stack spacing={2}>
                  <TextField
                    select
                    label="Select Equipment to Return *"
                    value={issueForm.equipmentId}
                    onChange={(e) => setIssueForm({...issueForm, equipmentId: e.target.value})}
                  >
                    {equipmentRows.filter(eq => eq.status === 'In Use').map(eq => (
                      <MenuItem key={eq.id} value={eq.id}>{eq.name} ({eq.id})</MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    type="number"
                    label="Quantity Returning *"
                    value={issueForm.quantity}
                    onChange={(e) => setIssueForm({...issueForm, quantity: parseInt(e.target.value)})}
                    inputProps={{ min: 1 }}
                  />
                  <TextField
                    label="Returned By (Team/Person) *"
                    placeholder="Enter name"
                    value={issueForm.issuedTo}
                    onChange={(e) => setIssueForm({...issueForm, issuedTo: e.target.value})}
                  />
                  <TextField
                    type="date"
                    label="Return Date"
                    value={issueForm.date}
                    onChange={(e) => setIssueForm({...issueForm, date: e.target.value})}
                    InputLabelProps={{ shrink: true }}
                  />
                  <Button variant="contained" color="success" onClick={() => {
                    alert(`✓ Equipment ${issueForm.equipmentId} returned by ${issueForm.issuedTo}`);
                    setIssueForm({ equipmentId: '', quantity: 1, issuedTo: '', date: new Date().toISOString().split('T')[0] });
                  }}>
                    Accept Return
                  </Button>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* TAB 3: TRANSFER */}
        {activeTab === 3 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 18px 30px rgba(15,23,42,0.08)' }}>
                <Typography variant="h6" fontWeight={800} sx={{ mb: 3 }}>Transfer Equipment Between Centers</Typography>
                <Stack spacing={2}>
                  <TextField
                    select
                    label="Equipment to Transfer *"
                    value={transferForm.equipmentId}
                    onChange={(e) => setTransferForm({...transferForm, equipmentId: e.target.value})}
                  >
                    {equipmentRows.map(eq => (
                      <MenuItem key={eq.id} value={eq.id}>{eq.name} ({eq.id})</MenuItem>
                    ))}
                  </TextField>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        select
                        fullWidth
                        label="From Center *"
                        value={transferForm.fromCenter}
                        onChange={(e) => setTransferForm({...transferForm, fromCenter: e.target.value})}
                      >
                        {sdfrCenters.map(center => (
                          <MenuItem key={center.id} value={center.name}>{center.name}</MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        select
                        fullWidth
                        label="To Center *"
                        value={transferForm.toCenter}
                        onChange={(e) => setTransferForm({...transferForm, toCenter: e.target.value})}
                      >
                        {sdfrCenters.map(center => (
                          <MenuItem key={center.id} value={center.name}>{center.name}</MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>
                  <TextField
                    type="number"
                    label="Quantity to Transfer *"
                    value={transferForm.quantity}
                    onChange={(e) => setTransferForm({...transferForm, quantity: parseInt(e.target.value)})}
                    inputProps={{ min: 1 }}
                  />
                  <TextField
                    type="date"
                    label="Transfer Date"
                    value={transferForm.date}
                    onChange={(e) => setTransferForm({...transferForm, date: e.target.value})}
                    InputLabelProps={{ shrink: true }}
                  />
                  <Button variant="contained" color="info" onClick={() => {
                    alert(`✓ Equipment transferred from ${transferForm.fromCenter} to ${transferForm.toCenter}`);
                    setTransferForm({ equipmentId: '', fromCenter: '', toCenter: '', quantity: 1, date: new Date().toISOString().split('T')[0] });
                  }}>
                    Confirm Transfer
                  </Button>
                </Stack>
              </Paper>

              <Paper sx={{ mt: 3, p: 3, borderRadius: 4, boxShadow: '0 18px 30px rgba(15,23,42,0.08)' }}>
                <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>Transfer History</Typography>
                <Stack spacing={2}>
                  {[
                    { from: 'Mandi SDRF Center', to: 'Kullu SDRF Center', equipment: 'Generator Set (GS-012)', qty: 2, date: '19 May 2024' },
                    { from: 'Shimla SDRF Center', to: 'Spiti SDRF Center', equipment: 'Medical Kit (MK-025)', qty: 1, date: '18 May 2024' },
                    { from: 'Una SDRF Center', to: 'Mandi SDRF Center', equipment: 'Stretcher (STR-009)', qty: 3, date: '17 May 2024' },
                  ].map((transfer, idx) => (
                    <Paper key={idx} sx={{ p: 2, bgcolor: '#f8fafc', borderLeft: '4px solid #0b6b57' }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="caption" color="text.secondary">From</Typography>
                          <Typography fontWeight={700}>{transfer.from}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="caption" color="text.secondary">To</Typography>
                          <Typography fontWeight={700}>{transfer.to}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="caption" color="text.secondary">Equipment</Typography>
                          <Typography fontWeight={700}>{transfer.equipment} x{transfer.qty}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="caption" color="text.secondary">{transfer.date}</Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  ))}
                </Stack>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 18px 30px rgba(15,23,42,0.08)' }}>
                <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>SDRF Centers</Typography>
                <Stack spacing={2}>
                  {sdfrCenters.map(center => (
                    <Paper key={center.id} sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
                      <Stack direction="row" spacing={1} alignItems="flex-start">
                        <MapRoundedIcon sx={{ mt: 0.5, color: '#0b6b57' }} />
                        <Box>
                          <Typography fontWeight={700}>{center.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{center.location}</Typography>
                          <Typography variant="caption" color="text.secondary" display="block">{center.contact}</Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* TAB 4: MAINTENANCE */}
        {activeTab === 4 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 18px 30px rgba(15,23,42,0.08)' }}>
                <Typography variant="h6" fontWeight={800} sx={{ mb: 3 }}>Send Equipment for Maintenance</Typography>
                <Stack spacing={2}>
                  <TextField
                    select
                    label="Equipment to Maintain *"
                    value={maintenanceForm.equipmentId}
                    onChange={(e) => setMaintenanceForm({...maintenanceForm, equipmentId: e.target.value})}
                  >
                    {equipmentRows.map(eq => (
                      <MenuItem key={eq.id} value={eq.id}>{eq.name} ({eq.id})</MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    label="Issue Description *"
                    placeholder="Describe the maintenance issue..."
                    multiline
                    minRows={3}
                    value={maintenanceForm.issueDescription}
                    onChange={(e) => setMaintenanceForm({...maintenanceForm, issueDescription: e.target.value})}
                  />
                  <TextField
                    type="number"
                    label="Estimated Days *"
                    value={maintenanceForm.estimatedDays}
                    onChange={(e) => setMaintenanceForm({...maintenanceForm, estimatedDays: e.target.value})}
                    inputProps={{ min: 1 }}
                  />
                  <TextField
                    type="date"
                    label="Maintenance Start Date"
                    value={maintenanceForm.date}
                    onChange={(e) => setMaintenanceForm({...maintenanceForm, date: e.target.value})}
                    InputLabelProps={{ shrink: true }}
                  />
                  <Button variant="contained" color="warning" onClick={() => {
                    alert(`✓ Equipment ${maintenanceForm.equipmentId} sent for maintenance`);
                    setMaintenanceForm({ equipmentId: '', issueDescription: '', estimatedDays: '', date: new Date().toISOString().split('T')[0] });
                  }}>
                    Send for Maintenance
                  </Button>
                </Stack>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 18px 30px rgba(15,23,42,0.08)' }}>
                <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>Maintenance Queue</Typography>
                <Stack spacing={2}>
                  {[
                    { equipment: 'Oxygen Cylinder (OC-018)', issue: 'Pressure gauge malfunction', startDate: '18 May 2024', estimatedEnd: '23 May 2024', status: 'In Progress' },
                    { equipment: 'Pump Unit (PU-031)', issue: 'Motor not starting', startDate: '17 May 2024', estimatedEnd: '22 May 2024', status: 'In Progress' },
                    { equipment: 'Hand Pump (HA-044)', issue: 'Valve leakage', startDate: '15 May 2024', estimatedEnd: '20 May 2024', status: 'Pending Approval' },
                  ].map((item, idx) => (
                    <Paper key={idx} sx={{ p: 2, bgcolor: '#fef3c7', border: '1px solid #fcd34d' }}>
                      <Typography fontWeight={700}>{item.equipment}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>{item.issue}</Typography>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="caption" color="text.secondary">{item.startDate} → {item.estimatedEnd}</Typography>
                        <Chip label={item.status} size="small" color="warning" />
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* TAB 5: LIVE LOCATION */}
        {activeTab === 5 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 18px 30px rgba(15,23,42,0.08)' }}>
                <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>Equipment Location Tracking</Typography>
                <Box sx={{ bgcolor: '#e8f5e9', border: '2px dashed #4caf50', borderRadius: 2, p: 4, textAlign: 'center' }}>
                  <MapRoundedIcon sx={{ fontSize: 48, color: '#0b6b57', mb: 2 }} />
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>Live Map Integration</Typography>
                  <Typography color="text.secondary" sx={{ mb: 2 }}>Real-time GPS tracking of equipment locations across SDRF centers</Typography>
                  <Button variant="contained" color="success">Open Live Map</Button>
                </Box>

                <Grid container spacing={2} sx={{ mt: 2 }}>
                  {sdfrCenters.map(center => (
                    <Grid item xs={12} sm={6} md={4} key={center.id}>
                      <Paper sx={{ p: 2.5, borderRadius: 2, border: '1px solid #e2e8f0' }}>
                        <Stack spacing={1}>
                          <Typography fontWeight={700}>{center.name}</Typography>
                          <Typography variant="body2" color="text.secondary">{center.location}</Typography>
                          <Divider />
                          <Typography variant="caption" color="text.secondary">
                            📍 Equipment here: {equipmentRows.filter(eq => eq.center === center.name).length}
                          </Typography>
                        </Stack>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Container>

      {/* QR Scanner Dialog */}
      <Dialog open={qrScannerOpen} onClose={() => setQrScannerOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>QR Code Scanner</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, textAlign: 'center' }}>
            <QrCodeScannerRoundedIcon sx={{ fontSize: 80, color: '#0b6b57', mb: 2 }} />
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Scan the QR code on equipment or simulate scan</Typography>
            {scannedQRCode && selectedEquipment && (
              <Paper sx={{ p: 2, bgcolor: '#f0fdf4', mt: 2 }}>
                <Typography fontWeight={700} color="success.main">✓ Scanned Successfully!</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>{selectedEquipment.id}</Typography>
                <Typography variant="body2">{selectedEquipment.name}</Typography>
              </Paper>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQrScannerOpen(false)}>Close</Button>
          <Button variant="contained" color="success" onClick={handleSimulateQRScan}>Simulate Scan</Button>
        </DialogActions>
      </Dialog>

      {/* Equipment Details Dialog */}
      <Dialog open={equipmentDetailsOpen} onClose={() => setEquipmentDetailsOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Equipment Details</DialogTitle>
        <DialogContent>
          {selectedEquipment && (
            <Stack spacing={2} sx={{ pt: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">Equipment ID</Typography>
                <Typography fontWeight={700}>{selectedEquipment.id}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Name</Typography>
                <Typography fontWeight={700}>{selectedEquipment.name}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Category</Typography>
                <Typography fontWeight={700}>{selectedEquipment.category}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Location</Typography>
                <Typography fontWeight={700}>{selectedEquipment.location}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Center</Typography>
                <Typography fontWeight={700}>{selectedEquipment.center}</Typography>
              </Box>
              <Divider />
              <Box>
                <Typography variant="caption" color="text.secondary">Stock Status</Typography>
                <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                  <Box>
                    <Typography variant="caption">Available</Typography>
                    <Typography fontWeight={700}>{selectedEquipment.available}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption">In Use</Typography>
                    <Typography fontWeight={700}>{selectedEquipment.inUseCount}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption">Maintenance</Typography>
                    <Typography fontWeight={700}>{selectedEquipment.maintenance}</Typography>
                  </Box>
                </Stack>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Status</Typography>
                <Chip label={selectedEquipment.status} color={selectedEquipment.status === 'Available' ? 'success' : selectedEquipment.status === 'In Use' ? 'primary' : 'warning'} sx={{ mt: 1 }} />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Last Updated</Typography>
                <Typography fontWeight={700}>{selectedEquipment.updated}</Typography>
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEquipmentDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
