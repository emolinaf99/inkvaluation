<template>
  <section class="sectionAccount">
    <!-- Título principal -->
    <div class="skeleton skeleton-text skeleton-text-lg" style="width: 150px; margin-bottom: 2rem;"></div>
    
    <div class="containerAccount">
      <!-- Primera columna -->
      <div class="blocksContainer">
        
        <!-- Bloque Datos del negocio -->
        <div class="accountBlock">
          <!-- Título -->
          <div class="skeleton skeleton-text skeleton-text-md" style="width: 160px; margin-bottom: 1.5rem;"></div>
          
          <!-- Imagen de perfil y botones -->
          <div class="rowSpaceBetween">
            <div class="skeleton skeleton-avatar" style="width: 80px; height: 80px; border-radius: 8px;"></div>
            <div class="btnsImgPerfil">
              <div class="skeleton skeleton-button" style="width: 10rem; height: 36px; margin-bottom: 0.5rem;"></div>
              <div class="skeleton skeleton-button" style="width: 10rem; height: 36px;"></div>
            </div>
          </div>
          
          <!-- Campo descripción (textarea) -->
          <div class="divInput">
            <div class="skeleton skeleton-text skeleton-text-sm" style="width: 100px; margin-bottom: 0.5rem;"></div>
            <div class="skeleton skeleton-textarea"></div>
          </div>
          
          <!-- Campos nombre del negocio y dominio -->
          <div class="divInput" v-for="n in 2" :key="`business-${n}`">
            <div class="skeleton skeleton-text skeleton-text-sm" style="width: 140px; margin-bottom: 0.5rem;"></div>
            <div class="inputIcon">
              <div class="skeleton skeleton-icon"></div>
              <div class="skeleton skeleton-input"></div>
            </div>
          </div>
          
          <!-- Botón actualizar -->
          <div class="skeleton skeleton-button" style="width: 100%; height: 40px; margin-top: 1rem;"></div>
        </div>
        
        <!-- Bloque Sedes del Negocio -->
        <div class="accountBlock">
          <!-- Título -->
          <div class="skeleton skeleton-text skeleton-text-md" style="width: 180px; margin-bottom: 1.5rem;"></div>
          
          <!-- Inputs para agregar sede -->
          <div class="rowContain">
            <div class="inputsContain">
              <div class="divInput" v-for="n in 2" :key="`sede-${n}`">
                <div class="skeleton skeleton-text skeleton-text-sm" style="width: 80px; margin-bottom: 0.5rem;"></div>
                <div class="inputIcon inpIconCity">
                  <div class="skeleton skeleton-select" v-if="n === 1"></div>
                  <div class="skeleton skeleton-input" v-else></div>
                </div>
              </div>
            </div>
            <div class="skeleton skeleton-icon" style="width: 24px; height: 24px; border-radius: 50%;"></div>
          </div>
          
          <!-- Lista de sedes -->
          <div class="sectionCities">
            <div class="itemCity" v-for="n in 2" :key="`city-${n}`">
              <div class="skeleton skeleton-icon" style="width: 16px; height: 16px;"></div>
              <div class="skeleton skeleton-text skeleton-text-sm" style="width: 80px;"></div>
              <span>|</span>
              <div class="skeleton skeleton-text skeleton-text-sm" style="width: 120px;"></div>
            </div>
          </div>
          
          <!-- Botón actualizar -->
          <div class="skeleton skeleton-button" style="width: 100%; height: 40px; margin-top: 1rem;"></div>
        </div>
         
      </div>

      <!-- Segunda columna -->
      <div class="blocksContainer">
        
        <!-- Bloque Artistas -->
        <div class="accountBlock">
          <!-- Título y descripción -->
          <div class="skeleton skeleton-text skeleton-text-md" style="width: 80px; margin-bottom: 0.5rem;"></div>
          <div class="skeleton skeleton-text skeleton-text-sm" style="width: 100%; margin-bottom: 1.5rem;"></div>
          
          <div class="contOpts">
            
            <!-- Inputs para agregar artista -->
            <div class="rowContain">
              <div class="inputsContain">
                <div class="divInput" v-for="n in 2" :key="`artist-${n}`">
                  <div class="skeleton skeleton-text skeleton-text-sm" style="width: 120px; margin-bottom: 0.5rem;"></div>
                  <div class="inputIcon inpIconCity">
                    <div class="skeleton skeleton-input" v-if="n === 1"></div>
                    <div class="skeleton skeleton-select" v-else></div>
                  </div>
                </div>
              </div>
              <div class="skeleton skeleton-icon" style="width: 24px; height: 24px; border-radius: 50%;"></div>
            </div>
        
            <!-- Lista de artistas -->
            <div class="sectionCities">
              <div class="itemArtist" v-for="n in 2" :key="`artist-item-${n}`">
                <div class="itemCity noBorderBottom">
                  <div class="skeleton skeleton-icon" style="width: 16px; height: 16px;"></div>
                  <div class="skeleton skeleton-text" style="width: 80px;"></div>
                  <span>|</span>
                  <div class="skeleton skeleton-text" style="width: 100px;"></div>
                </div>
                <div class="itemCity itemRedes noBorderBottom">
                  <div class="skeleton skeleton-avatar" style="width: 40px; height: 40px;"></div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
        
        <!-- Bloque Servicios -->
        <div class="accountBlock">
          <!-- Título y descripción -->
          <div class="skeleton skeleton-text skeleton-text-md" style="width: 100px; margin-bottom: 0.5rem;"></div>
          <div class="skeleton skeleton-text skeleton-text-sm" style="width: 100%; margin-bottom: 1rem;"></div>
          <div class="skeleton skeleton-text skeleton-text-sm" style="width: 150px; margin-bottom: 1.5rem;"></div>
          
          <div class="contOpts">
            <!-- Lista de servicios -->
            <div class="btnDescInfo" v-for="n in 4" :key="`service-${n}`">
              <div class="btnYDesc">
                <div class="skeleton skeleton-toggle"></div>
                <div class="skeleton skeleton-text" style="width: 140px;"></div>
              </div>
            </div>
            
            <!-- Botón guardar -->
            <div class="skeleton skeleton-button" style="width: 100%; height: 40px; margin-top: 1rem;"></div>
          </div>

        </div>
        
      </div>
    </div>
  </section>
</template>

<script setup>
// No se necesita lógica adicional para este skeleton
</script>