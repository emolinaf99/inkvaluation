import { createI18n } from 'vue-i18n'
import es from './locales/es.js'
import en from './locales/en.js'
import fr from './locales/fr.js'

const messages = {
  es,
  en,
  fr
}

// Obtener idioma guardado o usar español por defecto
const savedLocale = localStorage.getItem('inkvaluation-locale') || 'es'

const i18n = createI18n({
  locale: savedLocale,
  fallbackLocale: 'es',
  messages,
  legacy: false // usar Composition API
})

export default i18n