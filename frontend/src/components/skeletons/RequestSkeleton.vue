<template>
  <section class="sectionSolicitudes">
    <!-- Título principal -->
    <div class="skeleton skeleton-text skeleton-text-lg" style="width: 280px; margin-top: 18px;"></div>
    
    <div class="contenedorGeneralSolicitudes">
      <div class="introBlock">
        
        <!-- Barra de búsqueda -->
        <div class="searchCont">
          <div class="skeleton skeleton-input" style="height: 40px; width: 100%;"></div>
          <div class="skeleton skeleton-button" style="width: 100%; height: 2rem"></div>
        </div>

        <!-- Lista de solicitudes -->
        <div class="contenedorSolicitudes">
          
          <!-- Solicitud 1 -->
          <div class="bloqueSolicitud">
            <!-- Preview de solicitud -->
            <div class="previewRequest">
              <div class="skeleton skeleton-avatar" style="width: 60px; height: 60px; border-radius: 8px;"></div>
              <div class="prevMiddle">
                <div class="skeleton skeleton-text skeleton-text-sm" style="width: 80px; margin-bottom: 0.25rem;"></div>
                <div class="skeleton skeleton-text skeleton-text-md" style="width: 120px; margin-bottom: 0.5rem;"></div>
                <div class="skeleton skeleton-button" style="width: 90px; height: 28px; border-radius: 14px;"></div>
              </div>
              <div class="skeleton skeleton-icon" style="width: 20px; height: 20px;"></div>
            </div>

            <!-- Detalle de solicitud (expandible) -->
            <div class="contDetailRequest hiddenForm">
              <div class="detailRequest">
                
                <!-- Sección de descripción, info e imágenes -->
                <section class="sectionDescInfoImages">
                  <div class="sectionInfoAndImages">
                    
                    <!-- Contenedor de imágenes -->
                    <div class="contenedorImagenes">
                      <div class="imagenesSolicitud">
                        <!-- Galería de imágenes -->
                        <div class="vitrinaSlide">
                          <div class="skeleton skeleton-image" style="width: 150px; height: 150px; border-radius: 8px; margin-right: 0.5rem;"></div>
                          <div class="skeleton skeleton-image" style="width: 150px; height: 150px; border-radius: 8px;"></div>
                        </div>
                        <!-- Botones de scroll -->
                        <div class="botonesSlide">
                          <div class="skeleton skeleton-icon" style="width: 24px; height: 24px; border-radius: 50%;"></div>
                          <div class="skeleton skeleton-icon" style="width: 24px; height: 24px; border-radius: 50%;"></div>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Descripción (desktop) -->
                    <div class="descripcionRequest desMovile">
                      <div class="skeleton skeleton-text skeleton-text-sm" style="width: 100px; margin-bottom: 0.5rem;"></div>
                      <div class="skeleton skeleton-text" style="width: 100%; margin-bottom: 0.25rem;"></div>
                      <div class="skeleton skeleton-text" style="width: 80%;"></div>
                    </div>
                    
                    <!-- Info de contacto -->
                    <div class="sectionInfo">
                      <!-- Primera fila de info -->
                      <div class="infoContactRequest">
                        <div class="itemContactRequest" v-for="n in 2" :key="`contact1-${n}`">
                          <div class="skeleton skeleton-icon" style="width: 16px; height: 16px;"></div>
                          <div class="skeleton skeleton-text skeleton-text-sm" style="width: 120px;"></div>
                        </div>
                      </div>
                      
                      <!-- Segunda fila de info -->
                      <div class="infoContactRequest">
                        <div class="itemContactRequest" v-for="n in 7" :key="`contact2-${n}`">
                          <div class="skeleton skeleton-icon" style="width: 16px; height: 16px;"></div>
                          <div v-if="n === 5" class="contSkinColors">
                            <div class="skeleton itemColor" v-for="i in 5" :key="`color-${i}`" style="width: 20px; height: 20px; border-radius: 50%;"></div>
                          </div>
                          <div v-else class="skeleton skeleton-text skeleton-text-sm" style="width: 100px;"></div>
                        </div>
                      </div>
                    </div>
                    
                  </div>
                  
                  <!-- Descripción (mobile) -->
                  <div class="descripcionRequest desDesktop">
                    <div class="skeleton skeleton-text skeleton-text-sm" style="width: 100px; margin-bottom: 0.5rem;"></div>
                    <div class="skeleton skeleton-text" style="width: 100%; margin-bottom: 0.25rem;"></div>
                    <div class="skeleton skeleton-text" style="width: 80%;"></div>
                  </div>
                </section>
                
                <!-- Sección de cotización -->
                <div class="infoCotization">
                  <!-- Enviar cotización -->
                  <div class="contGeneralCotizacion">
                    <div class="skeleton skeleton-text skeleton-text-md" style="width: 140px; margin-bottom: 0.5rem;"></div>
                    <div class="skeleton skeleton-text skeleton-text-sm" style="width: 100%; margin-bottom: 1rem;"></div>
                    <div class="inputAndBtnPrice">
                      <div class="skeleton skeleton-input" style="flex: 1; margin-right: 0.5rem;"></div>
                      <div class="skeleton skeleton-select" style="width: 80px;"></div>
                    </div>
                  </div>
                  
                  <!-- Comentarios adicionales -->
                  <div class="contGeneralCotizacion">
                    <div class="skeleton skeleton-text skeleton-text-md" style="width: 180px; margin-bottom: 0.5rem;"></div>
                    <div class="skeleton skeleton-textarea" style="height: 60px;"></div>
                  </div>
                  
                  <!-- Botones de envío -->
                  <div class="contGeneralCotizacion">
                    <div class="skeleton skeleton-button" style="width: 250px; height: 45px; margin-bottom: 0.5rem;"></div>
                    <div class="skeleton skeleton-button" style="width: 220px; height: 45px;"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Solicitud 2 -->
          <div class="bloqueSolicitud">
            <!-- Preview de solicitud -->
            <div class="previewRequest">
              <div class="skeleton skeleton-avatar" style="width: 60px; height: 60px; border-radius: 8px;"></div>
              <div class="prevMiddle">
                <div class="skeleton skeleton-text skeleton-text-sm" style="width: 80px; margin-bottom: 0.25rem;"></div>
                <div class="skeleton skeleton-text skeleton-text-md" style="width: 100px; margin-bottom: 0.5rem;"></div>
                <div class="skeleton skeleton-button" style="width: 100px; height: 28px; border-radius: 14px;"></div>
              </div>
              <div class="skeleton skeleton-icon" style="width: 20px; height: 20px;"></div>
            </div>
          </div>
          
        </div>
      </div>
      
      <!-- Paginación -->
      <div class="contenedorPaginacion">
        <div class="paginacionBlock">
          <!-- Flecha anterior -->
          <div class="flechaAnterior" style="display: flex; align-items: center; gap: 0.5rem;">
            <div class="skeleton skeleton-icon" style="width: 16px; height: 16px;"></div>
            <div class="skeleton skeleton-text skeleton-text-sm" style="width: 60px;"></div>
            <div class="skeleton skeleton-text skeleton-text-sm" style="width: 10px;"></div>
          </div>
          
          <!-- Números de página -->
          <div class="skeleton skeleton-button" style="width: 30px; height: 30px; border-radius: 4px; margin: 0 0.25rem;"></div>
          <div class="skeleton skeleton-text skeleton-text-sm" style="width: 20px; margin: 0 0.25rem;"></div>
          <div class="skeleton skeleton-button" style="width: 30px; height: 30px; border-radius: 4px; margin: 0 0.25rem;"></div>
          <div class="skeleton skeleton-text skeleton-text-sm" style="width: 20px; margin: 0 0.25rem;"></div>
          <div class="skeleton skeleton-button" style="width: 30px; height: 30px; border-radius: 4px; margin: 0 0.25rem;"></div>
          
          <!-- Flecha siguiente -->
          <div class="flechaSiguiente" style="display: flex; align-items: center; gap: 0.5rem;">
            <div class="skeleton skeleton-text skeleton-text-sm" style="width: 10px;"></div>
            <div class="skeleton skeleton-text skeleton-text-sm" style="width: 70px;"></div>
            <div class="skeleton skeleton-icon" style="width: 16px; height: 16px;"></div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
// No se necesita lógica adicional para este skeleton
</script>