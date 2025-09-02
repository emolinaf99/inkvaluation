<script setup>
    import {reactive,ref,onMounted} from 'vue'
    import { RouterLink, RouterView, useRouter } from 'vue-router'
    import { useApi } from '../js/useFetch.js'
    import {validateForm} from '/src/js/validateForm.js'
    import { mostrarNotificacion } from '../js/mensajeNotificacionFront.js'
    import { inputFromPasswordToText } from '@/js/inputFromPasswordToText'
    import { useUserStore } from '../js/stores/userLogged.js';

    const loginForm = reactive({
        email: '',
        password: ''
    });

    const errorsLoginForm = ref({})
    const isSubmitting = ref(false)
    const showPassword = ref(false)
    const router = useRouter()
    const userStore = useUserStore()

    // Función para toggle de visibilidad de contraseña
    const togglePasswordVisibility = () => {
        showPassword.value = !showPassword.value;
    }

    // Enviar formulario
    const submitLogin = async () => {
        if (isSubmitting.value) return;

        // Definir las reglas de validación frontend
        const validationRules = {
            email: { required: true, email: true },
            password: { required: true }
        };

        // Validar el formulario
        const frontendErrors = validateForm(loginForm, validationRules);
        errorsLoginForm.value = frontendErrors;

        // Si hay errores, detener el envío
        if (Object.keys(frontendErrors).length > 0) {
            mostrarNotificacion('Por favor completa todos los campos correctamente', 0);
            return;
        }

        isSubmitting.value = true;

        try {
            // Preparar datos para backend
            const loginData = {
                email: loginForm.email,
                password: loginForm.password
            };

            console.log('🔐 Intentando login con:', { email: loginData.email, password: '***' });
            console.log('🌐 URL del endpoint:', '/api/user/auth/login');
            
            const { data, error } = await useApi('/api/auth/login', 'POST', loginData);
            
            console.log('📥 Respuesta completa del servidor:', { data: data.value, error: error.value });

            if (error.value) {
                // Manejar errores del backend
                if (error.value.response?.data?.errors) {
                    // Errores de validación express-validator
                    const backendErrors = {};
                    error.value.response.data.errors.forEach(err => {
                        const fieldMap = {
                            'email': 'email',
                            'password': 'password'
                        };
                        const frontendField = fieldMap[err.path] || err.path;
                        backendErrors[frontendField] = err.msg;
                    });
                    errorsLoginForm.value = { ...errorsLoginForm.value, ...backendErrors };
                    mostrarNotificacion('Por favor corrige los errores señalados', 0);
                } else {
                    mostrarNotificacion(error.value.response?.data?.message || 'Error en el inicio de sesión', 0);
                }
            } else if (data.value?.success) {
                mostrarNotificacion('Inicio de sesión exitoso', 1);
                
                // Actualizar store con información del usuario
                userStore.setUser(data.value.user);
                
                // Redirigir al dashboard/account
                setTimeout(() => {
                    router.push('/account');
                }, 1500);
            }

        } catch (error) {
            console.error('Error en login:', error);
            mostrarNotificacion('Error de conexión', 0);
        } finally {
            isSubmitting.value = false;
        }
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
                <button class="btnSubmit ux-button ux-stagger-4" type="submit" style="margin-top: 1rem" :disabled="isSubmitting">
                    {{ isSubmitting ? $t('Ingresando...') : $t('Ingresar') }}
                </button>
                
            </form>
            
            

        </div>
        <div class="contenedorImagenRegister ux-slide-in-right ux-stagger-2" id="contenedorImgLogin">
            <div class="alreadyExist ux-content ux-stagger-6" id="alreadyExistLogin"><span>{{ $t('¿No tienes cuenta aún?') }}</span><RouterLink to="/register" class="btnLogin ux-hover-lift">{{ $t('Registrarse') }}</RouterLink></div>
        </div>
    </section>
</template>


