<script setup>
    import {reactive, ref, onMounted} from 'vue'
    import { RouterLink } from 'vue-router';
    import {formularios} from '/src/data/forms.js'
    import {services} from '/src/data/services.js'
    import Formulario from '../components/ItemForm.vue'
    import {useApi} from '/src/js/useFetch.js'
    import { mostrarNotificacion } from '@/js/notificationsRequest';
    import FormsSkeleton from '../components/skeletons/FormsSkeleton.vue'
    import { useSkeletonDev } from '../js/useSkeletonDev.js'

    const { isLoading, isFading } = useSkeletonDev('forms', 1800)

    const state = reactive({
        formularios: []
    })

    const loading = ref(false)

    async function getForms() {
        loading.value = true // Indica que la carga ha comenzado
        
        try {
            let {data, error} = await useApi(`/api/forms`)

            if(!error.value && data.value) {
                state.formularios = Array.isArray(data.value) ? data.value : []
            } else {
                console.warn('Error cargando formularios:', error.value)
                mostrarNotificacion('Error cargando formularios')
                state.formularios = [] // Asegurar que sea un array vacío
            }
        } catch (err) {
            console.error('Error en getForms:', err)
            mostrarNotificacion('Error cargando formularios')
            state.formularios = []
        }
        
        loading.value = false // Indica que la carga ha terminado
    }

    async function deleteForm(idForm) {
        if (confirm('¿Deseas eliminar este formulario?')) {
            let url = `/api/forms/${idForm}`;
            let method = 'DELETE';

            try {
                const { error } = await useApi(url, method);
                if (error.value) {
                    console.error('Error eliminando formulario:', error.value);
                    mostrarNotificacion('Error eliminando formulario')
                    return;
                }

                // ✅ Elimina el formulario del estado reactivo
                state.formularios = state.formularios.filter(form => form.id !== idForm);

            } catch (err) {
                console.error('Error en deleteForm:', err);
            }
        }
    }

    function filterFormsByService(serviceId) {
        return state.formularios?.filter(formulario => formulario.serviceId === serviceId) || [];
    }

    onMounted(() => {
        getForms()
    })


</script>
 
<template>
    <!-- Skeleton Loader -->
    <div v-if="isLoading" class="skeleton-container" :class="{ 'skeleton-fade-out': isFading }">
        <FormsSkeleton />
    </div>

    <!-- Contenido Real -->
    <section v-else class="sectionGeneralConfAssistant">
        <h1>Formularios</h1>

        <div class="contenedorSecConfAssistant">
            <!-- <RouterLink to="/newForm" class="btnNewForm">Nuevo formulario</RouterLink> -->
            
            <div class="accountBlock">
                <div v-for="service in services" :key="service.id"class="containerServiceForms">
                    <button type="button" class="btnNewForm">{{ service.description }}</button>
                    
                    <div class="newFormIcon">
                        <RouterLink :to="{ name: 'NewForm', params: { serviceId: service.id } }" class="newFormIcon"><i class="fa-solid fa-square-plus plusAddForm"></i></RouterLink>
                    </div>
                    
                    <div class="questionAndType servicesForm titleServicesForm">
                        <div class="serviceColumn">
                            <span class="">Nombre de formulario:</span>
                            
                        </div>
                        <div class="serviceColumn">
                            <span class=""></span>
                        </div>
                    </div>
                     <!-- Se obtiene la lista de formularios filtrados -->
                    <div v-if="filterFormsByService(service.id).length > 0" style="width: 100%;">
                        <Formulario
                            v-for="formulario in filterFormsByService(service.id)"
                            :key="formulario.id"
                            v-bind:formulario="formulario"
                            @delete-form="deleteForm"
                        />
                    </div>

                    <!-- Si no hay formularios, se muestra el mensaje -->
                    <p v-else class="noFormsMessage">No hay formularios asociados aún.</p>
                </div>
                
            </div>

        </div>
    </section>
</template>



