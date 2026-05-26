import React, { useEffect, useState } from 'react';
import { Alert, Box, Button, Card, CardContent, Grid, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

import { createIntelPin, fetchIntelPins } from '../api/client';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

const departmentOptions = ['Police', 'Medical', 'Utility', 'Connectivity', 'SDRF'];
const HIMACHAL_CENTER = [31.1048, 77.1734];
const HIMACHAL_BOUNDS = [
  [30.2, 75.6],
  [33.5, 79.6]
];

function IntelMapClickHandler({ onPick }) {
  useMapEvents({
    click(event) {
      onPick(event.latlng);
    }
  });

  return null;
}

export default function IntelMapPage() {
  const [pins, setPins] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ lat: '', lon: '', department: 'Police', note: '' });

  useEffect(() => {
    refreshPins();
  }, []);

  async function refreshPins() {
    try {
      setPins(await fetchIntelPins());
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not load intel pins');
    }
  }

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function handleMapPick(latlng) {
    setForm((current) => ({
      ...current,
      lat: latlng.lat.toFixed(6),
      lon: latlng.lng.toFixed(6)
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    try {
      await createIntelPin({ ...form, lat: Number(form.lat), lon: Number(form.lon) });
      setForm({ lat: '', lon: '', department: 'Police', note: '' });
      await refreshPins();
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not create intel pin');
    }
  }

  return (
    <Stack spacing={3}>
      {error && <Alert severity="warning">{error}</Alert>}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={800} gutterBottom>
            Intel Map
          </Typography>
          <Typography color="text.secondary">
            Shared map pins from departments, useful for quick operational coordination.
          </Typography>
        </CardContent>
      </Card>

      <Grid container spacing={2}>
        <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={800} gutterBottom>
                Add Intel Pin
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Tap on the map to auto-fill latitude and longitude.
              </Typography>
              <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
                <TextField label="Latitude" name="lat" value={form.lat} onChange={handleChange} />
                <TextField label="Longitude" name="lon" value={form.lon} onChange={handleChange} />
                <TextField select label="Department" name="department" value={form.department} onChange={handleChange}>
                  {departmentOptions.map((department) => (
                    <MenuItem key={department} value={department}>{department}</MenuItem>
                  ))}
                </TextField>
                <TextField label="Operational Note" name="note" value={form.note} onChange={handleChange} multiline minRows={3} />
                <Button type="submit" variant="contained">Pin Intel</Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={800} gutterBottom>
                Pins
              </Typography>
              <div style={{ height: 420 }}>
                <MapContainer
                  center={HIMACHAL_CENTER}
                  zoom={8}
                  minZoom={7}
                  maxBounds={HIMACHAL_BOUNDS}
                  maxBoundsViscosity={1}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <IntelMapClickHandler onPick={handleMapPick} />
                  {pins.map((pin) => (
                    <Marker key={pin.id} position={[Number(pin.lat), Number(pin.lon)]}>
                      <Popup>
                        <Typography fontWeight={700}>{pin.department}</Typography>
                        <div>{pin.note}</div>
                        <div>{pin.timestamp}</div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}