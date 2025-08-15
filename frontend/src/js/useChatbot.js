import { ref, reactive, computed, nextTick } from 'vue'
import { services } from '/src/data/services.js'

export function useChatbot() {
  // Estado del chatbot
  const chatState = reactive({
    // Configuración (desde ConfigAssistant)
    nombreAsistente: 'Lola',
    mensajeBienvenida: 'Vamos a comenzar a recopilar la información para realizar tu cotización del servicio.',
    nombreNegocio: 'InkValuation',
    
    // Usuario
    nombreUsuario: '',
    servicioSeleccionado: null,
    formularioActual: null,
    
    // Flujo
    etapaActual: 'saludo', // saludo, nombre, servicio, formulario, completado
    respuestasFormulario: {},
    preguntaActual: 0,
    
    // UI
    mensajes: [],
    esperandoInput: false,
    tipoInputActual: 'text',
    inputValue: '',
    opciones: [],
    
    // Estado de escritura
    botEscribiendo: false
  })

  // Formularios mock (expandir cuando se integre con Forms.vue)
  const formulariosPorServicio = {
    1: { // Tatuaje
      id: 1,
      title: 'Formulario de Tatuaje',
      preguntas: [
        {
          id: 1,
          texto: '¿Qué tamaño deseas para tu tatuaje?',
          tipo: 'radio',
          opciones: ['Pequeño', 'Mediano', 'Grande'],
          requerido: true
        },
        {
          id: 2,
          texto: '¿En qué zona del cuerpo te lo quieres hacer?',
          tipo: 'radio',
          opciones: ['Brazo', 'Pierna', 'Espalda', 'Torso', 'Otro'],
          requerido: true
        },
        {
          id: 3,
          texto: '¿Qué colores prefieres?',
          tipo: 'radio',
          opciones: ['Solo negro', 'Negro y gris', 'A color'],
          requerido: true
        },
        {
          id: 4,
          texto: 'Describe tu idea o sube una imagen de referencia',
          tipo: 'textarea',
          requerido: false
        }
      ]
    },
    2: { // Piercing
      id: 2,
      title: 'Formulario de Piercing',
      preguntas: [
        {
          id: 1,
          texto: '¿Qué tipo de piercing deseas?',
          tipo: 'radio',
          opciones: ['Oreja', 'Nariz', 'Labio', 'Ceja', 'Lengua', 'Ombligo', 'Otro'],
          requerido: true
        },
        {
          id: 2,
          texto: '¿Es tu primer piercing?',
          tipo: 'radio',
          opciones: ['Sí, es mi primero', 'No, ya tengo otros'],
          requerido: true
        },
        {
          id: 3,
          texto: '¿Tienes alguna alergia conocida a metales?',
          tipo: 'radio',
          opciones: ['No tengo alergias', 'Sí, soy alérgico/a', 'No estoy seguro/a'],
          requerido: true
        }
      ]
    }
  }

  // Función para agregar mensaje con indicador de escritura
  const agregarMensaje = (contenido, esBot = true, tipo = 'texto') => {
    if (esBot) {
      // Simular que el bot está escribiendo
      chatState.botEscribiendo = true
      
      // Simular tiempo de escritura (proporcional al texto)
      const tiempoEscritura = Math.min(Math.max(contenido.length * 30, 800), 2500)
      
      setTimeout(() => {
        chatState.mensajes.push({
          id: Date.now(),
          contenido,
          esBot,
          tipo,
          timestamp: new Date()
        })
        
        // Dejar de escribir
        chatState.botEscribiendo = false
        
        // Scroll automático
        nextTick(() => {
          scrollToBottom()
        })
      }, tiempoEscritura)
    } else {
      // Mensaje del usuario - inmediato
      chatState.mensajes.push({
        id: Date.now(),
        contenido,
        esBot,
        tipo,
        timestamp: new Date()
      })
      
      // Scroll automático
      nextTick(() => {
        scrollToBottom()
      })
    }
  }

  // Función para agregar mensaje con callback - ejecuta el callback solo después de que el mensaje se muestre
  const agregarMensajeConCallback = (contenido, callback, esBot = true, tipo = 'texto') => {
    if (esBot) {
      // Simular que el bot está escribiendo
      chatState.botEscribiendo = true
      
      // Simular tiempo de escritura (proporcional al texto)
      const tiempoEscritura = Math.min(Math.max(contenido.length * 30, 800), 2500)
      
      setTimeout(() => {
        chatState.mensajes.push({
          id: Date.now(),
          contenido,
          esBot,
          tipo,
          timestamp: new Date()
        })
        
        // Dejar de escribir
        chatState.botEscribiendo = false
        
        // Scroll automático y ejecutar callback
        nextTick(() => {
          scrollToBottom()
          // Ejecutar el callback después de que el mensaje se haya mostrado
          if (callback && typeof callback === 'function') {
            setTimeout(callback, 200) // Pequeño delay para asegurar que se vea el mensaje
          }
        })
      }, tiempoEscritura)
    } else {
      // Mensaje del usuario - inmediato
      chatState.mensajes.push({
        id: Date.now(),
        contenido,
        esBot,
        tipo,
        timestamp: new Date()
      })
      
      // Scroll automático y callback inmediato
      nextTick(() => {
        scrollToBottom()
        if (callback && typeof callback === 'function') {
          callback()
        }
      })
    }
  }

  // Función para scroll al final
  const scrollToBottom = () => {
    const chatContainer = document.querySelector('.sectionMessages')
    if (chatContainer) {
      // Verificar que no hay inputs visibles antes de hacer scroll
      const inputsVisible = document.querySelector('.listChat') || 
                           document.querySelector('.textareaContainer') || 
                           document.querySelector('.inputNameChat')
      
      // Si hay inputs visibles, esperar más tiempo
      const delay = inputsVisible ? 300 : 0
      
      setTimeout(() => {
        // Scroll agresivo con margen extra
        const scrollTarget = chatContainer.scrollHeight + 150
        chatContainer.scrollTo({
          top: scrollTarget,
          behavior: 'smooth'
        })
        
        // Verificación adicional después de un momento
        setTimeout(() => {
          chatContainer.scrollTo({
            top: chatContainer.scrollHeight + 150,
            behavior: 'smooth'
          })
        }, 200)
      }, delay)
    }
  }

  // Iniciar conversación
  const iniciarConversacion = () => {
    // Limpiar estado
    chatState.mensajes = []
    chatState.etapaActual = 'saludo'
    chatState.nombreUsuario = ''
    chatState.servicioSeleccionado = null
    chatState.respuestasFormulario = {}
    chatState.botEscribiendo = false
    
    // Mensaje de saludo
    setTimeout(() => {
      agregarMensaje(
        `¡Hola! Soy ${chatState.nombreAsistente}, asistente de ${chatState.nombreNegocio}.`
      )
      
      setTimeout(() => {
        agregarMensaje(chatState.mensajeBienvenida)
        setTimeout(() => {
          preguntarNombre()
        }, 2000)
      }, 3000)
    }, 1000)
  }

  // Preguntar nombre
  const preguntarNombre = () => {
    chatState.etapaActual = 'nombre'
    agregarMensajeConCallback('¿Cuál es tu nombre?', () => {
      mostrarInput('text')
    })
  }

  // Preguntar servicio
  const preguntarServicio = () => {
    chatState.etapaActual = 'servicio'
    const serviciosDisponibles = services.map(service => service.services_name)
    
    agregarMensajeConCallback(`${chatState.nombreUsuario}, ¿qué servicio deseas realizarte?`, () => {
      mostrarOpciones(serviciosDisponibles)
    })
  }

  // Iniciar formulario
  const iniciarFormulario = () => {
    chatState.etapaActual = 'formulario'
    const servicioId = chatState.servicioSeleccionado?.id || 1
    chatState.formularioActual = formulariosPorServicio[servicioId]
    chatState.preguntaActual = 0
    
    if (chatState.formularioActual) {
      agregarMensaje(`Perfecto! Ahora voy a hacerte algunas preguntas sobre tu ${chatState.servicioSeleccionado?.nombre.toLowerCase() || 'servicio'}.`)
      setTimeout(() => {
        hacerPreguntaFormulario()
      }, 1000)
    }
  }

  // Hacer pregunta del formulario
  const hacerPreguntaFormulario = () => {
    const pregunta = chatState.formularioActual.preguntas[chatState.preguntaActual]
    if (!pregunta) {
      completarFormulario()
      return
    }

    agregarMensajeConCallback(pregunta.texto, () => {
      if (pregunta.tipo === 'radio') {
        mostrarOpciones(pregunta.opciones)
      } else if (pregunta.tipo === 'textarea') {
        mostrarInput('textarea')
      } else {
        mostrarInput('text')
      }
    })
  }

  // Completar formulario
  const completarFormulario = () => {
    chatState.etapaActual = 'completado'
    agregarMensaje('¡Perfecto! He recopilado toda la información necesaria.')
    setTimeout(() => {
      agregarMensaje('Puedes revisar la información y enviar tu solicitud de cotización cuando estés listo.')
      
      // Aquí se enviaría al backend
      console.log('Datos recopilados:', {
        nombre: chatState.nombreUsuario,
        servicio: chatState.servicioSeleccionado,
        respuestas: chatState.respuestasFormulario
      })
    }, 1500)
  }

  // Enviar solicitud final
  const enviarSolicitud = () => {
    agregarMensaje('Enviando solicitud de cotización...', true)
    
    // Simular envío
    setTimeout(() => {
      agregarMensaje('¡Tu solicitud ha sido enviada exitosamente! Recibirás tu cotización pronto.')
      chatState.etapaActual = 'enviado'
    }, 2000)
  }

  // Mostrar input
  const mostrarInput = (tipo = 'text') => {
    chatState.esperandoInput = true
    chatState.tipoInputActual = tipo
    chatState.inputValue = ''
    chatState.opciones = []
  }

  // Mostrar opciones
  const mostrarOpciones = (opciones) => {
    chatState.esperandoInput = true
    chatState.tipoInputActual = 'radio'
    chatState.opciones = opciones
  }

  // Procesar respuesta
  const procesarRespuesta = (respuesta) => {
    // Agregar respuesta del usuario
    agregarMensaje(respuesta, false)
    
    // Ocultar input
    chatState.esperandoInput = false
    
    // Scroll después de ocultar inputs - con múltiples nextTick para asegurar renderizado completo
    nextTick(() => {
      nextTick(() => {
        setTimeout(() => {
          scrollToBottom()
        }, 500) // Delay mayor para asegurar que Vue termine de renderizar
      })
    })
    
    // Procesar según etapa
    setTimeout(() => {
      switch (chatState.etapaActual) {
        case 'nombre':
          chatState.nombreUsuario = respuesta
          preguntarServicio()
          break
          
        case 'servicio':
          const servicioEncontrado = services.find(s => s.services_name === respuesta)
          chatState.servicioSeleccionado = {
            id: servicioEncontrado?.id || 1,
            nombre: respuesta
          }
          iniciarFormulario()
          break
          
        case 'formulario':
          const pregunta = chatState.formularioActual.preguntas[chatState.preguntaActual]
          chatState.respuestasFormulario[pregunta.id] = respuesta
          chatState.preguntaActual++
          
          setTimeout(() => {
            hacerPreguntaFormulario()
          }, 800)
          break
      }
    }, 500)
  }

  // Auto-procesamiento para inputs de texto
  let timeoutId = null
  const manejarCambioInput = (valor) => {
    chatState.inputValue = valor
    
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    
    if (valor.trim().length > 0) {
      timeoutId = setTimeout(() => {
        procesarRespuesta(valor.trim())
      }, 1000) // 1 segundo después de la última tecla
    }
  }

  return {
    chatState,
    iniciarConversacion,
    procesarRespuesta,
    manejarCambioInput,
    enviarSolicitud,
    agregarMensajeConCallback
  }
}