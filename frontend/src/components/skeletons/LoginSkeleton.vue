<template>
  <section class="sectionLoginAndRegister ux-container">
    <!-- Form Section - usando mismas clases que el real -->
    <div class="contenedorForm ux-card ux-stagger-1" id="contenedorFormLogin">
      <!-- Logo Skeleton -->
      <div class="contenedorLogoForm ux-fade-in" id="contLogoLogin">
        <div class="skeleton" style="width: 150px; height: 40px; border-radius: 4px;"></div>
      </div>
      
      <!-- Welcome Text Skeleton -->
      <div class="skeleton skeleton-text skeleton-text-lg" style="width: 280px; height: 32px; margin-bottom: 1rem;" id="h2Form"></div>
      <div class="skeleton skeleton-text" style="width: 320px; height: 20px; margin-bottom: 1rem;" id="pForm"></div>
      <div class="skeleton skeleton-text skeleton-text-sm" style="width: 280px; height: 18px; margin-bottom: 1.5rem;"></div>
      
      <!-- Form Fields Skeleton -->
      <form class="generalForm ux-content ux-stagger-5" id="generalFormLogin">
        <!-- Email Field -->
        <div class="blockForm ux-form-field ux-stagger-1">
          <div class="skeleton skeleton-text skeleton-text-sm" style="width: 60px; height: 16px; margin-bottom: 0.3rem;"></div>
          <div class="blockInput">
            <span class="blockIcon">
              <div class="skeleton" style="width: 16px; height: 16px; border-radius: 50%;"></div>
            </span>
            <div class="skeleton" style="width: 100%; height: 2.5rem; border-radius: 0 10px 10px 0;"></div>
          </div>
        </div>
        
        <!-- Password Field -->
        <div class="blockForm ux-form-field ux-stagger-2" style="margin-bottom: 1rem;">
          <div class="skeleton skeleton-text skeleton-text-sm" style="width: 90px; height: 16px; margin-bottom: 0.3rem;"></div>
          <div class="blockInput">
            <span class="blockIcon">
              <div class="skeleton" style="width: 16px; height: 16px; border-radius: 50%;"></div>
            </span>
            <div class="skeleton" style="width: 100%; height: 2.5rem; border-radius: 0 10px 10px 0; position: relative;"></div>
          </div>
        </div>
        
        <!-- Forgot Password Link -->
        <div class="skeleton skeleton-text skeleton-text-sm" style="width: 200px; height: 18px; margin: 1rem 0;"></div>
        
        <!-- Submit Button -->
        <div class="skeleton" style="width: 100%; height: 2.5rem; margin-top: 1rem; border-radius: 10px;"></div>
      </form>
    </div>

    <!-- Image Section Skeleton (Desktop) -->
    <div class="contenedorImagenRegister ux-slide-in-right ux-stagger-2" id="contenedorImgLogin">
      <div class="alreadyExist ux-content ux-stagger-6" id="alreadyExistLogin">
        <div class="skeleton skeleton-text skeleton-text-sm" style="width: 150px; height: 18px;"></div>
        <div class="skeleton" style="width: 100px; height: 36px; border-radius: 20px;"></div>
      </div>
    </div>
  </section>
</template>

<script setup>
// No se necesita lógica adicional para este skeleton
</script>