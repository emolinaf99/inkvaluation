<template>
  <section class="sectionAccount">
    <!-- Título principal -->
    <div class="skeleton skeleton-text skeleton-text-lg" style="width: 200px; margin-bottom: 2rem;"></div>
    
    <div class="containerAccount">
      <!-- Primera columna -->
      <div class="blocksContainer">
        
        <!-- Bloque Datos Personales -->
        <form class="accountBlock">
          <!-- Título -->
          <div class="skeleton skeleton-text skeleton-text-md" style="width: 150px; margin-bottom: 1.5rem;"></div>
          
          <!-- Imagen de perfil y botones -->
          <div class="rowSpaceBetween">
            <div class="skeleton skeleton-avatar" style="width: 80px; height: 80px; border-radius: 8px;"></div>
            <div class="btnsImgPerfil">
              <div class="skeleton skeleton-button" style="width: 10rem; height: 36px; margin-bottom: 0.5rem;"></div>
              <div class="skeleton skeleton-button" style="width: 10rem; height: 36px;"></div>
            </div>
          </div>
          
          <!-- Campos del formulario -->
          <div class="divInput" v-for="n in 5" :key="`field-${n}`">
            <div class="skeleton skeleton-text skeleton-text-sm" style="width: 120px; margin-bottom: 0.5rem;"></div>
            <div class="inputIcon">
              <div class="skeleton skeleton-icon"></div>
              <div class="skeleton skeleton-input"></div>
            </div>
          </div>
          
          <!-- Botón actualizar -->
          <div class="skeleton skeleton-button" style="width: 100%; height: 40px; margin-top: 1rem;"></div>
        </form>
        
        <!-- Bloque Servicios -->
        <div class="accountBlock">
          <!-- Título -->
          <div class="skeleton skeleton-text skeleton-text-md" style="width: 100px; margin-bottom: 1.5rem;"></div>
          
          <div class="contOpts">
            <!-- Lista de servicios -->
            <div class="btnDescInfo" v-for="n in 4" :key="`service-${n}`">
              <div class="btnYDesc">
                <div class="skeleton skeleton-toggle"></div>
                <div class="skeleton skeleton-text" style="width: 150px;"></div>
              </div>
            </div>
            
            <!-- Botón guardar -->
            <div class="skeleton skeleton-button" style="width: 100%; height: 40px; margin-top: 1rem;"></div>
          </div>
        </div>
        
      </div>

      <!-- Segunda columna -->
      <div class="blocksContainer">
        
        <!-- Bloque Suscripción -->
        <div class="accountBlock">
          <!-- Título -->
          <div class="skeleton skeleton-text skeleton-text-md" style="width: 180px; margin-bottom: 1.5rem;"></div>
          
          <!-- Campos de suscripción -->
          <div class="divInput" v-for="n in 2" :key="`sub-${n}`">
            <div class="skeleton skeleton-text skeleton-text-sm" style="width: 100px; margin-bottom: 0.5rem;"></div>
            <div class="inputIcon">
              <div class="skeleton skeleton-icon"></div>
              <div class="skeleton skeleton-input"></div>
            </div>
          </div>
          
          <!-- Toggle renovación automática -->
          <div class="btnDescInfo">
            <div class="btnYDesc">
              <div class="skeleton skeleton-text" style="width: 160px;"></div>
              <div class="skeleton skeleton-toggle"></div>
            </div>
          </div>
          
          <!-- Botón actualizar suscripción -->
          <div class="skeleton skeleton-button" style="width: 100%; height: 40px; margin-top: 1rem;"></div>
        </div>

        <!-- Bloque Cambiar Contraseña -->
        <div class="accountBlock">
          <!-- Título -->
          <div class="skeleton skeleton-text skeleton-text-md" style="width: 160px; margin-bottom: 1.5rem;"></div>
          
          <!-- Campos de contraseña -->
          <div class="divInput" v-for="n in 3" :key="`pass-${n}`">
            <div class="skeleton skeleton-text skeleton-text-sm" style="width: 140px; margin-bottom: 0.5rem;"></div>
            <div class="inputIcon">
              <div class="skeleton skeleton-icon"></div>
              <div class="skeleton skeleton-input"></div>
            </div>
          </div>
          
          <!-- Botón cambiar contraseña -->
          <div class="skeleton skeleton-button" style="width: 100%; height: 40px; margin-top: 1rem;"></div>
        </div>
        
      </div>
    </div>
  </section>
</template>

<script setup>
// No se necesita lógica adicional para este skeleton
</script>