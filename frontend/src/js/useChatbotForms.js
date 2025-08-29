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
    respuestasCheckbox: [], // Para selecciones múltiples en checkboxes
    archivoSeleccionado: null, // Para carga de archivos
    
    // Estado de escritura
    botEscribiendo: false,
    
    // Formulario dinámico
    formularioActivo: false,
    preguntaActual: null,
    progreso: { current: 0, total: 0, percentage: 0 },
    
    // Estado de edición
    modoEdicion: false
  })

  // Función para agregar mensaje con callback
  const agregarMensajeConCallback = (contenido, callback, esBot = true, tipo = 'texto', metadata = null) => {
    if (esBot) {
      chatState.botEscribiendo = true
      const tiempoEscritura = Math.min(Math.max(contenido.length * 30, 800), 2500)
      
      setTimeout(() => {
        chatState.mensajes.push({
          id: Date.now(),
          contenido,
          esBot,
          tipo,
          timestamp: new Date(),
          ...(metadata && { metadata })
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
        timestamp: new Date(),
        ...(metadata && { metadata })
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
  const agregarMensaje = (contenido, esBot = true, tipo = 'texto', metadata = null) => {
    agregarMensajeConCallback(contenido, null, esBot, tipo, metadata)
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
  const mostrarPreguntaDinamica = async (pregunta, opciones) => {
    chatState.preguntaActual = pregunta
    
    // Actualizar progreso de forma síncrona
    const progreso = await formsAPI.getFormProgress()
    chatState.progreso = progreso
    
    console.log('mostrarPreguntaDinamica - progreso actualizado:', {
      pregunta: pregunta.questionOrder,
      progreso: chatState.progreso
    })
    
    agregarMensajeConCallback(pregunta.text || pregunta.question, () => {
      // Mapear tipo de pregunta API a tipo de input del chat
      const tipoInput = mapearTipoPregunta(pregunta.questionType?.id)
      
      if (tipoInput === 'text' || tipoInput === 'textarea' || tipoInput === 'number' || tipoInput === 'file') {
        mostrarInput(tipoInput)
      } else {
        // Para tipos 1, 2 (checkbox, radio) verificar si tienen imágenes
        // El dropdown (tipo 3) no debe mostrar slider de imágenes
        const esSliderPermitido = [1, 2].includes(pregunta.questionType?.id)
        const opcionesConImagenes = opciones.filter(opcion => opcion.image?.url)
        
        console.log('Debug slider:', {
          questionTypeId: pregunta.questionType?.id,
          tipoInput,
          esSliderPermitido,
          totalOpciones: opciones.length,
          opcionesConImagenes: opcionesConImagenes.length,
          opciones: opciones.map(op => ({ text: op.text, image_url: op.image?.url }))
        })
        
        if (esSliderPermitido && opcionesConImagenes.length > 0) {
          mostrarSliderImagenes(opciones, tipoInput)
        } else if (tipoInput === 'checkbox') {
          mostrarCheckboxes(opciones)
        } else if (tipoInput === 'dropdown') {
          mostrarDropdown(opciones)
        } else {
          mostrarOpciones(opciones.map(opcion => opcion.text || opcion.label), tipoInput)
        }
      }
    })
  }
  
  // Mapear tipos de pregunta de la API a tipos de input del chat
  const mapearTipoPregunta = (questionTypeId) => {
    switch(questionTypeId) {
      case 1: return 'checkbox'      // Casillas de Verificación
      case 2: return 'radio'         // Selección Múltiple  
      case 3: return 'dropdown'      // Menú Desplegable
      case 4: return 'number'        // Número
      case 5: return 'text'          // Respuesta Corta
      case 6: return 'textarea'      // Párrafo
      case 7: return 'file'          // Carga de Archivos
      default: return 'text'
    }
  }

  // Procesar respuesta de formulario dinámico
  const procesarRespuestaFormulario = async (respuesta, opcionId = null) => {
    try {
      // Mostrar indicador de escritura
      chatState.botEscribiendo = true
      
      // Salida temprana para archivos - no necesitan procesamiento de opciones
      if (chatState.tipoInputActual === 'file') {
        console.log('Detectado tipo file - procesamiento directo sin opciones')
        const resultado = await formsAPI.processOptionSelection(null, respuesta)
        
        if (resultado.isComplete) {
          // Formulario completado
          chatState.botEscribiendo = false
          completarFormularioDinamico()
        } else if (resultado.question) {
          // Mostrar siguiente pregunta
          setTimeout(() => {
            chatState.botEscribiendo = false
            mostrarPreguntaDinamica(resultado.question, resultado.options)
          }, 1000)
        } else {
          chatState.botEscribiendo = false
          agregarMensaje('Error al procesar la respuesta. Inténtalo de nuevo.')
        }
        return
      }
      
      // Para preguntas de archivo, no necesitamos buscar opción
      const tipoActual = chatState.preguntaActual?.questionType?.id ? 
        mapearTipoPregunta(chatState.preguntaActual.questionType.id) : 
        chatState.preguntaActual?.type
        
      // Usar chatState.tipoInputActual como fuente de verdad si está disponible y es confiable
      // Especialmente importante para archivos donde tipoActual puede ser incorrecto
      const tipoActualFinal = chatState.tipoInputActual === 'file' ? 'file' : 
                            (chatState.modoEdicion ? chatState.tipoInputActual : tipoActual)
      
      console.log('Tipo actual determinado:', {
        tipoActual,
        tipoInputActual: chatState.tipoInputActual,
        modoEdicion: chatState.modoEdicion,
        tipoActualFinal
      })
      
      // Si es respuesta de texto y no es tipo file/text/textarea, buscar la opción correspondiente
      if (!opcionId && typeof respuesta === 'string' && !['file', 'text', 'textarea', 'number'].includes(tipoActualFinal)) {
        // Determinar qué opciones usar: si hay opciones en metadata las usamos, sino las de la API
        let opciones = formsAPI.options.value
        
        // Si estamos en modo edición y tenemos metadatos, usar esas opciones
        if (chatState.preguntaActual?.metadata?.opciones) {
          opciones = chatState.preguntaActual.metadata.opciones
          console.log('Usando opciones de metadatos para edición:', opciones)
        } else if (chatState.opcionesConImagenes.length > 0) {
          opciones = chatState.opcionesConImagenes
          console.log('Usando opciones de chatState.opcionesConImagenes:', opciones)
        } else if (chatState.opciones.length > 0 && tipoActualFinal === 'radio') {
          // Para radio buttons sin imágenes, crear opciones fake con estructura esperada
          opciones = chatState.opciones.map((opcion, index) => ({
            id: index + 1,
            text: opcion,
            label: opcion
          }))
          console.log('Usando opciones de chatState.opciones convertidas:', opciones)
        }
        
        console.log('Opciones disponibles para búsqueda:', opciones)
        
        // Validar que tenemos opciones válidas
        if (!opciones || opciones.length === 0) {
          console.error('No se encontraron opciones válidas para procesar la respuesta:', respuesta)
          chatState.botEscribiendo = false
          throw new Error('No se encontraron opciones válidas para procesar la respuesta')
        }
        
        // Para checkboxes múltiples, la respuesta puede ser una cadena separada por comas
        if (tipoActualFinal === 'checkbox' && respuesta.includes(', ')) {
          // Dividir las respuestas y buscar cada una
          const respuestas = respuesta.split(', ')
          const opcionesEncontradas = respuestas.map(resp => {
            return opciones.find(op => (op.text || op.label) === resp.trim())
          }).filter(Boolean) // Filtrar opciones no encontradas
          
          console.log('Opciones de checkbox encontradas:', opcionesEncontradas)
          
          // Para múltiples opciones, usar el primer ID encontrado
          if (opcionesEncontradas.length > 0) {
            opcionId = opcionesEncontradas[0].id
            // TODO: En el futuro, manejar múltiples IDs si la API lo soporta
            console.log('Usando opcionId:', opcionId, 'de', opcionesEncontradas.length, 'opciones')
          }
        } else if (tipoActualFinal === 'checkbox') {
          // Checkbox con una sola opción seleccionada
          const opcionEncontrada = opciones.find(op => 
            (op.text || op.label) === respuesta.trim()
          )
          opcionId = opcionEncontrada?.id
          console.log('Checkbox única, opcionId:', opcionId)
        } else {
          // Búsqueda normal para opciones únicas (radio, dropdown, etc.)
          const opcionEncontrada = opciones.find(op => 
            (op.text || op.label) === respuesta
          )
          opcionId = opcionEncontrada?.id
        }
      }
      
      // Para preguntas de tipo file, text, textarea y number, no se requiere opcionId
      if (!opcionId && !['file', 'text', 'textarea', 'number'].includes(tipoActualFinal)) {
        chatState.botEscribiendo = false
        throw new Error('No se pudo identificar la opción seleccionada')
      }
      
      // Procesar selección en la API
      console.log('Procesando en API - Estado antes:', {
        currentQuestionId: formsAPI.formState.currentQuestionId,
        tipoActualFinal,
        opcionId,
        respuesta: typeof respuesta === 'string' ? respuesta.substring(0, 50) : respuesta
      })
      
      let resultado
      if (['file', 'text', 'textarea', 'number'].includes(tipoActualFinal)) {
        // Para tipos de texto libre, usar la respuesta directamente sin opcionId
        resultado = await formsAPI.processOptionSelection(null, respuesta)
      } else {
        resultado = await formsAPI.processOptionSelection(opcionId, null)
      }
      
      console.log('Resultado de API processOptionSelection:', {
        isComplete: resultado.isComplete,
        siguientePreguntaId: resultado.question?.id,
        siguientePreguntaOrder: resultado.question?.questionOrder,
        currentQuestionIdDespues: formsAPI.formState.currentQuestionId
      })
      
      if (resultado.isComplete) {
        // Formulario completado
        chatState.botEscribiendo = false
        completarFormularioDinamico()
      } else if (resultado.question) {
        // Mostrar siguiente pregunta
        setTimeout(async () => {
          chatState.botEscribiendo = false
          await mostrarPreguntaDinamica(resultado.question, resultado.options)
        }, 1000)
      } else {
        chatState.botEscribiendo = false
        agregarMensaje('Error al procesar la respuesta. Inténtalo de nuevo.')
      }
      
    } catch (error) {
      console.error('Error al procesar respuesta:', error)
      chatState.botEscribiendo = false
      agregarMensaje('Lo siento, hubo un error al procesar tu respuesta. ¿Puedes intentarlo de nuevo?')
    }
  }

  // Completar formulario dinámico
  const completarFormularioDinamico = async () => {
    chatState.etapaActual = 'completado'
    chatState.formularioActivo = false
    
    // Crear objeto completo del formulario
    const formularioCompleto = {
      usuario: chatState.nombreUsuario,
      servicio: chatState.servicioSeleccionado,
      formId: formsAPI.formState.currentFormId,
      sessionId: formsAPI.formState.sessionId,
      responses: formsAPI.formState.responses,
      visitedQuestions: formsAPI.formState.visitedQuestions,
      completedAt: new Date().toISOString()
    }
    
    // Mostrar JSON en consola
    console.log('=== FORMULARIO COMPLETADO ===')
    console.log(JSON.stringify(formularioCompleto, null, 2))
    console.log('=============================')
    
    agregarMensaje('¡Perfecto! He recopilado toda la información necesaria.')
    setTimeout(() => {
      agregarMensaje('Los datos del formulario han sido guardados localmente. Revisa la consola para ver el JSON completo.')
    }, 1500)
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
  const mostrarOpciones = (opciones, tipoInput = 'radio') => {
    chatState.esperandoInput = true
    chatState.tipoInputActual = tipoInput
    chatState.opciones = opciones
    chatState.opcionesConImagenes = []
  }

  // Mostrar slider de imágenes para tipos 1, 2, 3
  const mostrarSliderImagenes = (opciones, tipoInput) => {
    console.log('mostrarSliderImagenes llamado:', { 
      opciones: opciones.length, 
      tipoInput,
      opcionesConImg: opciones.filter(op => op.image?.url).length 
    })
    
    chatState.esperandoInput = true
    chatState.tipoInputActual = 'slider-imagenes'
    chatState.opciones = []
    chatState.opcionesConImagenes = opciones.map(opcion => ({
      ...opcion,
      tipoSlider: tipoInput // Para saber si es checkbox, radio o dropdown
    }))
  }
  
  // Mostrar checkboxes múltiples
  const mostrarCheckboxes = (opciones) => {
    chatState.esperandoInput = true
    chatState.tipoInputActual = 'checkbox'
    chatState.opciones = opciones.map(opcion => opcion.text || opcion.label)
    chatState.opcionesConImagenes = []
    chatState.respuestasCheckbox = [] // Para múltiples selecciones
  }

  // Mostrar dropdown (select)
  const mostrarDropdown = (opciones) => {
    chatState.esperandoInput = true
    chatState.tipoInputActual = 'dropdown'
    chatState.opciones = []
    chatState.opcionesConImagenes = opciones // Guardamos opciones completas para acceder al id
  }

  // Procesar respuesta
  const procesarRespuesta = (respuesta) => {
    // Crear metadatos de la pregunta actual para poder rehacer la edición
    const metadata = crearMetadatasPreguntaActual()
    
    // Si estamos en modo edición, solo agregar el mensaje y desactivar edición
    if (chatState.modoEdicion) {
      console.log('Modo edición activo - agregando mensaje editado')
      chatState.modoEdicion = false // Desactivar modo edición
      agregarMensaje(respuesta, false, 'texto', metadata)
      chatState.esperandoInput = false
      // No hacer return aquí - continuar con el flujo normal
    } else {
      // Flujo normal: agregar mensaje
      agregarMensaje(respuesta, false, 'texto', metadata)
      chatState.esperandoInput = false
    }
    
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
    
    // Si estamos en modo edición, agregar mensaje y continuar normalmente
    if (chatState.modoEdicion) {
      console.log('Modo edición activo - completando edición con imagen y continuando')
      
      // IMPORTANTE: En modo edición, usar los metadata de la pregunta ACTUAL (ya restaurada)
      // Usar las opciones de la pregunta específica, NO las opciones actuales de la API
      const metadata = {
        etapa: chatState.etapaActual,
        tipoInput: mapearTipoPregunta(chatState.preguntaActual.questionType?.id),
        pregunta: chatState.preguntaActual,
        opciones: chatState.preguntaActual.options || chatState.opcionesConImagenes
      }
      
      console.log('Metadata para reselección:', {
        tipoInput: metadata.tipoInput,
        preguntaId: metadata.pregunta?.id,
        opcionesCount: metadata.opciones?.length,
        primerasOpciones: metadata.opciones?.slice(0, 3)?.map(op => op.text || op.label),
        formsAPIOptionsCount: formsAPI.options.value?.length,
        chatStateOpcionesCount: chatState.opcionesConImagenes?.length
      })
      
      // Agregar mensaje según el tipo (con o sin imagen)
      if (opcion.image?.url) {
        chatState.mensajes.push({
          id: Date.now(),
          contenido: {
            texto: contenido,
            imagen: opcion.image.url
          },
          esBot: false,
          tipo: 'opcion-imagen',
          timestamp: new Date(),
          metadata
        })
      } else {
        agregarMensaje(contenido, false, 'texto', metadata)
      }
      
      // Desactivar modo edición DESPUÉS de agregar el mensaje
      chatState.modoEdicion = false
      chatState.esperandoInput = false
      
      // Continuar con el flujo normal pero sin duplicar procesamiento
      setTimeout(async () => {
        if (chatState.etapaActual === 'formulario' && chatState.formularioActivo) {
          console.log('Procesando reselección de imagen:', {
            contenido,
            opcionId: opcion.id,
            preguntaActual: chatState.preguntaActual,
            progreso: chatState.progreso,
            metadata: metadata,
            formsAPICurrentQuestionId: formsAPI.formState.currentQuestionId,
            formsAPIVisitedQuestions: formsAPI.formState.visitedQuestions
          })
          
          // NO hacer retroceso aquí - ya se hizo correctamente en editarConMetadatos
          // El estado ya está configurado correctamente para procesar
          console.log('ANTES de procesarRespuestaFormulario:', {
            preguntaActualId: chatState.preguntaActual?.id,
            preguntaActualOrder: chatState.preguntaActual?.questionOrder,
            formsAPICurrentQuestionId: formsAPI.formState.currentQuestionId,
            progreso: chatState.progreso,
            visitedQuestions: formsAPI.formState.visitedQuestions,
            responses: Object.keys(formsAPI.formState.responses)
          })
          
          // Procesar la respuesta
          await procesarRespuestaFormulario(contenido, opcion.id)
          
          console.log('DESPUÉS de procesarRespuestaFormulario:', {
            preguntaActualId: chatState.preguntaActual?.id,
            preguntaActualOrder: chatState.preguntaActual?.questionOrder,
            formsAPICurrentQuestionId: formsAPI.formState.currentQuestionId,
            progreso: chatState.progreso,
            esperado: `Debería estar en pregunta ${chatState.preguntaActual?.questionOrder + 1 || 'desconocida'}`
          })
        }
      }, 500)
      return
    }
    
    // Crear metadatos de la pregunta actual
    const metadata = crearMetadatasPreguntaActual()
    
    // Si tiene imagen, agregar mensaje con imagen
    if (opcion.image?.url) {
      chatState.mensajes.push({
        id: Date.now(),
        contenido: {
          texto: contenido,
          imagen: opcion.image.url
        },
        esBot: false,
        tipo: 'opcion-imagen',
        timestamp: new Date(),
        metadata
      })
      
      nextTick(() => {
        scrollToBottom()
      })
    } else {
      // Si no tiene imagen, agregar mensaje de texto normal
      agregarMensaje(contenido, false, 'texto', metadata)
    }
    
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

  // Auto-procesamiento para inputs de texto (no para textarea)
  let timeoutId = null
  const manejarCambioInput = (valor) => {
    chatState.inputValue = valor
    
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    
    // No procesar automáticamente si es textarea
    if (chatState.tipoInputActual === 'textarea') {
      return // Los textareas requieren click en enviar
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

  // Función para crear metadatos de la pregunta actual
  const crearMetadatasPreguntaActual = () => {
    const metadata = {
      etapa: chatState.etapaActual,
      tipoInput: chatState.tipoInputActual
    }
    
    // Añadir información específica según la etapa
    switch (chatState.etapaActual) {
      case 'nombre':
        metadata.tipo = 'text'
        break
        
      case 'servicio':
        metadata.tipo = 'radio'
        metadata.opciones = services.map(service => service.services_name)
        break
        
      case 'formulario':
        if (chatState.formularioActivo && chatState.preguntaActual) {
          // Formulario dinámico
          metadata.pregunta = chatState.preguntaActual
          metadata.opciones = formsAPI.options.value
          metadata.tipoInput = mapearTipoPregunta(chatState.preguntaActual.questionType?.id)
        } else if (chatState.formularioActual && chatState.formularioActual.tipo === 'estatico') {
          // Formulario estático
          const pregunta = chatState.formularioActual.preguntas[chatState.preguntaActual]
          if (pregunta) {
            metadata.pregunta = pregunta
            metadata.opciones = pregunta.opciones
            metadata.tipoInput = pregunta.tipo
          }
        }
        break
    }
    
    return metadata
  }
  
  // Función para retroceder a una pregunta específica (para edición)
  const goBackToQuestion = async (numeroPregunta) => {
    try {
      console.log('Retrocediendo a la pregunta:', numeroPregunta)
      
      // Solo funciona si tenemos un formulario dinámico activo
      if (!chatState.formularioActivo || !formsAPI.formState.currentFormId) {
        console.warn('No hay formulario dinámico activo - no se puede retroceder')
        return false
      }
      
      // Usar la API real para retroceder
      const resultado = await formsAPI.goBackToQuestion(numeroPregunta)
      
      if (resultado) {
        // Actualizar el estado del chat con la pregunta restaurada
        chatState.preguntaActual = resultado.question
        
        // Actualizar progreso
        const progreso = await formsAPI.getFormProgress()
        chatState.progreso = progreso
        
        console.log('Retroceso exitoso a la pregunta:', numeroPregunta)
        return true
      } else {
        console.error('No se pudo retroceder a la pregunta:', numeroPregunta)
        return false
      }
      
    } catch (error) {
      console.error('Error al retroceder a la pregunta:', error)
      return false
    }
  }

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
    goBackToQuestion,
    
    // Estados computados
    hayErrorAPI,
    estaCargando,
    
    // Funciones auxiliares
    agregarMensaje,
    agregarMensajeConCallback,
    scrollToBottom,
    
    // Funciones para mostrar diferentes tipos de input (para edición)
    mostrarSliderImagenes,
    mostrarDropdown,
    mostrarCheckboxes,
    mostrarOpciones,
    mostrarInput,
    mapearTipoPregunta
  }
}