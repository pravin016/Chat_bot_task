import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

const resources = {
  en: {
    translation: {
      "welcome": "Welcome",
      "chat": "Chat",
      "profile": "Profile"
    }
  },
  es: {
    translation: {
      "welcome": "Bienvenido",
      "chat": "Chatear",
      "profile": "Perfil"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: Localization.getLocales()[0]?.languageCode || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
