<script setup>
    import {reactive,ref,onMounted, watch} from 'vue'
    import { inputFromPasswordToText } from '@/js/inputFromPasswordToText';
    import {useApi} from '/src/js/useFetch.js'
    import {validateForm} from '/src/js/validateForm.js'
    import {mostrarNotificacion} from '/src/js/notificationsRequest.js'
    import { useRoute } from 'vue-router';

    // Recibir el tipo de formulario como prop o desde la ruta
    const route = useRoute();
    const formType = route.name === 'Account' ? 'Account' : 'ResetPassword';

    // Estado del formulario actualizar contraseña
    const formPassword = reactive({
        lastPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    // Errores del formulario actualizar contraseña
    const errorsPassword = ref({});

    // Enviar formulario
    const submitFormPassword = async () => {

        
        // Definir las reglas de validación
        const validationRules = {
            newPassword: { required: true, minLength: 8, hasNumber: true, hasSpecialChar: true },
            confirmPassword: { required: true, match: 'newPassword' }
        };

        // Si es cambio de contraseña, también validar `lastPassword`
        if (formType === 'Account') {
            validationRules.lastPassword = { required: true };
        } else {
            validationRules.token = { required: true }; // Si es restablecimiento, validar el token
        }

        // Validar el formulario
        const errors = validateForm(formPassword, validationRules);
        errorsPassword.value = errors; // Guardar los errores para mostrarlos en la vista

        // Si hay errores, detener el envío
        if (Object.keys(errors).length > 0) {
            console.log("Errores en el formulario:", errors);
            return;
        }

        // // Si todo es válido, enviar los datos
        // try {
        //     let endpoint = formType === 'Account' ? '/api/change-password' : '/api/reset-password';
        //     let body = { newPassword: formPassword.newPassword };

        //     if (formType === 'Account') {
        //         body.lastPassword = formPassword.lastPassword;
        //     } else {
        //         body.token = formPassword.token; // Token enviado por correo
        //     }

        //     const response = await fetch(endpoint, {
        //         method: "POST",
        //         headers: { "Content-Type": "application/json" },
        //         body: JSON.stringify(body)
        //     });

        //     const result = await response.json();

        //     if (!response.ok) throw new Error(result.message || "Error en la operación");

        //     mostrarNotificacion(formType === 'Account' ? "Contraseña actualizada con éxito" : "Contraseña restablecida con éxito", 1);

        //     // Resetear el formulario
        //     formPassword.lastPassword = '';
        //     formPassword.newPassword = '';
        //     formPassword.confirmPassword = '';
        //     formPassword.token = '';

        // } catch (error) {
        //     mostrarNotificacion(error.message, 0);
        // }

       


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
                <i class="fa-solid fa-user"></i>
                <input type="password" class="inputSelectWoBorderOLeft" v-model="formPassword.lastPassword">
                <i class="fa-solid fa-eye-slash eye" @click="inputFromPasswordToText($event.target)"></i>
            </div>
            <div class="error" v-if="errorsPassword.lastPassword">{{ errorsPassword.lastPassword }}</div>
        </div>

        <div class="divInput">
            <label>Nueva contraseña</label>
            <div class="inputIcon">
                <i class="fa-solid fa-user"></i>
                <input type="password" class="inputSelectWoBorderOLeft" v-model="formPassword.newPassword">
                <i class="fa-solid fa-eye-slash eye" @click="inputFromPasswordToText($event.target)"></i>
            </div>
            <div class="error" v-if="errorsPassword.newPassword">{{ errorsPassword.newPassword }}</div>
        </div>

        <div class="divInput">
            <label>Confirmar contraseña</label>
            <div class="inputIcon">
                <i class="fa-solid fa-user"></i>
                <input type="password" class="inputSelectWoBorderOLeft" v-model="formPassword.confirmPassword">
                <i class="fa-solid fa-eye-slash eye" @click="inputFromPasswordToText($event.target)"></i>
            </div>
            <div class="error" v-if="errorsPassword.confirmPassword">{{ errorsPassword.confirmPassword }}</div>
        </div>

        <button class="btnAccountBlock BGYellow" type="submit">
            {{ formType === 'Account' ? 'Actualizar' : 'Restablecer' }}
        </button>
    </form>
</template>
