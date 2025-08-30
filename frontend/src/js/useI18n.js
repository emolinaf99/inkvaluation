import { useI18n as useVueI18n } from 'vue-i18n'
import { changeLocale, getCurrentLocale, availableLocales } from '../locales/index.js'

export const useI18n = () => {
  const { t, locale } = useVueI18n()
  
  const switchLanguage = (newLocale) => {
    changeLocale(newLocale)
  }
  
  const currentLanguage = () => {
    return getCurrentLocale()
  }
  
  return {
    t,
    locale,
    switchLanguage,
    currentLanguage,
    availableLocales
  }
}