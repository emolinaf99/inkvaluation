import {useApi} from '/src/js/useFetch.js'
import {mostrarFileEnImgPreview} from '/src/js/previewFile.js'
import {checkOptAssistant} from '/src/js/checkOpt.js'
import {mostrarNotificacion} from '@/js/notificationsRequest'
import {toRaw} from 'vue'

// Llama a la función de `useApi` para obtener los datos
export async function  cargarTiposDePregunta() {
    const url = '/api/question-types'
    const { data, error, loading } = await useApi(url);
    if (data.value) {
        return data.value
    }
};

// Generar las opciones para el select
const generarOpcionesSelect = async (select) => {
    let questionTypes = await cargarTiposDePregunta()
    
    if (Array.isArray(questionTypes)) {
        questionTypes.forEach(tipo => {
            console.log(tipo);
            let option = document.createElement('option');
            option.value = tipo.id;
            option.textContent = tipo.description;
            select.appendChild(option);
        });
    }
};

function seleccionarOpcionDePregunta(select, valorASeleccionar) { 
    for (let i = 0; i < select.options.length; i++) {
        if (select.options[i].value == valorASeleccionar) {
            select.selectedIndex = i;
            break;
        }
    }
}

let formatoPregunta = `
    <div class="accountBlock padding1 draggable" draggable="true">
        
    </div>
`

let formatoPreguntaParrafo = `
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
    
`

let formatoPreguntaRespuestaCorta = `
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
        
    
`

let formatoPreguntaCasillasVerificacion = `
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
            <span class="checkboxSpan typeOption"></span>
            <div class="inputOption inputAddOption">Agregar una opción</div>
        </div>
        
    </div>
    <div class="sectionDeleteQuestion">
        <i class="fa-solid fa-trash iconoEliminar"></i>
    </div>
        
    
`

let formatoPreguntaOpcionMultiple = `

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
        
            <span class="radioSpan typeOption"></span>
            <div class="inputOption inputAddOption">Agregar una opción</div>
        </div>
        
    </div>
    <div class="sectionDeleteQuestion">
        <i class="fa-solid fa-trash iconoEliminar"></i>
    </div>   
        
    
`

let formatoPreguntaListaDesplegable = `
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
    
`

let formatoPreguntaCargaArchivos = `
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
        
    
`

let formatoNumero = `
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
`

// Determina el elemento después del cual se debe insertar / arrastrar pregunta
export function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')];
    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - (box.top + box.height / 2);
        //en offset la referencia es el punto medio del elemento, lo que significa que el intercambio solo ocurrirá cuando el arrastrado cruce la mitad del otro.
        
        if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
        } else {
        return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function asignarEventoChangeSelectTipoPregunta(select) {
    
    // Añade el listener del evento change al select
    select.addEventListener('change', async function(event) {
        let tipoDePregunta = event.target.value;
        let elementoDOM = event.currentTarget.parentNode.parentNode;

        
        cambiarTipoDePregunta(tipoDePregunta, elementoDOM);
    });
}

// Función para mover el scroll al final
function ScrollAlFinal() {
    window.scrollTo({
        top: document.body.scrollHeight, // Altura total del contenido
        behavior: 'smooth' // Movimiento suave
    });
}

function moverAlFinalBtnAgregarPregunta() {
    let btnAgregarPregunta = document.querySelector('.adminBarFormsContainer')
    let contador = document.querySelectorAll('.questionNumber').length + 1

    btnAgregarPregunta.style.order = contador

    ScrollAlFinal()
}

// Asignar orden y numero de pregunta
function asignarNumeroPregunta(contenedor,bloqueNumero) {
    let contador = contenedor ? document.querySelectorAll('.questionNumber').length - 1 : 0

    contenedor.style.order =  contador + 1; 
    bloqueNumero.innerText = contador + 1
   
}

// Ajustar orden y numero de pregunta
function ajustarNumeroPreguntas(enumeracionPregunta) {
    let enumeracionPreguntas = document.querySelectorAll('.questionNumber')
    let enumeracionesSinPreguntaEliminada = Array.from(enumeracionPreguntas).filter(enumeracion => enumeracion != enumeracionPregunta)

    for (let index = 0; index < enumeracionesSinPreguntaEliminada.length; index++) {
        const element = enumeracionesSinPreguntaEliminada[index]
        const contenedor = element.parentNode.parentNode
        
        contenedor.style.order =  index + 1; 
        element.innerText = index + 1
   
    }
}

async function agregarPregunta(contenedorReceptor) {
    // Contenedor receptor es el contenedor que va a recibir el formato
    contenedorReceptor.insertAdjacentHTML('beforeend', formatoPregunta);

    // Ventajas de insertAdjacentHTML 
    // Mantiene el rendimiento porque solo inserta el nuevo contenido sin reconstruir todo el DOM.
    // Preserva los eventos y estados de los elementos que ya están dentro del contenedor.

    // Obtén el último bloque de pregunta insertado
    let nuevoBloquePregunta = contenedorReceptor.querySelector('.accountBlock:last-child');

    nuevoBloquePregunta.insertAdjacentHTML('beforeend', formatoPreguntaOpcionMultiple);

    // // Obtén el último select insertado
    let nuevoSelect = contenedorReceptor.querySelector('.accountBlock:last-child select');
    
    await generarOpcionesSelect(nuevoSelect)

    //agrega eventos para arrastrar
    nuevoBloquePregunta.addEventListener('dragstart', () => {
        nuevoBloquePregunta.classList.add('dragging'); // Estilo al arrastrar
    });

    nuevoBloquePregunta.addEventListener('dragend', () => {
        nuevoBloquePregunta.classList.remove('dragging');
    });

    // Agregar numeracion y orden a la nueva pregunta
    let numeroPregunta = nuevoBloquePregunta.querySelector('.questionNumber')
    asignarNumeroPregunta(nuevoBloquePregunta,numeroPregunta)
    
    //Obtener icono eliminar en elementoDOM
    let iconoEliminar = nuevoBloquePregunta.querySelector('.iconoEliminar')

    // Obtener input agregarOpcion
    let inputAgregarOpcion = nuevoBloquePregunta.querySelector('.inputAddOption')
    
    moverAlFinalBtnAgregarPregunta()
    seleccionarOpcionDePregunta(nuevoSelect,2) 
    asignarEventoChangeSelectTipoPregunta(nuevoSelect)
    asignarEventoClickEliminarPregunta(iconoEliminar)
    asignarEventoClickAgregarOpcion(inputAgregarOpcion)

    // Agregar la primera opción por defecto
    agregarOpcion(nuevoBloquePregunta);
    
}

async function enviarPregunta(formData,ultimaPregunta,contenedorReceptor) {

    bloquearCamposPregunta(ultimaPregunta)

    // const url = 'http://217.196.61.73:8082/api/questions';
    // const method = 'POST'; 
    // const contentType = 'multipart/form-data';

    // // Asegurar que esperas la respuesta de useApi
    // const { data, error, loading } = await useApi(url, method, formData, contentType);

    // if (error.value) {
    //     console.error('Error en la solicitud:', error.value);
    //     mostrarNotificacion('Error creando pregunta',0)
    // } else {

    //     mostrarNotificacion('Pregunta creada exitosamente',1)
    //     bloquearCamposPregunta(ultimaPregunta)
    //     agregarPregunta(contenedorReceptor)
    // }
}

function activarCamposPregunta(contenedorPregunta) {
    const inputPregunta = contenedorPregunta.querySelector('.questionAndType input');
    const selectTipoPregunta = contenedorPregunta.querySelector('.questionSelect');
    const contenedoresOpciones = contenedorPregunta.querySelectorAll('.containerOption');
    const agregarOpcion = contenedorPregunta.querySelector('.inputAddOption');
    let equises = contenedorPregunta.querySelectorAll('.equisOption');
    const contenedorIconos = contenedorPregunta.querySelector('.sectionDeleteQuestion')

    // Habilitar input y select
    if (inputPregunta) inputPregunta.disabled = false;
    if (selectTipoPregunta) selectTipoPregunta.disabled = false;

    // Mostrar las X
    equises.forEach(equis => equis.classList.remove('none'));

    // Asignar eventos a opciones
    contenedoresOpciones.forEach(contenedorOpcion => {
        // Habilitar input dentro de contenedor
        const inputOption = contenedorOpcion.querySelector('.inputOption');
        if (inputOption) inputOption.disabled = false;
        agregarEventosOpcion(contenedorOpcion)
    });

    // Eliminar eventos del botón "agregar opción" y mostrar
    asignarEventoClickAgregarOpcion(agregarOpcion)
    agregarOpcion.parentNode.parentNode.classList.remove('none')


    // Eliminar icono editar y agregar icono Guardar
    let iconoEditar = contenedorPregunta.querySelector('.questionEdit')
    if(iconoEditar) iconoEditar.remove()

    let formatoIconoGuardar = `<i class="fa-solid fa-floppy-disk questionSave"></i>`
    contenedorIconos.innerHTML += formatoIconoGuardar;
    let iconosGuardar = document.querySelectorAll('.questionSave')
    let ultimoIconoGuardar = iconosGuardar[iconosGuardar.length - 1]

    ultimoIconoGuardar.addEventListener('click',() => {
        bloquearCamposPregunta(contenedorPregunta)
    })
    
}

function bloquearCamposPregunta(contenedorPregunta) {
    const inputPregunta = contenedorPregunta.querySelector('.questionAndType input');
    const selectTipoPregunta = contenedorPregunta.querySelector('.questionSelect');
    const contenedoresOpciones = contenedorPregunta.querySelectorAll('.containerOption');
    const agregarOpcion = contenedorPregunta.querySelector('.inputAddOption');
    let equises = contenedorPregunta.querySelectorAll('.equisOption');
    const contenedorIconos = contenedorPregunta.querySelector('.sectionDeleteQuestion')

    // Deshabilitar input y select
    if (inputPregunta) inputPregunta.disabled = true;
    if (selectTipoPregunta) selectTipoPregunta.disabled = true;

    // Ocultar las X antes de reemplazar los contenedores
    equises.forEach(equis => equis.classList.add('none'));

    // Clonar y reemplazar opciones
    contenedoresOpciones.forEach(contenedorOpcion => {
        const nuevoContenedor = contenedorOpcion.cloneNode(true);

        // Deshabilitar inputs dentro del clon
        const inputOption = nuevoContenedor.querySelector('.inputOption');
        if (inputOption) inputOption.disabled = true;

        contenedorOpcion.replaceWith(nuevoContenedor);
    });

    // Eliminar eventos del botón "agregar opción" y ocultar
    if (agregarOpcion) {
        let nuevoAgregarOpcion = agregarOpcion.cloneNode(true);
        agregarOpcion.replaceWith(nuevoAgregarOpcion);
        nuevoAgregarOpcion.parentNode.parentNode.classList.add('none')
    }

    // Volver a obtener las nuevas equis después de reemplazar los contenedores
    equises = contenedorPregunta.querySelectorAll('.equisOption');

    equises.forEach(equis => equis.classList.add('none'));


    // Eliminar icono guardar si existe y adicionar icono editar 
    let iconoGuardar = contenedorPregunta.querySelector('.questionSave')
    if(iconoGuardar) iconoGuardar.remove()

    let formatoIconoEditar = `<i class="fa-solid fa-pen-to-square questionEdit"></i>`
    contenedorIconos.innerHTML += formatoIconoEditar;
    let iconosEditar = document.querySelectorAll('.questionEdit')
    let ultimoIconoEditar = iconosEditar[iconosEditar.length - 1]

    ultimoIconoEditar.addEventListener('click',() => {
        activarCamposPregunta(contenedorPregunta)
    })

}

export function validarPreguntaAnterior(contenedorReceptor, formId) {
    let preguntas = contenedorReceptor.querySelectorAll('.draggable');
    
    if (preguntas.length > 0) {
        const ultimaPregunta = preguntas[preguntas.length -1];
        const inputPregunta = ultimaPregunta.querySelector('.questionAndType input');
        const selectTipoPregunta = ultimaPregunta.querySelector('.questionSelect');
        const contenedoresOpciones = ultimaPregunta.querySelectorAll('.containerOption');
        const ordenPregunta = ultimaPregunta.querySelector('.questionNumber');
        const btnArchivosEspecificos = ultimaPregunta.querySelector('.btnSpecificFile')

        // Resetear estilos antes de validar errores
        inputPregunta.style.border = '1px solid #d9d9d9';
        selectTipoPregunta.style.border = '1px solid #d9d9d9';

        let arrayErrores = [];
        let formData = new FormData();
        let optionsArray = [];
        let arrayFiles = [];

        // Validaciones básicas
        if (inputPregunta.value.length === 0) arrayErrores.push(inputPregunta);
        if (selectTipoPregunta.value === "0") arrayErrores.push(selectTipoPregunta);

        if (contenedoresOpciones.length > 0) {
            contenedoresOpciones.forEach((contenedorOpcion, index) => {
                const inputOpcion = contenedorOpcion.querySelector('.optionTarget input');
                const inputCheckSalto = contenedorOpcion.querySelector('.inputCheck');
                const inputNumeroSalto = contenedorOpcion.querySelector('.questionNumberJump');
                const itemOption = contenedorOpcion.querySelector('.typeOption');
                const seccionSalto = contenedorOpcion.querySelector('.jumps');
                const inputImgOption = contenedorOpcion.querySelector('.inputImgOption');

                // Resetear estilos antes de validar errores
                if(itemOption.classList.contains('simulationPointListItem')) {
                    itemOption.style.backgroundColor = 'black';
                } else {
                    itemOption.style.border = '1px solid #d9d9d9';
                }
                
                inputNumeroSalto.style.border = '1px solid #d9d9d9';

                if (inputOpcion.value.length === 0) arrayErrores.push(itemOption);

                if (inputCheckSalto.checked && inputNumeroSalto.value.length === 0) {
                    seccionSalto.classList.add('flex');
                    arrayErrores.push(inputNumeroSalto);
                } else {
                    seccionSalto.classList.remove('flex');
                }

                // Construir objeto `option`
                let optionData = {
                    optionText: inputOpcion.value
                };

                function obtenerIdPreguntaSegunOrdenPregunta(numeroOrdenPregunta){
                    
                }

                // Agregar salto si está presente
                if (inputCheckSalto.checked && inputNumeroSalto.value.length !== 0) {

                    let idPregunta = obtenerIdPreguntaSegunOrdenPregunta(inputNumeroSalto.value)

                    if(idPregunta != null) {
                        optionData.jump = { nextQuestionId: idPregunta };
                    }
                    
                }

                // Agregar imagen si está presente
                if (inputImgOption.files.length > 0) {
                    optionData.image = { fileIndex: arrayFiles.length };
                    arrayFiles.push(inputImgOption.files[0])
                }

                optionsArray.push(optionData);
            });
        }

        // Si el tipo de pregunta es Carga de archivos
        if(btnArchivosEspecificos) {
            const inputCheckboxSpecificFiles = btnArchivosEspecificos.querySelector('input')
            const checkboxesBlock = ultimaPregunta.querySelectorAll('checkboxReal')

            //Reseteamos estilos
            checkboxesBlock.forEach(checkbox => {
                checkbox.style.border = '#d9d9d9 1px solid';
            })

            if(inputCheckboxSpecificFiles.checked && !checkboxesBlock.some(checkbox => checkbox.checked)) {
                checkboxesBlock.forEach(checkbox => {
                    arrayErrores.push(checkbox)
                })
            }
        }

        if (arrayErrores.length > 0) {
            arrayErrores.forEach(elementoError => {

                if(elementoError.classList.contains('simulationPointListItem')) { // si es lista desplegable
                    elementoError.style.backgroundColor = 'tomato';
                } else {
                    elementoError.style.border = 'tomato 1px solid';
                }
                
                mostrarNotificacion('Los campos son obligatorios');
            });
        } else {
            formData.append("formId", formId);
            formData.append("questionTypeId", selectTipoPregunta.value);
            formData.append("questionText", inputPregunta.value);
            formData.append("questionOrder", ordenPregunta.innerText);
            formData.append("options", JSON.stringify(optionsArray)); // Convertir `optionsArray` a JSON
            
            // Agregar archivos correctamente
            arrayFiles.forEach((file) => {
                formData.append("files", file); // ✅ Agregar archivos correctamente
            });

            console.log("Enviando FormData...");
            enviarPregunta(formData,ultimaPregunta,contenedorReceptor);
        }
    } else {
        agregarPregunta(contenedorReceptor);
    }
}

async function cambiarTipoDePregunta(tipoDePregunta,elementoDOM) {

    if(tipoDePregunta == 1) { // Casillas de Verificación

        elementoDOM.innerHTML  = formatoPreguntaCasillasVerificacion
        
        let inputAgregarOpcion = elementoDOM.querySelector('.inputAddOption')
        asignarEventoClickAgregarOpcion(inputAgregarOpcion)
        
    } else if(tipoDePregunta == 2) { // Seleccion Múltiple

        elementoDOM.innerHTML  = formatoPreguntaOpcionMultiple
        
        let inputAgregarOpcion = elementoDOM.querySelector('.inputAddOption')
        asignarEventoClickAgregarOpcion(inputAgregarOpcion)
        
    } else if(tipoDePregunta == 3) { // Menú Desplegable

        elementoDOM.innerHTML  = formatoPreguntaListaDesplegable

        let inputAgregarOpcion = elementoDOM.querySelector('.inputAddOption')
        asignarEventoClickAgregarOpcion(inputAgregarOpcion)

    } else if(tipoDePregunta == 4) { // Numero
        elementoDOM.innerHTML  = formatoNumero
        
    } else if(tipoDePregunta == 5) { // Respuesta Corta
        elementoDOM.innerHTML  = formatoPreguntaRespuestaCorta
    } else if(tipoDePregunta == 6) { // Párrafo
        elementoDOM.innerHTML  = formatoPreguntaParrafo
    } else if(tipoDePregunta == 7) { // Carga de Archivos
        elementoDOM.innerHTML  = formatoPreguntaCargaArchivos
        let btnPermitirArchivosEspecificos = elementoDOM.querySelector('.simBtnWithAnimation')
        let checkboxesBlock = elementoDOM.querySelector('.checkboxesBlock')

        btnPermitirArchivosEspecificos.addEventListener('click',() => {
            permitirArchivosEspecificos(btnPermitirArchivosEspecificos,checkboxesBlock)
        })
        
    }

    // Obtén el último elemento <select> en elementoDOM
    let selects = elementoDOM.querySelectorAll('select');
    let selectType = selects[selects.length - 1]; // Selecciona el último <select>

    await generarOpcionesSelect(selectType)
    
    //Obtener icono eliminar en elementoDOM
    let iconoEliminar = elementoDOM.querySelector('.iconoEliminar')

    ajustarNumeroPreguntas(0)
    asignarEventoChangeSelectTipoPregunta(selectType)
    seleccionarOpcionDePregunta(selectType,tipoDePregunta)
    asignarEventoClickEliminarPregunta(iconoEliminar)

    if(tipoDePregunta == 1 || tipoDePregunta == 2 || tipoDePregunta == 3) { // Casillas de Verificación, Seleccion Múltiple, Menú Desplegable
        // Agregar la primera opción por defecto
        agregarOpcion(elementoDOM);
    } 
    
}

function permitirArchivosEspecificos(btnPermitirArchivosEspecificos,checkboxesBlock) {
    checkOptAssistant(btnPermitirArchivosEspecificos)

    let circulo = btnPermitirArchivosEspecificos.querySelector('.circleMove')
    let checkBoxes = checkboxesBlock.querySelectorAll('.checkboxReal')

    if(circulo.classList.contains('moveRight')) {
        checkboxesBlock.classList.remove('none')
    } else {
        checkboxesBlock.classList.add('none')
        checkBoxes.forEach(checkbox => {
            checkbox.checked = false
        })
        
    }

}

function asignarEventoClickEliminarPregunta(iconoEliminar) {
    // Añade el listener del evento click al icono eliminar
    iconoEliminar.addEventListener('click', function(event) {
        let contenedorPregunta = event.currentTarget.parentNode.parentNode;
        eliminarPregunta(contenedorPregunta);
    });
}

function eliminarPregunta(contenedorPregunta) {
    let enumeracionPregunta = contenedorPregunta.querySelector('.questionNumber')
    ajustarNumeroPreguntas(enumeracionPregunta)
    
    contenedorPregunta.remove()
}

function asignarEventoClickAgregarOpcion(inputAgregarOpcion) {
    // Añade el listener del evento click al input de agregar opcion
    inputAgregarOpcion.addEventListener('click', function(event) {
        let contenedorGeneral = event.currentTarget.parentNode.parentNode.parentNode;
        agregarOpcion(contenedorGeneral);
    });
}

// Mapa global para almacenar referencias de eventos
const eventListenersMap = new Map();

function agregarOpcion(contenedorGeneral) {
    let seccionOpciones = contenedorGeneral.querySelector('.optionsAnswer');
    let tipoDePregunta = contenedorGeneral.querySelector('.questionSelect').value;
    let contador = contenedorGeneral ? contenedorGeneral.querySelectorAll('.cajaOption').length - 1 : 0; // -1 porque hay una cajaOption extra

    function generarIconoTipoPregunta(tipoDePregunta) {
        if (tipoDePregunta == 1) {
            return `<span class="checkboxSpan typeOption"></span>`;
        } else if (tipoDePregunta == 3) {
            return `<span class="simulationPointListItem typeOption"></span>`;
        } else if (tipoDePregunta == 2) {
            return `<span class="radioSpan typeOption"></span>`;
        }
    }

    let formatoOption = `
        <div class="containerOption" style="order:${contador + 1}">
            <div class="bloqueOpcion">
                <div class="cajaOption">
                    <div class="rowOpt w100 optionTarget">
                        ${generarIconoTipoPregunta(tipoDePregunta)}
                        <input class="inputOption" type="text" value="Opción ${contador + 1}">
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
            
        </div>
    `;

    seccionOpciones.insertAdjacentHTML('beforeend', formatoOption);

    let ultimaOpcion = contenedorGeneral.querySelector('.containerOption:last-child');
    

    opcionSeleccionada(ultimaOpcion);
    agregarEventosOpcion(ultimaOpcion);

}

function activarInputFileConImg(imagen, contenedorOpcion) {
    let inputFileImagen = contenedorOpcion.querySelector('.inputImgOption')
    let logoImg = contenedorOpcion.querySelector('.rowOpt label img')

    inputFileImagen.addEventListener('change', function handleFileChange(event) {

        if(inputFileImagen.files.length > 0) {
            
            logoImg.classList.remove('flex') // no se permite agregar mas imagenes

            let formatoImagenAgregada = `
                <div class="contImgOption">
                    <div class="blockImgOp">
                        <img src="/img/noImg.jpg" alt="">
                        <i class="fa-solid fa-xmark"></i>
                    </div>
                </div>
            `;
            contenedorOpcion.insertAdjacentHTML('beforeend', formatoImagenAgregada);

            let imagenOpcion = contenedorOpcion.querySelector('.blockImgOp img');
            let equisOption = contenedorOpcion.querySelector('.blockImgOp i');

            mostrarFileEnImgPreview(event, imagenOpcion);

            function eliminarImagenOpcion(imagen, contenedorOpcion) {
                let contenedorImagenOpcion = contenedorOpcion.querySelector('.contImgOption');
            
                if (contenedorImagenOpcion) {
                    contenedorImagenOpcion.remove();
                }
            
                let inputFileImagen = imagen.nextElementSibling;
                inputFileImagen.value = ''; // Resetea el input file para permitir nueva selección
            
                // 🔴 Eliminar el evento click del input para evitar acumulaciones
                inputFileImagen.replaceWith(inputFileImagen.cloneNode(true));
            }

            equisOption.addEventListener('click', () => {
                eliminarImagenOpcion(imagen, contenedorOpcion);
            });
        }
        
    });

    inputFileImagen.click(); // Activa el input file oculto
}

function opcionSeleccionada(contenedorOpcion) {
    let addImgOption = contenedorOpcion.querySelector('.rowOpt img')
    let inputOption = contenedorOpcion.querySelector('.inputOption')
    let jumpOption = contenedorOpcion.querySelector('.jumps')
    let imagenAdjuntada = contenedorOpcion.querySelector('.contImgOption')

    if(!imagenAdjuntada) {
        addImgOption.classList.add('flex')
    }
    jumpOption.classList.add('flex')
    
    inputOption.select() // señala el contenio del input
    inputOption.classList.add('borderBottomInputActive')
}

function retirarSeleccionOpcion(contenedorOpcion) {
    let addImgOption = contenedorOpcion.querySelector('.rowOpt img')
    let inputOption = contenedorOpcion.querySelector('.inputOption')
    let jumpOption = contenedorOpcion.querySelector('.jumps')

    jumpOption.classList.remove('flex')
    addImgOption.classList.remove('flex')
    inputOption.classList.remove('borderBottomInputActive')
    inputOption.classList.remove('borderBottomInputActiveGrey')
}

function retirarPrevisualizacionOpcion(contenedorOpcion) {
    let addImgOption = contenedorOpcion.querySelector('.rowOpt img')
    let inputOption = contenedorOpcion.querySelector('.inputOption')
    let jumpOption = contenedorOpcion.querySelector('.jumps')

    if(document.activeElement != inputOption) {
        addImgOption.classList.remove('flex')
        jumpOption.classList.remove('flex')
        inputOption.classList.remove('borderBottomInputActiveGrey')
        inputOption.classList.remove('borderBottomInputActive')
    }

    
}

function previsualizacionOpcion(contenedorOpcion) {
    let addImgOption = contenedorOpcion.querySelector('.rowOpt img')
    let inputOption = contenedorOpcion.querySelector('.inputOption')
    let jumpOption = contenedorOpcion.querySelector('.jumps')
    let imagenAdjuntada = contenedorOpcion.querySelector('.contImgOption')

    if(!imagenAdjuntada) {
        addImgOption.classList.add('flex')
    }

    jumpOption.classList.add('flex')
    inputOption.classList.add('borderBottomInputActiveGrey')
}

function eliminarOpcion(contenedorOpcion) {
    contenedorOpcion.remove()
}

// unicamente se usa este evento para conocer donde     
// dio click y se usa en la funcion agregarEventosOpcion -> blur
let elementoClickeado = null;

document.addEventListener('click', (event) => {
    elementoClickeado = event.target; // Guarda el elemento clickeado
});

/////////////////////

function agregarEventosOpcion(contenedorOpcion) {
    
    let opcionTarget = contenedorOpcion.querySelector('.optionTarget')
    let bloqueOpcion = contenedorOpcion.querySelector('.bloqueOpcion')
    let inputOption = contenedorOpcion.querySelector('.inputOption')
    let equisOption = contenedorOpcion.querySelectorAll('.equisOption')
    let btnSaltoOption = contenedorOpcion.querySelector('.simBtnWithAnimation')
    let numeroPreguntaSalto = contenedorOpcion.querySelector('.questionNumberJump')
    let imagenUltimaOpcionAgregada = contenedorOpcion.querySelector('.rowOpt img');

    imagenUltimaOpcionAgregada.addEventListener('click', () => {
        activarInputFileConImg(imagenUltimaOpcionAgregada, contenedorOpcion);
    });

    btnSaltoOption.addEventListener('click',() => {
        checkOptAssistant(btnSaltoOption)

        let circulo = btnSaltoOption.querySelector('.circleMove')

        if(circulo.classList.contains('moveRight')) {
            numeroPreguntaSalto.classList.add('flex')
        } else {
            numeroPreguntaSalto.classList.remove('flex')
        }
    })

    opcionTarget.addEventListener('click',() => {
        opcionSeleccionada(contenedorOpcion) 
    })

    bloqueOpcion.addEventListener('mouseover',() => {
        previsualizacionOpcion(contenedorOpcion) 
    })

    bloqueOpcion.addEventListener('mouseleave',() => {

        retirarPrevisualizacionOpcion(contenedorOpcion)
    })

    inputOption.addEventListener('blur',() => {
        
        retirarSeleccionOpcion(contenedorOpcion)
    
    })
    
    equisOption.forEach(equis => {
        equis.addEventListener('click',() => {
            eliminarOpcion(contenedorOpcion)
        })
    })

}