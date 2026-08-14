import React, { useEffect, useState, useCallback } from 'react';
import {
  View, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Platform, Alert, ActivityIndicator as RNActivityIndicator, Image,
} from 'react-native';
import { Text, TextInput, ActivityIndicator, Surface, Portal, Dialog, Button } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { api } from '../api';

const GOV_BLUE      = '#003087';
const GOV_BLUE_DARK = '#001F5C';
const GOV_ORANGE    = '#FF6600';
const GOV_GREEN     = '#007A3D';
const GOV_RED       = '#CC0000';

// ─── 12 Himachal Pradesh Districts Strictly Listed ────────────────
const HP_DISTRICTS = [
  { id: 'Shimla',          label: 'Shimla',          labelHi: 'शिमला' },
  { id: 'Mandi',           label: 'Mandi',           labelHi: 'मंडी' },
  { id: 'Kangra',          label: 'Kangra',          labelHi: 'कांगड़ा' },
  { id: 'Kullu',           label: 'Kullu',           labelHi: 'कुल्लू' },
  { id: 'Solan',           label: 'Solan',           labelHi: 'सोलन' },
  { id: 'Sirmaur',         label: 'Sirmaur',         labelHi: 'सिरमौर' },
  { id: 'Una',             label: 'Una',             labelHi: 'ऊना' },
  { id: 'Bilaspur',        label: 'Bilaspur',        labelHi: 'बिलासपुर' },
  { id: 'Hamirpur',        label: 'Hamirpur',        labelHi: 'हमीरपुर' },
  { id: 'Chamba',          label: 'Chamba',          labelHi: 'चंबा' },
  { id: 'Lahaul & Spiti',  label: 'Lahaul & Spiti',  labelHi: 'लाहुल और स्पीति' },
  { id: 'Kinnaur',         label: 'Kinnaur',         labelHi: 'किन्नौर' },
];

// ─── Available Skills ─────────────────────────────────────────────
const SKILL_OPTIONS = [
  { id: 'doctor',      label: 'Doctor',         icon: 'stethoscope' },
  { id: 'nurse',       label: 'Nurse',           icon: 'medical-bag' },
  { id: 'first_aid',   label: 'First Aider',     icon: 'bandage' },
  { id: 'engineer',    label: 'Engineer',         icon: 'hard-hat' },
  { id: 'diver',       label: 'Diver',            icon: 'diving-scuba' },
  { id: 'climber',     label: 'Climber',          icon: 'hiking' },
  { id: 'driver',      label: 'Driver',           icon: 'car' },
  { id: 'search',      label: 'Search & Rescue',  icon: 'magnify' },
  { id: 'counsellor',  label: 'Counsellor',       icon: 'account-heart' },
  { id: 'logistics',   label: 'Logistics',        icon: 'truck' },
  { id: 'other',       label: 'Other',            icon: 'dots-horizontal' },
];

// ─── Status Badge ─────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { color: string; bg: string; icon: string; label: string }> = {
    pending:  { color: '#D97706', bg: '#FEF3C7', icon: 'clock-outline',   label: 'Pending Admin Approval' },
    approved: { color: GOV_GREEN, bg: '#F0FDF4', icon: 'check-circle',    label: 'Approved & Active Volunteer ✓' },
    rejected: { color: GOV_RED,   bg: '#FEF2F2', icon: 'close-circle',    label: 'Application Rejected' },
  };
  const s = map[status] || map['pending'];
  return (
    <View style={[styles.statusBadge, { backgroundColor: s.bg, borderColor: s.color }]}>
      <MaterialCommunityIcons name={s.icon as any} size={16} color={s.color} />
      <Text style={[styles.statusBadgeText, { color: s.color }]}>{s.label}</Text>
    </View>
  );
}

export default function CitizenVolunteerScreen() {
  const isFocused = useIsFocused();

  // ─── Form State ───────────────────────────────────────────────
  const [name,             setName]             = useState('');
  const [phone,            setPhone]            = useState('');
  const [district,         setDistrict]         = useState('Shimla');
  const [aadhaar,          setAadhaar]          = useState('');
  const [aadhaarFrontUrl, setAadhaarFrontUrl]  = useState('');
  const [aadhaarBackUrl,  setAadhaarBackUrl]   = useState('');
  const [selectedSkills,   setSelectedSkills]   = useState<string[]>([]);

  // ─── Profile State ─────────────────────────────────────────────
  const [existing,   setExisting]   = useState<any>(null);
  const [loading,    setLoading]    = useState(true);
  const [saving,     setSaving]     = useState(false);
  const [userName,   setUserName]   = useState('');

  // Sample photo picker modal
  const [showPhotoModal, setShowPhotoModal] = useState<any>(null); // 'front' or 'back'
  const [photoUrlInput, setPhotoUrlInput]   = useState('');

  useEffect(() => {
    if (isFocused) loadProfile();
  }, [isFocused]);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    try {
      const storedName  = await SecureStore.getItemAsync('userName');
      const storedPhone = await SecureStore.getItemAsync('userPhone');
      if (storedName)  { setUserName(storedName); setName(storedName); }
      if (storedPhone) setPhone(storedPhone);

      const res = await api.get('/volunteers/me');
      if (res.data?.registered) {
        const p = res.data;
        setExisting(p);
        setName(p.name || storedName || '');
        setPhone(p.phone || storedPhone || '');
        setDistrict(p.district || p.place || 'Shimla');
        setAadhaar(p.aadhaar || '');
        setAadhaarFrontUrl(p.aadhaar_front_url || p.aadhaarFrontUrl || '');
        setAadhaarBackUrl(p.aadhaar_back_url || p.aadhaarBackUrl || '');
        if (p.skills) {
          setSelectedSkills(
            p.skills.split(',').map((s: string) => s.trim()).filter(Boolean)
          );
        }
      }
    } catch {
      // 404 = not yet registered, fine
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleSkill = (id: string) => {
    setSelectedSkills(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const validate = (): boolean => {
    if (!name.trim() || name.trim().length < 2) {
      Alert.alert('Required', 'Please enter your full legal name.');
      return false;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      Alert.alert('Required', 'Please enter a valid 10-digit phone number.');
      return false;
    }
    if (!district) {
      Alert.alert('Required', 'Please select your Himachal Pradesh district.');
      return false;
    }
    if (selectedSkills.length === 0) {
      Alert.alert('Required', 'Please select at least one skill.');
      return false;
    }
    if (!aadhaar || !/^\d{12}$/.test(aadhaar.replace(/\s/g, ''))) {
      Alert.alert('Required', 'Please enter a valid 12-digit Aadhaar Card number.');
      return false;
    }
    if (!aadhaarFrontUrl.trim()) {
      Alert.alert('Aadhaar Front Image Required', 'Please attach/upload the Front Side image of your Aadhaar card.');
      return false;
    }
    if (!aadhaarBackUrl.trim()) {
      Alert.alert('Aadhaar Back Image Required', 'Please attach/upload the Back Side image of your Aadhaar card.');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        name:              name.trim(),
        phone:             phone.trim(),
        district:          district,
        place:             district,
        skills:            selectedSkills.join(','),
        capabilities:      selectedSkills.join(','),
        aadhaar:           aadhaar.replace(/\s/g, ''),
        aadhaar_front_url: aadhaarFrontUrl.trim(),
        aadhaar_back_url:  aadhaarBackUrl.trim(),
        status:            'pending', // Application goes for admin approval!
      };
      await api.put('/volunteers/me', payload);
      Alert.alert(
        '✅ Volunteer Application Submitted!',
        'Your profile and Aadhaar card photos have been submitted for SDRF Admin review & verification. You will be notified once approved.',
        [{ text: 'OK', onPress: () => loadProfile() }]
      );
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const attachSamplePhoto = (type: 'front' | 'back', sampleUrl: string) => {
    if (type === 'front') setAadhaarFrontUrl(sampleUrl);
    else setAadhaarBackUrl(sampleUrl);
    setShowPhotoModal(null);
    setPhotoUrlInput('');
  };

  if (loading) {
    return (
      <View style={styles.centerLoad}>
        <ActivityIndicator size="large" color={GOV_BLUE} />
        <Text style={styles.loadText}>Loading your volunteer profile…</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={GOV_BLUE_DARK} />

      {/* ── Top Header ──────────────────────────────────────────── */}
      <LinearGradient colors={[GOV_BLUE_DARK, GOV_GREEN]} style={styles.header}>
        <View style={styles.govBanner}>
          <MaterialCommunityIcons name="star-circle" size={16} color={GOV_ORANGE} />
          <Text style={styles.govName}>HP SDRF VOLUNTEER REGISTRATION</Text>
          <MaterialCommunityIcons name="star-circle" size={16} color={GOV_ORANGE} />
        </View>
        <View style={styles.headerBody}>
          <MaterialCommunityIcons name="account-hard-hat" size={48} color="rgba(255,255,255,0.9)" />
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={styles.headerTitle}>
              {existing ? 'My Volunteer Profile' : 'Join as Volunteer'}
            </Text>
            <Text style={styles.headerSub}>
              {existing
                ? `Hello ${userName}! Manage your profile & Aadhaar verification.`
                : 'Register skills & Aadhaar to help SDRF during disasters.'}
            </Text>
          </View>
        </View>
        {existing && <StatusBadge status={existing.status || 'pending'} />}
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        {/* ── Section 1: Basic Personal Info ────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="account-circle" size={20} color={GOV_BLUE} />
            <Text style={styles.sectionTitle}>1. Personal Information</Text>
          </View>

          <Text style={styles.fieldLabel}>Full Legal Name *</Text>
          <View style={styles.inputWrapper}>
            <MaterialCommunityIcons name="account" size={18} color={GOV_BLUE} style={styles.inputIcon} />
            <TextInput
              mode="flat"
              value={name}
              onChangeText={setName}
              style={styles.input}
              underlineColor="transparent"
              activeUnderlineColor="transparent"
              placeholder="Your full legal name"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="words"
            />
          </View>

          <Text style={styles.fieldLabel}>Mobile Number (संपर्क नंबर) *</Text>
          <View style={styles.inputWrapper}>
            <MaterialCommunityIcons name="phone" size={18} color={GOV_BLUE} style={styles.inputIcon} />
            <TextInput
              mode="flat"
              value={phone}
              onChangeText={t => setPhone(t.replace(/\D/g, '').slice(0, 10))}
              keyboardType="phone-pad"
              style={styles.input}
              underlineColor="transparent"
              activeUnderlineColor="transparent"
              placeholder="10-digit mobile number"
              placeholderTextColor="#9CA3AF"
              maxLength={10}
            />
          </View>

          {/* ── District Selector Grid (Himachal Pradesh) ────────── */}
          <Text style={styles.fieldLabel}>Select Himachal Pradesh District *</Text>
          <View style={styles.districtGrid}>
            {HP_DISTRICTS.map(d => {
              const isSelected = district === d.id;
              return (
                <TouchableOpacity
                  key={d.id}
                  style={[styles.districtChip, isSelected && styles.districtChipSelected]}
                  onPress={() => setDistrict(d.id)}
                  activeOpacity={0.8}
                >
                  <MaterialCommunityIcons
                    name="map-marker"
                    size={14}
                    color={isSelected ? 'white' : GOV_BLUE}
                  />
                  <Text style={[styles.districtChipText, isSelected && styles.districtChipTextSelected]}>
                    {d.label} ({d.labelHi})
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── Section 2: Skills & Capability ───────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="star-circle" size={20} color={GOV_BLUE} />
            <Text style={styles.sectionTitle}>2. Your Skills & Capabilities *</Text>
          </View>
          <Text style={styles.sectionNote}>
            Select your emergency response skills (Doctor, Nurse, Diver, Driver, Search & Rescue):
          </Text>
          <View style={styles.chipGrid}>
            {SKILL_OPTIONS.map(skill => (
              <TouchableOpacity
                key={skill.id}
                style={[styles.skillChip, selectedSkills.includes(skill.id) && styles.skillChipSelected]}
                onPress={() => toggleSkill(skill.id)}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons
                  name={skill.icon as any}
                  size={15}
                  color={selectedSkills.includes(skill.id) ? 'white' : '#64748B'}
                />
                <Text style={[styles.skillChipText, selectedSkills.includes(skill.id) && styles.skillChipTextSelected]}>
                  {skill.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Section 3: Aadhaar Identity Photo Verification ───── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="card-account-details" size={20} color={GOV_BLUE} />
            <Text style={styles.sectionTitle}>3. Aadhaar Photo Verification *</Text>
          </View>

          <Text style={styles.fieldLabel}>Aadhaar Card Number *</Text>
          <View style={styles.inputWrapper}>
            <MaterialCommunityIcons name="card-bulleted" size={18} color={GOV_BLUE} style={styles.inputIcon} />
            <TextInput
              mode="flat"
              value={aadhaar}
              onChangeText={t => setAadhaar(t.replace(/\D/g, '').slice(0, 12))}
              keyboardType="number-pad"
              style={styles.input}
              underlineColor="transparent"
              activeUnderlineColor="transparent"
              placeholder="12-digit Aadhaar Card Number"
              placeholderTextColor="#9CA3AF"
              maxLength={12}
            />
            {aadhaar.length === 12 && (
              <MaterialCommunityIcons name="check-circle" size={18} color={GOV_GREEN} />
            )}
          </View>

          {/* Aadhaar Front Image Attachment */}
          <Text style={[styles.fieldLabel, { marginTop: 10 }]}>Aadhaar Card Front Photo Image *</Text>
          <TouchableOpacity
            style={[styles.uploadBox, aadhaarFrontUrl && styles.uploadBoxAttached]}
            onPress={() => { setShowPhotoModal('front'); setPhotoUrlInput(aadhaarFrontUrl); }}
            activeOpacity={0.8}
          >
            {aadhaarFrontUrl ? (
              <View style={styles.previewRow}>
                <Image source={{ uri: aadhaarFrontUrl }} style={styles.thumbnail} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.previewTitle}>✓ Front Side Attached</Text>
                  <Text style={styles.previewUrl} numberOfLines={1}>{aadhaarFrontUrl}</Text>
                </View>
                <MaterialCommunityIcons name="pencil" size={18} color={GOV_BLUE} />
              </View>
            ) : (
              <View style={styles.uploadPlaceholder}>
                <MaterialCommunityIcons name="camera-plus" size={24} color={GOV_BLUE} />
                <Text style={styles.uploadText}>Attach Aadhaar Front Image (सामने का फोटो)</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Aadhaar Back Image Attachment */}
          <Text style={[styles.fieldLabel, { marginTop: 14 }]}>Aadhaar Card Back Photo Image *</Text>
          <TouchableOpacity
            style={[styles.uploadBox, aadhaarBackUrl && styles.uploadBoxAttached]}
            onPress={() => { setShowPhotoModal('back'); setPhotoUrlInput(aadhaarBackUrl); }}
            activeOpacity={0.8}
          >
            {aadhaarBackUrl ? (
              <View style={styles.previewRow}>
                <Image source={{ uri: aadhaarBackUrl }} style={styles.thumbnail} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.previewTitle}>✓ Back Side Attached</Text>
                  <Text style={styles.previewUrl} numberOfLines={1}>{aadhaarBackUrl}</Text>
                </View>
                <MaterialCommunityIcons name="pencil" size={18} color={GOV_BLUE} />
              </View>
            ) : (
              <View style={styles.uploadPlaceholder}>
                <MaterialCommunityIcons name="camera-plus" size={24} color={GOV_BLUE} />
                <Text style={styles.uploadText}>Attach Aadhaar Back Image (पीछे का फोटो)</Text>
              </View>
            )}
          </TouchableOpacity>

          <Text style={styles.privacyNote}>
            🔒 Your Aadhaar photos will be encrypted and sent directly to SDRF Officers for verification.
          </Text>
        </View>

        {/* ── Submit / Register Button ──────────────────────────── */}
        <TouchableOpacity
          style={[styles.saveBtn, saving && { opacity: 0.7 }]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.85}
        >
          <LinearGradient colors={[GOV_GREEN, '#005A2B']} style={styles.saveBtnGradient}>
            {saving
              ? <RNActivityIndicator color="white" size="small" />
              : <MaterialCommunityIcons name="check-circle" size={22} color="white" />
            }
            <Text style={styles.saveBtnText}>
              {saving ? 'SUBMITTING APPLICATION…' : 'REGISTER AS VOLUNTEER'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Info card */}
        <View style={styles.infoCard}>
          <MaterialCommunityIcons name="information-outline" size={18} color="#2563EB" />
          <Text style={styles.infoText}>
            Your volunteer application & Aadhaar photos will be sent to SDRF Admin officers for identity review and approval.
          </Text>
        </View>
      </ScrollView>

      {/* ── Photo Attachment Input Modal ───────────────────────── */}
      <Portal>
        <Dialog visible={!!showPhotoModal} onDismiss={() => setShowPhotoModal(null)} style={styles.dialog}>
          <Dialog.Title style={styles.dialogTitle}>
            Attach Aadhaar {showPhotoModal === 'front' ? 'Front' : 'Back'} Image
          </Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogNote}>
              Provide image URL or select sample photo for {showPhotoModal === 'front' ? 'Front Side' : 'Back Side'} of Aadhaar:
            </Text>

            <TextInput
              label="Photo Image URL"
              value={photoUrlInput}
              onChangeText={setPhotoUrlInput}
              mode="outlined"
              placeholder="https://..."
              style={{ marginBottom: 12 }}
            />

            <Text style={{ fontSize: 11, fontWeight: '800', color: '#64748B', marginBottom: 8 }}>
              OR SELECT SAMPLE PHOTO FOR DEMO:
            </Text>
            <View style={{ gap: 8 }}>
              <Button
                mode="outlined"
                icon="camera"
                onPress={() => attachSamplePhoto(showPhotoModal, showPhotoModal === 'front' ? 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600' : 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600')}
              >
                Attach Sample Card Photo
              </Button>
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowPhotoModal(null)}>Cancel</Button>
            <Button
              mode="contained"
              buttonColor={GOV_BLUE}
              onPress={() => {
                if (photoUrlInput.trim()) {
                  attachSamplePhoto(showPhotoModal, photoUrlInput.trim());
                } else {
                  Alert.alert('Required', 'Please enter or select a photo image');
                }
              }}
            >
              Attach Photo
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  root:       { flex: 1, backgroundColor: '#F0F4FF' },
  centerLoad: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadText:   { color: '#64748B', fontWeight: '600' },

  header: { paddingBottom: 18 },
  govBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingTop: Platform.OS === 'android' ? 42 : 56,
    paddingBottom: 10, gap: 6,
  },
  govName:    { color: 'white', fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  headerBody: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 18, paddingBottom: 12,
  },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: '900' },
  headerSub:   { color: 'rgba(255,255,255,0.75)', fontSize: 12, marginTop: 3 },

  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    marginHorizontal: 16, marginBottom: 4,
    paddingVertical: 8, paddingHorizontal: 14,
    borderRadius: 20, borderWidth: 1.5, alignSelf: 'flex-start',
  },
  statusBadgeText: { fontWeight: '800', fontSize: 13 },

  body: { padding: 16, paddingBottom: 80 },

  section: {
    backgroundColor: 'white', borderRadius: 14,
    padding: 18, marginBottom: 16,
    elevation: 2, borderWidth: 1, borderColor: '#E2E8F0',
  },
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14,
  },
  sectionTitle: { fontSize: 15, fontWeight: '900', color: GOV_BLUE },
  sectionNote:  { fontSize: 12, color: '#64748B', marginBottom: 12, lineHeight: 17 },

  fieldLabel: {
    fontSize: 11, fontWeight: '800', color: '#3E5060',
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F8FAFF', borderRadius: 8,
    borderWidth: 1.5, borderColor: '#CBD5E1',
    paddingHorizontal: 10, marginBottom: 14,
  },
  inputIcon: { marginRight: 6 },
  input: { flex: 1, backgroundColor: 'transparent', fontSize: 14, height: 46 },

  // HP District Grid
  districtGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 14 },
  districtChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 14,
    backgroundColor: '#F8FAFF', borderWidth: 1.5, borderColor: '#CBD5E1',
  },
  districtChipSelected: { backgroundColor: GOV_BLUE, borderColor: GOV_BLUE },
  districtChipText: { fontSize: 11, fontWeight: '700', color: '#475569' },
  districtChipTextSelected: { color: 'white' },

  // Skills Grid
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  skillChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingVertical: 7, paddingHorizontal: 12,
    borderRadius: 20, borderWidth: 1.5, borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFF',
  },
  skillChipSelected:     { backgroundColor: GOV_BLUE, borderColor: GOV_BLUE },
  skillChipText:         { fontSize: 12, fontWeight: '700', color: '#64748B' },
  skillChipTextSelected: { color: 'white' },

  // Photo Upload Boxes
  uploadBox: {
    backgroundColor: '#F8FAFF', borderRadius: 10, padding: 14,
    borderWidth: 1.5, borderColor: '#CBD5E1', borderStyle: 'dashed',
    marginBottom: 8,
  },
  uploadBoxAttached: {
    backgroundColor: '#F0FDF4', borderColor: GOV_GREEN, borderStyle: 'solid',
  },
  uploadPlaceholder: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  uploadText: { fontSize: 12, fontWeight: '800', color: GOV_BLUE },

  previewRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  thumbnail: { width: 44, height: 32, borderRadius: 4, backgroundColor: '#E2E8F0' },
  previewTitle: { fontSize: 12, fontWeight: '800', color: GOV_GREEN },
  previewUrl: { fontSize: 10, color: '#64748B', marginTop: 1 },

  privacyNote: { fontSize: 11, color: '#64748B', lineHeight: 16, marginTop: 4 },

  saveBtn: { borderRadius: 12, overflow: 'hidden', marginVertical: 12 },
  saveBtnGradient: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 16, gap: 10,
  },
  saveBtnText: { color: 'white', fontSize: 15, fontWeight: '900', letterSpacing: 0.8 },

  infoCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: '#EFF6FF', borderRadius: 10,
    padding: 14, marginBottom: 20,
  },
  infoText: { flex: 1, fontSize: 12, color: '#1E40AF', lineHeight: 18 },

  dialog: { backgroundColor: 'white', borderRadius: 16 },
  dialogTitle: { fontSize: 16, fontWeight: '800', color: GOV_BLUE_DARK },
  dialogNote: { fontSize: 12, color: '#64748B', marginBottom: 12 },
});
