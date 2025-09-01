<script setup>
    import {reactive, ref, onMounted} from 'vue'
    import {services} from '/src/data/services.js'
    import {formularios} from '/src/data/forms.js'
    import {checkOptAssistant} from '/src/js/checkOpt.js'
    import ConfigAssistantSkeleton from '../components/skeletons/ConfigAssistantSkeleton.vue'
    import { useSkeleton } from '../js/useSkeleton.js'

    const { isLoading, isFading, startLoading, finishLoading } = useSkeleton()

    const state = reactive({
        services: services
    })

    function mostrarInfoOpt(btnInfo,aparecerODesaparecer) {
        // 0 para aparecer 1 para desaparecer

        let cuadroInformativo = btnInfo.parentNode.querySelector('.infoBlockOpt')

        if(aparecerODesaparecer == 0) {
            cuadroInformativo.style.display = 'flex'
        } else {
            cuadroInformativo.style.display = 'none'
        }
        
    }

    onMounted(() => {
        // No hay carga de datos real en esta vista por ahora
        // El skeleton se mostraría solo si hubiera llamadas a API reales
    })
    
</script>

<template>
    <!-- Skeleton Loader -->
    <div v-if="isLoading" class="skeleton-container" :class="{ 'skeleton-fade-out': isFading }">
        <ConfigAssistantSkeleton />
    </div>

    <!-- Contenido Real -->
    <section v-else class="sectionGeneralConfAssistant ux-container">
        <h1 class="ux-header">Configuración de asistente de estudio</h1>

        <div class="contenedorSecConfAssistant ux-content">
            <div class="linkAndPreview ux-card ux-stagger-1">
                <button class="btnPreview BGBlue ux-button ux-hover-lift">Previsualiza</button>
                <div class="link ux-fade-in ux-stagger-2">
                    <p class="bold">Link de tu asistente de estudio: <a href="/assistantChat">https://inkvaluation.co/studio/assistantChat</a></p>
                    <button class="btnPreview BGYellow ux-button ux-hover-lift">Compartelo</button>
                </div>
            </div>
            <div class="msgDefault ux-card ux-stagger-2">
                <p class="bold ux-fade-in">Tu asistente de estudio está listo para compartir</p>
                <p class="ux-fade-in ux-stagger-1">Por defecto preguntará al cliente:</p>
                <ul class="listItemsDefault">
                    <li class="ux-list-item ux-stagger-1">Nombre</li>
                    <li class="ux-list-item ux-stagger-2">Servicio deseado</li>
                </ul>
            </div>
            <div class="accountBlock ux-card ux-stagger-3">
                <h4>Perfil del estudio</h4>
                
                <div class="divInput ux-form-field ux-stagger-1">
                    <label for="">Nombre del estudio</label>
                    <div class="inputIcon">
                        <input type="text" name="" value="InkStudio Pro"> 
                    </div>
                </div>
                <div class="divInput ux-form-field ux-stagger-2">
                    <label for="">Mensaje de bienvenida del estudio</label>
                    <div class="inputIcon">
                        <textarea  name="">¡Bienvenido a nuestro estudio! Vamos a recopilar información para realizar tu cotización del servicio. </textarea>
                    </div>
                </div>
                <button class="btnAccountBlock BGYellow ux-button ux-stagger-4" type="button">Guardar</button>
            </div>
            <div class="accountBlock ux-card ux-stagger-4">
                <h4>Servicios disponibles</h4>
                <p class="parOptForm">Activa los servicios que ofrece tu estudio para que aparezcan en el asistente.</p>
                
                <div class="contOpts">
                    <div v-for="(service, index) in state.services" :key="service.id" class="btnDescInfo">
                        <div class="btnYDesc">
                            <div class="simBtnWithAnimation" @click="checkOptAssistant($event.currentTarget)">
                                <div class="circleMove"></div>
                                <input class="inputCheck" type="checkbox" name="" id="">
                            </div>
                            <p>{{ service.description }}</p>
                        </div>
                    </div>
                    <button class="btnAccountBlock BGYellow ux-button ux-stagger-3" type="button">Guardar</button>
                </div>
            </div>
            <div class="accountBlock ux-card ux-stagger-5" style="padding-bottom: 0;">
                <h4 style="margin: 0;" class="ux-fade-in">Formularios de servicios del estudio</h4>
                <p style="height: auto; margin-bottom: 1rem;" class="ux-fade-in ux-stagger-1">Para cada servicio del estudio se debe elegir un formulario que el cliente debe responder al elegir el servicio deseado</p>
                <div class="questionAndType servicesForm titleServicesForm ux-fade-in ux-stagger-2">
                    <div class="serviceColumn">
                        <span class="">Servicio:</span>
                        
                    </div>
                    <div class="serviceColumn">
                        <span class="">Formulario:</span>
                        
                    </div>

                </div>
                <div v-for="(service, index) in services" :key="service.Service_Id" class="questionAndType servicesForm ux-table-row" :style="`animation-delay: ${0.1 * (index + 3)}s`">
                    <div class="serviceColumn">
                        
                        <p>{{ service.Services_Name }}</p>
                    </div>
                    <div class="serviceColumn">
                        
                        <select name="">
                            <option 
                                v-for="formulario in formularios" 
                                :key="formulario.Form_Id" 
                                :value="formulario.Form_Id"
                                :selected="service.Form_Id === formulario.Form_Id"
                            >
                                {{ formulario.Title }}
                            </option>
                            
                            
                        </select>
                    </div>

                </div>
            </div>
            
        </div>
    </section>
</template>



