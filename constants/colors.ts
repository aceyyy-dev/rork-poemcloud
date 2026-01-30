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
  | 'fog-silence'
  | 'nocturne-violet'
  | 'morning-light'
  | 'golden-dusk'
  | 'blue-hour';

export type PremiumThemeDefinition = {
  id: ThemeId;
  name: string;
  isPremium: boolean;
  previewColors: { bg: string; card: string; accent: string };
  colors: ThemeColors;
  isIllustrated?: false;
};

export type IllustratedThemeDefinition = {
  id: ThemeId;
  name: string;
  isPremium: boolean;
  isIllustrated: true;
  backgroundImage: string;
  overlayColor: string;
  previewColors: { bg: string; card: string; accent: string };
  colors: ThemeColors;
};

const inkNight: ThemeColors = {
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

const dawnPages: ThemeColors = {
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



const fogSilence: ThemeColors = {
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

const nocturneViolet: ThemeColors = {
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

const morningLight: ThemeColors = {
  primary: '#5c4a3a',
  secondary: '#8b7a68',
  accent: '#d4a574',
  accentLight: '#f5e6d3',
  background: 'transparent',
  surface: 'rgba(255, 252, 247, 0.88)',
  surfaceSecondary: 'rgba(250, 245, 235, 0.85)',
  text: '#4a3a2a',
  textLight: '#7a6a58',
  textMuted: '#9a8a78',
  textWhite: '#ffffff',
  cloud1: 'rgba(255, 250, 240, 0.6)',
  cloud2: 'rgba(255, 248, 235, 0.5)',
  cloud3: 'rgba(250, 245, 230, 0.55)',
  cloud4: 'rgba(255, 252, 242, 0.5)',
  gradientStart: '#faf6f0',
  gradientMid: '#f5ede0',
  gradientEnd: '#faf6f0',
  cardBg: 'rgba(255, 252, 247, 0.92)',
  overlay: 'rgba(92, 74, 58, 0.4)',
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
  border: 'rgba(200, 185, 165, 0.5)',
  borderLight: 'rgba(220, 205, 185, 0.4)',
  success: '#9fc2a5',
  error: '#c9877e',
  tabBar: {
    active: '#5c4a3a',
    inactive: '#9a8a78',
    background: 'rgba(255, 252, 247, 0.95)',
  },
};

const goldenDusk: ThemeColors = {
  primary: '#f5e8e0',
  secondary: '#e0c8b8',
  accent: '#e8a080',
  accentLight: '#4a3028',
  background: 'transparent',
  surface: 'rgba(45, 32, 28, 0.88)',
  surfaceSecondary: 'rgba(55, 40, 35, 0.85)',
  text: '#f5e8e0',
  textLight: '#e0c8b8',
  textMuted: '#b8a090',
  textWhite: '#ffffff',
  cloud1: 'rgba(60, 45, 40, 0.6)',
  cloud2: 'rgba(55, 42, 38, 0.5)',
  cloud3: 'rgba(50, 38, 35, 0.55)',
  cloud4: 'rgba(58, 44, 40, 0.5)',
  gradientStart: '#2a1c18',
  gradientMid: '#3a2820',
  gradientEnd: '#2a1c18',
  cardBg: 'rgba(45, 32, 28, 0.92)',
  overlay: 'rgba(0, 0, 0, 0.5)',
  premium: '#e8a080',
  premiumLight: '#4a3028',
  mood: {
    calm: '#c9a090',
    sad: '#a88890',
    love: '#d4a0a0',
    hope: '#c9b8a0',
    melancholy: '#b8a0b8',
    healing: '#a0c0b0',
    longing: '#c9a0b8',
    joy: '#d4c080',
    reflection: '#a0b0c0',
  },
  border: 'rgba(120, 90, 75, 0.5)',
  borderLight: 'rgba(100, 75, 65, 0.4)',
  success: '#a0c0a8',
  error: '#c98878',
  tabBar: {
    active: '#f5e8e0',
    inactive: '#b8a090',
    background: 'rgba(45, 32, 28, 0.95)',
  },
};

const blueHour: ThemeColors = {
  primary: '#e0e8f5',
  secondary: '#b8c8e0',
  accent: '#8aa0c8',
  accentLight: '#2a3548',
  background: 'transparent',
  surface: 'rgba(28, 35, 55, 0.88)',
  surfaceSecondary: 'rgba(35, 42, 65, 0.85)',
  text: '#e0e8f5',
  textLight: '#b8c8e0',
  textMuted: '#8090a8',
  textWhite: '#ffffff',
  cloud1: 'rgba(35, 42, 60, 0.6)',
  cloud2: 'rgba(38, 45, 65, 0.5)',
  cloud3: 'rgba(32, 40, 58, 0.55)',
  cloud4: 'rgba(36, 44, 62, 0.5)',
  gradientStart: '#1a2035',
  gradientMid: '#242c42',
  gradientEnd: '#1a2035',
  cardBg: 'rgba(28, 35, 55, 0.92)',
  overlay: 'rgba(0, 0, 0, 0.5)',
  premium: '#8aa0c8',
  premiumLight: '#2a3548',
  mood: {
    calm: '#8aa8b8',
    sad: '#8b9dc3',
    love: '#c9a5b5',
    hope: '#a5c9b5',
    melancholy: '#a3a3c2',
    healing: '#9fc2b5',
    longing: '#b8a5c9',
    joy: '#c9c47e',
    reflection: '#94b8c9',
  },
  border: 'rgba(80, 95, 130, 0.5)',
  borderLight: 'rgba(65, 80, 110, 0.4)',
  success: '#7eb8a3',
  error: '#c98b87',
  tabBar: {
    active: '#e0e8f5',
    inactive: '#8090a8',
    background: 'rgba(28, 35, 55, 0.95)',
  },
};

export const premiumColorThemes: PremiumThemeDefinition[] = [
  {
    id: 'ink-night',
    name: 'Ink Night',
    isPremium: true,
    previewColors: { bg: '#18181b', card: '#27272a', accent: '#9ca3af' },
    colors: inkNight,
  },
  {
    id: 'dawn-pages',
    name: 'Dawn Pages',
    isPremium: true,
    previewColors: { bg: '#faf6f0', card: '#f5ede0', accent: '#d4a574' },
    colors: dawnPages,
  },
  {
    id: 'fog-silence',
    name: 'Fog & Silence',
    isPremium: true,
    previewColors: { bg: '#1a2028', card: '#242c38', accent: '#a898c8' },
    colors: fogSilence,
  },
  {
    id: 'nocturne-violet',
    name: 'Nocturne Violet',
    isPremium: true,
    previewColors: { bg: '#14121a', card: '#201e28', accent: '#9a88c8' },
    colors: nocturneViolet,
  },
];

export const illustratedThemes: IllustratedThemeDefinition[] = [
  {
    id: 'morning-light',
    name: 'Morning Light',
    isPremium: true,
    isIllustrated: true,
    backgroundImage: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/1hlrj7g7lfmbgnq45a52u',
    overlayColor: 'rgba(255, 252, 247, 0.15)',
    previewColors: { bg: '#faf6f0', card: '#fff8f0', accent: '#d4a574' },
    colors: morningLight,
  },
  {
    id: 'golden-dusk',
    name: 'Golden Dusk',
    isPremium: true,
    isIllustrated: true,
    backgroundImage: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/3iqmavblyyq7viv6thb52',
    overlayColor: 'rgba(30, 20, 15, 0.25)',
    previewColors: { bg: '#e8a080', card: '#d4886a', accent: '#f5c8a8' },
    colors: goldenDusk,
  },
  {
    id: 'blue-hour',
    name: 'Blue Hour',
    isPremium: true,
    isIllustrated: true,
    backgroundImage: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/jdn8xir8svsmrltzbqqmt',
    overlayColor: 'rgba(20, 25, 45, 0.25)',
    previewColors: { bg: '#3a4a6a', card: '#4a5a7a', accent: '#8aa0c8' },
    colors: blueHour,
  },
];

export const premiumThemes: (PremiumThemeDefinition | IllustratedThemeDefinition)[] = [
  ...premiumColorThemes,
  ...illustratedThemes,
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
    return premiumTheme.colors;
  }
  
  return isDarkMode ? darkTheme : lightTheme;
}

export function getIllustratedTheme(themeId: ThemeId): IllustratedThemeDefinition | null {
  const theme = illustratedThemes.find(t => t.id === themeId);
  return theme || null;
}

export function isIllustratedTheme(themeId: ThemeId): boolean {
  return illustratedThemes.some(t => t.id === themeId);
}

export default lightTheme;
