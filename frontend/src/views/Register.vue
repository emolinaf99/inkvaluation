<script setup>
    import {reactive,ref,onMounted} from 'vue'
    import { RouterLink, RouterView } from 'vue-router'
    import RegisterSkeleton from '../components/skeletons/RegisterSkeleton.vue'
    import { useSkeletonDev } from '../js/useSkeletonDev.js'

    const { isLoading, isFading } = useSkeletonDev('register', 1200)

    const formData = ref({
        nombre: '',
        apellido:'',
        fechaDeNacimiento: '',
        pais: '',
        telefono: '',
        email: '',
        contrasena: '',
        comoNosConociste: ''
    });

    const submitRegister = () => {
        // Aquí puedes manejar la lógica para enviar los datos del formulario
        console.log('Datos enviados:', formData.value);
        // Por ejemplo, puedes llamar a una función para enviar los datos a través de una API
        // o realizar alguna acción específica con los datos del formulario.
    };

    
    onMounted(() => {

        function textoDinamico() {
            const textElement = document.getElementById('dynamicText');
            const words = ['tatúas', 'diseñas', 'descansas'];
            let currentWordIndex = 0;
            let currentCharIndex = 0;
            let isDeleting = false;
            let pause = false;

            function type() {
                if (pause) {
                setTimeout(() => {
                    pause = false;
                    type();
                }, 500); // Pausa adicional de 500ms
                return;
                }

                const currentWord = words[currentWordIndex];
                if (isDeleting) {
                // Borrar texto
                textElement.textContent = currentWord.substring(0, currentCharIndex - 1);
                currentCharIndex--;
                if (currentCharIndex === 0) {
                    isDeleting = false;
                    currentWordIndex = (currentWordIndex + 1) % words.length;
                    pause = true; // Pausa antes de empezar a escribir la siguiente palabra
                }
                } else {
                // Escribir texto
                textElement.textContent = currentWord.substring(0, currentCharIndex + 1);
                currentCharIndex++;
                if (currentCharIndex === currentWord.length) {
                    isDeleting = true;
                    pause = true; // Pausa antes de empezar a borrar
                }
                }

                // Ajustar el tiempo de espera para una mejor apariencia
                const speed = isDeleting ? 80 : 130;
                setTimeout(type, speed);
            }

            type();
        }

        textoDinamico()
      
    });

    
        
    

</script>

<template>
    <!-- Skeleton Loader -->
    <div v-if="isLoading" class="skeleton-container" :class="{ 'skeleton-fade-out': isFading }">
        <RegisterSkeleton />
    </div>

    <!-- Contenido Real -->
    <section v-else class="sectionLoginAndRegister">
        <div class="contenedorForm" id="contenedorFormRegister">
            <div class="contenedorLogoForm">
                <RouterLink to="/"><img class="logoApp" src="/img/InkValuationLogo.png" alt=""></RouterLink>
            </div>
            <h2>Registro</h2>
            
            <div class="alreadyEx"><RouterLink to="/login" style="color: #039BE5;"><span>¿Ya tienes una cuenta?</span> haz click aquí</RouterLink></div>
            
            <form class="generalForm" @submit.prevent="submitRegister" >
                <!-- <div class="blockForm">
                    <label class="labelForm"for="">Tipo de cuenta</label>
                    <div class="blockInput">
                        <span class="blockIcon"><i class="fa-regular fa-user"></i></span>
                        <select class="inputForm" v-model="formData.tipoCuenta">
                            <option value="">Seleccione</option>
                        </select>
                    </div>
                </div> -->
                <!-- <div class="blockForm">
                    <label class="labelForm"for="">Nombre de tu negocio</label>
                    <div class="blockInput">
                        <span class="blockIcon"><i class="fa-solid fa-shop"></i></span>
                        <input class="inputForm" type="text" placeholder="Ej: InkValuation" v-model="formData.nombreNegocio">
                    </div>
                </div> -->
                <div class="blockForm">
                    <label class="labelForm"for="">Nombre</label>
                    <div class="blockInput">
                        <span class="blockIcon"><i class="fa-regular fa-user"></i></span>
                        <input class="inputForm" type="text" placeholder="Ej: Sergio" v-model="formData.nombre">
                    </div>
                </div>
                <div class="blockForm">
                    <label class="labelForm"for="">Apellido</label>
                    <div class="blockInput">
                        <span class="blockIcon"><i class="fa-solid fa-file-signature"></i></span>
                        <input class="inputForm" type="text" placeholder="Ej: Gomez" v-model="formData.apellido">
                    </div>
                </div>
                <div class="blockForm">
                    <label class="labelForm"for="">Fecha de nacimiento</label>
                    <div class="blockInput">
                        <span class="blockIcon"><i class="fa-regular fa-calendar"></i></span>
                        <input class="inputForm" type="date" v-model="formData.fechaDeNacimiento">
                    </div>
                </div>
                <div class="blockForm">
                    <label class="labelForm"for="">País de residencia</label>
                    <div class="blockInput">
                        <span class="blockIcon"><i class="fa-solid fa-earth-americas"></i></span>
                        <select class="inputForm" v-model="formData.pais">
                            <option value="">Seleccione</option>
                        </select>
                    </div>
                </div>
                <div class="blockForm">
                    <label class="labelForm"for="">Telefono</label>
                    <div class="blockInput">
                        <span class="blockIcon"><i class="fa-solid fa-phone"></i></span>
                        <input class="inputForm" type="number" v-model="formData.telefono">
                    </div>
                </div>
                <div class="blockForm">
                    <label class="labelForm"for="">Email</label>
                    <div class="blockInput">
                        <span class="blockIcon"><i class="fa-regular fa-envelope"></i></span>
                        <input class="inputForm" type="email" v-model="formData.correo">
                    </div>
                </div>
                <div class="blockForm" style="margin-bottom: 1rem;">
                    <label class="labelForm"for="">Contraseña</label>
                    <div class="blockInput">
                        <span class="blockIcon"><i class="fa-solid fa-key"></i></span>
                        <input class="inputForm" type="password" v-model="formData.contrasena">
                    </div>
                    <span class="passwordText">Mínimo 8 caracteres</span>
                </div>
                <div class="blockForm">
                    <label class="labelForm"for="">Como nos conociste</label>
                    <div class="blockInput">
                        <span class="blockIcon"><i class="fa-solid fa-globe"></i></span>
                        <select class="inputForm" v-model="formData.comoNosConociste">
                            <option value="">Seleccione </option>
                        </select>
                    </div>
                </div>

                <button class="btnSubmit" type="submit" style="margin-top: 1rem">Registrarse</button>
                
                
            </form>
            
            

        </div>
        <div class="contenedorImagenRegister" id="contenedorImgRegister">
            <div class="alreadyExist" id="alreadyExistRegister"><span>¿Ya tienes una cuenta?</span><RouterLink to="/login" class="btnLogin">Login</RouterLink></div>
            <div class="contenedorTextoDinamico">
                <h2>Atiende a tus clientes mientras <br><span id="dynamicText">Descansas</span></h2>
            </div>
        </div>
    </section>
</template>


