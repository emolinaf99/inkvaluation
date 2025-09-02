import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../views/LandingPage.vue'
import { authService } from '../js/auth.js'; // Importa el servicio de autenticación

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: LandingPage,
      meta: { requiresGuest: true } // Solo accesible si NO está autenticado
    },
    {
      path: '/prices',
      name: 'Prices',
      component: () => import('../views/Prices.vue'),
      meta: { requiresGuest: true } // Solo accesible si NO está autenticado
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login.vue'),
      meta: { requiresGuest: true } // Solo accesible si NO está autenticado
    },
    {
      path: '/forgotPassword',
      name: 'ForgotPassword',
      component: () => import('../views/ForgotPassword.vue'),
      meta: { requiresGuest: true } // Solo accesible si NO está autenticado
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('../views/Register.vue'),
      meta: { requiresGuest: true } // Solo accesible si NO está autenticado
    },
    {
      path: '/request',
      name: 'Request',
      component: () => import('../views/Request.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/account',
      name: 'Account',
      component: () => import('../views/Account.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/mailbox',
      name: 'Mailbox',
      component: () => import('../views/Mailbox.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/configAssistant',
      name: 'AssistantConfiguration',
      component: () => import('../views/ConfigAssistant.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/assistantChat',
      name: 'AssistantChat',
      component: () => import('../views/AssistantChat.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/assistantChatAI',
      name: 'AssistantChatAI',
      component: () => import('../views/AssistantChatAI.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/assistantBussiness',
      name: 'AssistantBussiness',
      component: () => import('../views/BussinessAssistant.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/accountBussiness',
      name: 'AccountBussiness',
      component: () => import('../views/Bussiness.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/forms',
      name: 'Forms',
      component: () => import('../views/Forms.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/newForm/:serviceId',
      name: 'NewForm',
      component: () => import('../views/NewForm.vue'),
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/detailForm/:formId',
      name: 'DetailForm',
      component: () => import('../views/DetailForm.vue'),
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/resetPassword/:token',
      name: 'ResetPassword',
      component: () => import('../views/ResetPassword.vue'),
      props: true,
      meta: { requiresGuest: true } // Cualquiera puede resetear contraseña
    },
    {
      path: '/updateSubscription',
      name: 'UpdateSubscription',
      component: () => import('../views/UpdateSubscription.vue'),
      meta: { requiresAuth: true }
    }
    
  ]
})

// Guardias de navegación global para manejar autenticación
router.beforeEach(async (to, from, next) => {
  const isAuthenticated = await authService.checkAuth();
  console.log('Usuario autenticado:', isAuthenticated);

  // Verificar si la ruta requiere autenticación
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      // Usuario no autenticado intentando acceder a ruta privada
      console.log('Redirigiendo a login - ruta privada sin autenticación');
      next({ name: 'Login' });
      return;
    }
  }

  // Verificar si la ruta requiere ser invitado (no autenticado)
  if (to.matched.some(record => record.meta.requiresGuest)) {
    if (isAuthenticated) {
      // Usuario autenticado intentando acceder a ruta pública
      console.log('Redirigiendo a requests - usuario ya autenticado');
      next({ name: 'Request' });
      return;
    }
  }

  // Permitir navegación
  next();
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
