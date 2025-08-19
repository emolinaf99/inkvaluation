import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../views/LandingPage.vue'
import { checkAuth } from '../js/guards/checkAuth.js'; // Importa la función de verificación de autenticación

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: LandingPage
    },
    {
      path: '/prices',
      name: 'Prices',
      component: () => import('../views/Prices.vue')
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/forgotPassword',
      name: 'ForgotPassword',
      component: () => import('../views/ForgotPassword.vue')
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('../views/Register.vue')
    },
    {
      path: '/request',
      name: 'Request',
      component: () => import('../views/Request.vue'),
      // meta: { requiresAuth: true }  // Añade un meta campo para indicar que esta ruta requiere autenticación
    },
    {
      path: '/account',
      name: 'Account',
      component: () => import('../views/Account.vue'),
      // meta: { requiresAuth: true }  // Añade un meta campo para indicar que esta ruta requiere autenticación
    },
    {
      path: '/mailbox',
      name: 'Mailbox',
      component: () => import('../views/Mailbox.vue'),
      // meta: { requiresAuth: true }  // Añade un meta campo para indicar que esta ruta requiere autenticación
    },
    {
      path: '/configAssistant',
      name: 'AssistantConfiguration',
      component: () => import('../views/ConfigAssistant.vue'),
      // meta: { requiresAuth: true }  // Añade un meta campo para indicar que esta ruta requiere autenticación
    },
    {
      path: '/assistantChat',
      name: 'AssistantChat',
      component: () => import('../views/AssistantChat.vue'),
    },
    {
      path: '/assistantBussiness',
      name: 'AssistantBussiness',
      component: () => import('../views/BussinessAssistant.vue'),
      // meta: { requiresAuth: true }  // Añade un meta campo para indicar que esta ruta requiere autenticación
    },
    {
      path: '/accountBussiness',
      name: 'AccountBussiness',
      component: () => import('../views/Bussiness.vue'),
      // meta: { requiresAuth: true }  // Añade un meta campo para indicar que esta ruta requiere autenticación
    },
    {
      path: '/forms',
      name: 'Forms',
      component: () => import('../views/Forms.vue'),
      // meta: { requiresAuth: true }  // Añade un meta campo para indicar que esta ruta requiere autenticación
    },
    {
      path: '/newForm/:serviceId',
      name: 'NewForm',
      component: () => import('../views/NewForm.vue'),
      props: true // Pasar el parámetro 'id' como prop al componente
      // meta: { requiresAuth: true }  // Añade un meta campo para indicar que esta ruta requiere autenticación
    },
    {
      path: '/detailForm/:formId',
      name: 'DetailForm',
      component: () => import('../views/detailForm.vue'),
      // meta: { requiresAuth: true }  // Añade un meta campo para indicar que esta ruta requiere autenticación
      props: true // Pasar el parámetro 'id' como prop al componente
    },
    {
      path: '/resetPassword/:token',
      name: 'ResetPassword',
      component: () => import('../views/ResetPassword.vue'),
      // meta: { requiresAuth: true }  // Añade un meta campo para indicar que esta ruta requiere autenticación
      props: true // Pasar el parámetro 'token' como prop al componente
    }
    
  ]
})

// Guardias de navegación global para manejar paginas que requieren sesion
router.beforeEach(async (to, from, next) => {
  const isAuthenticated = await checkAuth();
  console.log(isAuthenticated);
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    // Si la ruta requiere autenticación y el usuario no está autenticado, redirige a login
    next({ name: 'Login' });
  } else {
    // Si la ruta no requiere autenticación o el usuario está autenticado, permite la navegación
    next();
  }
});

// Función para desplazarse al Home de la página
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// Guardia global afterEach para ejecutar scrollToTop en cada cambio de ruta
router.afterEach(() => {
  scrollToTop();
});

export default router
