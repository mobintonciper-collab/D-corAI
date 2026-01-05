
export interface AppSettings {
  freeLimit: number;
  tokenPrice: number;
  currency: string;
  primaryColor: string;
  themeMode: 'light' | 'dark';
  language: 'fa' | 'en';
  logoUrl: string;
}

export interface UserProfile {
  id: string;
  credits: number;
}

export interface UserState extends UserProfile {
  isAdmin: boolean;
}

export enum AppSection {
  EDITOR = 'editor',
  ADVISOR = 'advisor',
  ANIMATOR = 'animator',
  PRICING = 'pricing',
  PROFILE = 'profile'
}
