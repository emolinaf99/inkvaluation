import { useApi } from './useFetch.js';
import { useUserStore } from './stores/userLogged.js';

export const authService = {
  // Verificar si el usuario está autenticado
  async checkAuth() {
    try {
      const { data, error } = await useApi('http://localhost:3001/api/auth/check', 'GET');
      
      if (error.value) {
        return false;
      }
      
      if (data.value?.success && data.value.authenticated) {
        // Actualizar store con datos del usuario
        const userStore = useUserStore();
        userStore.setUser(data.value.user);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      return false;
    }
  },

  // Cerrar sesión
  async logout() {
    try {
      const { data, error } = await useApi('http://localhost:3001/api/auth/logout', 'POST');
      
      // Limpiar store independientemente del resultado
      const userStore = useUserStore();
      userStore.clearUser();
      
      if (data.value?.success) {
        return { success: true, message: 'Sesión cerrada exitosamente' };
      } else {
        return { success: false, message: error.value?.message || 'Error cerrando sesión' };
      }
    } catch (error) {
      console.error('Error en logout:', error);
      // Limpiar store aunque haya error
      const userStore = useUserStore();
      userStore.clearUser();
      return { success: false, message: 'Error de conexión' };
    }
  },

  // Obtener usuario actual del backend
  async getCurrentUser() {
    try {
      const { data, error } = await useApi('http://localhost:3001/api/auth/profile', 'GET');
      
      if (error.value) {
        return null;
      }
      
      return data.value?.user || null;
    } catch (error) {
      console.error('Error obteniendo usuario actual:', error);
      return null;
    }
  },

  // Refrescar token automáticamente
  async refreshToken() {
    try {
      const { data, error } = await useApi('http://localhost:3001/api/auth/refresh-token', 'POST');
      
      if (data.value?.success) {
        return true;
      }
      
      // Si no se puede refrescar, la sesión expira
      return false;
    } catch (error) {
      console.error('Error refrescando token:', error);
      return false;
    }
  },

  // Actualizar renovación automática
  async updateAutoRenewal(enabled) {
    try {
      const { data, error } = await useApi('http://localhost:3001/api/user/auto-renewal', 'PUT', {
        automaticRenewal: enabled
      });

      if (error.value) {
        return { 
          success: false, 
          message: error.value.message || 'Error actualizando renovación automática' 
        };
      }

      return { 
        success: true, 
        message: 'Configuración de renovación actualizada' 
      };
    } catch (error) {
      console.error('Error actualizando renovación automática:', error);
      return { success: false, message: 'Error de conexión' };
    }
  },

  // Obtener planes de suscripción
  async getSubscriptionPlans() {
    try {
      const { data, error } = await useApi('http://localhost:3001/api/user/subscription-plans', 'GET');
      
      if (error.value) {
        return { 
          success: false, 
          message: error.value.message || 'Error obteniendo planes',
          plans: []
        };
      }

      return { 
        success: true, 
        plans: data.value?.plans || [] 
      };
    } catch (error) {
      console.error('Error obteniendo planes:', error);
      return { success: false, message: 'Error de conexión', plans: [] };
    }
  }
};