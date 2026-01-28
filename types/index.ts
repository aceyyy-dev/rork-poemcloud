export type Mood = 'calm' | 'sad' | 'love' | 'hope' | 'melancholy' | 'healing' | 'longing' | 'joy' | 'reflection';

export interface Poet {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  bio?: string;
  birthYear?: number;
  deathYear?: number;
  imageUrl?: string;
}

export interface Poem {
  id: string;
  title: string;
  text: string;
  poetId: string;
  poet: Poet;
  originalLanguage: string;
  translatedText?: string;
  moods: Mood[];
  country: string;
  countryCode: string;
  audioUrl?: string;
  culturalContext?: string;
  lineCount: number;
  isPremium?: boolean;
}

export interface Collection {
  id: string;
  title: string;
  description: string;
  coverImageUrl?: string;
  coverIcon?: string;
  coverGradient?: readonly [string, string];
  poemIds: string[];
  isPremium: boolean;
  poemCount: number;
  category?: 'emotions' | 'moments' | 'length' | 'cultures';
}

export interface UserPreferences {
  moods: Mood[];
  countries: string[];
  hasCompletedOnboarding: boolean;
  isPremium: boolean;
  bookmarkedPoemIds: string[];
  likedPoemIds: string[];
  readPoemIds: string[];
}

export interface ReadingStats {
  totalPoemsRead: number;
  currentStreak: number;
  longestStreak: number;
  favoritePoets: string[];
  favoriteMoods: Mood[];
  favoriteCountries: string[];
}

export interface Country {
  code: string;
  name: string;
  flag: string;
}

export interface Playlist {
  id: string;
  title: string;
  coverImageUrl?: string;
  moods: Mood[];
  countryCodes: string[];
  poemIds: string[];
  createdAt: number;
  updatedAt: number;
}
