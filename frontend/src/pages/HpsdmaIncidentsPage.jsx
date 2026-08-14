import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import HpsdmaFeed from '../components/HpsdmaFeed';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';

export default function HpsdmaIncidentsPage() {
  return (
    <Box sx={{ py: 6, bgcolor: '#F4F6FB', minHeight: 'calc(100vh - 66px)' }}>
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <Box sx={{ p: 1.5, bgcolor: '#FEE2E2', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <WarningAmberRoundedIcon sx={{ fontSize: 32, color: '#DC2626' }} />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#0F172A', fontFamily: '"Outfit", sans-serif', letterSpacing: '-0.02em' }}>
              Live HPSDMA Incidents
            </Typography>
            <Typography sx={{ color: '#475569', fontSize: '0.9rem', fontWeight: 500, mt: 0.5 }}>
              Official real-time disaster and emergency incident reports across Himachal Pradesh.
            </Typography>
          </Box>
        </Box>

        <Box sx={{ bgcolor: '#FFF', borderRadius: 4, p: { xs: 2, md: 4 }, border: '1px solid #E2E8F0', boxShadow: '0 10px 15px -3px rgba(15,23,42,0.02)' }}>
          <HpsdmaFeed layout="grid" maxItems={100} showSummary={true} />
        </Box>
      </Container>
    </Box>
  );
}
