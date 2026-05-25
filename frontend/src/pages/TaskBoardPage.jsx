import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Box, Button, Card, CardContent, Grid, MenuItem, Stack, TextField, Typography } from '@mui/material';

import { createTask, fetchTasks, updateTask } from '../api/client';

const statusOrder = ['New', 'In Progress', 'Complete'];

// Loads the task board and keeps quick-create and status updates in sync.
export default function TaskBoardPage() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ incidentId: '', title: '', details: '', assignedAgency: 'SDRF', otherAgency: '', status: 'New' });

  useEffect(() => {
    refreshTasks();
  }, []);

  // Fetches the latest task list from the backend.
  async function refreshTasks() {
    try {
      setTasks(await fetchTasks());
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not load tasks');
    }
  }

  // Updates the local form field for task creation.
  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  // Creates a task card and refreshes the board.
  async function handleCreate(event) {
    event.preventDefault();
    setError('');
    try {
      await createTask({
        ...form,
        incidentId: Number(form.incidentId || 0),
        assignedAgency: form.assignedAgency === 'Other' ? form.otherAgency || 'Other' : form.assignedAgency
      });
      setForm({ incidentId: '', title: '', details: '', assignedAgency: 'SDRF', otherAgency: '', status: 'New' });
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
              {['SDRF', 'HPEB', 'Police', 'Fire Brigade', 'Other'].map((ag) => (
                <MenuItem key={ag} value={ag}>{ag}</MenuItem>
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
