import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, CircularProgress, Alert } from '@mui/material';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import { fetchAuditLogs } from '../api/client';
import { useAuth } from '../context/AuthContext';

const INDIGO = '#020617';
const BLUE   = '#2563EB';

export default function SecurityLogsPage() {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If the user is an agency_head, they might only want to fetch logs for their office.
    // The backend filters automatically based on their role if no office is passed, or if we pass one.
    fetchAuditLogs()
      .then(data => setLogs(data))
      .catch(err => setError(err.message || 'Failed to load security logs'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box sx={{ bgcolor: '#F8FAFC', minHeight: '100vh', py: { xs: 4, md: 8 } }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <Box sx={{ p: 1.5, bgcolor: '#FFFFFF', borderRadius: '8px', border: '2px solid #E2E8F0', display: 'flex' }}>
            <ShieldRoundedIcon sx={{ color: INDIGO, fontSize: 32 }} />
          </Box>
          <Box>
            <Typography variant="h4" fontWeight={900} color={INDIGO} sx={{ letterSpacing: '-0.02em', mb: 0.5 }}>
              Security Audit Logs
            </Typography>
            <Typography variant="body1" color="text.secondary" fontWeight={600}>
              System-wide security and access monitoring
            </Typography>
          </Box>
        </Box>

        <Paper sx={{ border: '2px solid #E2E8F0', borderRadius: '12px', boxShadow: 'none', overflow: 'hidden' }}>
          {loading ? (
            <Box sx={{ p: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <CircularProgress size={40} sx={{ color: BLUE }} />
              <Typography fontWeight={600} color={INDIGO}>Loading logs...</Typography>
            </Box>
          ) : error ? (
            <Box sx={{ p: 3 }}>
              <Alert severity="error" sx={{ border: '2px solid #FECACA', borderRadius: '8px' }}>
                {error}
              </Alert>
            </Box>
          ) : logs.length === 0 ? (
            <Box sx={{ p: 6, textAlign: 'center' }}>
              <Typography fontWeight={600} color="text.secondary">No security logs found.</Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead sx={{ bgcolor: '#F1F5F9' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 800, color: INDIGO, borderBottom: '2px solid #E2E8F0' }}>Timestamp</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: INDIGO, borderBottom: '2px solid #E2E8F0' }}>Action</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: INDIGO, borderBottom: '2px solid #E2E8F0' }}>Entity Type</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: INDIGO, borderBottom: '2px solid #E2E8F0' }}>User ID</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: INDIGO, borderBottom: '2px solid #E2E8F0' }}>Office</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: INDIGO, borderBottom: '2px solid #E2E8F0' }}>Details</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell sx={{ fontWeight: 600, color: '#475569', borderBottom: '1px solid #F1F5F9' }}>
                        {new Date(log.timestamp).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'medium' })}
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #F1F5F9' }}>
                        <Chip size="small" label={log.action} sx={{ fontWeight: 700, bgcolor: '#DBEAFE', color: BLUE, borderRadius: '4px' }} />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: INDIGO, borderBottom: '1px solid #F1F5F9' }}>{log.entity_type}</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#475569', borderBottom: '1px solid #F1F5F9' }}>{log.user_id}</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#475569', borderBottom: '1px solid #F1F5F9' }}>{log.office || 'N/A'}</TableCell>
                      <TableCell sx={{ fontWeight: 500, color: '#475569', borderBottom: '1px solid #F1F5F9' }}>{log.details}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
