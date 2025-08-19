<script setup>
    import { onMounted, ref, nextTick, watch } from 'vue'
    import { useChatbotForms } from '../js/useChatbotForms.js'
    import { services } from '../data/services.js'

    const { 
        chatState, 
        iniciarConversacion, 
        procesarRespuesta, 
        procesarOpcionImagen,
        manejarCambioInput, 
        enviarSolicitud, 
        retrocederEtapa,
        hayErrorAPI,
        estaCargando,
        formsAPI
    } = useChatbotForms()
    
    // Referencia para el input actual
    const inputRef = ref(null)
    const textareaRef = ref(null)

    // Manejar selección de opción
    const seleccionarOpcion = (opcion) => {
        procesarRespuesta(opcion)
        // El scroll automático se maneja desde useChatbotForms.js después de ocultar inputs
    }

    // Manejar selección de opción con imagen
    const seleccionarOpcionImagen = (opcion) => {
        procesarOpcionImagen(opcion)
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

    // Función para editar mensaje del usuario
    const editarMensaje = (mensaje) => {
        console.log('editarMensaje called with:', mensaje)
        console.log('chatState actual:', chatState)
        
        // Verificar que es un mensaje del usuario
        if (mensaje.esBot) {
            console.log('No se puede editar mensaje del bot')
            return
        }

        console.log('Iniciando edición...')

        // Encontrar el índice del mensaje a editar
        const indexMensaje = chatState.mensajes.findIndex(m => m.id === mensaje.id)
        console.log('Índice del mensaje:', indexMensaje)

        // Remover todos los mensajes desde este mensaje en adelante
        if (indexMensaje !== -1) {
            chatState.mensajes.splice(indexMensaje)
            console.log('Mensajes removidos desde el índice:', indexMensaje)
        }

        // Determinar la etapa correcta basándose en el contenido del mensaje
        let etapaParaEditar = 'nombre'
        let tipoInput = 'text'
        let opciones = []

        // Si el mensaje es el nombre (primer mensaje del usuario)
        const mensajesUsuario = chatState.mensajes.filter(m => !m.esBot)
        if (mensajesUsuario.length === 0) {
            etapaParaEditar = 'nombre'
            tipoInput = 'text'
        }
        // Si es el servicio (segundo mensaje del usuario)
        else if (mensajesUsuario.length === 1) {
            etapaParaEditar = 'servicio'
            tipoInput = 'radio'
            opciones = services.map(service => service.services_name)
        }
        // Si es una pregunta del formulario
        else {
            etapaParaEditar = 'formulario'
            // Calcular qué pregunta del formulario es
            const numPregunta = mensajesUsuario.length - 2 // Restamos nombre y servicio
            if (chatState.formularioActual && chatState.formularioActual.preguntas[numPregunta]) {
                const pregunta = chatState.formularioActual.preguntas[numPregunta]
                tipoInput = pregunta.tipo
                chatState.preguntaActual = numPregunta
                if (pregunta.tipo === 'radio') {
                    opciones = pregunta.opciones
                }
            }
        }

        // Configurar el estado del chat
        chatState.etapaActual = etapaParaEditar
        chatState.esperandoInput = true
        chatState.inputValue = mensaje.contenido
        chatState.tipoInputActual = tipoInput
        chatState.opciones = opciones

        console.log('Configuración para edición:', {
            etapa: etapaParaEditar,
            tipoInput: tipoInput,
            inputValue: mensaje.contenido,
            opciones: opciones
        })

        console.log('Estado final del chat:', {
            esperandoInput: chatState.esperandoInput,
            tipoInputActual: chatState.tipoInputActual,
            inputValue: chatState.inputValue,
            opciones: chatState.opciones
        })

        // Enfocar el input
        nextTick(() => {
            enfocarInput()
        })
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
                <div v-else class="msgUser editable-message" @click.stop="editarMensaje(mensaje)">
                    <p>{{ mensaje.contenido }}</p>
                    <i class="fa-solid fa-pencil edit-icon"></i>
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

            <!-- Opciones con Imágenes -->
            <div 
                v-if="chatState.esperandoInput && chatState.tipoInputActual === 'opciones-imagenes'"
                class="msgContainer jcFlexEnd ux-slide-in-right"
            >
                <div class="opcionesImagenesContainer">
                    <div 
                        v-for="(opcion, index) in chatState.opcionesConImagenes" 
                        :key="index"
                        class="opcionImagen ux-hover-lift"
                        @click="seleccionarOpcionImagen(opcion)"
                    >
                        <div class="imagenOpcion" v-if="opcion.image_url">
                            <img :src="opcion.image_url" :alt="opcion.text || opcion.label" />
                        </div>
                        <div class="textoOpcion">
                            <p>{{ opcion.text || opcion.label }}</p>
                            <small v-if="opcion.description">{{ opcion.description }}</small>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Indicador de progreso del formulario -->
            <div 
                v-if="chatState.formularioActivo && chatState.progreso.total > 0"
                class="msgContainer jcFlexStart"
            >
                <div class="progresoFormulario">
                    <div class="progresoTexto">
                        <small>Pregunta {{ chatState.progreso.current }} de {{ chatState.progreso.total }}</small>
                    </div>
                    <div class="progresoBarra">
                        <div 
                            class="progresoFill" 
                            :style="{ width: chatState.progreso.percentage + '%' }"
                        ></div>
                    </div>
                </div>
            </div>

            <!-- Indicador de error de API -->
            <div 
                v-if="hayErrorAPI"
                class="msgContainer jcFlexStart"
            >
                <div class="msgChat error-api">
                    <i class="fa-solid fa-exclamation-triangle"></i>
                    <p>{{ formsAPI.error.value }}</p>
                </div>
            </div>

            <!-- Indicador de carga -->
            <div 
                v-if="estaCargando"
                class="msgContainer jcFlexStart"
            >
                <div class="msgChat cargando">
                    <i class="fa-solid fa-spinner fa-spin"></i>
                    <p>Cargando...</p>
                </div>
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


