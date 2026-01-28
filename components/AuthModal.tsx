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
import { Mail, Lock, User, Apple as AppleIcon, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialMode?: 'login' | 'signup';
}

export default function AuthModal({ visible, onClose, onSuccess, initialMode = 'login' }: Props) {
  const { colors } = useTheme();
  const { signInWithEmail, signUpWithEmail, signInWithApple, signInWithGoogle } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode, visible]);
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      if (mode === 'signup') {
        await signUpWithEmail(email, password, name);
      } else {
        await signInWithEmail(email, password);
      }
      onSuccess?.();
      onClose();
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
      await signInWithApple();
      onSuccess?.();
      onClose();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Apple sign in failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      onSuccess?.();
      onClose();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Google sign in failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
            >
              <Text style={[styles.title, { color: colors.primary }]}>
                {mode === 'signup' ? 'Create your account' : 'Welcome back'}
              </Text>
              <Text style={[styles.subtitle, { color: colors.textMuted }]}>
                {mode === 'signup'
                  ? 'Save your bookmarks and preferences across devices'
                  : 'Sign in to sync your reading experience'}
              </Text>

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
                  <Text style={{ color: colors.accent, fontWeight: '600' }}>
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
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  socialButtons: {
    gap: 12,
    marginBottom: 24,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
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
    marginBottom: 24,
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
    gap: 12,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  primaryButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: '600',
  },
  switchMode: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  switchModeText: {
    fontSize: 15,
  },
  guestButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  guestButtonText: {
    fontSize: 14,
  },
});
