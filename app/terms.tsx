import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

const TERMS_SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    content: `By downloading, installing, or using PoemCloud ("the App"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the App.`,
  },
  {
    title: '2. Description of Service',
    content: `PoemCloud provides a curated collection of poetry from around the world. The App offers both free and premium subscription tiers. Free users have access to basic features with certain limitations, while PoemCloud+ subscribers enjoy additional features including unlimited bookmarks, audio narration, and AI-powered translations.`,
  },
  {
    title: '3. User Accounts',
    content: `Some features may require you to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate and complete information when creating your account.`,
  },
  {
    title: '4. Subscription and Payments',
    content: `PoemCloud+ is a premium subscription service billed on a monthly or annual basis. Payment will be charged to your App Store or Google Play account upon confirmation of purchase. Subscriptions automatically renew unless canceled at least 24 hours before the end of the current period. You can manage and cancel subscriptions in your device's account settings.`,
  },
  {
    title: '5. Content and Intellectual Property',
    content: `The poetry, translations, and other content available through PoemCloud are either in the public domain, licensed, or created by PoemCloud. You may not reproduce, distribute, or create derivative works from the App's content without explicit permission. AI-generated translations are provided for personal enjoyment and are not guaranteed for accuracy.`,
  },
  {
    title: '6. User Conduct',
    content: `You agree not to: (a) use the App for any unlawful purpose; (b) attempt to gain unauthorized access to the App's systems; (c) interfere with or disrupt the App's functionality; (d) reverse engineer or decompile any part of the App; (e) share your subscription access with others.`,
  },
  {
    title: '7. Privacy',
    content: `Your use of PoemCloud is also governed by our Privacy Policy, which describes how we collect, use, and protect your personal information. By using the App, you consent to our data practices as described in the Privacy Policy.`,
  },
  {
    title: '8. Disclaimer of Warranties',
    content: `The App is provided "as is" without warranties of any kind, either express or implied. We do not guarantee that the App will be error-free, secure, or continuously available. AI-generated translations are creative interpretations and should not be relied upon for scholarly or official purposes.`,
  },
  {
    title: '9. Limitation of Liability',
    content: `To the maximum extent permitted by law, PoemCloud shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the App. Our total liability shall not exceed the amount you paid for the App in the twelve months preceding the claim.`,
  },
  {
    title: '10. Changes to Terms',
    content: `We reserve the right to modify these Terms at any time. We will notify users of significant changes through the App or via email. Your continued use of the App after changes constitutes acceptance of the modified Terms.`,
  },
  {
    title: '11. Termination',
    content: `We may terminate or suspend your access to the App at any time, with or without cause, with or without notice. Upon termination, your right to use the App will immediately cease.`,
  },
  {
    title: '12. Contact Information',
    content: `If you have questions about these Terms, please contact us at legal@poemcloud.app.`,
  },
];

export default function TermsScreen() {
  const router = useRouter();
  const { colors } = useTheme();

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
          <Text style={[styles.headerTitle, { color: colors.primary }]}>Terms of Service</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.lastUpdated, { color: colors.textMuted }]}>
            Last updated: January 2024
          </Text>

          <View style={[styles.termsCard, { backgroundColor: colors.surface }]}>
            {TERMS_SECTIONS.map((section, index) => (
              <View 
                key={index} 
                style={[
                  styles.section,
                  index !== TERMS_SECTIONS.length - 1 && { 
                    borderBottomWidth: 1, 
                    borderBottomColor: colors.borderLight 
                  },
                ]}
              >
                <Text style={[styles.sectionTitle, { color: colors.primary }]}>
                  {section.title}
                </Text>
                <Text style={[styles.sectionContent, { color: colors.textLight }]}>
                  {section.content}
                </Text>
              </View>
            ))}
          </View>

          <Text style={[styles.footer, { color: colors.textMuted }]}>
            © 2024 PoemCloud. All rights reserved.
          </Text>
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
  lastUpdated: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 20,
  },
  termsCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 14,
    lineHeight: 22,
  },
  footer: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 24,
  },
});
