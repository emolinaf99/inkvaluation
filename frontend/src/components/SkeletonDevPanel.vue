<template>
  <div v-if="isDev" class="skeleton-dev-panel" :class="{ 'minimized': isMinimized }">
    <!-- Toggle Button -->
    <div class="panel-toggle" @click="isMinimized = !isMinimized">
      <i class="fa-solid" :class="isMinimized ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
      <span>Skeleton Dev</span>
    </div>

    <!-- Panel Content -->
    <div v-if="!isMinimized" class="panel-content">
      <!-- Mode Controls -->
      <div class="control-group">
        <h4>🎭 Control de Modo</h4>
        <div class="control-row">
          <label class="switch">
            <input type="checkbox" v-model="controls.state.value.isDevMode" @change="onModeChange">
            <span class="slider"></span>
          </label>
          <span>Modo Desarrollo {{ controls.state.value.isDevMode ? 'ON' : 'OFF' }}</span>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="control-group">
        <h4>⚡ Acciones Rápidas</h4>
        <div class="button-grid">
          <button @click="controls.forceShowAll()" 
                  :class="{ active: controls.state.value.forceShow }">
            <i class="fa-solid fa-eye"></i>
            {{ controls.state.value.forceShow ? 'Ocultar' : 'Mostrar' }} Todo
          </button>
          
          <button @click="controls.pauseAll()" 
                  :class="{ active: controls.state.value.isPaused }">
            <i class="fa-solid" :class="controls.state.value.isPaused ? 'fa-play' : 'fa-pause'"></i>
            {{ controls.state.value.isPaused ? 'Reanudar' : 'Pausar' }}
          </button>
          
          <button @click="restartAll()" class="restart-btn">
            <i class="fa-solid fa-rotate-right"></i>
            Reiniciar
          </button>
          
          <button @click="controls.resetAll()" class="reset-btn">
            <i class="fa-solid fa-broom"></i>
            Reset
          </button>
        </div>
      </div>

      <!-- Duration Control -->
      <div class="control-group">
        <h4>⏱️ Duración</h4>
        <div class="duration-control">
          <input 
            type="range" 
            min="500" 
            max="10000" 
            step="100"
            v-model="durationValue"
            @input="onDurationChange"
          >
          <span class="duration-label">{{ (durationValue / 1000).toFixed(1) }}s</span>
        </div>
        <div class="duration-presets">
          <button v-for="preset in durationPresets" 
                  :key="preset.value"
                  @click="setDuration(preset.value)"
                  :class="{ active: durationValue == preset.value }">
            {{ preset.label }}
          </button>
        </div>
      </div>

      <!-- View Selector -->
      <div class="control-group">
        <h4>📱 Vista Específica</h4>
        <div class="view-selector">
          <select v-model="selectedView" @change="onViewChange">
            <option value="all">🌍 Todas las vistas</option>
            <option value="login">🔐 Login</option>
            <option value="register">📝 Register</option>
            <option value="account">👤 Account</option>
            <option value="business">🏢 Business</option>
            <option value="requests">📋 Requests</option>
            <option value="forms">📋 Forms</option>
            <option value="chat">💬 Chat</option>
            <option value="config">⚙️ Config</option>
            <option value="prices">💰 Prices</option>
            <option value="mailbox">📪 Mailbox</option>
          </select>
        </div>
      </div>

      <!-- Info Panel -->
      <div class="control-group info-panel">
        <h4>📊 Estado Actual</h4>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">Modo:</span>
            <span class="value" :class="controls.state.value.isDevMode ? 'active' : 'inactive'">
              {{ controls.state.value.isDevMode ? 'Desarrollo' : 'Producción' }}
            </span>
          </div>
          <div class="info-item">
            <span class="label">Estado:</span>
            <span class="value" :class="getStatusClass()">
              {{ getStatusText() }}
            </span>
          </div>
          <div class="info-item">
            <span class="label">Vista:</span>
            <span class="value">{{ getViewText() }}</span>
          </div>
          <div class="info-item">
            <span class="label">Duración:</span>
            <span class="value">{{ (durationValue / 1000).toFixed(1) }}s</span>
          </div>
        </div>
      </div>

      <!-- Instructions -->
      <div class="control-group instructions">
        <h4>💡 Instrucciones</h4>
        <ul>
          <li><strong>Mostrar Todo:</strong> Fuerza todos los skeletons visibles</li>
          <li><strong>Pausar:</strong> Mantiene skeletons activos indefinidamente</li>
          <li><strong>Vista Específica:</strong> Solo afecta la vista seleccionada</li>
          <li><strong>Reiniciar:</strong> Reinicia ciclo de loading</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSkeletonDevControls } from '../js/useSkeletonDev.js'

const controls = useSkeletonDevControls()
const isMinimized = ref(false)
const durationValue = ref(2000)
const selectedView = ref('all')

// Verificar si estamos en modo desarrollo
const isDev = computed(() => {
  return process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost'
})

const durationPresets = [
  { label: '0.5s', value: 500 },
  { label: '1s', value: 1000 },
  { label: '2s', value: 2000 },
  { label: '3s', value: 3000 },
  { label: '5s', value: 5000 },
  { label: '∞', value: 999999 }
]

const onModeChange = () => {
  if (!controls.state.value.isDevMode) {
    controls.resetAll()
  }
}

const onDurationChange = () => {
  controls.setDuration(parseInt(durationValue.value))
}

const onViewChange = () => {
  controls.selectView(selectedView.value)
}

const setDuration = (duration) => {
  durationValue.value = duration
  controls.setDuration(duration)
}

const restartAll = () => {
  console.log('🔄 Restart button clicked')
  console.log('📊 Current state:', controls.state.value)
  
  // Reiniciar ciclo - ocultar y luego mostrar
  controls.state.value.forceShow = false
  controls.state.value.isPaused = false
  
  console.log('📤 Dispatching skeleton-restart event...')
  
  // Dispatch event immediately
  window.dispatchEvent(new CustomEvent('skeleton-restart', {
    detail: {
      selectedView: controls.state.value.selectedView,
      duration: controls.state.value.currentDuration
    }
  }))
  
  console.log('✅ Event dispatched')
}

const getStatusText = () => {
  if (controls.state.value.forceShow) return 'Forzado'
  if (controls.state.value.isPaused) return 'Pausado'
  return 'Automático'
}

const getStatusClass = () => {
  if (controls.state.value.forceShow) return 'forced'
  if (controls.state.value.isPaused) return 'paused'
  return 'auto'
}

const getViewText = () => {
  const option = document.querySelector(`option[value="${selectedView.value}"]`)
  return option ? option.textContent : 'Todas'
}

onMounted(() => {
  // Sincronizar valores iniciales
  durationValue.value = controls.state.value.currentDuration
  selectedView.value = controls.state.value.selectedView
})
</script>

<style scoped>
.skeleton-dev-panel {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: rgba(17, 75, 122, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  z-index: 10000;
  font-family: system-ui, -apple-system, sans-serif;
  font-size: 14px;
  max-width: 320px;
  max-height: 80vh;
  overflow-y: auto;
  transition: all 0.3s ease;
}

.skeleton-dev-panel.minimized {
  max-height: 50px;
  overflow: hidden;
}

.panel-toggle {
  padding: 12px 16px;
  background: rgba(3, 155, 229, 0.2);
  color: white;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  border-radius: 12px 12px 0 0;
  transition: background 0.3s ease;
}

.panel-toggle:hover {
  background: rgba(3, 155, 229, 0.3);
}

.panel-content {
  padding: 16px;
  color: white;
}

.control-group {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.control-group:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.control-group h4 {
  margin: 0 0 12px 0;
  font-size: 16px;
  color: #00d4ff;
}

.control-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Switch Toggle */
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.3s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #039BE5;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

/* Buttons */
.button-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

button {
  padding: 8px 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  justify-content: center;
}

button:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
}

button.active {
  background: rgba(3, 155, 229, 0.3);
  border-color: #039BE5;
  color: #00d4ff;
}

button.restart-btn {
  background: rgba(246, 202, 117, 0.2);
  border-color: #F6CA75;
}

button.reset-btn {
  background: rgba(231, 76, 60, 0.2);
  border-color: #e74c3c;
}

/* Duration Control */
.duration-control {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.duration-control input[type="range"] {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.2);
  outline: none;
  -webkit-appearance: none;
}

.duration-control input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #039BE5;
  cursor: pointer;
}

.duration-label {
  font-weight: 600;
  color: #00d4ff;
  min-width: 40px;
}

.duration-presets {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.duration-presets button {
  flex: 0 0 auto;
  padding: 4px 8px;
  font-size: 11px;
  min-width: auto;
}

/* View Selector */
.view-selector select {
  width: 100%;
  padding: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: 6px;
  font-size: 12px;
}

.view-selector select option {
  background: #114b7a;
  color: white;
}

/* Info Panel */
.info-panel {
  background: rgba(0, 0, 0, 0.2);
  padding: 12px;
  border-radius: 8px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-item .label {
  font-size: 12px;
  color: #D0D3D8;
}

.info-item .value {
  font-size: 12px;
  font-weight: 600;
}

.info-item .value.active {
  color: #90d387;
}

.info-item .value.inactive {
  color: #e74c3c;
}

.info-item .value.forced {
  color: #F6CA75;
}

.info-item .value.paused {
  color: #039BE5;
}

.info-item .value.auto {
  color: #90d387;
}

/* Instructions */
.instructions ul {
  margin: 0;
  padding-left: 16px;
  font-size: 12px;
  color: #D0D3D8;
  line-height: 1.5;
}

.instructions li {
  margin-bottom: 4px;
}

/* Responsive */
@media (max-width: 768px) {
  .skeleton-dev-panel {
    right: 10px;
    bottom: 10px;
    max-width: 280px;
    font-size: 13px;
  }
  
  .button-grid {
    grid-template-columns: 1fr;
  }
}

/* Scrollbar */
.skeleton-dev-panel::-webkit-scrollbar {
  width: 6px;
}

.skeleton-dev-panel::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.skeleton-dev-panel::-webkit-scrollbar-thumb {
  background: rgba(3, 155, 229, 0.5);
  border-radius: 3px;
}

.skeleton-dev-panel::-webkit-scrollbar-thumb:hover {
  background: rgba(3, 155, 229, 0.8);
}
</style>