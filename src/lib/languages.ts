
export type LanguageCode = 'en' | 'es' | 'pt' | 'fr' | 'de';

// This is used for the language switcher UI
export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'pt', name: 'Português' }, // This maps to 'pt-br' in our translations
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
];

export const getLanguageName = (code: LanguageCode | 'pt-br'): string => {
  // Special case for Portuguese Brazil
  if (code === 'pt-br') return 'Português (BR)';
  
  const language = LANGUAGES.find(lang => lang.code === code);
  return language ? language.name : 'English';
};
