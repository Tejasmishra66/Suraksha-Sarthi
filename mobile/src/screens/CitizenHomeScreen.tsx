import React, { useEffect, useState } from 'react';
import {
  View, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Platform, Dimensions,
} from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { useTranslation } from 'react-i18next';
import { api } from '../api';
import OfflineQueueBanner from '../components/OfflineQueueBanner';

const { width } = Dimensions.get('window');

const GOV_BLUE      = '#003087';
const GOV_BLUE_DARK = '#001F5C';
const GOV_ORANGE    = '#FF6600';
const GOV_RED       = '#CC0000';
const GOV_GREEN     = '#007A3D';
const BG            = '#F0F4FF';

// ─── Quick Action Card ───────────────────────────────────────────
function ActionCard({ icon, label, sub, color, bg, onPress }: any) {
  return (
    <TouchableOpacity style={[styles.actionCard, { backgroundColor: bg }]} onPress={onPress} activeOpacity={0.82}>
      <View style={[styles.actionIconBox, { backgroundColor: color + '22' }]}>
        <MaterialCommunityIcons name={icon} size={28} color={color} />
      </View>
      <Text style={[styles.actionLabel, { color }]}>{label}</Text>
      <Text style={styles.actionSub} numberOfLines={2}>{sub}</Text>
    </TouchableOpacity>
  );
}

// ─── Stat Pill ───────────────────────────────────────────────────
function StatPill({ icon, value, label, color }: any) {
  return (
    <View style={styles.statPill}>
      <MaterialCommunityIcons name={icon} size={22} color={color} />
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function CitizenHomeScreen() {
  const navigation  = useNavigation<any>();
  const isFocused   = useIsFocused();
  const { t }       = useTranslation();

  const [userName,  setUserName]  = useState('Citizen');
  const [loading,   setLoading]   = useState(true);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [bulletins, setBulletins] = useState<any[]>([]);
  const [volunteerStatus, setVolunteerStatus] = useState<string | null>(null);

  useEffect(() => {
    if (isFocused) { loadUser(); fetchData(); }
  }, [isFocused]);

  const loadUser = async () => {
    const name = await SecureStore.getItemAsync('userName');
    if (name) setUserName(name);
  };

  const fetchData = async () => {
    try {
      const [incRes, bullRes, volRes] = await Promise.all([
        api.get('/incidents'),
        api.get('/bulletins'),
        api.get('/volunteers/me').catch(() => ({ data: null })),
      ]);
      setIncidents(Array.isArray(incRes.data) ? incRes.data : (incRes.data?.data || []));
      setBulletins(bullRes.data?.data || []);
      if (volRes.data?.registered) setVolunteerStatus(volRes.data.status);
    } catch { } finally { setLoading(false); }
  };

  const activeCount = incidents.filter(i => (i.status || '').toLowerCase() === 'active').length;
  const latestBulletins = bulletins.slice(0, 2);

  // Volunteer status badge
  const volBadge = volunteerStatus
    ? {
        pending:  { color: '#D97706', bg: '#FEF3C7', label: 'Volunteer Pending Approval' },
        approved: { color: GOV_GREEN, bg: '#F0FDF4', label: 'Active Volunteer ✓' },
        rejected: { color: GOV_RED,   bg: '#FEF2F2', label: 'Volunteer Application Rejected' },
      }[volunteerStatus] || null
    : null;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={GOV_BLUE_DARK} />

      {/* ── Top Government Header ───────────────────────────────── */}
      <LinearGradient colors={[GOV_BLUE_DARK, GOV_BLUE]} style={styles.header}>
        <View style={styles.govBanner}>
          <MaterialCommunityIcons name="star-circle" size={18} color={GOV_ORANGE} />
          <Text style={styles.govName}>SDRF · Himachal Pradesh</Text>
          <MaterialCommunityIcons name="star-circle" size={18} color={GOV_ORANGE} />
        </View>

        <View style={styles.headerBody}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>{t('namaste', 'Namaste,')}</Text>
            <Text style={styles.userName} numberOfLines={1}>{userName}</Text>
            <Text style={styles.roleTag}>{t('citizen_portal', 'CITIZEN / VOLUNTEER PORTAL')}</Text>
          </View>
          <View style={styles.avatarCircle}>
            <MaterialCommunityIcons name="account" size={32} color="white" />
          </View>
        </View>

        {/* Stats Row */}
        {!loading && (
          <View style={styles.statsRow}>
            <StatPill icon="alert-circle" value={activeCount || incidents.length} label={t('active_incidents', 'Active Incidents')} color={GOV_ORANGE} />
            <View style={styles.statDivider} />
            <StatPill icon="newspaper" value={bulletins.length} label={t('bulletins', 'Bulletins')} color="#60A5FA" />
            <View style={styles.statDivider} />
            <StatPill icon="shield-check" value="HP SDRF" label="Verified" color="#4ADE80" />
          </View>
        )}
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <OfflineQueueBanner />

        {/* Volunteer Status Banner */}
        {volBadge && (
          <TouchableOpacity
            style={[styles.volBanner, { backgroundColor: volBadge.bg, borderColor: volBadge.color }]}
            onPress={() => navigation.navigate('CitizenVolunteer' as never)}
          >
            <MaterialCommunityIcons name="account-hard-hat" size={20} color={volBadge.color} />
            <Text style={[styles.volBannerText, { color: volBadge.color }]}>{volBadge.label}</Text>
            <MaterialCommunityIcons name="chevron-right" size={18} color={volBadge.color} />
          </TouchableOpacity>
        )}

        {/* SOS Emergency Button */}
        <TouchableOpacity
          style={styles.sosCard}
          onPress={() => navigation.navigate('ReportEmergency' as never)}
          activeOpacity={0.88}
        >
          <LinearGradient colors={[GOV_RED, '#990000']} style={styles.sosGradient}>
            <View style={styles.sosPulse}>
              <MaterialCommunityIcons name="alert-decagram" size={36} color="white" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.sosTitle}>{t('emergency_sos', 'EMERGENCY SOS')}</Text>
              <Text style={styles.sosSub}>{t('sos_sub', 'Report a disaster · Alert SDRF instantly')}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={26} color="rgba(255,255,255,0.8)" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>{t('quick_actions', 'Quick Actions')}</Text>
        <View style={styles.actionGrid}>
          <ActionCard
            icon="map-marker-radius"
            label={t('map', 'Live Map')}
            sub="View active incidents on map"
            color="#2563EB"
            bg="#EFF6FF"
            onPress={() => navigation.navigate('CitizenMap' as never)}
          />
          <ActionCard
            icon="bell-alert"
            label={t('alerts', 'Alerts')}
            sub="Incident & emergency feed"
            color="#DC2626"
            bg="#FEF2F2"
            onPress={() => navigation.navigate('CitizenAlerts' as never)}
          />
          <ActionCard
            icon="account-hard-hat"
            label={t('volunteer', 'Volunteer')}
            sub={t('volunteer_sub', 'Register your skills & help')}
            color={GOV_GREEN}
            bg="#F0FDF4"
            onPress={() => navigation.navigate('CitizenVolunteer' as never)}
          />
          <ActionCard
            icon="book-open-variant"
            label={t('guides', 'Guides')}
            sub="Emergency survival SOPs"
            color="#7C3AED"
            bg="#F5F3FF"
            onPress={() => navigation.navigate('Guides' as never)}
          />
        </View>

        {/* Latest Bulletins */}
        {latestBulletins.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Latest Bulletins</Text>
            {latestBulletins.map((b: any, i: number) => (
              <View key={i} style={styles.bulletinCard}>
                <View style={styles.bulletinDot} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.bulletinCat}>{b.category?.toUpperCase() || 'ALERT'}</Text>
                  <Text style={styles.bulletinMsg} numberOfLines={2}>{b.message}</Text>
                </View>
              </View>
            ))}
          </>
        )}

        {loading && (
          <ActivityIndicator size="large" color={GOV_BLUE} style={{ marginTop: 40 }} />
        )}

        {/* Footer Note */}
        <Text style={styles.footerNote}>
          Suraksha Sarthi · HP State Disaster Response Force{'\n'}
          Citizen Portal v2.0
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },

  // ── Header ──────────────────────────────────────────────────────
  header: { paddingBottom: 16 },
  govBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingTop: Platform.OS === 'android' ? 42 : 56, paddingBottom: 8, gap: 8,
  },
  govName:   { color: 'white', fontSize: 11, fontWeight: '800', letterSpacing: 0.6 },
  headerBody: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 18, paddingTop: 4, paddingBottom: 10,
  },
  greeting:  { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '600' },
  userName:  { color: 'white', fontSize: 22, fontWeight: '900', marginTop: 2 },
  roleTag:   { color: GOV_ORANGE, fontSize: 10, fontWeight: '800', letterSpacing: 1, marginTop: 3 },
  avatarCircle: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)',
  },
  statsRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    marginHorizontal: 16, marginTop: 4,
    borderRadius: 12, paddingVertical: 10, paddingHorizontal: 16,
  },
  statPill:   { flex: 1, alignItems: 'center', gap: 3 },
  statValue:  { fontSize: 15, fontWeight: '900' },
  statLabel:  { color: 'rgba(255,255,255,0.6)', fontSize: 9, fontWeight: '700', textAlign: 'center' },
  statDivider: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.2)' },

  // ── Body ────────────────────────────────────────────────────────
  body: { padding: 16, paddingBottom: 100 },

  // Volunteer Status Banner
  volBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderWidth: 1.5, borderRadius: 10, padding: 12, marginBottom: 14,
  },
  volBannerText: { flex: 1, fontWeight: '700', fontSize: 13 },

  // SOS Card
  sosCard: { borderRadius: 14, overflow: 'hidden', marginBottom: 22, elevation: 6 },
  sosGradient: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 18, paddingHorizontal: 16, gap: 14,
  },
  sosPulse: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
  },
  sosTitle: { color: 'white', fontSize: 18, fontWeight: '900', letterSpacing: 0.5 },
  sosSub:   { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 2 },

  // Section Title
  sectionTitle: {
    fontSize: 12, fontWeight: '800', color: '#64748B',
    textTransform: 'uppercase', letterSpacing: 1,
    marginBottom: 12, marginLeft: 2,
  },

  // Action Grid
  actionGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24,
  },
  actionCard: {
    width: (width - 44) / 2, borderRadius: 14, padding: 16,
    elevation: 2,
  },
  actionIconBox: {
    width: 48, height: 48, borderRadius: 24,
    justifyContent: 'center', alignItems: 'center', marginBottom: 10,
  },
  actionLabel: { fontSize: 15, fontWeight: '900' },
  actionSub:   { fontSize: 11, color: '#64748B', marginTop: 3, lineHeight: 15 },

  // Bulletins
  bulletinCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    backgroundColor: 'white', borderRadius: 10, padding: 14,
    marginBottom: 10, elevation: 1,
  },
  bulletinDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: GOV_ORANGE, marginTop: 4 },
  bulletinCat: { fontSize: 9, fontWeight: '800', color: GOV_ORANGE, letterSpacing: 0.8 },
  bulletinMsg: { fontSize: 13, color: '#1A2027', marginTop: 2, lineHeight: 18 },

  // Footer
  footerNote: {
    textAlign: 'center', fontSize: 10, color: '#94A3B8', marginTop: 24, lineHeight: 16,
  },
});
