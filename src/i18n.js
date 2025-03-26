import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      welcome: 'Welcome to AI Concierge',
      login: 'Login',
      register: 'Register',
      dashboard: 'Dashboard',
      profile: 'Profile',
      settings: 'Settings',
      recommendations: 'Recommendations',
      bookings: 'Bookings',
      analytics: 'Analytics',
    }
  },
  de: {
    translation: {
      welcome: 'Willkommen bei AI Concierge',
      login: 'Anmelden',
      register: 'Registrieren',
      dashboard: 'Dashboard',
      profile: 'Profil',
      settings: 'Einstellungen',
      recommendations: 'Empfehlungen',
      bookings: 'Buchungen',
      analytics: 'Analysen',
    }
  },
  fr: {
    translation: {
      welcome: 'Bienvenue chez AI Concierge',
      login: 'Connexion',
      register: 'S\'inscrire',
      dashboard: 'Tableau de bord',
      profile: 'Profil',
      settings: 'Paramètres',
      recommendations: 'Recommandations',
      bookings: 'Réservations',
      analytics: 'Analytique',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n; 