export type ThemeColors = {
  primary: string;
  secondary: string;
  accent: string;
  accentLight: string;
  background: string;
  surface: string;
  surfaceSecondary: string;
  text: string;
  textLight: string;
  textMuted: string;
  textWhite: string;
  cloud1: string;
  cloud2: string;
  cloud3: string;
  cloud4: string;
  gradientStart: string;
  gradientMid: string;
  gradientEnd: string;
  cardBg: string;
  overlay: string;
  premium: string;
  premiumLight: string;
  mood: Record<string, string>;
  border: string;
  borderLight: string;
  success: string;
  error: string;
  tabBar: {
    active: string;
    inactive: string;
    background: string;
  };
};

export const lightTheme: ThemeColors = {
  primary: '#2c3e50',
  secondary: '#5a7a94',
  accent: '#4a90a4',
  accentLight: '#a8d4e6',
  background: '#f5f9fc',
  surface: '#ffffff',
  surfaceSecondary: '#eef4f8',
  text: '#2c3e50',
  textLight: '#5a7a94',
  textMuted: '#8fa8bc',
  textWhite: '#ffffff',
  cloud1: '#dce8f0',
  cloud2: '#e4f0f8',
  cloud3: '#d4e4f0',
  cloud4: '#eaf4fa',
  gradientStart: '#e8f4fc',
  gradientMid: '#dce8f4',
  gradientEnd: '#f0f6fa',
  cardBg: 'rgba(255, 255, 255, 0.95)',
  overlay: 'rgba(44, 62, 80, 0.4)',
  premium: '#4a90a4',
  premiumLight: '#e8f4fa',
  mood: {
    calm: '#7eb8c9',
    sad: '#8b9dc3',
    love: '#d4a5a5',
    hope: '#a5c9b5',
    melancholy: '#a3a3c2',
    healing: '#9fc2b5',
    longing: '#b8a5c9',
    joy: '#c9c47e',
    reflection: '#94b8c9',
  },
  border: '#d4e4f0',
  borderLight: '#e8f0f5',
  success: '#7eb8a3',
  error: '#c98b87',
  tabBar: {
    active: '#2c3e50',
    inactive: '#8fa8bc',
    background: '#ffffff',
  },
};

export const darkTheme: ThemeColors = {
  primary: '#e8f4fc',
  secondary: '#a8c8dc',
  accent: '#6ab0c9',
  accentLight: '#2a4a5a',
  background: '#0d1a24',
  surface: '#162836',
  surfaceSecondary: '#1e3444',
  text: '#e8f4fc',
  textLight: '#a8c8dc',
  textMuted: '#6a8a9c',
  textWhite: '#ffffff',
  cloud1: '#1a2a36',
  cloud2: '#1e3040',
  cloud3: '#162836',
  cloud4: '#1a2c3a',
  gradientStart: '#0d1a24',
  gradientMid: '#122230',
  gradientEnd: '#0d1a24',
  cardBg: 'rgba(22, 40, 54, 0.95)',
  overlay: 'rgba(0, 0, 0, 0.6)',
  premium: '#6ab0c9',
  premiumLight: '#1e3444',
  mood: {
    calm: '#7eb8c9',
    sad: '#8b9dc3',
    love: '#d4a5a5',
    hope: '#a5c9b5',
    melancholy: '#a3a3c2',
    healing: '#9fc2b5',
    longing: '#b8a5c9',
    joy: '#c9c47e',
    reflection: '#94b8c9',
  },
  border: '#2a4050',
  borderLight: '#1e3444',
  success: '#7eb8a3',
  error: '#c98b87',
  tabBar: {
    active: '#e8f4fc',
    inactive: '#6a8a9c',
    background: '#162836',
  },
};

export type ThemeId = 
  | 'light' 
  | 'dark' 
  | 'system'
  | 'ink-night'
  | 'dawn-pages'
  | 'moss-paper'
  | 'ember-quiet'
  | 'fog-silence'
  | 'nocturne-violet';

export type PremiumThemeDefinition = {
  id: ThemeId;
  name: string;
  isPremium: boolean;
  previewColors: {
    light: { bg: string; card: string; accent: string };
    dark: { bg: string; card: string; accent: string };
  };
  light: ThemeColors;
  dark: ThemeColors;
};

const inkNightLight: ThemeColors = {
  primary: '#1a1a1a',
  secondary: '#4a4a4a',
  accent: '#6b7280',
  accentLight: '#d1d5db',
  background: '#e8e6e3',
  surface: '#1f1f1f',
  surfaceSecondary: '#2a2a2a',
  text: '#1a1a1a',
  textLight: '#4a4a4a',
  textMuted: '#6b7280',
  textWhite: '#ffffff',
  cloud1: '#d4d2cf',
  cloud2: '#dcdad7',
  cloud3: '#cccac7',
  cloud4: '#e0dedb',
  gradientStart: '#e8e6e3',
  gradientMid: '#dfddd9',
  gradientEnd: '#e8e6e3',
  cardBg: 'rgba(31, 31, 31, 0.95)',
  overlay: 'rgba(0, 0, 0, 0.5)',
  premium: '#6b7280',
  premiumLight: '#d1d5db',
  mood: {
    calm: '#9ca3af',
    sad: '#8b9dc3',
    love: '#d4a5a5',
    hope: '#a5c9b5',
    melancholy: '#a3a3c2',
    healing: '#9fc2b5',
    longing: '#b8a5c9',
    joy: '#c9c47e',
    reflection: '#94b8c9',
  },
  border: '#c4c2bf',
  borderLight: '#d4d2cf',
  success: '#7eb8a3',
  error: '#c98b87',
  tabBar: {
    active: '#1a1a1a',
    inactive: '#6b7280',
    background: '#f0eeeb',
  },
};

const inkNightDark: ThemeColors = {
  primary: '#e5e5e5',
  secondary: '#a3a3a3',
  accent: '#9ca3af',
  accentLight: '#374151',
  background: '#18181b',
  surface: '#27272a',
  surfaceSecondary: '#3f3f46',
  text: '#e5e5e5',
  textLight: '#a3a3a3',
  textMuted: '#71717a',
  textWhite: '#ffffff',
  cloud1: '#27272a',
  cloud2: '#2d2d30',
  cloud3: '#232326',
  cloud4: '#2a2a2e',
  gradientStart: '#18181b',
  gradientMid: '#1f1f23',
  gradientEnd: '#18181b',
  cardBg: 'rgba(39, 39, 42, 0.95)',
  overlay: 'rgba(0, 0, 0, 0.7)',
  premium: '#9ca3af',
  premiumLight: '#3f3f46',
  mood: {
    calm: '#9ca3af',
    sad: '#8b9dc3',
    love: '#d4a5a5',
    hope: '#a5c9b5',
    melancholy: '#a3a3c2',
    healing: '#9fc2b5',
    longing: '#b8a5c9',
    joy: '#c9c47e',
    reflection: '#94b8c9',
  },
  border: '#3f3f46',
  borderLight: '#27272a',
  success: '#7eb8a3',
  error: '#c98b87',
  tabBar: {
    active: '#e5e5e5',
    inactive: '#71717a',
    background: '#27272a',
  },
};

const dawnPagesLight: ThemeColors = {
  primary: '#5c4033',
  secondary: '#8b7355',
  accent: '#d4a574',
  accentLight: '#f5e6d3',
  background: '#faf6f0',
  surface: '#f5ede0',
  surfaceSecondary: '#efe5d5',
  text: '#5c4033',
  textLight: '#8b7355',
  textMuted: '#a89078',
  textWhite: '#ffffff',
  cloud1: '#f0e6d8',
  cloud2: '#f5ede0',
  cloud3: '#ebe1d3',
  cloud4: '#f8f0e5',
  gradientStart: '#faf6f0',
  gradientMid: '#f5ede0',
  gradientEnd: '#faf6f0',
  cardBg: 'rgba(245, 237, 224, 0.95)',
  overlay: 'rgba(92, 64, 51, 0.4)',
  premium: '#d4a574',
  premiumLight: '#f5e6d3',
  mood: {
    calm: '#c9b896',
    sad: '#a89078',
    love: '#d4a5a5',
    hope: '#b5c9a5',
    melancholy: '#b8a5c9',
    healing: '#a5c9b5',
    longing: '#c9a5b8',
    joy: '#d4c47e',
    reflection: '#a5b8c9',
  },
  border: '#e5dbc8',
  borderLight: '#f0e6d8',
  success: '#9fc2a5',
  error: '#c9877e',
  tabBar: {
    active: '#5c4033',
    inactive: '#a89078',
    background: '#faf6f0',
  },
};

const dawnPagesDark: ThemeColors = {
  primary: '#f5e6d3',
  secondary: '#d4c4a8',
  accent: '#d4a574',
  accentLight: '#4a3828',
  background: '#2a2118',
  surface: '#3d3024',
  surfaceSecondary: '#4a3828',
  text: '#f5e6d3',
  textLight: '#d4c4a8',
  textMuted: '#a89070',
  textWhite: '#ffffff',
  cloud1: '#3d3024',
  cloud2: '#453828',
  cloud3: '#352a1e',
  cloud4: '#3f3226',
  gradientStart: '#2a2118',
  gradientMid: '#32281e',
  gradientEnd: '#2a2118',
  cardBg: 'rgba(61, 48, 36, 0.95)',
  overlay: 'rgba(0, 0, 0, 0.6)',
  premium: '#d4a574',
  premiumLight: '#4a3828',
  mood: {
    calm: '#c9b896',
    sad: '#a89078',
    love: '#d4a5a5',
    hope: '#b5c9a5',
    melancholy: '#b8a5c9',
    healing: '#a5c9b5',
    longing: '#c9a5b8',
    joy: '#d4c47e',
    reflection: '#a5b8c9',
  },
  border: '#4a3828',
  borderLight: '#3d3024',
  success: '#9fc2a5',
  error: '#c9877e',
  tabBar: {
    active: '#f5e6d3',
    inactive: '#a89070',
    background: '#3d3024',
  },
};

const mossPaperLight: ThemeColors = {
  primary: '#2d4a3e',
  secondary: '#5a7a68',
  accent: '#7a9a88',
  accentLight: '#d4e4db',
  background: '#e8f0eb',
  surface: '#ffffff',
  surfaceSecondary: '#f0f5f2',
  text: '#2d4a3e',
  textLight: '#5a7a68',
  textMuted: '#8aa898',
  textWhite: '#ffffff',
  cloud1: '#dce8e1',
  cloud2: '#e4f0e8',
  cloud3: '#d4e4db',
  cloud4: '#eaf4ee',
  gradientStart: '#e8f0eb',
  gradientMid: '#dfe8e3',
  gradientEnd: '#e8f0eb',
  cardBg: 'rgba(255, 255, 255, 0.95)',
  overlay: 'rgba(45, 74, 62, 0.4)',
  premium: '#7a9a88',
  premiumLight: '#d4e4db',
  mood: {
    calm: '#8ab89a',
    sad: '#8b9dc3',
    love: '#d4a5a5',
    hope: '#a5c9b5',
    melancholy: '#a3a3c2',
    healing: '#9fc2b5',
    longing: '#b8a5c9',
    joy: '#c9c47e',
    reflection: '#94b8c9',
  },
  border: '#c4d8cc',
  borderLight: '#dce8e1',
  success: '#7eb8a3',
  error: '#c98b87',
  tabBar: {
    active: '#2d4a3e',
    inactive: '#8aa898',
    background: '#ffffff',
  },
};

const mossPaperDark: ThemeColors = {
  primary: '#d4e8dc',
  secondary: '#a8c8b4',
  accent: '#8ab89a',
  accentLight: '#2a4a3a',
  background: '#0f1f18',
  surface: '#1a2f24',
  surfaceSecondary: '#243d30',
  text: '#d4e8dc',
  textLight: '#a8c8b4',
  textMuted: '#6a9a7c',
  textWhite: '#ffffff',
  cloud1: '#1a2f24',
  cloud2: '#1e3528',
  cloud3: '#162a1f',
  cloud4: '#1c3126',
  gradientStart: '#0f1f18',
  gradientMid: '#14261e',
  gradientEnd: '#0f1f18',
  cardBg: 'rgba(26, 47, 36, 0.95)',
  overlay: 'rgba(0, 0, 0, 0.6)',
  premium: '#8ab89a',
  premiumLight: '#243d30',
  mood: {
    calm: '#8ab89a',
    sad: '#8b9dc3',
    love: '#d4a5a5',
    hope: '#a5c9b5',
    melancholy: '#a3a3c2',
    healing: '#9fc2b5',
    longing: '#b8a5c9',
    joy: '#c9c47e',
    reflection: '#94b8c9',
  },
  border: '#2a4a3a',
  borderLight: '#1a2f24',
  success: '#7eb8a3',
  error: '#c98b87',
  tabBar: {
    active: '#d4e8dc',
    inactive: '#6a9a7c',
    background: '#1a2f24',
  },
};

const emberQuietLight: ThemeColors = {
  primary: '#4a3530',
  secondary: '#7a5a50',
  accent: '#c97a5c',
  accentLight: '#f5e0d8',
  background: '#f5f0eb',
  surface: '#fffaf5',
  surfaceSecondary: '#f5ebe3',
  text: '#4a3530',
  textLight: '#7a5a50',
  textMuted: '#a88a78',
  textWhite: '#ffffff',
  cloud1: '#ebe3db',
  cloud2: '#f0e8e0',
  cloud3: '#e5ddd5',
  cloud4: '#f5ede5',
  gradientStart: '#f5f0eb',
  gradientMid: '#f0e8e0',
  gradientEnd: '#f5f0eb',
  cardBg: 'rgba(255, 250, 245, 0.95)',
  overlay: 'rgba(74, 53, 48, 0.4)',
  premium: '#c97a5c',
  premiumLight: '#f5e0d8',
  mood: {
    calm: '#c9a87e',
    sad: '#a88a78',
    love: '#c9877e',
    hope: '#a5c9b5',
    melancholy: '#b8a5c9',
    healing: '#9fc2b5',
    longing: '#c9a5b8',
    joy: '#c9c47e',
    reflection: '#a5b8c9',
  },
  border: '#e0d4c8',
  borderLight: '#ebe3db',
  success: '#9fc2a5',
  error: '#c9877e',
  tabBar: {
    active: '#4a3530',
    inactive: '#a88a78',
    background: '#fffaf5',
  },
};

const emberQuietDark: ThemeColors = {
  primary: '#f5e0d8',
  secondary: '#d4b8a8',
  accent: '#d4886a',
  accentLight: '#4a3028',
  background: '#1f1814',
  surface: '#2f2420',
  surfaceSecondary: '#3d302a',
  text: '#f5e0d8',
  textLight: '#d4b8a8',
  textMuted: '#a88070',
  textWhite: '#ffffff',
  cloud1: '#2f2420',
  cloud2: '#352a24',
  cloud3: '#291e1a',
  cloud4: '#312622',
  gradientStart: '#1f1814',
  gradientMid: '#261e1a',
  gradientEnd: '#1f1814',
  cardBg: 'rgba(47, 36, 32, 0.95)',
  overlay: 'rgba(0, 0, 0, 0.6)',
  premium: '#d4886a',
  premiumLight: '#3d302a',
  mood: {
    calm: '#c9a87e',
    sad: '#a88a78',
    love: '#c9877e',
    hope: '#a5c9b5',
    melancholy: '#b8a5c9',
    healing: '#9fc2b5',
    longing: '#c9a5b8',
    joy: '#c9c47e',
    reflection: '#a5b8c9',
  },
  border: '#3d302a',
  borderLight: '#2f2420',
  success: '#9fc2a5',
  error: '#c9877e',
  tabBar: {
    active: '#f5e0d8',
    inactive: '#a88070',
    background: '#2f2420',
  },
};

const fogSilenceLight: ThemeColors = {
  primary: '#3a4550',
  secondary: '#5a6a78',
  accent: '#9a8ab8',
  accentLight: '#e8e0f0',
  background: '#f0f2f5',
  surface: '#ffffff',
  surfaceSecondary: '#e8eaed',
  text: '#3a4550',
  textLight: '#5a6a78',
  textMuted: '#8a9aa8',
  textWhite: '#ffffff',
  cloud1: '#e0e4e8',
  cloud2: '#e8ecf0',
  cloud3: '#d8dce0',
  cloud4: '#ecf0f4',
  gradientStart: '#f0f2f5',
  gradientMid: '#e8eaed',
  gradientEnd: '#f0f2f5',
  cardBg: 'rgba(255, 255, 255, 0.95)',
  overlay: 'rgba(58, 69, 80, 0.4)',
  premium: '#9a8ab8',
  premiumLight: '#e8e0f0',
  mood: {
    calm: '#8aa8b8',
    sad: '#8b9dc3',
    love: '#d4a5a5',
    hope: '#a5c9b5',
    melancholy: '#a3a3c2',
    healing: '#9fc2b5',
    longing: '#b8a5c9',
    joy: '#c9c47e',
    reflection: '#94b8c9',
  },
  border: '#d0d4d8',
  borderLight: '#e0e4e8',
  success: '#7eb8a3',
  error: '#c98b87',
  tabBar: {
    active: '#3a4550',
    inactive: '#8a9aa8',
    background: '#ffffff',
  },
};

const fogSilenceDark: ThemeColors = {
  primary: '#e0e4e8',
  secondary: '#a8b4c0',
  accent: '#a898c8',
  accentLight: '#3a4558',
  background: '#1a2028',
  surface: '#242c38',
  surfaceSecondary: '#303848',
  text: '#e0e4e8',
  textLight: '#a8b4c0',
  textMuted: '#6a7a8a',
  textWhite: '#ffffff',
  cloud1: '#242c38',
  cloud2: '#28303c',
  cloud3: '#1e2630',
  cloud4: '#262e3a',
  gradientStart: '#1a2028',
  gradientMid: '#1e262e',
  gradientEnd: '#1a2028',
  cardBg: 'rgba(36, 44, 56, 0.95)',
  overlay: 'rgba(0, 0, 0, 0.6)',
  premium: '#a898c8',
  premiumLight: '#303848',
  mood: {
    calm: '#8aa8b8',
    sad: '#8b9dc3',
    love: '#d4a5a5',
    hope: '#a5c9b5',
    melancholy: '#a3a3c2',
    healing: '#9fc2b5',
    longing: '#b8a5c9',
    joy: '#c9c47e',
    reflection: '#94b8c9',
  },
  border: '#303848',
  borderLight: '#242c38',
  success: '#7eb8a3',
  error: '#c98b87',
  tabBar: {
    active: '#e0e4e8',
    inactive: '#6a7a8a',
    background: '#242c38',
  },
};

const nocturneVioletLight: ThemeColors = {
  primary: '#3a3550',
  secondary: '#5a5578',
  accent: '#8a78b8',
  accentLight: '#e8e0f5',
  background: '#f5f3f8',
  surface: '#ffffff',
  surfaceSecondary: '#f0edf5',
  text: '#3a3550',
  textLight: '#5a5578',
  textMuted: '#8a88a8',
  textWhite: '#ffffff',
  cloud1: '#e8e4f0',
  cloud2: '#f0ecf5',
  cloud3: '#e0dceb',
  cloud4: '#f3eff8',
  gradientStart: '#f5f3f8',
  gradientMid: '#f0edf5',
  gradientEnd: '#f5f3f8',
  cardBg: 'rgba(255, 255, 255, 0.95)',
  overlay: 'rgba(58, 53, 80, 0.4)',
  premium: '#8a78b8',
  premiumLight: '#e8e0f5',
  mood: {
    calm: '#9a8ac9',
    sad: '#8b9dc3',
    love: '#d4a5a5',
    hope: '#a5c9b5',
    melancholy: '#a3a3c2',
    healing: '#9fc2b5',
    longing: '#b8a5c9',
    joy: '#c9c47e',
    reflection: '#94b8c9',
  },
  border: '#d8d4e4',
  borderLight: '#e8e4f0',
  success: '#7eb8a3',
  error: '#c98b87',
  tabBar: {
    active: '#3a3550',
    inactive: '#8a88a8',
    background: '#ffffff',
  },
};

const nocturneVioletDark: ThemeColors = {
  primary: '#e8e0f5',
  secondary: '#c0b8d8',
  accent: '#9a88c8',
  accentLight: '#3a3050',
  background: '#14121a',
  surface: '#201e28',
  surfaceSecondary: '#2a2838',
  text: '#e8e0f5',
  textLight: '#c0b8d8',
  textMuted: '#7a78a0',
  textWhite: '#ffffff',
  cloud1: '#201e28',
  cloud2: '#24222c',
  cloud3: '#1a1822',
  cloud4: '#22202a',
  gradientStart: '#14121a',
  gradientMid: '#18161e',
  gradientEnd: '#14121a',
  cardBg: 'rgba(32, 30, 40, 0.95)',
  overlay: 'rgba(0, 0, 0, 0.6)',
  premium: '#9a88c8',
  premiumLight: '#2a2838',
  mood: {
    calm: '#9a8ac9',
    sad: '#8b9dc3',
    love: '#d4a5a5',
    hope: '#a5c9b5',
    melancholy: '#a3a3c2',
    healing: '#9fc2b5',
    longing: '#b8a5c9',
    joy: '#c9c47e',
    reflection: '#94b8c9',
  },
  border: '#2a2838',
  borderLight: '#201e28',
  success: '#7eb8a3',
  error: '#c98b87',
  tabBar: {
    active: '#e8e0f5',
    inactive: '#7a78a0',
    background: '#201e28',
  },
};

export const premiumThemes: PremiumThemeDefinition[] = [
  {
    id: 'ink-night',
    name: 'Ink Night',
    isPremium: true,
    previewColors: {
      light: { bg: '#e8e6e3', card: '#1f1f1f', accent: '#6b7280' },
      dark: { bg: '#18181b', card: '#27272a', accent: '#9ca3af' },
    },
    light: inkNightLight,
    dark: inkNightDark,
  },
  {
    id: 'dawn-pages',
    name: 'Dawn Pages',
    isPremium: true,
    previewColors: {
      light: { bg: '#faf6f0', card: '#f5ede0', accent: '#d4a574' },
      dark: { bg: '#2a2118', card: '#3d3024', accent: '#d4a574' },
    },
    light: dawnPagesLight,
    dark: dawnPagesDark,
  },
  {
    id: 'moss-paper',
    name: 'Moss & Paper',
    isPremium: true,
    previewColors: {
      light: { bg: '#e8f0eb', card: '#ffffff', accent: '#7a9a88' },
      dark: { bg: '#0f1f18', card: '#1a2f24', accent: '#8ab89a' },
    },
    light: mossPaperLight,
    dark: mossPaperDark,
  },
  {
    id: 'ember-quiet',
    name: 'Ember Quiet',
    isPremium: true,
    previewColors: {
      light: { bg: '#f5f0eb', card: '#fffaf5', accent: '#c97a5c' },
      dark: { bg: '#1f1814', card: '#2f2420', accent: '#d4886a' },
    },
    light: emberQuietLight,
    dark: emberQuietDark,
  },
  {
    id: 'fog-silence',
    name: 'Fog & Silence',
    isPremium: true,
    previewColors: {
      light: { bg: '#f0f2f5', card: '#ffffff', accent: '#9a8ab8' },
      dark: { bg: '#1a2028', card: '#242c38', accent: '#a898c8' },
    },
    light: fogSilenceLight,
    dark: fogSilenceDark,
  },
  {
    id: 'nocturne-violet',
    name: 'Nocturne Violet',
    isPremium: true,
    previewColors: {
      light: { bg: '#f5f3f8', card: '#ffffff', accent: '#8a78b8' },
      dark: { bg: '#14121a', card: '#201e28', accent: '#9a88c8' },
    },
    light: nocturneVioletLight,
    dark: nocturneVioletDark,
  },
];

export const freeThemes: { id: ThemeId; name: string; isPremium: boolean }[] = [
  { id: 'light', name: 'Light', isPremium: false },
  { id: 'dark', name: 'Dark', isPremium: false },
  { id: 'system', name: 'System', isPremium: false },
];

export function getThemeColors(themeId: ThemeId, isDarkMode: boolean): ThemeColors {
  if (themeId === 'light') return lightTheme;
  if (themeId === 'dark') return darkTheme;
  if (themeId === 'system') return isDarkMode ? darkTheme : lightTheme;
  
  const premiumTheme = premiumThemes.find(t => t.id === themeId);
  if (premiumTheme) {
    return isDarkMode ? premiumTheme.dark : premiumTheme.light;
  }
  
  return isDarkMode ? darkTheme : lightTheme;
}

export default lightTheme;
