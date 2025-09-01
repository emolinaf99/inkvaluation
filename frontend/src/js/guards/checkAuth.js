// Función para verificar autenticación
import { useUserStore } from '../stores/userLogged.js';

// Función para verificar autenticación
export async function checkAuth() {
    try {
        // Hacer petición al backend para verificar la sesión (cookies automáticas)
        const response = await fetch('http://localhost:3001/api/auth/check', {
            method: 'GET',
            credentials: 'include', // Incluir cookies automáticamente
        });

        if (!response.ok) {
            return false;
        }

        const data = await response.json();
        
        if (data.success && data.authenticated) {
            // Si la sesión es válida, guardar la información del usuario en el store
            const userStore = useUserStore();
            userStore.setUser(data.user);
            return true;
        }

        return false;
    } catch (error) {
        console.error('Error verificando autenticación:', error);
        return false;
    }
}

// Función para limpiar sesión
export function clearSession() {
    const userStore = useUserStore();
    userStore.clearUser();
}

// Función para hacer logout
export async function logout() {
    try {
        // Llamar al endpoint de logout del backend
        const response = await fetch('http://localhost:3001/api/auth/logout', {
            method: 'POST',
            credentials: 'include'
        });

        // Limpiar store independientemente del resultado
        clearSession();

        return true;
    } catch (error) {
        console.error('Error en logout:', error);
        // Limpiar store aunque haya error
        clearSession();
        return false;
    }
}
