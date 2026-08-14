import React, { useState, useEffect, useRef } from 'react';
import {
  View, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform,
  TouchableOpacity, StatusBar, TextInput as RNTextInput,
} from 'react-native';
import { TextInput, Button, useTheme, Surface, Text, ActivityIndicator } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import * as Location from 'expo-location';
import { useTranslation } from 'react-i18next';
import { api } from '../api';
import { addToOfflineQueue } from '../utils/offlineQueue';
import OfflineQueueBanner from '../components/OfflineQueueBanner';

const GOV_BLUE   = '#003087';
const GOV_RED    = '#CC0000';
const GOV_ORANGE = '#FF6600';
const GOV_GREEN  = '#007A3D';

const DISASTER_OPTIONS = [
  { id: 'Flood',             label: 'Flood',             labelHi: 'बाढ़',              icon: 'waves',             color: '#2563EB', bg: '#EFF6FF' },
  { id: 'Landslide',         label: 'Landslide',         labelHi: 'भूस्खलन',           icon: 'terrain',           color: '#D97706', bg: '#FFFBEB' },
  { id: 'Earthquake',        label: 'Earthquake',        labelHi: 'भूकंप',             icon: 'pulse',             color: '#7C3AED', bg: '#F5F3FF' },
  { id: 'Forest Fire',       label: 'Forest Fire',       labelHi: 'वनाग्नि / आग',       icon: 'fire',              color: '#DC2626', bg: '#FEF2F2' },
  { id: 'Cloudburst',        label: 'Cloudburst',        labelHi: 'बादल फटना',         icon: 'weather-lightning-rainy', color: '#0284C7', bg: '#F0F9FF' },
  { id: 'Avalanche',         label: 'Avalanche',         labelHi: 'हिमस्खलन',          icon: 'snowflake',         color: '#0891B2', bg: '#ECFEFF' },
  { id: 'Road Accident',     label: 'Road Accident',     labelHi: 'सड़क दुर्घटना',      icon: 'car-emergency',     color: '#E11D48', bg: '#FFF1F2' },
  { id: 'Building Collapse', label: 'Building Collapse', labelHi: 'भवन गिरना',         icon: 'home-alert',        color: '#B45309', bg: '#FEF3C7' },
  { id: 'Others',            label: 'Others',            labelHi: 'अन्य दुर्घटना',      icon: 'square-edit-outline', color: '#475569', bg: '#F1F5F9' },
];

export default function ReportEmergencyScreen({ navigation }: any) {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const customInputRef = useRef<any>(null);
  const manualLocationRef = useRef<any>(null);

  const [disasterType, setDisasterType]     = useState('Flood');
  const [customDisaster, setCustomDisaster] = useState('');
  const [reporterPhone, setReporterPhone]   = useState('');
  const [title, setTitle]                   = useState('');
  const [description, setDescription]       = useState('');
  const [gpsLocation, setGpsLocation]       = useState('');
  const [manualLocation, setManualLocation] = useState('');
  const [loading, setLoading]               = useState(false);
  const [locationObj, setLocationObj]       = useState<any>(null);
  const [fetchingGps, setFetchingGps]       = useState(true);
  const [locationError, setLocationError]   = useState(false);

  useEffect(() => {
    loadUserPhone();
    fetchGps();
  }, []);

  const loadUserPhone = async () => {
    try {
      const phone = await SecureStore.getItemAsync('userPhone');
      if (phone) setReporterPhone(phone);
    } catch {}
  };

  const fetchGps = async () => {
    setFetchingGps(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setGpsLocation('');
        setFetchingGps(false);
        return;
      }
      let loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setLocationObj(loc);
      setGpsLocation(`Lat: ${loc.coords.latitude.toFixed(4)}, Lon: ${loc.coords.longitude.toFixed(4)}`);
      setLocationError(false);
    } catch {
      setGpsLocation('');
    } finally {
      setFetchingGps(false);
    }
  };

  const handleSelectDisaster = (id: string) => {
    setDisasterType(id);
    if (id === 'Others') {
      setTimeout(() => {
        customInputRef.current?.focus();
      }, 100);
    }
  };

  const hasValidGps = !!(
    locationObj &&
    locationObj.coords &&
    typeof locationObj.coords.latitude === 'number' &&
    typeof locationObj.coords.longitude === 'number'
  );

  const hasManualLoc = !!(manualLocation && manualLocation.trim().length >= 3);

  const validate = (): boolean => {
    if (disasterType === 'Others' && !customDisaster.trim()) {
      Alert.alert(t('error', 'Required'), 'Please specify the custom incident type in the text box.');
      return false;
    }
    if (!reporterPhone.trim() || reporterPhone.replace(/\D/g, '').length < 10) {
      Alert.alert(t('error', 'Required'), 'Please enter a valid 10-digit mobile number for SDRF callback.');
      return false;
    }
    if (!title.trim()) {
      Alert.alert(t('error', 'Required'), 'Please enter an incident title.');
      return false;
    }
    if (!description.trim()) {
      Alert.alert(t('error', 'Required'), 'Please enter a situation description (SITREP).');
      return false;
    }

    // STRICT LOCATION VALIDATION: Must have valid GPS coords OR typed landmark location!
    if (!hasValidGps && !hasManualLoc) {
      setLocationError(true);
      Alert.alert(
        '📍 Location Information Mandatory!',
        'SDRF Control Room cannot dispatch rescue teams without a location. Please allow GPS access or type your Landmark / Village / Highway location below.',
        [
          {
            text: 'Type Location Now',
            onPress: () => manualLocationRef.current?.focus(),
          },
        ]
      );
      return false;
    }

    setLocationError(false);
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const finalDisasterType = disasterType === 'Others'
        ? `Others: ${customDisaster.trim()}`
        : disasterType;

      const finalAddress = manualLocation.trim() || (hasValidGps ? gpsLocation : '');

      const payload = {
        title: title.trim(),
        description: description.trim(),
        disasterType: finalDisasterType,
        reporterPhone: reporterPhone.trim(),
        phone: reporterPhone.trim(),
        status: 'active',
        lat: locationObj?.coords?.latitude || null,
        lon: locationObj?.coords?.longitude || null,
        address: finalAddress,
      };

      const token = await SecureStore.getItemAsync('jwt');
      await api.post('/incidents', payload, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        timeout: 3500, // 3.5s timeout for fast 2G low-bandwidth detection
      });

      Alert.alert(
        '🚨 Emergency Reported!',
        'Your incident report has been dispatched to HP SDRF Control Room. An officer will call your mobile number shortly.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error: any) {
      // OFFLINE / LOW-BANDWIDTH FALLBACK: Save to device offline queue!
      const count = await addToOfflineQueue({
        title: title.trim(),
        description: description.trim(),
        disasterType: disasterType === 'Others' ? `Others: ${customDisaster.trim()}` : disasterType,
        reporterPhone: reporterPhone.trim(),
        phone: reporterPhone.trim(),
        lat: locationObj?.coords?.latitude || null,
        lon: locationObj?.coords?.longitude || null,
        address: manualLocation.trim() || (hasValidGps ? gpsLocation : ''),
        status: 'active',
      });

      Alert.alert(
        '📱 Saved to Offline Emergency Queue!',
        `No network signal detected. Your emergency report has been saved safely on your device (${count} queued).\n\nIt will auto-sync to SDRF Control Room as soon as a 2G / 3G signal bar appears!`,
        [{ text: 'OK, Got It', onPress: () => navigation.goBack() }]
      );
    } finally {
      setLoading(false);
    }
  };

  const isHindi = i18n.language === 'hi';

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#F0F4FF' }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="light-content" backgroundColor="#990000" />

      {/* ── Top Emergency Header Banner ────────────────────────── */}
      <LinearGradient colors={[GOV_RED, '#800000']} style={styles.headerGradient}>
        <View style={styles.govBanner}>
          <MaterialCommunityIcons name="alert-decagram" size={18} color={GOV_ORANGE} />
          <Text style={styles.govBannerText}>HP SDRF · EMERGENCY DISPATCH PORTAL</Text>
          <MaterialCommunityIcons name="alert-decagram" size={18} color={GOV_ORANGE} />
        </View>
        <View style={styles.headerBody}>
          <MaterialCommunityIcons name="shield-alert" size={40} color="white" />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.headerTitle}>{t('report_disaster', 'Report Emergency Incident')}</Text>
            <Text style={styles.headerSub}>Instant alert & GPS dispatch to SDRF Control Room</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollBody} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <OfflineQueueBanner />
        <Surface style={styles.cardSurface} elevation={2}>

          {/* ── 1. Disaster Category Options Grid ───────────────── */}
          <Text style={styles.fieldLabel}>Select Incident / Disaster Category *</Text>
          <View style={styles.categoryGrid}>
            {DISASTER_OPTIONS.map(opt => {
              const isSelected = disasterType === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  style={[
                    styles.catChip,
                    { backgroundColor: opt.bg, borderColor: isSelected ? opt.color : '#CBD5E1' },
                    isSelected && styles.catChipSelected,
                  ]}
                  onPress={() => handleSelectDisaster(opt.id)}
                  activeOpacity={0.8}
                >
                  <MaterialCommunityIcons name={opt.icon as any} size={20} color={opt.color} />
                  <Text style={[styles.catChipText, { color: isSelected ? opt.color : '#334155' }, isSelected && { fontWeight: '900' }]}>
                    {isHindi ? opt.labelHi : opt.label}
                  </Text>
                  {isSelected && (
                    <MaterialCommunityIcons name="check-circle" size={14} color={opt.color} style={{ marginLeft: 2 }} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* ── 1B. Custom Incident Input (When "Others" is selected) ─ */}
          {disasterType === 'Others' && (
            <View style={styles.customBox}>
              <Text style={styles.customBoxTitle}>Specify Custom Incident Type *</Text>
              <TextInput
                ref={customInputRef}
                mode="outlined"
                label="Custom Incident Details (अन्य दुर्घटना का नाम)"
                value={customDisaster}
                onChangeText={setCustomDisaster}
                placeholder="e.g. Drowning in River, Chemical Gas Leakage"
                style={styles.input}
                outlineColor={GOV_ORANGE}
                activeOutlineColor={GOV_RED}
                left={<TextInput.Icon icon="pencil-outline" color={GOV_ORANGE} />}
              />
            </View>
          )}

          {/* ── 2. Reporter Mobile Number ────────────────────────── */}
          <Text style={[styles.fieldLabel, { marginTop: 14 }]}>Your Mobile Number (संपर्क नंबर) *</Text>
          <TextInput
            mode="outlined"
            label="10-Digit Mobile Number"
            value={reporterPhone}
            onChangeText={t => setReporterPhone(t.replace(/\D/g, '').slice(0, 10))}
            keyboardType="phone-pad"
            style={styles.input}
            maxLength={10}
            left={<TextInput.Icon icon="phone" color={GOV_BLUE} />}
            right={
              reporterPhone.length === 10 ? (
                <TextInput.Icon icon="check-circle" color={GOV_GREEN} />
              ) : undefined
            }
          />
          <Text style={styles.helpNote}>
            🔒 SDRF Officers will call this number immediately to verify location & dispatch rescue team.
          </Text>

          {/* ── 3. Incident Title ────────────────────────────────── */}
          <Text style={[styles.fieldLabel, { marginTop: 14 }]}>Incident Title / Subject *</Text>
          <TextInput
            mode="outlined"
            label="Brief Incident Title"
            placeholder="e.g. Heavy Landslide blocking NH-21 near Kullu"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
            left={<TextInput.Icon icon="alert-circle" color={GOV_RED} />}
          />

          {/* ── 4. Situation Report (SITREP) / Details ──────────── */}
          <Text style={styles.fieldLabel}>Situation Report (SITREP) & Details *</Text>
          <TextInput
            mode="outlined"
            label="Detailed Situation Report"
            placeholder="Describe casualties, trapped people, road status, or urgent needs..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            style={styles.input}
            left={<TextInput.Icon icon="notebook-edit" color={GOV_BLUE} />}
          />

          {/* ── 5. Location Details (STRICTLY MANDATORY) ───────── */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <Text style={[styles.fieldLabel, { marginBottom: 0 }]}>Location Information (स्थान विवरण) *</Text>
            <Text style={{ fontSize: 10, fontWeight: '900', color: (hasValidGps || hasManualLoc) ? GOV_GREEN : GOV_RED }}>
              {(hasValidGps || hasManualLoc) ? '✓ Location Set' : '⚠️ MANDATORY'}
            </Text>
          </View>

          {/* GPS Auto-fetch Status Pill */}
          <View style={[
            styles.gpsRow,
            hasValidGps && { backgroundColor: '#F0FDF4', borderColor: '#DCFCE7' },
            !hasValidGps && { backgroundColor: '#FFFBEB', borderColor: '#FDE68A' },
          ]}>
            <MaterialCommunityIcons
              name={hasValidGps ? 'map-marker-check' : 'satellite-variant'}
              size={20}
              color={hasValidGps ? GOV_GREEN : fetchingGps ? GOV_ORANGE : GOV_RED}
            />
            <Text style={[styles.gpsText, hasValidGps && { color: GOV_GREEN }]}>
              {fetchingGps
                ? 'Fetching GPS Coordinates…'
                : hasValidGps
                ? `GPS Coords Acquired: ${gpsLocation}`
                : 'GPS Coords unavailable. Please type landmark location below.'}
            </Text>
            {fetchingGps && <ActivityIndicator size="small" color={GOV_ORANGE} />}
          </View>

          {/* Manual Location / Address Input (Mandatory if GPS unavailable) */}
          <TextInput
            ref={manualLocationRef}
            mode="outlined"
            label="Manual Landmark / Village / Highway Location *"
            value={manualLocation}
            onChangeText={text => {
              setManualLocation(text);
              if (text.trim().length >= 3) setLocationError(false);
            }}
            placeholder="e.g. Near Old Bridge, Village Aut, District Mandi"
            style={[styles.input, locationError && { borderColor: GOV_RED }]}
            outlineColor={locationError ? GOV_RED : undefined}
            activeOutlineColor={locationError ? GOV_RED : GOV_BLUE}
            left={<TextInput.Icon icon="map-marker-radius" color={locationError ? GOV_RED : GOV_BLUE} />}
            right={
              hasManualLoc ? (
                <TextInput.Icon icon="check-circle" color={GOV_GREEN} />
              ) : undefined
            }
          />

          {/* Location Error Warning Box */}
          {locationError && (
            <View style={styles.errorBox}>
              <MaterialCommunityIcons name="alert-circle" size={18} color={GOV_RED} />
              <Text style={styles.errorBoxText}>
                Location is mandatory! SDRF teams cannot dispatch without location. Please type your location above.
              </Text>
            </View>
          )}

          {/* ── Submit Button ────────────────────────────────────── */}
          <TouchableOpacity
            style={[styles.submitBtn, loading && { opacity: 0.7 }]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.88}
          >
            <LinearGradient colors={[GOV_RED, '#800000']} style={styles.submitBtnGradient}>
              {loading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <MaterialCommunityIcons name="send" size={22} color="white" />
              )}
              <Text style={styles.submitBtnText}>
                {loading ? 'DISPATCHING ALERT…' : 'SUBMIT EMERGENCY SITREP'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

        </Surface>

        <Text style={styles.footerNote}>
          Suraksha Sarthi · HP State Disaster Response Force{'\n'}
          Official Emergency Operations Protocol v2.0
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  headerGradient: {
    paddingHorizontal: 18,
    paddingTop: Platform.OS === 'android' ? 42 : 54,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  govBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, marginBottom: 12,
  },
  govBannerText: { color: 'white', fontSize: 10, fontWeight: '800', letterSpacing: 0.8 },
  headerBody: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: '900' },
  headerSub: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 2 },

  scrollBody: { padding: 16, paddingBottom: 60 },
  cardSurface: {
    backgroundColor: 'white', borderRadius: 16, padding: 18,
    borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 20,
  },

  fieldLabel: {
    fontSize: 12, fontWeight: '800', color: '#1E293B',
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8,
  },

  categoryGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16,
  },
  catChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20,
    borderWidth: 1.5,
  },
  catChipSelected: {
    elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15,
  },
  catChipText: { fontSize: 12, fontWeight: '700' },

  customBox: {
    backgroundColor: '#FFFBEB', borderRadius: 12, padding: 12,
    borderWidth: 1.5, borderColor: '#FDE68A', marginBottom: 14,
  },
  customBoxTitle: { fontSize: 12, fontWeight: '800', color: '#B45309', marginBottom: 8 },

  input: { marginBottom: 14, backgroundColor: '#F8FAFC' },

  helpNote: { fontSize: 11, color: '#64748B', lineHeight: 16, marginTop: -8, marginBottom: 14 },

  gpsRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderRadius: 8, padding: 10,
    borderWidth: 1, marginBottom: 14,
  },
  gpsText: { flex: 1, fontSize: 12, fontWeight: '700', color: '#B45309' },

  errorBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#FEF2F2', borderRadius: 8, padding: 10,
    borderWidth: 1.5, borderColor: '#FCA5A5', marginBottom: 14,
  },
  errorBoxText: { flex: 1, fontSize: 11, fontWeight: '700', color: GOV_RED, lineHeight: 16 },

  submitBtn: { borderRadius: 12, overflow: 'hidden', marginTop: 10, elevation: 4 },
  submitBtnGradient: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, paddingVertical: 16,
  },
  submitBtnText: { color: 'white', fontSize: 15, fontWeight: '900', letterSpacing: 0.8 },

  footerNote: {
    textAlign: 'center', fontSize: 10, color: '#94A3B8', lineHeight: 16, marginBottom: 20,
  },
});
