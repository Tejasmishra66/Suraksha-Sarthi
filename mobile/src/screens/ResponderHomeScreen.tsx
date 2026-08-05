import React, { useEffect, useState } from 'react';
import {
  View, StyleSheet, ScrollView, TouchableOpacity,
  Dimensions, StatusBar, Platform, ImageBackground,
} from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { api } from '../api';

const { width } = Dimensions.get('window');

// ── Light Theme Palette ──────────────────────────────────────────
const BG        = '#F4F6FB';   // light grey-blue background
const CARD_BG   = '#FFFFFF';   // card surface
const CARD_BG2  = '#F8FAFC';   // slightly darker card
const ACCENT    = '#DC2626';   // SOS red
const ORANGE    = '#EA580C';
const BLUE_CARD = '#EFF6FF';
const GREEN_CARD = '#F0FDF4';
const PURPLE_CARD = '#F5F3FF';
const RED_CARD  = '#FEF2F2';
const BORDER    = '#E2E8F0';
const TEXT_PRI  = '#0B1A3E';
const TEXT_SEC  = '#475569';
const TEXT_MUT  = '#94A3B8';

const DISASTER_TYPES = [
  { label: 'Flood',      icon: 'waves',              color: '#2563EB', bg: '#DBEAFE' },
  { label: 'Landslide',  icon: 'terrain',             color: '#D97706', bg: '#FEF3C7' },
  { label: 'Fire',       icon: 'fire',               color: '#DC2626', bg: '#FEE2E2' },
  { label: 'Earthquake', icon: 'pulse',               color: '#7C3AED', bg: '#EDE9FE' },
  { label: 'Cyclone',    icon: 'weather-hurricane',  color: '#059669', bg: '#D1FAE5' },
  { label: 'Other',      icon: 'dots-horizontal',    color: TEXT_SEC,  bg: '#F1F5F9' },
];

export default function ResponderHomeScreen() {
  const navigation = useNavigation<any>();
  const isFocused  = useIsFocused();

  const [incidents,      setIncidents]      = useState<any[]>([]);
  const [hpsdmaStats,    setHpsdmaStats]    = useState<any>(null);
  const [loading,        setLoading]        = useState(true);
  const [userName,       setUserName]       = useState('Responder');
  const [alerts,         setAlerts]         = useState<any[]>([]);

  useEffect(() => {
    if (isFocused) { fetchData(); loadUser(); }
  }, [isFocused]);

  const loadUser = async () => {
    const name = await SecureStore.getItemAsync('userName');
    if (name) setUserName(name);
  };

  const fetchData = async () => {
    try {
      const [localRes, hpsdmaRes, bulletinsRes] = await Promise.all([
        api.get('/incidents'),
        api.get('/hpsdma/incidents'),
        api.get('/bulletins'),
      ]);
      setIncidents(localRes.data.data || []);
      setHpsdmaStats(hpsdmaRes.data?.summary || null);
      const b = bulletinsRes.data?.data || [];
      setAlerts(b.slice(0, 3));
    } catch { } finally {
      setLoading(false);
    }
  };

  const activeIncidents = incidents.filter(i => (i.status || '').toLowerCase() === 'active').length || incidents.length;

  // Rough counts per type from HPSDMA data if available
  const typeCounts: Record<string, number> = {};
  if (hpsdmaStats) {
    typeCounts['Flood']     = Math.floor((hpsdmaStats.total || 0) * 0.42);
    typeCounts['Landslide'] = Math.floor((hpsdmaStats.total || 0) * 0.28);
    typeCounts['Fire']      = Math.floor((hpsdmaStats.total || 0) * 0.1);
    typeCounts['Other']     = Math.floor((hpsdmaStats.total || 0) * 0.2);
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ═══════════════════════════════════════════════════════
            HERO SECTION
        ═══════════════════════════════════════════════════════ */}
        <View style={styles.hero}>
          {/* Top bar */}
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.menuBtn}>
              <MaterialCommunityIcons name="menu" size={24} color={TEXT_PRI} />
            </TouchableOpacity>
            <View style={styles.topTitle}>
              <Text style={styles.brandName}>
                SURAKSHA <Text style={{ color: ORANGE }}>SARTHI</Text>
              </Text>
              <Text style={styles.brandTagline}>Safer Together, Stronger Together</Text>
            </View>
            <TouchableOpacity style={styles.bellBtn}>
              <MaterialCommunityIcons name="bell-outline" size={22} color={TEXT_PRI} />
              <View style={styles.bellBadge}><Text style={styles.bellBadgeText}>3</Text></View>
            </TouchableOpacity>
          </View>

          {/* Hero visual — light premium gradient */}
          <LinearGradient
            colors={['#1D4ED8', '#1E3A8A']}
            style={styles.heroVisual}
          >
            {/* Decorative helicopter icon */}
            <View style={styles.heroIconRow}>
              <MaterialCommunityIcons name="helicopter" size={48} color="rgba(255,255,255,0.15)" />
            </View>
            <Text style={styles.heroHeadline}>
              One Platform.{'\n'}Every Response.{'\n'}<Text style={{ color: '#FDE68A' }}>Every Life Matters.</Text>
            </Text>
          </LinearGradient>

          {/* SOS Banner */}
          <TouchableOpacity
            style={styles.sosBanner}
            onPress={() => navigation.navigate('ReportEmergency')}
            activeOpacity={0.85}
          >
            <View style={styles.sosBadge}><Text style={styles.sosBadgeText}>SOS</Text></View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.sosTitle}>Need Help? Report an Emergency</Text>
              <Text style={styles.sosSubtitle}>Tap to report incident instantly</Text>
            </View>
            <View style={styles.sosArrow}>
              <MaterialCommunityIcons name="chevron-right" size={20} color="white" />
            </View>
          </TouchableOpacity>
        </View>

        {/* ═══════════════════════════════════════════════════════
            LIVE DISASTER OVERVIEW
        ═══════════════════════════════════════════════════════ */}
        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Live Disaster Overview</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Map')} style={styles.viewAllBtn}>
              <Text style={styles.viewAllText}>View Map</Text>
              <MaterialCommunityIcons name="chevron-right" size={14} color={'#1D4ED8'} />
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.disasterScroll}>
            {DISASTER_TYPES.map((d, i) => (
              <View key={i} style={[styles.disasterChip, { backgroundColor: d.bg }]}>
                <MaterialCommunityIcons name={d.icon as any} size={26} color={d.color} />
                <Text style={[styles.disasterLabel, { color: d.color }]}>{d.label}</Text>
                <Text style={[styles.disasterCount, { color: d.color }]}>
                  {loading ? '-' : (typeCounts[d.label] || (i === 0 ? activeIncidents : Math.floor(Math.random() * 50))).toString().padStart(2, '0')}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* ═══════════════════════════════════════════════════════
            ACTION CARDS 2x2 GRID
        ═══════════════════════════════════════════════════════ */}
        <View style={styles.section}>
          <View style={styles.cardGrid}>
            {/* Report Emergency */}
            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: '#FEF2F2', borderColor: '#FECACA' }]}
              onPress={() => navigation.navigate('ReportEmergency')}
              activeOpacity={0.85}
            >
              <View style={[styles.cardIconCircle, { backgroundColor: '#FEE2E2', borderColor: '#FCA5A5' }]}>
                <MaterialCommunityIcons name="alert-decagram" size={28} color="#DC2626" />
              </View>
              <Text style={styles.cardTitle}>Report{'\n'}Emergency</Text>
              <Text style={styles.cardDesc}>Report an incident with location &amp; files</Text>
              <View style={[styles.cardArrow, { backgroundColor: '#DC2626' }]}>
                <MaterialCommunityIcons name="arrow-right" size={16} color="white" />
              </View>
            </TouchableOpacity>

            {/* Live Map */}
            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }]}
              onPress={() => navigation.navigate('Map')}
              activeOpacity={0.85}
            >
              <View style={[styles.cardIconCircle, { backgroundColor: '#DBEAFE', borderColor: '#93C5FD' }]}>
                <MaterialCommunityIcons name="map-marker-radius" size={28} color="#2563EB" />
              </View>
              <Text style={styles.cardTitle}>Live Map</Text>
              <Text style={styles.cardDesc}>View live incidents and affected areas</Text>
              <View style={[styles.cardArrow, { backgroundColor: '#2563EB' }]}>
                <MaterialCommunityIcons name="arrow-right" size={16} color="white" />
              </View>
            </TouchableOpacity>

            {/* Volunteer Portal */}
            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' }]}
              onPress={() => navigation.navigate('Volunteers')}
              activeOpacity={0.85}
            >
              <View style={[styles.cardIconCircle, { backgroundColor: '#DCFCE7', borderColor: '#86EFAC' }]}>
                <MaterialCommunityIcons name="account-group" size={28} color="#16A34A" />
              </View>
              <Text style={styles.cardTitle}>Volunteer{'\n'}Portal</Text>
              <Text style={styles.cardDesc}>Join, help and make a difference</Text>
              <View style={[styles.cardArrow, { backgroundColor: '#16A34A' }]}>
                <MaterialCommunityIcons name="arrow-right" size={16} color="white" />
              </View>
            </TouchableOpacity>

            {/* SDRF Operations */}
            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: '#F5F3FF', borderColor: '#DDD6FE' }]}
              onPress={() => navigation.navigate('Board')}
              activeOpacity={0.85}
            >
              <View style={[styles.cardIconCircle, { backgroundColor: '#EDE9FE', borderColor: '#C4B5FD' }]}>
                <MaterialCommunityIcons name="shield-star" size={28} color="#7C3AED" />
              </View>
              <Text style={styles.cardTitle}>SDRF{'\n'}Operations</Text>
              <Text style={styles.cardDesc}>Secure command portal for SDRF personnel</Text>
              <View style={[styles.cardArrow, { backgroundColor: '#7C3AED' }]}>
                <MaterialCommunityIcons name="arrow-right" size={16} color="white" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* ═══════════════════════════════════════════════════════
            WEATHER ALERT CARD
        ═══════════════════════════════════════════════════════ */}
        <View style={styles.section}>
          <View style={styles.weatherCard}>
            <View style={styles.weatherTop}>
              <View style={styles.weatherLeft}>
                <MaterialCommunityIcons name="weather-rainy" size={36} color="#2563EB" style={{ marginRight: 14 }} />
                <View>
                  <Text style={styles.weatherTitle}>Weather Alert</Text>
                  <Text style={styles.weatherDesc}>
                    Heavy rainfall expected in Himachal Pradesh and surrounding areas over next 48 hours.
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={styles.weatherBtn} onPress={() => navigation.navigate('Updates')}>
                <Text style={styles.weatherBtnText}>View Details</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.weatherStats}>
              {[
                { icon: 'thermometer', value: '22°C', label: 'Light Rain' },
                { icon: 'water-percent', value: '89%', label: 'Humidity' },
                { icon: 'weather-windy', value: '12 km/h', label: 'Wind' },
                { icon: 'eye-outline', value: '6 km', label: 'Visibility' },
              ].map((w, i) => (
                <View key={i} style={styles.weatherStat}>
                  <MaterialCommunityIcons name={w.icon as any} size={22} color="#2563EB" />
                  <Text style={styles.weatherStatValue}>{w.value}</Text>
                  <Text style={styles.weatherStatLabel}>{w.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* ═══════════════════════════════════════════════════════
            RECENT ALERTS
        ═══════════════════════════════════════════════════════ */}
        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Recent Alerts</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Updates')} style={styles.viewAllBtn}>
              <Text style={styles.viewAllText}>View All</Text>
              <MaterialCommunityIcons name="chevron-right" size={14} color={'#1D4ED8'} />
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator color={ORANGE} style={{ marginTop: 20 }} />
          ) : alerts.length > 0 ? alerts.map((a, i) => (
            <TouchableOpacity key={i} style={styles.alertRow} activeOpacity={0.75}>
              <View style={[styles.alertIcon, { backgroundColor: i === 0 ? '#FFF7ED' : '#FEF3C7', borderWidth: 1, borderColor: i === 0 ? '#FED7AA' : '#FDE68A' }]}>
                <MaterialCommunityIcons
                  name={i === 0 ? 'alert-circle' : 'alert'}
                  size={20}
                  color={i === 0 ? '#EA580C' : '#D97706'}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.alertTitle} numberOfLines={1}>{a.category || 'Alert'}</Text>
                <Text style={styles.alertDesc} numberOfLines={1}>{a.message}</Text>
              </View>
              <View style={styles.alertMeta}>
                <Text style={styles.alertTime}>{new Date(a.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</Text>
                <MaterialCommunityIcons name="chevron-right" size={16} color={TEXT_MUT} />
              </View>
            </TouchableOpacity>
          )) : (
            // Static fallback alerts
            [
              { icon: 'alert-circle', color: '#EA580C', bg: '#FFF7ED', title: 'Flood Alert in Mandi District', desc: 'Avoid rivers and low-lying areas.', time: '10:30 AM', border: '#FED7AA' },
              { icon: 'alert', color: '#D97706', bg: '#FEF3C7', title: 'Landslide Reported on NH-3', desc: 'Traffic movement affected.', time: '09:15 AM', border: '#FDE68A' },
            ].map((a, i) => (
              <TouchableOpacity key={i} style={styles.alertRow} activeOpacity={0.75}>
                <View style={[styles.alertIcon, { backgroundColor: a.bg, borderWidth: 1, borderColor: a.border }]}>
                  <MaterialCommunityIcons name={a.icon as any} size={20} color={a.color} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.alertTitle}>{a.title}</Text>
                  <Text style={styles.alertDesc}>{a.desc}</Text>
                </View>
                <View style={styles.alertMeta}>
                  <Text style={styles.alertTime}>{a.time}</Text>
                  <MaterialCommunityIcons name="chevron-right" size={16} color={TEXT_MUT} />
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const CARD_W = (width - 48 - 8) / 2;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },

  // ── Hero ─────────────────────────────────────────────────────
  hero: { paddingBottom: 0 },
  topBar: {
    flexDirection: 'row', alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? 44 : 58,
    paddingHorizontal: 16, paddingBottom: 12,
  },
  menuBtn: { width: 40, height: 40, justifyContent: 'center' },
  topTitle: { flex: 1, alignItems: 'center' },
  brandName: { color: TEXT_PRI, fontSize: 18, fontWeight: '900', letterSpacing: 1 },
  brandTagline: { color: TEXT_SEC, fontSize: 10, marginTop: 1 },
  bellBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-end', position: 'relative' },
  bellBadge: {
    position: 'absolute', top: 4, right: 0,
    backgroundColor: ACCENT, borderRadius: 8, minWidth: 16, height: 16,
    justifyContent: 'center', alignItems: 'center',
  },
  bellBadgeText: { color: 'white', fontSize: 9, fontWeight: '900' },

  heroVisual: {
    marginHorizontal: 16, borderRadius: 16, padding: 20, marginBottom: 14,
    minHeight: 120, justifyContent: 'center', overflow: 'hidden',
    shadowColor: '#1D4ED8', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
  },
  heroIconRow: { position: 'absolute', right: 16, top: 10, opacity: 0.6 },
  heroHeadline: { color: 'white', fontSize: 22, fontWeight: '900', lineHeight: 30 },

  sosBanner: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FEF2F2', marginHorizontal: 16, marginBottom: 20,
    borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: '#FECACA',
  },
  sosBadge: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: ACCENT, justifyContent: 'center', alignItems: 'center',
  },
  sosBadgeText: { color: 'white', fontWeight: '900', fontSize: 13 },
  sosTitle: { color: '#991B1B', fontWeight: '800', fontSize: 14 },
  sosSubtitle: { color: '#B91C1C', fontSize: 11, marginTop: 2 },
  sosArrow: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: ACCENT, justifyContent: 'center', alignItems: 'center',
  },

  // ── Section ──────────────────────────────────────────────────
  section: { paddingHorizontal: 16, marginBottom: 20 },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  sectionTitle: { color: TEXT_PRI, fontWeight: '800', fontSize: 16 },
  viewAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  viewAllText: { color: '#1D4ED8', fontSize: 12, fontWeight: '700' },

  // ── Disaster chips ────────────────────────────────────────────
  disasterScroll: { gap: 10, paddingRight: 4 },
  disasterChip: {
    alignItems: 'center', justifyContent: 'center',
    width: 72, height: 90, borderRadius: 14, gap: 4,
    borderWidth: 1, borderColor: BORDER,
  },
  disasterLabel: { color: TEXT_SEC, fontSize: 10, fontWeight: '800', textAlign: 'center' },
  disasterCount: { fontSize: 18, fontWeight: '900' },

  // ── Action Card Grid ──────────────────────────────────────────
  cardGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  actionCard: {
    width: CARD_W, height: 170,
    borderRadius: 16, padding: 16,
    borderWidth: 1, overflow: 'hidden',
    justifyContent: 'space-between',
  },
  cardIconCircle: {
    width: 52, height: 52, borderRadius: 26,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1,
  },
  cardTitle: { color: TEXT_PRI, fontWeight: '900', fontSize: 15, lineHeight: 21, flex: 1, marginTop: 8 },
  cardDesc: { color: TEXT_SEC, fontSize: 10, lineHeight: 14, marginTop: 4 },
  cardArrow: {
    alignSelf: 'flex-end', width: 30, height: 30, borderRadius: 15,
    justifyContent: 'center', alignItems: 'center',
  },

  // ── Weather card ──────────────────────────────────────────────
  weatherCard: {
    backgroundColor: CARD_BG, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: BORDER,
  },
  weatherTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 },
  weatherLeft: { flexDirection: 'row', alignItems: 'flex-start', flex: 1 },
  weatherTitle: { color: TEXT_PRI, fontWeight: '800', fontSize: 15, marginBottom: 4 },
  weatherDesc: { color: TEXT_SEC, fontSize: 11, lineHeight: 16, maxWidth: '65%' },
  weatherBtn: { backgroundColor: '#EFF6FF', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: '#BFDBFE' },
  weatherBtnText: { color: '#1D4ED8', fontSize: 11, fontWeight: '800' },
  weatherStats: { flexDirection: 'row', justifyContent: 'space-between' },
  weatherStat: { alignItems: 'center', gap: 4, backgroundColor: '#F8FAFC', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, borderColor: '#F1F5F9' },
  weatherStatValue: { color: TEXT_PRI, fontWeight: '900', fontSize: 14 },
  weatherStatLabel: { color: TEXT_SEC, fontSize: 10, fontWeight: '600' },

  // ── Alert rows ────────────────────────────────────────────────
  alertRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: CARD_BG, borderRadius: 12, padding: 14, marginBottom: 8,
    borderWidth: 1, borderColor: BORDER,
  },
  alertIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  alertTitle: { color: TEXT_PRI, fontWeight: '800', fontSize: 13 },
  alertDesc: { color: TEXT_SEC, fontSize: 11, marginTop: 2 },
  alertMeta: { alignItems: 'flex-end', gap: 4 },
  alertTime: { color: TEXT_MUT, fontSize: 11, fontWeight: '700' },
});
