import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
  TextInput as RNTextInput,
} from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { api } from '../api';

// Official Government Colors (matching LoginScreen)
const GOV_BLUE   = '#003087';
const GOV_ORANGE = '#FF6600';
const GOV_GREEN  = '#007A3D';
const GOV_LIGHT  = '#F0F4FF';

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60; // seconds

export default function SignupScreen({ navigation }: any) {
  // ─── Step State ───────────────────────────────────────────────
  const [step, setStep] = useState<1 | 2>(1);

  // ─── Step 1: Registration Fields ─────────────────────────────
  const [name, setName]           = useState('');
  const [email, setEmail]         = useState('');
  const [phone, setPhone]         = useState('');
  const [password, setPassword]   = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showPassword, setShowPassword]     = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  // ─── Step 2: OTP Fields ───────────────────────────────────────
  const [otp, setOtp]             = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const otpRefs                   = useRef<(RNTextInput | null)[]>([]);
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ─── Loading ──────────────────────────────────────────────────
  const [loading, setLoading]     = useState(false);

  // ─── Animation ───────────────────────────────────────────────
  const stepAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function startResendTimer() {
    setResendTimer(RESEND_COOLDOWN);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          timerRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  function animateToStep2() {
    Animated.timing(stepAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
    setStep(2);
  }

  // ─── Validate Step 1 ─────────────────────────────────────────
  function validateStep1(): boolean {
    if (!name.trim() || name.trim().length < 2) {
      Alert.alert('Required', 'Please enter your full name (at least 2 characters).');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return false;
    }
    const phoneClean = phone.replace(/\D/g, '');
    if (phoneClean.length < 10) {
      Alert.alert('Invalid Phone', 'Please enter a valid 10-digit phone number.');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters long.');
      return false;
    }
    if (password !== confirmPwd) {
      Alert.alert('Password Mismatch', 'Passwords do not match. Please re-enter.');
      return false;
    }
    return true;
  }

  // ─── Send OTP ─────────────────────────────────────────────────
  const handleSendOTP = async () => {
    if (!validateStep1()) return;
    setLoading(true);
    try {
      const response = await api.post('/auth/send-otp', { phone: phone.trim() });
      // Dev mode: if backend returns the OTP (no SMS configured), show it
      if (response.data?.dev) {
        Alert.alert('📱 Dev Mode OTP', response.data.dev, [{ text: 'OK' }]);
      }
      startResendTimer();
      animateToStep2();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ─── Resend OTP ───────────────────────────────────────────────
  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    setOtpLoading(true);
    try {
      const response = await api.post('/auth/send-otp', { phone: phone.trim() });
      setOtp(Array(OTP_LENGTH).fill(''));
      otpRefs.current[0]?.focus();
      startResendTimer();
      if (response.data?.dev) {
        Alert.alert('📱 Dev Mode OTP', response.data.dev, [{ text: 'OK' }]);
      } else {
        Alert.alert('OTP Resent', 'A new OTP has been sent to your phone.');
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to resend OTP.');
    } finally {
      setOtpLoading(false);
    }
  };

  // ─── OTP Input Handlers ───────────────────────────────────────
  const handleOtpChange = (value: string, index: number) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    if (digit && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // ─── Verify OTP & Complete Registration ──────────────────────
  const handleVerifyAndRegister = async () => {
    const otpValue = otp.join('');
    if (otpValue.length < OTP_LENGTH) {
      Alert.alert('Incomplete OTP', `Please enter all ${OTP_LENGTH} digits.`);
      return;
    }

    setLoading(true);
    try {
      // Step A: Verify OTP
      await api.post('/auth/verify-otp', { phone: phone.trim(), otp: otpValue });

      // Step B: Complete Registration
      await api.post('/auth/signup', {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password,
      });

      Alert.alert(
        '✅ Registration Successful!',
        'Your account has been created and your phone number is verified. You can now log in.',
        [{ text: 'Log In Now', onPress: () => navigation.goBack() }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ─── Masked phone for display ────────────────────────────────
  const maskedPhone = phone.length > 4
    ? phone.slice(0, -4).replace(/\d/g, '•') + phone.slice(-4)
    : phone;

  // ─── Render ───────────────────────────────────────────────────
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar barStyle="light-content" backgroundColor={GOV_BLUE} />

      {/* Official Header Banner */}
      <LinearGradient colors={[GOV_BLUE, '#004DB3']} style={styles.govBanner}>
        <View style={styles.bannerRow}>
          <MaterialCommunityIcons name="star-circle" size={30} color={GOV_ORANGE} />
          <View style={styles.bannerText}>
            <Text style={styles.govTitle}>Government of Himachal Pradesh</Text>
            <Text style={styles.govSubtitle}>State Disaster Response Force</Text>
          </View>
          <MaterialCommunityIcons name="star-circle" size={30} color={GOV_ORANGE} />
        </View>
      </LinearGradient>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          {/* App Identity */}
          <View style={styles.appIdentity}>
            <View style={styles.shieldWrapper}>
              <MaterialCommunityIcons name="account-plus" size={48} color={GOV_BLUE} />
            </View>
            <Text style={styles.appName}>Create Account</Text>
            <Text style={styles.appTagline}>Suraksha Sarthi · SDRF Platform</Text>
          </View>

          {/* Step Indicator */}
          <View style={styles.stepIndicator}>
            <View style={styles.stepItem}>
              <View style={[styles.stepCircle, step === 1 ? styles.stepCircleActive : styles.stepCircleDone]}>
                {step > 1
                  ? <MaterialCommunityIcons name="check" size={16} color="#fff" />
                  : <Text style={styles.stepNumber}>1</Text>
                }
              </View>
              <Text style={[styles.stepLabel, step === 1 && styles.stepLabelActive]}>Your Details</Text>
            </View>

            <View style={[styles.stepLine, step > 1 && styles.stepLineDone]} />

            <View style={styles.stepItem}>
              <View style={[styles.stepCircle, step === 2 ? styles.stepCircleActive : styles.stepCircleInactive]}>
                <Text style={[styles.stepNumber, step === 2 && { color: '#fff' }]}>2</Text>
              </View>
              <Text style={[styles.stepLabel, step === 2 && styles.stepLabelActive]}>Verify Phone</Text>
            </View>
          </View>

          {/* ═══════════ STEP 1: Registration Form ═══════════ */}
          {step === 1 && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Personal Information</Text>
              <Text style={styles.cardSubtitle}>Fill in your details to create an account.</Text>

              {/* Full Name */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Full Name</Text>
                <View style={styles.inputWrapper}>
                  <MaterialCommunityIcons name="account" size={20} color={GOV_BLUE} style={styles.inputIcon} />
                  <TextInput
                    mode="flat"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                    style={styles.input}
                    underlineColor="transparent"
                    activeUnderlineColor="transparent"
                    placeholder="Enter your full name"
                    placeholderTextColor="#999"
                  />
                </View>
              </View>

              {/* Email */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Email Address</Text>
                <View style={styles.inputWrapper}>
                  <MaterialCommunityIcons name="email" size={20} color={GOV_BLUE} style={styles.inputIcon} />
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

              {/* Phone */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Mobile Number</Text>
                <View style={[styles.inputWrapper, { borderColor: '#003087' }]}>
                  <MaterialCommunityIcons name="phone" size={20} color={GOV_BLUE} style={styles.inputIcon} />
                  <TextInput
                    mode="flat"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    style={styles.input}
                    underlineColor="transparent"
                    activeUnderlineColor="transparent"
                    placeholder="+91 XXXXXXXXXX"
                    placeholderTextColor="#999"
                    maxLength={15}
                  />
                  <View style={styles.otpBadge}>
                    <MaterialCommunityIcons name="shield-check-outline" size={14} color={GOV_BLUE} />
                    <Text style={styles.otpBadgeText}>OTP</Text>
                  </View>
                </View>
                <Text style={styles.fieldHint}>An OTP will be sent to this number for verification.</Text>
              </View>

              {/* Password */}
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
                    placeholder="Minimum 6 characters"
                    placeholderTextColor="#999"
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                    <MaterialCommunityIcons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#888" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirm Password */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Confirm Password</Text>
                <View style={styles.inputWrapper}>
                  <MaterialCommunityIcons name="lock-check" size={20} color={GOV_BLUE} style={styles.inputIcon} />
                  <TextInput
                    mode="flat"
                    value={confirmPwd}
                    onChangeText={setConfirmPwd}
                    secureTextEntry={!showConfirmPwd}
                    style={styles.input}
                    underlineColor="transparent"
                    activeUnderlineColor="transparent"
                    placeholder="Re-enter your password"
                    placeholderTextColor="#999"
                  />
                  <TouchableOpacity onPress={() => setShowConfirmPwd(!showConfirmPwd)} style={styles.eyeBtn}>
                    <MaterialCommunityIcons name={showConfirmPwd ? 'eye-off' : 'eye'} size={20} color="#888" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Send OTP Button */}
              <TouchableOpacity
                style={[styles.primaryBtn, loading && { opacity: 0.7 }]}
                onPress={handleSendOTP}
                disabled={loading}
                activeOpacity={0.85}
              >
                <LinearGradient colors={[GOV_BLUE, '#004DB3']} style={styles.primaryBtnGradient}>
                  <MaterialCommunityIcons name="message-text" size={20} color="white" />
                  <Text style={styles.primaryBtnText}>
                    {loading ? 'SENDING OTP…' : 'SEND OTP TO PHONE'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backLink}>
                <MaterialCommunityIcons name="arrow-left" size={16} color="#555" />
                <Text style={styles.backLinkText}>Already have an account? <Text style={{ color: GOV_BLUE, fontWeight: '700' }}>Log in</Text></Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ═══════════ STEP 2: OTP Verification ═══════════ */}
          {step === 2 && (
            <View style={styles.card}>
              <View style={styles.otpHeaderRow}>
                <View style={styles.otpIconWrapper}>
                  <MaterialCommunityIcons name="shield-lock" size={36} color={GOV_GREEN} />
                </View>
              </View>
              <Text style={styles.cardTitle}>Verify Your Phone</Text>
              <Text style={styles.cardSubtitle}>
                Enter the 6-digit OTP sent to{'\n'}
                <Text style={{ fontWeight: '700', color: GOV_BLUE }}>{maskedPhone}</Text>
              </Text>

              {/* OTP Boxes */}
              <View style={styles.otpRow}>
                {Array(OTP_LENGTH).fill(0).map((_, i) => (
                  <RNTextInput
                    key={i}
                    ref={ref => { otpRefs.current[i] = ref; }}
                    style={[
                      styles.otpBox,
                      otp[i] ? styles.otpBoxFilled : {},
                    ]}
                    value={otp[i]}
                    onChangeText={val => handleOtpChange(val, i)}
                    onKeyPress={e => handleOtpKeyPress(e, i)}
                    keyboardType="number-pad"
                    maxLength={1}
                    textAlign="center"
                    selectTextOnFocus
                    autoFocus={i === 0}
                  />
                ))}
              </View>

              {/* Timer & Resend */}
              <View style={styles.resendRow}>
                {resendTimer > 0 ? (
                  <Text style={styles.timerText}>
                    Resend OTP in <Text style={{ color: GOV_BLUE, fontWeight: '700' }}>{resendTimer}s</Text>
                  </Text>
                ) : (
                  <TouchableOpacity onPress={handleResendOTP} disabled={otpLoading}>
                    <Text style={styles.resendText}>
                      {otpLoading ? 'Resending…' : 'Resend OTP'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Verify & Register Button */}
              <TouchableOpacity
                style={[styles.primaryBtn, loading && { opacity: 0.7 }]}
                onPress={handleVerifyAndRegister}
                disabled={loading}
                activeOpacity={0.85}
              >
                <LinearGradient colors={[GOV_GREEN, '#005A2B']} style={styles.primaryBtnGradient}>
                  <MaterialCommunityIcons name="check-circle" size={20} color="white" />
                  <Text style={styles.primaryBtnText}>
                    {loading ? 'VERIFYING…' : 'VERIFY & CREATE ACCOUNT'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Go Back */}
              <TouchableOpacity onPress={() => setStep(1)} style={styles.backLink}>
                <MaterialCommunityIcons name="arrow-left" size={16} color="#555" />
                <Text style={styles.backLinkText}>Change details</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Footer */}
          <Text style={styles.footer}>
            This is an official government application.{'\n'}Version 2.0 · NIC Himachal Pradesh
          </Text>

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
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bannerText: {
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
    marginVertical: 20,
  },
  shieldWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: GOV_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: GOV_BLUE,
    marginBottom: 12,
  },
  appName: {
    fontSize: 24,
    fontWeight: '900',
    color: GOV_BLUE,
    letterSpacing: 0.4,
  },
  appTagline: {
    fontSize: 12,
    color: '#666',
    marginTop: 3,
    letterSpacing: 0.4,
  },
  // ─── Step Indicator ───────────────────────────────────
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  stepItem: {
    alignItems: 'center',
    gap: 6,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCircleActive: {
    backgroundColor: GOV_BLUE,
  },
  stepCircleDone: {
    backgroundColor: GOV_GREEN,
  },
  stepCircleInactive: {
    backgroundColor: '#DDE4F0',
  },
  stepNumber: {
    fontSize: 13,
    fontWeight: '900',
    color: '#fff',
  },
  stepLabel: {
    fontSize: 11,
    color: '#AAA',
    fontWeight: '600',
  },
  stepLabelActive: {
    color: GOV_BLUE,
    fontWeight: '800',
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#DDE4F0',
    marginHorizontal: 10,
    marginBottom: 18,
  },
  stepLineDone: {
    backgroundColor: GOV_GREEN,
  },
  // ─── Card ──────────────────────────────────────────────
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
    fontSize: 12,
    color: '#777',
    marginBottom: 22,
    lineHeight: 18,
  },
  // ─── Form Fields ───────────────────────────────────────
  fieldGroup: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#3E5060',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  fieldHint: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 4,
    letterSpacing: 0.2,
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
  otpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: GOV_LIGHT,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    gap: 2,
  },
  otpBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: GOV_BLUE,
    letterSpacing: 0.5,
  },
  // ─── Buttons ───────────────────────────────────────────
  primaryBtn: {
    marginTop: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  primaryBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  primaryBtnText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    gap: 4,
  },
  backLinkText: {
    fontSize: 13,
    color: '#555',
  },
  // ─── OTP Step ──────────────────────────────────────────
  otpHeaderRow: {
    alignItems: 'center',
    marginBottom: 12,
  },
  otpIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F0FFF7',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#007A3D',
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    gap: 6,
  },
  otpBox: {
    flex: 1,
    height: 52,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    fontSize: 22,
    fontWeight: '900',
    color: GOV_BLUE,
    backgroundColor: '#F8FAFF',
  },
  otpBoxFilled: {
    borderColor: GOV_BLUE,
    backgroundColor: '#EEF4FF',
  },
  resendRow: {
    alignItems: 'center',
    marginBottom: 4,
  },
  timerText: {
    fontSize: 13,
    color: '#888',
  },
  resendText: {
    fontSize: 13,
    color: GOV_BLUE,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  // ─── Footer ────────────────────────────────────────────
  footer: {
    marginTop: 28,
    textAlign: 'center',
    fontSize: 11,
    color: '#999',
    lineHeight: 18,
  },
});
