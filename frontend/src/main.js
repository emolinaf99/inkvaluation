
import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia';
import router from './router'
import './assets/css/main.css'
import i18n from './i18n'

const app = createApp(App)

// Crear una instancia de Pinia
const pinia = createPinia();

// Usar Pinia, router e i18n en la aplicación
app.use(pinia);
app.use(router);
app.use(i18n);

app.mount('#app')
