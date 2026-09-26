import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from './locales/en.json'
import uk from './locales/uk.json'
import es from './locales/es.json'
import ja from './locales/ja.json'
import zh from './locales/zh.json'
import ru from './locales/ru.json'

export interface LanguageItem {
  code: string
  name: string
  nativeName: string
  flag: string
}

export const supportedLanguages: LanguageItem[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
]

export const resources = {
  en: { translation: en },
  uk: { translation: uk },
  es: { translation: es },
  ja: { translation: ja },
  zh: { translation: zh },
  ru: { translation: ru },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'uk', 'es', 'ja', 'zh', 'ru'],
    debug: false,
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'ghoulgrid_lang',
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  })

export default i18n
