<template>
  <div class="skeleton-config">
    <!-- Personal Assistant Config -->
    <div class="skeleton-config-section">
      <div class="skeleton skeleton-text skeleton-text-lg" style="width: 60%; margin-bottom: 1.5rem;"></div>
      
      <!-- Avatar Upload -->
      <div style="text-align: center; margin-bottom: 2rem;">
        <div class="skeleton skeleton-avatar skeleton-avatar-lg" style="margin: 0 auto 1rem;"></div>
        <div class="skeleton skeleton-button" style="width: 120px; margin: 0 auto;"></div>
      </div>

      <!-- Form Fields -->
      <div class="skeleton-form-field" v-for="n in 4" :key="`config-${n}`">
        <div class="skeleton skeleton-text skeleton-text-sm"></div>
        <div class="skeleton skeleton-input"></div>
      </div>

      <!-- Description Textarea -->
      <div class="skeleton-form-field">
        <div class="skeleton skeleton-text skeleton-text-sm"></div>
        <div class="skeleton skeleton-input" style="height: 80px;"></div>
      </div>

      <div class="skeleton skeleton-button" style="width: 100px; margin-top: 1rem;"></div>
    </div>

    <!-- Settings Section -->
    <div class="skeleton-config-section">
      <div class="skeleton skeleton-text skeleton-text-lg" style="width: 50%; margin-bottom: 1.5rem;"></div>
      
      <!-- Toggle Settings -->
      <div v-for="n in 5" :key="`setting-${n}`" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
        <div style="flex: 1; margin-right: 1rem;">
          <div class="skeleton skeleton-text" style="width: 70%; margin-bottom: 0.25rem;"></div>
          <div class="skeleton skeleton-text skeleton-text-sm" style="width: 90%;"></div>
        </div>
        <div class="skeleton skeleton-toggle"></div>
      </div>

      <div class="skeleton skeleton-button" style="width: 120px; margin-top: 1rem;"></div>
    </div>

    <!-- Preferences Section -->
    <div class="skeleton-config-section">
      <div class="skeleton skeleton-text skeleton-text-lg" style="width: 55%; margin-bottom: 1.5rem;"></div>
      
      <!-- Select Options -->
      <div class="skeleton-form-field" v-for="n in 3" :key="`pref-${n}`">
        <div class="skeleton skeleton-text skeleton-text-sm"></div>
        <div class="skeleton skeleton-input"></div>
      </div>

      <!-- Range Slider -->
      <div class="skeleton-form-field">
        <div class="skeleton skeleton-text skeleton-text-sm"></div>
        <div class="skeleton skeleton-input" style="height: 6px; border-radius: 3px;"></div>
      </div>

      <div class="skeleton skeleton-button" style="width: 110px; margin-top: 1rem;"></div>
    </div>
  </div>
</template>

<script setup>
// No se necesita lógica adicional para este skeleton
</script>