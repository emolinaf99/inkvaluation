<script setup>
    import {reactive,ref,onMounted, watch} from 'vue'
    import { inputFromPasswordToText } from '@/js/inputFromPasswordToText';
    import {useApi} from '/src/js/useFetch.js'
    import {validateForm} from '/src/js/validateForm.js'
    import {mostrarNotificacion} from '/src/js/mensajeNotificacionFront.js'
    import { useRoute } from 'vue-router';
    import { useSecurityPassword } from '/src/js/useSecurityPassword.js';

    // Recibir el tipo de formulario como prop o desde la ruta
    const route = useRoute();
    const formType = route.name === 'Account' ? 'Account' : 'ResetPassword';

    // Usar el composable de seguridad de contraseñas
    const { 
        validatePassword,
        strengthLevel,
        strengthColor,
        passwordStrength
    } = useSecurityPassword();

    // Estado del formulario actualizar contraseña
    const formPassword = reactive({
        lastPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    // Errores del formulario actualizar contraseña
    const errorsPassword = ref({});
    const isSubmitting = ref(false);
    const passwordValidation = ref(null);

    // Función para validar contraseña en tiempo real
    const validatePasswordStrength = () => {
        if (formPassword.newPassword) {
            passwordValidation.value = validatePassword(formPassword.newPassword, formPassword.confirmPassword);
        } else {
            passwordValidation.value = null;
        }
    }

    // Watch para validar en tiempo real
    watch(() => formPassword.newPassword, validatePasswordStrength);
    watch(() => formPassword.confirmPassword, validatePasswordStrength);

    // Enviar formulario
    const submitFormPassword = async () => {
        if (isSubmitting.value) return;

        // Limpiar errores previos
        errorsPassword.value = {};

        // Validar contraseña anterior si es necesaria
        if (formType === 'Account' && !formPassword.lastPassword) {
            errorsPassword.value.lastPassword = 'La contraseña anterior es requerida';
        }

        // Validar nueva contraseña con useSecurityPassword
        const validation = validatePassword(formPassword.newPassword, formPassword.confirmPassword);
        
        if (!validation.isValid) {
            // Mostrar errores de contraseña
            if (validation.errors.password.length > 0) {
                errorsPassword.value.newPassword = validation.errors.password[0];
            }
            if (validation.errors.confirm.length > 0) {
                errorsPassword.value.confirmPassword = validation.errors.confirm[0];
            }
        }

        // Si hay errores, detener el envío
        if (Object.keys(errorsPassword.value).length > 0) {
            mostrarNotificacion('Por favor corrige los errores en el formulario', 0);
            return;
        }

        isSubmitting.value = true;

        try {
            if (formType === 'Account') {
                // Cambiar contraseña (usuario autenticado)
                const changePasswordData = {
                    currentPassword: formPassword.lastPassword,
                    newPassword: formPassword.newPassword
                };

                const { data, error } = await useApi('/api/user/change-password', 'PUT', changePasswordData);

                if (error.value) {
                    if (error.value.errors) {
                        const backendErrors = {};
                        error.value.errors.forEach(err => {
                            const fieldMap = {
                                'currentPassword': 'lastPassword',
                                'newPassword': 'newPassword'
                            };
                            const frontendField = fieldMap[err.path] || err.path;
                            backendErrors[frontendField] = err.msg;
                        });
                        errorsPassword.value = { ...errorsPassword.value, ...backendErrors };
                        mostrarNotificacion('Por favor corrige los errores señalados', 0);
                    } else {
                        mostrarNotificacion(error.value.message || 'Error cambiando contraseña', 0);
                    }
                } else if (data.value?.success) {
                    mostrarNotificacion("Contraseña actualizada con éxito", 1);
                    
                    // Resetear el formulario
                    formPassword.lastPassword = '';
                    formPassword.newPassword = '';
                    formPassword.confirmPassword = '';
                }
            }
            // TODO: Implementar reset password con token cuando se necesite

        } catch (error) {
            console.error('Error actualizando contraseña:', error);
            mostrarNotificacion('Error de conexión', 0);
        } finally {
            isSubmitting.value = false;
        }
    };

</script>

<template>
    <form class="accountBlock" @submit.prevent="submitFormPassword()">
        <h4>{{ formType === 'Account' ? 'Actualizar contraseña' : 'Restablecer contraseña' }}</h4>
        <p>Crea una contraseña nueva de ocho caracteres como mínimo. Una contraseña segura tiene una combinación de letras, números y caracteres especiales.</p>

        <!-- Mostrar el campo "Contraseña Anterior" solo si es 'Account' -->
        <div v-if="formType === 'Account'" class="divInput">
            <label>Contraseña anterior</label>
            <div class="inputIcon">
                <i class="fa-solid fa-lock"></i>
                <input type="password" class="inputSelectWoBorderOLeft" v-model="formPassword.lastPassword">
                <i class="fa-solid fa-eye-slash eye" @click="inputFromPasswordToText($event.target)"></i>
            </div>
            <div class="error" v-if="errorsPassword.lastPassword">{{ errorsPassword.lastPassword }}</div>
        </div>

        <div class="divInput">
            <label>Nueva contraseña</label>
            <div class="inputIcon">
                <i class="fa-solid fa-lock"></i>
                <input type="password" class="inputSelectWoBorderOLeft" v-model="formPassword.newPassword">
                <i class="fa-solid fa-eye-slash eye" @click="inputFromPasswordToText($event.target)"></i>
            </div>
            
            <!-- Indicador de fortaleza de contraseña -->
            <div v-if="passwordValidation && formPassword.newPassword" class="password-strength">
                <div class="strength-bar">
                    <div 
                        class="strength-fill" 
                        :style="{ 
                            width: passwordValidation.strength + '%', 
                            backgroundColor: passwordValidation.strengthColor 
                        }"
                    ></div>
                </div>
                <div class="strength-text" :style="{ color: passwordValidation.strengthColor }">
                    Fortaleza: {{ passwordValidation.strengthLevel }} ({{ passwordValidation.strength }}%)
                </div>
            </div>
            
            <div class="error" v-if="errorsPassword.newPassword">{{ errorsPassword.newPassword }}</div>
        </div>

        <div class="divInput">
            <label>Confirmar contraseña</label>
            <div class="inputIcon">
                <i class="fa-solid fa-lock"></i>
                <input type="password" class="inputSelectWoBorderOLeft" v-model="formPassword.confirmPassword">
                <i class="fa-solid fa-eye-slash eye" @click="inputFromPasswordToText($event.target)"></i>
            </div>
            <div class="error" v-if="errorsPassword.confirmPassword">{{ errorsPassword.confirmPassword }}</div>
        </div>

        <button class="btnAccountBlock BGYellow" type="submit" :disabled="isSubmitting">
            {{ isSubmitting ? 'Procesando...' : (formType === 'Account' ? 'Actualizar' : 'Restablecer') }}
        </button>
    </form>
</template>

<style scoped>
.password-strength {
    margin-top: 8px;
    width: 100%;
}

.strength-bar {
    width: 100%;
    height: 6px;
    background-color: #e5e7eb;
    border-radius: 3px;
    overflow: hidden;
    margin-bottom: 6px;
}

.strength-fill {
    height: 100%;
    transition: width 0.3s ease, background-color 0.3s ease;
    border-radius: 3px;
}

.strength-text {
    font-size: 12px;
    font-weight: 500;
    margin-top: 4px;
}

.divInput {
    margin-bottom: 1rem;
}

.error {
    color: #ef4444;
    font-size: 12px;
    margin-top: 4px;
}
</style>
