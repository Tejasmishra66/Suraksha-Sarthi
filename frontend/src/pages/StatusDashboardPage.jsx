import React, { useEffect, useState } from 'react';
import { Alert, Card, CardContent, Chip, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';

import { fetchStatus } from '../api/client';

export default function StatusDashboardPage() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    refreshStatus();
  }, []);

  async function refreshStatus() {
    try {
      setRows(await fetchStatus());
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not load status');
    }
  }

  return (
    <Stack spacing={3}>
      {error && <Alert severity="warning">{error}</Alert>}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={800} gutterBottom>
            Status Dashboard
          </Typography>
          <Typography color="text.secondary">
            Heartbeat monitoring for each agency app. OFFLINE means the latest ping is stale.
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Agency</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Last Seen</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.agency_id}</TableCell>
                  <TableCell>{row.user_name || '-'}</TableCell>
                  <TableCell>{row.location || '-'}</TableCell>
                  <TableCell>{row.last_seen || '-'}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={row.status}
                      color={row.status === 'ONLINE' ? 'success' : 'error'}
                      variant="outlined"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Stack>
  );
}