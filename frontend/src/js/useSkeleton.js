import { ref, computed } from 'vue'

export function useSkeleton() {
  const isLoading = ref(false) // Iniciar en false, solo mostrar cuando realmente se necesite
  const isFading = ref(false)
  
  // Función para iniciar el skeleton
  const startLoading = () => {
    isLoading.value = true
    isFading.value = false
  }
  
  // Función para terminar el skeleton con fade-out rápido
  const finishLoading = () => {
    if (!isLoading.value) return // Ya está terminado
    
    // Iniciar fade out
    isFading.value = true
    
    // Ocultar skeleton después del fade out (reducido a 150ms)
    setTimeout(() => {
      isLoading.value = false
      isFading.value = false
    }, 150)
  }
  
  // Estado computed para facilitar el uso en templates
  const showSkeleton = computed(() => isLoading.value)
  const showFadeOut = computed(() => isFading.value)
  
  return {
    isLoading: showSkeleton,
    isFading: showFadeOut,
    startLoading,
    finishLoading
  }
}