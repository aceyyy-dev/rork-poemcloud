import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock, User, Apple as AppleIcon, X, Scan, Fingerprint } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useBiometric } from '@/contexts/BiometricContext';
import { triggerHaptic } from '@/utils/haptics';
import BiometricEnableModal from './BiometricEnableModal';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialMode?: 'login' | 'signup';
}

export default function AuthModal({ visible, onClose, onSuccess, initialMode = 'login' }: Props) {
  const { colors } = useTheme();
  const { signInWithEmail, signUpWithEmail, signInWithApple, signInWithGoogle, signInWithBiometric } = useAuth();
  const { 
    canShowBiometricLogin, 
    getBiometricTypeName, 
    biometricType, 
    authenticateWithBiometric,
    isAvailable,
    isEnrolled,
    isEnabled,
  } = useBiometric();
  
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showBiometricEnableModal, setShowBiometricEnableModal] = useState(false);
  const [pendingAuthData, setPendingAuthData] = useState<{ userId: string; token: string } | null>(null);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode, visible]);

  useEffect(() => {
    if (!visible) {
      setEmail('');
      setPassword('');
      setName('');
      setPendingAuthData(null);
    }
  }, [visible]);

  const shouldOfferBiometric = isAvailable && isEnrolled && !isEnabled && Platform.OS !== 'web';
  const biometricName = getBiometricTypeName();
  const isFaceId = biometricType === 'face' && Platform.OS === 'ios';

  const handleAuthSuccess = (userId: string, authToken: string) => {
    if (shouldOfferBiometric) {
      setPendingAuthData({ userId, token: authToken });
      setShowBiometricEnableModal(true);
    } else {
      onSuccess?.();
      onClose();
    }
  };

  const handleBiometricEnableComplete = async () => {
    triggerHaptic('success');
    onSuccess?.();
    onClose();
  };

  const handleBiometricEnableSkip = () => {
    setShowBiometricEnableModal(false);
    onSuccess?.();
    onClose();
  };

  const handleEmailAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      let authUser;
      if (mode === 'signup') {
        authUser = await signUpWithEmail(email, password, name);
      } else {
        authUser = await signInWithEmail(email, password);
      }
      const authToken = `token_${Date.now()}`;
      handleAuthSuccess(authUser.id, authToken);
      setEmail('');
      setPassword('');
      setName('');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleAuth = async () => {
    setIsLoading(true);
    try {
      const authUser = await signInWithApple();
      const authToken = `token_${Date.now()}`;
      handleAuthSuccess(authUser.id, authToken);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Apple sign in failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      const authUser = await signInWithGoogle();
      const authToken = `token_${Date.now()}`;
      handleAuthSuccess(authUser.id, authToken);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Google sign in failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    setIsLoading(true);
    triggerHaptic('light');
    try {
      const result = await authenticateWithBiometric();
      if (result.success && result.userId && result.token) {
        await signInWithBiometric(result.userId, result.token);
        triggerHaptic('success');
        onSuccess?.();
        onClose();
      } else {
        console.log('[AuthModal] Biometric auth failed, showing password form');
      }
    } catch (error: any) {
      console.error('[AuthModal] Biometric login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <LinearGradient
            colors={[colors.gradientStart, colors.background]}
            style={styles.gradient}
          />

          <SafeAreaView style={styles.safeArea} edges={['top']}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              disabled={isLoading}
            >
              <X size={24} color={colors.text} strokeWidth={2} />
            </TouchableOpacity>

            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.keyboardView}
            >
              <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                bounces={false}
              >
                <Text style={[styles.title, { color: colors.primary }]}>
                  {mode === 'signup' ? 'Create your account' : 'Welcome back'}
                </Text>
                <Text style={[styles.subtitle, { color: colors.textMuted }]}>
                  {mode === 'signup'
                    ? 'Save your bookmarks and preferences across devices'
                    : 'Sign in to sync your reading experience'}
                </Text>

                {canShowBiometricLogin && mode === 'login' && (
                  <TouchableOpacity
                    style={[styles.biometricButton, { backgroundColor: colors.surface, borderColor: colors.accent }]}
                    onPress={handleBiometricLogin}
                    disabled={isLoading}
                    activeOpacity={0.7}
                  >
                    {isFaceId ? (
                      <Scan size={28} color={colors.accent} strokeWidth={1.5} />
                    ) : (
                      <Fingerprint size={28} color={colors.accent} strokeWidth={1.5} />
                    )}
                    <Text style={[styles.biometricButtonText, { color: colors.primary }]}>
                      Continue with {biometricName}
                    </Text>
                  </TouchableOpacity>
                )}

                {canShowBiometricLogin && mode === 'login' && (
                  <View style={styles.divider}>
                    <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
                    <Text style={[styles.dividerText, { color: colors.textMuted }]}>or</Text>
                    <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
                  </View>
                )}

                <View style={styles.socialButtons}>
                  {Platform.OS === 'ios' && (
                    <TouchableOpacity
                      style={[styles.socialButton, { backgroundColor: colors.surface }]}
                      onPress={handleAppleAuth}
                      disabled={isLoading}
                    >
                      <AppleIcon size={20} color={colors.primary} strokeWidth={1.5} />
                      <Text style={[styles.socialButtonText, { color: colors.primary }]}>
                        Continue with Apple
                      </Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    style={[styles.socialButton, { backgroundColor: colors.surface }]}
                    onPress={handleGoogleAuth}
                    disabled={isLoading}
                  >
                    <View style={styles.googleIcon}>
                      <Text style={styles.googleText}>G</Text>
                    </View>
                    <Text style={[styles.socialButtonText, { color: colors.primary }]}>
                      Continue with Google
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.divider}>
                  <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
                  <Text style={[styles.dividerText, { color: colors.textMuted }]}>or</Text>
                  <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
                </View>

                <View style={styles.form}>
                  {mode === 'signup' && (
                    <View style={styles.inputContainer}>
                      <User size={20} color={colors.textMuted} strokeWidth={1.5} />
                      <TextInput
                        style={[styles.input, { color: colors.text }]}
                        placeholder="Name (optional)"
                        placeholderTextColor={colors.textMuted}
                        value={name}
                        onChangeText={setName}
                        autoCapitalize="words"
                        editable={!isLoading}
                      />
                    </View>
                  )}

                  <View style={styles.inputContainer}>
                    <Mail size={20} color={colors.textMuted} strokeWidth={1.5} />
                    <TextInput
                      style={[styles.input, { color: colors.text }]}
                      placeholder="Email"
                      placeholderTextColor={colors.textMuted}
                      value={email}
                      onChangeText={setEmail}
                      autoCapitalize="none"
                      keyboardType="email-address"
                      editable={!isLoading}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Lock size={20} color={colors.textMuted} strokeWidth={1.5} />
                    <TextInput
                      style={[styles.input, { color: colors.text }]}
                      placeholder="Password"
                      placeholderTextColor={colors.textMuted}
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry
                      editable={!isLoading}
                    />
                  </View>

                  <TouchableOpacity
                    style={[styles.primaryButton, { backgroundColor: colors.primary }]}
                    onPress={handleEmailAuth}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator color={colors.background} />
                    ) : (
                      <Text style={[styles.primaryButtonText, { color: colors.background }]}>
                        {mode === 'signup' ? 'Sign up' : 'Log in'}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.switchMode}
                  onPress={() => setMode(mode === 'login' ? 'signup' : 'login')}
                  disabled={isLoading}
                >
                  <Text style={[styles.switchModeText, { color: colors.textMuted }]}>
                    {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                    <Text style={{ color: colors.accent, fontWeight: '600' as const }}>
                      {mode === 'login' ? 'Sign up' : 'Log in'}
                    </Text>
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.guestButton} onPress={onClose} disabled={isLoading}>
                  <Text style={[styles.guestButtonText, { color: colors.textLight }]}>
                    Continue as guest
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </View>
      </Modal>

      {pendingAuthData && (
        <BiometricEnableModal
          visible={showBiometricEnableModal}
          onClose={handleBiometricEnableSkip}
          onEnable={handleBiometricEnableComplete}
          userId={pendingAuthData.userId}
          token={pendingAuthData.token}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  safeArea: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 24,
    zIndex: 10,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 32,
    paddingTop: 60,
    paddingBottom: 40,
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    gap: 12,
    borderWidth: 2,
    marginBottom: 20,
  },
  biometricButtonText: {
    fontSize: 17,
    fontWeight: '600',
  },
  socialButtons: {
    gap: 10,
    marginBottom: 20,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 10,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  googleIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4285F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 13,
  },
  form: {
    gap: 10,
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  primaryButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: '600',
  },
  switchMode: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  switchModeText: {
    fontSize: 15,
  },
  guestButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  guestButtonText: {
    fontSize: 14,
  },
});
