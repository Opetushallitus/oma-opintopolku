import i18n from 'i18next';
import Backend from 'i18next-xhr-backend';
import { reactI18nextModule } from 'react-i18next';
import LngDetector from 'i18next-browser-languagedetector';
import { getLang } from './utils';

i18n
  .use(Backend)
  .use(LngDetector)
  .use(reactI18nextModule)
  .init({
    fallbackLng: getLang(),
    ns: ['common', 'home', 'selection'],
    defaultNS: 'common',
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    react: {
      defaultTransParent: 'div',
      wait: true
    },
    backend: {
      loadPath: '/oma-opintopolku/locales/{{lng}}/{{ns}}.json'
    },
    detection: {
      order: ['cookie'],
      lookupCookie: 'lang',
    }
  });

i18n.on('languageChanged', (lng) => document.documentElement.setAttribute('lang', lng));

export default i18n;
