<template>
  <section class="sectionGeneralConfAssistant">
    <!-- Título principal -->
    <div class="skeleton skeleton-text skeleton-text-lg" style="width: 300px; margin-bottom: 2rem;"></div>

    <div class="contenedorSecConfAssistant">
      
      <!-- Link y Preview Section -->
      <div class="linkAndPreview">
        <div class="skeleton skeleton-button btnPreview"></div>
        <div class="link">
          <div class="skeleton skeleton-text" style="width: 400px; margin-bottom: 0.5rem;"></div>
          <div class="skeleton skeleton-button btnPreview"></div>
        </div>
      </div>

      <!-- Mensaje Default Section -->
      <div class="msgDefault" style="background-color: white;">
        <div class="skeleton skeleton-text skeleton-text-md" style="width: 280px; margin-bottom: 0.5rem;"></div>
        <div class="skeleton skeleton-text" style="width: 200px; margin-bottom: 1rem;"></div>
        <ul class="listItemsDefault">
          <li v-for="n in 2" :key="`item-${n}`">
            <div class="skeleton skeleton-text skeleton-text-sm" style="width: 80px;"></div>
          </li>
        </ul>
      </div>

      <!-- Bloque Perfil -->
      <div class="accountBlock">
        <div class="skeleton skeleton-text skeleton-text-md" style="width: 80px; margin-bottom: 1.5rem;"></div>
        
        <!-- Campo nombre del asistente -->
        <div class="divInput">
          <div class="skeleton skeleton-text skeleton-text-sm" style="width: 160px; margin-bottom: 0.5rem;"></div>
          <div class="inputIcon">
            <div class="skeleton skeleton-input"></div>
          </div>
        </div>

        <!-- Campo mensaje de bienvenida -->
        <div class="divInput">
          <div class="skeleton skeleton-text skeleton-text-sm" style="width: 180px; margin-bottom: 0.5rem;"></div>
          <div class="inputIcon">
            <div class="skeleton skeleton-textarea"></div>
          </div>
        </div>

        <!-- Botón guardar -->
        <div class="skeleton skeleton-button" style="width: 100%; height: 40px; margin-top: 1rem;"></div>
      </div>

      <!-- Bloque Formularios de servicios -->
      <div class="accountBlock" style="padding-bottom: 0;">
        <!-- Título y descripción -->
        <div class="skeleton skeleton-text skeleton-text-md" style="width: 220px; margin-bottom: 0.5rem;"></div>
        <div class="skeleton skeleton-text skeleton-text-sm" style="width: 100%; margin-bottom: 1rem;"></div>

        <!-- Header de tabla -->
        <div class="questionAndType servicesForm titleServicesForm">
          <div class="serviceColumn">
            <div class="skeleton skeleton-text skeleton-text-sm" style="width: 80px;"></div>
          </div>
          <div class="serviceColumn">
            <div class="skeleton skeleton-text skeleton-text-sm" style="width: 100px;"></div>
          </div>
        </div>

        <!-- Filas de servicios -->
        <div v-for="n in 4" :key="`service-${n}`" class="questionAndType servicesForm">
          <div class="serviceColumn">
            <div class="skeleton skeleton-text" style="width: 120px;"></div>
          </div>
          <div class="serviceColumn">
            <div class="skeleton skeleton-select"></div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
// No se necesita lógica adicional para este skeleton
</script>