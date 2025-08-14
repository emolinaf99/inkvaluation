<template>
  <div class="skeleton-prices">
    <!-- Header Section -->
    <div class="skeleton-prices-header">
      <div class="skeleton skeleton-text skeleton-text-lg" style="width: 50%; margin: 0 auto 1rem;"></div>
      <div class="skeleton skeleton-text" style="width: 70%; margin: 0 auto 2rem;"></div>
    </div>

    <!-- Pricing Cards -->
    <div class="skeleton-pricing-grid">
      <div class="skeleton-pricing-card" v-for="n in 3" :key="`price-${n}`">
        <!-- Plan Name -->
        <div class="skeleton skeleton-text skeleton-text-lg"></div>
        
        <!-- Price -->
        <div class="skeleton skeleton-price"></div>
        
        <!-- Description -->
        <div class="skeleton skeleton-text skeleton-text-sm" style="width: 80%; margin: 0 auto 1.5rem;"></div>
        
        <!-- Features List -->
        <div class="skeleton-feature-list">
          <div class="skeleton-feature" v-for="i in 5" :key="`feature-${n}-${i}`">
            <div class="skeleton skeleton-feature-icon"></div>
            <div class="skeleton skeleton-text" style="width: 85%;"></div>
          </div>
        </div>
        
        <!-- CTA Button -->
        <div class="skeleton skeleton-button" style="width: 100%; margin-top: 1.5rem;"></div>
      </div>
    </div>

    <!-- FAQ Section -->
    <div style="margin-top: 4rem; max-width: 800px; margin-left: auto; margin-right: auto;">
      <div class="skeleton skeleton-text skeleton-text-lg" style="width: 30%; margin: 0 auto 2rem;"></div>
      
      <div v-for="n in 4" :key="`faq-${n}`" class="skeleton-card" style="margin-bottom: 1rem;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div class="skeleton skeleton-text" style="width: 75%;"></div>
          <div class="skeleton" style="width: 20px; height: 20px; border-radius: 50%;"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// No se necesita lógica adicional para este skeleton
</script>