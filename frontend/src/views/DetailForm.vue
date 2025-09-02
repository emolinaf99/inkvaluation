<script setup>
    console.log('DetailForm.vue - Script setup ejecutándose');
    
    // Importaciones básicas
    import {reactive, ref, onMounted, watch, nextTick} from 'vue'
    console.log('Vue imports OK');
    
    import {useApi} from '/src/js/useFetch.js'
    console.log('useApi import OK');
    
    import {checkOptAssistant} from '/src/js/checkOpt.js'
    import {
        cargarTiposDePregunta,
        validarPreguntaAnterior,
        getDragAfterElement,
        cargarPreguntasExistentes,
        mostrarPreguntaExistente,
        activarCamposPregunta,
        bloquearCamposPregunta
    } from '/src/js/formsFunctions.js'
    
    // Importar funciones adicionales desde formsFunctions.js
    import { agregarOpcion, asignarEventoClickAgregarOpcion, asignarEventoChangeSelectTipoPregunta, eliminarPregunta } from '/src/js/formsFunctions.js'
    
    console.log('Todas las importaciones básicas completadas');

    const questionTypes = ref([]);

    const props = defineProps({
        formId: {
            type: [String,Number],
            required: true
        }
    })

    let headerForm = reactive({
        name: '',
        description:''
    })

    let formQuestions = ref([])
    let loadingQuestions = ref(true)
    
    console.log('Estado inicial loadingQuestions:', loadingQuestions.value)

    async function getForm() {

        let {data,error,loading} = await useApi(`/api/forms/${props.formId}`)

        if(!error.value) {
            headerForm.name = data.value.title
            headerForm.description = data.value.description
        }
    }

    // Variables reactivas para almacenar las opciones actual y anterior
    const selectedOption = ref(null);
    const previousOption = ref(null);
    
    // Variables para manejar estado de edición
    const editingQuestions = ref(new Set()); // Set para almacenar IDs de preguntas en edición
    const originalQuestionData = ref({}); // Para almacenar datos originales para cancelar

    // Watch para actualizar la opción anterior cuando cambia la opción seleccionada
    watch(selectedOption, (newVal, oldVal) => {
        previousOption.value = oldVal; // Actualiza el valor anterior antes de cambiar
    });

    // Función para bloquear campos de todas las preguntas existentes renderizadas
    function bloquearPreguntasExistentes() {
        const preguntasRenderizadas = document.querySelectorAll('.draggable');
        console.log(`Bloqueando ${preguntasRenderizadas.length} preguntas existentes`);
        
        // Establecer el número de preguntas existentes globalmente para la numeración
        window.preguntasExistentes = formQuestions.value.length;
        
        preguntasRenderizadas.forEach((pregunta, index) => {
            console.log(`Bloqueando pregunta ${index + 1}`);
            bloquearCamposPregunta(pregunta);
            
            // Asignar evento eliminar a preguntas existentes
            const iconoEliminar = pregunta.querySelector('.fa-trash');
            if (iconoEliminar) {
                console.log(`Asignando evento eliminar a pregunta existente ${index + 1}`);
                iconoEliminar.addEventListener('click', (event) => {
                    event.preventDefault();
                    const contenedorPregunta = event.currentTarget.parentNode.parentNode;
                    eliminarPreguntaVue(contenedorPregunta);
                });
            }
            
            // COMENTADO: Asignar evento editar a preguntas existentes (ahora se maneja en el template Vue)
            /*
            const iconoEditar = pregunta.querySelector('.questionEdit');
            if (iconoEditar) {
                console.log(`Asignando evento editar a pregunta existente ${index + 1}`);
                // Remover eventos previos para evitar duplicados
                iconoEditar.replaceWith(iconoEditar.cloneNode(true));
                const nuevoIconoEditar = pregunta.querySelector('.questionEdit');
                
                nuevoIconoEditar.addEventListener('click', (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    console.log('Click en editar detectado');
                    
                    // Obtener ID de la pregunta desde el DOM o desde el array
                    const questionId = formQuestions.value[index]?.id;
                    if (questionId) {
                        console.log(`Activando edición para pregunta ID: ${questionId}`);
                        activarEdicionPregunta(questionId, index);
                    } else {
                        console.error('No se pudo obtener el ID de la pregunta');
                    }
                });
            }
            */
            
            // Asignar evento cambio de tipo al select de preguntas existentes
            const selectTipoPregunta = pregunta.querySelector('.questionSelect');
            if (selectTipoPregunta) {
                console.log(`Asignando evento cambio de tipo a pregunta existente ${index + 1}`);
                asignarEventoChangeSelectTipoPregunta(selectTipoPregunta);
            }
        });
    }

    // Función para agregar nueva pregunta al array reactivo de Vue
    function agregarNuevaPregunta() {
        console.log('Agregando nueva pregunta al array reactivo...');
        const nuevaPregunta = {
            id: `temp-${Date.now()}`, // ID temporal
            text: '',
            questionOrder: formQuestions.value.length + 1,
            questionType: {
                id: 2, // Selección múltiple por defecto
                description: 'Selección múltiple'
            },
            options: []
        };
        
        formQuestions.value.push(nuevaPregunta);
        console.log('Nueva pregunta agregada:', nuevaPregunta);
        
        // Esperar a que Vue renderice y luego enfocar input y agregar opción
        nextTick(() => {
            // Buscar específicamente la pregunta con el ID temporal que acabamos de crear
            const todasLasPreguntas = document.querySelectorAll('.draggable');
            let preguntaNueva = null;
            
            // Buscar la pregunta que NO tiene data-saved (es la nueva)
            todasLasPreguntas.forEach(pregunta => {
                if (!pregunta.hasAttribute('data-saved')) {
                    preguntaNueva = pregunta;
                }
            });
            
            console.log('Total preguntas encontradas:', todasLasPreguntas.length);
            console.log('Pregunta nueva encontrada:', preguntaNueva);
            
            if (preguntaNueva) {
                console.log('Configurando nueva pregunta...');
                
                console.log('Agregando opción automática...');
                agregarOpcion(preguntaNueva);
                
                // Asignar evento al botón "Agregar una opción"
                const botonAgregarOpcion = preguntaNueva.querySelector('.inputAddOption');
                if (botonAgregarOpcion) {
                    console.log('Asignando evento al botón "Agregar una opción"...');
                    asignarEventoClickAgregarOpcion(botonAgregarOpcion);
                }
                
                // Asignar evento al select de tipo de pregunta
                const selectTipoPregunta = preguntaNueva.querySelector('.questionSelect');
                if (selectTipoPregunta) {
                    console.log('Asignando evento al select de tipo de pregunta...');
                    asignarEventoChangeSelectTipoPregunta(selectTipoPregunta);
                }
                
                // Asignar evento al icono eliminar
                const iconoEliminar = preguntaNueva.querySelector('.fa-trash');
                if (iconoEliminar) {
                    console.log('Asignando evento al icono eliminar...');
                    iconoEliminar.addEventListener('click', (event) => {
                        event.preventDefault();
                        const contenedorPregunta = event.currentTarget.parentNode.parentNode;
                        eliminarPreguntaVue(contenedorPregunta);
                    });
                }
                
                // Enfocar el input de la nueva pregunta con un pequeño delay
                const inputPregunta = preguntaNueva.querySelector('.questionAndType input');
                if (inputPregunta) {
                    console.log('Input encontrado, disabled:', inputPregunta.disabled);
                    
                    // Usar setTimeout para asegurar que Vue termine de renderizar
                    setTimeout(() => {
                        console.log('Intentando enfocar input de la pregunta nueva...');
                        console.log('Input disabled después del timeout:', inputPregunta.disabled);
                        
                        // Asegurar que el input esté habilitado
                        inputPregunta.disabled = false;
                        inputPregunta.focus();
                        
                        console.log('Focus aplicado, elemento activo:', document.activeElement === inputPregunta);
                    }, 200);
                }
            }
        });
    }

    // Variable reactiva para controlar el estado de carga
    const isCreatingQuestion = ref(false);

    // Función para manejar la adición de nueva pregunta (wrapper para función async)
    async function handleAddQuestion(contenedorReceptor) {
        try {
            isCreatingQuestion.value = true; // Mostrar loader
            await validarPreguntaAnterior(contenedorReceptor, props.formId);
        } catch (error) {
            console.error('Error al agregar nueva pregunta:', error);
        } finally {
            isCreatingQuestion.value = false; // Ocultar loader
        }
    }

    // Función para eliminar pregunta (nueva o guardada)
    async function eliminarPreguntaVue(contenedorPregunta) {
        console.log('=== INICIO ELIMINAR PREGUNTA ===');
        console.log('Contenedor recibido:', contenedorPregunta);
        console.log('Classes del contenedor:', contenedorPregunta?.className);
        console.log('Es draggable?', contenedorPregunta?.classList.contains('draggable'));
        
        // Encontrar el contenedor .draggable correcto
        let contenedorReal = contenedorPregunta;
        if (!contenedorPregunta || !contenedorPregunta.classList.contains('draggable')) {
            // Buscar hacia arriba hasta encontrar .draggable
            contenedorReal = contenedorPregunta?.closest('.draggable');
            console.log('Contenedor real encontrado:', contenedorReal);
        }
        
        if (!contenedorReal) {
            console.error('No se pudo encontrar el contenedor .draggable');
            return;
        }
        
        // Verificar si tiene atributo data-saved para identificar tipo
        const esNueva = !contenedorReal.hasAttribute('data-saved');
        console.log('Tipo de pregunta - Es nueva:', esNueva);
        console.log('Data-saved attribute:', contenedorReal.getAttribute('data-saved'));
        
        // Buscar el índice basado en la posición en el DOM
        const todasLasPreguntas = document.querySelectorAll('.draggable');
        const indexDOM = Array.from(todasLasPreguntas).indexOf(contenedorReal);
        
        console.log('Índice en DOM:', indexDOM);
        console.log('Total preguntas en DOM:', todasLasPreguntas.length);
        console.log('Total preguntas en array:', formQuestions.value.length);
        console.log('Array actual de preguntas:', formQuestions.value);
        
        if (indexDOM === -1) {
            console.error('No se pudo encontrar el índice de la pregunta en el DOM');
            return;
        }
        
        // Validar que el índice esté dentro del rango del array
        if (indexDOM >= formQuestions.value.length) {
            console.error('Índice fuera del rango del array reactivo. Índice:', indexDOM, 'Array length:', formQuestions.value.length);
            return;
        }
        
        // Obtener la pregunta del array para verificar
        const preguntaDelArray = formQuestions.value[indexDOM];
        console.log('Pregunta en el array en índice', indexDOM, ':', preguntaDelArray);
        
        // Verificar consistencia entre DOM y array
        const textoPreguntaDOM = contenedorReal.querySelector('.questionAndType input')?.value || '';
        const textoPreguntaArray = preguntaDelArray?.text || '';
        console.log('Texto en DOM:', textoPreguntaDOM);
        console.log('Texto en array:', textoPreguntaArray);
        
        if (textoPreguntaDOM !== textoPreguntaArray && textoPreguntaArray !== '') {
            console.warn('⚠️ INCONSISTENCIA: El texto en DOM no coincide con el array');
            console.warn('Esto puede indicar que se está eliminando la pregunta incorrecta');
        }
        
        if (esNueva) {
            console.log('Eliminando pregunta nueva (solo del array reactivo)...');
            
            // Para preguntas nuevas, usar el índice del DOM directamente
            if (indexDOM < formQuestions.value.length) {
                // Eliminar del array reactivo
                formQuestions.value.splice(indexDOM, 1);
                console.log('Pregunta nueva eliminada del array reactivo en índice:', indexDOM);
            } else {
                console.warn('Índice fuera de rango en el array reactivo');
            }
        } else {
            console.log('Eliminando pregunta guardada (API + array reactivo)...');
            
            // Para preguntas guardadas, buscar la pregunta en el array por índice DOM
            const pregunta = formQuestions.value[indexDOM];
            
            console.log('Pregunta encontrada por índice DOM:', pregunta);
            
            if (pregunta && pregunta.id) {
                try {
                    console.log(`Llamando API para eliminar pregunta ID: ${pregunta.id}`);
                    
                    // Llamar al endpoint de eliminación del microservicio externo
                    const {data, error} = await useApi(`http://217.196.61.73:8082/api/questions/${pregunta.id}`, 'DELETE');
                    
                    if (!error.value) {
                        console.log('Pregunta eliminada exitosamente del servidor');
                        
                        // Eliminar del array reactivo
                        formQuestions.value.splice(indexDOM, 1);
                        console.log('Pregunta eliminada del array reactivo en índice:', indexDOM);
                        
                        // Forzar reactividadad
                        nextTick(() => {
                            console.log('Array después de eliminar:', formQuestions.value.length);
                        });
                    } else {
                        console.error('Error eliminando pregunta:', error.value);
                        alert('Error al eliminar la pregunta: ' + (error.value.message || 'Error desconocido'));
                    }
                } catch (err) {
                    console.error('Error inesperado eliminando pregunta:', err);
                    alert('Error inesperado al eliminar la pregunta');
                }
            } else {
                console.warn('No se pudo encontrar la pregunta guardada o no tiene ID. Pregunta encontrada:', pregunta);
            }
        }
    }

    // Exponer las funciones globalmente para que formsFunctions.js pueda usarlas
    window.agregarNuevaPreguntaVue = agregarNuevaPregunta;
    window.eliminarPreguntaVue = eliminarPreguntaVue;
    window.activarEdicionPregunta = activarEdicionPregunta; // Para debugging
    window.editingQuestions = editingQuestions; // Para debugging

    // Función para activar modo edición de una pregunta
    function activarEdicionPregunta(questionId, index) {
        console.log(`🔧 Activando edición para pregunta ID: ${questionId}, índice: ${index}`);
        console.log('Estado editingQuestions antes:', editingQuestions.value);
        console.log('Pregunta a editar:', formQuestions.value[index]);
        
        // Agregar a set de preguntas en edición
        editingQuestions.value.add(questionId);
        console.log('Estado editingQuestions después:', editingQuestions.value);
        
        // Guardar datos originales para poder cancelar
        const question = formQuestions.value[index];
        originalQuestionData.value[questionId] = {
            text: question.text,
            questionTypeId: question.questionType.id,
            questionOrder: question.questionOrder,
            options: question.options ? question.options.map(option => ({
                id: option.id,
                text: option.text,
                image: option.image
            })) : []
        };
        
        console.log('✅ Datos originales guardados:', originalQuestionData.value[questionId]);
        console.log('✅ isEditing() devuelve:', isEditing(questionId));
        
        // Usar la función de formsFunctions.js para activar los campos
        nextTick(() => {
            const contenedorPregunta = document.querySelector(`[data-question-id="${questionId}"]`);
            if (contenedorPregunta) {
                console.log('✅ Activando campos con formsFunctions.js para:', questionId);
                activarCamposPregunta(contenedorPregunta);
                
                // Configurar eventos para los botones creados por formsFunctions.js
                setTimeout(() => {
                    const botonGuardar = contenedorPregunta.querySelector('.questionSave');
                    if (botonGuardar) {
                        // Remover evento anterior y agregar el nuestro
                        const nuevoBotonGuardar = botonGuardar.cloneNode(true);
                        botonGuardar.parentNode.replaceChild(nuevoBotonGuardar, botonGuardar);
                        
                        nuevoBotonGuardar.addEventListener('click', () => {
                            guardarEdicionPregunta(questionId, index);
                        });
                    }
                    
                    // Configurar eventos para eliminar imágenes de opciones
                    const equisImagen = contenedorPregunta.querySelectorAll('.equisImg');
                    equisImagen.forEach(equis => {
                        equis.addEventListener('click', async function() {
                            console.log('Click en equis imagen');
                            const contenedorImagen = this.closest('.contImgOption');
                            console.log('Contenedor imagen:', contenedorImagen);
                            
                            if (contenedorImagen) {
                                // Buscar el contenedor de opción antes de eliminar la imagen
                                const contenedorOpcion = contenedorImagen.closest('.containerOption');
                                console.log('Contenedor opción:', contenedorOpcion);
                                
                                if (contenedorOpcion) {
                                    const opcionesContainer = contenedorOpcion.parentNode;
                                    const opcionIndex = Array.from(opcionesContainer.children).indexOf(contenedorOpcion);
                                    console.log('Índice de opción:', opcionIndex);
                                    
                                    // Obtener el ID de la opción para la API
                                    const question = formQuestions.value[index];
                                    if (question.options && question.options[opcionIndex] && question.options[opcionIndex].id) {
                                        const optionId = question.options[opcionIndex].id;
                                        console.log('Eliminando imagen de opción ID:', optionId);
                                        
                                        try {
                                            // Llamar API DELETE para eliminar imagen de opción
                                            const { data, error } = await useApi(`http://217.196.61.73:8082/api/options/${optionId}/image`, 'DELETE');
                                            
                                            if (error.value) {
                                                console.error('Error eliminando imagen de opción:', error.value);
                                                alert('Error al eliminar la imagen: ' + (error.value.message || 'Error desconocido'));
                                                return;
                                            }
                                            
                                            if (data.value?.success) {
                                                console.log('✅ Imagen eliminada exitosamente del microservicio');
                                                
                                                // Actualizar el modelo de Vue
                                                question.options[opcionIndex].image = null;
                                                console.log('Imagen eliminada del modelo Vue');
                                                
                                                // Eliminar visualmente la imagen
                                                contenedorImagen.remove();
                                                console.log('Imagen eliminada visualmente');
                                            }
                                            
                                        } catch (err) {
                                            console.error('Error inesperado eliminando imagen:', err);
                                            alert('Error inesperado al eliminar la imagen');
                                        }
                                    }
                                }
                            }
                        });
                    });
                    
                    // Configurar eventos para cambiar imágenes de opciones (click en imagen)
                    const imagenesOpciones = contenedorPregunta.querySelectorAll('.contImgOption img');
                    imagenesOpciones.forEach(imagen => {
                        imagen.addEventListener('click', function() {
                            console.log('Click en imagen de opción para cambiarla');
                            const contenedorImagen = this.closest('.contImgOption');
                            const contenedorOpcion = contenedorImagen?.closest('.containerOption');
                            
                            if (contenedorOpcion) {
                                const opcionesContainer = contenedorOpcion.parentNode;
                                const opcionIndex = Array.from(opcionesContainer.children).indexOf(contenedorOpcion);
                                
                                const question = formQuestions.value[index];
                                if (question.options && question.options[opcionIndex] && question.options[opcionIndex].id) {
                                    const optionId = question.options[opcionIndex].id;
                                    
                                    // Crear input file temporal
                                    const input = document.createElement('input');
                                    input.type = 'file';
                                    input.accept = 'image/*';
                                    
                                    input.onchange = async (event) => {
                                        const file = event.target.files[0];
                                        if (file) {
                                            console.log('Archivo seleccionado:', file.name);
                                            
                                            try {
                                                // Crear FormData para enviar archivo
                                                const formData = new FormData();
                                                formData.append('image', file);
                                                
                                                // Llamar API PUT para actualizar imagen de opción
                                                const { data, error } = await useApi(`http://217.196.61.73:8082/api/options/${optionId}/image`, 'PUT', formData, 'multipart/form-data');
                                                
                                                if (error.value) {
                                                    console.error('Error actualizando imagen de opción:', error.value);
                                                    alert('Error al actualizar la imagen: ' + (error.value.message || 'Error desconocido'));
                                                    return;
                                                }
                                                
                                                if (data.value?.success) {
                                                    console.log('✅ Imagen actualizada exitosamente en el microservicio');
                                                    
                                                    // Actualizar la imagen visualmente
                                                    const reader = new FileReader();
                                                    reader.onload = (e) => {
                                                        imagen.src = e.target.result;
                                                    };
                                                    reader.readAsDataURL(file);
                                                    
                                                    // Actualizar el modelo de Vue si es necesario
                                                    if (data.value.imageUrl) {
                                                        question.options[opcionIndex].image = {
                                                            url: data.value.imageUrl
                                                        };
                                                    }
                                                    
                                                    console.log('Imagen actualizada visualmente y en modelo Vue');
                                                }
                                                
                                            } catch (err) {
                                                console.error('Error inesperado actualizando imagen:', err);
                                                alert('Error inesperado al actualizar la imagen');
                                            }
                                        }
                                    };
                                    
                                    input.click();
                                }
                            }
                        });
                    });
                    
                    // Configurar eventos para eliminar opciones completas
                    const equisOpciones = contenedorPregunta.querySelectorAll('.equisOption');
                    equisOpciones.forEach(equis => {
                        equis.addEventListener('click', async function() {
                            console.log('Click en equis para eliminar opción completa');
                            const contenedorOpcion = this.closest('.containerOption');
                            console.log('Contenedor opción encontrado:', contenedorOpcion);
                            
                            if (contenedorOpcion) {
                                // Obtener el texto de la opción para encontrarla en el modelo
                                const inputOpcion = contenedorOpcion.querySelector('.inputOption');
                                const textoOpcion = inputOpcion ? inputOpcion.value : '';
                                console.log('Texto de opción encontrado:', textoOpcion);
                                
                                const question = formQuestions.value[index];
                                console.log('Opciones en el modelo:', question.options);
                                
                                // Buscar la opción por texto en el modelo de Vue
                                let opcionIndex = -1;
                                let optionId = null;
                                
                                if (question.options) {
                                    for (let i = 0; i < question.options.length; i++) {
                                        if (question.options[i].text === textoOpcion && question.options[i].id) {
                                            opcionIndex = i;
                                            optionId = question.options[i].id;
                                            break;
                                        }
                                    }
                                }
                                
                                console.log('Índice encontrado:', opcionIndex, 'ID:', optionId);
                                
                                if (opcionIndex >= 0 && optionId) {
                                    console.log('Eliminando opción ID:', optionId);
                                        
                                        // Confirmar eliminación
                                        if (confirm('¿Estás seguro de que quieres eliminar esta opción?')) {
                                            try {
                                                // Llamar API DELETE para eliminar opción completa
                                                const { data, error } = await useApi(`http://217.196.61.73:8082/api/options/${optionId}`, 'DELETE');
                                                
                                                if (error.value) {
                                                    console.error('Error eliminando opción:', error.value);
                                                    alert('Error al eliminar la opción: ' + (error.value.message || 'Error desconocido'));
                                                    return;
                                                }
                                                
                                                if (data.value?.success) {
                                                    console.log('✅ Opción eliminada exitosamente del microservicio');
                                                    
                                                    // Eliminar del modelo de Vue
                                                    question.options.splice(opcionIndex, 1);
                                                    console.log('Opción eliminada del modelo Vue');
                                                    
                                                    // Eliminar visualmente
                                                    contenedorOpcion.remove();
                                                    console.log('Opción eliminada visualmente');
                                                }
                                                
                                            } catch (err) {
                                                console.error('Error inesperado eliminando opción:', err);
                                                alert('Error inesperado al eliminar la opción');
                                            }
                                        }
                                } else {
                                    console.log('❌ Opción no encontrada en el modelo o sin ID');
                                }
                            } else {
                                console.log('❌ No se encontró contenedor de opción');
                            }
                        });
                    });
                    
                }, 100);
            } else {
                console.log('❌ No se encontró contenedor para questionId:', questionId);
            }
        });
        
        // Forzar re-render del componente
        formQuestions.value = [...formQuestions.value];
    }
    
    // Función para cancelar edición
    function cancelarEdicionPregunta(questionId, index) {
        console.log(`Cancelando edición para pregunta ID: ${questionId}`);
        
        // Restaurar datos originales
        const originalData = originalQuestionData.value[questionId];
        if (originalData) {
            const question = formQuestions.value[index];
            question.text = originalData.text;
            question.questionType.id = originalData.questionTypeId;
            question.questionOrder = originalData.questionOrder;
            
            // Restaurar opciones originales
            if (originalData.options && question.options) {
                originalData.options.forEach((originalOption, optIndex) => {
                    if (question.options[optIndex]) {
                        question.options[optIndex].text = originalOption.text;
                        question.options[optIndex].image = originalOption.image;
                    }
                });
            }
        }
        
        // Remover del set de edición
        editingQuestions.value.delete(questionId);
        delete originalQuestionData.value[questionId];
        
        // Usar la función de formsFunctions.js para bloquear los campos
        nextTick(() => {
            const contenedorPregunta = document.querySelector(`[data-question-id="${questionId}"]`);
            if (contenedorPregunta) {
                console.log('✅ Bloqueando campos con formsFunctions.js para:', questionId);
                bloquearCamposPregunta(contenedorPregunta);
            }
        });
        
        // Forzar re-render
        formQuestions.value = [...formQuestions.value];
    }
    
    // Función para guardar cambios de pregunta
    async function guardarEdicionPregunta(questionId, index) {
        console.log(`Guardando cambios para pregunta ID: ${questionId}, índice: ${index}`);
        
        try {
            const question = formQuestions.value[index];
            
            // Sincronizar con el DOM actual para asegurar que tenemos los valores más recientes
            const contenedorPregunta = document.querySelector(`[data-question-id="${questionId}"]`);
            if (contenedorPregunta) {
                const inputsOpciones = contenedorPregunta.querySelectorAll('.containerOption .inputOption');
                console.log('🔄 Sincronizando opciones con DOM...');
                inputsOpciones.forEach((input, i) => {
                    if (question.options[i] && input.value !== question.options[i].text) {
                        console.log(`📝 Actualizando opción ${i} desde DOM:`, {
                            viejo: question.options[i].text,
                            nuevo: input.value
                        });
                        question.options[i].text = input.value;
                    }
                });
            }
            
            // Preparar datos según la estructura solicitada
            const questionData = {
                questionTypeId: question.questionType.id,
                questionText: question.text,
                questionOrder: question.questionOrder
            };
            
            // Si la pregunta tiene opciones, incluirlas en la petición
            if (question.options && question.options.length > 0) {
                questionData.options = question.options.map(option => ({
                    id: option.id,
                    text: option.text,
                    image: option.image || null
                }));
            }
            
            // Primero actualizar opciones modificadas individualmente
            const originalData = originalQuestionData.value[questionId];
            console.log('📋 Datos originales guardados:', originalData);
            console.log('📋 Opciones actuales:', question.options);
            
            if (originalData && originalData.options && question.options) {
                console.log('🔄 Verificando opciones modificadas...');
                
                for (let i = 0; i < question.options.length; i++) {
                    const opcionActual = question.options[i];
                    const opcionOriginal = originalData.options[i];
                    
                    console.log(`🔍 Comparando opción ${i}:`, {
                        actual: opcionActual?.text,
                        original: opcionOriginal?.text,
                        tieneId: !!opcionActual?.id,
                        id: opcionActual?.id,
                        cambio: opcionActual?.text !== opcionOriginal?.text
                    });
                    
                    // Verificar si la opción cambió y tiene ID (no es nueva)
                    if (opcionActual && opcionOriginal && opcionActual.id && 
                        opcionActual.text !== opcionOriginal.text) {
                        
                        console.log(`🔧 Opción ${i} modificada:`, {
                            original: opcionOriginal.text,
                            actual: opcionActual.text,
                            id: opcionActual.id
                        });
                        
                        try {
                            // Actualizar opción individual con estructura correcta
                            const opcionData = {
                                optionText: opcionActual.text,
                                jump: opcionActual.jump || null  // Si no hay salto, enviar null
                            };
                            
                            console.log(`📤 Enviando a API:`, opcionData);
                            console.log(`🎯 URL completa:`, `http://217.196.61.73:8082/api/options/${opcionActual.id}`);
                            console.log(`🆔 ID de opción que se está editando:`, opcionActual.id);
                            console.log(`📝 Texto que se está enviando:`, opcionData.optionText);
                            console.log(`🔗 Objeto completo de la opción:`, opcionActual);
                            
                            const { data: optionData, error: optionError } = await useApi(
                                `http://217.196.61.73:8082/api/options/${opcionActual.id}`, 
                                'PUT', 
                                opcionData
                            );
                            
                            console.log(`📥 Respuesta del servidor:`, { data: optionData.value, error: optionError.value });
                            
                            if (optionError.value) {
                                console.error(`❌ Error actualizando opción ${opcionActual.id}:`, optionError.value);
                                console.log('⚠️ Microservicio no disponible, aplicando fallback local para opciones');
                                
                                // FALLBACK: Continuar sin actualizar en el servidor
                                // Los cambios ya están en el modelo local de Vue
                                console.log(`⚠️ Opción ${opcionActual.id} actualizada solo localmente`);
                                
                                // No hacer return aquí para continuar con otras opciones
                                continue;
                            }
                            
                            if (optionData.value?.success) {
                                console.log(`✅ Opción ${opcionActual.id} actualizada exitosamente`);
                            }
                            
                        } catch (err) {
                            console.error(`Error inesperado actualizando opción ${opcionActual.id}:`, err);
                            console.log('⚠️ Error de conexión, aplicando fallback local para opciones');
                            console.log(`⚠️ Opción ${opcionActual.id} actualizada solo localmente`);
                            
                            // Continuar con otras opciones en lugar de fallar completamente
                            continue;
                        }
                    }
                }
            }
            
            // Ahora actualizar la pregunta (sin opciones en el payload)
            const questionDataOnly = {
                questionTypeId: question.questionType.id,
                questionText: question.text,
                questionOrder: question.questionOrder
            };
            
            console.log('🌐 Enviando request PUT a:', `http://217.196.61.73:8082/api/questions/${questionId}`);
            console.log('📝 Datos de pregunta a enviar:', questionDataOnly);
            
            const { data, error } = await useApi(`http://217.196.61.73:8082/api/questions/${questionId}`, 'PUT', questionDataOnly);
            
            if (error.value) {
                console.error('❌ Error al actualizar pregunta:', error.value);
                alert('Error al guardar los cambios: ' + (error.value.message || 'Error desconocido'));
                return;
            }
            
            if (data.value?.success) {
                console.log('✅ Pregunta actualizada exitosamente en el microservicio');
                
                // Actualizar el array local con los cambios
                formQuestions.value[index] = {
                    ...question,
                    text: questionData.questionText,
                    questionType: {
                        ...question.questionType,
                        id: questionData.questionTypeId
                    },
                    questionOrder: questionData.questionOrder
                };
                
                // Remover del set de edición
                editingQuestions.value.delete(questionId);
                delete originalQuestionData.value[questionId];
                
                // Usar la función de formsFunctions.js para bloquear los campos
                nextTick(() => {
                    const contenedorPregunta = document.querySelector(`[data-question-id="${questionId}"]`);
                    if (contenedorPregunta) {
                        console.log('✅ Bloqueando campos con formsFunctions.js para:', questionId);
                        bloquearCamposPregunta(contenedorPregunta);
                    }
                });
                
                console.log('Edición completada exitosamente');
                console.log('📝 Estado final de opciones:', formQuestions.value[index].options?.map(opt => ({ id: opt.id, text: opt.text })));
            }
            
        } catch (err) {
            console.error('Error inesperado guardando pregunta:', err);
            alert('Error inesperado al guardar los cambios');
        }
    }
    
    // Función helper para verificar si una pregunta está en edición
    const isEditing = (questionId) => {
        return editingQuestions.value.has(questionId);
    }

    // Variables para drag and drop
    let draggedIndex = null
    
    // Funciones de drag and drop
    const handleDragStart = (event, index) => {
        draggedIndex = index
        event.dataTransfer.effectAllowed = 'move'
        event.target.classList.add('dragging')
        event.target.setAttribute('data-drag-text', 'Moviendo pregunta...')
        document.body.classList.add('dragging-active')
        console.log('Arrastrando pregunta desde índice:', index)
    }
    
    const handleDragOver = (event) => {
        event.preventDefault()
        event.dataTransfer.dropEffect = 'move'
    }
    
    const handleDragEnter = (event) => {
        event.preventDefault()
        event.target.classList.add('drag-over')
    }
    
    const handleDragLeave = (event) => {
        event.target.classList.remove('drag-over')
    }
    
    const handleDrop = (event, dropIndex) => {
        event.preventDefault()
        event.target.classList.remove('drag-over')
        
        if (draggedIndex === null || draggedIndex === dropIndex) {
            return
        }
        
        console.log('Soltando pregunta en índice:', dropIndex, 'desde:', draggedIndex)
        
        // Reordenar el array de preguntas
        const questionToMove = formQuestions.value[draggedIndex]
        
        // Remover de la posición original
        formQuestions.value.splice(draggedIndex, 1)
        
        // Insertar en la nueva posición
        const newIndex = draggedIndex < dropIndex ? dropIndex - 1 : dropIndex
        formQuestions.value.splice(newIndex, 0, questionToMove)
        
        // Actualizar questionOrder para todas las preguntas
        formQuestions.value.forEach((question, index) => {
            question.questionOrder = index + 1
        })
        
        console.log('Preguntas reordenadas. Nuevo orden:', formQuestions.value.map(q => ({
            id: q.id,
            text: q.text,
            questionOrder: q.questionOrder
        })))
        
        // Limpiar estado de drag
        draggedIndex = null
        document.querySelector('.dragging')?.classList.remove('dragging')
        document.body.classList.remove('dragging-active')
    }
    
    const handleDragEnd = (event) => {
        event.target.classList.remove('dragging')
        document.body.classList.remove('dragging-active')
        document.querySelectorAll('.drag-over').forEach(el => {
            el.classList.remove('drag-over')
        })
    }

    onMounted(async() => {
        console.log('DetailForm.vue onMounted ejecutándose con formId:', props.formId);
        getForm()

        try {
            questionTypes.value = await cargarTiposDePregunta();
        } catch (error) {
            console.error("Error cargando tipos de pregunta:", error);
        }

        // Cargar preguntas existentes del formulario (esperar a que el DOM esté listo)
        await nextTick();
        
        try {
            formQuestions.value = await cargarPreguntasExistentes(props.formId);
            
            if (formQuestions.value.length > 0) {
                // Ordenar las preguntas por questionOrder para mostrarlas en el orden correcto
                formQuestions.value.sort((a, b) => a.questionOrder - b.questionOrder);
                
                console.log(`Se cargaron ${formQuestions.value.length} preguntas existentes`);
                console.log('Preguntas existentes ordenadas:', JSON.stringify(formQuestions.value.map(q => ({id: q.id, order: q.questionOrder, text: q.text})), null, 2));
                
                // Esperar a que Vue renderice las preguntas y luego bloquear campos
                await nextTick();
                bloquearPreguntasExistentes();
            } else {
                console.log('Este formulario no tiene preguntas existentes');
                // Establecer que no hay preguntas existentes
                window.preguntasExistentes = 0;
            }
        } catch (error) {
            console.error("Error inesperado cargando preguntas:", error);
            formQuestions.value = []; // Asegurar que sea un array vacío
            window.preguntasExistentes = 0;
        } finally {
            // Delay mínimo para mostrar el skeleton (UX)
            await new Promise(resolve => setTimeout(resolve, 800))
            
            // Desactivar loading después de cargar (exitoso o con error)
            console.log('Desactivando loadingQuestions...')
            loadingQuestions.value = false;
            console.log('loadingQuestions ahora es:', loadingQuestions.value)
        }

        let contenedorPadreForm = document.querySelector('.contenedorSecConfAssistant')

        let scrollSpeed = 0;
        let scrollActive = false;

        // Función para hacer scroll automáticamente
        function autoScroll() {
            if (scrollSpeed !== 0) {
                window.scrollBy(0, scrollSpeed);
                requestAnimationFrame(autoScroll);
            } else {
                scrollActive = false;
            }
        }

        function handleDragMove(clientY) {
            const scrollThreshold = 100; // Margen para activar scroll
            const maxScrollSpeed = 10; // Velocidad máxima del scroll
            const headerHeight = 80; // Ajusta según el header

            const windowHeight = window.innerHeight;

            // Ajustar la velocidad del scroll
            if (clientY < scrollThreshold + headerHeight) {
                scrollSpeed = -Math.min(maxScrollSpeed, (scrollThreshold + headerHeight - clientY) / 3);
            } else if (windowHeight - clientY < scrollThreshold) {
                scrollSpeed = Math.min(maxScrollSpeed, (scrollThreshold - (windowHeight - clientY)) / 3);
            } else {
                scrollSpeed = 0;
            }

            if (!scrollActive && scrollSpeed !== 0) {
                scrollActive = true;
                requestAnimationFrame(autoScroll);
            }
        }

        // Evento cuando se arrastra sobre el contenedor (PC)
        contenedorPadreForm.addEventListener('dragover', e => {
            e.preventDefault();
            handleDragMove(e.clientY);

            const afterElement = getDragAfterElement(contenedorPadreForm, e.clientY);
            const dragging = document.querySelector('.dragging');

            if (dragging) {
                if (afterElement == null) {
                    contenedorPadreForm.appendChild(dragging);
                } else {
                    contenedorPadreForm.insertBefore(dragging, afterElement);
                }
            }
        });

        contenedorPadreForm.addEventListener('touchmove', e => {
            handleDragMove(e.touches[0].clientY);

            const afterElement = getDragAfterElement(contenedorPadreForm, e.touches[0].clientY);
            const dragging = document.querySelector('.dragging');

            if (dragging) {
                if (afterElement == null) {
                    contenedorPadreForm.appendChild(dragging);
                } else {
                    contenedorPadreForm.insertBefore(dragging, afterElement);
                }
            }
        }, { passive: false }); // <-- Cambia a false si necesitas llamar preventDefault()

        // Evento cuando se suelta el elemento (PC y móviles)
        function handleDropOrEnd() {
            scrollSpeed = 0; // Detiene el auto-scroll

            // Recalcular los números y el orden de todas las preguntas
            const preguntasActualizadas = [...contenedorPadreForm.querySelectorAll('.draggable')];
            preguntasActualizadas.forEach((pregunta, index) => {
                const nPregunta = pregunta.querySelector('.questionNumber');
                if (nPregunta) {
                    nPregunta.innerText = index + 1; // Actualizar el número de pregunta
                }
                pregunta.style.order = index + 1; // Actualizar el orden visual
            });
        }

        contenedorPadreForm.addEventListener('drop', handleDropOrEnd);
        contenedorPadreForm.addEventListener('dragend', handleDropOrEnd);
        contenedorPadreForm.addEventListener('touchend', handleDropOrEnd);
    })

</script>

<template>
    <section class="sectionGeneralConfAssistant">
        <h1>Detalle de formulario: {{ headerForm.name }}</h1>

        <div class="contenedorSecConfAssistant" v-if="formQuestions.length > 0">
            

            <div class="accountBlock">
                    
                <div class="divInput">
                    <label for="">Nombre del formulario</label>
                    <div class="inputIcon">
                        <input disabled type="text" class="inputSelectWoBorderOLeft" name="" :value="headerForm.name">
                    </div>
                </div>
                <div class="divInput">
                    <label for="">Descripción</label>
                    <div class="inputIcon">
                        <textarea v-model="headerForm.description" disabled name="" id="" rows="4"></textarea>
                    </div>
                </div>
                
            </div>

            <!-- Skeleton loader para preguntas -->
            <!-- Debug: loadingQuestions = {{ loadingQuestions }} -->
            <div v-if="loadingQuestions" class="w100">
                <div class="accountBlock padding1" v-for="n in 4" :key="'skeleton-' + n" style="margin-bottom: 1rem;">
                    <div class="skeleton skeleton-text skeleton-text-lg" style="width: 60%; margin-bottom: 1rem;"></div>
                    <div class="skeleton skeleton-input" style="width: 100%; margin-bottom: 0.5rem;"></div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div class="skeleton skeleton-select" style="width: 150px;"></div>
                        <div class="skeleton skeleton-button" style="width: 80px; height: 35px;"></div>
                    </div>
                </div>
            </div>

            <div 
                class="w100"
                v-for="(question, index) in formQuestions"
                v-show="!loadingQuestions"
                :key="question.id"
            >

                <!-- Casillas de Verificación -->
                <div 
                    class="accountBlock padding1 draggable"
                    draggable="true"
                    :data-saved="!question.id.toString().startsWith('temp-') ? 'true' : null"
                    :data-question-id="question.id"
                    @dragstart="handleDragStart($event, index)"
                    @dragover="handleDragOver($event)"
                    @drop="handleDrop($event, index)"
                    @dragenter="handleDragEnter($event)"
                    @dragleave="handleDragLeave($event)"
                    @dragend="handleDragEnd($event)"
                    v-if="question.questionType.id == 1" 
                > 
                    <div class="questionNumberBlock">
                        <div class="w33">.</div>
                        <i class="fa-solid fa-grip grab w33"></i>
                        <div class="questionNumber w33 fe">{{ index + 1 }}</div>
                    </div>
                    <div class="questionAndType">
                        <input type="text" name="" :value="question.text" :disabled="!question.id.toString().startsWith('temp-')">
                        <select name="" class="questionSelect" :disabled="!question.id.toString().startsWith('temp-')">
                            <option v-for="qType in questionTypes" :key="qType.id" :value="qType.id" :selected="qType.id === question.questionType.id">{{ qType.description }}</option>
                        </select>
                    </div>
                    <div class="optionsAnswer">
                        <div 
                            class="containerOption" 
                            v-for="option in question.options" 
                            :key="option.id"
                        >
                            <div class="bloqueOpcion">
                                <div class="cajaOption">
                                    <div class="rowOpt w100 optionTarget">
                                        <span class="checkboxSpan typeOption"></span>
                                        <input class="inputOption" type="text" v-model="option.text" :disabled="!isEditing(question.id)">
                                    </div>
                                    <div class="rowOpt equisMobile">
                                        <i class="fa-solid fa-xmark equisOption"></i>
                                    </div>
                                </div>
                                <div class="rowOpt">
                                    <div class="jumps">
                                        <p>Salto</p>
                                        <div class="btnYDesc">
                                            <div class="simBtnWithAnimation">
                                                <div class="circleMove"></div>
                                                <input class="inputCheck" type="checkbox" name="" id="">
                                            </div>                
                                        </div>
                                        <input class="questionNumberJump" type="number">
                                    </div>
                                    <label for="">
                                        <img src="/img/noImg.jpg" alt=""> 
                                        <input class="inputImgOption" hidden type="file" accept="image/*">
                                    </label>
                                </div>
                                <div class="rowOpt equisDesktop">
                                    <i class="fa-solid fa-xmark equisOption"></i>
                                </div>
                            </div>
                            <!-- Mostrar imagen si existe - al final del containerOption como en formsFunctions.js -->
                            <div v-if="option.image" class="contImgOption">
                                <div class="blockImgOp">
                                    <img :src="option.image.url" :alt="option.text">
                                    <i class="fa-solid fa-xmark equisImg"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="cajaOption">
                        <div class="rowOpt w100">
                            <span class="checkboxSpan typeOption"></span>
                            <div class="inputOption inputAddOption">Agregar una opción</div>
                        </div>
                        
                    </div>
                    <div class="sectionDeleteQuestion">
                        <i class="fa-solid fa-trash iconoEliminar"></i>
                    </div>
                
                </div>

                <!-- Seleccion Múltiple -->
                <div 
                    class="accountBlock padding1 draggable"
                    draggable="true"
                    :data-saved="!question.id.toString().startsWith('temp-') ? 'true' : null"
                    :data-question-id="question.id"
                    @dragstart="handleDragStart($event, index)"
                    @dragover="handleDragOver($event)"
                    @drop="handleDrop($event, index)"
                    @dragenter="handleDragEnter($event)"
                    @dragleave="handleDragLeave($event)"
                    @dragend="handleDragEnd($event)"
                    v-else-if="question.questionType.id == 2" 
                > 
                    <div class="questionNumberBlock">
                        <div class="w33">.</div>
                        <i class="fa-solid fa-grip grab w33"></i>
                        <div class="questionNumber w33 fe">{{ index + 1 }}</div>
                    </div>
                    <div class="questionAndType">
                        <input 
                            type="text" 
                            name="" 
                            v-model="question.text" 
                            :disabled="!question.id.toString().startsWith('temp-') && !isEditing(question.id)"
                        >
                        <select 
                            name="" 
                            class="questionSelect" 
                            v-model="question.questionType.id"
                            :disabled="!question.id.toString().startsWith('temp-') && !isEditing(question.id)"
                        >
                            <option v-for="qType in questionTypes" :key="qType.id" :value="qType.id">{{ qType.description }}</option>
                        </select>
                    </div>
                    <div class="optionsAnswer">
                        <div 
                            class="containerOption" 
                            v-for="option in question.options" 
                            :key="option.id"
                        >
                            <div class="bloqueOpcion">
                                <div class="cajaOption">
                                    <div class="rowOpt w100 optionTarget">
                                        <span class="radioSpan typeOption"></span>
                                        <input class="inputOption" type="text" v-model="option.text" :disabled="!isEditing(question.id)">
                                    </div>
                                    <div class="rowOpt equisMobile">
                                        <i class="fa-solid fa-xmark equisOption"></i>
                                    </div>
                                </div>
                                <div class="rowOpt">
                                    <div class="jumps">
                                        <p>Salto</p>
                                        <div class="btnYDesc">
                                            <div class="simBtnWithAnimation">
                                                <div class="circleMove"></div>
                                                <input class="inputCheck" type="checkbox" name="" id="">
                                            </div>                
                                        </div>
                                        <input class="questionNumberJump" type="number">
                                    </div>
                                    <label for="">
                                        <img src="/img/noImg.jpg" alt=""> 
                                        <input class="inputImgOption" hidden type="file" accept="image/*">
                                    </label>
                                </div>
                                <div class="rowOpt equisDesktop">
                                    <i class="fa-solid fa-xmark equisOption"></i>
                                </div>
                            </div>
                            <!-- Mostrar imagen si existe -->
                            <div v-if="option.image" class="contImgOption">
                                <div class="blockImgOp">
                                    <img :src="option.image.url" :alt="option.text">
                                    <i class="fa-solid fa-xmark equisImg"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="cajaOption">
                        <div class="rowOpt w100">
                            <span class="radioSpan typeOption"></span>
                            <div class="inputOption inputAddOption">Agregar una opción</div>
                        </div>
                    </div>
                    <div class="sectionDeleteQuestion">
                        <i class="fa-solid fa-trash iconoEliminar" v-if="!isEditing(question.id)"></i>
                        
                        <!-- Botón editar (solo para preguntas guardadas y no en edición) -->
                        <i class="fa-solid fa-pen-to-square iconoEliminar questionEdit" 
                           v-if="!question.id.toString().startsWith('temp-') && !isEditing(question.id)"
                           @click.prevent.stop="activarEdicionPregunta(question.id, index)"
                           style="cursor: pointer;"></i>
                        
                        <!-- Los botones de edición son manejados por formsFunctions.js -->
                    </div>   
                </div>

                <!-- Menú Desplegable -->
                <div 
                    class="accountBlock padding1 draggable"
                    draggable="true"
                    :data-saved="!question.id.toString().startsWith('temp-') ? 'true' : null"
                    :data-question-id="question.id"
                    @dragstart="handleDragStart($event, index)"
                    @dragover="handleDragOver($event)"
                    @drop="handleDrop($event, index)"
                    @dragenter="handleDragEnter($event)"
                    @dragleave="handleDragLeave($event)"
                    @dragend="handleDragEnd($event)"
                    v-else-if="question.questionType.id == 3" 
                > 
                    <div class="questionNumberBlock">
                        <div class="w33">.</div>
                        <i class="fa-solid fa-grip grab w33"></i>
                        <div class="questionNumber w33 fe">{{ index + 1 }}</div>
                    </div>
                    <div class="questionAndType">
                        <input type="text" name="" :value="question.text" :disabled="!question.id.toString().startsWith('temp-')">
                        <select name="" class="questionSelect" :disabled="!question.id.toString().startsWith('temp-')">
                            <option v-for="qType in questionTypes" :key="qType.id" :value="qType.id" :selected="qType.id === question.questionType.id">{{ qType.description }}</option>
                        </select>
                    </div>
                    <div class="optionsAnswer">
                        <div 
                            class="containerOption" 
                            v-for="option in question.options" 
                            :key="option.id"
                        >
                            <div class="bloqueOpcion">
                                <div class="cajaOption">
                                    <div class="rowOpt w100 optionTarget">
                                        <span class="simulationPointListItem typeOption"></span>
                                        <input class="inputOption" type="text" v-model="option.text" :disabled="!isEditing(question.id)">
                                    </div>
                                    <div class="rowOpt equisMobile">
                                        <i class="fa-solid fa-xmark equisOption"></i>
                                    </div>
                                </div>
                                <div class="rowOpt">
                                    <div class="jumps">
                                        <p>Salto</p>
                                        <div class="btnYDesc">
                                            <div class="simBtnWithAnimation">
                                                <div class="circleMove"></div>
                                                <input class="inputCheck" type="checkbox" name="" id="">
                                            </div>                
                                        </div>
                                        <input class="questionNumberJump" type="number">
                                    </div>
                                    <!-- Nota: Menú Desplegable no tiene opción de imagen según formsFunctions.js -->
                                </div>
                                <div class="rowOpt equisDesktop">
                                    <i class="fa-solid fa-xmark equisOption"></i>
                                </div>
                            </div>
                            <!-- Mostrar imagen si existe -->
                            <div v-if="option.image" class="contImgOption">
                                <div class="blockImgOp">
                                    <img :src="option.image.url" :alt="option.text">
                                    <i class="fa-solid fa-xmark equisImg"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="cajaOption">
                        <div class="rowOpt w100">
                            <span class="simulationPointListItem typeOption"></span>
                            <div class="inputOption inputAddOption">Agregar una opción</div>
                        </div>
                        
                    </div>

                    <div class="sectionDeleteQuestion">
                        <i class="fa-solid fa-trash iconoEliminar"></i>
                    </div> 
                </div>

                <!-- Numero -->
                <div 
                    class="accountBlock padding1 draggable"
                    draggable="true"
                    :data-saved="!question.id.toString().startsWith('temp-') ? 'true' : null"
                    :data-question-id="question.id"
                    @dragstart="handleDragStart($event, index)"
                    @dragover="handleDragOver($event)"
                    @drop="handleDrop($event, index)"
                    @dragenter="handleDragEnter($event)"
                    @dragleave="handleDragLeave($event)"
                    @dragend="handleDragEnd($event)"
                    v-else-if="question.questionType.id == 4" 
                > 
                    <div class="questionNumberBlock">
                        <div class="w33">.</div>
                        <i class="fa-solid fa-grip grab w33"></i>
                        <div class="questionNumber w33 fe">{{ index + 1 }}</div>
                    </div>
                    <div class="questionAndType noBorder">
                        <input type="text" name="" :value="question.text" :disabled="!question.id.toString().startsWith('temp-')">
                        <select name="" class="questionSelect" :disabled="!question.id.toString().startsWith('temp-')">
                            <option v-for="qType in questionTypes" :key="qType.id" :value="qType.id" :selected="qType.id === question.questionType.id">{{ qType.description }}</option>
                        </select>
                    </div>
                    <div class="sectionDeleteQuestion">
                        <i class="fa-solid fa-trash iconoEliminar"></i>
                    </div>
                </div>

                <!-- Respuesta Corta -->
                <div 
                    class="accountBlock padding1 draggable"
                    draggable="true"
                    :data-saved="!question.id.toString().startsWith('temp-') ? 'true' : null"
                    :data-question-id="question.id"
                    @dragstart="handleDragStart($event, index)"
                    @dragover="handleDragOver($event)"
                    @drop="handleDrop($event, index)"
                    @dragenter="handleDragEnter($event)"
                    @dragleave="handleDragLeave($event)"
                    @dragend="handleDragEnd($event)"
                    v-else-if="question.questionType.id == 5" 
                > 
                    <div class="questionNumberBlock">
                        <div class="w33">.</div>
                        <i class="fa-solid fa-grip grab w33"></i>
                        <div class="questionNumber w33 fe">{{ index + 1 }}</div>
                    </div>
                    <div class="questionAndType noBorder">
                        <input type="text" name="" :value="question.text" :disabled="!question.id.toString().startsWith('temp-')">
                        <select name="" class="questionSelect" :disabled="!question.id.toString().startsWith('temp-')">
                            <option v-for="qType in questionTypes" :key="qType.id" :value="qType.id" :selected="qType.id === question.questionType.id">{{ qType.description }}</option>
                        </select>
                    </div>
                    <div class="sectionDeleteQuestion">
                        <i class="fa-solid fa-trash iconoEliminar"></i>
                    </div>
                </div>

                <!-- Párrafo -->
                <div 
                    class="accountBlock padding1 draggable"
                    draggable="true"
                    :data-saved="!question.id.toString().startsWith('temp-') ? 'true' : null"
                    :data-question-id="question.id"
                    @dragstart="handleDragStart($event, index)"
                    @dragover="handleDragOver($event)"
                    @drop="handleDrop($event, index)"
                    @dragenter="handleDragEnter($event)"
                    @dragleave="handleDragLeave($event)"
                    @dragend="handleDragEnd($event)"
                    v-else-if="question.questionType.id == 6" 
                > 
                    <div class="questionNumberBlock">
                        <div class="w33">.</div>
                        <i class="fa-solid fa-grip grab w33"></i>
                        <div class="questionNumber w33 fe">{{ index + 1 }}</div>
                    </div>
                    <div class="questionAndType noBorder">
                        <input type="text" name="" :value="question.text" :disabled="!question.id.toString().startsWith('temp-')">
                        <select name="" class="questionSelect" :disabled="!question.id.toString().startsWith('temp-')">
                            <option v-for="qType in questionTypes" :key="qType.id" :value="qType.id" :selected="qType.id === question.questionType.id">{{ qType.description }}</option>
                        </select>
                    </div>
                    <div class="sectionDeleteQuestion">
                        <i class="fa-solid fa-trash iconoEliminar"></i>
                    </div> 
                </div>

                <!-- Carga de Archivos -->
                <div 
                    class="accountBlock padding1 draggable"
                    draggable="true"
                    :data-saved="!question.id.toString().startsWith('temp-') ? 'true' : null"
                    :data-question-id="question.id"
                    @dragstart="handleDragStart($event, index)"
                    @dragover="handleDragOver($event)"
                    @drop="handleDrop($event, index)"
                    @dragenter="handleDragEnter($event)"
                    @dragleave="handleDragLeave($event)"
                    @dragend="handleDragEnd($event)"
                    v-else-if="question.questionType.id == 7" 
                > 
                    <div class="questionNumberBlock">
                        <div class="w33">.</div>
                        <i class="fa-solid fa-grip grab w33"></i>
                        <div class="questionNumber w33 fe">{{ index + 1 }}</div>
                    </div>
                    <div class="questionAndType">
                        <input type="text" name="" :value="question.text" :disabled="!question.id.toString().startsWith('temp-')">
                        <select name="" class="questionSelect" :disabled="!question.id.toString().startsWith('temp-')">
                            <option v-for="qType in questionTypes" :key="qType.id" :value="qType.id" :selected="qType.id === question.questionType.id">{{ qType.description }}</option>
                        </select>
                    </div>
                    <div class="optionsAnswer">
                        <div class="cajaOption">
                            <p>Permitir solo tipos de archivos especificos</p>
                            <div class="btnYDesc">
                                <div class="simBtnWithAnimation btnSpecificFile">
                                    <div class="circleMove"></div>
                                    <input class="inputCheck" type="checkbox" name="" id="">
                                </div>                
                            </div>
                        </div>
                        
                        <div class="cajaOption none checkboxesBlock">
                            <div class="gridCajaOption">
                                <div class="cajaOption">
                                    <input type="checkbox" class="checkboxReal">
                                    <p>Video</p>
                                </div>
                                <div class="cajaOption">
                                    <input type="checkbox" class="checkboxReal">
                                    <p>Imagen</p>
                                </div>
                                <div class="cajaOption">
                                    <input type="checkbox" class="checkboxReal">
                                    <p>Documento</p>
                                </div>
                            </div>
                            
                        </div>

                        <div class="cajaOption">
                            <p>Cantidad maxima de archivos</p>
                            <input class="numberInput" type="number" name="" value="1">
                        </div>

                        <div class="sectionDeleteQuestion">
                            <i class="fa-solid fa-trash iconoEliminar"></i>
                        </div>
                    </div>
                </div>
                
            </div>
            <section class="adminBarFormsContainer">
                <div class="adminBarForms" @click="handleAddQuestion($event.currentTarget.parentNode.parentNode)" :class="{ 'loading': isCreatingQuestion }">
                    <i v-if="!isCreatingQuestion" class="fa-regular fa-square-plus"></i>
                    <div v-else class="loader-spinner">
                        <i class="fa-solid fa-spinner fa-spin"></i>
                        <span>Validando...</span>
                    </div>
                </div>
            </section>



            
        </div>

        <div class="contenedorSecConfAssistant" v-else>
            <div class="accountBlock">
                    
                <div class="divInput">
                    <label for="">Nombre del formulario</label>
                    <div class="inputIcon">
                        <input disabled type="text" class="inputSelectWoBorderOLeft" name="" :value="headerForm.name">
                    </div>
                </div>
                <div class="divInput">
                    <label for="">Descripción</label>
                    <div class="inputIcon">
                        <textarea v-model="headerForm.description" disabled name="" id="" rows="4"></textarea>
                    </div>
                </div>
                
            </div>

            <section class="adminBarFormsContainer">
                <div class="adminBarForms" @click="handleAddQuestion($event.currentTarget.parentNode.parentNode)" :class="{ 'loading': isCreatingQuestion }">
                    <i v-if="!isCreatingQuestion" class="fa-regular fa-square-plus"></i>
                    <div v-else class="loader-spinner">
                        <i class="fa-solid fa-spinner fa-spin"></i>
                        <span>Validando...</span>
                    </div>
                </div>
            </section>
        </div>
        

    </section>
</template>

<style scoped>
/* Los estilos de .contImgOption y .blockImgOp ya están definidos globalmente */
/* No necesitamos definir estilos adicionales para que se vea igual al modo creación */

/* Estilos para el loader del botón agregar pregunta */
.adminBarForms.loading {
    pointer-events: none;
    opacity: 0.7;
    cursor: not-allowed;
}

.loader-spinner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: #666;
}

.loader-spinner i {
    font-size: 18px;
    color: #007bff;
}

.loader-spinner span {
    font-weight: 500;
    white-space: nowrap;
}

/* Animación suave para la transición */
.adminBarForms {
    transition: opacity 0.3s ease;
}

/* Estilos para drag and drop */
.draggable {
    cursor: grab;
    transition: all 0.2s ease;
}

.draggable:active {
    cursor: grabbing;
}

.dragging {
    opacity: 0.7;
    transform: scale(0.95);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
    z-index: 1000;
    position: relative;
}

.dragging::before {
    content: attr(data-drag-text);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.95);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    color: #007bff;
    border-radius: 6px;
    z-index: 1001;
}

.dragging > * {
    visibility: hidden;
}

.drag-over {
    border: 2px dashed #007bff;
    background-color: rgba(0, 123, 255, 0.1);
    transform: scale(1.02);
}

/* Durante el drag, evitar que elementos hijos interfieran */
.draggable.drag-over > * {
    pointer-events: none;
}

/* Durante el drag activo global, desactivar hover de elementos internos */
body.dragging-active .draggable:not(.dragging) > * {
    pointer-events: none;
}

.draggable:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Estilos para botones de edición usando estilos base de iconoEliminar */
.edit-buttons {
    display: flex;
    gap: 8px;
    align-items: center;
}

/* Botón guardar - hereda estilos de iconoEliminar y agrega color verde */
.cassette-save {
    color: #059669 !important;
}

.cassette-save:hover {
    color: #047857 !important;
    transform: scale(1.1);
}

/* Botón cancelar - hereda estilos de iconoEliminar y agrega color rojo */
.cassette-cancel {
    color: #dc2626 !important;
}

.cassette-cancel:hover {
    color: #b91c1c !important;
    transform: scale(1.1);
}
</style>


