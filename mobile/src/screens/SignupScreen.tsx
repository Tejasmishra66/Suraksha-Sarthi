import React, { useState } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { api } from '../api';

export default function SignupScreen({ navigation }: any) {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !phone || !password) {
      Alert.alert('Required', 'Please fill out all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/signup', {
        name,
        email,
        phone,
        password,
      });
      
      Alert.alert(
        'Account Created',
        'Your account has been successfully created. You can now log in.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error: any) {
      Alert.alert('Signup Failed', error.response?.data?.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0a3622', '#0f4a30', '#1c6f4a']}
        style={StyleSheet.absoluteFill}
      />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.headerContainer}>
            <MaterialCommunityIcons name="account-plus" size={70} color="white" />
            <Text style={styles.title}>Join Us</Text>
            <Text style={styles.subtitle}>Register as a Responder / Volunteer</Text>
          </View>

          <View style={styles.glassCard}>
            <Text style={styles.loginTitle}>Create Account</Text>

            <TextInput
              mode="outlined"
              label="Full Name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              style={styles.input}
              theme={{ colors: { background: 'white' } }}
              left={<TextInput.Icon icon="account" />}
            />

            <TextInput
              mode="outlined"
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
              theme={{ colors: { background: 'white' } }}
              left={<TextInput.Icon icon="email" />}
            />

            <TextInput
              mode="outlined"
              label="Phone Number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              style={styles.input}
              theme={{ colors: { background: 'white' } }}
              left={<TextInput.Icon icon="phone" />}
            />

            <TextInput
              mode="outlined"
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              style={styles.input}
              theme={{ colors: { background: 'white' } }}
              left={<TextInput.Icon icon="lock" />}
              right={
                <TextInput.Icon 
                  icon={showPassword ? "eye-off" : "eye"} 
                  onPress={() => setShowPassword(!showPassword)} 
                />
              }
            />

            <Button
              mode="contained"
              onPress={handleSignup}
              loading={loading}
              disabled={loading}
              buttonColor={theme.colors.primary}
              style={styles.button}
              contentStyle={styles.buttonContent}
            >
              SIGN UP
            </Button>
            
            <Button
              mode="text"
              onPress={() => navigation.goBack()}
              textColor="#555"
              style={styles.backButton}
            >
              Already have an account? Log in
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: 'white',
    marginTop: 10,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 4,
    textAlign: 'center',
  },
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 24,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  loginTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 10,
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 10,
  },
  backButton: {
    marginTop: 10,
  },
});
