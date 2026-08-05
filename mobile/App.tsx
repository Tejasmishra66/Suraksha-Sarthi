import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import * as SecureStore from 'expo-secure-store';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import './src/i18n'; // Import i18n config

import { theme } from './src/theme';
import HomepageScreen from './src/screens/HomepageScreen';
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import MapScreen from './src/screens/MapScreen';
import EquipmentScreen from './src/screens/EquipmentScreen';
import UpdatesScreen from './src/screens/UpdatesScreen';
import VolunteersScreen from './src/screens/VolunteersScreen';
import GuidesScreen from './src/screens/GuidesScreen';
import ScannerScreen from './src/screens/ScannerScreen';
import ReportEmergencyScreen from './src/screens/ReportEmergencyScreen';
import MenuScreen from './src/screens/MenuScreen';
import ResponderHomeScreen from './src/screens/ResponderHomeScreen';
import SignupScreen from './src/screens/SignupScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Protected Responder Dashboard
function MainTabs() {
  const navigation = useNavigation<any>();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    SecureStore.getItemAsync('userRole').then(r => {
      setRole(r || 'citizen');
    });
  }, []);

  if (!role) return null; // loading

  const isAdmin = role === 'admin' || role === 'agency_head';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any = 'help-circle';
          if (route.name === 'DashboardHome' || route.name === 'CitizenHome') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Board' || route.name === 'Updates') iconName = focused ? 'bell' : 'bell-outline';
          else if (route.name === 'Resources') iconName = focused ? 'tools' : 'tools';
          else if (route.name === 'Map') iconName = focused ? 'map' : 'map-outline';
          else if (route.name === 'Menu') iconName = focused ? 'account' : 'account-outline';
          
          return (
            <View>
              <MaterialCommunityIcons name={iconName} size={24} color={color} />
              {route.name === 'Board' && (
                <View style={{
                  position: 'absolute', top: -4, right: -4,
                  backgroundColor: '#FF3300', width: 14, height: 14, borderRadius: 7,
                  justifyContent: 'center', alignItems: 'center'
                }}>
                  <Text style={{ color: '#FFF', fontSize: 8, fontWeight: 'bold' }}>3</Text>
                </View>
              )}
            </View>
          );
        },
        tabBarActiveTintColor: '#FF4500', // ORANGE/RED accent
        tabBarInactiveTintColor: '#8892B0', // Muted blue-grey
        tabBarStyle: {
          height: 64,
          paddingBottom: 10,
          paddingTop: 6,
          backgroundColor: '#0A0E1A', // Dark navy background
          borderTopWidth: 1,
          borderTopColor: '#1E2640', // Subtle border
          elevation: 0,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          letterSpacing: 0.3,
          marginTop: 4,
        },
      })}
    >
      {isAdmin ? (
        <>
          <Tab.Screen name="DashboardHome" component={ResponderHomeScreen} options={{ title: 'Home' }} />
          <Tab.Screen name="Board" component={DashboardScreen} options={{ title: 'Alerts' }} />
        </>
      ) : (
        <>
          <Tab.Screen name="CitizenHome" component={HomepageScreen} options={{ title: 'Home' }} />
          <Tab.Screen name="Updates" component={UpdatesScreen} options={{ title: 'Bulletins' }} />
        </>
      )}
      
      {/* Floating SOS Button Tab */}
      <Tab.Screen 
        name="SOS" 
        component={View} 
        listeners={() => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate('ReportEmergency');
          },
        })}
        options={{
          title: '',
          tabBarIcon: () => null,
          tabBarButton: (props) => (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => navigation.navigate('ReportEmergency')}
              style={{
                top: -24,
                justifyContent: 'center',
                alignItems: 'center',
                width: 70,
              }}
            >
              <View style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: '#FF3300', // SOS Red
                borderWidth: 6,
                borderColor: '#0A0E1A', // Match bottom bar bg to create cutout effect
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#FF3300',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.4,
                shadowRadius: 8,
                elevation: 5,
              }}>
                <MaterialCommunityIcons name="phone-outline" size={20} color="#FFF" style={{ marginBottom: -2 }} />
                <Text style={{ color: '#FFF', fontSize: 10, fontWeight: '900' }}>SOS</Text>
              </View>
            </TouchableOpacity>
          ),
        }} 
      />

      {isAdmin ? (
        <Tab.Screen name="Resources" component={EquipmentScreen} options={{ title: 'Resources' }} />
      ) : (
        <Tab.Screen name="Map" component={MapScreen} options={{ title: 'Live Map' }} />
      )}
      <Tab.Screen name="Menu" component={MenuScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}

// Root Public Navigation
export default function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Login" 
          screenOptions={{ 
            headerStyle: { backgroundColor: '#003087' }, 
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: '800', fontSize: 15 },
            headerBackTitleVisible: false,
          }}
        >
          {/* Public Core */}
          <Stack.Screen name="Home" component={HomepageScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
          
          {/* Public Features (Accessible from both Home and Dashboard) */}
          <Stack.Screen name="Map" component={MapScreen} options={{ title: 'Live Map' }} />
          <Stack.Screen name="Updates" component={UpdatesScreen} options={{ title: 'SDRF Bulletins' }} />
          <Stack.Screen name="Guides" component={GuidesScreen} options={{ title: 'Emergency Guides' }} />
          <Stack.Screen name="ReportEmergency" component={ReportEmergencyScreen} options={{ title: 'Report Incident' }} />
          
          {/* Protected Flow */}
          <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false, gestureEnabled: false }} />
          <Stack.Screen name="Scanner" component={ScannerScreen} options={{ title: 'QR Scanner' }} />
          <Stack.Screen name="Volunteers" component={VolunteersScreen} options={{ title: 'Volunteer DB' }} />
          <Stack.Screen name="Resources" component={EquipmentScreen} options={{ title: 'Equipment & Fleet' }} />
          
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
