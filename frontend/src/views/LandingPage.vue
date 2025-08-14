<script setup>
  import {reactive, ref, onMounted} from 'vue'
  import { RouterLink, RouterView } from 'vue-router'
  
  import DescripcionYVideo from '../components/DescripcionYVideo.vue'
  import SeccionBeneficios from '../components/SeccionBeneficios.vue'
  import PasoAPaso from '../components/PasoAPaso.vue'
  import Clients from '../components/Clientes.vue'

</script>

<template>
  <div class="ux-container">
    <DescripcionYVideo class="ux-content ux-stagger-1"/>
    <SeccionBeneficios class="ux-content ux-stagger-2"/>
    <PasoAPaso class="ux-content ux-stagger-3"/>
    <!-- <Clients/> -->
  </div>
</template>


