import { createI18n } from 'vue-i18n'
import es from './locales/es.json'
import en from './locales/en.json'

const savedLocale = typeof localStorage !== 'undefined' ? (localStorage.getItem('user_locale') || 'es') : 'es'

const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'es',
  messages: {
    es,
    en
  }
})

export default i18n
