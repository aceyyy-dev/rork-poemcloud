import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Cloud, ChevronRight, Shield, FileText } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

const APP_VERSION = '1.0.0';

export default function AboutScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const handlePrivacyPolicy = () => {
    Linking.openURL('https://poemcloud.app/privacy');
  };

  const handleTermsOfService = () => {
    router.push('/terms');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: colors.surface }]}
            onPress={() => router.back()}
          >
            <ArrowLeft size={22} color={colors.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.primary }]}>About</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoSection}>
            <View style={[styles.logoContainer, { backgroundColor: colors.accent }]}>
              <Cloud size={48} color="#ffffff" strokeWidth={1.5} />
            </View>
            <Text style={[styles.appName, { color: colors.primary }]}>PoemCloud</Text>
            <Text style={[styles.version, { color: colors.textMuted }]}>
              Version {APP_VERSION}
            </Text>
          </View>

          <View style={[styles.missionCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.missionTitle, { color: colors.primary }]}>Our Mission</Text>
            <Text style={[styles.missionText, { color: colors.textLight }]}>
              PoemCloud brings poetry from every corner of the world to your fingertips. 
              We believe that verses transcend borders—connecting hearts across cultures, 
              languages, and generations. Our mission is to make timeless poetry accessible, 
              beautifully presented, and deeply personal.
            </Text>
          </View>

          <View style={[styles.linksCard, { backgroundColor: colors.surface }]}>
            <TouchableOpacity
              style={[styles.linkRow, { borderBottomColor: colors.borderLight }]}
              onPress={handlePrivacyPolicy}
            >
              <View style={styles.linkLeft}>
                <Shield size={20} color={colors.textLight} strokeWidth={1.5} />
                <Text style={[styles.linkText, { color: colors.primary }]}>Privacy Policy</Text>
              </View>
              <ChevronRight size={20} color={colors.textMuted} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.linkRowLast}
              onPress={handleTermsOfService}
            >
              <View style={styles.linkLeft}>
                <FileText size={20} color={colors.textLight} strokeWidth={1.5} />
                <Text style={[styles.linkText, { color: colors.primary }]}>Terms of Service</Text>
              </View>
              <ChevronRight size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <View style={styles.creditsSection}>
            <Text style={[styles.creditsTitle, { color: colors.textMuted }]}>CREDITS</Text>
            <Text style={[styles.creditsText, { color: colors.textMuted }]}>
              Made with love for poetry enthusiasts everywhere.
            </Text>
            <Text style={[styles.creditsText, { color: colors.textMuted }]}>
              © 2024 PoemCloud. All rights reserved.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  logoSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 32,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  version: {
    fontSize: 14,
  },
  missionCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  missionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  missionText: {
    fontSize: 15,
    lineHeight: 24,
  },
  linksCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  linkRowLast: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  linkLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  linkText: {
    fontSize: 16,
  },
  creditsSection: {
    marginTop: 32,
    alignItems: 'center',
  },
  creditsTitle: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  creditsText: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 4,
  },
});
