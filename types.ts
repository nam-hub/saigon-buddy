
export type ChatMode = 'Teen' | 'Friendly' | 'Polite';

export interface UserProfile {
  name: string;
  buddyName: string;
  mode: ChatMode;
  mood: string;
  strengths: string[];
  weaknesses: string[];
  interests: string[];
  dislikes: string[];
  lastUpdate: string;
}

export interface Message {
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export interface SaigonLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  year: string;
  shortDesc: string;
  fullDesc: string;
  imagePrompt: string;
  tips: string;
  category: 'historical' | 'modern' | 'nature' | 'food';
}
