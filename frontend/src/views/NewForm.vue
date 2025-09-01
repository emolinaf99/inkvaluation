<script setup>
    import {reactive, ref, onMounted} from 'vue'
    import {useRouter} from 'vue-router'
    import {mostrarNotificacion} from '@/js/mensajeNotificacionFront'
    import {useApi} from '/src/js/useFetch.js'
    import {services} from '/src/data/services.js'

    const props = defineProps({
        serviceId: {
            type: [String,Number],
            required: true
        }
    })

    const router = useRouter() // Inicializar el router

    async function getServiceName(serviceId) {

        let service

        try {
            // const url = '/api/aquiPathParaConsultarServicioConId'
            // const { data, error, loading } = await useApi(url);
            // if (data.value) {
            //  service = data.value.services_name
            //  return service
            // }
        } catch (err) {
            console.error('Error al consultar el servicio:', err);
            return 'Error al cargar servicio';
        }

        service = services.find(service => service.id == serviceId) // se elimina luego est ecodigo

        return service.services_name //
    }

    let serviceName = ref()
    
    // Datos del formulario
    const formData = reactive({
        title: '',
        description: '',
        isPublic: false,
        serviceId: props.serviceId
    })

    // Errores del formulario crear formulario
    const errors = reactive({});

    // Validación del formulario
    function validacionCreateForm(data) {
        // Limpia el objeto de errores
        errors.title = '';
        errors.description = '';

        const newErrors = {};
        
        if (!data.title || data.title.trim() === '') {
            newErrors.title = 'El nombre es obligatorio.';
        }
        if (!data.description || data.description.trim() === '') {
            newErrors.description = 'La descripción es obligatoria.';
        }
        
        return newErrors;
    }

    // Crear formulario
    async function createForm() {
        // Validar formulario y actualizar los errores reactivos
        const newErrors = validacionCreateForm(formData);
        Object.assign(errors, newErrors);

        // Si no hay errores, procesar el formulario
        if (Object.keys(newErrors).length === 0) {
            console.log('Formulario válido', formData);

            const url = '/api/forms';
            const method = 'POST'; 

            // Asegurar que esperas la respuesta de useApi
            const { data, error, loading } = await useApi(url, method, formData);

            if (error.value) {
                console.error('Error en la solicitud:', error.value);
                mostrarNotificacion('Error creando el formulario')
            } else {

                mostrarNotificacion('Formulario creado exitosamente',1)

                // Limpia el formulario solo si la solicitud fue exitosa
                formData.description = '';
                formData.title = '';

                // redirigir al detalle del formulario creado
                router.push(`/detailForm/${data.value.id}`)

            }
        }
    }
    
    

    onMounted(async () => {

        try {
            serviceName.value = await getServiceName(props.serviceId) // Carga el nombre del servicio
        } catch (error) {
            console.error("Error cargando tipos de pregunta:", error);
        }
                
    })

</script>

<template>
    <section class="sectionGeneralConfAssistant">
        <h1>Nuevo formulario - {{ serviceName }}</h1>

        <div class="contenedorSecConfAssistant">
            

            <form class="accountBlock" @submit.prevent="createForm">
                    
                <div class="divInput">
                    <label for="">Nombre del formulario</label>
                    <div class="inputIcon">
                        <input type="text" v-model="formData.title" class="inputSelectWoBorderOLeft" value="">
                    </div>
                    <span v-if="errors.title" class="error">{{ errors.title }}</span>
                </div>
                <div class="divInput">
                    <label for="">Descripción</label>
                    <div class="inputIcon">
                        <textarea v-model="formData.description" id="" rows="4"></textarea>
                    </div>
                    <span v-if="errors.description" class="error">{{ errors.description }}</span>
                </div>
                
                <button class="btnAccountBlock BGYellow" id="createFormBtn" type="submit">Crear formulario</button>
            </form>
            
        </div>

    </section>
</template>



