# Integración del Chatbot con API de Formularios Dinámicos

## 📋 Resumen

Se ha implementado un sistema completo de formularios dinámicos en el AssistantChat que se conecta con la API externa para manejar preguntas, opciones, saltos condicionales e imágenes.

## 🏗️ Arquitectura

### Composables Creados

#### 1. `useFormsAPI.js`
Maneja toda la comunicación con la API externa:

```javascript
// Funciones principales:
- getForms()                     // Obtener todos los formularios
- getFormsByService(serviceId)   // Formularios por servicio
- getForm(formId)               // Formulario específico
- getFirstQuestion(formId)      // Primera pregunta
- getNextQuestion(formId, questionId, optionId) // Navegación con saltos
- saveResponse()                // Guardar respuestas
- submitForm()                  // Enviar formulario completo
```

#### 2. `useChatbotForms.js`
Integra la API con la interfaz del chatbot:

```javascript
// Funciones de chatbot:
- iniciarConversacion()
- iniciarFormularioDinamico()
- mostrarPreguntaDinamica()
- procesarRespuestaFormulario()
- completarFormularioDinamico()
```

## 🔄 Flujo de Funcionamiento

### 1. **Inicio de Conversación**
```
Usuario inicia chat → Saludo → Pregunta nombre → Selección servicio
```

### 2. **Activación de Formulario Dinámico**
```
Servicio seleccionado → getFormsByService(serviceId) → startForm(formId)
```

### 3. **Navegación de Preguntas**
```
Pregunta actual → Usuario responde → processOptionSelection() → 
getNextQuestion() → Nueva pregunta ó Completar
```

### 4. **Manejo de Saltos Condicionales**
La API maneja automáticamente los saltos basándose en:
- `questionId` actual
- `optionId` seleccionada
- Lógica de saltos configurada en el backend

## 🎨 Tipos de Preguntas Soportadas

### 1. **Texto Simple**
```vue
<input v-model="chatState.inputValue" type="text" />
```

### 2. **Textarea**
```vue
<textarea v-model="chatState.inputValue"></textarea>
```

### 3. **Opciones Radio**
```vue
<ul class="listChat">
  <li v-for="opcion in chatState.opciones" @click="seleccionarOpcion(opcion)">
    {{ opcion }}
  </li>
</ul>
```

### 4. **Opciones con Imágenes** ⭐ NUEVO
```vue
<div class="opcionesImagenesContainer">
  <div v-for="opcion in chatState.opcionesConImagenes" 
       class="opcionImagen" 
       @click="seleccionarOpcionImagen(opcion)">
    <img :src="opcion.image_url" />
    <p>{{ opcion.text }}</p>
  </div>
</div>
```

## 📊 Estados y Progreso

### Indicadores Visuales

#### 1. **Progreso del Formulario**
```vue
<div class="progresoFormulario">
  <small>Pregunta {{ progreso.current }} de {{ progreso.total }}</small>
  <div class="progresoBarra">
    <div class="progresoFill" :style="{ width: progreso.percentage + '%' }">
  </div>
</div>
```

#### 2. **Estados de Carga**
```vue
<div v-if="estaCargando" class="msgChat cargando">
  <i class="fa-solid fa-spinner fa-spin"></i>
  <p>Cargando...</p>
</div>
```

#### 3. **Errores de API**
```vue
<div v-if="hayErrorAPI" class="msgChat error-api">
  <i class="fa-solid fa-exclamation-triangle"></i>
  <p>{{ formsAPI.error.value }}</p>
</div>
```

## 🔗 Endpoints de API Utilizados

### Base URL
```javascript
const baseURL = 'http://217.196.61.73:8082/api'
```

### Endpoints Principales

#### Formularios
```http
GET    /forms                     # Todos los formularios
GET    /forms/service/{serviceId} # Formularios por servicio  
GET    /forms/{formId}            # Formulario específico
POST   /forms/submit              # Enviar formulario
```

#### Preguntas
```http
GET    /forms/{formId}/questions                    # Todas las preguntas
GET    /forms/{formId}/questions/first              # Primera pregunta
GET    /forms/{formId}/questions/{questionId}       # Pregunta específica
GET    /forms/{formId}/questions/{questionId}/next?optionId={id} # Siguiente pregunta
```

#### Opciones
```http
GET    /forms/{formId}/questions/{questionId}/options # Opciones de pregunta
```

#### Respuestas
```http
POST   /responses  # Guardar respuesta individual
```

## 💾 Estructura de Datos

### Formulario
```javascript
{
  id: 1,
  title: "Formulario de Tatuaje",
  service_id: 1,
  description: "Preguntas para cotización de tatuaje"
}
```

### Pregunta
```javascript
{
  id: 1,
  text: "¿Qué tamaño deseas para tu tatuaje?",
  type: "radio", // "text", "textarea", "radio"
  required: true,
  order: 1
}
```

### Opción
```javascript
{
  id: 1,
  text: "Pequeño (hasta 5cm)",
  value: "small",
  image_url: "https://example.com/small-tattoo.jpg", // Opcional
  description: "Ideal para muñecas o dedos", // Opcional
  jump_to_question_id: 3 // Salto condicional - manejado por API
}
```

### Respuesta
```javascript
{
  formId: 1,
  questionId: 1,
  optionId: 2,
  customValue: "Texto personalizado", // Para inputs text/textarea
  timestamp: "2024-08-15T10:30:00Z"
}
```

## 🎯 Características Implementadas

### ✅ **Funcionalidades Básicas**
- [x] Conexión con API externa
- [x] Formularios dinámicos por servicio
- [x] Navegación secuencial de preguntas
- [x] Múltiples tipos de input
- [x] Guardado de respuestas

### ✅ **Funcionalidades Avanzadas**
- [x] Saltos condicionales automáticos
- [x] Opciones con imágenes
- [x] Indicador de progreso
- [x] Manejo de errores
- [x] Estados de carga
- [x] Responsive design

### ✅ **UX/UI**
- [x] Interfaz conversacional natural
- [x] Animaciones suaves
- [x] Feedback visual inmediato
- [x] Diseño mobile-first
- [x] Indicadores de estado claros

## 🔧 Configuración y Uso

### 1. **Activación**
El sistema se activa automáticamente cuando:
- Usuario selecciona un servicio
- Existen formularios para ese servicio en la API

### 2. **Fallback**
Si no hay formularios en la API:
- Se usa el sistema de formularios estáticos anterior
- Se muestra mensaje informativo al usuario

### 3. **Desarrollo Local**
Para desarrollo sin API:
```javascript
// En useFormsAPI.js, cambiar baseURL
const baseURL = 'http://localhost:8082/api'
```

## 🐛 Manejo de Errores

### Tipos de Errores Manejados
1. **Conexión API**: Red no disponible
2. **Formularios no encontrados**: Servicio sin formularios  
3. **Preguntas malformadas**: Datos inconsistentes
4. **Respuestas inválidas**: Validación fallida

### Estrategias de Recuperación
1. **Reintento automático**: Para errores de red
2. **Fallback a estático**: Si API no disponible
3. **Mensajes amigables**: Errores explicados al usuario
4. **Logging completo**: Para debugging

## 📱 Responsive Design

### Mobile (Base)
- Opciones en columna vertical
- Imágenes 80x80px
- Progreso compacto

### Tablet (768px+)
- Opciones con más espacio
- Imágenes 100x100px
- Layout optimizado

### Desktop (1280px+)
- Opciones más amplias
- Imágenes 120x120px
- Máximo aprovechamiento del espacio

## 🚀 Próximas Mejoras

### Corto Plazo
- [ ] Cache de formularios
- [ ] Validación avanzada
- [ ] Guardado offline

### Largo Plazo  
- [ ] Formularios multiidioma
- [ ] Analytics de conversión
- [ ] A/B testing de preguntas

---

*Esta integración proporciona un sistema completo y escalable para formularios dinámicos en el chatbot de InkValuation.*