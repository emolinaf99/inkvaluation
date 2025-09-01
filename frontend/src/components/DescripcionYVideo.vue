<script setup>
    import {reactive,ref,onMounted} from 'vue'
    import {mostrarNotificacion} from '/src/js/mensajeNotificacionFront.js'
    import {useApi} from '/src/js/useFetch.js'
    import {validateForm} from '/src/js/validateForm.js'

    const suscribeForm = reactive({
        nombre: '',
        email: ''
    })

    const errorsSuscribeForm = ref({})

    // Enviar formulario
    const submitForm = async () => {

        // Definir las reglas de validación
        const validationRules = {
            nombre: { required: true },
            email: { required: true, email: true },
        };

        // Validar el formulario
        const errors = validateForm(suscribeForm, validationRules);
        errorsSuscribeForm.value = errors; // Guardar los errores para mostrarlos en la vista

        // Si hay errores, detener el envío
        if (Object.keys(errors).length > 0) {
            console.log("Errores en el formulario:", errors);
            return;
        }

        const { data, error } = await useApi(`/api/userInterested`, 'POST', suscribeForm);

        if (error.value) {
            console.error('Error generando inscripción', error.value);

            mostrarNotificacion(error.value.mensaje, 0);
            return;
        }

        // Si todo es válido, enviar los datos
        mostrarNotificacion("Inscripción realizada con éxito ",1);
        console.log("Datos enviados:", suscribeForm);
        suscribeForm.nombre = ''
        suscribeForm.email = ''

    };


</script>

<template>
    <div class="contenedorDescripcionYVideo">
        <div class="contenedorDescripcion">
            <h1 class="titleMain">{{ $t('Optimiza tus Cotizaciones y Gana Más Clientes') }}</h1>
            <p class="descripcion">{{ $t('Realiza tus cotizaciones de manera fácil y rápida con InkValuation, nuestra plataforma diseñada especialmente para ti. Ahorra tiempo y optimiza tus procesos con nuestro asistente virtual 24/7.') }}</p>
            <br>
            <br>
            <p class="descripcion">{{ $t('Déjanos tu correo electrónico para mantenerte actualizado sobre el lanzamiento') }}</p>
            <br>
            <div class="suscribirseBlock">
                <form class="formSuscribirse" @submit.prevent=submitForm()>
                    <input class="inputMain" type="text" v-model="suscribeForm.nombre" :placeholder="$t('Nombre')">
                    <div class="mgLeft1 error"v-if="errorsSuscribeForm.nombre">{{errorsSuscribeForm.nombre}}</div>
                    <input class="inputMain" type="text" v-model="suscribeForm.email" :placeholder="$t('Su correo electrónico')">
                    <div class="mgLeft1 error" v-if="errorsSuscribeForm.email">{{errorsSuscribeForm.email}}</div>
                    <button class="buttonSuscribirseMain" type="submit">{{ $t('Inscribirse') }}</button>
                </form>
                
            </div>
            
        </div>
        <div class="contenedorVideo">
            <video class="videoAplicativo" src="/videos/videoPruebaApp.mp4" controls></video>
            
        </div>
    </div>
</template>
