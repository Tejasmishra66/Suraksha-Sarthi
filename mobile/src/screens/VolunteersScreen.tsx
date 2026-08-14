import React, { useEffect, useState } from 'react';
import {
  View, StyleSheet, FlatList, RefreshControl, TouchableOpacity,
  Linking, Alert, Image, ScrollView, StatusBar, Platform,
} from 'react-native';
import {
  Text, Surface, ActivityIndicator, useTheme, Chip, Button, Portal, Dialog,
} from 'react-native-paper';
import * as SecureStore from 'expo-secure-store';
import { api } from '../api';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const NAVY = '#0F2942';
const BLUE = '#1D4ED8';
const DARK_BLUE = '#0F172A';
const ORANGE = '#FF6600';
const GOV_ORANGE = '#FF6600';
const GREEN = '#059669';
const RED = '#DC2626';

const STATUS_FILTERS = [
  { id: 'pending',  label: '🔴 Pending Join Requests' },
  { id: 'approved', label: '🟢 Approved Volunteers' },
  { id: 'rejected', label: '❌ Rejected Applications' },
  { id: 'all',      label: 'All Requests' },
];

export default function VolunteersScreen() {
  const theme = useTheme();

  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('pending');

  // Full-screen image inspection modal
  const [inspectImage, setInspectImage] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchVolunteers = async () => {
    try {
      const token = await SecureStore.getItemAsync('jwt');
      const response = await api.get('/volunteers', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = response.data?.data || response.data || [];
      setVolunteers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch volunteers', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchVolunteers();
  };

  const handleUpdateStatus = async (id: number, status: 'approved' | 'rejected', name: string) => {
    Alert.alert(
      status === 'approved' ? 'Approve Volunteer' : 'Reject Application',
      `Are you sure you want to mark ${name}'s application as ${status.toUpperCase()}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: status === 'approved' ? 'Approve' : 'Reject',
          style: status === 'approved' ? 'default' : 'destructive',
          onPress: async () => {
            setActionLoading(id);
            try {
              const token = await SecureStore.getItemAsync('jwt');
              await api.patch(`/volunteers/${id}/status`, { status }, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
              });
              Alert.alert(
                'Success',
                `Volunteer ${name} has been ${status === 'approved' ? 'APPROVED & ACTIVE ✓' : 'REJECTED'}.`
              );
              fetchVolunteers();
            } catch (err: any) {
              Alert.alert('Error', err?.response?.data?.message || 'Failed to update status');
            } finally {
              setActionLoading(null);
            }
          },
        },
      ]
    );
  };

  const callPhone = (phone: string) => {
    Linking.openURL(`tel:${phone}`).catch(() => {
      Alert.alert('Error', 'Unable to initiate phone call');
    });
  };

  const getStatusStyle = (status: string) => {
    const s = (status || 'pending').toLowerCase();
    if (s === 'approved') return { color: GREEN, bg: '#ECFDF5', border: '#A7F3D0', label: 'APPROVED ✓' };
    if (s === 'rejected') return { color: RED, bg: '#FEF2F2', border: '#FCA5A5', label: 'REJECTED' };
    return { color: '#D97706', bg: '#FFFBEB', border: '#FDE68A', label: 'PENDING APPROVAL' };
  };

  // Filtered List
  const filteredVolunteers = selectedFilter === 'all'
    ? volunteers
    : volunteers.filter(v => (v.status || 'pending').toLowerCase() === selectedFilter);

  const pendingCount  = volunteers.filter(v => (v.status || 'pending').toLowerCase() === 'pending').length;
  const approvedCount = volunteers.filter(v => (v.status || 'pending').toLowerCase() === 'approved').length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={DARK_BLUE} />

      {/* ── Top Admin Header ───────────────────────────────────── */}
      <LinearGradient colors={[DARK_BLUE, NAVY]} style={styles.header}>
        <View style={styles.govBanner}>
          <MaterialCommunityIcons name="shield-star" size={16} color={ORANGE} />
          <Text style={styles.govBannerText}>HP SDRF VOLUNTEER VERIFICATION PORTAL</Text>
          <MaterialCommunityIcons name="shield-star" size={16} color={ORANGE} />
        </View>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Volunteer Roster & Aadhaar Review</Text>
            <Text style={styles.headerSub}>Verify identity, Aadhaar photos & approve dispatch status</Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statPill}>
            <Text style={[styles.statValue, { color: 'white' }]}>{volunteers.length}</Text>
            <Text style={styles.statLabel}>Total Applicants</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statPill}>
            <Text style={[styles.statValue, { color: '#FBBF24' }]}>{pendingCount}</Text>
            <Text style={styles.statLabel}>Pending Review</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statPill}>
            <Text style={[styles.statValue, { color: '#4ADE80' }]}>{approvedCount}</Text>
            <Text style={styles.statLabel}>Approved</Text>
          </View>
        </View>
      </LinearGradient>

      {/* ── Filter Bar ────────────────────────────────────────── */}
      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {STATUS_FILTERS.map(f => (
            <TouchableOpacity
              key={f.id}
              style={[styles.filterChip, selectedFilter === f.id && styles.filterChipActive]}
              onPress={() => setSelectedFilter(f.id)}
            >
              <Text style={[styles.filterChipText, selectedFilter === f.id && styles.filterChipTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ── Volunteers List ───────────────────────────────────── */}
      {loading ? (
        <View style={styles.centerLoad}>
          <ActivityIndicator animating size="large" color={BLUE} />
          <Text style={styles.loadText}>Loading volunteer applications…</Text>
        </View>
      ) : (
        <FlatList
          data={filteredVolunteers}
          keyExtractor={item => item.id?.toString() || Math.random().toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="account-search" size={48} color="#94A3B8" />
              <Text style={styles.emptyTitle}>No Volunteers Found</Text>
              <Text style={styles.emptySub}>
                No volunteer records under "{selectedFilter}" status filter.
              </Text>
            </View>
          }
          renderItem={({ item }) => {
            const st = getStatusStyle(item.status);
            const isPending = (item.status || 'pending').toLowerCase() === 'pending';
            const frontPhoto = item.aadhaar_front_url || item.aadhaarFrontUrl;
            const backPhoto  = item.aadhaar_back_url || item.aadhaarBackUrl;

            return (
              <Surface style={styles.volCard} elevation={1}>
                {/* Header row */}
                <View style={styles.cardHeader}>
                  <View style={styles.avatarCircle}>
                    <MaterialCommunityIcons name="account-hard-hat" size={24} color="white" />
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.volName}>{item.name}</Text>
                    <View style={styles.locRow}>
                      <MaterialCommunityIcons name="map-marker" size={14} color={BLUE} />
                      <Text style={styles.locText}>{item.district || item.place || 'Himachal Pradesh'}</Text>
                    </View>
                  </View>

                  <View style={[styles.statusChip, { backgroundColor: st.bg, borderColor: st.border }]}>
                    <Text style={[styles.statusChipText, { color: st.color }]}>{st.label}</Text>
                  </View>
                </View>

                {/* Details */}
                <View style={styles.detailsGrid}>
                  <View style={styles.detailRow}>
                    <MaterialCommunityIcons name="phone" size={14} color="#64748B" />
                    <Text style={styles.detailText}>{item.phone || 'N/A'}</Text>
                    {item.phone && (
                      <TouchableOpacity style={styles.callBtn} onPress={() => callPhone(item.phone)}>
                        <MaterialCommunityIcons name="phone-outgoing" size={12} color={GREEN} />
                        <Text style={styles.callBtnText}>Call</Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  <View style={styles.detailRow}>
                    <MaterialCommunityIcons name="star-circle" size={14} color="#64748B" />
                    <Text style={styles.detailText}>Skills: {item.skills || item.capabilities || 'General Rescue'}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <MaterialCommunityIcons name="card-account-details" size={14} color="#64748B" />
                    <Text style={styles.detailText}>Aadhaar: {item.aadhaar || 'Provided'}</Text>
                  </View>
                </View>

                {/* ── Aadhaar Card Photos Inspection Row ──────────── */}
                <Text style={styles.photoSectionTitle}>Aadhaar Card Photos (Review Identity):</Text>
                <View style={styles.photoRow}>
                  {/* Front Photo */}
                  <TouchableOpacity
                    style={styles.photoBox}
                    onPress={() => frontPhoto && setInspectImage(frontPhoto)}
                    activeOpacity={0.8}
                  >
                    {frontPhoto ? (
                      <Image source={{ uri: frontPhoto }} style={styles.photoImg} />
                    ) : (
                      <View style={styles.noPhotoBox}>
                        <MaterialCommunityIcons name="file-image" size={20} color="#94A3B8" />
                        <Text style={styles.noPhotoText}>No Front Photo</Text>
                      </View>
                    )}
                    <Text style={styles.photoLabel}>Front Side</Text>
                  </TouchableOpacity>

                  {/* Back Photo */}
                  <TouchableOpacity
                    style={styles.photoBox}
                    onPress={() => backPhoto && setInspectImage(backPhoto)}
                    activeOpacity={0.8}
                  >
                    {backPhoto ? (
                      <Image source={{ uri: backPhoto }} style={styles.photoImg} />
                    ) : (
                      <View style={styles.noPhotoBox}>
                        <MaterialCommunityIcons name="file-image" size={20} color="#94A3B8" />
                        <Text style={styles.noPhotoText}>No Back Photo</Text>
                      </View>
                    )}
                    <Text style={styles.photoLabel}>Back Side</Text>
                  </TouchableOpacity>
                </View>

                {/* Admin Approval Actions */}
                <View style={styles.cardActions}>
                  {actionLoading === item.id ? (
                    <ActivityIndicator size="small" color={BLUE} style={{ marginVertical: 8 }} />
                  ) : (
                    <>
                      <TouchableOpacity
                        style={styles.approveBtn}
                        onPress={() => handleUpdateStatus(item.id, 'approved', item.name)}
                        activeOpacity={0.8}
                      >
                        <MaterialCommunityIcons name="check-circle" size={16} color="white" />
                        <Text style={styles.approveBtnText}>Approve Volunteer</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.rejectBtn}
                        onPress={() => handleUpdateStatus(item.id, 'rejected', item.name)}
                        activeOpacity={0.8}
                      >
                        <MaterialCommunityIcons name="close-circle" size={16} color={RED} />
                        <Text style={styles.rejectBtnText}>Reject</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </Surface>
            );
          }}
        />
      )}

      {/* Full Screen Image Inspection Dialog */}
      <Portal>
        <Dialog visible={!!inspectImage} onDismiss={() => setInspectImage(null)} style={styles.imageDialog}>
          <Dialog.Title style={styles.dialogTitle}>Aadhaar Card Photo Inspection</Dialog.Title>
          <Dialog.Content style={{ alignItems: 'center' }}>
            {inspectImage && (
              <Image source={{ uri: inspectImage }} style={styles.fullInspectImg} resizeMode="contain" />
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setInspectImage(null)}>Close Inspection</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6FB' },

  header: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 42 : 54,
    paddingBottom: 16,
  },
  govBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, marginBottom: 10,
  },
  govBannerText: { color: 'white', fontSize: 10, fontWeight: '800', letterSpacing: 0.8 },

  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: '900' },
  headerSub: { color: 'rgba(255,255,255,0.75)', fontSize: 12, marginTop: 2 },

  statsRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 10,
    paddingVertical: 8, paddingHorizontal: 12,
  },
  statPill: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 16, fontWeight: '900' },
  statLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 9, fontWeight: '700', marginTop: 1 },
  statDivider: { width: 1, height: 24, backgroundColor: 'rgba(255,255,255,0.2)' },

  filterBar: { backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#E2E8F0', paddingVertical: 8 },
  filterScroll: { paddingHorizontal: 14, gap: 8 },
  filterChip: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16,
    backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#CBD5E1',
  },
  filterChipActive: { backgroundColor: BLUE, borderColor: BLUE },
  filterChipText: { fontSize: 12, fontWeight: '700', color: '#475569' },
  filterChipTextActive: { color: 'white' },

  listContent: { padding: 14, paddingBottom: 100 },
  centerLoad: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 },
  loadText: { color: '#64748B', fontWeight: '600' },

  emptyContainer: { alignItems: 'center', justifyContent: 'center', padding: 30, marginTop: 40 },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: NAVY, marginTop: 12 },
  emptySub: { fontSize: 12, color: '#64748B', textAlign: 'center', marginTop: 4, lineHeight: 18 },

  // Card
  volCard: {
    backgroundColor: 'white', borderRadius: 14,
    padding: 14, marginBottom: 12,
    borderWidth: 1, borderColor: '#E2E8F0',
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatarCircle: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: GOV_ORANGE, justifyContent: 'center', alignItems: 'center',
  },
  volName: { fontSize: 16, fontWeight: '800', color: NAVY },
  locRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2 },
  locText: { fontSize: 12, color: BLUE, fontWeight: '700' },

  statusChip: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, borderWidth: 1 },
  statusChipText: { fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },

  detailsGrid: { backgroundColor: '#F8FAFC', borderRadius: 8, padding: 10, marginBottom: 12, gap: 6 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  detailText: { fontSize: 12, color: '#334155', fontWeight: '600', flex: 1 },

  callBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: '#DCFCE7', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12,
  },
  callBtnText: { fontSize: 10, fontWeight: '800', color: GREEN },

  // Photos Inspection
  photoSectionTitle: { fontSize: 11, fontWeight: '800', color: '#475569', textTransform: 'uppercase', marginBottom: 6 },
  photoRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  photoBox: {
    flex: 1, backgroundColor: '#F1F5F9', borderRadius: 8, padding: 6,
    alignItems: 'center', borderWidth: 1, borderColor: '#CBD5E1',
  },
  photoImg: { width: '100%', height: 70, borderRadius: 6, backgroundColor: '#E2E8F0' },
  noPhotoBox: { height: 70, justifyContent: 'center', alignItems: 'center' },
  noPhotoText: { fontSize: 10, color: '#94A3B8', marginTop: 2 },
  photoLabel: { fontSize: 10, fontWeight: '800', color: NAVY, marginTop: 4 },

  cardActions: { flexDirection: 'row', gap: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  approveBtn: {
    flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: GREEN, paddingVertical: 10, borderRadius: 8,
  },
  approveBtnText: { color: 'white', fontWeight: '800', fontSize: 12 },
  rejectBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4,
    backgroundColor: '#FEF2F2', paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#FCA5A5',
  },
  rejectBtnText: { color: RED, fontWeight: '800', fontSize: 12 },

  imageDialog: { backgroundColor: 'white', borderRadius: 16 },
  dialogTitle: { fontSize: 16, fontWeight: '800', color: NAVY },
  fullInspectImg: { width: 280, height: 200, borderRadius: 8 },
});
