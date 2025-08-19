import { ref, reactive } from 'vue'

export function useFormsAPI() {
  const loading = ref(false)
  const error = ref(null)
  const baseURL = 'http://217.196.61.73:8082/api'

  // Estados para los datos
  const forms = ref([])
  const currentForm = ref(null)
  const questions = ref([])
  const currentQuestion = ref(null)
  const options = ref([])

  // Estado para el flujo del formulario
  const formState = reactive({
    currentFormId: null,
    currentQuestionId: null,
    responses: {},
    visitedQuestions: [],
    nextQuestionId: null
  })

  // Función auxiliar para manejar errores
  const handleError = (err, context) => {
    console.error(`Error in ${context}:`, err)
    error.value = `Error en ${context}: ${err.message || 'Error desconocido'}`
    loading.value = false
  }

  // Función auxiliar para realizar peticiones
  const apiRequest = async (endpoint, options = {}) => {
    try {
      const response = await fetch(`${baseURL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (err) {
      throw new Error(`Network error: ${err.message}`)
    }
  }

  // 1. Obtener todos los formularios
  const getForms = async () => {
    loading.value = true
    error.value = null
    
    try {
      const data = await apiRequest('/forms')
      forms.value = data
      return data
    } catch (err) {
      handleError(err, 'obtener formularios')
      return []
    } finally {
      loading.value = false
    }
  }

  // 2. Obtener formularios por servicio
  const getFormsByService = async (serviceId) => {
    loading.value = true
    error.value = null
    
    try {
      console.log(`Consultando API: ${baseURL}/forms/service/${serviceId}`)
      const data = await apiRequest(`/forms/service/${serviceId}`)
      
      if (Array.isArray(data)) {
        // Ordenar por ID descendente para obtener el más reciente al final
        const formularios = data.sort((a, b) => {
          // Si tienen fecha de creación, usar esa
          if (a.created_at && b.created_at) {
            return new Date(a.created_at) - new Date(b.created_at)
          }
          // Si tienen updated_at, usar esa
          if (a.updated_at && b.updated_at) {
            return new Date(a.updated_at) - new Date(b.updated_at)
          }
          // Como último recurso, usar ID
          return (a.id || 0) - (b.id || 0)
        })
        
        forms.value = formularios
        console.log(`Se obtuvieron ${formularios.length} formularios para el servicio ${serviceId}:`, formularios.map(f => ({ id: f.id, title: f.title || f.name })))
        return formularios
      } else if (data && typeof data === 'object') {
        // Si devuelve un solo objeto, convertir a array
        forms.value = [data]
        console.log('Se obtuvo 1 formulario (convertido a array):', { id: data.id, title: data.title || data.name })
        return [data]
      } else {
        console.warn('Respuesta inesperada de la API:', data)
        return []
      }
    } catch (err) {
      console.error('Error detallado al obtener formularios:', {
        serviceId,
        error: err.message,
        stack: err.stack
      })
      
      // Mensaje más específico según el tipo de error
      if (err.message.includes('500')) {
        if (err.message.includes('Query did not return a unique result') || err.message.includes('results were returned')) {
          // Error específico de resultados múltiples - esto es esperado cuando hay varios formularios
          console.log('API devuelve error de duplicados, pero esto es normal cuando hay múltiples formularios. Intentando endpoint alternativo...')
          error.value = 'API con problema de consulta múltiple. Usando formularios locales.'
        } else {
          error.value = 'Error del servidor. Contacta al administrador.'
        }
      } else if (err.message.includes('404')) {
        error.value = 'No se encontraron formularios para este servicio.'
      } else if (err.message.includes('Network error')) {
        error.value = 'Error de conexión con el servidor. Verifica tu conexión a internet.'
      } else {
        error.value = `Error al obtener formularios: ${err.message}`
      }
      
      return []
    } finally {
      loading.value = false
    }
  }

  // 3. Obtener un formulario específico
  const getForm = async (formId) => {
    loading.value = true
    error.value = null
    
    try {
      const data = await apiRequest(`/forms/${formId}`)
      currentForm.value = data
      formState.currentFormId = formId
      return data
    } catch (err) {
      handleError(err, 'obtener formulario')
      return null
    } finally {
      loading.value = false
    }
  }

  // 4. Obtener preguntas de un formulario
  const getQuestions = async (formId) => {
    loading.value = true
    error.value = null
    
    try {
      const data = await apiRequest(`/forms/${formId}/questions`)
      questions.value = data
      return data
    } catch (err) {
      handleError(err, 'obtener preguntas')
      return []
    } finally {
      loading.value = false
    }
  }

  // 5. Obtener una pregunta específica
  const getQuestion = async (formId, questionId) => {
    loading.value = true
    error.value = null
    
    try {
      const data = await apiRequest(`/forms/${formId}/questions/${questionId}`)
      currentQuestion.value = data
      formState.currentQuestionId = questionId
      
      // Agregar a preguntas visitadas si no está ya
      if (!formState.visitedQuestions.includes(questionId)) {
        formState.visitedQuestions.push(questionId)
      }
      
      return data
    } catch (err) {
      handleError(err, 'obtener pregunta')
      return null
    } finally {
      loading.value = false
    }
  }

  // 6. Obtener opciones de una pregunta
  const getOptions = async (formId, questionId) => {
    loading.value = true
    error.value = null
    
    try {
      const data = await apiRequest(`/forms/${formId}/questions/${questionId}/options`)
      options.value = data
      return data
    } catch (err) {
      handleError(err, 'obtener opciones')
      return []
    } finally {
      loading.value = false
    }
  }

  // 7. Obtener la primera pregunta de un formulario
  const getFirstQuestion = async (formId) => {
    loading.value = true
    error.value = null
    
    try {
      const data = await apiRequest(`/forms/${formId}/questions/first`)
      currentQuestion.value = data
      formState.currentQuestionId = data?.id
      
      if (data?.id && !formState.visitedQuestions.includes(data.id)) {
        formState.visitedQuestions.push(data.id)
      }
      
      return data
    } catch (err) {
      handleError(err, 'obtener primera pregunta')
      return null
    } finally {
      loading.value = false
    }
  }

  // 8. Obtener la siguiente pregunta basada en una opción seleccionada
  const getNextQuestion = async (formId, questionId, optionId) => {
    loading.value = true
    error.value = null
    
    try {
      const data = await apiRequest(`/forms/${formId}/questions/${questionId}/next?optionId=${optionId}`)
      
      if (data) {
        currentQuestion.value = data
        formState.currentQuestionId = data.id
        formState.nextQuestionId = null
        
        // Agregar a preguntas visitadas
        if (!formState.visitedQuestions.includes(data.id)) {
          formState.visitedQuestions.push(data.id)
        }
      } else {
        // No hay más preguntas
        formState.nextQuestionId = null
        currentQuestion.value = null
      }
      
      return data
    } catch (err) {
      handleError(err, 'obtener siguiente pregunta')
      return null
    } finally {
      loading.value = false
    }
  }

  // 9. Guardar respuesta
  const saveResponse = async (formId, questionId, optionId, customValue = null) => {
    loading.value = true
    error.value = null
    
    try {
      const payload = {
        formId,
        questionId,
        optionId,
        customValue,
        timestamp: new Date().toISOString()
      }
      
      const data = await apiRequest('/responses', {
        method: 'POST',
        body: JSON.stringify(payload)
      })
      
      // Guardar en estado local
      formState.responses[questionId] = {
        optionId,
        customValue,
        timestamp: payload.timestamp
      }
      
      return data
    } catch (err) {
      handleError(err, 'guardar respuesta')
      return null
    } finally {
      loading.value = false
    }
  }

  // 10. Enviar formulario completo
  const submitForm = async (formId, sessionId = null) => {
    loading.value = true
    error.value = null
    
    try {
      const payload = {
        formId,
        sessionId,
        responses: formState.responses,
        completedAt: new Date().toISOString(),
        visitedQuestions: formState.visitedQuestions
      }
      
      const data = await apiRequest('/forms/submit', {
        method: 'POST',
        body: JSON.stringify(payload)
      })
      
      return data
    } catch (err) {
      handleError(err, 'enviar formulario')
      return null
    } finally {
      loading.value = false
    }
  }

  // 11. Funciones de navegación
  const startForm = async (formId) => {
    // Reiniciar estado
    formState.currentFormId = formId
    formState.currentQuestionId = null
    formState.responses = {}
    formState.visitedQuestions = []
    formState.nextQuestionId = null
    
    // Obtener formulario y primera pregunta
    await getForm(formId)
    const firstQuestion = await getFirstQuestion(formId)
    
    if (firstQuestion) {
      const questionOptions = await getOptions(formId, firstQuestion.id)
      return {
        question: firstQuestion,
        options: questionOptions
      }
    }
    
    return null
  }

  // 12. Procesar selección de opción y obtener siguiente pregunta
  const processOptionSelection = async (optionId, customValue = null) => {
    if (!formState.currentFormId || !formState.currentQuestionId) {
      throw new Error('No hay formulario o pregunta activa')
    }
    
    // Guardar respuesta
    await saveResponse(
      formState.currentFormId, 
      formState.currentQuestionId, 
      optionId, 
      customValue
    )
    
    // Obtener siguiente pregunta
    const nextQuestion = await getNextQuestion(
      formState.currentFormId, 
      formState.currentQuestionId, 
      optionId
    )
    
    if (nextQuestion) {
      const questionOptions = await getOptions(formState.currentFormId, nextQuestion.id)
      return {
        question: nextQuestion,
        options: questionOptions,
        isComplete: false
      }
    } else {
      return {
        question: null,
        options: [],
        isComplete: true
      }
    }
  }

  // 13. Verificar si el formulario está completo
  const isFormComplete = () => {
    return !formState.currentQuestionId && formState.visitedQuestions.length > 0
  }

  // 14. Obtener progreso del formulario
  const getFormProgress = async () => {
    if (!formState.currentFormId) return { current: 0, total: 0, percentage: 0 }
    
    try {
      const allQuestions = await getQuestions(formState.currentFormId)
      const total = allQuestions.length
      const current = formState.visitedQuestions.length
      const percentage = total > 0 ? Math.round((current / total) * 100) : 0
      
      return { current, total, percentage }
    } catch (err) {
      return { current: 0, total: 0, percentage: 0 }
    }
  }

  // 15. Limpiar estado
  const resetForm = () => {
    formState.currentFormId = null
    formState.currentQuestionId = null
    formState.responses = {}
    formState.visitedQuestions = []
    formState.nextQuestionId = null
    
    currentForm.value = null
    currentQuestion.value = null
    questions.value = []
    options.value = []
    error.value = null
  }

  return {
    // Estados reactivos
    loading,
    error,
    forms,
    currentForm,
    questions,
    currentQuestion,
    options,
    formState,
    
    // Métodos de API
    getForms,
    getFormsByService,
    getForm,
    getQuestions,
    getQuestion,
    getOptions,
    getFirstQuestion,
    getNextQuestion,
    saveResponse,
    submitForm,
    
    // Métodos de navegación
    startForm,
    processOptionSelection,
    isFormComplete,
    getFormProgress,
    resetForm
  }
}