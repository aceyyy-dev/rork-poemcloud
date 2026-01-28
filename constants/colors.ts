const lightTheme = {
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
  } as Record<string, string>,
  
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

const darkTheme = {
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
  } as Record<string, string>,
  
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

export type ThemeColors = typeof lightTheme;

export { lightTheme, darkTheme };

export default lightTheme;
