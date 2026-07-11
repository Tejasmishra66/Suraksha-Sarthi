import React, { useState, useEffect } from "react";
import { Box, Container, Grid, Paper, Stack, Typography, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, CircularProgress, Divider } from "@mui/material";
import { AddRounded as AddIcon, AssignmentRounded as TaskIcon, CheckCircleRounded as DoneIcon, HourglassTopRounded as PendingIcon, PlayArrowRounded as ActiveIcon, ArrowForwardRounded as MoveIcon, RefreshRounded as RefreshIcon, WarningRounded as WarningIcon } from "@mui/icons-material";
import { fetchTasks, createTask, updateTask, fetchIncidents } from "../api/client";

const AGENCIES = ["SDRF", "Police", "Medical", "Revenue", "PWD", "Utility", "NDRF"];
const COLUMNS = ["New", "In Progress", "Complete"];
const STATUS_CONFIG = {
  "New": { label: "Pending", color: "#f59e0b", bg: "#fffbeb", border: "#fde68a", headerBg: "#fef3c7", icon: null, next: "In Progress", nextLabel: "Start Task", nextColor: "#3b82f6" },
  "In Progress": { label: "In Progress", color: "#3b82f6", bg: "#eff6ff", border: "#bfdbfe", headerBg: "#dbeafe", icon: null, next: "Complete", nextLabel: "Mark Complete", nextColor: "#10b981" },
  "Complete": { label: "Completed", color: "#10b981", bg: "#f0fdf4", border: "#bbf7d0", headerBg: "#dcfce7", icon: null, next: null, nextLabel: null, nextColor: null },
};
const AGENCY_COLORS = { SDRF: { color: "#0f4a30", bg: "#e6f4ea" }, Police: { color: "#1e40af", bg: "#dbeafe" }, Medical: { color: "#7c3aed", bg: "#ede9fe" }, NDRF: { color: "#b45309", bg: "#fef3c7" }, Utility: { color: "#0369a1", bg: "#e0f2fe" }, PWD: { color: "#475569", bg: "#f1f5f9" }, Revenue: { color: "#be185d", bg: "#fce7f3" } };

export default function TaskBoardPage() {
  const [tasks, setTasks] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [movingId, setMovingId] = useState(null);
  const [form, setForm] = useState({ incidentId: "", title: "", details: "", assignedAgency: "SDRF", status: "New" });

  const load = async () => {
    setLoading(true);
    try { const [t, i] = await Promise.all([fetchTasks(), fetchIncidents()]); setTasks(Array.isArray(t) ? t : []); setIncidents(Array.isArray(i) ? i : []); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleMove = async (taskId, nextStatus) => {
    setMovingId(taskId);
    try { await updateTask(taskId, { status: nextStatus }); setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: nextStatus } : t)); }
    catch (e) { alert("Failed to update task."); } finally { setMovingId(null); }
  };

  const handleCreate = async () => {
    if (!form.title || !form.assignedAgency) { alert("Title and Agency are required."); return; }
    setSubmitting(true);
    try {
      await createTask({ incidentId: form.incidentId ? Number(form.incidentId) : undefined, title: form.title, details: form.details, assignedAgency: form.assignedAgency, notificationAgencies: [form.assignedAgency], status: form.status });
      setForm({ incidentId: "", title: "", details: "", assignedAgency: "SDRF", status: "New" });
      setAddOpen(false); await load();
    } catch (e) { alert("Failed to create task: " + (e?.response?.data?.message || e.message)); } finally { setSubmitting(false); }
  };

  const getByStatus = (s) => tasks.filter(t => t.status === s);
  const stats = { total: tasks.length, pending: getByStatus("New").length, active: getByStatus("In Progress").length, done: getByStatus("Complete").length };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f1f5f9", fontFamily: "'Inter', sans-serif" }}>
      <Box sx={{ background: "linear-gradient(135deg, #0f4a30 0%, #1a6b47 60%, #0d3d27 100%)", pt: 8, pb: 6, px: { xs: 2, md: 6 } }}>
        <Container maxWidth="xl">
          <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "center" }} spacing={2}>
            <Box>
              <Typography variant="h4" fontWeight={900} color="#fff" mb={0.5}>Task Management Board</Typography>
              <Typography variant="body2" color="rgba(255,255,255,0.7)">Track all disaster response tasks in real-time</Typography>
            </Box>
            <Stack direction="row" spacing={2}>
              <Button variant="outlined" startIcon={<RefreshIcon />} onClick={load} sx={{ color: "#fff", borderColor: "rgba(255,255,255,0.4)", fontWeight: 700, "&:hover": { borderColor: "#fff", bgcolor: "rgba(255,255,255,0.1)" } }}>Refresh</Button>
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => setAddOpen(true)} sx={{ bgcolor: "#fff", color: "#0f4a30", fontWeight: 800, "&:hover": { bgcolor: "#f0fdf4" } }}>Create Task</Button>
            </Stack>
          </Stack>
          <Grid container spacing={2} mt={3}>
            {[{ label: "Total Tasks", value: stats.total, color: "#fff" }, { label: "Pending", value: stats.pending, color: "#fbbf24" }, { label: "In Progress", value: stats.active, color: "#60a5fa" }, { label: "Completed", value: stats.done, color: "#34d399" }].map((s, i) => (
              <Grid item xs={6} md={3} key={i}>
                <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, bgcolor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}>
                  <Typography variant="h3" fontWeight={900} color={s.color} lineHeight={1}>{s.value}</Typography>
                  <Typography variant="caption" color="rgba(255,255,255,0.6)" fontWeight={600}>{s.label}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {loading ? (<Box textAlign="center" py={10}><CircularProgress sx={{ color: "#0f4a30" }} /></Box>) : (
          <Grid container spacing={3} alignItems="flex-start">
            {COLUMNS.map((status) => {
              const cfg = STATUS_CONFIG[status];
              const col = getByStatus(status);
              return (
                <Grid item xs={12} md={4} key={status}>
                  <Paper elevation={0} sx={{ borderRadius: 3, overflow: "hidden", border: `1px solid ${cfg.border}` }}>
                    <Box sx={{ px: 3, py: 2, bgcolor: cfg.headerBg, borderBottom: `1px solid ${cfg.border}` }}>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography variant="subtitle1" fontWeight={800} color="#0f172a">{cfg.label}</Typography>
                        <Chip label={col.length} size="small" sx={{ bgcolor: cfg.color, color: "#fff", fontWeight: 800, minWidth: 28 }} />
                      </Stack>
                    </Box>
                    <Box sx={{ p: 2, minHeight: 180, bgcolor: "#f8fafc" }}>
                      {col.length === 0 ? (
                        <Box textAlign="center" py={5}><TaskIcon sx={{ fontSize: 36, color: "#cbd5e1", mb: 1 }} /><Typography variant="body2" color="#94a3b8" fontWeight={600}>No tasks</Typography></Box>
                      ) : (
                        <Stack spacing={2}>
                          {col.map(task => {
                            const ag = AGENCY_COLORS[task.assigned_agency] || { color: "#475569", bg: "#f1f5f9" };
                            const isMoving = movingId === task.id;
                            return (
                              <Paper key={task.id} elevation={0} sx={{ p: 2.5, borderRadius: 2.5, border: `1px solid ${cfg.border}`, bgcolor: "#fff", opacity: isMoving ? 0.6 : 1, transition: "all 0.2s", "&:hover": { boxShadow: "0 4px 16px rgba(0,0,0,0.08)", transform: "translateY(-1px)" } }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
                                  <Typography variant="caption" color="#94a3b8" fontWeight={700}>TASK-{task.id}</Typography>
                                  <Chip label={task.assigned_agency} size="small" sx={{ bgcolor: ag.bg, color: ag.color, fontWeight: 700, fontSize: "0.65rem", height: 22 }} />
                                </Stack>
                                <Typography variant="subtitle2" fontWeight={800} color="#0f172a" mb={1} lineHeight={1.4}>{task.title}</Typography>
                                {task.details && <Typography variant="caption" color="#64748b" display="block" mb={1.5} lineHeight={1.5}>{task.details}</Typography>}
                                {task.incident_title && (
                                  <Box sx={{ px: 1.5, py: 0.75, bgcolor: "#fef2f2", borderRadius: 1.5, mb: 1.5, display: "flex", alignItems: "center", gap: 0.5 }}>
                                    <WarningIcon sx={{ fontSize: 12, color: "#ef4444" }} />
                                    <Typography variant="caption" color="#ef4444" fontWeight={700} noWrap>{task.incident_title}</Typography>
                                  </Box>
                                )}
                                <Divider sx={{ my: 1.5 }} />
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                  <Typography variant="caption" color="#94a3b8">{new Date(task.created_at).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</Typography>
                                  {cfg.next ? (
                                    <Button size="small" variant="contained" disabled={isMoving} onClick={() => handleMove(task.id, cfg.next)}
                                      startIcon={isMoving ? <CircularProgress size={12} color="inherit" /> : <MoveIcon />}
                                      sx={{ fontSize: "0.65rem", fontWeight: 700, height: 26, bgcolor: cfg.nextColor, color: "#fff", borderRadius: 1.5, px: 1.5, "&:hover": { filter: "brightness(0.9)" } }}>
                                      {cfg.nextLabel}
                                    </Button>
                                  ) : (
                                    <Chip label="Done" size="small" sx={{ bgcolor: "#dcfce7", color: "#16a34a", fontWeight: 800, fontSize: "0.65rem", height: 22 }} />
                                  )}
                                </Stack>
                              </Paper>
                            );
                          })}
                        </Stack>
                      )}
                    </Box>
                    <Box sx={{ px: 2, py: 1.5, borderTop: `1px solid ${cfg.border}` }}>
                      <Button fullWidth size="small" startIcon={<AddIcon />} onClick={() => { setForm(f => ({ ...f, status })); setAddOpen(true); }} sx={{ color: cfg.color, fontWeight: 700, fontSize: "0.75rem", justifyContent: "flex-start" }}>Add task here</Button>
                    </Box>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>

      <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 800, color: "#0f172a", pb: 1 }}>Create New Task</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3} pt={1}>
            <TextField label="Task Title *" placeholder="e.g. Deploy rescue boats to Kullu" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} fullWidth size="small" />
            <TextField label="Task Details" placeholder="Describe what needs to be done..." value={form.details} onChange={e => setForm({ ...form, details: e.target.value })} fullWidth size="small" multiline rows={3} />
            <FormControl fullWidth size="small">
              <InputLabel>Linked Incident</InputLabel>
              <Select label="Linked Incident" value={form.incidentId} onChange={e => setForm({ ...form, incidentId: e.target.value })}>
                <MenuItem value="">None</MenuItem>
                {incidents.map(i => (<MenuItem key={i.id} value={i.id}>{i.disaster_type} — {(i.title || "").substring(0, 45)}</MenuItem>))}
              </Select>
            </FormControl>
            <FormControl fullWidth size="small">
              <InputLabel>Assign to Agency *</InputLabel>
              <Select label="Assign to Agency *" value={form.assignedAgency} onChange={e => setForm({ ...form, assignedAgency: e.target.value })}>
                {AGENCIES.map(a => <MenuItem key={a} value={a}>{a}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl fullWidth size="small">
              <InputLabel>Initial Status</InputLabel>
              <Select label="Initial Status" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <MenuItem value="New">Pending</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button onClick={() => setAddOpen(false)} sx={{ color: "#64748b", fontWeight: 700 }}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate} disabled={submitting} startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : <AddIcon />}
            sx={{ bgcolor: "#0f4a30", color: "#fff", fontWeight: 700, borderRadius: 2, px: 3, "&:hover": { bgcolor: "#0a3622" } }}>
            {submitting ? "Creating..." : "Create Task"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
