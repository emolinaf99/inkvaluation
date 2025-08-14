<script setup>
    import {reactive,ref} from 'vue'
    import {validateForm} from '/src/js/validateForm.js'
    import {useApi} from '/src/js/useFetch.js'
    import {RouterLink} from 'vue-router'

    const forgotPasswordForm = reactive({
        email:''
    })
    const errorEmail = ref({})

    // Enviar formulario
    const submitForm = async () => {
        
        // Definir las reglas de validación
        const validationRules = {
            email: { required: true, email: true},
        };

        // Validar el formulario
        const errors = validateForm(forgotPasswordForm, validationRules);
        errorEmail.value = errors; // Guardar los errores para mostrarlos en la vista

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
    <section class="resetPasswordSection">
        <div class="infoContainer">
            <form class="accountBlock" @submit.prevent="submitForm()">
                <h4>Recupera tu cuenta</h4>
                <p style="height: 1rem !important;">Introduce tu correo electrónico para buscar tu cuenta.</p>

                <div class="divInput">
                    <div class="inputIcon">
                        <i class="fa-solid fa-envelope"></i>
                        <input type="text" class="inputSelectWoBorderOLeft" v-model="forgotPasswordForm.email">
                    </div>
                    <div class="error" v-if="errorEmail.email">{{ errorEmail.email }}</div>
                </div>

                <div class="buttonsForgotPassword w100">
                    <RouterLink to="/login"><button class="btnAccountBlock" type="button">Cancelar</button></RouterLink>
                    <button class="btnAccountBlock BGBlue" type="submit">Buscar</button>
                </div>
                
                    
                
            </form>
        </div>
        
    </section>
    
</template>
