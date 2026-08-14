import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Chip, Stack, Divider, CircularProgress,
  IconButton, Tooltip, Grid, Alert, Button,
} from '@mui/material';
import RefreshRoundedIcon       from '@mui/icons-material/RefreshRounded';
import WhatshotRoundedIcon      from '@mui/icons-material/WhatshotRounded';
import LocationOnRoundedIcon    from '@mui/icons-material/LocationOnRounded';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import PersonOffRoundedIcon     from '@mui/icons-material/PersonOffRounded';
import HealingRoundedIcon       from '@mui/icons-material/HealingRounded';
import ErrorOutlineRoundedIcon  from '@mui/icons-material/ErrorOutlineRounded';
import OpenInNewRoundedIcon     from '@mui/icons-material/OpenInNewRounded';

const API_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4002'}/hpsdma/incidents`;

const NAVY = '#0B2545';
const RED  = '#C8102E';

/* ── Colour + icon per disaster type ── */
const TYPE_META = {
  landslide:      { color: '#92400E', bg: '#FFFBEB', border: '#FCD34D', emoji: '🏔️' },
  flood:          { color: '#1E40AF', bg: '#EFF6FF', border: '#93C5FD', emoji: '🌊' },
  'flash flood':  { color: '#1D4ED8', bg: '#EFF6FF', border: '#93C5FD', emoji: '🌊' },
  cloudburst:     { color: '#5B21B6', bg: '#F5F3FF', border: '#C4B5FD', emoji: '⛈️' },
  fire:           { color: '#B91C1C', bg: '#FEF2F2', border: '#FCA5A5', emoji: '🔥' },
  'forest fire':  { color: '#B91C1C', bg: '#FEF2F2', border: '#FCA5A5', emoji: '🔥' },
  avalanche:      { color: '#0E7490', bg: '#ECFEFF', border: '#67E8F9', emoji: '❄️' },
  drowning:       { color: '#0369A1', bg: '#F0F9FF', border: '#7DD3FC', emoji: '🌀' },
  earthquake:     { color: '#7C2D12', bg: '#FFF7ED', border: '#FDBA74', emoji: '🌍' },
  'road blockage':{ color: '#D97706', bg: '#FFFBEB', border: '#FCD34D', emoji: '🚧' },
  'road accident':{ color: '#DC2626', bg: '#FEF2F2', border: '#FCA5A5', emoji: '🚗' },
  lightning:      { color: '#CA8A04', bg: '#FEFCE8', border: '#FDE047', emoji: '⚡' },
  'fallen tree':  { color: '#166534', bg: '#F0FDF4', border: '#86EFAC', emoji: '🌳' },
  'power outage': { color: '#374151', bg: '#F9FAFB', border: '#D1D5DB', emoji: '⚡' },
  drowning:       { color: '#0369A1', bg: '#F0F9FF', border: '#7DD3FC', emoji: '💧' },
};

function getTypeMeta(type = '') {
  const key = type.toLowerCase().trim();
  for (const [k, v] of Object.entries(TYPE_META)) {
    if (key.includes(k)) return v;
  }
  return { color: '#475569', bg: '#F8FAFC', border: '#CBD5E1', emoji: '⚠️' };
}

function formatDate(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return iso;
  }
}

/* ── Single incident card ── */
export function IncidentCard({ inc, layout = 'grid', onClick }) {
  const meta = getTypeMeta(inc.type);
  const hasLoss = inc.humanLoss > 0 || inc.humanInjured > 0 || inc.humanMissing > 0;
  let severity = 'Info';
  let sevColor = '#0EA5E9';
  let sevBg = '#F0F9FF';
  if (inc.humanLoss > 0) { severity = 'High'; sevColor = '#DC2626'; sevBg = '#FEF2F2'; }
  else if (inc.humanInjured > 0 || inc.type.toLowerCase().includes('fire')) { severity = 'Medium'; sevColor = '#D97706'; sevBg = '#FFFBEB'; }
  else if (inc.type.toLowerCase().includes('road')) { severity = 'Low'; sevColor = '#2563EB'; sevBg = '#EFF6FF'; }

  if (layout === 'sidebar') {
    return (
      <Box 
        onClick={onClick}
        sx={{ 
          bgcolor: '#FFF', borderRadius: '24px', border: '1px solid #E2E8F0', p: 2, mb: 1.5,
          display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer', transition: 'all 0.2s',
          '&:hover': { borderColor: '#1D4ED8', boxShadow: '0 4px 12px rgba(29, 78, 216, 0.08)' }
        }}
      >
        {/* Type Icon */}
        <Box sx={{ width: 44, height: 44, borderRadius: '50%', bgcolor: meta.bg, color: meta.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1.2rem' }}>
          {meta.emoji}
        </Box>
        
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
            <Typography sx={{ fontSize: '0.9rem', fontWeight: 900, color: NAVY }} noWrap>{inc.type}</Typography>
            <Box sx={{ bgcolor: sevBg, color: sevColor, fontSize: '0.55rem', fontWeight: 900, px: 0.8, py: 0.2, borderRadius: 1.5, letterSpacing: '0.05em', textTransform: 'uppercase', border: `1px solid ${sevColor}40` }}>
              {severity}
            </Box>
          </Box>
          <Typography sx={{ fontSize: '0.75rem', color: '#475569', fontWeight: 500, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {inc.district}{inc.tehsil && inc.tehsil !== '-' ? `, ${inc.tehsil}` : ''} - {hasLoss ? `${inc.humanLoss} Deaths, ${inc.humanInjured} Injured` : 'Reported Incident'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5, flexShrink: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#64748B' }}>
            <LocationOnRoundedIcon sx={{ fontSize: 12 }} />
            <Typography sx={{ fontSize: '0.65rem', fontWeight: 600 }}>{inc.district}</Typography>
          </Box>
          <Typography sx={{ fontSize: '0.6rem', fontWeight: 600, color: '#94A3B8' }}>{formatDate(inc.date)}</Typography>
        </Box>
      </Box>
    );
  }

  if (layout === 'list') {
    return (
      <Box onClick={onClick} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1.5, borderBottom: '1px solid #E2E8F0', cursor: onClick ? 'pointer' : 'default', '&:hover': onClick ? { bgcolor: '#F8FAFC' } : {} }}>
        <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: meta.bg, border: `1px solid ${meta.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1.2rem' }}>
          {meta.emoji}
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Typography sx={{ fontWeight: 800, color: NAVY, fontSize: '0.9rem', lineHeight: 1.2 }}>{inc.type}</Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#64748B', mt: 0.5 }} noWrap>{inc.district} {inc.tehsil !== '-' ? `- ${inc.tehsil}` : ''}</Typography>
        </Box>
        <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
          <Typography sx={{ fontSize: '0.65rem', color: '#94A3B8', fontWeight: 700, mb: 0.5 }}>
            {formatDate(inc.date)}
          </Typography>
          <Chip label={severity} size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 800, bgcolor: sevBg, color: sevColor, border: `1px solid ${sevColor}40` }} />
        </Box>
      </Box>
    );
  }

  return (
    <Box
      onClick={onClick}
      sx={{
        p: 2,
        borderRadius: 2.5,
        border: `1.5px solid ${meta.border}`,
        bgcolor: meta.bg,
        transition: 'all 0.18s ease',
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': { transform: 'translateY(-2px)', boxShadow: `0 6px 18px ${meta.border}88` },
      }}
    >
      {/* Type + date row */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1, mb: 1 }}>
        <Chip
          label={`${meta.emoji}  ${inc.type}`}
          size="small"
          sx={{ bgcolor: meta.color + '18', color: meta.color, fontWeight: 800, fontSize: '0.72rem', border: `1px solid ${meta.border}` }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
          <CalendarTodayRoundedIcon sx={{ fontSize: 12, color: '#94a3b8' }} />
          <Typography variant="caption" color="#94a3b8" fontWeight={600} sx={{ fontSize: '0.68rem' }}>
            {formatDate(inc.date)}
          </Typography>
        </Box>
      </Box>

      {/* Location */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mb: hasLoss ? 1 : 0 }}>
        <LocationOnRoundedIcon sx={{ fontSize: 14, color: meta.color }} />
        <Typography variant="body2" fontWeight={700} color={NAVY} sx={{ fontSize: '0.8rem' }}>
          {inc.district}
          {inc.tehsil && inc.tehsil !== '-' ? `, ${inc.tehsil}` : ''}
        </Typography>
      </Box>

      {/* Loss row */}
      {hasLoss && (
        <Stack direction="row" spacing={1.5} mt={0.5}>
          {inc.humanLoss > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
              <PersonOffRoundedIcon sx={{ fontSize: 13, color: '#DC2626' }} />
              <Typography variant="caption" color="#DC2626" fontWeight={800} sx={{ fontSize: '0.68rem' }}>
                {inc.humanLoss} Deaths
              </Typography>
            </Box>
          )}
          {inc.humanInjured > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
              <HealingRoundedIcon sx={{ fontSize: 13, color: '#D97706' }} />
              <Typography variant="caption" color="#D97706" fontWeight={800} sx={{ fontSize: '0.68rem' }}>
                {inc.humanInjured} Injured
              </Typography>
            </Box>
          )}
          {inc.humanMissing > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
              <ErrorOutlineRoundedIcon sx={{ fontSize: 13, color: '#7C3AED' }} />
              <Typography variant="caption" color="#7C3AED" fontWeight={800} sx={{ fontSize: '0.68rem' }}>
                {inc.humanMissing} Missing
              </Typography>
            </Box>
          )}
        </Stack>
      )}
    </Box>
  );
}

/* ── Main widget ── */
export default function HpsdmaFeed({ maxItems = 12, showSummary = true, hideHeader = false, layout = 'grid', onDataLoad = null }) {
  const [data,         setData]         = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [lastFetched,  setLastFetched]  = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}?limit=200`);
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      const json = await res.json();
      setData(json);
      setLastFetched(new Date());
      if (onDataLoad) onDataLoad(json);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // Auto-refresh every 5 minutes
    const id = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, [fetchData]);

  /* ── LOADING ── */
  if (loading && !data) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6, gap: 2 }}>
        <CircularProgress size={36} sx={{ color: RED }} />
        <Typography variant="body2" color="text.secondary" fontWeight={600}>
          Fetching live incidents from HPSDMA…
        </Typography>
      </Box>
    );
  }

  /* ── ERROR ── */
  if (error && !data) {
    return (
      <Alert
        severity="warning"
        sx={{ borderRadius: 2 }}
        action={
          <Button size="small" onClick={fetchData} sx={{ fontWeight: 700 }}>
            Retry
          </Button>
        }
      >
        Could not load HPSDMA live data: {error}
      </Alert>
    );
  }

  const incidents = (data?.incidents || []).slice(0, maxItems);
  const summary   = data?.summary || {};

  return (
    <Box>
      {/* ── Header ── */}
      {!hideHeader && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
            <Box sx={{ p: 0.8, bgcolor: RED, borderRadius: 1.5, display: 'flex' }}>
              <WhatshotRoundedIcon sx={{ color: '#fff', fontSize: 20 }} />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={900} color={NAVY} sx={{ lineHeight: 1.2, fontSize: '1rem' }}>
                Live HPSDMA Incidents
              </Typography>
              <Typography variant="caption" color="#64748b" fontWeight={600} sx={{ fontSize: '0.68rem' }}>
                Source: hpsdma.hp.gov.in · {data?.year} · Auto-refreshes every 5 min
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {lastFetched && (
              <Typography variant="caption" color="#94a3b8" sx={{ fontSize: '0.65rem' }}>
                Updated {lastFetched.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </Typography>
            )}
            <Tooltip title="Refresh">
              <IconButton size="small" onClick={fetchData} disabled={loading} sx={{ color: NAVY }}>
                <RefreshRoundedIcon fontSize="small" sx={{ animation: loading ? 'spin 1s linear infinite' : 'none', '@keyframes spin': { to: { transform: 'rotate(360deg)' } } }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Open HPSDMA website">
              <IconButton size="small" component="a" href="https://hpsdma.hp.gov.in/index_new.html" target="_blank" rel="noopener noreferrer" sx={{ color: NAVY }}>
                <OpenInNewRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      )}

      {/* ── Summary strip ── */}
      {!hideHeader && showSummary && summary.total > 0 && (
        <Box sx={{ display: 'flex', gap: 1.5, mb: 2.5, flexWrap: 'wrap' }}>
          {[
            { label: 'Total Incidents', value: summary.total,   color: NAVY   },
            { label: 'Deaths',          value: summary.deaths,  color: '#DC2626' },
            { label: 'Injured',         value: summary.injured, color: '#D97706' },
            { label: 'Missing',         value: summary.missing, color: '#7C3AED' },
          ].map(({ label, value, color }) => (
            <Box
              key={label}
              sx={{ px: 1.8, py: 0.8, borderRadius: 2, bgcolor: '#fff', border: '1px solid #E2E8F0', textAlign: 'center', minWidth: 80 }}
            >
              <Typography variant="h6" fontWeight={900} color={color} sx={{ lineHeight: 1, fontSize: '1.1rem' }}>
                {value}
              </Typography>
              <Typography variant="caption" color="#64748b" fontWeight={600} sx={{ fontSize: '0.62rem' }}>
                {label}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      {!hideHeader && <Divider sx={{ mb: 2, borderColor: '#F1F5F9' }} />}

      {/* ── Incident cards grid or list ── */}
      {incidents.length === 0 ? (
        <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
          No incidents reported so far this year.
        </Typography>
      ) : layout === 'list' || layout === 'sidebar' ? (
        <Stack spacing={0}>
          {incidents.map((inc) => (
            <IncidentCard inc={inc} key={inc.id} layout={layout} />
          ))}
        </Stack>
      ) : (
        <Grid container spacing={1.5}>
          {incidents.map((inc) => (
            <Grid item xs={12} sm={6} key={inc.id}>
              <IncidentCard inc={inc} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* ── Footer note ── */}
      <Typography
        variant="caption"
        display="block"
        mt={2.5}
        color="#94a3b8"
        textAlign="center"
        sx={{ fontSize: '0.65rem' }}
      >
        Data sourced from HP Geoportal (ArcGIS FeatureServer) via HPSDMA. Official records only.
      </Typography>
    </Box>
  );
}
