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
        mostrarPreguntaExistente
    } from '/src/js/formsFunctions.js'
    
    // Importar funciones desde formsFunctions.js
    import { bloquearCamposPregunta, activarCamposPregunta, agregarOpcion, asignarEventoClickAgregarOpcion, asignarEventoChangeSelectTipoPregunta, eliminarPregunta } from '/src/js/formsFunctions.js'
    
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
            
            // Asignar evento editar a preguntas existentes
            const iconoEditar = pregunta.querySelector('.questionEdit');
            if (iconoEditar) {
                console.log(`Asignando evento editar a pregunta existente ${index + 1}`);
                iconoEditar.addEventListener('click', (event) => {
                    event.preventDefault();
                    const contenedorPregunta = event.currentTarget.parentNode.parentNode;
                    console.log('Activando campos para edición...');
                    activarCamposPregunta(contenedorPregunta);
                });
            }
            
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

    // Función para eliminar pregunta (nueva o guardada)
    async function eliminarPreguntaVue(contenedorPregunta) {
        console.log('Eliminando pregunta...');
        
        // Identificar si es pregunta nueva o guardada por el atributo data-saved
        const esNueva = !contenedorPregunta.hasAttribute('data-saved');
        
        if (esNueva) {
            console.log('Eliminando pregunta nueva (solo del DOM)...');
            
            // Buscar la pregunta en el array reactivo por ID temporal
            const todasLasPreguntas = document.querySelectorAll('.draggable');
            const indexPregunta = Array.from(todasLasPreguntas).indexOf(contenedorPregunta);
            
            if (indexPregunta !== -1) {
                // Eliminar del array reactivo
                formQuestions.value.splice(indexPregunta, 1);
                console.log('Pregunta nueva eliminada del array reactivo');
            }
        } else {
            console.log('Eliminando pregunta guardada (API + DOM)...');
            
            // Buscar el ID de la pregunta guardada
            const indexPregunta = Array.from(document.querySelectorAll('.draggable')).indexOf(contenedorPregunta);
            const pregunta = formQuestions.value[indexPregunta];
            
            if (pregunta && pregunta.id) {
                try {
                    console.log(`Llamando API para eliminar pregunta ID: ${pregunta.id}`);
                    
                    // Llamar al endpoint de eliminación
                    const {data, error} = await useApi(`/api/questions/${pregunta.id}`, 'DELETE');
                    
                    if (!error.value) {
                        console.log('Pregunta eliminada exitosamente del servidor');
                        
                        // Eliminar del array reactivo
                        formQuestions.value.splice(indexPregunta, 1);
                        console.log('Pregunta eliminada del array reactivo');
                    } else {
                        console.error('Error eliminando pregunta:', error.value);
                        alert('Error al eliminar la pregunta: ' + (error.value.message || 'Error desconocido'));
                    }
                } catch (err) {
                    console.error('Error inesperado eliminando pregunta:', err);
                    alert('Error inesperado al eliminar la pregunta');
                }
            }
        }
    }

    // Exponer las funciones globalmente para que formsFunctions.js pueda usarlas
    window.agregarNuevaPreguntaVue = agregarNuevaPregunta;
    window.eliminarPreguntaVue = eliminarPreguntaVue;

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

            <section class="adminBarFormsContainer">
                <div class="adminBarForms" @click="validarPreguntaAnterior($event.currentTarget.parentNode.parentNode,props.formId)">
                    <i class="fa-regular fa-square-plus"></i>
                </div>
            </section>

            

            <div 
                class="w100"
                v-for="(question, index) in formQuestions"
                :key="question.id"
            >

                <!-- Casillas de Verificación -->
                <div 
                    class="accountBlock padding1 draggable"
                    draggable="true"
                    :data-saved="!question.id.toString().startsWith('temp-') ? 'true' : null"
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
                    v-else-if="question.questionType.id == 2" 
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
                                        <span class="radioSpan typeOption"></span>
                                        <input class="inputOption" type="text" :value="option.text" disabled>
                                    </div>
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
                        <i class="fa-solid fa-trash iconoEliminar"></i>
                        <i class="fa-solid fa-pen-to-square iconoEliminar questionEdit" v-if="!question.id.toString().startsWith('temp-')"></i>
                    </div>   
                </div>

                <!-- Menú Desplegable -->
                <div 
                    class="accountBlock padding1 draggable"
                    draggable="true"
                    :data-saved="!question.id.toString().startsWith('temp-') ? 'true' : null"
                    v-else-if="question.questionType.id == 3" 
                > 
                    <div class="questionNumberBlock">
                        <div class="w33">.</div>
                        <i class="fa-solid fa-grip grab w33"></i>
                        <div class="questionNumber w33 fe"></div>
                    </div>
                    <div class="questionAndType">
                        <input type="text" name="" placeholder="Pregunta">
                        <select name="" class="questionSelect">
                        
                        </select>

                    </div>
                    <div class="optionsAnswer">
                        
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
                    v-else-if="question.questionType.id == 4" 
                > 
                    <div class="questionNumberBlock">
                        <div class="w33">.</div>
                        <i class="fa-solid fa-grip grab w33"></i>
                        <div class="questionNumber w33 fe"></div>
                    </div>
                    <div class="questionAndType noBorder">
                        <input type="text" name="" placeholder="Pregunta">
                        <select name="" class="questionSelect">
                        
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
                    v-else-if="question.questionType.id == 5" 
                > 
                    <div class="questionNumberBlock">
                        <div class="w33">.</div>
                        <i class="fa-solid fa-grip grab w33"></i>
                        <div class="questionNumber w33 fe"></div>
                    </div>
                    <div class="questionAndType noBorder">
                        <input type="text" name="" placeholder="Pregunta">
                        <select name="" class="questionSelect">
                        
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
                    v-else-if="question.questionType.id == 6" 
                > 
                    <div class="questionNumberBlock">
                        <div class="w33">.</div>
                        <i class="fa-solid fa-grip grab w33"></i>
                        <div class="questionNumber w33 fe"></div>
                    </div>
                    <div class="questionAndType noBorder">
                        <input type="text" name="" placeholder="Pregunta">
                        <select name="" class="questionSelect">
                        
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
                    v-else-if="question.questionType.id == 7" 
                > 
                    <div class="questionNumberBlock">
                        <div class="w33">.</div>
                        <i class="fa-solid fa-grip grab w33"></i>
                        <div class="questionNumber w33 fe"></div>
                    </div>
                    <div class="questionAndType">
                        <input type="text" name="" placeholder="Pregunta">
                        <select name="" class="questionSelect">
                    
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
                <div class="adminBarForms" @click="validarPreguntaAnterior($event.currentTarget.parentNode.parentNode,props.formId)">
                    <i class="fa-regular fa-square-plus"></i>
                </div>
            </section>
        </div>
        

    </section>
</template>






