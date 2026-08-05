import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Animated, Alert } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT, Polyline } from 'react-native-maps';
import { ActivityIndicator, useTheme, Chip, Text, FAB, IconButton, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { api } from '../api';

export default function MapScreen({ route }: any) {
  const theme = useTheme();
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [mapFeedType, setMapFeedType] = useState<'all' | 'local' | 'hpsdma'>('all');
  
  // Safe Zone Routing States
  const [userLocation, setUserLocation] = useState<any>(null);
  const [routeCoords, setRouteCoords] = useState<{latitude: number, longitude: number}[]>([]);
  const [routingLoading, setRoutingLoading] = useState(false);

  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    fetchIncidents();
    getUserLocation();
  }, []);

  useEffect(() => {
    if (route?.params?.focusedIncident && mapRef.current && incidents.length > 0) {
      const { lat, lon, id } = route.params.focusedIncident;
      if (lat && lon) {
        mapRef.current.animateToRegion({
          latitude: parseFloat(lat),
          longitude: parseFloat(lon),
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }, 1000);
        
        const target = incidents.find(i => i.id === id);
        if (target) setSelectedIncident(target);
      }
    }
  }, [route?.params?.focusedIncident, incidents]);

  const getUserLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;
    let loc = await Location.getCurrentPositionAsync({});
    setUserLocation(loc);
  };

  const fetchIncidents = async () => {
    try {
      // Fetch both local civilian reports and official HPSDMA alerts
      const [localRes, hpsdmaRes] = await Promise.all([
        api.get('/incidents'),
        api.get('/hpsdma/incidents')
      ]);

      const localData = Array.isArray(localRes.data) ? localRes.data : (localRes.data.data || localRes.data.incidents || []);
      const hpsdmaData = hpsdmaRes.data.incidents || hpsdmaRes.data.data || [];

      // Normalise field names:
      // Local incidents store longitude as `lng` (DB column name)
      // HPSDMA incidents already use `lon`
      // Normalise everything to `lon` so the map works for both sources.
      const normalise = (inc: any, source: 'local' | 'hpsdma') => ({
        ...inc,
        _source: source,
        lon: inc.lon ?? inc.lng ?? null,   // prefer `lon`, fallback to `lng`
      });

      const combined = [
        ...localData.map((i: any) => normalise(i, 'local')),
        ...hpsdmaData.map((i: any) => normalise(i, 'hpsdma')),
      ];

      // Only keep pins that have real coordinates
      const validPins = combined.filter(
        (i: any) => i.lat != null && i.lon != null && i.lat !== 0 && i.lon !== 0
      );
      setIncidents(validPins);
    } catch (error) {
      console.error('Failed to fetch map incidents', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSafeRoute = async () => {
    if (!userLocation || !selectedIncident) {
      Alert.alert('Error', 'Waiting for GPS location to load.');
      return;
    }
    setRoutingLoading(true);
    try {
      const uLon = userLocation.coords.longitude;
      const uLat = userLocation.coords.latitude;
      const iLon = parseFloat(selectedIncident.lon);
      const iLat = parseFloat(selectedIncident.lat);

      // OSRM Public API
      const url = `http://router.project-osrm.org/route/v1/driving/${uLon},${uLat};${iLon},${iLat}?overview=full&geometries=geojson`;
      const res = await fetch(url);
      const json = await res.json();

      if (json.routes && json.routes.length > 0) {
        const coords = json.routes[0].geometry.coordinates; // Array of [lon, lat]
        const formattedCoords = coords.map((c: any) => ({
          latitude: c[1],
          longitude: c[0]
        }));
        setRouteCoords(formattedCoords);
      } else {
        Alert.alert('Routing Failed', 'No valid road route found to this location.');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to connect to OSRM routing server.');
    } finally {
      setRoutingLoading(false);
    }
  };

  const distinctTypes = [...new Set(incidents.map(i => i.type || i.disasterType).filter(Boolean))].sort();

  const filteredIncidents = incidents.filter(inc => {
    if (mapFeedType !== 'all' && inc._source !== mapFeedType) return false;
    if (selectedType) {
      const type = inc.type || inc.disasterType || '';
      if (!type.toLowerCase().includes(selectedType.toLowerCase())) return false;
    }
    return true;
  });

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" animating={true} color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Dedicated Vertical Filter Sidebar on the Left */}
      {showFilters && (
        <View style={styles.sidebar}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            <Text style={{fontWeight:'bold', marginTop:5, marginBottom:8, fontSize: 12, marginLeft: 4, color: '#333'}}>Source Feed</Text>
            <Chip
              selected={mapFeedType === 'all'}
              onPress={() => setMapFeedType('all')}
              style={[styles.chip, mapFeedType === 'all' && { backgroundColor: theme.colors.primary }]}
              textStyle={{ color: mapFeedType === 'all' ? 'white' : 'black', fontWeight: mapFeedType === 'all' ? 'bold' : 'normal', fontSize: 11 }}
            >
              All Data
            </Chip>
            <Chip
              selected={mapFeedType === 'local'}
              onPress={() => setMapFeedType('local')}
              style={[styles.chip, mapFeedType === 'local' && { backgroundColor: theme.colors.primary }]}
              textStyle={{ color: mapFeedType === 'local' ? 'white' : 'black', fontWeight: mapFeedType === 'local' ? 'bold' : 'normal', fontSize: 11 }}
            >
              Local Reports
            </Chip>
            <Chip
              selected={mapFeedType === 'hpsdma'}
              onPress={() => setMapFeedType('hpsdma')}
              style={[styles.chip, mapFeedType === 'hpsdma' && { backgroundColor: theme.colors.primary }]}
              textStyle={{ color: mapFeedType === 'hpsdma' ? 'white' : 'black', fontWeight: mapFeedType === 'hpsdma' ? 'bold' : 'normal', fontSize: 11 }}
            >
              HPSDMA Only
            </Chip>
            
            <Divider style={{ marginVertical: 10 }} />
            
            <Text style={{fontWeight:'bold', marginBottom:8, fontSize: 12, marginLeft: 4, color: '#333'}}>Disaster Type</Text>
            <Chip
              selected={selectedType === ''}
              onPress={() => { setSelectedType(''); setShowFilters(false); }}
              style={[styles.chip, selectedType === '' && { backgroundColor: theme.colors.primary }]}
              textStyle={{ color: selectedType === '' ? 'white' : 'black', fontWeight: 'bold', fontSize: 11 }}
            >
              All Types
            </Chip>
            {distinctTypes.map((type: any, index) => (
              <Chip
                key={index}
                selected={selectedType === type}
                onPress={() => { setSelectedType(selectedType === type ? '' : type); setShowFilters(false); }}
                style={[styles.chip, selectedType === type && { backgroundColor: theme.colors.primary }]}
                textStyle={{ color: selectedType === type ? 'white' : 'black', fontSize: 11 }}
              >
                {type}
              </Chip>
            ))}
          </ScrollView>
          <Text style={styles.resultText}>{filteredIncidents.length} found</Text>
        </View>
      )}

      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_DEFAULT} // Uses standard Apple/Google maps
          style={styles.map}
          initialRegion={{
            // Focused on Himachal Pradesh
            latitude: 31.5,
            longitude: 77.2,
            latitudeDelta: 3.5,
            longitudeDelta: 3.5,
          }}
          onPress={() => { setSelectedIncident(null); setRouteCoords([]); }} // Click map to close popup
          showsUserLocation={true}
        >
          {filteredIncidents.map((incident, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: parseFloat(incident.lat),
                longitude: parseFloat(incident.lon),
              }}
              onPress={(e) => {
                e.stopPropagation();
                setSelectedIncident(incident);
                setRouteCoords([]);
              }}
              pinColor={incident.status?.toLowerCase() === 'active' ? theme.colors.error : theme.colors.primary}
            />
          ))}

          {routeCoords.length > 0 && (
            <Polyline
              coordinates={routeCoords}
              strokeColor={theme.colors.primary} // Green routing line
              strokeWidth={5}
            />
          )}
        </MapView>
        
        {/* Floating Action Button to toggle filters */}
        <FAB
          icon={showFilters ? "close" : "filter-variant"}
          style={[styles.fab, selectedIncident && { bottom: 200 }]} // Move up if popup is open
          onPress={() => setShowFilters(!showFilters)}
          color="white"
        />

        {/* Google Maps Style Bottom Popup */}
        {selectedIncident && (
          <View style={styles.bottomSheet}>
            <View style={styles.sheetHeader}>
              <View>
                <Text style={styles.sheetTitle}>{selectedIncident.type || selectedIncident.disasterType || 'Emergency Alert'}</Text>
                <Text style={styles.sheetSubtitle}>ID #{selectedIncident.id} • {selectedIncident.status || 'Active'}</Text>
              </View>
              <IconButton icon="close" size={20} onPress={() => { setSelectedIncident(null); setRouteCoords([]); }} />
            </View>
            <Divider style={{ marginVertical: 8 }} />
            
            <View style={styles.sheetRow}>
              <MaterialCommunityIcons name="map-marker" size={16} color="#666" />
              <Text style={styles.sheetText}>{selectedIncident.district}{selectedIncident.tehsil && selectedIncident.tehsil !== '-' ? `, ${selectedIncident.tehsil}` : ''}</Text>
            </View>
            
            <View style={styles.sheetRow}>
              <MaterialCommunityIcons name="calendar" size={16} color="#666" />
              <Text style={styles.sheetText}>{new Date(selectedIncident.date).toLocaleDateString()}</Text>
            </View>

            {(selectedIncident.humanLoss > 0 || selectedIncident.humanInjured > 0 || selectedIncident.humanMissing > 0) && (
              <View style={styles.casualtiesRow}>
                {selectedIncident.humanLoss > 0 && <Chip textStyle={styles.casualtyText} style={styles.casualtyChipRed}>💀 {selectedIncident.humanLoss} Deaths</Chip>}
                {selectedIncident.humanInjured > 0 && <Chip textStyle={styles.casualtyText} style={styles.casualtyChipOrange}>🤕 {selectedIncident.humanInjured} Injured</Chip>}
                {selectedIncident.humanMissing > 0 && <Chip textStyle={styles.casualtyText} style={styles.casualtyChipPurple}>❓ {selectedIncident.humanMissing} Missing</Chip>}
              </View>
            )}
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={fetchSafeRoute}
              disabled={routingLoading}
            >
              {routingLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.actionButtonText}>Get Safe Route (OSRM)</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f5f7fa',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sidebar: {
    width: 130,
    backgroundColor: '#ffffff',
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
    paddingVertical: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  filterScroll: {
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  chip: {
    marginBottom: 10,
    backgroundColor: '#f0f4f8',
    elevation: 0,
  },
  resultText: {
    alignSelf: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    fontSize: 11,
    fontWeight: 'bold',
    color: '#666',
    textAlign: 'center',
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#FF7900',
    borderRadius: 30,
    transition: 'bottom 0.3s',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  sheetSubtitle: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  sheetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sheetText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#444',
    fontWeight: '500',
  },
  casualtiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    gap: 8,
  },
  casualtyChipRed: { backgroundColor: '#fee2e2' },
  casualtyChipOrange: { backgroundColor: '#fef3c7' },
  casualtyChipPurple: { backgroundColor: '#f3e8ff' },
  casualtyText: { fontSize: 10, fontWeight: 'bold' },
  actionButton: {
    marginTop: 16,
    backgroundColor: '#0F172A',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
