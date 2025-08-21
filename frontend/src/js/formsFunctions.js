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
        console.log(`Generando ${questionTypes.length} opciones para select`);
        questionTypes.forEach(tipo => {
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
    <div class="w100">
        <div class="accountBlock padding1 draggable" draggable="true">
        
        </div>
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
    const preguntasExistentes = window.preguntasExistentes || 0;
    const totalPreguntas = document.querySelectorAll('.draggable').length;
    
    btnAgregarPregunta.style.order = totalPreguntas + 1;

    ScrollAlFinal()
}

// Asignar orden y numero de pregunta
function asignarNumeroPregunta(contenedor,bloqueNumero) {
    // Obtener el número total de preguntas (existentes + nuevas ya renderizadas)
    const totalPreguntas = document.querySelectorAll('.draggable').length;
    
    // El nuevo número será el total de preguntas (incluyendo la que se está agregando)
    const nuevoNumero = totalPreguntas;

    contenedor.style.order = nuevoNumero; 
    bloqueNumero.innerText = nuevoNumero;
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
    console.log('Ejecutando agregarPregunta...');
    console.log('Contenedor receptor:', contenedorReceptor);
    console.log('Preguntas antes de insertar:', contenedorReceptor.querySelectorAll('.draggable').length);
    
    // Contenedor receptor es el contenedor que va a recibir el formato
    contenedorReceptor.insertAdjacentHTML('beforeend', formatoPregunta);
    
    console.log('Preguntas después de insertar:', contenedorReceptor.querySelectorAll('.draggable').length);

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

// Función para comprimir imagen
function compressImage(file, maxSizeKB = 100, quality = 0.5) {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = function() {
            // Calcular nuevas dimensiones manteniendo aspecto
            let { width, height } = img;
            const maxDimension = 400; // Reducido a 400px máximo
            
            if (width > height) {
                if (width > maxDimension) {
                    height = height * (maxDimension / width);
                    width = maxDimension;
                }
            } else {
                if (height > maxDimension) {
                    width = width * (maxDimension / height);
                    height = maxDimension;
                }
            }
            
            canvas.width = width;
            canvas.height = height;
            
            // Dibujar imagen redimensionada
            ctx.drawImage(img, 0, 0, width, height);
            
            // Función recursiva para comprimir hasta llegar al tamaño objetivo
            const compressWithQuality = (currentQuality) => {
                canvas.toBlob((blob) => {
                    const compressedFile = new File([blob], file.name, {
                        type: 'image/jpeg',
                        lastModified: Date.now()
                    });
                    
                    const sizeKB = compressedFile.size / 1024;
                    
                    console.log(`Imagen comprimida: ${file.name}`);
                    console.log(`Tamaño original: ${(file.size / 1024).toFixed(2)} KB`);
                    console.log(`Tamaño actual: ${sizeKB.toFixed(2)} KB con calidad ${currentQuality}`);
                    
                    // Si el archivo es muy grande y podemos reducir más la calidad, intentar otra vez
                    if (sizeKB > maxSizeKB && currentQuality > 0.1) {
                        console.log(`Archivo aún muy grande, reduciendo calidad a ${(currentQuality - 0.1).toFixed(1)}`);
                        compressWithQuality(currentQuality - 0.1);
                    } else {
                        console.log(`Compresión final: ${sizeKB.toFixed(2)} KB`);
                        resolve(compressedFile);
                    }
                }, 'image/jpeg', currentQuality);
            };
            
            compressWithQuality(quality);
        };
        
        img.src = URL.createObjectURL(file);
    });
}

async function enviarPregunta(formData,ultimaPregunta,contenedorReceptor) {

    const url = '/api/questions';
    const method = 'POST'; 
    const contentType = 'multipart/form-data';

    // Debug del FormData
    console.log('Enviando pregunta con FormData:', formData);
    console.log('Contenido del FormData:');
    for (let [key, value] of formData.entries()) {
        console.log(key, ':', value);
    }

    try {
        // Asegurar que esperas la respuesta de useApi
        const { data, error, loading } = await useApi(url, method, formData, contentType);

        console.log('Respuesta de la API:', { data: data.value, error: error.value });

        if (error.value) {
            console.error('Error en la solicitud:', error.value);
            const errorMsg = error.value.message || JSON.stringify(error.value) || 'Error desconocido';
            mostrarNotificacion('Error creando pregunta: ' + errorMsg, 0)
        } else if (data.value && typeof data.value === 'object') {
            console.log('Pregunta creada exitosamente:', data.value);
            mostrarNotificacion('Pregunta creada exitosamente', 1)
            bloquearCamposPregunta(ultimaPregunta)
            
            // Agregar icono de editar después de guardar exitosamente
            agregarIconoEditar(ultimaPregunta)
            
            // Agregar una nueva pregunta vacía después de guardar exitosamente
            const contenedorPadre = ultimaPregunta.parentNode
            if (contenedorPadre) {
                agregarPregunta(contenedorPadre)
            }
        } else {
            console.error('Respuesta inesperada del servidor:', data.value);
            mostrarNotificacion('Error: Respuesta inesperada del servidor', 0);
        }

    } catch (err) {
        console.error('Error inesperado:', err);
        mostrarNotificacion('Error inesperado al crear pregunta', 0);
    }
}

function activarCamposPregunta(contenedorPregunta) {
    const inputPregunta = contenedorPregunta.querySelector('.questionAndType input');
    const selectTipoPregunta = contenedorPregunta.querySelector('.questionSelect');
    const contenedoresOpciones = contenedorPregunta.querySelectorAll('.containerOption');
    const agregarOpcion = contenedorPregunta.querySelector('.inputAddOption');
    let equises = contenedorPregunta.querySelectorAll('.equisOption');
    let equisesImg = contenedorPregunta.querySelectorAll('.equisImg');
    const contenedorIconos = contenedorPregunta.querySelector('.sectionDeleteQuestion');
    
    // Campos específicos para tipo "Carga de archivos"
    const inputCheckArchivos = contenedorPregunta.querySelector('.inputCheck');
    const checkboxesArchivos = contenedorPregunta.querySelectorAll('.checkboxReal');
    const inputNumeroArchivos = contenedorPregunta.querySelector('.numberInput');

    // Habilitar input y select
    if (inputPregunta) inputPregunta.disabled = false;
    if (selectTipoPregunta) selectTipoPregunta.disabled = false;
    
    // Habilitar campos específicos de "Carga de archivos"
    if (inputCheckArchivos) inputCheckArchivos.disabled = false;
    if (inputNumeroArchivos) inputNumeroArchivos.disabled = false;
    checkboxesArchivos.forEach(checkbox => checkbox.disabled = false);

    // Mostrar las X
    equises.forEach(equis => equis.classList.remove('none'));
    
    // Mostrar las X de las imágenes
    equisesImg.forEach(equisImg => equisImg.classList.remove('none'));

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
    let equisesImg = contenedorPregunta.querySelectorAll('.equisImg');
    const contenedorIconos = contenedorPregunta.querySelector('.sectionDeleteQuestion');
    
    // Campos específicos para tipo "Carga de archivos"
    const inputCheckArchivos = contenedorPregunta.querySelector('.inputCheck');
    const checkboxesArchivos = contenedorPregunta.querySelectorAll('.checkboxReal');
    const inputNumeroArchivos = contenedorPregunta.querySelector('.numberInput');

    // Deshabilitar input y select
    if (inputPregunta) inputPregunta.disabled = true;
    if (selectTipoPregunta) selectTipoPregunta.disabled = true;
    
    // Deshabilitar campos específicos de "Carga de archivos"
    if (inputCheckArchivos) inputCheckArchivos.disabled = true;
    if (inputNumeroArchivos) inputNumeroArchivos.disabled = true;
    checkboxesArchivos.forEach(checkbox => checkbox.disabled = true);

    // Ocultar las X antes de reemplazar los contenedores
    equises.forEach(equis => equis.classList.add('none'));
    
    // Ocultar las X de las imágenes
    equisesImg.forEach(equisImg => equisImg.classList.add('none'));

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
    equisesImg = contenedorPregunta.querySelectorAll('.equisImg');

    equises.forEach(equis => equis.classList.add('none'));
    equisesImg.forEach(equisImg => equisImg.classList.add('none'));


    // Eliminar icono guardar si existe
    let iconoGuardar = contenedorPregunta.querySelector('.questionSave')
    if(iconoGuardar) iconoGuardar.remove()

    // Solo agregar icono editar si no existe ya uno
    let iconoEditarExistente = contenedorPregunta.querySelector('.questionEdit')
    if (!iconoEditarExistente) {
        let formatoIconoEditar = `<i class="fa-solid fa-pen-to-square questionEdit"></i>`
        contenedorIconos.innerHTML += formatoIconoEditar;
        let iconosEditar = document.querySelectorAll('.questionEdit')
        let ultimoIconoEditar = iconosEditar[iconosEditar.length - 1]

        ultimoIconoEditar.addEventListener('click',() => {
            activarCamposPregunta(contenedorPregunta)
        })
    }

}

export async function validarPreguntaAnterior(contenedorReceptor, formId) {
    let preguntas = contenedorReceptor.querySelectorAll('.draggable');
    
    // Filtrar solo preguntas nuevas (no guardadas)
    let preguntasNuevas = Array.from(preguntas).filter(pregunta => !pregunta.hasAttribute('data-saved'));
    
    console.log('Total preguntas:', preguntas.length);
    console.log('Preguntas nuevas (sin data-saved):', preguntasNuevas.length);
    console.log('Preguntas con data-saved:', Array.from(preguntas).filter(p => p.hasAttribute('data-saved')).length);
    
    if (preguntasNuevas.length > 0) {
        const ultimaPregunta = preguntasNuevas[preguntasNuevas.length - 1];
        const inputPregunta = ultimaPregunta.querySelector('.questionAndType input');
        const selectTipoPregunta = ultimaPregunta.querySelector('.questionSelect');
        const contenedoresOpciones = ultimaPregunta.querySelectorAll('.containerOption');
        const ordenPregunta = ultimaPregunta.querySelector('.questionNumber');
        const btnArchivosEspecificos = ultimaPregunta.querySelector('.btnSpecificFile')

        // Resetear estilos antes de validar errores
        if (inputPregunta) inputPregunta.style.border = '1px solid #d9d9d9';
        if (selectTipoPregunta) selectTipoPregunta.style.border = '1px solid #d9d9d9';

        let arrayErrores = [];
        let formData = new FormData();
        let optionsArray = [];
        let arrayFiles = [];

        // Validaciones básicas
        if (!inputPregunta || inputPregunta.value.length === 0) {
            if (inputPregunta) arrayErrores.push(inputPregunta);
        }
        if (!selectTipoPregunta || selectTipoPregunta.value === "0") {
            if (selectTipoPregunta) arrayErrores.push(selectTipoPregunta);
        }

        console.log('Validación inicial:', {
            inputPregunta: inputPregunta?.value,
            selectTipoPregunta: selectTipoPregunta?.value,
            contenedoresOpciones: contenedoresOpciones.length,
            formId
        });

        if (contenedoresOpciones.length > 0) {
            contenedoresOpciones.forEach((contenedorOpcion, index) => {
                const inputOpcion = contenedorOpcion.querySelector('.optionTarget input');
                const inputCheckSalto = contenedorOpcion.querySelector('.inputCheck');
                const inputNumeroSalto = contenedorOpcion.querySelector('.questionNumberJump');
                const itemOption = contenedorOpcion.querySelector('.typeOption');
                const seccionSalto = contenedorOpcion.querySelector('.jumps');
                const inputImgOption = contenedorOpcion.querySelector('.inputImgOption');

                // Resetear estilos antes de validar errores
                if(itemOption && itemOption.classList.contains('simulationPointListItem')) {
                    itemOption.style.backgroundColor = 'black';
                } else if (itemOption) {
                    itemOption.style.border = '1px solid #d9d9d9';
                }
                
                if (inputNumeroSalto) inputNumeroSalto.style.border = '1px solid #d9d9d9';

                if (!inputOpcion || inputOpcion.value.length === 0) {
                    if (itemOption) arrayErrores.push(itemOption);
                }

                if (inputCheckSalto && inputCheckSalto.checked && (!inputNumeroSalto || inputNumeroSalto.value.length === 0)) {
                    if (seccionSalto) seccionSalto.classList.add('flex');
                    if (inputNumeroSalto) arrayErrores.push(inputNumeroSalto);
                } else if (seccionSalto) {
                    seccionSalto.classList.remove('flex');
                }

                // Construir objeto `option` solo si inputOpcion existe
                if (inputOpcion) {
                    let optionData = {
                        optionText: inputOpcion.value || ''
                    };

                    // Agregar salto si está presente
                    if (inputCheckSalto && inputCheckSalto.checked && inputNumeroSalto && inputNumeroSalto.value.length !== 0) {
                        // Por ahora usamos el valor directamente, en el futuro se puede mapear a IDs reales
                        let idPregunta = inputNumeroSalto.value;
                        if(idPregunta != null) {
                            optionData.jump = { nextQuestionId: idPregunta };
                        }
                    }

                    // Agregar imagen si está presente
                    if (inputImgOption && inputImgOption.files && inputImgOption.files.length > 0) {
                        optionData.image = { fileIndex: arrayFiles.length };
                        arrayFiles.push(inputImgOption.files[0]);
                    }

                    optionsArray.push(optionData);
                }
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

            // Convertir NodeList a Array para usar .some()
            const checkboxesArray = Array.from(checkboxesBlock)
            if(inputCheckboxSpecificFiles.checked && !checkboxesArray.some(checkbox => checkbox.checked)) {
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
            // Estructurar datos según DTO real (solo 5 campos válidos)
            const questionData = {
                formId: parseInt(formId),
                questionText: inputPregunta.value,
                questionOrder: parseInt(ordenPregunta.innerText),
                questionTypeId: parseInt(selectTipoPregunta.value),
                options: optionsArray.map((option, index) => ({
                    optionText: option.optionText,
                    image: option.image || null,
                    jump: option.jump || null
                }))
            };

            console.log('Datos a enviar según esquema API:', questionData);
            console.log('Archivos adjuntos:', arrayFiles);

            formData.append("question", JSON.stringify(questionData));
            
            // Comprimir y agregar archivos
            if (arrayFiles.length > 0) {
                console.log("Comprimiendo imágenes...");
                
                // Comprimir todas las imágenes
                const compressedFiles = await Promise.all(
                    arrayFiles.map(file => compressImage(file))
                );
                
                // Agregar archivos comprimidos
                compressedFiles.forEach((file) => {
                    formData.append("files", file);
                });
                
                console.log("Imágenes comprimidas exitosamente");
            }

            console.log("Enviando FormData...");
            enviarPregunta(formData,ultimaPregunta,contenedorReceptor);
        }
    } else {
        // No hay preguntas nuevas pendientes de validar, agregar nueva pregunta directamente
        console.log('No hay preguntas nuevas pendientes, agregando nueva pregunta...');
        
        // Usar la función de Vue para agregar la pregunta al array reactivo
        if (window.agregarNuevaPreguntaVue) {
            window.agregarNuevaPreguntaVue();
        } else {
            // Fallback al método original si no está disponible
            agregarPregunta(contenedorReceptor);
        }
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
    
    // Marcar la pregunta como modificada para que sea validada
    // Buscar el contenedor padre de la pregunta (.draggable)
    let contenedorPregunta = elementoDOM.closest('.draggable');
    if (contenedorPregunta && contenedorPregunta.hasAttribute('data-saved')) {
        console.log('Marcando pregunta como modificada (removiendo data-saved)');
        contenedorPregunta.removeAttribute('data-saved');
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
    
    // Seleccionar la nueva opción
    opcionSeleccionada(ultimaOpcion);
    
    // Re-asignar eventos a TODAS las opciones para evitar pérdida de eventos
    let todasLasOpciones = contenedorGeneral.querySelectorAll('.containerOption');
    console.log(`Re-asignando eventos a ${todasLasOpciones.length} opciones`);
    
    todasLasOpciones.forEach((opcion, index) => {
        console.log(`Asignando eventos a opción ${index + 1}`);
        agregarEventosOpcion(opcion);
    });

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
                        <i class="fa-solid fa-xmark equisImg"></i>
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

    // Agregar un pequeño delay para evitar conflictos con el evento click
    setTimeout(() => {
        if(document.activeElement != inputOption) {
            // Verificar si el input tiene la clase de selección activa antes de ocultar
            if (!inputOption.classList.contains('borderBottomInputActive')) {
                if (addImgOption) addImgOption.classList.remove('flex')
                if (jumpOption) jumpOption.classList.remove('flex')
                inputOption.classList.remove('borderBottomInputActiveGrey')
            }
        }
    }, 100);
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
    
    // Verificar si ya se asignaron eventos para evitar duplicados
    if (contenedorOpcion.hasAttribute('data-events-assigned')) {
        return;
    }
    
    let opcionTarget = contenedorOpcion.querySelector('.optionTarget')
    let bloqueOpcion = contenedorOpcion.querySelector('.bloqueOpcion')
    let inputOption = contenedorOpcion.querySelector('.inputOption')
    let equisOption = contenedorOpcion.querySelectorAll('.equisOption')
    let btnSaltoOption = contenedorOpcion.querySelector('.simBtnWithAnimation')
    let numeroPreguntaSalto = contenedorOpcion.querySelector('.questionNumberJump')
    let imagenUltimaOpcionAgregada = contenedorOpcion.querySelector('.rowOpt img');

    // Solo agregar evento si el elemento existe
    if (imagenUltimaOpcionAgregada) {
        imagenUltimaOpcionAgregada.addEventListener('click', () => {
            activarInputFileConImg(imagenUltimaOpcionAgregada, contenedorOpcion);
        });
    }

    // Solo agregar evento si el elemento existe
    if (btnSaltoOption) {
        btnSaltoOption.addEventListener('click',() => {
        checkOptAssistant(btnSaltoOption)

        let circulo = btnSaltoOption.querySelector('.circleMove')

            if(circulo && numeroPreguntaSalto) {
                if(circulo.classList.contains('moveRight')) {
                    numeroPreguntaSalto.classList.add('flex')
                } else {
                    numeroPreguntaSalto.classList.remove('flex')
                }
            }
        })
    }

    // Solo agregar eventos si los elementos existen
    if (opcionTarget) {
        opcionTarget.addEventListener('click',() => {
            opcionSeleccionada(contenedorOpcion) 
        })
    }

    if (bloqueOpcion) {
        bloqueOpcion.addEventListener('mouseover',() => {
            previsualizacionOpcion(contenedorOpcion) 
        })

        bloqueOpcion.addEventListener('mouseleave',() => {
            retirarPrevisualizacionOpcion(contenedorOpcion)
        })
    }

    if (inputOption) {
        inputOption.addEventListener('blur',() => {
            retirarSeleccionOpcion(contenedorOpcion)
        })
    }
    
    if (equisOption.length > 0) {
        equisOption.forEach(equis => {
            equis.addEventListener('click',() => {
                eliminarOpcion(contenedorOpcion)
            })
        })
    }
    
    // Marcar que los eventos ya fueron asignados
    contenedorOpcion.setAttribute('data-events-assigned', 'true');
}

function agregarIconoEditar(contenedorPregunta) {
    const sectionDeleteQuestion = contenedorPregunta.querySelector('.sectionDeleteQuestion')
    
    if (sectionDeleteQuestion && !sectionDeleteQuestion.querySelector('.questionEdit')) {
        // Crear y agregar el icono de editar
        const iconoEditar = document.createElement('i')
        iconoEditar.className = 'fa-solid fa-pen-to-square iconoEliminar questionEdit'
        sectionDeleteQuestion.appendChild(iconoEditar)
        
        // Asignar evento al icono de editar
        asignarEventoClickEditarPregunta(iconoEditar)
        
        console.log('Icono de editar agregado exitosamente')
    }
    
    // Asignar evento de eliminar al icono trash existente
    const iconoEliminar = contenedorPregunta.querySelector('.fa-trash');
    if (iconoEliminar) {
        console.log('Asignando evento eliminar a pregunta guardada');
        iconoEliminar.addEventListener('click', (event) => {
            event.preventDefault();
            
            // Buscar el contenedor .draggable correcto
            const contenedorPreguntaEliminar = event.currentTarget.closest('.draggable');
            
            console.log('Eliminar pregunta - Contenedor encontrado:', contenedorPreguntaEliminar);
            console.log('Eliminar pregunta - Data-saved:', contenedorPreguntaEliminar?.hasAttribute('data-saved'));
            
            if (contenedorPreguntaEliminar) {
                // Usar la función de Vue si está disponible
                if (window.eliminarPreguntaVue) {
                    window.eliminarPreguntaVue(contenedorPreguntaEliminar);
                } else {
                    // Fallback al método original
                    eliminarPregunta(contenedorPreguntaEliminar);
                }
            } else {
                console.error('No se pudo encontrar el contenedor de la pregunta a eliminar');
            }
        });
    }
}

function asignarEventoClickEditarPregunta(iconoEditar) {
    // Añade el listener del evento click al icono editar
    iconoEditar.addEventListener('click', function(event) {
        event.preventDefault();
        event.stopPropagation();
        
        let contenedorPregunta = event.currentTarget.parentNode.parentNode;
        let formId = obtenerFormId(); // Necesitamos obtener el formId del contexto
        
        console.log('Click en editar pregunta');
        
        // Validar la pregunta y enviar datos
        validarYEnviarPregunta(contenedorPregunta, formId);
    });
}

function obtenerFormId() {
    // Obtener el formId desde la URL o contexto global
    const url = window.location.href;
    const formIdMatch = url.match(/\/forms\/(\d+)/);
    return formIdMatch ? formIdMatch[1] : null;
}

function validarYEnviarPregunta(contenedorPregunta, formId) {
    console.log('Validando y enviando pregunta...', { contenedorPregunta, formId });
    
    const inputPregunta = contenedorPregunta.querySelector('.questionAndType input');
    const selectTipoPregunta = contenedorPregunta.querySelector('.questionSelect');
    const contenedoresOpciones = contenedorPregunta.querySelectorAll('.containerOption');
    const ordenPregunta = contenedorPregunta.querySelector('.questionNumber');
    const btnArchivosEspecificos = contenedorPregunta.querySelector('.btnSpecificFile');

    // Resetear estilos antes de validar errores
    if (inputPregunta) inputPregunta.style.border = '1px solid #d9d9d9';
    if (selectTipoPregunta) selectTipoPregunta.style.border = '1px solid #d9d9d9';

    let arrayErrores = [];
    let formData = new FormData();
    let optionsArray = [];
    let arrayFiles = [];

    // Validaciones básicas
    if (!inputPregunta || inputPregunta.value.length === 0) {
        if (inputPregunta) arrayErrores.push(inputPregunta);
    }
    if (!selectTipoPregunta || selectTipoPregunta.value === "0") {
        if (selectTipoPregunta) arrayErrores.push(selectTipoPregunta);
    }

    // Validar opciones si existen
    if (contenedoresOpciones.length > 0) {
        contenedoresOpciones.forEach((contenedorOpcion, index) => {
            const inputOpcion = contenedorOpcion.querySelector('.optionTarget input');
            const inputCheckSalto = contenedorOpcion.querySelector('.inputCheck');
            const inputNumeroSalto = contenedorOpcion.querySelector('.questionNumberJump');
            const itemOption = contenedorOpcion.querySelector('.typeOption');
            const seccionSalto = contenedorOpcion.querySelector('.jumps');
            const inputImgOption = contenedorOpcion.querySelector('.inputImgOption');

            // Resetear estilos antes de validar errores
            if (itemOption && itemOption.classList.contains('simulationPointListItem')) {
                itemOption.style.backgroundColor = 'black';
            } else if (itemOption) {
                itemOption.style.border = '1px solid #d9d9d9';
            }
            
            if (inputNumeroSalto) inputNumeroSalto.style.border = '1px solid #d9d9d9';

            if (!inputOpcion || inputOpcion.value.length === 0) {
                if (itemOption) arrayErrores.push(itemOption);
            }

            if (inputCheckSalto && inputCheckSalto.checked && (!inputNumeroSalto || inputNumeroSalto.value.length === 0)) {
                if (seccionSalto) seccionSalto.classList.add('flex');
                if (inputNumeroSalto) arrayErrores.push(inputNumeroSalto);
            } else if (seccionSalto) {
                seccionSalto.classList.remove('flex');
            }

            // Construir objeto `option`
            let optionData = {
                optionText: inputOpcion ? inputOpcion.value : ''
            };

            // Agregar salto si está presente
            if (inputCheckSalto && inputCheckSalto.checked && inputNumeroSalto && inputNumeroSalto.value.length !== 0) {
                // Aquí podrías implementar la lógica para obtener el ID real de la pregunta
                let idPregunta = inputNumeroSalto.value; // Simplificado por ahora
                if (idPregunta != null) {
                    optionData.jump = { nextQuestionId: idPregunta };
                }
            }

            // Agregar imagen si está presente
            if (inputImgOption && inputImgOption.files.length > 0) {
                optionData.image = { fileIndex: arrayFiles.length };
                arrayFiles.push(inputImgOption.files[0]);
            }

            optionsArray.push(optionData);
        });
    }

    // Validaciones para tipo carga de archivos
    if (btnArchivosEspecificos) {
        const inputCheckboxSpecificFiles = btnArchivosEspecificos.querySelector('input');
        const checkboxesBlock = contenedorPregunta.querySelectorAll('.checkboxReal');

        // Resetear estilos
        checkboxesBlock.forEach(checkbox => {
            checkbox.style.border = '#d9d9d9 1px solid';
        });

        if (inputCheckboxSpecificFiles && inputCheckboxSpecificFiles.checked && 
            !Array.from(checkboxesBlock).some(checkbox => checkbox.checked)) {
            checkboxesBlock.forEach(checkbox => {
                arrayErrores.push(checkbox);
            });
        }
    }

    if (arrayErrores.length > 0) {
        arrayErrores.forEach(elementoError => {
            if (elementoError.classList && elementoError.classList.contains('simulationPointListItem')) {
                elementoError.style.backgroundColor = 'tomato';
            } else {
                elementoError.style.border = 'tomato 1px solid';
            }
        });
        mostrarNotificacion('Los campos son obligatorios', 0);
    } else {
        // Preparar FormData para envío
        if (formId) formData.append("formId", formId);
        if (selectTipoPregunta) formData.append("questionTypeId", selectTipoPregunta.value);
        if (inputPregunta) formData.append("questionText", inputPregunta.value);
        if (ordenPregunta) formData.append("questionOrder", ordenPregunta.innerText);
        formData.append("options", JSON.stringify(optionsArray));
        
        // Agregar archivos correctamente
        arrayFiles.forEach((file) => {
            formData.append("files", file);
        });

        console.log("Enviando FormData...", {
            formId,
            questionTypeId: selectTipoPregunta ? selectTipoPregunta.value : null,
            questionText: inputPregunta ? inputPregunta.value : null,
            questionOrder: ordenPregunta ? ordenPregunta.innerText : null,
            optionsCount: optionsArray.length,
            filesCount: arrayFiles.length
        });
        
        enviarPregunta(formData, contenedorPregunta, null);
    }
}

// Función para cargar preguntas existentes del formulario
async function cargarPreguntasExistentes(formId) {
    try {
        const { data, error } = await useApi(`/api/questions/form/${formId}`);
        
        if (error.value) {
            console.error('Error cargando preguntas:', error.value);
            return [];
        }
        
        if (data.value && Array.isArray(data.value)) {
            console.log('Preguntas cargadas:', data.value);
            return data.value;
        }
        
        return [];
    } catch (err) {
        console.error('Error inesperado cargando preguntas:', err);
        return [];
    }
}

// Función para mostrar una pregunta existente en el DOM
function mostrarPreguntaExistente(pregunta, contenedorPadre) {
    
    console.log(JSON.stringify(pregunta,null,2));
    // Obtener la última pregunta agregada
    const contenedorPregunta = contenedorPadre.querySelector('.draggable:last-child');
    
    if (contenedorPregunta) {
        // Rellenar datos de la pregunta
        const inputPregunta = contenedorPregunta.querySelector('.questionAndType input');
        const selectTipoPregunta = contenedorPregunta.querySelector('.questionSelect');
        const numeroOrden = contenedorPregunta.querySelector('.questionNumber');
        
        console.log('Rellenando pregunta:', {
            texto: pregunta.text,
            tipo: pregunta.questionType?.id,
            orden: pregunta.questionOrder,
            inputEncontrado: !!inputPregunta,
            selectEncontrado: !!selectTipoPregunta
        });
        
        if (inputPregunta) {
            inputPregunta.value = pregunta.text;
            inputPregunta.setAttribute('value', pregunta.text);
            inputPregunta.placeholder = '';
            console.log('Texto asignado al input:', inputPregunta.value);
        }
        if (selectTipoPregunta) {
            // Asegurar que las opciones del select estén cargadas antes de asignar
            if (selectTipoPregunta.options.length === 0) {
                console.log('Select sin opciones, esperando carga...');
                // Esperar a que se carguen las opciones
                setTimeout(() => {
                    selectTipoPregunta.value = pregunta.questionType?.id;
                    console.log('Tipo asignado al select (delayed):', selectTipoPregunta.value);
                }, 200);
            } else {
                selectTipoPregunta.value = pregunta.questionType?.id;
                console.log('Tipo asignado al select:', selectTipoPregunta.value);
            }
        }
        if (numeroOrden) {
            numeroOrden.textContent = pregunta.questionOrder;
            console.log('Orden asignado:', numeroOrden.textContent);
        }
        
        // Cambiar tipo de pregunta si es necesario
        if (selectTipoPregunta && pregunta.questionType?.id) {
            cambiarTipoDePregunta(pregunta.questionType.id, contenedorPregunta);
            
            // Esperar un poco para que se renderice el cambio de tipo
            setTimeout(() => {
                // Agregar opciones si existen (después del cambio de tipo)
                if (pregunta.options && pregunta.options.length > 0) {
                    console.log('Procesando opciones después del cambio de tipo:', pregunta.options);
                    
                    // Remover TODAS las opciones existentes
                    const opcionesExistentes = contenedorPregunta.querySelectorAll('.containerOption');
                    console.log(`Removiendo ${opcionesExistentes.length} opciones existentes`);
                    opcionesExistentes.forEach(opcion => opcion.remove());
                    
                    // Agregar cada opción desde cero
                    pregunta.options.forEach((opcion, index) => {
                        console.log(`Agregando opción ${index + 1}:`, opcion.text);
                        agregarOpcion(contenedorPregunta);
                        
                        // Esperar un poco para que se renderice la opción
                        setTimeout(() => {
                            const ultimaOpcion = contenedorPregunta.querySelector('.containerOption:last-child');
                            console.log('Última opción encontrada:', ultimaOpcion);
                            
                            if (ultimaOpcion) {
                                // Intentar múltiples selectores para encontrar el input
                                const inputOpcion = ultimaOpcion.querySelector('.typeOption input') || 
                                                   ultimaOpcion.querySelector('.inputOption') ||
                                                   ultimaOpcion.querySelector('input[type="text"]') ||
                                                   ultimaOpcion.querySelector('.optionTarget input');
                                
                                console.log('Input de opción encontrado:', inputOpcion);
                                
                                if (inputOpcion) {
                                    inputOpcion.value = opcion.text;
                                    console.log(`Opción ${index + 1} asignada:`, inputOpcion.value);
                                } else {
                                    console.log(`No se encontró input para opción ${index + 1}`);
                                    console.log('HTML de la opción:', ultimaOpcion.innerHTML);
                                }
                            }
                        }, 50 * (index + 1)); // Delay incremental para cada opción
                    });
                }
                
                // Bloquear campos y agregar ícono de editar después de procesar opciones
                bloquearCamposPregunta(contenedorPregunta);
                agregarIconoEditar(contenedorPregunta);
            }, 100);
        } else {
            // Si no hay tipo de pregunta, solo bloquear campos
            bloquearCamposPregunta(contenedorPregunta);
            agregarIconoEditar(contenedorPregunta);
        }
    }
}

// Exportar las nuevas funciones
export { cargarPreguntasExistentes, mostrarPreguntaExistente, bloquearCamposPregunta, activarCamposPregunta, agregarOpcion, asignarEventoClickAgregarOpcion, asignarEventoChangeSelectTipoPregunta, eliminarPregunta, asignarEventoClickEliminarPregunta };