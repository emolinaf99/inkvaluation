<template>
  <section class="sectionLoginAndRegister">
    <!-- Image Section Skeleton (Desktop) -->
    <div class="contenedorImagenRegister" id="contenedorImgRegister">
      <div class="skeleton skeleton-text skeleton-text-lg" style="width: 70%; margin-bottom: 1rem; color: white;"></div>
    </div>

    <!-- Form Section -->
    <div class="skeleton-form" id="contenedorFormRegister">
      <!-- Logo Skeleton -->
      <div class="skeleton-form-header">
        <div class="skeleton skeleton-avatar"></div>
      </div>
      
      <!-- Welcome Text Skeleton -->
      <div class="skeleton skeleton-text skeleton-text-lg" style="width: 60%; margin: 0 auto 0.5rem;"></div>
      <div class="skeleton skeleton-text" style="width: 80%; margin: 0 auto 1rem;"></div>
      <div class="skeleton skeleton-text skeleton-text-sm" style="width: 70%; margin: 0 auto 1.5rem;"></div>
      
      <!-- Form Fields Skeleton -->
      <div style="display: grid; grid-template-columns: 1fr; gap: 1rem;">
        <div class="skeleton-form-field" v-for="n in 6" :key="`register-${n}`">
          <div class="skeleton skeleton-text skeleton-text-sm"></div>
          <div class="skeleton skeleton-input"></div>
        </div>
        
        <!-- Terms Checkbox -->
        <div style="display: flex; align-items: center; gap: 0.5rem; margin: 1rem 0;">
          <div class="skeleton" style="width: 18px; height: 18px; border-radius: 3px;"></div>
          <div class="skeleton skeleton-text skeleton-text-sm" style="width: 70%;"></div>
        </div>
      </div>
      
      <!-- Submit Button Skeleton -->
      <div class="skeleton skeleton-button" style="margin-top: 1rem;"></div>
      
      <!-- Login Link Skeleton -->
      <div class="skeleton skeleton-text skeleton-text-sm" style="width: 50%; margin: 1rem auto 0;"></div>
    </div>
  </section>
</template>

<script setup>
// No se necesita lógica adicional para este skeleton
</script>

<style scoped>
@media screen and (min-width: 1280px) {
  .skeleton-form {
    max-width: none;
  }
  
  .skeleton-form-field {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
}
</style>