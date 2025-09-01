<script setup>
    import {reactive,ref,onMounted} from 'vue'
    import {useApi} from '/src/js/useFetch.js'
    import {validateForm} from '/src/js/validateForm.js'
    import {mostrarNotificacion} from '/src/js/mensajeNotificacionFront.js'

    const mailBoxForm = reactive({
        asunto: '',
        texto: ''
    })

    const errorsMailBox = ref({})

    // Enviar formulario
    const submitForm = () => {

        // Definir las reglas de validación
        const validationRules = {
            asunto: { required: true },
            texto: { required: true, maxLength: 200 },
        };

        // Validar el formulario
        const errors = validateForm(mailBoxForm, validationRules);
        errorsMailBox.value = errors; // Guardar los errores para mostrarlos en la vista

        // Si hay errores, detener el envío
        if (Object.keys(errors).length > 0) {
            console.log("Errores en el formulario:", errors);
            return;
        }

        // Si todo es válido, enviar los datos
        mostrarNotificacion("Sugerencia enviada con éxito ",1);
        console.log("Datos enviados:", mailBoxForm);
        mailBoxForm.asunto = ''
        mailBoxForm.texto = ''
        

    };

</script>

<template>
    <section class="sectionSolicitudes ux-container">
        <h1 class="ux-header">{{ $t('Buzón de sugerencias') }}</h1>
        <div class="contenedorGeneralMailbox ux-content">
            
            
            <form class="contenedorMailbox ux-card ux-stagger-1" @submit.prevent=submitForm()>
                <i class="fa-solid fa-pen-nib ux-scale-in ux-stagger-1"></i>
                <p class="ux-fade-in ux-stagger-2">{{ $t('En InkValuation, tu opinión es esencial para mejorar nuestro servicio. Queremos saber cómo podemos seguir transformando tu experiencia y hacer que cada detalle de tu proceso creativo sea más fluido y eficiente. Comparte con nosotros tus sugerencias para que podamos seguir impulsando la innovación en la plataforma y ofrecerte las herramientas que necesitas.') }}
                </p>
                <div class="mailboxBlock ux-form-field ux-stagger-3">
                    <label for="">{{ $t('Asunto') }}</label>
                    <input type="text" v-model="mailBoxForm.asunto" :placeholder="$t('Escriba un asunto')">
                    <div class="error" v-if="errorsMailBox.asunto">{{errorsMailBox.asunto}}</div>
                </div>
                <div class="mailboxBlock ux-form-field ux-stagger-4">
                    <textarea v-model="mailBoxForm.texto" rows="5" :placeholder="$t('Escriba su sugerencia (máximo 200 caracteres)')"></textarea>
                    <div class="error" v-if="errorsMailBox.texto">{{errorsMailBox.texto}}</div>
                </div>
                <button class="btnEnviarSugerencia ux-button ux-hover-lift ux-stagger-5" type="submit">{{ $t('Enviar') }}</button>
            </form>
            
        </div>
    </section>
</template>


