
export type LanguageCode = 'en' | 'es' | 'pt' | 'fr' | 'de';

export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'pt', name: 'Português' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
];

export const getLanguageName = (code: LanguageCode): string => {
  const language = LANGUAGES.find(lang => lang.code === code);
  return language ? language.name : 'English';
};
