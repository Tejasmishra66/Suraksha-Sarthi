import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, useTheme, Surface, Title, Text, SegmentedButtons } from 'react-native-paper';
import * as SecureStore from 'expo-secure-store';
import * as Location from 'expo-location';
import { api } from '../api';

export default function ReportEmergencyScreen({ navigation }: any) {
  const theme = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [disasterType, setDisasterType] = useState('Flood');
  const [gpsLocation, setGpsLocation] = useState('');
  const [manualLocation, setManualLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [locationObj, setLocationObj] = useState<any>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'GPS location is required unless you provide a manual location.');
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocationObj(loc);
      setGpsLocation(`Lat: ${loc.coords.latitude.toFixed(4)}, Lon: ${loc.coords.longitude.toFixed(4)}`);
    })();
  }, []);

  const handleSubmit = async () => {
    if (!title || !description) {
      Alert.alert('Error', 'Please fill out the title and description.');
      return;
    }

    if (!gpsLocation && !manualLocation) {
      Alert.alert('Location Required', 'Please either allow GPS access or manually type your location.');
      return;
    }

    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync('jwt');
      const payload = {
        title,
        description,
        disasterType,
        status: 'active',
        lat: locationObj?.coords?.latitude || null,
        lon: locationObj?.coords?.longitude || null,
        address: manualLocation || gpsLocation,
      };

      await api.post('/incidents', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      Alert.alert('Success', 'Emergency reported successfully. The Control Room has been notified.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error: any) {
      Alert.alert('Submission Failed', error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container}>
        <Surface style={styles.surface} elevation={1}>
          <Title style={{ color: theme.colors.primary, marginBottom: 5, fontSize: 24, fontWeight: '900' }}>
            Report Incident
          </Title>
          <Text style={{ color: '#666', marginBottom: 20 }}>
            Submit an official field report to the SDRF control room.
          </Text>
          
          <Text style={styles.label}>Disaster Type</Text>
          <SegmentedButtons
            value={disasterType}
            onValueChange={setDisasterType}
            style={{ marginBottom: 20 }}
            buttons={[
              { value: 'Flood', label: 'Flood' },
              { value: 'Landslide', label: 'Landslide' },
              { value: 'Earthquake', label: 'Earthquake' },
            ]}
          />

          <TextInput
            mode="outlined"
            label="Incident Title"
            placeholder="e.g. Flooding in Sector 4"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
            left={<TextInput.Icon icon="alert-circle" />}
          />
          
          <TextInput
            mode="outlined"
            label="Situation Report (SITREP)"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={5}
            style={styles.input}
          />

          <TextInput
            mode="outlined"
            label="GPS Location (Auto-Fetched)"
            value={gpsLocation}
            placeholder="Fetching GPS..."
            style={styles.input}
            left={<TextInput.Icon icon="satellite-variant" color={theme.colors.error} />}
            disabled
          />

          <TextInput
            mode="outlined"
            label="Manual Location / Landmarks (Optional)"
            value={manualLocation}
            onChangeText={setManualLocation}
            placeholder="e.g. NH-21 Highway near Kullu bridge"
            style={styles.input}
            left={<TextInput.Icon icon="map-marker-radius" color={theme.colors.error} />}
          />

          <Button
            mode="contained"
            buttonColor={theme.colors.secondary}
            icon="send"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={styles.btn}
            contentStyle={{ paddingVertical: 10 }}
            labelStyle={{ fontWeight: '900', letterSpacing: 1 }}
          >
            SUBMIT EMERGENCY
          </Button>
        </Surface>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA', padding: 16 },
  surface: { padding: 24, borderRadius: 16, backgroundColor: 'white', marginTop: 10, marginBottom: 30, borderWidth: 1, borderColor: '#E2E8F0' },
  label: { fontSize: 13, fontWeight: '800', color: '#3E5060', marginBottom: 8, marginLeft: 2, textTransform: 'uppercase' },
  input: { marginBottom: 18, backgroundColor: '#F8FAFC' },
  btn: { marginTop: 10, borderRadius: 8 },
});
