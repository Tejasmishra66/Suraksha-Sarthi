import React, { useEffect, useState, useCallback } from 'react';
import {
  View, StyleSheet, FlatList, RefreshControl, TouchableOpacity, StatusBar,
} from 'react-native';
import { Text, Chip, ActivityIndicator } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store';
import { api } from '../api';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const GOV_BLUE      = '#003087';
const GOV_BLUE_DARK = '#001F5C';
const GOV_ORANGE    = '#FF6600';
const GOV_RED       = '#CC0000';

const TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  flood:      { bg: '#E8F0FE', text: '#1565C0', border: '#90CAF9' },
  landslide:  { bg: '#FFF8E1', text: '#F57F17', border: '#FFE082' },
  fire:       { bg: '#FDECEA', text: '#C62828', border: '#EF9A9A' },
  earthquake: { bg: '#FBE9E7', text: '#BF360C', border: '#FFCCBC' },
  cloudburst: { bg: '#EDE7F6', text: '#4527A0', border: '#CE93D8' },
  avalanche:  { bg: '#E0F2F1', text: '#00695C', border: '#80CBC4' },
};

function getTypeColor(type: string) {
  const key = (type || '').toLowerCase();
  for (const [k, v] of Object.entries(TYPE_COLORS)) {
    if (key.includes(k)) return v;
  }
  return { bg: '#F8FAFC', text: '#3E5060', border: '#CBD5E1' };
}

function IncidentCard({ item, isHpsdma, onPress }: { item: any; isHpsdma: boolean, onPress?: () => void }) {
  const tc = getTypeColor(isHpsdma ? item.type : item.disasterType);
  const title     = isHpsdma ? item.type     : (item.title || 'Reported Emergency');
  const location  = isHpsdma
    ? `${item.district}${item.tehsil && item.tehsil !== '-' ? `, ${item.tehsil}` : ''}`
    : item.address;
  const dateStr = isHpsdma
    ? new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    : new Date(item.createdAt || item.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

  return (
    <TouchableOpacity 
      style={[styles.card, { borderLeftColor: tc.border }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.cardTopRow}>
        <View style={[styles.typeBadge, { backgroundColor: tc.bg, borderColor: tc.border }]}>
          <Text style={[styles.typeBadgeText, { color: tc.text }]}>{title.toUpperCase()}</Text>
        </View>
        {!isHpsdma && (
          <View style={[styles.statusDot, { backgroundColor: item.status === 'active' ? '#CC0000' : '#4CAF50' }]} />
        )}
        {isHpsdma && (
          <Text style={styles.dateText}>{dateStr}</Text>
        )}
      </View>

      {location ? (
        <View style={styles.locationRow}>
          <MaterialCommunityIcons name="map-marker" size={14} color={GOV_BLUE} />
          <Text style={styles.locationText}>{location}</Text>
        </View>
      ) : null}

      {isHpsdma && (item.humanLoss > 0 || item.humanInjured > 0 || item.humanMissing > 0) && (
        <View style={styles.lossRow}>
          {item.humanLoss > 0    && <Text style={styles.lossDeath}>💀 {item.humanLoss} Deaths</Text>}
          {item.humanInjured > 0 && <Text style={styles.lossInjured}>🩹 {item.humanInjured} Injured</Text>}
          {item.humanMissing > 0 && <Text style={styles.lossMissing}>❓ {item.humanMissing} Missing</Text>}
        </View>
      )}

      {!isHpsdma && item.description ? (
        <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>
      ) : null}
    </TouchableOpacity>
  );
}

export default function DashboardScreen({ navigation, route }: any) {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [hpsdmaIncidents, setHpsdmaIncidents] = useState<any[]>([]);
  const [feedType, setFeedType] = useState<'local' | 'hpsdma'>(
    route?.params?.feedType || 'local'
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchIncidents = useCallback(async () => {
    try {
      const [localRes, hpsdmaRes] = await Promise.all([
        api.get('/incidents'),
        api.get('/hpsdma/incidents?limit=50'),
      ]);
      setIncidents(Array.isArray(localRes.data) ? localRes.data : (localRes.data.data || []));
      setHpsdmaIncidents(hpsdmaRes.data?.incidents || hpsdmaRes.data?.data || []);
    } catch (error) {
      console.error('Failed to fetch incidents', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchIncidents(); }, [fetchIncidents]);

  const data = feedType === 'local' ? incidents : hpsdmaIncidents;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={GOV_BLUE_DARK} />

      {/* Header */}
      <LinearGradient colors={[GOV_BLUE_DARK, GOV_BLUE]} style={styles.header}>
        {/* HP Govt Banner */}
        <View style={styles.govBanner}>
          <MaterialCommunityIcons name="star-circle" size={20} color={GOV_ORANGE} />
          <Text style={styles.govName}>SDRF · Himachal Pradesh</Text>
          <MaterialCommunityIcons name="star-circle" size={20} color={GOV_ORANGE} />
        </View>

        <View style={styles.headerBody}>
          <View>
            <Text style={styles.headerLabel}>INCIDENT MONITORING</Text>
            <Text style={styles.headerCount}>
              {loading ? '…' : data.length} {feedType === 'hpsdma' ? 'HPSDMA' : 'Local'} Records
            </Text>
          </View>
          <TouchableOpacity onPress={fetchIncidents} style={styles.refreshBtn}>
            <MaterialCommunityIcons name="refresh" size={22} color="white" />
          </TouchableOpacity>
        </View>

        {/* Feed Selector */}
        <View style={styles.feedSelector}>
          {(['local', 'hpsdma'] as const).map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.feedTab, feedType === f && styles.feedTabActive]}
              onPress={() => setFeedType(f)}
            >
              <MaterialCommunityIcons
                name={f === 'local' ? 'cellphone-marker' : 'satellite-uplink'}
                size={14}
                color={feedType === f ? GOV_BLUE : 'rgba(255,255,255,0.6)'}
              />
              <Text style={[styles.feedTabText, feedType === f && styles.feedTabTextActive]}>
                {f === 'local' ? 'Local Reports' : 'HPSDMA Extracted'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      {/* List */}
      {loading ? (
        <View style={styles.loadingView}>
          <ActivityIndicator size="large" color={GOV_BLUE} />
          <Text style={styles.loadingText}>Loading incidents…</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item, idx) => item.id?.toString() || idx.toString()}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchIncidents(); }} tintColor={GOV_BLUE} />}
          ListEmptyComponent={
            <View style={styles.emptyView}>
              <MaterialCommunityIcons name="clipboard-check" size={48} color="#CBD5E1" />
              <Text style={styles.emptyText}>No incidents on this feed.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <IncidentCard 
              item={item} 
              isHpsdma={feedType === 'hpsdma'} 
              onPress={() => {
                navigation.navigate('Map', { 
                  focusedIncident: {
                    id: item.id,
                    lat: item.lat || item.latitude,
                    lon: item.lon || item.lng || item.longitude
                  }
                });
              }}
            />
          )}
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('ReportEmergency')}
        activeOpacity={0.85}
      >
        <MaterialCommunityIcons name="plus" size={26} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F0F4FF' },

  // Header
  header: { paddingBottom: 0 },
  govBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingTop: 48, paddingBottom: 8, gap: 8,
  },
  govName: { color: 'white', fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },
  headerBody: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    paddingHorizontal: 16, paddingTop: 10, paddingBottom: 16,
  },
  headerLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  headerCount: { color: 'white', fontSize: 22, fontWeight: '900', marginTop: 2 },
  refreshBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center', alignItems: 'center',
  },
  feedSelector: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.25)',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    padding: 4,
    gap: 4,
  },
  feedTab: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 8, borderRadius: 6, gap: 6,
  },
  feedTabActive: { backgroundColor: 'white' },
  feedTabText: { fontSize: 12, fontWeight: '700', color: 'rgba(255,255,255,0.6)' },
  feedTabTextActive: { color: GOV_BLUE },

  // List
  list: { padding: 16, paddingBottom: 100 },
  loadingView: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingText: { color: '#64748B', fontWeight: '600' },
  emptyView: { paddingTop: 60, alignItems: 'center', gap: 12 },
  emptyText: { color: '#94A3B8', fontWeight: '700' },

  // Card
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderLeftWidth: 4,
    elevation: 2,
  },
  cardTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  typeBadge: {
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6,
    borderWidth: 1,
  },
  typeBadgeText: { fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  dateText: { fontSize: 11, color: '#64748B', fontWeight: '700' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 },
  locationText: { fontSize: 13, fontWeight: '700', color: '#1A2027', flex: 1 },
  lossRow: { flexDirection: 'row', gap: 12, marginTop: 4, flexWrap: 'wrap' },
  lossDeath: { fontSize: 11, fontWeight: '800', color: '#CC0000' },
  lossInjured: { fontSize: 11, fontWeight: '800', color: '#E65100' },
  lossMissing: { fontSize: 11, fontWeight: '800', color: '#6200EA' },
  desc: { fontSize: 13, color: '#3E5060', lineHeight: 18, marginTop: 4 },

  // FAB
  fab: {
    position: 'absolute', right: 16, bottom: 24,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: GOV_RED,
    justifyContent: 'center', alignItems: 'center',
    elevation: 6,
  },
});
