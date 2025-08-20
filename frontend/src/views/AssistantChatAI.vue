<script setup>
    import { onMounted, ref, nextTick, watch } from 'vue'
    import { useChatbotAI } from '../js/useChatbotAI.js'

    const { 
        chatState, 
        iniciarConversacion, 
        procesarRespuesta, 
        manejarCambioInput, 
        enviarSolicitud,
        hayErrorAPI,
        estaCargando,
        formsAPI,
        toggleModoIA,
        reiniciarChat
    } = useChatbotAI()
    
    // Referencia para el input actual
    const inputRef = ref(null)
    const textareaRef = ref(null)

    // Manejar envío manual (Enter en input/textarea)
    const enviarRespuesta = () => {
        if (chatState.inputValue.trim()) {
            procesarRespuesta(chatState.inputValue.trim())
        }
    }

    // Manejar Enter en input
    const manejarEnter = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()
            enviarRespuesta()
        }
    }

    // Función para scroll al final
    const scrollToBottom = () => {
        const chatContainer = document.querySelector('.sectionMessages')
        if (chatContainer) {
            const scrollTarget = chatContainer.scrollHeight + 100
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

    // Función para mostrar información del modo actual
    const mostrarInfoModo = () => {
        const modo = chatState.modoIA ? 'Inteligencia Artificial' : 'Chatbot Tradicional'
        const descripcion = chatState.modoIA ? 
            'Conversación natural con IA que adapta las preguntas según tus respuestas' :
            'Flujo estructurado basado en formularios predefinidos'
        
        alert(`Modo actual: ${modo}\n\n${descripcion}`)
    }

    // Inicializar chat al montar
    onMounted(() => {
        iniciarConversacion()
    })

</script>

<template>
    <section class="sectionGeneralChat ux-container">
        <!-- Header del Chat con controles -->
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
            
            <!-- Controles del chat -->
            <div class="chat-controls">
                <button 
                    @click="mostrarInfoModo" 
                    class="btn-info"
                    :title="chatState.modoIA ? 'Modo IA Activado' : 'Modo Tradicional'"
                >
                    <i :class="chatState.modoIA ? 'fa-solid fa-robot' : 'fa-solid fa-list'"></i>
                </button>
                
                <button 
                    @click="toggleModoIA" 
                    class="btn-toggle"
                    title="Cambiar modo de chat"
                >
                    <i class="fa-solid fa-refresh"></i>
                </button>
                
                <button 
                    @click="reiniciarChat" 
                    class="btn-reset"
                    title="Reiniciar conversación"
                >
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
            
            <p class="ux-fade-in ux-stagger-3">
                {{ chatState.modoIA ? 'Asistente IA para cotizaciones personalizadas' : 'Asistente guiado para cotizaciones' }}
            </p>
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
                    <i class="fa-solid fa-robot" v-if="chatState.modoIA"></i>
                    <i class="fa-solid fa-play fa-flip-horizontal" v-else></i>
                    <div class="mensaje-contenido" v-html="mensaje.contenido"></div>
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
                <div class="input-container">
                    <input 
                        ref="inputRef"
                        v-model="chatState.inputValue"
                        @input="manejarCambioInput($event.target.value)"
                        @keydown="manejarEnter"
                        class="inputNameChat ux-form-field"
                        type="text"
                        :placeholder="chatState.modoIA ? 'Describe lo que tienes en mente...' : 'Escribe tu respuesta...'"
                    />
                    <button 
                        v-if="chatState.inputValue.trim()"
                        @click="enviarRespuesta"
                        class="btn-send"
                    >
                        <i class="fa-solid fa-paper-plane"></i>
                    </button>
                </div>
            </div>

            <!-- Textarea para respuestas largas -->
            <div 
                v-if="chatState.esperandoInput && chatState.tipoInputActual === 'textarea'"
                class="msgContainer jcFlexEnd ux-slide-in-right"
            >
                <div class="textareaContainer">
                    <textarea 
                        ref="textareaRef"
                        v-model="chatState.inputValue"
                        @input="manejarCambioInput($event.target.value)"
                        @keydown="manejarEnter"
                        class="textareaChat"
                        placeholder="Describe tu idea con todos los detalles que quieras..."
                        rows="4"
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

            <!-- Indicador de progreso (solo en modo IA) -->
            <div 
                v-if="chatState.modoIA && chatState.progreso.percentage > 0"
                class="msgContainer jcFlexStart"
            >
                <div class="progresoFormulario ai-progress">
                    <div class="progresoTexto">
                        <small>
                            <i class="fa-solid fa-brain"></i>
                            Información recopilada: {{ chatState.progreso.percentage }}%
                        </small>
                    </div>
                    <div class="progresoBarra">
                        <div 
                            class="progresoFill ai-fill" 
                            :style="{ width: chatState.progreso.percentage + '%' }"
                        ></div>
                    </div>
                </div>
            </div>

            <!-- Datos recopilados (debug) -->
            <div 
                v-if="chatState.modoIA && Object.keys(chatState.datosRecopilados).length > 0"
                class="msgContainer jcFlexStart debug-info"
                style="opacity: 0.7; font-size: 0.8em;"
            >
                <div class="msgChat debug">
                    <i class="fa-solid fa-info-circle"></i>
                    <div>
                        <strong>Datos detectados:</strong><br>
                        <pre>{{ JSON.stringify(chatState.datosRecopilados, null, 2) }}</pre>
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
                    <p>{{ chatState.modoIA ? 'Procesando con IA...' : 'Cargando...' }}</p>
                </div>
            </div>

            <!-- Indicador de "escribiendo..." del bot -->
            <div 
                v-if="chatState.botEscribiendo"
                class="msgContainer jcFlexStart"
            >
                <div class="msgChat escribiendo">
                    <i class="fa-solid fa-robot" v-if="chatState.modoIA"></i>
                    <i class="fa-solid fa-play fa-flip-horizontal" v-else></i>
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

<style scoped>
/* Estilos adicionales para la IA */
.headerChat {
    position: relative;
}

.chat-controls {
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    gap: 8px;
}

.btn-info, .btn-toggle, .btn-reset {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    width: 36px;
    height: 36px;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.btn-info:hover, .btn-toggle:hover, .btn-reset:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
}

.input-container {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
}

.btn-send {
    background: #007bff;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.btn-send:hover {
    background: #0056b3;
    transform: scale(1.1);
}

.ai-progress {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.ai-fill {
    background: linear-gradient(90deg, #00d4ff, #5b86e5);
}

.debug-info {
    margin: 10px 0;
}

.debug pre {
    background: rgba(0, 0, 0, 0.1);
    padding: 8px;
    border-radius: 4px;
    font-size: 0.7em;
    white-space: pre-wrap;
    word-break: break-word;
}

.mensaje-contenido {
    line-height: 1.4;
}

.fa-robot {
    color: #5b86e5;
}
</style>