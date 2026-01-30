import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Search, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { countries } from '@/mocks/countries';
import { poets } from '@/mocks/poets';

type Tab = 'countries' | 'poets';

export default function BrowseScreen() {
  const router = useRouter();
  const { colors, isIllustrated } = useTheme();
  const [activeTab, setActiveTab] = useState<Tab>('countries');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCountries = countries.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPoets = poets.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={[styles.container, { backgroundColor: isIllustrated ? 'transparent' : colors.background }]}>
      {!isIllustrated && (
        <LinearGradient
          colors={[colors.gradientStart, colors.background]}
          style={styles.gradient}
        />
      )}
      
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.primary }]}>Browse</Text>
        </View>

        <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Search size={20} color={colors.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search countries or poets..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={18} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[
              styles.tab,
              { backgroundColor: colors.surface, borderColor: colors.border },
              activeTab === 'countries' && { backgroundColor: colors.primary, borderColor: colors.primary },
            ]}
            onPress={() => setActiveTab('countries')}
          >
            <Text
              style={[
                styles.tabText,
                { color: colors.textMuted },
                activeTab === 'countries' && { color: colors.background },
              ]}
            >
              By Country
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              { backgroundColor: colors.surface, borderColor: colors.border },
              activeTab === 'poets' && { backgroundColor: colors.primary, borderColor: colors.primary },
            ]}
            onPress={() => setActiveTab('poets')}
          >
            <Text
              style={[
                styles.tabText,
                { color: colors.textMuted },
                activeTab === 'poets' && { color: colors.background },
              ]}
            >
              By Poet
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {activeTab === 'countries' ? (
            <View style={styles.grid}>
              {filteredCountries.map((country) => (
                <TouchableOpacity
                  key={country.code}
                  style={[styles.countryCard, { backgroundColor: colors.surface }]}
                  onPress={() => router.push(`/country/${country.code}`)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.countryFlag}>{country.flag}</Text>
                  <Text style={[styles.countryName, { color: colors.primary }]}>{country.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.poetsList}>
              {filteredPoets.map((poet) => (
                <TouchableOpacity
                  key={poet.id}
                  style={[styles.poetCard, { backgroundColor: colors.surface }]}
                  onPress={() => router.push(`/poet/${poet.id}`)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.poetAvatar, { backgroundColor: colors.surfaceSecondary }]}>
                    <Text style={[styles.poetInitial, { color: colors.primary }]}>
                      {poet.name.charAt(0)}
                    </Text>
                  </View>
                  <View style={styles.poetInfo}>
                    <Text style={[styles.poetName, { color: colors.primary }]}>{poet.name}</Text>
                    <Text style={[styles.poetCountry, { color: colors.textMuted }]}>{poet.country}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
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
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  countryCard: {
    width: '47%',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  countryFlag: {
    fontSize: 40,
    marginBottom: 12,
  },
  countryName: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  poetsList: {
    gap: 8,
  },
  poetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  poetAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  poetInitial: {
    fontSize: 20,
    fontWeight: '600',
  },
  poetInfo: {
    flex: 1,
  },
  poetName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  poetCountry: {
    fontSize: 14,
  },
});
