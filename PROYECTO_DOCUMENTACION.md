# InkValuation - Documentación del Proyecto

## 📋 Descripción General

InkValuation es una plataforma web para cotización de tatuajes y piercings que permite a los usuarios completar formularios dinámicos con diferentes tipos de preguntas. La aplicación incluye funcionalidades de creación, edición y gestión de formularios con soporte para imágenes y lógica condicional.

## 🏗️ Arquitectura Técnica

### Frontend
- **Framework**: Vue.js 3 con Composition API
- **Build Tool**: Vite
- **Routing**: Vue Router
- **Estado**: Reactive state management con Vue 3

### Backend
- **API REST**: Endpoint base `http://217.196.61.73:8082`
- **Imágenes**: Servidas desde `/images/`
- **Proxy**: Vite proxy configurado para `/api` y `/images`

### Estructura de Archivos Clave
```
frontend/src/
├── views/
│   ├── DetailForm.vue        # Vista principal de gestión de formularios
│   └── AssistantChatAI.vue   # Chat con IA
├── js/
│   ├── formsFunctions.js     # Lógica principal de formularios
│   ├── useFormsAPI.js        # API service para formularios
│   └── useAIAssistant.js     # Servicio de IA con Google Gemini
└── router/index.js           # Configuración de rutas
```

## 🎯 Funcionalidades Principales

### 1. Gestión de Formularios

#### Creación de Preguntas
- **Tipos soportados**: 
  1. Casillas de Verificación
  2. Selección Múltiple  
  3. Menú Desplegable
  4. Número
  5. Respuesta Corta
  6. Párrafo
  7. Carga de Archivos

#### Estados de Preguntas
- **Nueva**: ID temporal `temp-${timestamp}`, campos editables
- **Guardada**: ID real de base de datos, campos bloqueados por defecto
- **En edición**: Campos habilitados temporalmente

#### Funcionalidades de Opciones
- **Agregar/Eliminar opciones** en preguntas de selección
- **Soporte para imágenes** en opciones con compresión automática
- **Lógica de saltos** entre preguntas (funcionalidad preparada)

### 2. Sistema de Imágenes

#### Compresión Automática
```javascript
function compressImage(file, maxSizeKB = 100, quality = 0.5) {
    // Redimensiona a máximo 400px
    // Compresión iterativa hasta llegar al tamaño objetivo
    // Formato final: JPEG
}
```

#### Visualización
- **Estructura HTML**:
```html
<div class="contImgOption">
    <div class="blockImgOp">
        <img src="/images/uuid.jpg" alt="opción">
        <i class="fa-solid fa-xmark equisImg none"></i>
    </div>
</div>
```
- **Proxy**: `/images` → `http://217.196.61.73:8082/images`

### 3. Estados UX y Interacción

#### Loader de Creación
- **Ubicación**: Botón "Agregar pregunta" (`adminBarForms`)
- **Estados**: 
  - Normal: Ícono `fa-square-plus`
  - Cargando: Spinner + "Validando..."
- **CSS**: Botón deshabilitado con `pointer-events: none`

#### Bloqueo/Activación de Campos

**Función `bloquearCamposPregunta`**:
- Input de pregunta → `disabled: true`
- Select tipo → `disabled: true`
- Opciones → inputs `disabled: true`
- Equis → `class: none` (ocultas)
- **Campos específicos "Carga de archivos"**:
  - Checkbox archivos específicos → `disabled: true`
  - Checkboxes Video/Imagen/Documento → `disabled: true`
  - Input número archivos → `disabled: true`

**Función `activarCamposPregunta`**:
- Invierte todo lo anterior → `disabled: false`, equis visibles

### 4. Gestión de Estado Vue

#### Array Reactivo Principal
```javascript
const formQuestions = ref([])
```

#### Sincronización DOM ↔ Vue
- **Problema resuelto**: Inconsistencias entre DOM manipulado por JavaScript y estado Vue
- **Solución**: Funciones globales `window.agregarNuevaPreguntaVue` y `window.eliminarPreguntaVue`

#### Identificación de Preguntas
```javascript
// Nueva pregunta (temporal)
:data-saved="!question.id.toString().startsWith('temp-') ? 'true' : null"

// Pregunta guardada
:data-saved="true"
```

### 5. Sistema de Eliminación

#### Lógica de Identificación
1. **Buscar contenedor**: `closest('.draggable')`
2. **Verificar tipo**: Atributo `data-saved`
3. **Encontrar índice**: Posición en DOM vs Array Vue
4. **Validar consistencia**: Texto DOM vs Array
5. **Ejecutar eliminación**:
   - Nueva: Solo del array Vue
   - Guardada: API DELETE + array Vue

#### Eventos Asignados
- **Template Vue**: Preguntas existentes al cargar
- **JavaScript**: Preguntas creadas dinámicamente via `agregarIconoEditar`

### 6. Integración con IA

#### Google Gemini API
- **Servicio**: `useAIAssistant.js`
- **Contexto**: Formularios como base para conversación
- **Ubicación**: `AssistantChatAI.vue`

## 🔧 Configuraciones Críticas

### Vite Proxy (vite.config.js)
```javascript
server: {
  proxy: {
    '/api': 'http://217.196.61.73:8082',
    '/images': 'http://217.196.61.73:8082'
  }
}
```

### Estructura de FormData para API
```javascript
const questionData = {
    formId: parseInt(formId),
    questionText: inputPregunta.value,
    questionOrder: parseInt(ordenPregunta.innerText),
    questionTypeId: parseInt(selectTipoPregunta.value),
    options: optionsArray
};

formData.append("question", JSON.stringify(questionData));
// + archivos comprimidos
```

## 📊 Endpoints API Principales

### Formularios
- `GET /api/forms/{formId}` - Obtener formulario
- `GET /api/questions/form/{formId}` - Obtener preguntas del formulario

### Preguntas
- `POST /api/questions` - Crear pregunta (con FormData multipart)
- `DELETE /api/questions/{questionId}` - Eliminar pregunta

### Tipos de Pregunta
- `GET /api/question-types` - Obtener tipos disponibles

### Imágenes
- `GET /images/{filename}` - Servir imagen (via proxy)

## 🎨 Patrones UX Establecidos

### 1. Creación de Preguntas
1. Click en "Agregar pregunta" → Loader
2. Validación pregunta anterior → API call
3. Nueva pregunta aparece → Auto-focus input
4. Opción por defecto agregada automáticamente

### 2. Edición de Preguntas Guardadas
1. Pregunta renderizada → Campos bloqueados + icono editar
2. Click editar → Campos activos + icono guardar
3. Modificación → Click guardar → Validación + API
4. Guardado exitoso → Campos bloqueados + icono editar

### 3. Gestión de Opciones
1. Hover opción → Preview (imagen + salto)
2. Click opción → Selección activa (input focus)
3. Blur input → Deselección
4. Click equis → Eliminación opción

### 4. Manejo de Imágenes
- **Carga**: Click ícono → File picker → Compresión → Preview
- **Visualización**: Misma estructura para nuevas y guardadas
- **Eliminación**: Equis solo visible en modo edición

## 🐛 Problemas Resueltos Críticos

### 1. Error Async/Await en Templates
- **Problema**: `validarPreguntaAnterior` async llamada sync desde template
- **Solución**: Wrapper `handleAddQuestion` con try/catch

### 2. Inconsistencia DOM-Vue
- **Problema**: JavaScript manipula DOM, Vue pierde sincronización
- **Solución**: Funciones global bridge `window.*Vue`

### 3. Eliminación Incorrecta
- **Problema**: Eliminar pregunta incorrecta (en creación vs target)
- **Solución**: Identificación precisa con `closest()` + validaciones

### 4. Campos Sin Bloquear
- **Problema**: "Carga de archivos" mantenía campos activos
- **Solución**: Selectores específicos en `bloquear/activarCamposPregunta`

### 5. Imágenes No Cargan
- **Problema**: Proxy mal configurado, `src="[object Object]"`
- **Solución**: Proxy `/images` + estructura correcta `option.image.url`

### 6. Equis Siempre Visibles
- **Problema**: Equis de imágenes no se ocultaban en modo lectura  
- **Solución**: Clase `equisImg none` por defecto + control JavaScript

## 🔄 Flujo Completo de Trabajo

### Carga Inicial
1. **Vue Router** → `DetailForm.vue`
2. **Props**: `formId` desde URL
3. **API**: Cargar formulario + preguntas existentes
4. **Renderizado**: Template Vue con preguntas guardadas
5. **Post-render**: `bloquearPreguntasExistentes()` + eventos

### Creación Nueva Pregunta
1. **Click** → `handleAddQuestion()` + loader
2. **Validación** → `validarPreguntaAnterior()` + compresión imágenes
3. **API** → `POST /api/questions` con FormData
4. **Success** → `bloquearCamposPregunta()` + `agregarIconoEditar()`
5. **Nueva pregunta** → `agregarNuevaPreguntaVue()` al array Vue

### Edición Pregunta Existente
1. **Click editar** → `activarCamposPregunta()`
2. **Modificación** → Usuario edita campos
3. **Click guardar** → `validarYEnviarPregunta()`
4. **API Update** → Envío cambios
5. **Success** → `bloquearCamposPregunta()`

## ⚠️ Consideraciones para Futuras Sesiones

### Mantener Consistencia
1. **Estados UX**: Siempre loader para operaciones async
2. **Eventos**: Asignar tanto en template Vue como en JavaScript dinámico
3. **Validaciones**: DOM vs Vue state consistency checks
4. **Imágenes**: Compresión obligatoria antes de envío

### Patrones Establecidos
- **Funciones bridge**: `window.*Vue` para JavaScript ↔ Vue
- **Identificación elementos**: `closest('.draggable')` siempre
- **Estados campos**: `disabled` + clases `none` para ocultar
- **Debugging**: Logs detallados con marcadores `===`

### Archivos Críticos No Modificar Sin Cuidado
- `formsFunctions.js` → Lógica core JavaScript
- `DetailForm.vue` → Template y estado principal Vue  
- `vite.config.js` → Configuración proxy esencial

---

## 📝 Notas de Implementación

**Fecha última actualización**: Enero 2025
**Estado**: Funcional con todas las características principales implementadas
**Próximas mejoras sugeridas**: 
- Lógica de saltos entre preguntas
- Validación de formularios completos
- Optimización de carga de imágenes
- Tests unitarios para funciones críticas