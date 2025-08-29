<script setup>
    import { onMounted, onUnmounted, ref, nextTick, watch } from 'vue'
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
        formsAPI,
        goBackToQuestion,
        mostrarSliderImagenes,
        mostrarDropdown,
        mostrarCheckboxes,
        mostrarOpciones,
        mostrarInput,
        mapearTipoPregunta
    } = useChatbotForms()
    
    // Referencias para los inputs
    const inputRef = ref(null)
    const textareaRef = ref(null)
    const fileInputRef = ref(null)
    const searchInput = ref(null)
    
    // Variables para dropdown personalizado
    const dropdownActivo = ref(false)
    const searchText = ref('')
    const opcionesFiltradas = ref([])
    const opcionDestacada = ref(-1)

    // Manejar selección de opción
    const seleccionarOpcion = (opcion) => {
        procesarRespuesta(opcion)
        // El scroll automático se maneja desde useChatbotForms.js después de ocultar inputs
    }

    // Manejar selección de opción con imagen
    const seleccionarOpcionImagen = (opcion) => {
        procesarOpcionImagen(opcion)
    }

    // Manejar selección en slider de imágenes
    const seleccionarOpcionSlider = (opcion) => {
        if (opcion.tipoSlider === 'checkbox') {
            // Para checkbox, permitir múltiple selección
            // TODO: Implementar lógica de múltiple selección si es necesario
            procesarOpcionImagen(opcion)
        } else {
            // Para radio y dropdown, selección única
            procesarOpcionImagen(opcion)
        }
    }

    // Manejar envío manual (Enter en textarea)
    const enviarRespuesta = () => {
        if (chatState.inputValue.trim()) {
            // Si es dropdown, buscar la opción completa para obtener el ID
            if (chatState.tipoInputActual === 'dropdown') {
                const opcionSeleccionada = chatState.opcionesConImagenes.find(
                    opcion => (opcion.text || opcion.label) === chatState.inputValue
                )
                if (opcionSeleccionada) {
                    procesarOpcionImagen(opcionSeleccionada)
                } else {
                    procesarRespuesta(chatState.inputValue.trim())
                }
            } else {
                procesarRespuesta(chatState.inputValue.trim())
            }
            // El scroll automático se maneja desde useChatbot.js después de ocultar inputs
        }
    }

    // Manejar cambio en checkbox
    const manejarCambioCheckbox = (opcion, checked) => {
        if (checked) {
            if (!chatState.respuestasCheckbox.includes(opcion)) {
                chatState.respuestasCheckbox.push(opcion)
            }
        } else {
            const index = chatState.respuestasCheckbox.indexOf(opcion)
            if (index > -1) {
                chatState.respuestasCheckbox.splice(index, 1)
            }
        }
    }
    
    // Toggle checkbox al hacer click en el li
    const toggleCheckbox = (opcion, index) => {
        const checkbox = document.getElementById(`checkbox-${index}`)
        if (checkbox) {
            checkbox.checked = !checkbox.checked
            manejarCambioCheckbox(opcion, checkbox.checked)
        }
    }

    // Enviar respuestas de checkboxes
    const enviarCheckboxes = () => {
        if (chatState.respuestasCheckbox.length > 0) {
            const respuesta = chatState.respuestasCheckbox.join(', ')
            procesarRespuesta(respuesta)
            chatState.respuestasCheckbox = [] // Limpiar selecciones
        }
    }

    // Manejar cambio de archivo
    const manejarCambioArchivo = (event) => {
        const archivos = Array.from(event.target.files)
        chatState.archivoSeleccionado = archivos
        console.log('Archivos seleccionados:', archivos)
    }

    // Abrir selector de archivos
    const abrirSelectorArchivos = () => {
        if (fileInputRef.value) {
            fileInputRef.value.click()
        }
    }

    // Enviar archivos
    const enviarArchivos = () => {
        if (chatState.archivoSeleccionado && chatState.archivoSeleccionado.length > 0) {
            // Crear metadata básico para archivos
            const metadataArchivos = {
                etapa: chatState.etapaActual,
                tipoInput: 'file',
                tipo: 'file'
            }
            
            // Crear mensaje con archivos para el chat
            chatState.mensajes.push({
                contenido: chatState.archivoSeleccionado,
                esBot: false,
                tipo: 'archivos',
                timestamp: new Date(),
                metadata: metadataArchivos
            })
            
            nextTick(() => {
                scrollToBottom()
            })
            
            // Procesar respuesta para el backend
            const nombresArchivos = chatState.archivoSeleccionado.map(archivo => archivo.name).join(', ')
            procesarRespuesta(`${chatState.archivoSeleccionado.length} archivo(s): ${nombresArchivos}`)
            chatState.archivoSeleccionado = null // Limpiar archivos
        }
    }

    // Formatear tamaño de archivo
    const formatearTamaño = (bytes) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    // Verificar si un archivo es imagen
    const esImagen = (archivo) => {
        const tiposImagen = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
        return tiposImagen.includes(archivo.type)
    }

    // Obtener URL de imagen para previsualización
    const obtenerURLImagen = (archivo) => {
        return URL.createObjectURL(archivo)
    }

    // ===== FUNCIONES DEL DROPDOWN PERSONALIZADO =====
    
    // Alternar dropdown
    const toggleDropdown = () => {
        if (!dropdownActivo.value) {
            abrirDropdown()
        } else {
            cerrarDropdown()
        }
    }
    
    // Abrir dropdown
    const abrirDropdown = () => {
        dropdownActivo.value = true
        opcionesFiltradas.value = [...chatState.opcionesConImagenes]
        opcionDestacada.value = -1
        
        nextTick(() => {
            if (searchInput.value) {
                searchInput.value.focus()
            }
        })
    }
    
    // Cerrar dropdown
    const cerrarDropdown = () => {
        dropdownActivo.value = false
        opcionDestacada.value = -1
    }
    
    // Filtrar opciones basado en texto de búsqueda
    const filtrarOpciones = () => {
        const texto = searchText.value.toLowerCase()
        if (!texto) {
            opcionesFiltradas.value = [...chatState.opcionesConImagenes]
        } else {
            opcionesFiltradas.value = chatState.opcionesConImagenes.filter(opcion => 
                (opcion.text || opcion.label).toLowerCase().includes(texto)
            )
        }
        opcionDestacada.value = -1
        
        if (!dropdownActivo.value) {
            abrirDropdown()
        }
    }
    
    // Navegar opciones con teclado
    const navegarOpcion = (direccion) => {
        if (!dropdownActivo.value) {
            abrirDropdown()
            return
        }
        
        const maxIndex = opcionesFiltradas.value.length - 1
        if (maxIndex < 0) return
        
        opcionDestacada.value += direccion
        
        if (opcionDestacada.value < 0) {
            opcionDestacada.value = maxIndex
        } else if (opcionDestacada.value > maxIndex) {
            opcionDestacada.value = 0
        }
    }
    
    // Seleccionar primera opción (Enter)
    const seleccionarPrimeraOpcion = () => {
        if (opcionDestacada.value >= 0 && opcionesFiltradas.value[opcionDestacada.value]) {
            seleccionarOpcionDropdown(opcionesFiltradas.value[opcionDestacada.value])
        } else if (opcionesFiltradas.value.length > 0) {
            seleccionarOpcionDropdown(opcionesFiltradas.value[0])
        }
    }
    
    // Seleccionar opción del dropdown
    const seleccionarOpcionDropdown = (opcion) => {
        searchText.value = opcion.text || opcion.label
        chatState.inputValue = opcion.text || opcion.label
        cerrarDropdown()
        
        // Enviar automáticamente cuando se selecciona
        nextTick(() => {
            const opcionCompleta = chatState.opcionesConImagenes.find(
                op => (op.text || op.label) === (opcion.text || opcion.label)
            )
            if (opcionCompleta) {
                procesarOpcionImagen(opcionCompleta)
            }
        })
    }

    // Cerrar dropdown al hacer clic fuera
    const handleClickOutside = (event) => {
        if (dropdownActivo.value && 
            searchInput.value && 
            !searchInput.value.contains(event.target) &&
            !event.target.closest('.customDropdownContainer')) {
            cerrarDropdown()
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
    const editarMensaje = async (mensaje) => {
        console.log('editarMensaje called with:', mensaje)
        console.log('Metadatos del mensaje:', mensaje.metadata)
        
        // Verificar que es un mensaje del usuario
        if (mensaje.esBot) {
            console.log('No se puede editar mensaje del bot')
            return
        }

        console.log('Iniciando edición...')
        
        // Mostrar loader durante el proceso de edición
        chatState.botEscribiendo = true
        
        // Reset estado de edición para evitar conflictos
        chatState.modoEdicion = false
        chatState.esperandoInput = false
        
        // Limpiar arrays temporales
        chatState.respuestasCheckbox = []
        chatState.archivoSeleccionado = null
        
        // Limpiar también el input file HTML
        if (fileInputRef.value) {
            fileInputRef.value.value = ''
        }
        
        // Calcular la posición original del mensaje ANTES del splice
        const todosLosMensajes = chatState.mensajes.slice()
        const mensajesUsuario = todosLosMensajes.filter(m => !m.esBot)
        const posicionMensaje = mensajesUsuario.findIndex(m => m.id === mensaje.id)
        
        console.log('Posición del mensaje editado:', posicionMensaje)
        
        // Activar modo edición
        chatState.modoEdicion = true
        
        // Encontrar el índice del mensaje a editar
        const indexMensaje = chatState.mensajes.findIndex(m => m.id === mensaje.id)
        console.log('Índice del mensaje:', indexMensaje)

        // Si es una respuesta a una pregunta tipo archivo, buscar y eliminar también el mensaje de archivos
        let indexInicioEliminacion = indexMensaje
        
        if (indexMensaje > 0) {
            const mensajeAnterior = chatState.mensajes[indexMensaje - 1]
            // Si el mensaje anterior es de tipo 'archivos' y es del usuario, eliminarlo también
            if (mensajeAnterior && mensajeAnterior.tipo === 'archivos' && !mensajeAnterior.esBot) {
                indexInicioEliminacion = indexMensaje - 1
                console.log('Detectado mensaje de archivos asociado, eliminando desde índice:', indexInicioEliminacion)
            }
        }

        // Remover todos los mensajes desde el índice calculado en adelante
        if (indexInicioEliminacion !== -1) {
            chatState.mensajes.splice(indexInicioEliminacion)
            console.log('Mensajes removidos desde el índice:', indexInicioEliminacion)
        }
        
        // Usar metadatos si están disponibles, sino usar lógica de fallback
        if (mensaje.metadata) {
            await editarConMetadatos(mensaje, posicionMensaje)
        } else {
            console.warn('Mensaje sin metadatos, usando lógica de fallback')
            await editarSinMetadatos(mensaje)
        }

        console.log('Estado final del chat:', {
            esperandoInput: chatState.esperandoInput,
            tipoInputActual: chatState.tipoInputActual,
            inputValue: chatState.inputValue,
            opciones: chatState.opciones,
            opcionesConImagenes: chatState.opcionesConImagenes,
            modoEdicion: chatState.modoEdicion
        })

        // Delay mínimo para mostrar el loader (UX)
        setTimeout(() => {
            // Ocultar loader ya que los campos están listos
            chatState.botEscribiendo = false
            
            // Enfocar el input con delay para evitar conflictos
            setTimeout(() => {
                nextTick(() => {
                    enfocarInput()
                })
            }, 100)
        }, 800) // Mínimo 800ms para que se vea el loader
    }
    
    // Función para editar usando metadatos (método preferido)
    const editarConMetadatos = async (mensaje, posicionMensaje) => {
        const { metadata } = mensaje
        
        console.log('Editando con metadatos:', metadata)
        console.log('Restaurando a posición de mensaje:', posicionMensaje)
        
        // Reset completo del estado antes de configurar
        chatState.opciones = []
        chatState.opcionesConImagenes = []
        chatState.inputValue = ''
        chatState.respuestasCheckbox = []
        chatState.archivoSeleccionado = null
        
        // Limpiar también el input file HTML
        if (fileInputRef.value) {
            fileInputRef.value.value = ''
        }
        
        // Configurar estado básico
        chatState.etapaActual = metadata.etapa
        chatState.esperandoInput = true
        
        // Para archivos, forzar el tipo antes de cualquier otra lógica
        if (metadata.tipoInput === 'file') {
            chatState.tipoInputActual = 'file'
            console.log('Archivo detectado - forzando tipoInputActual a "file"')
        } else {
            chatState.tipoInputActual = metadata.tipoInput || metadata.tipo
        }
        
        // Configurar según el tipo
        switch (metadata.etapa) {
            case 'nombre':
                chatState.inputValue = mensaje.contenido
                chatState.opciones = []
                break
                
            case 'servicio':
                chatState.inputValue = mensaje.contenido
                chatState.opciones = metadata.opciones || services.map(service => service.services_name)
                break
                
            case 'formulario':
                chatState.preguntaActual = metadata.pregunta
                
                // Restaurar el índice correcto de pregunta basado en la posición del mensaje
                if (posicionMensaje >= 2) { // Restamos nombre (0) y servicio (1)
                    const numeroPregunta = posicionMensaje - 2
                    console.log('Cálculo de numeroPregunta:', {
                        posicionMensaje: posicionMensaje,
                        numeroPregunta: numeroPregunta,
                        significado: `Editando respuesta ${posicionMensaje - 1} (pregunta ${numeroPregunta + 1} en términos humanos)`
                    })
                    
                    // Para formularios estáticos, actualizar preguntaActual
                    if (chatState.formularioActual && chatState.formularioActual.tipo === 'estatico') {
                        chatState.preguntaActual = numeroPregunta
                        
                        // Actualizar progreso también
                        chatState.progreso = {
                            current: numeroPregunta + 1,
                            total: chatState.formularioActual.preguntas.length,
                            percentage: Math.round(((numeroPregunta + 1) / chatState.formularioActual.preguntas.length) * 100)
                        }
                        console.log('Progreso actualizado:', chatState.progreso)
                    }
                    
                    // Para formularios dinámicos, retroceder REALMENTE la API para mantener coherencia
                    if (chatState.formularioActivo && metadata.pregunta) {
                        console.log('Retrocediendo API a pregunta original:', {
                            preguntaOriginal: metadata.pregunta.id,
                            questionOrder: metadata.pregunta.questionOrder,
                            tipoOriginal: metadata.pregunta.questionType
                        })
                        
                        try {
                            // Retroceder la API al questionOrder de la pregunta original
                            const questionOrderToGoBack = metadata.pregunta.questionOrder
                            const exito = await goBackToQuestion(questionOrderToGoBack)
                            
                            if (exito) {
                                console.log('API retrocedida exitosamente - sincronizando estado local')
                                
                                // Ahora que la API retrocedió, FORZAR el uso de la pregunta original
                                // porque la API podría devolver una pregunta diferente con el mismo order
                                chatState.preguntaActual = metadata.pregunta
                                formsAPI.formState.currentQuestionId = metadata.pregunta.id
                                
                                // Actualizar progreso 
                                const progresoActualizado = await formsAPI.getFormProgress()
                                chatState.progreso = {
                                    current: questionOrderToGoBack,
                                    total: progresoActualizado.total,
                                    percentage: Math.round((questionOrderToGoBack / progresoActualizado.total) * 100)
                                }
                                
                                console.log('API y estado local sincronizados:', {
                                    preguntaLocal: chatState.preguntaActual.id,
                                    preguntaAPI: formsAPI.formState.currentQuestionId,
                                    progreso: chatState.progreso,
                                    esperado: `Próxima pregunta será ${questionOrderToGoBack + 1}`
                                })
                            } else {
                                console.error('No se pudo retroceder la API - usando solo estado local')
                                // Fallback: solo estado local
                                chatState.preguntaActual = metadata.pregunta
                                formsAPI.formState.currentQuestionId = metadata.pregunta.id
                            }
                        } catch (error) {
                            console.error('Error al retroceder API:', error)
                            // Fallback: solo estado local
                            chatState.preguntaActual = metadata.pregunta
                            formsAPI.formState.currentQuestionId = metadata.pregunta.id
                        }
                    }
                }
                
                // Asegurar que los metadatos estén disponibles para procesarRespuestaFormulario
                if (chatState.preguntaActual) {
                    chatState.preguntaActual.metadata = metadata
                }
                
                // Restaurar interfaz según el tipo de pregunta
                const tipoInput = metadata.tipoInput
                
                if (tipoInput === 'file') {
                    // Para archivos, forzar tipo file y limpiar todo
                    chatState.tipoInputActual = 'file'
                    // Para mensajes de archivo, contenido es array de archivos, no texto
                    if (mensaje.tipo === 'archivos') {
                        chatState.inputValue = ''  // No usar el array de archivos como texto
                    } else {
                        chatState.inputValue = mensaje.contenido  // Para mensajes de texto con nombres
                    }
                    chatState.opciones = []
                    chatState.opcionesConImagenes = []
                    console.log('Restaurando tipo archivo - forzando tipoInputActual a "file"')
                } else if (['text', 'textarea', 'number'].includes(tipoInput)) {
                    chatState.inputValue = mensaje.contenido
                    chatState.opciones = []
                } else if (tipoInput === 'checkbox') {
                    chatState.respuestasCheckbox = mensaje.contenido.includes(', ') ? 
                        mensaje.contenido.split(', ') : [mensaje.contenido]
                    
                    // Verificar si hay imágenes
                    if (tieneImagenes(metadata.opciones)) {
                        chatState.tipoInputActual = 'slider-imagenes'
                        chatState.opcionesConImagenes = metadata.opciones.map(opcion => ({
                            ...opcion,
                            tipoSlider: 'checkbox'
                        }))
                    } else {
                        chatState.opciones = metadata.opciones?.map(op => op.text || op.label) || []
                    }
                } else if (['radio', 'dropdown'].includes(tipoInput)) {
                    // Para mensajes de opcion-imagen, extraer el texto del contenido
                    if (mensaje.tipo === 'opcion-imagen') {
                        chatState.inputValue = mensaje.contenido.texto
                        console.log('Restaurando opcion-imagen con texto:', mensaje.contenido.texto)
                    } else {
                        chatState.inputValue = mensaje.contenido
                    }
                    
                    // Verificar si hay imágenes (solo para radio, dropdown no usa slider)
                    if (tipoInput === 'radio' && tieneImagenes(metadata.opciones)) {
                        chatState.tipoInputActual = 'slider-imagenes'
                        chatState.opcionesConImagenes = metadata.opciones.map(opcion => ({
                            ...opcion,
                            tipoSlider: 'radio'
                        }))
                    } else if (tipoInput === 'dropdown') {
                        chatState.opcionesConImagenes = metadata.opciones || []
                    } else {
                        chatState.opciones = metadata.opciones?.map(op => op.text || op.label) || []
                    }
                }
                
                console.log('Configuración de formulario completada:', {
                    preguntaActual: chatState.preguntaActual,
                    tipoInput,
                    opciones: chatState.opciones.length,
                    opcionesConImagenes: chatState.opcionesConImagenes.length
                })
                break
        }
    }
    
    // Función de fallback para editar sin metadatos (compatibilidad)
    const editarSinMetadatos = async (mensaje) => {
        // Lógica original como fallback
        const todosLosMensajes = chatState.mensajes.slice()
        const mensajesUsuario = todosLosMensajes.filter(m => !m.esBot)
        const posicionMensaje = mensajesUsuario.findIndex(m => m.id === mensaje.id)
        
        if (posicionMensaje === 0) {
            chatState.etapaActual = 'nombre'
            chatState.esperandoInput = true
            chatState.inputValue = mensaje.contenido
            chatState.tipoInputActual = 'text'
            chatState.opciones = []
        } else if (posicionMensaje === 1) {
            chatState.etapaActual = 'servicio'
            chatState.esperandoInput = true
            chatState.inputValue = mensaje.contenido
            chatState.tipoInputActual = 'radio'
            chatState.opciones = services.map(service => service.services_name)
        } else {
            console.warn('No se pueden editar preguntas del formulario sin metadatos')
        }
    }
    
    // Función auxiliar para verificar si las opciones tienen imágenes
    const tieneImagenes = (opciones) => {
        return opciones && opciones.some(op => op.image?.url)
    }
    

    // Enfocar input cuando aparece
    const enfocarInput = () => {
        nextTick(() => {
            setTimeout(() => {
                if (chatState.tipoInputActual === 'textarea' && textareaRef.value) {
                    textareaRef.value.focus()
                } else if (inputRef.value && ['text', 'number', 'dropdown'].includes(chatState.tipoInputActual)) {
                    inputRef.value.focus()
                }
                // Para file, checkbox no necesitamos enfocar automáticamente
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
        
        // Agregar listener para cerrar dropdown al hacer clic fuera
        document.addEventListener('click', handleClickOutside)
    })
    
    // Cleanup al desmontar
    onUnmounted(() => {
        document.removeEventListener('click', handleClickOutside)
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
                <div v-else-if="mensaje.tipo === 'archivos'" class="msgUser msgUserArchivos editable-message" @click.stop="editarMensaje(mensaje)">
                    <div class="archivosEnviados">
                        <div v-for="archivo in mensaje.contenido" :key="archivo.name" class="archivoEnviado">
                            <div v-if="esImagen(archivo)" class="imagenEnviada">
                                <img :src="obtenerURLImagen(archivo)" :alt="archivo.name" />
                            </div>
                            <div v-else class="iconoArchivoEnviado">
                                <i class="fa-solid fa-file"></i>
                            </div>
                            <div class="infoArchivoEnviado">
                                <span>{{ archivo.name }}</span>
                                <small>({{ formatearTamaño(archivo.size) }})</small>
                            </div>
                        </div>
                    </div>
                    <i class="fa-solid fa-pencil edit-icon"></i>
                </div>
                <div v-else-if="mensaje.tipo === 'opcion-imagen'" class="msgUser msgUserOpcionImagen editable-message" @click.stop="editarMensaje(mensaje)">
                    <div class="opcionImagenSeleccionada">
                        <div class="imagenSeleccionada">
                            <img :src="mensaje.contenido.imagen" :alt="mensaje.contenido.texto" />
                        </div>
                        <div class="textoSeleccionado">
                            <p>{{ mensaje.contenido.texto }}</p>
                        </div>
                    </div>
                    <i class="fa-solid fa-pencil edit-icon"></i>
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

            <!-- Input de Número -->
            <div 
                v-if="chatState.esperandoInput && chatState.tipoInputActual === 'number'"
                class="msgContainer jcFlexEnd ux-slide-in-right"
            >
                <input 
                    ref="inputRef"
                    v-model="chatState.inputValue"
                    @input="manejarCambioInput($event.target.value)"
                    class="inputNameChat ux-form-field"
                    type="number"
                    placeholder="Ingresa un número..."
                />
            </div>

            <!-- Input de Archivos -->
            <div 
                v-if="chatState.esperandoInput && chatState.tipoInputActual === 'file'"
                class="msgContainer jcFlexEnd ux-slide-in-right"
            >
                <div class="fileContainer">
                    <input 
                        ref="fileInputRef"
                        type="file"
                        @change="manejarCambioArchivo($event)"
                        class="inputFile"
                        accept="image/*,video/*,.pdf,.doc,.docx"
                        multiple
                    />
                    <div class="fileLabel" @click="abrirSelectorArchivos">
                        <i class="fa-solid fa-cloud-upload-alt"></i>
                        <span v-if="!chatState.archivoSeleccionado">Seleccionar archivo(s)</span>
                        <span v-else>{{ chatState.archivoSeleccionado.length }} archivo(s) seleccionado(s)</span>
                    </div>
                    <div v-if="chatState.archivoSeleccionado && chatState.archivoSeleccionado.length > 0" class="archivosSeleccionados">
                        <div v-for="archivo in chatState.archivoSeleccionado" :key="archivo.name" class="archivoItem">
                            <div v-if="esImagen(archivo)" class="imagenPreview">
                                <img :src="obtenerURLImagen(archivo)" :alt="archivo.name" />
                            </div>
                            <div v-else class="iconoArchivo">
                                <i class="fa-solid fa-file"></i>
                            </div>
                            <div class="infoArchivo">
                                <span>{{ archivo.name }}</span>
                                <small>({{ formatearTamaño(archivo.size) }})</small>
                            </div>
                        </div>
                    </div>
                    <button 
                        v-if="chatState.archivoSeleccionado && chatState.archivoSeleccionado.length > 0"
                        @click="enviarArchivos"
                        class="btnEnviarArchivos BGBlue"
                    >
                        Enviar Archivos
                    </button>
                </div>
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

            <!-- Checkboxes Múltiples -->
            <div 
                v-if="chatState.esperandoInput && chatState.tipoInputActual === 'checkbox'"
                class="msgContainer jcFlexEnd ux-slide-in-right"
            >
                <div class="checkboxContainer">
                    <ul class="listChat ux-content">
                        <li 
                            v-for="(opcion, index) in chatState.opciones" 
                            :key="index"
                            class="ux-list-item ux-hover-lift checkbox-option"
                            :class="{ 
                                'noBorder': index === chatState.opciones.length - 1,
                                'selected': chatState.respuestasCheckbox.includes(opcion)
                            }"
                            @click="toggleCheckbox(opcion, index)"
                        >
                            <input 
                                type="checkbox" 
                                :id="`checkbox-${index}`"
                                :value="opcion"
                                :checked="chatState.respuestasCheckbox.includes(opcion)"
                                @change="manejarCambioCheckbox(opcion, $event.target.checked)"
                            >
                            <label :for="`checkbox-${index}`">{{ opcion }}</label>
                        </li>
                    </ul>
                    <button 
                        v-if="chatState.respuestasCheckbox.length > 0"
                        @click="enviarCheckboxes"
                        class="btnEnviarCheckboxes BGBlue"
                    >
                        Continuar ({{ chatState.respuestasCheckbox.length }} seleccionada{{ chatState.respuestasCheckbox.length !== 1 ? 's' : '' }})
                    </button>
                </div>
            </div>

            <!-- Dropdown/Select Personalizado con Búsqueda -->
            <div 
                v-if="chatState.esperandoInput && chatState.tipoInputActual === 'dropdown'"
                class="msgContainer jcFlexEnd ux-slide-in-right"
            >
                <div class="customDropdownContainer">
                    <div class="customDropdown" :class="{ 'active': dropdownActivo }">
                        <div class="dropdownInput" @click="toggleDropdown">
                            <input 
                                ref="searchInput"
                                type="text" 
                                v-model="searchText"
                                @input="filtrarOpciones"
                                @keydown.enter="seleccionarPrimeraOpcion"
                                @keydown.escape="cerrarDropdown"
                                @keydown.arrow-down.prevent="navegarOpcion(1)"
                                @keydown.arrow-up.prevent="navegarOpcion(-1)"
                                placeholder="Buscar o seleccionar una opción..."
                                class="searchInput"
                                :class="{ 'hasValue': chatState.inputValue }"
                            />
                            <i class="fa-solid fa-chevron-down dropdownIcon" :class="{ 'rotated': dropdownActivo }"></i>
                        </div>
                        
                        <div class="dropdownList" v-if="dropdownActivo">
                            <div 
                                v-for="(opcion, index) in opcionesFiltradas" 
                                :key="index"
                                :class="['dropdownOption', { 'highlighted': index === opcionDestacada }]"
                                @click="seleccionarOpcionDropdown(opcion)"
                                @mouseenter="opcionDestacada = index"
                            >
                                {{ opcion.text || opcion.label }}
                            </div>
                            <div v-if="opcionesFiltradas.length === 0" class="noResults">
                                No se encontraron opciones
                            </div>
                        </div>
                    </div>
                </div>
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
                        <div class="imagenOpcion" v-if="opcion.image?.url">
                            <img :src="opcion.image?.url" :alt="opcion.text || opcion.label" />
                        </div>
                        <div class="textoOpcion">
                            <p>{{ opcion.text || opcion.label }}</p>
                            <small v-if="opcion.description">{{ opcion.description }}</small>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slider horizontal de imágenes para tipos 1,2,3 -->
            <div 
                v-if="chatState.esperandoInput && chatState.tipoInputActual === 'slider-imagenes'"
                class="msgContainer jcFlexEnd ux-slide-in-right"
            >
                <!-- Debug: {{ chatState.opcionesConImagenes.length }} opciones -->
                <div class="sliderImagenesContainer">
                    <div class="sliderImagenes">
                        <div 
                            v-for="(opcion, index) in chatState.opcionesConImagenes" 
                            :key="index"
                            :class="['sliderItem', { 'multiple': opcion.tipoSlider === 'checkbox' }]"
                            @click="seleccionarOpcionSlider(opcion)"
                        >
                            <div class="sliderImagenWrapper">
                                <img 
                                    :src="opcion.image?.url" 
                                    :alt="opcion.text || opcion.label" 
                                    @error="console.log('Error cargando imagen:', opcion.image?.url)"
                                    @load="console.log('Imagen cargada:', opcion.image?.url)"
                                />
                                <div v-if="opcion.tipoSlider === 'checkbox'" class="checkboxIndicador">
                                    <i class="fa-solid fa-check"></i>
                                </div>
                            </div>
                            <div class="sliderTexto">
                                <p>{{ opcion.text || opcion.label }}</p>
                                <small v-if="opcion.description">{{ opcion.description }}</small>
                            </div>
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

<style scoped>
/* Estilos para campos específicos del chat dinámico */

/* Contenedor de archivos */
.fileContainer {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px;
    border: 2px dashed #ddd;
    border-radius: 8px;
    background: #f9f9f9;
    transition: all 0.3s ease;
}

.fileContainer:hover {
    border-color: #007bff;
    background: #f0f8ff;
}

.inputFile {
    display: none;
}

.fileLabel {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    color: #666;
    font-size: 14px;
    padding: 8px 12px;
    border-radius: 6px;
    background: white;
    border: 1px solid #ddd;
    transition: all 0.2s ease;
}

.fileLabel:hover {
    background: #f8f9fa;
    border-color: #007bff;
}

.fileLabel i {
    font-size: 18px;
    color: #007bff;
}

/* Lista de archivos seleccionados */
.archivosSeleccionados {
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-height: 200px;
    overflow-y: auto;
}

.archivoItem {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    font-size: 13px;
}

.archivoItem i {
    color: #6c757d;
    font-size: 14px;
}

.archivoItem span {
    flex: 1;
    color: #333;
    word-break: break-all;
}

.archivoItem small {
    color: #6c757d;
    font-size: 11px;
}

/* Botones de envío */
.btnEnviarArchivos,
.btnEnviarCheckboxes,
.btnEnviarSelect {
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    color: white;
    font-weight: 500;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s ease;
}

.btnEnviarArchivos:hover,
.btnEnviarCheckboxes:hover,
.btnEnviarSelect:hover {
    opacity: 0.9;
    transform: translateY(-1px);
}

/* Contenedor de checkboxes */
.checkboxContainer {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.checkbox-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.checkbox-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border-radius: 6px;
    transition: background-color 0.2s ease;
}

.checkbox-item:hover {
    background-color: #f5f5f5;
}

.checkbox-item input[type="checkbox"] {
    width: 16px;
    height: 16px;
    cursor: pointer;
}

.checkbox-item label {
    cursor: pointer;
    flex: 1;
    font-size: 14px;
}

/* Select/Dropdown */
.dropdownContainer {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.selectChat {
    padding: 10px 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
    background: white;
    cursor: pointer;
}

.selectChat:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

/* Input de número */
.inputNameChat[type="number"] {
    -moz-appearance: textfield;
}

.inputNameChat[type="number"]::-webkit-outer-spin-button,
.inputNameChat[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>
