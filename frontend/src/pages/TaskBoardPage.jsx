import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Box, Button, Card, CardContent, Checkbox, Chip, Grid, ListItemText, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';

import { createTask, fetchAgencies, fetchTasks, updateTask } from '../api/client';

const statusOrder = ['New', 'In Progress', 'Complete'];

function getTaskNotificationAgencies(task) {
  if (Array.isArray(task.notification_agencies)) {
    return task.notification_agencies;
  }

  if (typeof task.notification_agencies === 'string' && task.notification_agencies.trim()) {
    try {
      const parsed = JSON.parse(task.notification_agencies);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch (_error) {
      return task.notification_agencies.split(',').map((item) => item.trim()).filter(Boolean);
    }
  }

  return [];
}

function handleSelectArrayValue(value) {
  return typeof value === 'string' ? value.split(',') : value;
}

// Loads the task board and keeps quick-create and status updates in sync.
export default function TaskBoardPage() {
  const [tasks, setTasks] = useState([]);
  const [agencyOptions, setAgencyOptions] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    incidentId: '',
    title: '',
    details: '',
    assignedAgency: 'SDRF',
    otherAgency: '',
    notificationAgencies: [],
    status: 'New'
  });

  useEffect(() => {
    refreshTasks();
    refreshAgencies();
  }, []);

  // Fetches the latest task list from the backend.
  async function refreshTasks() {
    try {
      setTasks(await fetchTasks());
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not load tasks');
    }
  }

  async function refreshAgencies() {
    try {
      const agencies = await fetchAgencies();
      setAgencyOptions(agencies);
      setForm((current) => {
        if (current.notificationAgencies.length > 0) {
          return current;
        }

        return {
          ...current,
          notificationAgencies: agencies.length > 0 ? [agencies[0]] : []
        };
      });
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not load agencies');
    }
  }

  // Updates the local form field for task creation.
  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function handleAgencyMultiChange(event) {
    const value = event.target.value;
    setForm((current) => ({
      ...current,
      notificationAgencies: handleSelectArrayValue(value)
    }));
  }

  // Creates a task card and refreshes the board.
  async function handleCreate(event) {
    event.preventDefault();
    setError('');
    const assignedAgency = form.assignedAgency === 'Other' ? form.otherAgency || 'Other' : form.assignedAgency;
    const notificationAgencies = form.notificationAgencies.length > 0 ? form.notificationAgencies : [assignedAgency];
    try {
      await createTask({
        ...form,
        incidentId: Number(form.incidentId || 0),
        assignedAgency,
        notificationAgencies
      });
      setForm({
        incidentId: '',
        title: '',
        details: '',
        assignedAgency: agencyOptions[0] || 'SDRF',
        otherAgency: '',
        notificationAgencies: agencyOptions.length > 0 ? [agencyOptions[0]] : [],
        status: 'New'
      });
      await refreshTasks();
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not create task');
    }
  }

  // Sends a task status change directly to the API.
  async function moveTask(task, status) {
    await updateTask(task.id, { assignedAgency: task.assigned_agency || task.assignedAgency, status, offline: false });
    await refreshTasks();
  }

  const grouped = useMemo(
    () => statusOrder.reduce((acc, status) => ({ ...acc, [status]: tasks.filter((task) => (task.status || 'New') === status) }), {}),
    [tasks]
  );

  return (
    <Stack spacing={3}>
      {error && <Alert severity="warning">{error}</Alert>}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={800} gutterBottom>
            Quick Add Task
          </Typography>
          <Box component="form" onSubmit={handleCreate} sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(5, 1fr)' } }}>
            <TextField label="Incident ID" name="incidentId" value={form.incidentId} onChange={handleChange} />
            <TextField label="Title" name="title" value={form.title} onChange={handleChange} />
            <TextField label="Details" name="details" value={form.details} onChange={handleChange} />
            <TextField select label="Agency" name="assignedAgency" value={form.assignedAgency} onChange={handleChange}>
              {agencyOptions.concat('Other').map((ag) => (
                <MenuItem key={ag} value={ag}>{ag}</MenuItem>
              ))}
            </TextField>
            <TextField
              select
              multiple
              label="Notify Agencies"
              value={form.notificationAgencies}
              onChange={handleAgencyMultiChange}
              SelectProps={{
                multiple: true,
                renderValue: (selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                    {selected.map((item) => <Chip key={item} label={item} size="small" />)}
                  </Box>
                )
              }}
              helperText="Select one or more agencies that should receive SMS alerts."
            >
              {agencyOptions.map((ag) => (
                <MenuItem key={ag} value={ag}>
                  <Checkbox checked={form.notificationAgencies.indexOf(ag) > -1} />
                  <ListItemText primary={ag} />
                </MenuItem>
              ))}
            </TextField>
            {form.assignedAgency === 'Other' && (
              <TextField label="Other agency" name="otherAgency" value={form.otherAgency} onChange={handleChange} />
            )}
            <TextField select label="Status" name="status" value={form.status} onChange={handleChange}>
              {statusOrder.map((status) => <MenuItem key={status} value={status}>{status}</MenuItem>)}
            </TextField>
            <Button type="submit" variant="contained" sx={{ gridColumn: { md: '1 / -1' } }}>
              Create Task
            </Button>
            <Button component={NavLink} to="/agency-details" variant="outlined" sx={{ gridColumn: { md: '1 / -1' } }}>
              Show Details
            </Button>
          </Box>
        </CardContent>
      </Card>
      <Grid container spacing={2}>
        {statusOrder.map((status) => (
          <Grid item xs={12} md={4} key={status}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" fontWeight={800} gutterBottom>
                  {status}
                </Typography>
                <Stack spacing={2}>
                  {grouped[status].map((task) => (
                    <Card key={task.id} variant="outlined">
                      <CardContent>
                        <Typography fontWeight={700}>{task.title}</Typography>
                        <Typography variant="body2" color="text.secondary">{task.details}</Typography>
                        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                          Agency: {task.assigned_agency || task.assignedAgency}
                        </Typography>
                        <Typography variant="caption" display="block">
                          Notify: {getTaskNotificationAgencies(task).join(', ') || 'None'}
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap' }}>
                          {status !== 'In Progress' && <Button size="small" onClick={() => moveTask(task, 'In Progress')}>Start</Button>}
                          {status !== 'Complete' && <Button size="small" onClick={() => moveTask(task, 'Complete')}>Complete</Button>}
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}
