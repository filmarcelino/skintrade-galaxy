
export type LanguageCode = 'en' | 'es' | 'pt-br';

export const LANGUAGES = {
  en: 'English',
  es: 'Español',
  'pt-br': 'Português (BR)'
};

export const DEFAULT_LANGUAGE: LanguageCode = 'en';

export type Translation = {
  [key: string]: string;
};

export type Translations = {
  [key in LanguageCode]: Translation;
};
