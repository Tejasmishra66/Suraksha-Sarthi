import React, { useEffect, useState } from 'react';
import { Alert, Box, Button, Card, CardContent, MenuItem, Stack, TextField, Typography } from '@mui/material';

import { createBulletin, fetchBulletins } from '../api/client';
import { useAuth } from '../context/AuthContext';

const categoryOptions = ['Connectivity', 'Utility Status', 'Medical Support'];

export default function BulletinFeedPage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ category: 'Connectivity', message: '' });

  useEffect(() => {
    refreshFeed();
  }, []);

  async function refreshFeed() {
    try {
      setItems(await fetchBulletins());
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not load bulletins');
    }
  }

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    try {
      await createBulletin(form);
      setForm({ category: 'Connectivity', message: '' });
      await refreshFeed();
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not create bulletin');
    }
  }

  return (
    <Stack spacing={3}>
      {error && <Alert severity="warning">{error}</Alert>}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={800} gutterBottom>
            Macro-Updates Bulletin
          </Typography>
          <Typography color="text.secondary">
            Shared departmental updates for connectivity, utility status, and medical support.
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={800} gutterBottom>
            Latest Feed
          </Typography>
          <Stack spacing={2}>
            {items.map((item) => (
              <Card key={item.id} variant="outlined">
                <CardContent>
                  <Typography variant="overline" color="text.secondary">
                    {item.category}
                  </Typography>
                  <Typography fontWeight={700}>{item.message}</Typography>
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Posted by {item.author_name || 'Unknown'} {item.author_agency ? `(${item.author_agency})` : ''} at {item.timestamp}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </CardContent>
      </Card>

      {user?.role === 'officer' && (
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={800} gutterBottom>
              Post Bulletin
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
              <TextField select label="Category" name="category" value={form.category} onChange={handleChange}>
                {categoryOptions.map((category) => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </TextField>
              <TextField
                label="Message"
                name="message"
                value={form.message}
                onChange={handleChange}
                multiline
                minRows={3}
              />
              <Button type="submit" variant="contained">
                Publish
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
    </Stack>
  );
}