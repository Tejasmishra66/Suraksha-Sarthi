import React from 'react';
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';

import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import WaterDropRoundedIcon from '@mui/icons-material/WaterDropRounded';
import LocalHospitalRoundedIcon from '@mui/icons-material/LocalHospitalRounded';
import SyncRoundedIcon from '@mui/icons-material/SyncRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CrisisAlertRoundedIcon from '@mui/icons-material/CrisisAlertRounded';

export default function HomePage() {
  const stats = [
    {
      title: 'Active Alerts',
      value: 12,
      icon: <WarningAmberRoundedIcon sx={{ fontSize: 42 }} />,
      color: '#ef4444',
    },
    {
      title: 'Rescue Tasks',
      value: 28,
      icon: <AssignmentRoundedIcon sx={{ fontSize: 42 }} />,
      color: '#3b82f6',
    },
    {
      title: 'Volunteers',
      value: 145,
      icon: <GroupsRoundedIcon sx={{ fontSize: 42 }} />,
      color: '#10b981',
    },
    {
      title: 'Medical Requests',
      value: 19,
      icon: <LocalHospitalRoundedIcon sx={{ fontSize: 42 }} />,
      color: '#f59e0b',
    },
  ];

  const alerts = [
    {
      title: 'Flood Warning',
      location: 'Mandi District',
      level: 'High',
    },
    {
      title: 'Landslide Risk',
      location: 'Kamand Valley',
      level: 'Medium',
    },
    {
      title: 'Heavy Rainfall',
      location: 'Kullu Region',
      level: 'Critical',
    },
  ];

  const tasks = [
    {
      title: 'Flood Rescue Operation',
      team: 'Alpha Team',
      status: 'Ongoing',
    },
    {
      title: 'Medical Camp Setup',
      team: 'Bravo Team',
      status: 'Completed',
    },
    {
      title: 'Evacuation Support',
      team: 'Charlie Team',
      status: 'Pending',
    },
  ];

  const volunteers = [
    {
      name: 'Rohit Sharma',
      role: 'Medical Volunteer',
    },
    {
      name: 'Priya Verma',
      role: 'Rescue Support',
    },
    {
      name: 'Aman Singh',
      role: 'Field Coordinator',
    },
  ];

  return (
    <Box sx={{ background: '#f4f7fb', minHeight: '100vh' }}>

      {/* NAVBAR */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: 'white',
          borderBottom: '1px solid #e5e7eb',
          color: '#111827',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>

          <Box>
            <Typography variant="h5" fontWeight={900}>
              SDRF Helping Hands
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Disaster Management Dashboard
            </Typography>
          </Box>

          <Stack direction="row" spacing={2} alignItems="center">

            <Button color="inherit">HOME</Button>
            <Button color="inherit">TASKS</Button>
            <Button color="inherit">BULLETINS</Button>
            <Button color="inherit">INTEL</Button>
            <Button color="inherit">STATUS</Button>
            <Button color="inherit">ALERTS</Button>
            <Button color="inherit">VOLUNTEERS</Button>

            <IconButton>
              <Badge badgeContent={4} color="error">
                <NotificationsActiveRoundedIcon />
              </Badge>
            </IconButton>

            <Button
              variant="contained"
              startIcon={<SyncRoundedIcon />}
              sx={{
                borderRadius: 3,
                textTransform: 'none',
              }}
            >
              Sync
            </Button>

            <Button
              variant="outlined"
              color="error"
              startIcon={<LogoutRoundedIcon />}
              sx={{
                borderRadius: 3,
                textTransform: 'none',
              }}
            >
              Logout
            </Button>

          </Stack>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>

        {/* HERO SECTION */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 6,
            overflow: 'hidden',
            mb: 4,
            background:
              'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
            color: 'white',
            p: 5,
          }}
        >
          <Grid container spacing={4} alignItems="center">

            <Grid item xs={12} md={8}>

              <Chip
                label="LIVE DISASTER RESPONSE SYSTEM"
                sx={{
                  mb: 2,
                  background: 'rgba(255,255,255,0.15)',
                  color: 'white',
                  fontWeight: 700,
                }}
              />

              <Typography
                variant="h2"
                fontWeight={900}
                sx={{
                  lineHeight: 1.1,
                  mb: 2,
                }}
              >
                SDRF Officer Dashboard
              </Typography>

              <Typography
                sx={{
                  fontSize: '1.1rem',
                  opacity: 0.8,
                  maxWidth: 700,
                  mb: 4,
                }}
              >
                Monitor alerts, coordinate rescue operations,
                manage volunteers, and track disaster response
                activities in real time.
              </Typography>

              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  color="error"
                  size="large"
                  sx={{
                    borderRadius: 3,
                    px: 4,
                    textTransform: 'none',
                    fontWeight: 700,
                  }}
                >
                  Create Emergency Alert
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    borderRadius: 3,
                    px: 4,
                    textTransform: 'none',
                    borderColor: 'white',
                    color: 'white',
                  }}
                >
                  Open Operations Map
                </Button>
              </Stack>

            </Grid>

            <Grid item xs={12} md={4}>

              <Card
                sx={{
                  borderRadius: 5,
                  background: 'rgba(255,255,255,0.12)',
                  backdropFilter: 'blur(12px)',
                  color: 'white',
                }}
              >
                <CardContent>

                  <Stack spacing={3}>

                    <Box>
                      <Typography variant="body2" sx={{ opacity: 0.7 }}>
                        Emergency Status
                      </Typography>

                      <Typography variant="h4" fontWeight={900}>
                        ACTIVE
                      </Typography>
                    </Box>

                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.15)' }} />

                    <Grid container spacing={2}>

                      <Grid item xs={6}>
                        <Typography variant="body2" sx={{ opacity: 0.7 }}>
                          Rainfall
                        </Typography>

                        <Typography variant="h5" fontWeight={800}>
                          18 mm
                        </Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography variant="body2" sx={{ opacity: 0.7 }}>
                          Humidity
                        </Typography>

                        <Typography variant="h5" fontWeight={800}>
                          78%
                        </Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography variant="body2" sx={{ opacity: 0.7 }}>
                          Wind
                        </Typography>

                        <Typography variant="h5" fontWeight={800}>
                          12 km/h
                        </Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography variant="body2" sx={{ opacity: 0.7 }}>
                          Temperature
                        </Typography>

                        <Typography variant="h5" fontWeight={800}>
                          24°C
                        </Typography>
                      </Grid>

                    </Grid>

                  </Stack>

                </CardContent>
              </Card>

            </Grid>

          </Grid>
        </Paper>

        {/* STATS */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item.title}>
              <Card
                sx={{
                  borderRadius: 5,
                  boxShadow: '0 8px 24px rgba(15,23,42,0.06)',
                }}
              >
                <CardContent>

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >

                    <Box>

                      <Typography color="text.secondary">
                        {item.title}
                      </Typography>

                      <Typography
                        variant="h3"
                        fontWeight={900}
                        sx={{ mt: 1 }}
                      >
                        {item.value}
                      </Typography>

                    </Box>

                    <Box sx={{ color: item.color }}>
                      {item.icon}
                    </Box>

                  </Stack>

                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* MAIN GRID */}
        <Grid container spacing={3}>

          {/* ALERTS */}
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 5, height: '100%' }}>
              <CardContent>

                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  mb={3}
                >
                  <CrisisAlertRoundedIcon color="error" />

                  <Typography variant="h5" fontWeight={800}>
                    Live Alerts
                  </Typography>
                </Stack>

                <Stack spacing={2}>

                  {alerts.map((alert, index) => (
                    <Paper
                      key={index}
                      sx={{
                        p: 2,
                        borderRadius: 4,
                        borderLeft: '6px solid #ef4444',
                        background: '#fff7f7',
                      }}
                    >

                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >

                        <Box>

                          <Typography fontWeight={800}>
                            {alert.title}
                          </Typography>

                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            mt={1}
                          >
                            <PlaceRoundedIcon
                              sx={{
                                fontSize: 18,
                                color: '#6b7280',
                              }}
                            />

                            <Typography color="text.secondary">
                              {alert.location}
                            </Typography>
                          </Stack>

                        </Box>

                        <Chip
                          label={alert.level}
                          color="error"
                        />

                      </Stack>

                    </Paper>
                  ))}

                </Stack>

              </CardContent>
            </Card>
          </Grid>

          {/* TASKS */}
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 5, height: '100%' }}>
              <CardContent>

                <Typography
                  variant="h5"
                  fontWeight={800}
                  mb={3}
                >
                  Rescue Operations
                </Typography>

                <Stack spacing={3}>

                  {tasks.map((task, index) => (
                    <Paper
                      key={index}
                      sx={{
                        p: 2,
                        borderRadius: 4,
                        background: '#f8fafc',
                      }}
                    >

                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >

                        <Box>

                          <Typography fontWeight={800}>
                            {task.title}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            Assigned to {task.team}
                          </Typography>

                        </Box>

                        <Chip
                          label={task.status}
                          color={
                            task.status === 'Completed'
                              ? 'success'
                              : task.status === 'Pending'
                              ? 'warning'
                              : 'primary'
                          }
                        />

                      </Stack>

                      <LinearProgress
                        variant="determinate"
                        value={
                          task.status === 'Completed'
                            ? 100
                            : task.status === 'Pending'
                            ? 30
                            : 70
                        }
                        sx={{
                          mt: 2,
                          height: 8,
                          borderRadius: 10,
                        }}
                      />

                    </Paper>
                  ))}

                </Stack>

              </CardContent>
            </Card>
          </Grid>

          {/* VOLUNTEERS */}
          <Grid item xs={12} md={7}>
            <Card sx={{ borderRadius: 5 }}>
              <CardContent>

                <Typography
                  variant="h5"
                  fontWeight={800}
                  mb={3}
                >
                  Active Volunteers
                </Typography>

                <List>

                  {volunteers.map((volunteer, index) => (
                    <ListItem
                      key={index}
                      divider={index !== volunteers.length - 1}
                    >

                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: '#1e3a8a' }}>
                          {volunteer.name[0]}
                        </Avatar>
                      </ListItemAvatar>

                      <ListItemText
                        primary={volunteer.name}
                        secondary={volunteer.role}
                      />

                      <Chip
                        icon={<CheckCircleRoundedIcon />}
                        label="Available"
                        color="success"
                      />

                    </ListItem>
                  ))}

                </List>

              </CardContent>
            </Card>
          </Grid>

          {/* MAP + CONTACT */}
          <Grid item xs={12} md={5}>
            <Stack spacing={3}>

              <Card sx={{ borderRadius: 5 }}>
                <CardContent>

                  <Typography
                    variant="h5"
                    fontWeight={800}
                    mb={2}
                  >
                    Operations Map
                  </Typography>

                  <Box
                    sx={{
                      height: 220,
                      borderRadius: 4,
                      background:
                        'linear-gradient(135deg,#dbeafe,#bfdbfe)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >

                    <Typography
                      variant="h6"
                      fontWeight={700}
                      color="#1e3a8a"
                    >
                      Map Integration Area
                    </Typography>

                  </Box>

                </CardContent>
              </Card>

              <Card sx={{ borderRadius: 5 }}>
                <CardContent>

                  <Typography
                    variant="h5"
                    fontWeight={800}
                    mb={2}
                  >
                    Emergency Contacts
                  </Typography>

                  <Stack spacing={2}>

                    <Paper sx={{ p: 2, borderRadius: 3 }}>
                      <Typography fontWeight={700}>
                        Police
                      </Typography>

                      <Typography>100</Typography>
                    </Paper>

                    <Paper sx={{ p: 2, borderRadius: 3 }}>
                      <Typography fontWeight={700}>
                        Ambulance
                      </Typography>

                      <Typography>108</Typography>
                    </Paper>

                    <Paper sx={{ p: 2, borderRadius: 3 }}>
                      <Typography fontWeight={700}>
                        Fire Brigade
                      </Typography>

                      <Typography>101</Typography>
                    </Paper>

                  </Stack>

                </CardContent>
              </Card>

            </Stack>
          </Grid>

        </Grid>

      </Container>
    </Box>
  );
}