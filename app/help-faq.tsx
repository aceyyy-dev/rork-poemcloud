import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    id: '1',
    question: 'What is PoemCloud+?',
    answer: 'PoemCloud+ is our premium subscription that unlocks the full poetry experience. Subscribers get unlimited bookmarks, audio narration (Listen feature), AI-powered translations to original languages, and access to exclusive curated collections. It\'s designed for poetry lovers who want to dive deeper into verses from around the world.',
  },
  {
    id: '2',
    question: 'Why are Listen (TTS) and Translate premium features?',
    answer: 'These features require significant resources to deliver a quality experience. Listen uses advanced text-to-speech technology to bring poems to life with natural-sounding narration. Translate uses AI to recreate poems in their original languages, preserving cultural nuances. By making these premium, we can continue improving them while keeping the core app free for everyone.',
  },
  {
    id: '3',
    question: 'What does "Original (AI generated)" mean?',
    answer: 'When you see "Original (AI generated)" on a translation, it means the text was created using AI to approximate what the poem might sound like in its original language. Since many classical poems don\'t have verified original texts in our database, AI helps bridge that gap. It\'s a creative interpretation, not a historical document—think of it as a poetic reconstruction.',
  },
  {
    id: '4',
    question: 'How do bookmarks work (20 limit on free)?',
    answer: 'Free users can save up to 20 poems to their bookmarks. This lets you build a personal collection of favorites. If you reach the limit, you\'ll need to remove an existing bookmark before adding a new one—or upgrade to PoemCloud+ for unlimited bookmarks. Your bookmarks sync across devices when signed in.',
  },
  {
    id: '5',
    question: 'How do curated collections work?',
    answer: 'Curated collections are themed groups of poems handpicked by our editorial team. They\'re organized by emotions (like Hope or Melancholy), moments (like Morning Coffee or Sleepless Nights), atmospheres, and more. Browse them in the Collections tab to discover poems that match your mood or explore new themes.',
  },
  {
    id: '6',
    question: 'How do I restore purchases?',
    answer: 'Go to Settings → Subscription section → tap "Restore Purchases". This will check the App Store or Google Play for any previous PoemCloud+ subscriptions linked to your account. If you subscribed on a different device, this will restore your premium access. Make sure you\'re signed into the same Apple ID or Google account you used to subscribe.',
  },
  {
    id: '7',
    question: 'How do I contact support?',
    answer: 'We\'re here to help! You can reach our support team by emailing support@poemcloud.app. Please include details about your issue, your device type, and app version (shown at the bottom of Settings). We typically respond within 24-48 hours. For account or billing issues, include the email associated with your subscription.',
  },
];

export default function HelpFAQScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
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
          <Text style={[styles.headerTitle, { color: colors.primary }]}>Help & FAQ</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.introText, { color: colors.textMuted }]}>
            Find answers to common questions about PoemCloud
          </Text>

          <View style={[styles.faqCard, { backgroundColor: colors.surface }]}>
            {FAQ_ITEMS.map((item, index) => {
              const isExpanded = expandedId === item.id;
              const isLast = index === FAQ_ITEMS.length - 1;

              return (
                <View key={item.id}>
                  <TouchableOpacity
                    style={[
                      styles.faqItem,
                      !isLast && !isExpanded && { borderBottomWidth: 1, borderBottomColor: colors.borderLight },
                    ]}
                    onPress={() => toggleExpand(item.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.question, { color: colors.primary }]}>
                      {item.question}
                    </Text>
                    {isExpanded ? (
                      <ChevronUp size={20} color={colors.accent} />
                    ) : (
                      <ChevronDown size={20} color={colors.textMuted} />
                    )}
                  </TouchableOpacity>

                  {isExpanded && (
                    <View style={[
                      styles.answerContainer,
                      { backgroundColor: colors.surfaceSecondary },
                      !isLast && { borderBottomWidth: 1, borderBottomColor: colors.borderLight },
                    ]}>
                      <Text style={[styles.answer, { color: colors.textLight }]}>
                        {item.answer}
                      </Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>

          <View style={styles.contactSection}>
            <Text style={[styles.contactTitle, { color: colors.primary }]}>
              Still have questions?
            </Text>
            <Text style={[styles.contactText, { color: colors.textMuted }]}>
              Reach out to us at support@poemcloud.app
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
  introText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  faqCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  faqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    gap: 12,
  },
  question: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 22,
  },
  answerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  answer: {
    fontSize: 14,
    lineHeight: 22,
  },
  contactSection: {
    marginTop: 32,
    alignItems: 'center',
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
  },
});
