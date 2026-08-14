import React, { useEffect, useState } from 'react';
import {
  View, StyleSheet, ScrollView, TouchableOpacity,
  Alert, Linking, Platform, StatusBar,
} from 'react-native';
import { Surface, Text, Button, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store';
import { useTranslation } from 'react-i18next';
import i18n, { changeAppLanguage } from '../i18n';
import { useIsFocused } from '@react-navigation/native';

const GOV_BLUE      = '#003087';
const GOV_BLUE_DARK = '#001F5C';
const GOV_ORANGE    = '#FF6600';
const GOV_RED       = '#CC0000';
const GOV_GREEN     = '#007A3D';

export default function CitizenMenuScreen({ navigation }: any) {
  const theme = useTheme();
  const { t } = useTranslation();
  const isFocused = useIsFocused();

  const [userName, setUserName] = useState('Citizen');
  const [userPhone, setUserPhone] = useState('');
  const [showHelplines, setShowHelplines] = useState(false);

  useEffect(() => {
    if (isFocused) {
      loadUserInfo();
    }
  }, [isFocused]);

  const loadUserInfo = async () => {
    const name = await SecureStore.getItemAsync('userName');
    const phone = await SecureStore.getItemAsync('userPhone');
    if (name) setUserName(name);
    if (phone) setUserPhone(phone);
  };

  const handleLogout = async () => {
    Alert.alert(
      t('logout', 'Logout Confirmation'),
      'Are you sure you want to log out from the Citizen Portal?',
      [
        { text: t('cancel', 'Cancel'), style: 'cancel' },
        {
          text: t('logout', 'Logout'),
          style: 'destructive',
          onPress: async () => {
            await SecureStore.deleteItemAsync('jwt');
            await SecureStore.deleteItemAsync('userRole');
            await SecureStore.deleteItemAsync('userName');
            await SecureStore.deleteItemAsync('userPhone');
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
          },
        },
      ]
    );
  };

  const callNumber = (phone: string) => {
    Linking.openURL(`tel:${phone}`).catch(() => {
      Alert.alert(t('error', 'Error'), 'Unable to initiate phone call');
    });
  };

  const MenuItem = ({ icon, title, subtitle, onPress, badge, color }: any) => (
    <TouchableOpacity style={styles.menuCard} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.iconContainer, { backgroundColor: (color || GOV_BLUE) + '15' }]}>
        <MaterialCommunityIcons name={icon} size={24} color={color || GOV_BLUE} />
      </View>
      <View style={styles.menuText}>
        <View style={styles.titleRow}>
          <Text style={styles.menuTitle}>{title}</Text>
          {badge && (
            <View style={[styles.badgeContainer, { backgroundColor: badge.bg }]}>
              <Text style={[styles.badgeText, { color: badge.color }]}>{badge.text}</Text>
            </View>
          )}
        </View>
        <Text style={styles.menuSubtitle}>{subtitle}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={22} color="#94A3B8" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={GOV_BLUE_DARK} />

      {/* ── Top Header ────────────────────────────────────────── */}
      <LinearGradient colors={[GOV_BLUE_DARK, GOV_BLUE]} style={styles.headerGradient}>
        <View style={styles.govBanner}>
          <MaterialCommunityIcons name="star-circle" size={16} color={GOV_ORANGE} />
          <Text style={styles.govBannerText}>SDRF · Himachal Pradesh</Text>
          <MaterialCommunityIcons name="star-circle" size={16} color={GOV_ORANGE} />
        </View>

        <View style={styles.profileRow}>
          <View style={styles.avatarCircle}>
            <MaterialCommunityIcons name="account" size={36} color="white" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.profileName} numberOfLines={1}>{userName}</Text>
            <Text style={styles.profilePhone}>{userPhone ? `+91 ${userPhone}` : 'Verified Citizen'}</Text>
            <View style={styles.roleBadge}>
              <MaterialCommunityIcons name="shield-check" size={12} color="#4ADE80" />
              <Text style={styles.roleBadgeText}>{t('citizen_portal', 'CITIZEN / VOLUNTEER')}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* ── Main Menu Section ─────────────────────────────────── */}
        <Text style={styles.sectionTitle}>{t('quick_actions', 'Main Services')}</Text>

        <MenuItem
          icon="account-hard-hat"
          title={t('volunteer_skills', 'Volunteer Portal & Skills')}
          subtitle={t('volunteer_sub', 'Register skills, Aadhaar & certifications for emergency dispatch')}
          color={GOV_GREEN}
          badge={{ text: 'JOIN NOW', bg: '#DCFCE7', color: GOV_GREEN }}
          onPress={() => navigation.navigate('CitizenVolunteer')}
        />

        <MenuItem
          icon="newspaper"
          title={t('bulletins', 'Official SDRF Bulletins')}
          subtitle={t('recent_directives', 'Read live emergency advisories and weather alerts')}
          color="#2563EB"
          onPress={() => navigation.navigate('Updates')}
        />

        <MenuItem
          icon="book-open-page-variant"
          title={t('guides', 'Emergency Survival Guides')}
          subtitle="SOPs & first aid guidelines for floods & landslides"
          color="#7C3AED"
          onPress={() => navigation.navigate('Guides')}
        />

        <MenuItem
          icon="map-search"
          title={t('map', 'Live Emergency Map')}
          subtitle="Track active disaster pins across Himachal Pradesh"
          color="#D97706"
          onPress={() => navigation.navigate('CitizenMap')}
        />

        {/* ── Emergency Helplines Section ───────────────────────── */}
        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>{t('emergency_helplines', 'Emergency Helplines')}</Text>

        <Surface style={styles.cardSurface} elevation={1}>
          <TouchableOpacity
            style={styles.helplineHeader}
            onPress={() => setShowHelplines(!showHelplines)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#FEE2E2' }]}>
              <MaterialCommunityIcons name="phone-classic" size={24} color={GOV_RED} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuTitle}>{t('emergency_helplines', 'Disaster & Emergency Contacts')}</Text>
              <Text style={styles.menuSubtitle}>SDRF Control Room, Police, Ambulance & Fire</Text>
            </View>
            <MaterialCommunityIcons
              name={showHelplines ? 'chevron-up' : 'chevron-down'}
              size={24}
              color="#64748B"
            />
          </TouchableOpacity>

          {showHelplines && (
            <View style={styles.helplineList}>
              <TouchableOpacity style={styles.helplineRow} onPress={() => callNumber('1070')}>
                <View style={styles.helplineInfo}>
                  <Text style={styles.helplineName}>{t('sdrf_control', 'HP State Disaster Management')}</Text>
                  <Text style={styles.helplineNumber}>1070 (Toll Free)</Text>
                </View>
                <MaterialCommunityIcons name="phone" size={20} color={GOV_GREEN} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.helplineRow} onPress={() => callNumber('112')}>
                <View style={styles.helplineInfo}>
                  <Text style={styles.helplineName}>{t('national_helpline', 'National Emergency Helpline')}</Text>
                  <Text style={styles.helplineNumber}>112</Text>
                </View>
                <MaterialCommunityIcons name="phone" size={20} color={GOV_GREEN} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.helplineRow} onPress={() => callNumber('108')}>
                <View style={styles.helplineInfo}>
                  <Text style={styles.helplineName}>{t('ambulance', 'Medical Ambulance Service')}</Text>
                  <Text style={styles.helplineNumber}>108</Text>
                </View>
                <MaterialCommunityIcons name="phone" size={20} color={GOV_GREEN} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.helplineRow} onPress={() => callNumber('101')}>
                <View style={styles.helplineInfo}>
                  <Text style={styles.helplineName}>{t('fire', 'Fire Rescue Command')}</Text>
                  <Text style={styles.helplineNumber}>101</Text>
                </View>
                <MaterialCommunityIcons name="phone" size={20} color={GOV_GREEN} />
              </TouchableOpacity>
            </View>
          )}
        </Surface>

        {/* ── Settings & Language ──────────────────────────────── */}
        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>{t('settings', 'App Settings')}</Text>

        <Surface style={styles.cardSurface} elevation={1}>
          <View style={styles.settingsHeader}>
            <MaterialCommunityIcons name="translate" size={22} color={GOV_BLUE} />
            <Text style={styles.settingsTitle}>{t('language', 'App Language / भाषा')}</Text>
          </View>
          <View style={styles.languageToggle}>
            <Button
              mode={i18n.language === 'en' ? 'contained' : 'outlined'}
              onPress={() => changeAppLanguage('en')}
              style={styles.langBtn}
              buttonColor={i18n.language === 'en' ? GOV_BLUE : undefined}
            >
              {t('english', 'English')}
            </Button>
            <Button
              mode={i18n.language === 'hi' ? 'contained' : 'outlined'}
              onPress={() => changeAppLanguage('hi')}
              style={styles.langBtn}
              buttonColor={i18n.language === 'hi' ? GOV_BLUE : undefined}
            >
              {t('hindi', 'हिन्दी (Hindi)')}
            </Button>
          </View>
        </Surface>

        {/* ── Logout Button ────────────────────────────────────── */}
        <TouchableOpacity style={styles.logoutCard} onPress={handleLogout} activeOpacity={0.8}>
          <MaterialCommunityIcons name="logout" size={22} color={GOV_RED} />
          <Text style={styles.logoutText}>{t('logout', 'Logout from Citizen Portal')}</Text>
        </TouchableOpacity>

        <Text style={styles.appFooterText}>
          Suraksha Sarthi v2.0 · HP SDRF Citizen Command{'\n'}
          Official State Emergency Response System
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4FF' },

  headerGradient: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 44 : 56,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  govBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, marginBottom: 16,
  },
  govBannerText: { color: 'white', fontSize: 11, fontWeight: '800', letterSpacing: 0.8 },

  profileRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatarCircle: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)',
  },
  profileName: { color: 'white', fontSize: 20, fontWeight: '900' },
  profilePhone: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 1 },
  roleBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 12, marginTop: 6, alignSelf: 'flex-start',
  },
  roleBadgeText: { color: '#4ADE80', fontSize: 9, fontWeight: '800', letterSpacing: 0.6 },

  scrollContent: { padding: 16, paddingBottom: 100 },

  sectionTitle: {
    fontSize: 12, fontWeight: '800', color: '#64748B',
    textTransform: 'uppercase', letterSpacing: 1,
    marginBottom: 10, marginLeft: 2,
  },

  menuCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'white', borderRadius: 14,
    padding: 16, marginBottom: 10,
    elevation: 2, borderWidth: 1, borderColor: '#E2E8F0',
  },
  iconContainer: {
    width: 44, height: 44, borderRadius: 22,
    justifyContent: 'center', alignItems: 'center',
    marginRight: 14,
  },
  menuText: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  menuTitle: { fontSize: 15, fontWeight: '800', color: '#0F172A' },
  menuSubtitle: { fontSize: 12, color: '#64748B', marginTop: 2, lineHeight: 16 },

  badgeContainer: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  badgeText: { fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },

  cardSurface: {
    backgroundColor: 'white', borderRadius: 14,
    padding: 16, marginBottom: 10,
    borderWidth: 1, borderColor: '#E2E8F0',
  },
  helplineHeader: { flexDirection: 'row', alignItems: 'center' },
  helplineList: { marginTop: 14, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  helplineRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F8FAFC',
  },
  helplineInfo: { flex: 1 },
  helplineName: { fontSize: 13, fontWeight: '700', color: '#1E293B' },
  helplineNumber: { fontSize: 12, color: GOV_BLUE, fontWeight: '800', marginTop: 1 },

  settingsHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, gap: 10 },
  settingsTitle: { fontSize: 14, fontWeight: '800', color: '#0F172A' },
  languageToggle: { flexDirection: 'row', gap: 10 },
  langBtn: { flex: 1, borderRadius: 8 },

  logoutCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#FEF2F2', borderRadius: 14,
    paddingVertical: 14, marginTop: 14,
    borderWidth: 1.5, borderColor: '#FCA5A5',
  },
  logoutText: { color: GOV_RED, fontSize: 15, fontWeight: '800' },

  appFooterText: {
    textAlign: 'center', fontSize: 10, color: '#94A3B8', marginTop: 24, lineHeight: 16,
  },
});
