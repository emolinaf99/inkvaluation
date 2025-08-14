<script setup>
  import {reactive, ref, onMounted} from 'vue'
  import { RouterLink, RouterView } from 'vue-router'
  
  import DescripcionYVideo from '../components/DescripcionYVideo.vue'
  import SeccionBeneficios from '../components/SeccionBeneficios.vue'
  import PasoAPaso from '../components/PasoAPaso.vue'
  import Clients from '../components/Clientes.vue'
  import LandingPageSkeleton from '../components/skeletons/LandingPageSkeleton.vue'
  import { useSkeletonDev } from '../js/useSkeletonDev.js'

  const { isLoading, isFading } = useSkeletonDev('landing', 2000)

</script>

<template>
  <!-- Skeleton Loader -->
  <div v-if="isLoading" class="skeleton-container" :class="{ 'skeleton-fade-out': isFading }">
    <LandingPageSkeleton />
  </div>

  <!-- Contenido Real -->
  <div v-else>
    <DescripcionYVideo/>
    <SeccionBeneficios/>
    <PasoAPaso/>
    <!-- <Clients/> -->
  </div>
</template>


