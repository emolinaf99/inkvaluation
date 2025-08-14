<template>
  <div class="skeleton-landing">
    <!-- Hero Section Skeleton -->
    <div class="skeleton-hero">
      <div class="skeleton skeleton-text"></div>
      <div class="skeleton skeleton-text"></div>
      <div class="skeleton skeleton-button"></div>
    </div>

    <!-- Benefits Section Skeleton -->
    <div class="skeleton-benefits">
      <div class="skeleton-benefit-card skeleton-card" v-for="n in 3" :key="`benefit-${n}`">
        <div class="skeleton skeleton-avatar"></div>
        <div class="skeleton skeleton-text skeleton-text-lg"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text" style="width: 80%;"></div>
      </div>
    </div>

    <!-- Steps Section Skeleton -->
    <div class="skeleton-steps">
      <div class="skeleton-step" v-for="n in 3" :key="`step-${n}`">
        <div class="skeleton skeleton-step-number"></div>
        <div class="skeleton-step-content">
          <div class="skeleton skeleton-text skeleton-text-lg" style="width: 70%; margin-bottom: 0.5rem;"></div>
          <div class="skeleton skeleton-text" style="width: 90%;"></div>
          <div class="skeleton skeleton-text" style="width: 60%;"></div>
        </div>
      </div>
    </div>

    <!-- Video Section Skeleton -->
    <div class="skeleton-card" style="margin-top: 2rem; text-align: center;">
      <div class="skeleton skeleton-text skeleton-text-lg" style="width: 50%; margin: 0 auto 1rem;"></div>
      <div class="skeleton skeleton-image" style="width: 100%; height: 250px; margin: 0 auto;"></div>
    </div>
  </div>
</template>

<script setup>
// No se necesita lógica adicional para este skeleton
</script>