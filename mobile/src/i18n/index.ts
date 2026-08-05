import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

// Translation strings
const resources = {
  en: {
    translation: {
      "command_center": "Command Center",
      "sdrf_ops": "SDRF Operations",
      "welcome": "Welcome",
      "community_dash": "Community Dashboard",
      "quick_access": "Quick Access",
      "live_map": "Live Map",
      "incidents": "Incident Feed",
      "equipment": "Equipment",
      "report_alert": "Report Alert",
      "recent_directives": "Recent Directives",
      "active_incidents": "Active Incidents",
      "hpsdma_alerts": "HPSDMA Alerts",
      "clear_routes": "Clear Routes",
      "home": "Home",
      "menu": "Menu",
      "settings": "Settings",
      "language": "Language",
      "english": "English",
      "hindi": "Hindi (हिन्दी)",
    }
  },
  hi: {
    translation: {
      "command_center": "कमांड सेंटर",
      "sdrf_ops": "SDRF संचालन",
      "welcome": "स्वागत है",
      "community_dash": "सामुदायिक डैशबोर्ड",
      "quick_access": "त्वरित पहुँच",
      "live_map": "लाइव मैप",
      "incidents": "घटना फ़ीड",
      "equipment": "उपकरण",
      "report_alert": "अलर्ट रिपोर्ट करें",
      "recent_directives": "हाल के निर्देश",
      "active_incidents": "सक्रिय घटनाएं",
      "hpsdma_alerts": "HPSDMA अलर्ट",
      "clear_routes": "साफ रास्ते",
      "home": "होम",
      "menu": "मेनू",
      "settings": "सेटिंग्स",
      "language": "भाषा",
      "english": "अंग्रेज़ी",
      "hindi": "हिन्दी",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: Localization.getLocales()[0].languageCode || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React Native is already safe from xss
    }
  });

export default i18n;
