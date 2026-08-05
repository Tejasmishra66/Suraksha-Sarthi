import React from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { Text, Button, Surface, useTheme, TouchableRipple } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function HomepageScreen({ navigation }: any) {
  const theme = useTheme();

  const PublicCard = ({ icon, title, description, route, color }: any) => (
    <TouchableRipple
      onPress={() => navigation.navigate(route)}
      rippleColor="rgba(0, 0, 0, .1)"
      style={styles.cardRipple}
    >
      <Surface style={styles.card} elevation={2}>
        <View style={[styles.iconBox, { backgroundColor: color + '20' }]}>
          <MaterialCommunityIcons name={icon} size={32} color={color} />
        </View>
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardDesc}>{description}</Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={24} color="#ccc" />
      </Surface>
    </TouchableRipple>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        
        {/* Public Hero Section */}
        <LinearGradient colors={['#0f4a30', '#1c6f4a']} style={styles.hero}>
          <MaterialCommunityIcons name="shield-check" size={60} color="white" style={{ marginBottom: 10 }} />
          <Text style={styles.heroTitle}>Suraksha Sarthi</Text>
          <Text style={styles.heroSubtitle}>Public Disaster Management Portal</Text>
        </LinearGradient>

        <View style={styles.content}>
          {/* Big SOS Button */}
          <Surface style={styles.sosContainer} elevation={4}>
            <Text style={styles.sosTitle}>Are you in danger?</Text>
            <Text style={styles.sosDesc}>Instantly alert SDRF control rooms with your live GPS location.</Text>
            <Button 
              mode="contained" 
              buttonColor={theme.colors.error}
              icon="alert-octagon"
              onPress={() => navigation.navigate('ReportEmergency')}
              style={styles.sosBtn}
              contentStyle={{ paddingVertical: 12 }}
              labelStyle={{ fontSize: 18, fontWeight: 'bold' }}
            >
              REPORT EMERGENCY
            </Button>
          </Surface>

          <Text style={styles.sectionTitle}>Public Resources</Text>

          <PublicCard 
            icon="map-marker-radius" 
            title="Live Incident Map" 
            description="View real-time disaster locations" 
            route="Map" 
            color="#1976d2" 
          />
          <PublicCard 
            icon="newspaper" 
            title="SDRF Bulletins" 
            description="Official news and critical updates" 
            route="Updates" 
            color="#e65100" 
          />
          <PublicCard 
            icon="book-open-variant" 
            title="Survival Guides" 
            description="Do's and Don'ts for emergencies" 
            route="Guides" 
            color="#388e3c" 
          />
          
        </View>
      </ScrollView>

      {/* Officer Login Fixed at Bottom */}
      <View style={styles.footer}>
        <Button 
          mode="text" 
          textColor={theme.colors.primary} 
          icon="shield-account"
          onPress={() => navigation.navigate('Login')}
        >
          SDRF Officer Login
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa' },
  scroll: { paddingBottom: 80 },
  hero: {
    padding: 30,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    alignItems: 'center',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: 'white',
    letterSpacing: 1,
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 5,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  content: {
    padding: 20,
    marginTop: -20,
  },
  sosContainer: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 30,
  },
  sosTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginBottom: 8,
  },
  sosDesc: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
    fontSize: 14,
    lineHeight: 20,
  },
  sosBtn: {
    width: '100%',
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#888',
    textTransform: 'uppercase',
    marginBottom: 15,
    marginLeft: 5,
  },
  cardRipple: {
    borderRadius: 16,
    marginBottom: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 17, fontWeight: 'bold', color: '#333' },
  cardDesc: { fontSize: 13, color: '#777', marginTop: 4 },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
  }
});
