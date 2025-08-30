<template>
  <div class="language-selector">
    <div class="flag-display desktop-only">
      <img :src="selectedLanguage.flag" :alt="selectedLanguage.name" />
    </div>
    <select 
      :value="currentLang" 
      @change="handleLanguageChange($event)"
      class="language-select"
    >
      <option 
        v-for="language in languages" 
        :key="language.code" 
        :value="language.code"
      >
        {{ isMobile ? language.shortName : language.name }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const isMobile = ref(window.innerWidth < 768)

const languages = [
  { code: 'es', name: 'Español', shortName: 'ES', flag: 'https://flagcdn.com/24x18/es.png' },
  { code: 'en', name: 'English', shortName: 'EN', flag: 'https://flagcdn.com/24x18/us.png' },
  { code: 'fr', name: 'Français', shortName: 'FR', flag: 'https://flagcdn.com/24x18/fr.png' }
]

const currentLang = computed({
  get: () => locale.value,
  set: (value) => {
    locale.value = value
    localStorage.setItem('inkvaluation-locale', value)
  }
})

const selectedLanguage = computed(() => {
  return languages.find(lang => lang.code === currentLang.value) || languages[0]
})

const handleLanguageChange = (event) => {
  const newLanguage = event.target.value
  currentLang.value = newLanguage
  console.log('Idioma cambiado a:', newLanguage)
}

// Listener para cambios de tamaño de ventana
window.addEventListener('resize', () => {
  isMobile.value = window.innerWidth < 768
})
</script>

<style scoped>
.language-selector {
  display: flex;
  align-items: center;
  margin-right: 1rem;
}

.flag-display {
  margin-right: 8px;
  display: flex;
  align-items: center;
}

.flag-display img {
  width: 24px;
  height: 18px;
  border-radius: 2px;
}

.language-select {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  font-size: 14px;
  cursor: pointer;
  min-width: 140px;
  outline: none;
  transition: all 0.2s ease;
}

.language-select:hover {
  border-color: #007bff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.language-select:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

/* Estilos para cuando el header está scrolled */
.headerScroll .language-select {
  border-color: #ccc;
}

.headerScroll .language-select:hover {
  border-color: #007bff;
}

/* Mobile styles */
@media (max-width: 767px) {
  .flag-display.desktop-only {
    display: none;
  }
  
  .language-select {
    min-width: 60px;
  }
}

/* Desktop styles */
@media (min-width: 768px) {
  .flag-display.desktop-only {
    display: flex;
  }
}
</style>