import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  Box, Container, Grid, Typography, IconButton, Chip,
  CircularProgress, Stack, Divider, TextField, MenuItem,
  Select, FormControl, InputLabel, Button, Checkbox, FormControlLabel, FormGroup
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';

import WarningAmberRoundedIcon  from '@mui/icons-material/WarningAmberRounded';
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import GroupsRoundedIcon        from '@mui/icons-material/GroupsRounded';
import ConnectingAirportsRoundedIcon from '@mui/icons-material/ConnectingAirportsRounded';
import PhoneInTalkRoundedIcon   from '@mui/icons-material/PhoneInTalkRounded';
import LocationOnRoundedIcon    from '@mui/icons-material/LocationOnRounded';
import VerifiedUserRoundedIcon  from '@mui/icons-material/VerifiedUserRounded';
import HandshakeRoundedIcon     from '@mui/icons-material/HandshakeRounded';
import SyncRoundedIcon          from '@mui/icons-material/SyncRounded';
import LocalHospitalRoundedIcon from '@mui/icons-material/LocalHospitalRounded';
import ReportProblemRoundedIcon from '@mui/icons-material/ReportProblemRounded';
import ShieldRoundedIcon        from '@mui/icons-material/ShieldRounded';

import HpsdmaFeed from '../components/HpsdmaFeed';

const API_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4002'}/hpsdma/incidents`;
const HIMACHAL_CENTER = [31.5, 77.2];
const NAVY   = '#0F172A';
const BLUE   = '#1D4ED8';
const RED    = '#DC2626';

// Map specific styling overrides for controls
const mapStyles = `
  .leaflet-control-zoom { margin: 16px !important; border: 1px solid #E2E8F0 !important; border-radius: 8px !important; overflow: hidden; background: #fff !important; box-shadow: 0 4px 6px rgba(0,0,0,0.05) !important; }
  .leaflet-control-zoom a { color: ${NAVY} !important; border-bottom: 1px solid #E2E8F0 !important; width: 34px !important; height: 34px !important; line-height: 34px !important; }
`;

/* ─── Type → colour/emoji mapping ─── */
const TYPE_META = {
  landslide:        { hex: '#EA580C', emoji: '🏔️' },
  'flash flood':    { hex: '#2563EB', emoji: '🌊' },
  flood:            { hex: '#2563EB', emoji: '🌊' },
  cloudburst:       { hex: '#8B5CF6', emoji: '⛈️' },
  'forest fire':    { hex: '#DC2626', emoji: '🔥' },
  fire:             { hex: '#DC2626', emoji: '🔥' },
  avalanche:        { hex: '#06B6D4', emoji: '❄️' },
  drowning:         { hex: '#0EA5E9', emoji: '💧' },
  earthquake:       { hex: '#EA580C', emoji: '🌍' },
  'road blockage':  { hex: '#FBBF24', emoji: '🚧' },
  'road accident':  { hex: '#F87171', emoji: '🚗' },
  lightning:        { hex: '#EAB308', emoji: '⚡' },
  'fallen tree':    { hex: '#22C55E', emoji: '🌳' },
  others:           { hex: '#94A3B8', emoji: '⚠️' },
};

function getTypeMeta(type = '') {
  const key = (type || '').toLowerCase().trim();
  for (const [k, v] of Object.entries(TYPE_META)) {
    if (key.includes(k)) return v;
  }
  return { hex: '#94A3B8', emoji: '⚠️' };
}

/* ─── Custom Leaflet Icon ─── */
function makeIcon(hex, emoji) {
  return L.divIcon({
    className: '',
    html: `<div style="width:28px;height:28px;border-radius:50%;background:${hex};border:2px solid #fff;box-shadow:0 2px 5px rgba(0,0,0,0.2);display:flex;align-items:center;justify-content:center;font-size:14px;">${emoji}</div>`,
    iconSize:   [28, 28],
    iconAnchor: [14, 14],
    popupAnchor:[0, -16],
  });
}

function formatDate(iso) {
  if (!iso) return '—';
  try { return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }
  catch { return iso; }
}

const MOCK_LAYERS = {
  sdrf: [],
  heli: [],
  camp: [],
  hospital: [],
  road: [],
};

const TRUST_BADGES = [
  { icon: <SyncRoundedIcon />, label: 'Real-time Updates', sub: 'Live data from control room' },
  { icon: <LocationOnRoundedIcon />, label: 'Wide Coverage', sub: 'All districts of Himachal Pradesh' },
  { icon: <ShieldRoundedIcon />, label: 'Quick Response', sub: 'Teams dispatched faster' },
  { icon: <VerifiedUserRoundedIcon />, label: 'Accurate Information', sub: 'Verified and reliable data' },
];

export default function IncidentMapPage() {
  const [rawData, setRawData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [filterDistrict, setFilterDistrict] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  
  // Layers
  const [layers, setLayers] = useState({
    incidents: true,
    sdrf: true,
    heli: false,
    camp: false,
    hospital: false,
    road: false,
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}?limit=500`);
      if (res.ok) setRawData(await res.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const allIncidents = rawData?.incidents || [];
  const summary = rawData?.summary || { total: 0, deaths: 0, injured: 0, missing: 0 };
  
  const activeInc = summary.deaths + summary.injured + summary.missing;
  const resolvedInc = Math.max(0, summary.total - activeInc);

  const distinctDistricts = [...new Set(allIncidents.map(i => i.district).filter(d => d && d !== '-'))].sort();
  const distinctTypes = [...new Set(allIncidents.map(i => i.type).filter(Boolean))].sort();

  const filteredIncidents = allIncidents.filter(inc => {
    if (filterDistrict && inc.district.toUpperCase() !== filterDistrict.toUpperCase()) return false;
    if (filterType && !inc.type.toLowerCase().includes(filterType.toLowerCase())) return false;
    return inc.lat && inc.lon;
  });

  const toggleLayer = (l) => setLayers(prev => ({ ...prev, [l]: !prev[l] }));

  return (
    <Box sx={{ bgcolor: '#F8FAFC', minHeight: 'calc(100vh - 66px)', display: 'flex', flexDirection: 'column' }}>
      <style>{mapStyles}</style>

      {/* ── TOP STATS BAR ── */}
      <Box sx={{ bgcolor: '#FFF', borderBottom: '1px solid #E2E8F0', py: 2 }}>
        <Container maxWidth="xl">
          <Grid container alignItems="center" spacing={2} justifyContent="space-between">
            {/* Title */}
            <Grid item xs={12} md={3}>
              <Typography sx={{ fontWeight: 900, color: NAVY, fontSize: '1.2rem', letterSpacing: '-0.02em', mb: 0.5 }}>
                LIVE SITUATION MAP
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
                Real-time overview of incidents and resources across Himachal Pradesh
              </Typography>
            </Grid>

            {/* Stats */}
            <Grid item xs={12} md={6}>
              <Stack direction="row" spacing={2} justifyContent="center" divider={<Divider orientation="vertical" flexItem sx={{ my: 1 }} />}>
                <Box sx={{ textAlign: 'center', minWidth: 80 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 0.5 }}>
                    <WarningAmberRoundedIcon sx={{ color: BLUE, fontSize: 24 }} />
                    <Typography sx={{ fontSize: '1.6rem', fontWeight: 900, color: NAVY, lineHeight: 1 }}>{summary.total || 0}</Typography>
                  </Box>
                  <Typography sx={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 700 }}>Total Incidents</Typography>
                </Box>
                <Box sx={{ textAlign: 'center', minWidth: 80 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 0.5 }}>
                    <LocalFireDepartmentRoundedIcon sx={{ color: RED, fontSize: 24 }} />
                    <Typography sx={{ fontSize: '1.6rem', fontWeight: 900, color: NAVY, lineHeight: 1 }}>{activeInc > 0 ? activeInc : 0}</Typography>
                  </Box>
                  <Typography sx={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 700 }}>Active Incidents</Typography>
                </Box>
                <Box sx={{ textAlign: 'center', minWidth: 80 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 0.5 }}>
                    <CheckCircleOutlineRoundedIcon sx={{ color: '#10B981', fontSize: 24 }} />
                    <Typography sx={{ fontSize: '1.6rem', fontWeight: 900, color: NAVY, lineHeight: 1 }}>{resolvedInc > 0 ? resolvedInc : 0}</Typography>
                  </Box>
                  <Typography sx={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 700 }}>Resolved Incidents</Typography>
                </Box>
              </Stack>
            </Grid>

            {/* SOS Button */}
            <Grid item xs={12} md={3} sx={{ textAlign: 'right' }}>
              <Button
                component={RouterLink} to="/emergency"
                variant="contained"
                style={{ backgroundColor: RED, color: '#FFF' }}
                sx={{ borderRadius: 3, p: 2, px: 4, width: '100%', maxWidth: 220, boxShadow: '0 10px 15px -3px rgba(220, 38, 38, 0.3)', '&:hover': { backgroundColor: '#B91C1C' } }}
              >
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 0.5 }}>
                    <PhoneInTalkRoundedIcon />
                    <Typography sx={{ fontSize: '1.4rem', fontWeight: 900, lineHeight: 1 }}>SOS</Typography>
                  </Box>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'none' }}>Need Immediate Help?</Typography>
                </Box>
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ── MAIN LAYOUT ── */}
      <Container maxWidth="xl" sx={{ flexGrow: 1, py: 3, display: 'flex', flexDirection: 'column' }}>
        <Grid container spacing={3} sx={{ flexGrow: 1 }}>
          
          {/* LEFT SIDEBAR */}
          <Grid item xs={12} lg={2.5}>
            {/* Filters */}
            <Box sx={{ bgcolor: '#FFF', borderRadius: 3, border: '1px solid #E2E8F0', overflow: 'hidden', mb: 3 }}>
              <Box sx={{ bgcolor: BLUE, color: '#FFF', px: 2, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', letterSpacing: '0.05em' }}>FILTERS</Typography>
                <Typography sx={{ fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer', opacity: 0.9 }} onClick={() => { setFilterDistrict(''); setFilterType(''); setFilterStatus(''); }}>Reset</Typography>
              </Box>
              <Box sx={{ p: 2 }}>
                <FormControl size="small" fullWidth sx={{ mb: 2 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 800, color: NAVY, mb: 0.5 }}>DISTRICT</Typography>
                  <Select value={filterDistrict} displayEmpty onChange={e => setFilterDistrict(e.target.value)} sx={{ fontSize: '0.8rem', fontWeight: 600, bgcolor: '#F8FAFC' }}>
                    <MenuItem value="" sx={{ fontWeight: 600 }}>All Districts</MenuItem>
                    {distinctDistricts.map(d => <MenuItem key={d} value={d} sx={{ fontSize: '0.8rem', fontWeight: 600 }}>{d}</MenuItem>)}
                  </Select>
                </FormControl>

                <FormControl size="small" fullWidth sx={{ mb: 2 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 800, color: NAVY, mb: 0.5 }}>DISASTER TYPE</Typography>
                  <Select value={filterType} displayEmpty onChange={e => setFilterType(e.target.value)} sx={{ fontSize: '0.8rem', fontWeight: 600, bgcolor: '#F8FAFC' }}>
                    <MenuItem value="" sx={{ fontWeight: 600 }}>All Disaster Types</MenuItem>
                    {distinctTypes.map(t => <MenuItem key={t} value={t} sx={{ fontSize: '0.8rem', fontWeight: 600 }}>{getTypeMeta(t).emoji} {t}</MenuItem>)}
                  </Select>
                </FormControl>

                <FormControl size="small" fullWidth sx={{ mb: 2 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 800, color: NAVY, mb: 0.5 }}>STATUS</Typography>
                  <Select value={filterStatus} displayEmpty onChange={e => setFilterStatus(e.target.value)} sx={{ fontSize: '0.8rem', fontWeight: 600, bgcolor: '#F8FAFC' }}>
                    <MenuItem value="" sx={{ fontWeight: 600 }}>All Status</MenuItem>
                    <MenuItem value="active" sx={{ fontWeight: 600 }}>Active</MenuItem>
                    <MenuItem value="resolved" sx={{ fontWeight: 600 }}>Resolved</MenuItem>
                  </Select>
                </FormControl>
                
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <FormControl size="small" fullWidth>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 800, color: NAVY, mb: 0.5 }}>DATE RANGE</Typography>
                    <TextField type="date" size="small" sx={{ '& .MuiInputBase-root': { fontSize: '0.75rem', fontWeight: 600, bgcolor: '#F8FAFC' } }} />
                  </FormControl>
                  <FormControl size="small" fullWidth>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 800, color: 'transparent', mb: 0.5 }}>TO</Typography>
                    <TextField type="date" size="small" sx={{ '& .MuiInputBase-root': { fontSize: '0.75rem', fontWeight: 600, bgcolor: '#F8FAFC' } }} />
                  </FormControl>
                </Box>

                <Button fullWidth variant="contained" style={{ backgroundColor: BLUE, color: '#FFF' }} sx={{ fontWeight: 800, py: 1, borderRadius: 2 }}>
                  Apply Filters
                </Button>
              </Box>
            </Box>

            {/* Map Layers */}
            <Box sx={{ bgcolor: '#FFF', borderRadius: 3, border: '1px solid #E2E8F0', p: 2 }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: NAVY, mb: 1, letterSpacing: '0.05em' }}>MAP LAYERS</Typography>
              <FormGroup>
                {[
                  { key: 'incidents', label: 'Incidents', icon: '⚠️' },
                  { key: 'sdrf', label: 'SDRF Teams', icon: '🛡️' },
                  { key: 'heli', label: 'Helicopter Bases', icon: '🚁' },
                  { key: 'camp', label: 'Relief Camps', icon: '⛺' },
                  { key: 'hospital', label: 'Hospitals', icon: '🏥' },
                  { key: 'road', label: 'Road Closures', icon: '🚧' },
                ].map((l) => (
                  <FormControlLabel
                    key={l.key}
                    control={<Checkbox checked={layers[l.key]} onChange={() => toggleLayer(l.key)} size="small" sx={{ color: BLUE, '&.Mui-checked': { color: BLUE } }} />}
                    label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: NAVY }}>{l.label}</Typography></Box>}
                    sx={{ mb: -0.5 }}
                  />
                ))}
              </FormGroup>
            </Box>
          </Grid>

          {/* CENTER MAP CONTAINER */}
          <Grid item xs={12} lg={6.5} sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ flexGrow: 1, bgcolor: '#FFF', borderRadius: 3, border: '1px solid #E2E8F0', overflow: 'hidden', position: 'relative', minHeight: 500 }}>
              
              <MapContainer center={HIMACHAL_CENTER} zoom={8} scrollWheelZoom={true} style={{ height: '100%', width: '100%', zIndex: 1 }} preferCanvas>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" maxZoom={19} />
                
                {layers.incidents && filteredIncidents.map(inc => {
                  const m = getTypeMeta(inc.type);
                  return (
                    <Marker key={inc.id} position={[inc.lat, inc.lon]} icon={makeIcon(m.hex, m.emoji)}>
                      <Popup><Typography fontWeight={700}>{inc.type}</Typography><Typography variant="caption">{inc.district}</Typography></Popup>
                    </Marker>
                  );
                })}
                {layers.sdrf && MOCK_LAYERS.sdrf.map(m => (
                  <Marker key={m.id} position={[m.lat, m.lon]} icon={makeIcon('#2563EB', '🛡️')}><Popup><b>{m.label}</b></Popup></Marker>
                ))}
                {layers.heli && MOCK_LAYERS.heli.map(m => (
                  <Marker key={m.id} position={[m.lat, m.lon]} icon={makeIcon('#0F172A', '🚁')}><Popup><b>{m.label}</b></Popup></Marker>
                ))}
                {layers.camp && MOCK_LAYERS.camp.map(m => (
                  <Marker key={m.id} position={[m.lat, m.lon]} icon={makeIcon('#8B5CF6', '⛺')}><Popup><b>{m.label}</b></Popup></Marker>
                ))}
                {layers.hospital && MOCK_LAYERS.hospital.map(m => (
                  <Marker key={m.id} position={[m.lat, m.lon]} icon={makeIcon('#10B981', '🏥')}><Popup><b>{m.label}</b></Popup></Marker>
                ))}
                {layers.road && MOCK_LAYERS.road.map(m => (
                  <Marker key={m.id} position={[m.lat, m.lon]} icon={makeIcon('#F59E0B', '🚧')}><Popup><b>{m.label}</b></Popup></Marker>
                ))}
              </MapContainer>

              {/* Overlays */}
              <Box sx={{ position: 'absolute', bottom: 16, left: 16, zIndex: 1000, bgcolor: '#FFF', borderRadius: 2, p: 1.5, border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: 1, boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <Typography sx={{ fontSize: '0.65rem', fontWeight: 800, color: NAVY }}>Incident Severity</Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: RED, border: '2px solid #FFF', boxShadow: '0 0 0 1px #E2E8F0' }} /><Typography sx={{ fontSize: '0.7rem', fontWeight: 600 }}>High</Typography></Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#F59E0B', border: '2px solid #FFF', boxShadow: '0 0 0 1px #E2E8F0' }} /><Typography sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Medium</Typography></Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: BLUE, border: '2px solid #FFF', boxShadow: '0 0 0 1px #E2E8F0' }} /><Typography sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Low</Typography></Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#10B981', border: '2px solid #FFF', boxShadow: '0 0 0 1px #E2E8F0' }} /><Typography sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Info</Typography></Box>
                </Box>
              </Box>

              <Box sx={{ position: 'absolute', bottom: 16, right: 16, zIndex: 1000, bgcolor: '#FFF', borderRadius: 2, px: 2, py: 1, border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 1, boxShadow: '0 4px 6px rgba(0,0,0,0.05)', cursor: 'pointer' }} onClick={fetchData}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: NAVY }}>Last Updated: {loading ? '...' : 'Just now'}</Typography>
                <SyncRoundedIcon sx={{ fontSize: 16, color: '#64748B' }} />
              </Box>

            </Box>
          </Grid>

          {/* RIGHT SIDEBAR */}
          <Grid item xs={12} lg={3} sx={{ display: 'flex', flexDirection: 'column' }}>
            {/* Live Incidents */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
              <Typography sx={{ fontWeight: 800, color: NAVY, fontSize: '0.85rem', letterSpacing: '0.05em' }}>LIVE INCIDENTS</Typography>
              <Typography component={RouterLink} to="/updates" sx={{ fontSize: '0.75rem', fontWeight: 700, color: BLUE, textDecoration: 'none' }}>View All</Typography>
            </Box>
            
            <Box sx={{ bgcolor: '#FFF', borderRadius: 3, border: '1px solid #E2E8F0', overflow: 'hidden', flexGrow: 1, mb: 3 }}>
              <Box sx={{ height: '400px', overflowY: 'auto' }}>
                {/* Reusing HpsdmaFeed with list layout to match blueprint */}
                <HpsdmaFeed maxItems={10} hideHeader={true} showSummary={false} layout="list" />
              </Box>
            </Box>

            {/* Map Legend */}
            <Box sx={{ bgcolor: '#FFF', borderRadius: 3, border: '1px solid #E2E8F0', p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography sx={{ fontWeight: 800, color: NAVY, fontSize: '0.85rem', letterSpacing: '0.05em' }}>MAP LEGEND</Typography>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: BLUE, cursor: 'pointer' }}>Hide</Typography>
              </Box>
              <Grid container spacing={1.5}>
                {[
                  { icon: '⚠️', color: RED, label: 'Active Incident' },
                  { icon: '⚠️', color: '#F59E0B', label: 'Warning / Alert' },
                  { icon: 'ℹ️', color: BLUE, label: 'Info Update' },
                  { icon: '🛡️', color: BLUE, label: 'SDRF Team' },
                  { icon: '🚁', color: '#10B981', label: 'Helicopter Base' },
                  { icon: '⛺', color: '#8B5CF6', label: 'Relief Camp' },
                  { icon: '🏥', color: RED, label: 'Hospital' },
                  { icon: '🚧', color: '#F59E0B', label: 'Road Closure' },
                ].map((l, i) => (
                  <Grid item xs={6} key={i}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 22, height: 22, borderRadius: '50%', bgcolor: `${l.color}20`, color: l.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>
                        {l.icon}
                      </Box>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: NAVY }}>{l.label}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* ── BOTTOM TRUST BADGES ── */}
      <Box sx={{ bgcolor: '#EFF6FF', py: 2, borderTop: '1px solid #BFDBFE', mt: 'auto' }}>
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
