import { defineStore } from 'pinia';

export const useUserStore = defineStore('userLogged', {
    state: () => ({
        userLogged: null, // Información del usuario logueado
    }),
    actions: {
        setUser(userInfo) {
            this.userLogged = userInfo; // Asigna la información del usuario
        },
        clearUser() {
            this.userLogged = null; // Limpia los datos del usuario al cerrar sesión
        },
    },
});