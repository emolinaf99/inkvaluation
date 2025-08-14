<template>
  <div class="skeleton-forms">
    <!-- Header Section -->
    <div class="skeleton-forms-header">
      <div class="skeleton skeleton-text skeleton-text-lg" style="width: 35%; margin-bottom: 0.5rem;"></div>
      <div class="skeleton skeleton-text" style="width: 55%; margin-bottom: 2rem;"></div>
    </div>

    <!-- Contact Form -->
    <div class="skeleton-card" style="max-width: 600px; margin: 0 auto 2rem;">
      <div class="skeleton skeleton-text skeleton-text-lg" style="width: 40%; margin-bottom: 1.5rem;"></div>
      
      <div class="skeleton-form-grid">
        <div class="skeleton-form-field">
          <div class="skeleton skeleton-text skeleton-text-sm"></div>
          <div class="skeleton skeleton-input"></div>
        </div>
        
        <div class="skeleton-form-field">
          <div class="skeleton skeleton-text skeleton-text-sm"></div>
          <div class="skeleton skeleton-input"></div>
        </div>
        
        <div class="skeleton-form-field" style="grid-column: 1 / -1;">
          <div class="skeleton skeleton-text skeleton-text-sm"></div>
          <div class="skeleton skeleton-input"></div>
        </div>
        
        <div class="skeleton-form-field" style="grid-column: 1 / -1;">
          <div class="skeleton skeleton-text skeleton-text-sm"></div>
          <div class="skeleton skeleton-input" style="height: 100px;"></div>
        </div>
      </div>
      
      <div class="skeleton skeleton-button" style="width: 120px; margin-top: 1rem;"></div>
    </div>

    <!-- Contact Information -->
    <div style="display: grid; grid-template-columns: 1fr; gap: 1.5rem; max-width: 800px; margin: 0 auto;">
      <div class="skeleton-card" v-for="n in 3" :key="`contact-${n}`" style="text-align: center;">
        <div class="skeleton skeleton-avatar" style="margin: 0 auto 1rem;"></div>
        <div class="skeleton skeleton-text skeleton-text-lg" style="width: 60%; margin: 0 auto 0.5rem;"></div>
        <div class="skeleton skeleton-text" style="width: 80%; margin: 0 auto;"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
// No se necesita lógica adicional para este skeleton
</script>

<style scoped>
@media screen and (min-width: 768px) {
  .skeleton-card:last-child {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>