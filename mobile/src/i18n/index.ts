import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import * as SecureStore from 'expo-secure-store';

// Comprehensive translation resources for English & Hindi
const resources = {
  en: {
    translation: {
      // ── Core Navigation & General ──
      "home": "Home",
      "alerts": "Alerts",
      "sos": "SOS Emergency",
      "map": "Live Map",
      "volunteer": "Volunteer",
      "menu": "Menu",
      "resources": "Resources",
      "profile": "Profile",
      "logout": "Logout",
      "settings": "App Settings",
      "language": "App Language / भाषा",
      "english": "English",
      "hindi": "Hindi (हिन्दी)",
      "search": "Search",
      "cancel": "Cancel",
      "save": "Save",
      "submit": "Submit",
      "back": "Back",
      "confirm": "Confirm",
      "loading": "Loading...",
      "success": "Success",
      "error": "Error",

      // ── Auth & Registration ──
      "welcome_title": "Suraksha Sarthi",
      "brand_tagline": "Safer Together, Stronger Together",
      "login_title": "Sign In to SDRF Portal",
      "email_label": "Email Address",
      "password_label": "Password",
      "login_btn": "Sign In",
      "signup_btn": "Register New Account",
      "phone_label": "Mobile Number",
      "send_otp": "Send Verification OTP",
      "verify_otp": "Verify OTP & Continue",
      "resend_otp": "Resend OTP",

      // ── Citizen & Volunteer Dashboard ──
      "citizen_portal": "CITIZEN / VOLUNTEER PORTAL",
      "namaste": "Namaste,",
      "quick_actions": "Quick Actions",
      "emergency_sos": "EMERGENCY SOS",
      "sos_sub": "Report a disaster · Alert SDRF instantly",
      "report_disaster": "Report Emergency",
      "volunteer_skills": "Volunteer Portal & Skills",
      "volunteer_sub": "Register skills, Aadhaar & certifications for emergency dispatch",
      "full_name": "Full Legal Name",
      "district_place": "District / Location",
      "organisation": "Organisation / Department (Optional)",
      "skills_label": "Your Skills",
      "aadhaar_label": "Aadhaar Card Number (12 Digits)",
      "cert_link": "Skill Certification Link (Optional)",
      "save_profile": "Register / Update Profile",
      "pending_status": "Pending Approval",
      "approved_status": "Approved & Active",
      "rejected_status": "Application Rejected",

      // ── Admin Command & Control Operations ──
      "command_center": "SDRF Command & Control",
      "command_subtitle": "HP SDRF Command Division",
      "disaster_overview": "Live Disaster Overview",
      "active_incidents": "Active Incidents",
      "bulletins": "Official Bulletins",
      "recent_directives": "Recent Advisories & Weather Alerts",
      "guides": "Emergency Survival SOPs",
      "equipment_catalog": "Equipment & Fleet Inventory",
      "add_equipment": "Add New Equipment",
      "scan_qr": "Scan QR Code Tag",
      "dispatch_hq": "Transfer to HQ",
      "confirm_receive": "Confirm Arrival",
      "under_maintenance": "Under Maintenance",
      "send_maintenance": "Send for Maintenance",
      "return_maintenance": "Return Ready",
      "total_assets": "Total Assets",
      "available": "Available",
      "deployed": "Deployed",
      "in_transit": "In Transit",
      "maintenance": "Maintenance",

      // ── Emergency Helplines ──
      "emergency_helplines": "Emergency Helplines & Contacts",
      "sdrf_control": "HP SDRF State Control Room (1070)",
      "national_helpline": "National Emergency Helpline (112)",
      "ambulance": "Medical Ambulance Service (108)",
      "fire": "Fire Rescue Command (101)",
    }
  },
  hi: {
    translation: {
      // ── Core Navigation & General ──
      "home": "होम",
      "alerts": "अलर्ट",
      "sos": "आपातकालीन SOS",
      "map": "लाइव मैप",
      "volunteer": "स्वयंसेवक",
      "menu": "मेनू",
      "resources": "संसाधन",
      "profile": "प्रोफ़ाइल",
      "logout": "लॉगआउट",
      "settings": "ऐप सेटिंग्स",
      "language": "ऐप की भाषा",
      "english": "English",
      "hindi": "हिन्दी (Hindi)",
      "search": "खोजें",
      "cancel": "रद्द करें",
      "save": "सहेजें",
      "submit": "सबमिट करें",
      "back": "वापस जाएं",
      "confirm": "पुष्टि करें",
      "loading": "लोड हो रहा है...",
      "success": "सफल",
      "error": "त्रुटि",

      // ── Auth & Registration ──
      "welcome_title": "सुरक्षा सारथी",
      "brand_tagline": "साथ में सुरक्षित, साथ में सशक्त",
      "login_title": "SDRF पोर्टल में साइन इन करें",
      "email_label": "ईमेल पता",
      "password_label": "पासवर्ड",
      "login_btn": "साइन इन करें",
      "signup_btn": "नया खाता पंजीकृत करें",
      "phone_label": "मोबाइल नंबर",
      "send_otp": "सत्यापन OTP भेजें",
      "verify_otp": "OTP सत्यापित करें एवं आगे बढ़ें",
      "resend_otp": "OTP पुनः भेजें",

      // ── Citizen & Volunteer Dashboard ──
      "citizen_portal": "नागरिक / स्वयंसेवक पोर्टल",
      "namaste": "नमस्ते,",
      "quick_actions": "त्वरित सेवाएं",
      "emergency_sos": "आपातकालीन SOS",
      "sos_sub": "आपदा की रिपोर्ट करें · तुरंत SDRF को सूचित करें",
      "report_disaster": "आपदा रिपोर्ट करें",
      "volunteer_skills": "स्वयंसेवक पोर्टल एवं क्षमताएं",
      "volunteer_sub": "आपदा राहत के लिए अपनी क्षमताएं, आधार एवं प्रमाणपत्र पंजीकृत करें",
      "full_name": "पूरा कानूनी नाम",
      "district_place": "जिला / स्थान",
      "organisation": "संस्था / विभाग (वैकल्पिक)",
      "skills_label": "आपकी क्षमताएं (डॉक्टर, बचाव, ड्राइवर...)",
      "aadhaar_label": "आधार कार्ड नंबर (12 अंक)",
      "cert_link": "प्रमाणपत्र लिंक (वैकल्पिक)",
      "save_profile": "प्रोफ़ाइल पंजीकृत / अपडेट करें",
      "pending_status": "स्वीकृति लंबित",
      "approved_status": "स्वीकृत एवं सक्रिय",
      "rejected_status": "आवेदन अस्वीकृत",

      // ── Admin Command & Control Operations ──
      "command_center": "SDRF कमांड एवं नियंत्रण",
      "command_subtitle": "HP SDRF कमांड डिवीज़न",
      "disaster_overview": "लाइव आपदा अवलोकन",
      "active_incidents": "सक्रिय घटनाएं",
      "bulletins": "आधिकारिक बुलेटिन",
      "recent_directives": "हाल के निर्देश एवं मौसम अलर्ट",
      "guides": "जीवित रहने के उपाय एवं निर्देश",
      "equipment_catalog": "उपकरण एवं वाहन सूची",
      "add_equipment": "नया उपकरण जोड़ें",
      "scan_qr": "QR कोड टैग स्कैन करें",
      "dispatch_hq": "HQ को स्थानांतरित करें",
      "confirm_receive": "आगमन की पुष्टि करें",
      "under_maintenance": "रखरखाव के अधीन",
      "send_maintenance": "रखरखाव के लिए भेजें",
      "return_maintenance": "सेवा में वापस लाएं",
      "total_assets": "कुल उपकरण",
      "available": "उपलब्ध",
      "deployed": "तैनात",
      "in_transit": "मार्ग में (इन-ट्रांजिट)",
      "maintenance": "रखरखाव",

      // ── Emergency Helplines ──
      "emergency_helplines": "आपातकालीन हेल्पलाइन एवं संपर्क",
      "sdrf_control": "HP SDRF राज्य नियंत्रण कक्ष (1070)",
      "national_helpline": "राष्ट्रीय आपातकालीन सेवा (112)",
      "ambulance": "चिकित्सा एम्बुलेंस सेवा (108)",
      "fire": "अग्निशमन दल कमांड (101)",
    }
  }
};

// Initialize i18n with auto-saved language preference
const deviceLang = Localization.getLocales()[0]?.languageCode || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

// Load stored language choice asynchronously on boot
SecureStore.getItemAsync('app_language').then((savedLang) => {
  if (savedLang && (savedLang === 'en' || savedLang === 'hi')) {
    i18n.changeLanguage(savedLang);
  } else if (deviceLang === 'hi') {
    i18n.changeLanguage('hi');
  }
}).catch(() => {});

// Helper function to change and persist language across app restarts
export const changeAppLanguage = async (lang: 'en' | 'hi') => {
  await i18n.changeLanguage(lang);
  await SecureStore.setItemAsync('app_language', lang);
};

export default i18n;
