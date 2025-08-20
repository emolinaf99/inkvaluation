import { ref, reactive } from 'vue'

export function useAIAssistant() {
    const isLoading = ref(false)
    const error = ref(null)
    
    // Configuración de la IA
    const AI_CONFIG = {
        provider: 'gemini', // 'openai', 'gemini', 'local'
        apiKey: import.meta.env.VITE_GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY',
        model: 'gemini-pro',
        baseURL: 'https://generativelanguage.googleapis.com/v1beta'
    }

    // Contexto de conversación
    const conversationContext = reactive({
        userProfile: {},
        collectedData: {},
        currentForm: null,
        missingQuestions: [],
        conversationHistory: []
    })

    // Sistema de prompt que incluye los formularios
    const generateSystemPrompt = (availableForms) => {
        return `Eres un asistente especializado en cotizaciones de tatuajes y piercings para InkValuation.

OBJETIVO: Recopilar información de manera conversacional para generar cotizaciones precisas.

FORMULARIOS DISPONIBLES:
${JSON.stringify(availableForms, null, 2)}

INSTRUCCIONES:
1. Mantén una conversación natural y amigable
2. Haz preguntas basadas en los formularios disponibles
3. Adapta las preguntas según las respuestas del usuario
4. Si el usuario menciona un servicio específico, enfócate en ese formulario
5. Extrae información relevante de respuestas en lenguaje natural
6. Al final de cada respuesta, incluye un objeto JSON con la información recopilada

FORMATO DE RESPUESTA:
Tu respuesta conversacional normal...

DATA_EXTRACTION:
{
  "serviceType": "tatuaje|piercing|unknown",
  "extractedData": {
    "campo1": "valor",
    "campo2": "valor"
  },
  "nextSuggestedQuestions": ["pregunta1", "pregunta2"],
  "missingRequiredInfo": ["info_faltante1", "info_faltante2"],
  "completionPercentage": 75
}

EJEMPLOS DE EXTRACCIÓN:
- "Quiero un tatuaje pequeño en el brazo" → serviceType: "tatuaje", extractedData: {"ubicacion": "brazo", "tamaño": "pequeño"}
- "Necesito perforarme la oreja" → serviceType: "piercing", extractedData: {"ubicacion": "oreja"}

Sé conversacional pero eficiente en recopilar información.`;
    }

    // Función para llamar a la IA (Gemini)
    const callGeminiAPI = async (prompt, userMessage) => {
        try {
            const response = await fetch(`${AI_CONFIG.baseURL}/models/${AI_CONFIG.model}:generateContent?key=${AI_CONFIG.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `${prompt}\n\nUsuario: ${userMessage}\nAsistente:`
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 1024,
                    }
                })
            })

            if (!response.ok) {
                throw new Error(`Error de API: ${response.status}`)
            }

            const data = await response.json()
            return data.candidates[0].content.parts[0].text
        } catch (err) {
            console.error('Error llamando a Gemini:', err)
            throw err
        }
    }

    // Función para extraer datos estructurados de la respuesta de IA
    const extractStructuredData = (aiResponse) => {
        try {
            // Buscar el bloque DATA_EXTRACTION en la respuesta
            const dataMatch = aiResponse.match(/DATA_EXTRACTION:\s*({[^}]+})/s)
            if (dataMatch) {
                return JSON.parse(dataMatch[1])
            }
            return null
        } catch (err) {
            console.warn('No se pudo extraer datos estructurados:', err)
            return null
        }
    }

    // Función para limpiar la respuesta de IA (remover el JSON)
    const cleanAIResponse = (aiResponse) => {
        return aiResponse.replace(/DATA_EXTRACTION:\s*{[^}]+}/s, '').trim()
    }

    // Función principal para procesar mensaje con IA
    const processMessageWithAI = async (userMessage, availableForms) => {
        isLoading.value = true
        error.value = null

        try {
            // Generar prompt del sistema con formularios
            const systemPrompt = generateSystemPrompt(availableForms)
            
            // Agregar contexto de conversación
            const fullPrompt = `${systemPrompt}

CONTEXTO DE CONVERSACIÓN ACTUAL:
- Datos recopilados: ${JSON.stringify(conversationContext.collectedData)}
- Historial reciente: ${conversationContext.conversationHistory.slice(-3).map(h => `${h.role}: ${h.message}`).join('\n')}

PREGUNTA DEL USUARIO: ${userMessage}`

            // Llamar a la IA
            const aiResponse = await callGeminiAPI(fullPrompt, userMessage)
            
            // Extraer datos estructurados
            const extractedData = extractStructuredData(aiResponse)
            
            // Limpiar respuesta para mostrar al usuario
            const cleanResponse = cleanAIResponse(aiResponse)
            
            // Actualizar contexto
            conversationContext.conversationHistory.push(
                { role: 'user', message: userMessage },
                { role: 'assistant', message: cleanResponse }
            )
            
            if (extractedData) {
                // Actualizar datos recopilados
                Object.assign(conversationContext.collectedData, extractedData.extractedData || {})
                
                // Actualizar contexto del servicio
                if (extractedData.serviceType && extractedData.serviceType !== 'unknown') {
                    conversationContext.currentForm = extractedData.serviceType
                }
            }

            return {
                message: cleanResponse,
                extractedData: extractedData,
                context: conversationContext
            }

        } catch (err) {
            error.value = `Error procesando mensaje: ${err.message}`
            console.error('Error en processMessageWithAI:', err)
            
            // Respuesta de fallback
            return {
                message: "Disculpa, tuve un problema técnico. ¿Podrías repetir tu mensaje?",
                extractedData: null,
                context: conversationContext
            }
        } finally {
            isLoading.value = false
        }
    }

    // Función para generar resumen de información recopilada
    const generateDataSummary = () => {
        const summary = {
            serviceType: conversationContext.currentForm,
            collectedData: conversationContext.collectedData,
            completionPercentage: calculateCompletionPercentage(),
            missingInfo: identifyMissingInfo()
        }
        return summary
    }

    // Calcular porcentaje de completitud
    const calculateCompletionPercentage = () => {
        // Lógica básica - puede mejorarse según formularios específicos
        const totalFields = Object.keys(conversationContext.collectedData).length
        const filledFields = Object.values(conversationContext.collectedData).filter(v => v && v !== '').length
        
        return totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0
    }

    // Identificar información faltante
    const identifyMissingInfo = () => {
        // Esta función debería comparar con los campos requeridos de los formularios
        // Por ahora, retorna un array básico
        const required = ['ubicacion', 'tamaño', 'descripcion']
        const collected = Object.keys(conversationContext.collectedData)
        
        return required.filter(field => !collected.includes(field))
    }

    // Reiniciar contexto
    const resetContext = () => {
        conversationContext.userProfile = {}
        conversationContext.collectedData = {}
        conversationContext.currentForm = null
        conversationContext.missingQuestions = []
        conversationContext.conversationHistory = []
    }

    // Función para validar si la configuración de IA está lista
    const isAIConfigured = () => {
        return AI_CONFIG.apiKey && AI_CONFIG.apiKey !== 'YOUR_GEMINI_API_KEY'
    }

    return {
        // Estado
        isLoading,
        error,
        conversationContext,
        
        // Funciones principales
        processMessageWithAI,
        generateDataSummary,
        resetContext,
        isAIConfigured,
        
        // Utilidades
        calculateCompletionPercentage,
        identifyMissingInfo
    }
}