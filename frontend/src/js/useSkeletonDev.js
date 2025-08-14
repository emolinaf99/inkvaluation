import { ref, onMounted, computed } from 'vue'

// Estado global para controlar skeletons desde cualquier parte
const globalSkeletonState = ref({
  isDevMode: true, // Activar modo desarrollo
  forceShow: false, // Forzar mostrar skeleton
  currentDuration: 2000, // Duración actual
  isPaused: false, // Pausar en skeleton
  selectedView: 'all' // Vista específica o todas
})

export function useSkeletonDev(viewName = 'default', defaultDuration = 1500) {
  const isLoading = ref(true)
  const isFading = ref(false)
  const localDuration = ref(defaultDuration)
  
  // Computed para determinar si mostrar skeleton
  const shouldShowSkeleton = computed(() => {
    if (!globalSkeletonState.value.isDevMode) {
      return isLoading.value // Modo normal, usar lógica original
    }
    
    // Verificar si esta vista está seleccionada
    const isSelectedView = globalSkeletonState.value.selectedView === 'all' || 
                          globalSkeletonState.value.selectedView === viewName
    
    if (!isSelectedView) {
      return false // No es la vista seleccionada
    }
    
    if (globalSkeletonState.value.forceShow) {
      return true // Forzar mostrar
    }
    
    if (globalSkeletonState.value.isPaused) {
      return isLoading.value // Pausado, mantener estado actual
    }
    
    return isLoading.value // Estado normal
  })
  
  // Función para iniciar el ciclo de loading
  const startLoading = () => {
    console.log('🚀 startLoading called for', viewName)
    
    // Resetear estados
    isLoading.value = true
    isFading.value = false
    
    const duration = globalSkeletonState.value.currentDuration || localDuration.value
    console.log('⏱️ Duration:', duration, 'for', viewName)
    
    // Si duración es muy alta (infinito), no iniciar timeout
    if (duration >= 999999) {
      console.log('♾️ Infinite duration set for', viewName)
      return
    }
    
    setTimeout(() => {
      console.log('⏰ Timeout reached for', viewName, 'isPaused:', globalSkeletonState.value.isPaused)
      
      if (globalSkeletonState.value.isPaused || globalSkeletonState.value.forceShow) {
        console.log('⏸️ Keeping skeleton visible for', viewName)
        return
      }
      
      // Iniciar fade out
      isFading.value = true
      console.log('🌅 Starting fade out for', viewName)
      
      // Ocultar skeleton después del fade out
      setTimeout(() => {
        if (!globalSkeletonState.value.isPaused && !globalSkeletonState.value.forceShow) {
          isLoading.value = false
          console.log('✅ Skeleton hidden for', viewName)
        }
      }, 300)
      
    }, duration)
  }
  
  // Funciones de control manual
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
  
  const toggleSkeleton = () => {
    if (isLoading.value && !isFading.value) {
      hideSkeleton()
    } else {
      showSkeleton()
    }
  }
  
  onMounted(() => {
    if (globalSkeletonState.value.isDevMode && !globalSkeletonState.value.forceShow) {
      startLoading()
    }
    
    // Escuchar eventos de reinicio
    window.addEventListener('skeleton-restart', () => {
      console.log('📣 Skeleton restart event received for', viewName)
      
      // Verificar si esta vista debe reaccionar al evento
      const shouldRestart = globalSkeletonState.value.selectedView === 'all' || 
                           globalSkeletonState.value.selectedView === viewName
                           
      if (shouldRestart && globalSkeletonState.value.isDevMode) {
        console.log('🔄 Restarting skeleton for', viewName)
        startLoading()
      } else {
        console.log('⏭️ Skipping restart for', viewName, '- not selected or dev mode off')
      }
    })
  })
  
  return {
    isLoading: shouldShowSkeleton,
    isFading,
    showSkeleton,
    hideSkeleton,
    toggleSkeleton,
    startLoading,
    // Estado global para el panel de control
    devState: globalSkeletonState,
    // Duración local para esta vista
    localDuration
  }
}

// Funciones globales para controlar desde el panel
export function useSkeletonDevControls() {
  const toggleDevMode = () => {
    globalSkeletonState.value.isDevMode = !globalSkeletonState.value.isDevMode
  }
  
  const forceShowAll = () => {
    globalSkeletonState.value.forceShow = !globalSkeletonState.value.forceShow
  }
  
  const pauseAll = () => {
    globalSkeletonState.value.isPaused = !globalSkeletonState.value.isPaused
  }
  
  const setDuration = (duration) => {
    globalSkeletonState.value.currentDuration = duration
  }
  
  const selectView = (viewName) => {
    globalSkeletonState.value.selectedView = viewName
  }
  
  const resetAll = () => {
    globalSkeletonState.value.forceShow = false
    globalSkeletonState.value.isPaused = false
    globalSkeletonState.value.selectedView = 'all'
  }
  
  return {
    state: globalSkeletonState,
    toggleDevMode,
    forceShowAll,
    pauseAll,
    setDuration,
    selectView,
    resetAll
  }
}