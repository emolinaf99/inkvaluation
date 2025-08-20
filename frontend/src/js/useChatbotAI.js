import { ref, reactive, computed, nextTick } from 'vue'
import { useFormsAPI } from './useFormsAPI.js'
import { useAIAssistant } from './useAIAssistant.js'
import { services } from '/src/data/services.js'

export function useChatbotAI() {
    const formsAPI = useFormsAPI()
    const aiAssistant = useAIAssistant()
    
    // Estado del chatbot con IA
    const chatState = reactive({
        // Configuración
        nombreAsistente: 'Lola IA',
        mensajeBienvenida: 'Hola! Soy tu asistente inteligente para cotizaciones de tatuajes y piercings. Conversemos de manera natural sobre lo que tienes en mente.',
        nombreNegocio: 'InkValuation',
        
        // Usuario
        nombreUsuario: '',
        
        // Flujo (simplificado para IA)
        etapaActual: 'saludo', // saludo, conversacion, completado
        modoIA: true, // Nuevo: indica que estamos en modo IA
        
        // UI
        mensajes: [],
        esperandoInput: false,
        tipoInputActual: 'text',
        inputValue: '',
        
        // Estado de escritura
        botEscribiendo: false,
        
        // Datos recopilados por IA
        datosRecopilados: {},
        formularioDetectado: null,
        progreso: { current: 0, total: 100, percentage: 0 },
        
        // Formularios disponibles
        formulariosDisponibles: []
    })

    // Computed para verificar si hay error de API
    const hayErrorAPI = computed(() => {
        return formsAPI.error.value !== null
    })

    // Computed para verificar si está cargando
    const estaCargando = computed(() => {
        return formsAPI.loading.value || aiAssistant.isLoading.value
    })

    // Función para agregar mensaje con animación de escritura
    const agregarMensajeConCallback = (contenido, callback, esBot = true, tipo = 'texto') => {
        if (esBot) {
            chatState.botEscribiendo = true
            const tiempoEscritura = Math.min(Math.max(contenido.length * 30, 800), 2500)
            
            setTimeout(() => {
                chatState.mensajes.push({
                    id: Date.now(),
                    contenido,
                    esBot,
                    tipo,
                    timestamp: new Date()
                })
                chatState.botEscribiendo = false
                
                // Scroll automático y callback
                setTimeout(() => {
                    scrollToBottom()
                    if (callback) callback()
                }, 100)
            }, tiempoEscritura)
        } else {
            chatState.mensajes.push({
                id: Date.now(),
                contenido,
                esBot,
                tipo,
                timestamp: new Date()
            })
            if (callback) callback()
        }
    }

    // Función para scroll automático
    const scrollToBottom = () => {
        nextTick(() => {
            const chatContainer = document.querySelector('.sectionMessages')
            if (chatContainer) {
                const scrollTarget = chatContainer.scrollHeight + 100
                chatContainer.scrollTo({
                    top: scrollTarget,
                    behavior: 'smooth'
                })
            }
        })
    }

    // Inicializar conversación
    const iniciarConversacion = async () => {
        // Cargar formularios disponibles
        await cargarFormulariosDisponibles()
        
        // Verificar configuración de IA
        if (!aiAssistant.isAIConfigured()) {
            console.warn('IA no configurada, usando modo fallback')
            chatState.modoIA = false
        }
        
        // Resetear contexto de IA
        aiAssistant.resetContext()
        
        // Mensaje de bienvenida
        agregarMensajeConCallback(
            chatState.mensajeBienvenida,
            () => {
                // Segundo mensaje explicativo
                setTimeout(() => {
                    const mensajeExplicativo = chatState.modoIA ? 
                        'Puedes contarme lo que tienes en mente de manera natural. Por ejemplo: "Quiero un tatuaje pequeño en el brazo" o "Me interesa hacerme un piercing en la oreja".' :
                        'Te ayudaré siguiendo un proceso estructurado para obtener toda la información necesaria.'
                    
                    agregarMensajeConCallback(
                        mensajeExplicativo,
                        () => {
                            // Preguntar el nombre
                            setTimeout(() => {
                                agregarMensajeConCallback(
                                    '¿Cómo te gustaría que te llame?',
                                    () => {
                                        chatState.etapaActual = 'nombre'
                                        chatState.esperandoInput = true
                                        chatState.tipoInputActual = 'text'
                                    }
                                )
                            }, 1000)
                        }
                    )
                }, 1500)
            }
        )
    }

    // Cargar formularios disponibles desde la API
    const cargarFormulariosDisponibles = async () => {
        try {
            await formsAPI.fetchAllForms()
            if (formsAPI.forms.value) {
                chatState.formulariosDisponibles = formsAPI.forms.value
                console.log('Formularios cargados para IA:', chatState.formulariosDisponibles.length)
            }
        } catch (error) {
            console.error('Error cargando formularios:', error)
        }
    }

    // Procesar respuesta del usuario
    const procesarRespuesta = async (respuesta) => {
        if (!respuesta.trim()) return

        // Agregar mensaje del usuario
        chatState.mensajes.push({
            id: Date.now(),
            contenido: respuesta.trim(),
            esBot: false,
            timestamp: new Date()
        })

        // Limpiar input
        chatState.inputValue = ''
        chatState.esperandoInput = false

        // Procesar según etapa
        if (chatState.etapaActual === 'nombre') {
            await procesarNombre(respuesta.trim())
        } else if (chatState.etapaActual === 'conversacion') {
            await procesarConversacionIA(respuesta.trim())
        }

        scrollToBottom()
    }

    // Procesar nombre del usuario
    const procesarNombre = async (nombre) => {
        chatState.nombreUsuario = nombre
        
        agregarMensajeConCallback(
            `¡Perfecto, ${nombre}! 😊`,
            () => {
                setTimeout(() => {
                    if (chatState.modoIA) {
                        // Modo IA: conversación libre
                        agregarMensajeConCallback(
                            'Ahora cuéntame, ¿qué tipo de servicio te interesa? Puedes describirme tu idea como quieras.',
                            () => {
                                chatState.etapaActual = 'conversacion'
                                chatState.esperandoInput = true
                                chatState.tipoInputActual = 'text'
                            }
                        )
                    } else {
                        // Modo tradicional: selección de servicio
                        iniciarSeleccionServicio()
                    }
                }, 1000)
            }
        )
    }

    // Procesar conversación con IA
    const procesarConversacionIA = async (mensaje) => {
        try {
            // Procesar mensaje con IA
            const result = await aiAssistant.processMessageWithAI(mensaje, chatState.formulariosDisponibles)
            
            // Actualizar datos recopilados
            if (result.extractedData) {
                Object.assign(chatState.datosRecopilados, result.extractedData.extractedData || {})
                
                // Detectar tipo de formulario
                if (result.extractedData.serviceType && result.extractedData.serviceType !== 'unknown') {
                    chatState.formularioDetectado = result.extractedData.serviceType
                }
                
                // Actualizar progreso
                chatState.progreso.percentage = result.extractedData.completionPercentage || 0
                
                console.log('Datos recopilados:', chatState.datosRecopilados)
                console.log('Formulario detectado:', chatState.formularioDetectado)
            }
            
            // Responder con mensaje de IA
            agregarMensajeConCallback(
                result.message,
                () => {
                    // Verificar si necesitamos más información
                    if (result.extractedData && result.extractedData.completionPercentage >= 80) {
                        // Suficiente información, ofrecer completar
                        setTimeout(() => {
                            agregarMensajeConCallback(
                                '¡Excelente! Creo que tengo suficiente información. ¿Te gustaría revisar el resumen y proceder con la cotización?',
                                () => {
                                    mostrarResumenDatos()
                                }
                            )
                        }, 1500)
                    } else {
                        // Continuar conversación
                        setTimeout(() => {
                            chatState.esperandoInput = true
                            chatState.tipoInputActual = 'text'
                        }, 500)
                    }
                }
            )
            
        } catch (error) {
            console.error('Error procesando con IA:', error)
            
            // Respuesta de fallback
            agregarMensajeConCallback(
                'Disculpa, tuve un pequeño problema. ¿Podrías contarme más detalles sobre lo que buscas?',
                () => {
                    setTimeout(() => {
                        chatState.esperandoInput = true
                        chatState.tipoInputActual = 'text'
                    }, 500)
                }
            )
        }
    }

    // Mostrar resumen de datos recopilados
    const mostrarResumenDatos = () => {
        const resumen = aiAssistant.generateDataSummary()
        
        let resumenTexto = `📋 <strong>Resumen de tu solicitud:</strong><br><br>`
        
        // Tipo de servicio
        if (resumen.serviceType) {
            resumenTexto += `🎯 <strong>Servicio:</strong> ${resumen.serviceType}<br>`
        }
        
        // Datos recopilados
        Object.entries(resumen.collectedData).forEach(([key, value]) => {
            resumenTexto += `• <strong>${key}:</strong> ${value}<br>`
        })
        
        resumenTexto += `<br>📊 <strong>Información completada:</strong> ${resumen.completionPercentage}%`
        
        agregarMensajeConCallback(
            resumenTexto,
            () => {
                setTimeout(() => {
                    agregarMensajeConCallback(
                        '¿Todo se ve correcto? ¿Te gustaría agregar algo más o proceder con la cotización?',
                        () => {
                            chatState.etapaActual = 'completado'
                            chatState.esperandoInput = true
                            chatState.tipoInputActual = 'text'
                        }
                    )
                }, 1000)
            }
        )
    }

    // Iniciar selección de servicio (modo tradicional)
    const iniciarSeleccionServicio = () => {
        agregarMensajeConCallback(
            '¿Qué tipo de servicio te interesa?',
            () => {
                chatState.etapaActual = 'servicio'
                chatState.esperandoInput = true
                chatState.tipoInputActual = 'radio'
                chatState.opciones = services.map(service => service.services_name)
            }
        )
    }

    // Enviar solicitud final
    const enviarSolicitud = async () => {
        console.log('Enviando solicitud con datos:', chatState.datosRecopilados)
        
        agregarMensajeConCallback(
            '¡Perfecto! He enviado tu solicitud. Te contactaremos pronto con una cotización personalizada. 🎉',
            () => {
                setTimeout(() => {
                    agregarMensajeConCallback(
                        '¿Hay algo más en lo que pueda ayudarte?',
                        () => {
                            // Reiniciar para nueva conversación
                            setTimeout(() => {
                                reiniciarChat()
                            }, 3000)
                        }
                    )
                }, 1000)
            }
        )
    }

    // Reiniciar chat
    const reiniciarChat = () => {
        chatState.etapaActual = 'saludo'
        chatState.esperandoInput = false
        chatState.datosRecopilados = {}
        chatState.formularioDetectado = null
        chatState.progreso = { current: 0, total: 100, percentage: 0 }
        aiAssistant.resetContext()
        
        setTimeout(() => {
            iniciarConversacion()
        }, 1000)
    }

    // Función para cambiar entre modo IA y tradicional
    const toggleModoIA = () => {
        chatState.modoIA = !chatState.modoIA
        console.log('Modo IA:', chatState.modoIA ? 'Activado' : 'Desactivado')
    }

    // Manejar cambio en input
    const manejarCambioInput = (valor) => {
        chatState.inputValue = valor
    }

    return {
        // Estado
        chatState,
        hayErrorAPI,
        estaCargando,
        formsAPI,
        
        // Funciones principales
        iniciarConversacion,
        procesarRespuesta,
        enviarSolicitud,
        manejarCambioInput,
        
        // Utilidades
        toggleModoIA,
        reiniciarChat,
        scrollToBottom
    }
}