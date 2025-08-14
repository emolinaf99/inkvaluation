import { ref, onMounted } from 'vue'

export function useSkeletonLoader(duration = 1500) {
  const isLoading = ref(true)
  const isFading = ref(false)
  
  onMounted(() => {
    // Simular carga de datos
    setTimeout(() => {
      // Iniciar fade out
      isFading.value = true
      
      // Ocultar skeleton después del fade out
      setTimeout(() => {
        isLoading.value = false
      }, 300) // Duración del fade out
      
    }, duration)
  })
  
  const showSkeleton = () => {
    isLoading.value = true
    isFading.value = false
  }
  
  const hideSkeleton = () => {
    isFading.value = true
    setTimeout(() => {
      isLoading.value = false
    }, 300)
  }
  
  return {
    isLoading,
    isFading,
    showSkeleton,
    hideSkeleton
  }
}