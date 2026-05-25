import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

// Displays one compact summary metric on the dashboard.
export default function StatCard({ label, value, note }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="overline" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="h4" fontWeight={800}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {note}
        </Typography>
      </CardContent>
    </Card>
  );
}
