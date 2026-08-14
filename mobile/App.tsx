import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import * as SecureStore from 'expo-secure-store';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import './src/i18n'; // Boot & initialize i18n
import { theme } from './src/theme';

import HomepageScreen      from './src/screens/HomepageScreen';
import LoginScreen         from './src/screens/LoginScreen';
import DashboardScreen     from './src/screens/DashboardScreen';
import MapScreen           from './src/screens/MapScreen';
import EquipmentScreen     from './src/screens/EquipmentScreen';
import UpdatesScreen       from './src/screens/UpdatesScreen';
import VolunteersScreen    from './src/screens/VolunteersScreen';
import GuidesScreen        from './src/screens/GuidesScreen';
import ScannerScreen       from './src/screens/ScannerScreen';
import ReportEmergencyScreen from './src/screens/ReportEmergencyScreen';
import MenuScreen          from './src/screens/MenuScreen';
import ResponderHomeScreen from './src/screens/ResponderHomeScreen';
import SignupScreen        from './src/screens/SignupScreen';
import CitizenHomeScreen   from './src/screens/CitizenHomeScreen';
import CitizenVolunteerScreen from './src/screens/CitizenVolunteerScreen';
import CitizenMenuScreen   from './src/screens/CitizenMenuScreen';

const Stack = createNativeStackNavigator();
const Tab   = createBottomTabNavigator();

// ─── Dummy screen for the SOS tab slot ───────────────────────────
function EmptyScreen() {
  return <View style={{ flex: 1, backgroundColor: '#000' }} />;
}

// ─── Common tab bar styles ────────────────────────────────────────
const TAB_BAR_STYLE = {
  height: 64,
  paddingBottom: 10,
  paddingTop: 6,
  backgroundColor: '#0A0E1A',
  borderTopWidth: 1,
  borderTopColor: '#1E2640',
  elevation: 0,
};
const TAB_LABEL_STYLE = {
  fontSize: 10,
  fontWeight: '700' as const,
  letterSpacing: 0.3,
  marginTop: 4,
};

// ─────────────────────────────────────────────────────────────────
// ADMIN / SDRF TEAM TABS
// ─────────────────────────────────────────────────────────────────
function AdminTabs() {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color }) => {
          const icons: Record<string, [string, string]> = {
            AdminHome:      ['home',    'home-outline'],
            AdminAlerts:    ['bell',    'bell-outline'],
            AdminSOS:       ['phone',   'phone-outline'],
            AdminResources: ['tools',   'tools'],
            AdminMenu:      ['menu',    'menu-outline'],
          };
          const [a, i] = icons[route.name] || ['help-circle', 'help-circle-outline'];
          return (
            <MaterialCommunityIcons
              name={(focused ? a : i) as any}
              size={24}
              color={color}
            />
          );
        },
        tabBarActiveTintColor:   '#FF4500',
        tabBarInactiveTintColor: '#8892B0',
        tabBarStyle:             TAB_BAR_STYLE,
        tabBarLabelStyle:        TAB_LABEL_STYLE,
      })}
    >
      <Tab.Screen name="AdminHome"   component={ResponderHomeScreen} options={{ title: t('home', 'Home') }} />
      <Tab.Screen name="AdminAlerts" component={DashboardScreen}     options={{ title: t('alerts', 'Alerts') }} />

      {/* SOS floating button */}
      <Tab.Screen
        name="AdminSOS"
        component={EmptyScreen}
        options={{
          title: '',
          tabBarIcon: () => null,
          tabBarButton: (_props) => (
            <SOSButton tintColor="#FF3300" />
          ),
        }}
      />

      <Tab.Screen name="AdminResources" component={EquipmentScreen} options={{ title: t('resources', 'Resources') }} />
      <Tab.Screen name="AdminMenu"      component={MenuScreen}       options={{ title: t('menu', 'Menu') }} />
    </Tab.Navigator>
  );
}

// ─────────────────────────────────────────────────────────────────
// CITIZEN / VOLUNTEER TABS (No Volunteer tab in bottom line, replaced by Menu)
// ─────────────────────────────────────────────────────────────────
function CitizenTabs() {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color }) => {
          const icons: Record<string, [string, string]> = {
            CitizenHome:   ['home',             'home-outline'],
            CitizenAlerts: ['bell-alert',        'bell-alert-outline'],
            CitizenSOS:    ['phone',             'phone-outline'],
            CitizenMap:    ['map',               'map-outline'],
            CitizenMenu:   ['account-circle',    'account-circle-outline'],
          };
          const [a, i] = icons[route.name] || ['help-circle', 'help-circle-outline'];
          return (
            <MaterialCommunityIcons
              name={(focused ? a : i) as any}
              size={24}
              color={color}
            />
          );
        },
        tabBarActiveTintColor:   '#007A3D',
        tabBarInactiveTintColor: '#8892B0',
        tabBarStyle:             TAB_BAR_STYLE,
        tabBarLabelStyle:        TAB_LABEL_STYLE,
      })}
    >
      <Tab.Screen name="CitizenHome"   component={CitizenHomeScreen} options={{ title: t('home', 'Home') }} />
      <Tab.Screen name="CitizenAlerts" component={DashboardScreen}     options={{ title: t('alerts', 'Alerts') }} />

      {/* SOS floating button */}
      <Tab.Screen
        name="CitizenSOS"
        component={EmptyScreen}
        options={{
          title: '',
          tabBarIcon: () => null,
          tabBarButton: (_props) => (
            <SOSButton tintColor="#CC0000" />
          ),
        }}
      />

      <Tab.Screen name="CitizenMap"  component={MapScreen}         options={{ title: t('map', 'Live Map') }} />
      <Tab.Screen name="CitizenMenu" component={CitizenMenuScreen} options={{ title: t('menu', 'Menu') }} />
    </Tab.Navigator>
  );
}

// ─────────────────────────────────────────────────────────────────
// SOS Floating Button — used by both navigators
// ─────────────────────────────────────────────────────────────────
function SOSButton({ tintColor }: { tintColor: string }) {
  return (
    <View style={{ width: 70, alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={{
          width: 60, height: 60, borderRadius: 30,
          backgroundColor: tintColor,
          borderWidth: 5, borderColor: '#0A0E1A',
          justifyContent: 'center', alignItems: 'center',
          marginBottom: 28,
          shadowColor: tintColor,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.4, shadowRadius: 8, elevation: 5,
        }}
      >
        <MaterialCommunityIcons name="phone-outline" size={20} color="#FFF" />
        <Text style={{ color: '#FFF', fontSize: 9, fontWeight: '900' }}>SOS</Text>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────
// ROOT APP — decides which screen to start on
// ─────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerStyle:          { backgroundColor: '#003087' },
            headerTintColor:      '#fff',
            headerTitleStyle:     { fontWeight: '800', fontSize: 15 },
          }}
        >
          {/* ── Auth ── */}
          <Stack.Screen name="Login"  component={LoginScreen}  options={{ headerShown: false }} />
          <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />

          {/* ── Public / Common screens ── */}
          <Stack.Screen name="Home"             component={HomepageScreen}        options={{ headerShown: false }} />
          <Stack.Screen name="Map"              component={MapScreen}             options={{ title: 'Live Map' }} />
          <Stack.Screen name="Updates"          component={UpdatesScreen}         options={{ title: 'SDRF Bulletins' }} />
          <Stack.Screen name="Guides"           component={GuidesScreen}          options={{ title: 'Emergency Guides' }} />
          <Stack.Screen name="ReportEmergency"  component={ReportEmergencyScreen} options={{ title: 'Report Incident' }} />
          <Stack.Screen name="CitizenVolunteer" component={CitizenVolunteerScreen} options={{ title: 'Volunteer Portal' }} />

          {/* ── Protected: Admin/SDRF ── */}
          <Stack.Screen
            name="MainTabs"
            component={AdminTabs}
            options={{ headerShown: false, gestureEnabled: false }}
          />

          {/* ── Protected: Citizen/Volunteer ── */}
          <Stack.Screen
            name="CitizenTabs"
            component={CitizenTabs}
            options={{ headerShown: false, gestureEnabled: false }}
          />

          {/* ── Shared screens (accessible from either dashboard) ── */}
          <Stack.Screen name="Scanner"    component={ScannerScreen}    options={{ title: 'QR Scanner' }} />
          <Stack.Screen name="Volunteers" component={VolunteersScreen}  options={{ title: 'Volunteer DB' }} />
          <Stack.Screen name="Resources"  component={EquipmentScreen}   options={{ title: 'Equipment & Fleet' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
