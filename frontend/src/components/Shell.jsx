import React from 'react';
import { Box, Container, Typography, Breadcrumbs, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

// Wraps dashboard pages with consistent padding, breadcrumbs, and titles.
export default function Shell({ title, children }) {
  return (
    <Box sx={{ background: 'transparent' }}>
      <Container sx={{ py: 3 }}>
        {/* Standard Government Breadcrumbs */}
        <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ mb: 2, fontSize: '0.85rem' }}>
          <Link 
            component={RouterLink} 
            to="/home" 
            color="inherit" 
            sx={{ display: 'flex', alignItems: 'center', '&:hover': { color: 'primary.main', textDecoration: 'underline' } }}
          >
            Home
          </Link>
          <Typography color="text.primary" sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
            {title}
          </Typography>
        </Breadcrumbs>

        {/* Page Title */}
        <Box sx={{ mb: 3, borderBottom: '2px solid #e0e0e0', pb: 1 }}>
          <Typography variant="h5" color="primary.main" fontWeight={600}>
            {title}
          </Typography>
        </Box>
        {children}
      </Container>
    </Box>
  );
}
