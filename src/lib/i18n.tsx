
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { TRANSLATIONS, LanguageCode, DEFAULT_LANGUAGE } from './constants';

type I18nContextType = {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, fallback?: string) => string;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const savedLanguage = localStorage.getItem('language') as LanguageCode;
    return savedLanguage || DEFAULT_LANGUAGE;
  });

  const setLanguage = (lang: LanguageCode) => {
    localStorage.setItem('language', lang);
    setLanguageState(lang);
  };

  const t = (key: string, fallback?: string): string => {
    const translations = TRANSLATIONS[language];
    return translations[key] || fallback || key;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
