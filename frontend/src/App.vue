<script setup>
  import {reactive, ref, onMounted} from 'vue'
  import { RouterLink, RouterView, useRoute} from 'vue-router'
  import HeaderPartial from './components/Header.vue'
  import HeaderHome from './components/HeaderHome.vue'
  import FooterPartial from './components/Footer.vue'
  import SkeletonDevPanel from './components/SkeletonDevPanel.vue'

  const route = useRoute()
  
</script>

<template>
  
  <header :class="{ 'headerScroll': route.name != ('Login','Register','Home') }" v-if="!['Login','Register','AssistantChat'].includes(route.name)">
    
    <!-- Condicional para mostrar HeaderHome o HeaderPartial -->
    <component :is="['Home', 'Prices'].includes(route.name) ? HeaderPartial : HeaderHome" />
  </header>

  <main>
    <RouterView />
  </main>


  <footer class="" v-if="!['Login','Register','Request','Account','Mailbox','AssistantChat','AssistantConfiguration','AssistantBussiness','AccountBussiness','Forms','DetailForm','NewForm'].includes(route.name)">
    <FooterPartial
      
    />
  </footer>

  <!-- Panel de Desarrollo de Skeleton (solo en desarrollo) -->
  <SkeletonDevPanel />
</template>


