<script setup>
    import { onMounted, ref, nextTick, watch } from 'vue'
    import { useChatbot } from '../js/useChatbot.js'

    const { chatState, iniciarConversacion, procesarRespuesta, manejarCambioInput, enviarSolicitud } = useChatbot()
    
    // Referencia para el input actual
    const inputRef = ref(null)
    const textareaRef = ref(null)

    // Manejar selección de opción
    const seleccionarOpcion = (opcion) => {
        procesarRespuesta(opcion)
        // El scroll automático se maneja desde useChatbot.js después de ocultar inputs
    }

    // Manejar envío manual (Enter en textarea)
    const enviarRespuesta = () => {
        if (chatState.inputValue.trim()) {
            procesarRespuesta(chatState.inputValue.trim())
            // El scroll automático se maneja desde useChatbot.js después de ocultar inputs
        }
    }

    // Función para scroll al final
    const scrollToBottom = () => {
        const chatContainer = document.querySelector('.sectionMessages')
        if (chatContainer) {
            // Scroll suave hacia abajo completamente con margen extra
            const scrollTarget = chatContainer.scrollHeight + 100 // 100px extra para asegurar visibilidad completa
            chatContainer.scrollTo({
                top: scrollTarget,
                behavior: 'smooth'
            })
        }
    }

    // Enfocar input cuando aparece
    const enfocarInput = () => {
        nextTick(() => {
            setTimeout(() => {
                if (chatState.tipoInputActual === 'textarea' && textareaRef.value) {
                    textareaRef.value.focus()
                } else if (inputRef.value) {
                    inputRef.value.focus()
                }
            }, 100)
        })
    }

    // Watch para enfocar automáticamente cuando aparece un input
    watch(() => chatState.esperandoInput, (nuevoValor) => {
        if (nuevoValor) {
            enfocarInput()
        }
    })

    // Inicializar chat al montar
    onMounted(() => {
        iniciarConversacion()
    })

</script>

<template>
    <section class="sectionGeneralChat ux-container">
        <!-- Header del Chat -->
        <div class="headerChat ux-slide-in-down">
            <div class="perfilChat ux-fade-in ux-stagger-1">
                <img src="/img/noImg.jpg" alt="" class="ux-image">
                <div class="stateChatAndName ux-fade-in ux-stagger-2">
                    <p class="bold">{{ chatState.nombreNegocio }}</p>
                    <p v-if="!chatState.botEscribiendo">En línea</p>
                    <p v-else class="escribiendo-estado">
                        Escribiendo...
                    </p>
                </div>
            </div>
            <p class="ux-fade-in ux-stagger-3">Asistente virtual para cotizaciones personalizadas</p>
        </div>

        <!-- Mensajes del Chat -->
        <section class="sectionMessages ux-content">
            <!-- Mensajes dinámicos -->
            <div 
                v-for="mensaje in chatState.mensajes" 
                :key="mensaje.id"
                :class="['msgContainer', mensaje.esBot ? 'jcFlexStart' : 'jcFlexEnd']"
                class="ux-fade-in-up"
            >
                <div v-if="mensaje.esBot" class="msgChat ux-fade-in">
                    <i class="fa-solid fa-play fa-flip-horizontal ux-scale-in"></i>
                    <p v-html="mensaje.contenido"></p>
                </div>
                <div v-else class="msgUser">
                    <p>{{ mensaje.contenido }}</p>
                </div>
            </div>

            <!-- Input de Texto -->
            <div 
                v-if="chatState.esperandoInput && chatState.tipoInputActual === 'text'"
                class="msgContainer jcFlexEnd ux-slide-in-right"
            >
                <input 
                    ref="inputRef"
                    v-model="chatState.inputValue"
                    @input="manejarCambioInput($event.target.value)"
                    class="inputNameChat ux-form-field"
                    type="text"
                    placeholder="Escribe tu respuesta..."
                />
            </div>

            <!-- Textarea -->
            <div 
                v-if="chatState.esperandoInput && chatState.tipoInputActual === 'textarea'"
                class="msgContainer jcFlexEnd ux-slide-in-right"
            >
                <div class="textareaContainer">
                    <textarea 
                        ref="textareaRef"
                        v-model="chatState.inputValue"
                        @input="manejarCambioInput($event.target.value)"
                        class="textareaChat"
                        placeholder="Describe tu idea..."
                        rows="3"
                    ></textarea>
                    <button 
                        v-if="chatState.inputValue.trim()"
                        @click="enviarRespuesta"
                        class="btnEnviarTexto BGBlue"
                    >
                        Enviar
                    </button>
                </div>
            </div>

            <!-- Opciones Radio -->
            <div 
                v-if="chatState.esperandoInput && chatState.tipoInputActual === 'radio'"
                class="msgContainer jcFlexEnd ux-slide-in-right"
            >
                <ul class="listChat ux-content">
                    <li 
                        v-for="(opcion, index) in chatState.opciones" 
                        :key="index"
                        class="ux-list-item ux-hover-lift"
                        :class="{ 'noBorder': index === chatState.opciones.length - 1 }"
                        @click="seleccionarOpcion(opcion)"
                    >
                        <input 
                            type="radio" 
                            :name="`option-${Date.now()}`" 
                            :id="`option-${index}`"
                            :value="opcion"
                        >
                        <label :for="`option-${index}`">{{ opcion }}</label>
                    </li>
                </ul>
            </div>

            <!-- Indicador de "escribiendo..." del bot -->
            <div 
                v-if="chatState.botEscribiendo"
                class="msgContainer jcFlexStart"
            >
                <div class="msgChat escribiendo">
                    <i class="fa-solid fa-play fa-flip-horizontal"></i>
                    <p>
                        <span class="typing-indicator">
                            <span></span>
                            <span></span>
                            <span></span>
                        </span>
                    </p>
                </div>
            </div>
        </section>

        <!-- Botón de envío (solo visible cuando terminó) -->
        <div v-if="chatState.etapaActual === 'completado'" class="chatActions">
            <button @click="enviarSolicitud" class="btnEnviarSolicitud BGGreen">
                Enviar Solicitud de Cotización
            </button>
        </div>
    </section>
</template>


