import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Surface, Text, TouchableRipple, useTheme, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

export default function MenuScreen({ navigation }: any) {
  const theme = useTheme();
  const { t } = useTranslation();

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('jwt');
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  const MenuItem = ({ icon, title, subtitle, route }: any) => (
    <TouchableRipple
      onPress={() => navigation.navigate(route)}
      rippleColor="rgba(0, 0, 0, .1)"
      style={styles.menuItemRipple}
    >
      <Surface style={styles.menuItem} elevation={1}>
        <View style={[styles.iconContainer, { backgroundColor: theme.colors.primaryContainer + '20' }]}>
          <MaterialCommunityIcons name={icon} size={28} color={theme.colors.primary} />
        </View>
        <View style={styles.menuText}>
          <Text style={styles.menuTitle}>{title}</Text>
          <Text style={styles.menuSubtitle}>{subtitle}</Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={24} color="#ccc" />
      </Surface>
    </TouchableRipple>
  );

  return (
    <View style={styles.container}>
      {/* Premium Gradient Header block */}
      <LinearGradient colors={['#0f4a30', '#1c6f4a']} style={styles.headerGradient}>
        <View style={styles.headerStatsRow}>
          <View>
            <Text style={styles.headerSubtitle}>SDRF PORTAL</Text>
            <Text style={styles.headerTitle}>Officer Command</Text>
          </View>
          <MaterialCommunityIcons name="shield-check" size={45} color="rgba(255,255,255,0.9)" />
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Extended Features</Text>

        <MenuItem
          icon="newspaper"
          title="Daily Bulletins"
          subtitle="Read latest directives and news"
          route="Updates"
        />

        <MenuItem
          icon="account-group"
          title="Volunteer Network"
          subtitle="Search and dispatch registered volunteers"
          route="Volunteers"
        />

        <MenuItem
          icon="book-open-page-variant"
          title="Emergency Guidelines"
          subtitle="SOPs for floods, landslides, and quakes"
          route="Guides"
        />

        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>{t('settings', 'Settings')}</Text>
        <Surface style={styles.settingsCard} elevation={1}>
          <View style={styles.settingsHeader}>
            <MaterialCommunityIcons name="translate" size={24} color={theme.colors.primary} />
            <Text style={styles.settingsTitle}>{t('language', 'Language')}</Text>
          </View>
          <View style={styles.languageToggle}>
            <Button
              mode={i18n.language === 'en' ? 'contained' : 'outlined'}
              onPress={() => i18n.changeLanguage('en')}
              style={styles.langBtn}
            >
              {t('english', 'English')}
            </Button>
            <Button
              mode={i18n.language === 'hi' ? 'contained' : 'outlined'}
              onPress={() => i18n.changeLanguage('hi')}
              style={styles.langBtn}
            >
              {t('hindi', 'Hindi (हिन्दी)')}
            </Button>
          </View>
        </Surface>

        <Button 
          mode="outlined" 
          icon="logout" 
          onPress={handleLogout}
          textColor={theme.colors.error}
          style={styles.logoutBtn}
          contentStyle={{ paddingVertical: 8 }}
        >
          Logout from Command
        </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  headerGradient: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontWeight: 'bold',
    letterSpacing: 1,
    fontSize: 12,
  },
  headerTitle: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 2,
  },
  headerStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scrollContent: { padding: 16, paddingBottom: 40 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#888',
    textTransform: 'uppercase',
    marginBottom: 12,
    marginLeft: 4,
  },
  menuItemRipple: {
    borderRadius: 16,
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 16,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
  },
  menuSubtitle: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
  },
  settingsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  settingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 12,
    color: '#333',
  },
  languageToggle: {
    flexDirection: 'row',
    gap: 10,
  },
  langBtn: {
    flex: 1,
    borderRadius: 8,
  },
  logoutBtn: {
    marginTop: 10,
    borderColor: '#d32f2f',
    borderWidth: 1.5,
  }
});
