// Función para verificar autenticación
import { useUserStore } from '../stores/userLogged.js';

// Función para verificar autenticación
export async function checkAuth() {

    const token = localStorage.getItem('jwt');
    if (!token) return false;

    try {
        const response = await fetch('/api/auth/validate', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) {
            throw new Error('Token inválido o expirado');
        }

        // Si el token es válido, guarda la información del usuario en el store
        const userStore = useUserStore();
        const userData = await response.json();
        userStore.setUser(userData); // Guarda los datos del usuario

        return true; // Token válido
    } catch (error) {
        console.error('Error de autenticación:', error.message);
        localStorage.removeItem('jwt'); // Limpiar token inválido
        return false;
    }
}
