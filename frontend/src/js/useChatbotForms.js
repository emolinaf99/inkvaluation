import { ref, reactive, computed, nextTick } from 'vue'
import { useFormsAPI } from './useFormsAPI.js'
import { services } from '/src/data/services.js'

export function useChatbotForms() {
  const formsAPI = useFormsAPI()
  
  // Estado del chatbot
  const chatState = reactive({
    // Configuración (desde ConfigAssistant)
    nombreAsistente: 'Lola',
    mensajeBienvenida: 'Vamos a comenzar a recopilar la información para realizar tu cotización del servicio.',
    nombreNegocio: 'InkValuation',
    
    // Usuario
    nombreUsuario: '',
    servicioSeleccionado: null,
    
    // Flujo
    etapaActual: 'saludo', // saludo, nombre, servicio, formulario, completado
    
    // UI
    mensajes: [],
    esperandoInput: false,
    tipoInputActual: 'text',
    inputValue: '',
    opciones: [],
    opcionesConImagenes: [], // Para opciones que incluyen imágenes
    
    // Estado de escritura
    botEscribiendo: false,
    
    // Formulario dinámico
    formularioActivo: false,
    preguntaActual: null,
    progreso: { current: 0, total: 0, percentage: 0 }
  })

  // Función para agregar mensaje con callback
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
        
        nextTick(() => {
          scrollToBottom()
          if (callback && typeof callback === 'function') {
            setTimeout(callback, 200)
          }
        })
      }, tiempoEscritura)
    } else {
      chatState.mensajes.push({
        id: Date.now(),
        contenido,
        esBot,
        tipo,
        timestamp: new Date()
      })
      
      nextTick(() => {
        scrollToBottom()
        if (callback && typeof callback === 'function') {
          callback()
        }
      })
    }
  }

  // Función para agregar mensaje simple
  const agregarMensaje = (contenido, esBot = true, tipo = 'texto') => {
    agregarMensajeConCallback(contenido, null, esBot, tipo)
  }

  // Función para scroll al final
  const scrollToBottom = () => {
    const chatContainer = document.querySelector('.sectionMessages')
    if (chatContainer) {
      setTimeout(() => {
        chatContainer.scrollTo({
          top: chatContainer.scrollHeight + 150,
          behavior: 'smooth'
        })
      }, 100)
    }
  }

  // Iniciar conversación
  const iniciarConversacion = () => {
    chatState.mensajes = []
    chatState.etapaActual = 'saludo'
    chatState.nombreUsuario = ''
    chatState.servicioSeleccionado = null
    chatState.botEscribiendo = false
    chatState.formularioActivo = false
    
    formsAPI.resetForm()
    
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

  // Formularios estáticos de fallback
  const formulariosFallback = {
    1: { // Tatuaje
      titulo: 'Cotización de Tatuaje',
      preguntas: [
        {
          texto: '¿Qué tamaño deseas para tu tatuaje?',
          tipo: 'radio',
          opciones: ['Pequeño (hasta 5cm)', 'Mediano (5-15cm)', 'Grande (15-30cm)', 'Extra Grande (más de 30cm)']
        },
        {
          texto: '¿En qué parte del cuerpo te lo harías?',
          tipo: 'radio',
          opciones: ['Brazo', 'Pierna', 'Espalda', 'Pecho', 'Otro']
        },
        {
          texto: '¿Tienes algún diseño en mente o necesitas ayuda con el diseño?',
          tipo: 'textarea',
          placeholder: 'Describe tu idea o dinos si necesitas ayuda con el diseño...'
        }
      ]
    },
    2: { // Piercing
      titulo: 'Cotización de Piercing',
      preguntas: [
        {
          texto: '¿Qué tipo de piercing deseas?',
          tipo: 'radio',
          opciones: ['Oreja', 'Nariz', 'Ombligo', 'Labio', 'Ceja', 'Otro']
        },
        {
          texto: '¿Has tenido piercings antes?',
          tipo: 'radio',
          opciones: ['Sí, varios', 'Sí, algunos', 'Este sería mi primero']
        },
        {
          texto: '¿Tienes alguna pregunta sobre el cuidado post-piercing?',
          tipo: 'textarea',
          placeholder: 'Cuéntanos tus dudas o si necesitas información sobre cuidados...'
        }
      ]
    }
  }

  // Iniciar formulario dinámico
  const iniciarFormularioDinamico = async () => {
    chatState.etapaActual = 'formulario'
    chatState.formularioActivo = true
    
    const servicioId = chatState.servicioSeleccionado?.id
    
    if (!servicioId) {
      agregarMensaje('Error: No se pudo identificar el servicio seleccionado.')
      return
    }
    
    try {
      agregarMensaje(`Perfecto! Ahora voy a hacerte algunas preguntas sobre tu ${chatState.servicioSeleccionado?.nombre.toLowerCase() || 'servicio'}.`)
      
      // Intentar obtener formularios de la API
      console.log('Intentando obtener formularios de la API para servicio:', servicioId)
      const formularios = await formsAPI.getFormsByService(servicioId)
      
      if (formularios && formularios.length > 0) {
        console.log('Formularios obtenidos de la API:', formularios)
        
        // Seleccionar el último formulario (más reciente)
        let formularioSeleccionado
        if (Array.isArray(formularios)) {
          // Si hay múltiples formularios, tomar el último
          formularioSeleccionado = formularios[formularios.length - 1]
          if (formularios.length > 1) {
            console.log(`Se encontraron ${formularios.length} formularios. Seleccionando el último:`, formularioSeleccionado)
            agregarMensaje('(Usando la versión más reciente del formulario)')
          }
        } else {
          formularioSeleccionado = formularios
        }
        
        const formData = await formsAPI.startForm(formularioSeleccionado.id)
        
        if (formData && formData.question) {
          setTimeout(() => {
            mostrarPreguntaDinamica(formData.question, formData.options)
          }, 1500)
          return
        }
      }
      
      // Si llegamos aquí, usar formulario de fallback
      throw new Error('API no disponible')
      
    } catch (error) {
      console.warn('Error al obtener formularios de API, usando formulario estático:', error)
      
      // Usar formulario estático de fallback
      setTimeout(() => {
        iniciarFormularioEstatico(servicioId)
      }, 1500)
    }
  }

  // Iniciar formulario estático (fallback)
  const iniciarFormularioEstatico = (servicioId) => {
    const formulario = formulariosFallback[servicioId]
    
    if (!formulario) {
      agregarMensaje('Lo siento, no tengo preguntas disponibles para este servicio.')
      return
    }

    agregarMensaje('(Usando formulario estático debido a problemas con el servidor)')
    
    // Configurar estado para formulario estático
    chatState.formularioActual = {
      tipo: 'estatico',
      titulo: formulario.titulo,
      preguntas: formulario.preguntas,
      respuestas: {}
    }
    chatState.preguntaActual = 0
    chatState.progreso = {
      current: 1,
      total: formulario.preguntas.length,
      percentage: Math.round((1 / formulario.preguntas.length) * 100)
    }

    // Mostrar primera pregunta
    setTimeout(() => {
      mostrarPreguntaEstatica(0)
    }, 1000)
  }

  // Mostrar pregunta estática
  const mostrarPreguntaEstatica = (indicePregunta) => {
    const pregunta = chatState.formularioActual.preguntas[indicePregunta]
    
    if (!pregunta) {
      completarFormularioEstatico()
      return
    }

    agregarMensajeConCallback(pregunta.texto, () => {
      if (pregunta.tipo === 'text' || pregunta.tipo === 'textarea') {
        mostrarInput(pregunta.tipo)
      } else {
        mostrarOpciones(pregunta.opciones)
      }
    })
  }

  // Procesar respuesta de formulario estático
  const procesarRespuestaEstatica = (respuesta) => {
    const indicePreguntaActual = chatState.preguntaActual
    
    // Guardar respuesta
    chatState.formularioActual.respuestas[indicePreguntaActual] = respuesta
    
    // Avanzar a siguiente pregunta
    const siguientePregunta = indicePreguntaActual + 1
    chatState.preguntaActual = siguientePregunta
    
    // Actualizar progreso
    chatState.progreso = {
      current: siguientePregunta + 1,
      total: chatState.formularioActual.preguntas.length,
      percentage: Math.round(((siguientePregunta + 1) / chatState.formularioActual.preguntas.length) * 100)
    }
    
    // Mostrar siguiente pregunta o completar
    setTimeout(() => {
      if (siguientePregunta < chatState.formularioActual.preguntas.length) {
        mostrarPreguntaEstatica(siguientePregunta)
      } else {
        completarFormularioEstatico()
      }
    }, 1000)
  }

  // Completar formulario estático
  const completarFormularioEstatico = () => {
    chatState.etapaActual = 'completado'
    chatState.formularioActivo = false
    
    agregarMensaje('¡Perfecto! He recopilado toda la información necesaria.')
    setTimeout(() => {
      agregarMensaje('Puedes revisar la información y enviar tu solicitud de cotización cuando estés listo.')
      
      console.log('Formulario estático completado:', {
        usuario: chatState.nombreUsuario,
        servicio: chatState.servicioSeleccionado,
        formulario: chatState.formularioActual
      })
    }, 1500)
  }

  // Mostrar pregunta dinámica
  const mostrarPreguntaDinamica = (pregunta, opciones) => {
    chatState.preguntaActual = pregunta
    
    // Actualizar progreso
    formsAPI.getFormProgress().then(progreso => {
      chatState.progreso = progreso
    })
    
    agregarMensajeConCallback(pregunta.text || pregunta.question, () => {
      if (pregunta.type === 'text' || pregunta.type === 'textarea') {
        mostrarInput(pregunta.type)
      } else {
        // Verificar si las opciones tienen imágenes
        const opcionesConImagenes = opciones.filter(opcion => opcion.image_url)
        
        if (opcionesConImagenes.length > 0) {
          mostrarOpcionesConImagenes(opciones)
        } else {
          mostrarOpciones(opciones.map(opcion => opcion.text || opcion.label))
        }
      }
    })
  }

  // Procesar respuesta de formulario dinámico
  const procesarRespuestaFormulario = async (respuesta, opcionId = null) => {
    try {
      // Si es respuesta de texto, buscar la opción correspondiente
      if (!opcionId && typeof respuesta === 'string') {
        const opciones = formsAPI.options.value
        const opcionEncontrada = opciones.find(op => 
          (op.text || op.label) === respuesta
        )
        opcionId = opcionEncontrada?.id
      }
      
      if (!opcionId) {
        throw new Error('No se pudo identificar la opción seleccionada')
      }
      
      // Procesar selección en la API
      const resultado = await formsAPI.processOptionSelection(opcionId, 
        chatState.preguntaActual?.type === 'text' || chatState.preguntaActual?.type === 'textarea' ? respuesta : null
      )
      
      if (resultado.isComplete) {
        // Formulario completado
        completarFormularioDinamico()
      } else if (resultado.question) {
        // Mostrar siguiente pregunta
        setTimeout(() => {
          mostrarPreguntaDinamica(resultado.question, resultado.options)
        }, 1000)
      } else {
        agregarMensaje('Error al procesar la respuesta. Inténtalo de nuevo.')
      }
      
    } catch (error) {
      console.error('Error al procesar respuesta:', error)
      agregarMensaje('Lo siento, hubo un error al procesar tu respuesta. ¿Puedes intentarlo de nuevo?')
    }
  }

  // Completar formulario dinámico
  const completarFormularioDinamico = async () => {
    chatState.etapaActual = 'completado'
    chatState.formularioActivo = false
    
    try {
      // Enviar formulario a la API
      const resultado = await formsAPI.submitForm(formsAPI.formState.currentFormId)
      
      agregarMensaje('¡Perfecto! He recopilado toda la información necesaria.')
      setTimeout(() => {
        agregarMensaje('Puedes revisar la información y enviar tu solicitud de cotización cuando estés listo.')
        
        console.log('Formulario dinámico completado:', {
          usuario: chatState.nombreUsuario,
          servicio: chatState.servicioSeleccionado,
          formulario: formsAPI.formState,
          resultado: resultado
        })
      }, 1500)
      
    } catch (error) {
      console.error('Error al completar formulario:', error)
      agregarMensaje('El formulario se completó pero hubo un error al enviarlo. Los datos se guardaron localmente.')
    }
  }

  // Mostrar input
  const mostrarInput = (tipo = 'text') => {
    chatState.esperandoInput = true
    chatState.tipoInputActual = tipo
    chatState.inputValue = ''
    chatState.opciones = []
    chatState.opcionesConImagenes = []
  }

  // Mostrar opciones simples
  const mostrarOpciones = (opciones) => {
    chatState.esperandoInput = true
    chatState.tipoInputActual = 'radio'
    chatState.opciones = opciones
    chatState.opcionesConImagenes = []
  }

  // Mostrar opciones con imágenes
  const mostrarOpcionesConImagenes = (opciones) => {
    chatState.esperandoInput = true
    chatState.tipoInputActual = 'opciones-imagenes'
    chatState.opciones = []
    chatState.opcionesConImagenes = opciones
  }

  // Procesar respuesta
  const procesarRespuesta = (respuesta) => {
    agregarMensaje(respuesta, false)
    chatState.esperandoInput = false
    
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
          iniciarFormularioDinamico()
          break
          
        case 'formulario':
          if (chatState.formularioActivo) {
            // Verificar si es formulario dinámico o estático
            if (chatState.formularioActual && chatState.formularioActual.tipo === 'estatico') {
              procesarRespuestaEstatica(respuesta)
            } else {
              procesarRespuestaFormulario(respuesta)
            }
          }
          break
      }
    }, 500)
  }

  // Procesar selección de opción con imagen
  const procesarOpcionImagen = (opcion) => {
    const contenido = opcion.text || opcion.label || 'Opción seleccionada'
    agregarMensaje(contenido, false)
    chatState.esperandoInput = false
    
    setTimeout(() => {
      if (chatState.etapaActual === 'formulario' && chatState.formularioActivo) {
        procesarRespuestaFormulario(contenido, opcion.id)
      }
    }, 500)
  }

  // Enviar solicitud final
  const enviarSolicitud = async () => {
    agregarMensaje('Enviando solicitud de cotización...', true)
    
    try {
      // Aquí se enviaría la solicitud final al backend
      setTimeout(() => {
        agregarMensaje('¡Tu solicitud ha sido enviada exitosamente! Recibirás tu cotización pronto.')
        chatState.etapaActual = 'enviado'
      }, 2000)
      
    } catch (error) {
      agregarMensaje('Hubo un error al enviar la solicitud. Por favor, inténtalo de nuevo.')
    }
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
      }, 1000)
    }
  }

  // Función para retroceder en el flujo (para edición)
  const retrocederEtapa = () => {
    switch (chatState.etapaActual) {
      case 'servicio':
        chatState.etapaActual = 'nombre'
        break
      case 'formulario':
        chatState.etapaActual = 'servicio'
        chatState.formularioActivo = false
        formsAPI.resetForm()
        break
      case 'completado':
        chatState.etapaActual = 'formulario'
        chatState.formularioActivo = true
        break
    }
  }

  // Computed para verificar si hay errores de API
  const hayErrorAPI = computed(() => {
    return formsAPI.error.value !== null
  })

  // Computed para verificar si está cargando
  const estaCargando = computed(() => {
    return formsAPI.loading.value
  })

  return {
    chatState,
    formsAPI,
    
    // Métodos principales
    iniciarConversacion,
    procesarRespuesta,
    procesarOpcionImagen,
    manejarCambioInput,
    enviarSolicitud,
    retrocederEtapa,
    
    // Estados computados
    hayErrorAPI,
    estaCargando,
    
    // Funciones auxiliares
    agregarMensaje,
    agregarMensajeConCallback,
    scrollToBottom
  }
}