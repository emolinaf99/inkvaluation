<script setup>
    import {reactive, ref, onMounted, watch} from 'vue'
    import {checkOptAssistant} from '/src/js/checkOpt.js'
    import {useApi} from '/src/js/useFetch.js'
    import {
        cargarTiposDePregunta,
        validarPreguntaAnterior,
        getDragAfterElement
    } from '/src/js/formsFunctions.js'

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

    onMounted(async() => {
        getForm()

        try {
            questionTypes.value = await cargarTiposDePregunta(); // Llama a la función cuando el componente se monta
        } catch (error) {
            console.error("Error cargando tipos de pregunta:", error);
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

        <div class="contenedorSecConfAssistant">
            

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






