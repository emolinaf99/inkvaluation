# Sistema de Chatbot AssistantChat - Especificaciones Técnicas

> **Documentación completa del sistema de asistente virtual para InkValuation**  
> *Fecha de creación: Agosto 2024*

---

## 🎯 Objetivo General

Crear un chatbot dinámico en `AssistantChat.vue` que simule una conversación amigable para recopilar información de cotización mediante formularios configurables, integrando con la configuración del asistente y los servicios disponibles.

---

## 🔄 Flujo del Chatbot

### 1. **Saludo Inicial** (Estático)
```
¡Hola! Soy [nombreAsistente], asistente de [nombreDelNegocio].
[mensajeDeBienvenida]
```

**Fuentes de datos:**
- `nombreAsistente`: ConfigAssistant.vue → "Nombre del asistente"
- `nombreDelNegocio`: Datos del usuario/estudio
- `mensajeDeBienvenida`: ConfigAssistant.vue → "Mensaje de bienvenida"

### 2. **Solicitud de Nombre** (Estático)
```
¿Cuál es tu nombre?
```
- **Input type**: text
- **Validación**: Automática por tiempo (milisegundos después de la última letra)
- **Almacenamiento**: Variable `nombreUsuario`

### 3. **Selección de Servicio** (Dinámico)
```
[nombreUsuario], ¿Qué servicio deseas realizarte?
```
- **Fuente**: Servicios habilitados del usuario/estudio
  - **Usuario**: Account.vue → Servicios seleccionados
  - **Estudio**: Bussiness.vue → Servicios disponibles
- **Formato**: Lista de opciones (radio buttons)
- **Almacenamiento**: Variable `servicioSeleccionado`

### 4. **Formulario Dinámico** (Según Configuración)
Una vez seleccionado el servicio, cargar el formulario asociado desde ConfigAssistant.vue:

**Fuente**: ConfigAssistant.vue → "Formularios de servicios"
- Cada servicio tiene un formulario asignado
- El formulario se obtiene de Forms.vue filtrado por `serviceId`

---

## 🛠 Arquitectura Técnica

### Componentes Involucrados

#### **AssistantChat.vue** (Principal)
- **Función**: Interfaz de chat y lógica de conversación
- **Estado**: Gestión del flujo del chatbot
- **Renderizado**: Mensajes dinámicos y inputs

#### **ConfigAssistant.vue** (Configuración)
- **Datos necesarios**:
  - `nombreAsistente`: String
  - `mensajeBienvenida`: String
  - `formulariosPorServicio`: Array de mappings servicio→formulario

#### **Forms.vue** (Formularios)
- **Función**: Fuente de formularios disponibles
- **Filtrado**: Por `serviceId` para mostrar formularios relevantes
- **Estructura**: Preguntas, tipos de input, validaciones

#### **Account.vue / Bussiness.vue** (Servicios)
- **Account**: Servicios habilitados para usuario individual
- **Bussiness**: Servicios disponibles para estudio
- **Dato clave**: Array de servicios activos

---

## 📊 Estructura de Datos

### Estado del Chatbot
```javascript
const chatState = reactive({
  // Configuración
  nombreAsistente: '',
  mensajeBienvenida: '',
  nombreNegocio: '',
  
  // Usuario
  nombreUsuario: '',
  servicioSeleccionado: null,
  formularioActual: null,
  
  // Flujo
  etapaActual: 'saludo', // saludo, nombre, servicio, formulario, completado
  respuestasFormulario: {},
  preguntaActual: 0,
  
  // UI
  mensajes: [],
  esperandoInput: false,
  tipoInputActual: 'text' // text, radio, checkbox, select, etc.
})
```

### Estructura de Formulario
```javascript
const formulario = {
  id: 1,
  Title: 'Formulario de Tatuajes',
  serviceId: 1,
  preguntas: [
    {
      id: 1,
      texto: '¿Qué tamaño deseas para tu tatuaje?',
      tipo: 'radio',
      opciones: ['Pequeño', 'Mediano', 'Grande'],
      requerido: true
    },
    {
      id: 2,
      texto: '¿En qué zona del cuerpo?',
      tipo: 'select',
      opciones: ['Brazo', 'Pierna', 'Espalda', 'Torso'],
      requerido: true
    },
    {
      id: 3,
      texto: 'Describe tu idea',
      tipo: 'textarea',
      requerido: false
    }
  ]
}
```

---

## 🚀 Implementación por Fases

### **Fase 1: Implementación Básica** (Actual)
- [ ] Reestructurar AssistantChat.vue para ser dinámico
- [ ] Conectar con ConfigAssistant.vue para obtener configuración
- [ ] Implementar flujo básico: saludo → nombre → servicio
- [ ] Mostrar todos los formularios disponibles (mock)

### **Fase 2: Integración con Servicios** (Con Backend)
- [ ] Filtrar servicios por usuario/estudio
- [ ] Cargar formularios específicos por servicio
- [ ] Implementar validaciones y restricciones

### **Fase 3: Persistencia y Envío** (Backend Completo)
- [ ] Guardar respuestas en base de datos
- [ ] Enviar solicitud completa al backend
- [ ] Generar cotización basada en respuestas

---

## 🎨 Experiencia de Usuario (UX)

### Principios de Diseño
1. **Conversacional**: Simular chat humano natural
2. **Progresivo**: Una pregunta a la vez
3. **Validación Inmediata**: Respuesta instantánea sin botones "enviar"
4. **Visual**: Mantener el diseño actual de chat
5. **Accesible**: Soporte para diferentes tipos de input

### Timing y Transiciones
- **Auto-avance**: 500ms después de última tecla en inputs de texto
- **Selección**: Inmediata en radio/select
- **Animaciones**: Smooth scroll al agregar mensajes
- **Feedback**: Indicadores de "escribiendo..." del bot

### Estados de Input
```javascript
const inputStates = {
  text: {
    component: 'input',
    autoAdvance: 500, // ms
    validation: 'length'
  },
  radio: {
    component: 'radio-group',
    autoAdvance: 0, // inmediato
    validation: 'selection'
  },
  textarea: {
    component: 'textarea',
    autoAdvance: 1000, // más tiempo
    validation: 'optional'
  }
}
```

---

## 🔗 Integración con Backend

### Endpoints Requeridos (Futuros)
```
GET /api/assistant/config/{userId}
- Configuración del asistente del usuario

GET /api/services/available/{userId}
- Servicios habilitados para el usuario

GET /api/forms/by-service/{serviceId}
- Formularios asociados a un servicio

POST /api/quotation-requests
- Enviar solicitud completa de cotización
```

### Payload de Solicitud Final
```javascript
const solicitudCotizacion = {
  usuarioInfo: {
    nombre: 'Juan Pérez',
    servicio: 'Tatuaje'
  },
  formulario: {
    formularioId: 1,
    respuestas: {
      1: 'Mediano',
      2: 'Brazo',
      3: 'Un dragón en estilo japonés'
    }
  },
  timestamp: '2024-08-15T10:30:00Z',
  asistentId: 123
}
```

---

## 🎛 Panel de Configuración

### ConfigAssistant.vue - Nuevos Campos
```vue
<template>
  <!-- Configuración existente -->
  
  <!-- Nueva sección: Mapeo de Formularios -->
  <div class="formularios-mapping">
    <h4>Formularios por Servicio</h4>
    <div v-for="servicio in serviciosDisponibles" :key="servicio.id">
      <label>{{ servicio.nombre }}</label>
      <select v-model="servicioFormulario[servicio.id]">
        <option v-for="form in formulariosDelServicio(servicio.id)" 
                :value="form.id">
          {{ form.Title }}
        </option>
      </select>
    </div>
  </div>
</template>
```

---

## 📱 Consideraciones Responsive

### Mobile-First Design
- **Chat burbujas**: Adaptar tamaño a viewport
- **Inputs**: Touch-friendly (mínimo 44px)
- **Scroll**: Auto-scroll suave al agregar mensajes
- **Teclado**: Ajustar viewport cuando aparece teclado móvil

### Desktop Enhancements
- **Animaciones**: Más elaboradas en pantallas grandes
- **Multi-columna**: Sidebar con progreso del formulario
- **Shortcuts**: Navegación con teclado

---

## 🔒 Validaciones y Edge Cases

### Validaciones de Input
```javascript
const validaciones = {
  nombre: {
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-ZÀ-ÿ\s]+$/
  },
  respuestaTexto: {
    minLength: 1,
    maxLength: 500
  },
  seleccion: {
    required: true,
    validOptions: ['option1', 'option2']
  }
}
```

### Edge Cases
- **Servicios sin formularios**: Mostrar mensaje de error amigable
- **Usuario sin servicios**: Redirigir a configuración
- **Conexión perdida**: Guardar estado local, recuperar al reconectar
- **Timeout**: Reiniciar conversación después de inactividad

---

## 🚧 Estado Actual vs. Objetivo

### Estado Actual (AssistantChat.vue)
✅ **Vista estática** con mensajes hardcodeados  
✅ **Diseño visual** completo y responsive  
✅ **Animaciones UX** implementadas  

### Objetivo Inmediato
🔄 **Convertir a dinámico** manteniendo el diseño  
🔄 **Integrar configuración** desde ConfigAssistant  
🔄 **Implementar flujo** saludo → nombre → servicio → formulario  
🔄 **Cargar formularios** desde Forms.vue  

### Objetivo Futuro (Con Backend)
🎯 **Filtrado por usuario** y servicios habilitados  
🎯 **Persistencia** de respuestas en BD  
🎯 **Generación** de cotizaciones automáticas  

---

## 📋 Plan de Desarrollo

### Sprint 1: Fundación Dinámica
1. Reestructurar AssistantChat.vue con estado reactivo
2. Implementar flujo básico de conversación
3. Conectar con ConfigAssistant para configuración
4. Mostrar servicios disponibles (mock)

### Sprint 2: Formularios Dinámicos  
1. Cargar formularios desde Forms.vue
2. Renderizar preguntas dinámicamente
3. Implementar validaciones y auto-avance
4. Guardar respuestas en estado local

### Sprint 3: Integración Backend
1. Conectar endpoints reales
2. Filtrar servicios por usuario
3. Persistir solicitudes en BD
4. Implementar sistema de notificaciones

### Sprint 4: Optimización y Testing
1. Optimizar performance y UX
2. Testing exhaustivo en diferentes dispositivos
3. Implementar analytics y métricas
4. Documentación para usuarios finales

---

*Esta documentación servirá como blueprint para el desarrollo del sistema de chatbot AssistantChat en InkValuation.*