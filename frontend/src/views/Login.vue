<script setup>
    import {reactive,ref,onMounted} from 'vue'
    import { RouterLink, RouterView } from 'vue-router'
    import {validateForm} from '/src/js/validateForm.js'
    import { inputFromPasswordToText } from '@/js/inputFromPasswordToText';
    import LoginSkeleton from '../components/skeletons/LoginSkeleton.vue'
    import { useSkeletonDev } from '../js/useSkeletonDev.js'

    const { isLoading, isFading } = useSkeletonDev('login', 1200)

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
    <!-- Skeleton Loader -->
    <div v-if="isLoading" class="skeleton-container" :class="{ 'skeleton-fade-out': isFading }">
        <LoginSkeleton />
    </div>

    <!-- Contenido Real -->
    <section v-else class="sectionLoginAndRegister">
        <div class="contenedorForm" id="contenedorFormLogin">
            <div class="contenedorLogoForm" id="contLogoLogin">
                <RouterLink to="/"><img class="logoApp" src="/img/InkValuationLogo.png" alt=""></RouterLink>
            </div>
            <h2 id="h2Form">¡Bienvenido de nuevo!</h2>
            <p id="pForm">Por favor, inicia sesión para continuar</p>
            <p class="forgotThePasswordText2"><RouterLink to="/register" style="color: #039BE5;">¿No tienes cuenta aún? haz click aquí</RouterLink></p>
            <form class="generalForm" @submit.prevent="submitLogin" id="generalFormLogin">
                
                
                <div class="blockForm">
                    <label class="labelForm"for="">Email</label>
                    <div class="blockInput">
                        <span class="blockIcon"><i class="fa-regular fa-envelope"></i></span>
                        <input class="inputForm" type="text" v-model="loginForm.email">
                       
                    </div>
                    <div class="error" v-if="errorsLoginForm.email">{{errorsLoginForm.email}}</div>
                </div>
                <div class="blockForm" style="margin-bottom: 1rem;">
                    <label class="labelForm"for="">Contraseña</label>
                    <div class="blockInput">
                        <span class="blockIcon"><i class="fa-solid fa-key"></i></span>
                        <input class="inputForm" type="password" v-model="loginForm.password">
                        <i class="fa-solid fa-eye-slash eye eyeLogin" @click="inputFromPasswordToText($event.target)"></i>
                    </div>
                    
                    <div class="error" v-if="errorsLoginForm.password">{{errorsLoginForm.password}}</div>
                </div>
                
                <RouterLink to="/forgotPassword"><p id="forgotThePasswordText">¿Has olvidado la contraseña?</p></RouterLink>
                <button class="btnSubmit" type="submit" style="margin-top: 1rem">Ingresar</button>
                
            </form>
            
            

        </div>
        <div class="contenedorImagenRegister" id="contenedorImgLogin">
            <div class="alreadyExist" id="alreadyExistLogin"><span>¿No tienes cuenta aún?</span><RouterLink to="/register" class="btnLogin">Registrate</RouterLink></div>
        </div>
    </section>
</template>


