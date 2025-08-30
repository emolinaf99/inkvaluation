<template>
  <section class="sectionLoginAndRegister">
    <!-- Form Section - usando mismas clases que el real -->
    <div class="contenedorForm" id="contenedorFormRegister">
      <!-- Logo Skeleton -->
      <div class="contenedorLogoForm">
        <div class="skeleton" style="width: 150px; height: 40px; border-radius: 4px;"></div>
      </div>
      
      <!-- Title Skeleton -->
      <div class="skeleton skeleton-text skeleton-text-lg" style="width: 150px; height: 32px; margin-bottom: 1rem;"></div>
      
      <!-- Already have account link -->
      <div class="alreadyEx">
        <div class="skeleton skeleton-text skeleton-text-sm" style="width: 200px; height: 20px;"></div>
      </div>
      
      <!-- Form Fields Skeleton -->
      <form class="generalForm">
        <div class="blockForm" v-for="n in 8" :key="`field-${n}`">
          <div class="skeleton skeleton-text skeleton-text-sm" style="width: 80px; height: 16px; margin-bottom: 0.3rem;"></div>
          <div class="blockInput">
            <span class="blockIcon">
              <div class="skeleton" style="width: 16px; height: 16px; border-radius: 50%;"></div>
            </span>
            <div class="skeleton skeleton-input" style="width: 100%; height: 2.5rem; border-radius: 0 10px 10px 0;"></div>
          </div>
        </div>
        
        <!-- Submit Button Skeleton -->
        <div class="skeleton" style="width: 100%; height: 2.5rem; margin-top: 1rem; border-radius: 10px;"></div>
      </form>
    </div>

    <!-- Image Section Skeleton (Desktop) -->
    <div class="contenedorImagenRegister" id="contenedorImgRegister">
      <div class="alreadyExist" id="alreadyExistRegister">
        <div class="skeleton skeleton-text skeleton-text-sm" style="width: 120px; height: 18px;"></div>
        <div class="skeleton" style="width: 80px; height: 36px; border-radius: 20px;"></div>
      </div>
      <div class="contenedorTextoDinamico">
        <!-- Skeleton del texto dinámico eliminado -->
      </div>
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