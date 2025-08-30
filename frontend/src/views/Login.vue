<script setup>
    import {reactive,ref,onMounted} from 'vue'
    import { RouterLink, RouterView } from 'vue-router'
    import {validateForm} from '/src/js/validateForm.js'
    import { inputFromPasswordToText } from '@/js/inputFromPasswordToText';

    const loginForm = reactive({
        email: '',
        password: ''
    });

    const errorsLoginForm = ref({})

    // Enviar formulario
    const submitLogin= () => {

        // Definir las reglas de validación
        const validationRules = {
            email: { required: true, email: true },
            password: { required:true }
        };

        // Validar el formulario
        const errors = validateForm(loginForm, validationRules);
        errorsLoginForm.value = errors; // Guardar los errores para mostrarlos en la vista

        // Si hay errores, detener el envío
        if (Object.keys(errors).length > 0) {
            console.log("Errores en el formulario:", errors);
            return;
        }

        // Si todo es válido, enviar los datos
        console.log("Datos enviados:", loginForm);
        
    };

</script>

<template>
    <!-- Contenido Real con animaciones -->
    <section class="sectionLoginAndRegister ux-container">
        <div class="contenedorForm ux-card ux-stagger-1" id="contenedorFormLogin">
            <div class="contenedorLogoForm ux-fade-in" id="contLogoLogin">
                <RouterLink to="/"><img class="logoApp ux-image ux-stagger-1" src="/img/InkValuationLogo.png" alt=""></RouterLink>
            </div>
            <h2 id="h2Form" class="ux-header ux-stagger-2">{{ $t('¡Bienvenido de nuevo!') }}</h2>
            <p id="pForm" class="ux-content ux-stagger-3">{{ $t('Por favor, inicia sesión para continuar') }}</p>
            <p class="forgotThePasswordText2 ux-content ux-stagger-4"><RouterLink to="/register" style="color: #039BE5;">{{ $t('¿No tienes cuenta aún? haz click aquí') }}</RouterLink></p>
            <form class="generalForm ux-content ux-stagger-5" @submit.prevent="submitLogin" id="generalFormLogin">
                
                
                <div class="blockForm ux-form-field ux-stagger-1">
                    <label class="labelForm"for="">{{ $t('Correo') }}</label>
                    <div class="blockInput">
                        <span class="blockIcon"><i class="fa-regular fa-envelope"></i></span>
                        <input class="inputForm" type="text" v-model="loginForm.email">
                       
                    </div>
                    <div class="error" v-if="errorsLoginForm.email">{{errorsLoginForm.email}}</div>
                </div>
                <div class="blockForm ux-form-field ux-stagger-2" style="margin-bottom: 1rem;">
                    <label class="labelForm"for="">{{ $t('Contraseña') }}</label>
                    <div class="blockInput">
                        <span class="blockIcon"><i class="fa-solid fa-key"></i></span>
                        <input class="inputForm" type="password" v-model="loginForm.password">
                        <i class="fa-solid fa-eye-slash eye eyeLogin" @click="inputFromPasswordToText($event.target)"></i>
                    </div>
                    
                    <div class="error" v-if="errorsLoginForm.password">{{errorsLoginForm.password}}</div>
                </div>
                
                <RouterLink to="/forgotPassword" class="ux-content ux-stagger-3"><p id="forgotThePasswordText">{{ $t('¿Has olvidado la contraseña?') }}</p></RouterLink>
                <button class="btnSubmit ux-button ux-stagger-4" type="submit" style="margin-top: 1rem">{{ $t('Ingresar') }}</button>
                
            </form>
            
            

        </div>
        <div class="contenedorImagenRegister ux-slide-in-right ux-stagger-2" id="contenedorImgLogin">
            <div class="alreadyExist ux-content ux-stagger-6" id="alreadyExistLogin"><span>{{ $t('¿No tienes cuenta aún?') }}</span><RouterLink to="/register" class="btnLogin ux-hover-lift">{{ $t('Registrarse') }}</RouterLink></div>
        </div>
    </section>
</template>


