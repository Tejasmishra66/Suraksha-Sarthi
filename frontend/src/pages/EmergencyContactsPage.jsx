import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent } from '@mui/material';
import ContactPhoneRoundedIcon from '@mui/icons-material/ContactPhoneRounded';
import LocalHospitalRoundedIcon from '@mui/icons-material/LocalHospitalRounded';
import LocalPoliceRoundedIcon from '@mui/icons-material/LocalPoliceRounded';
import FireTruckRoundedIcon from '@mui/icons-material/FireTruckRounded';

const CONTACTS = [
  { title: 'State Disaster Helpline', number: '1070', icon: <ContactPhoneRoundedIcon fontSize="large" sx={{ color: '#DC2626' }}/> },
  { title: 'National Emergency', number: '112', icon: <ContactPhoneRoundedIcon fontSize="large" sx={{ color: '#DC2626' }}/> },
  { title: 'Ambulance & Medical', number: '108', icon: <LocalHospitalRoundedIcon fontSize="large" sx={{ color: '#3B82F6' }}/> },
  { title: 'Police Department', number: '100', icon: <LocalPoliceRoundedIcon fontSize="large" sx={{ color: '#1D4ED8' }}/> },
  { title: 'Fire Services', number: '101', icon: <FireTruckRoundedIcon fontSize="large" sx={{ color: '#F97316' }}/> },
  { title: 'Women Helpline', number: '1091', icon: <ContactPhoneRoundedIcon fontSize="large" sx={{ color: '#8B5CF6' }}/> },
];

export default function EmergencyContactsPage() {
  return (
    <Box sx={{ py: 8, flexGrow: 1 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <ContactPhoneRoundedIcon sx={{ fontSize: 40, color: '#DC2626' }} />
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#0F172A', fontFamily: '"Outfit", sans-serif' }}>
            Emergency Contacts
          </Typography>
        </Box>
        <Typography sx={{ mb: 6, color: '#475569', fontSize: '1.1rem' }}>
          Important helpline numbers available 24/7 across Himachal Pradesh. In case of an emergency, please dial the relevant number immediately.
        </Typography>

        <Grid container spacing={3}>
          {CONTACTS.map((contact, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Card sx={{ height: '100%', borderRadius: 4, border: '1px solid #E2E8F0', boxShadow: 'none' }}>
                <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 2 }}>
                  <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {contact.icon}
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', mb: 0.5 }}>{contact.title}</Typography>
                    <Typography variant="h3" sx={{ fontWeight: 900, color: '#DC2626', fontFamily: '"Outfit", sans-serif' }}>{contact.number}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
