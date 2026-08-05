import React, { useState } from 'react';
import {
  View, StyleSheet, Alert, KeyboardAvoidingView, Platform,
  ScrollView, StatusBar, TouchableOpacity,
} from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store';
import { api } from '../api';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Official Government Colors
const GOV_BLUE   = '#003087';
const GOV_ORANGE = '#FF6600';
const GOV_LIGHT  = '#F0F4FF';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Required', 'Please enter both email and password');
      return;
    }
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data?.token) {
        await SecureStore.setItemAsync('jwt', response.data.token);
        await SecureStore.setItemAsync('userRole', response.data.user?.role || 'user');
        await SecureStore.setItemAsync('userName', response.data.user?.name || 'User');
        navigation.replace('MainTabs');
      } else {
        Alert.alert('Login Failed', 'Invalid credentials');
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar barStyle="light-content" backgroundColor={GOV_BLUE} />

      {/* Official Header Banner */}
      <LinearGradient colors={[GOV_BLUE, '#004DB3']} style={styles.govBanner}>
        <View style={styles.ashokaRow}>
          {/* Ashoka Chakra placeholder */}
          <MaterialCommunityIcons name="star-circle" size={32} color="#FF6600" />
          <View style={styles.ashokaText}>
            <Text style={styles.govTitle}>Government of Himachal Pradesh</Text>
            <Text style={styles.govSubtitle}>State Disaster Response Force</Text>
          </View>
          <MaterialCommunityIcons name="star-circle" size={32} color="#FF6600" />
        </View>
      </LinearGradient>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">

          {/* App Identity */}
          <View style={styles.appIdentity}>
            <View style={styles.shieldWrapper}>
              <MaterialCommunityIcons name="shield-check" size={56} color={GOV_BLUE} />
            </View>
            <Text style={styles.appName}>Suraksha Sarthi</Text>
            <Text style={styles.appTagline}>SDRF Mobile Operations Platform</Text>
          </View>

          {/* Login Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Responder Login</Text>
            <Text style={styles.cardSubtitle}>Official access only. Unauthorized use is prohibited.</Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Email / User ID</Text>
              <View style={styles.inputWrapper}>
                <MaterialCommunityIcons name="account" size={20} color={GOV_BLUE} style={styles.inputIcon} />
                <TextInput
                  mode="flat"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  style={styles.input}
                  underlineColor="transparent"
                  activeUnderlineColor="transparent"
                  placeholder="Enter your email"
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Password</Text>
              <View style={styles.inputWrapper}>
                <MaterialCommunityIcons name="lock" size={20} color={GOV_BLUE} style={styles.inputIcon} />
                <TextInput
                  mode="flat"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  style={styles.input}
                  underlineColor="transparent"
                  activeUnderlineColor="transparent"
                  placeholder="Enter your password"
                  placeholderTextColor="#999"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                  <MaterialCommunityIcons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#888" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.loginBtn, loading && { opacity: 0.7 }]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              <LinearGradient colors={[GOV_BLUE, '#004DB3']} style={styles.loginBtnGradient}>
                <MaterialCommunityIcons name="login" size={20} color="white" />
                <Text style={styles.loginBtnText}>{loading ? 'LOGGING IN…' : 'SECURE LOGIN'}</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={styles.signupLink}>
              <Text style={styles.signupText}>New user? <Text style={{ color: GOV_BLUE, fontWeight: '700' }}>Register here</Text></Text>
            </TouchableOpacity>
          </View>

          {/* SOS Public Access */}
          <View style={styles.sosSection}>
            <Text style={styles.sosLabel}>Emergency? Report without logging in</Text>
            <TouchableOpacity
              style={styles.sosBtn}
              onPress={() => navigation.navigate('ReportEmergency')}
              activeOpacity={0.85}
            >
              <MaterialCommunityIcons name="alert-decagram" size={22} color="white" />
              <Text style={styles.sosBtnText}>REPORT EMERGENCY SOS</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <Text style={styles.footer}>This is an official government application.{'\n'}Version 2.0 · NIC Himachal Pradesh</Text>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  govBanner: {
    paddingTop: Platform.OS === 'android' ? 40 : 55,
    paddingBottom: 14,
    paddingHorizontal: 20,
  },
  ashokaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ashokaText: {
    flex: 1,
    alignItems: 'center',
  },
  govTitle: {
    color: 'white',
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  govSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 2,
  },
  body: {
    padding: 20,
    paddingBottom: 40,
  },
  appIdentity: {
    alignItems: 'center',
    marginVertical: 28,
  },
  shieldWrapper: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: GOV_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: GOV_BLUE,
    marginBottom: 14,
  },
  appName: {
    fontSize: 26,
    fontWeight: '900',
    color: GOV_BLUE,
    letterSpacing: 0.5,
  },
  appTagline: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: '#DDE4F0',
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: GOV_BLUE,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 11,
    color: '#888',
    marginBottom: 24,
    lineHeight: 16,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3E5060',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFF',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    backgroundColor: 'transparent',
    fontSize: 15,
    height: 48,
  },
  eyeBtn: {
    padding: 4,
  },
  loginBtn: {
    marginTop: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  loginBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  loginBtnText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1,
  },
  signupLink: {
    alignItems: 'center',
    marginTop: 16,
  },
  signupText: {
    fontSize: 13,
    color: '#555',
  },
  sosSection: {
    marginTop: 28,
    alignItems: 'center',
  },
  sosLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
  },
  sosBtn: {
    backgroundColor: '#CC0000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 8,
    gap: 10,
    width: '100%',
    elevation: 4,
  },
  sosBtnText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1,
  },
  footer: {
    marginTop: 36,
    textAlign: 'center',
    fontSize: 11,
    color: '#999',
    lineHeight: 18,
  },
});
