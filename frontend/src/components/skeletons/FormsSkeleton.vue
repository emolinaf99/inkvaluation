<template>
  <div class="skeleton-forms">
    <!-- Header Section -->
    <div class="skeleton-forms-header">
      <div class="skeleton skeleton-text skeleton-text-lg" style="width: 40%; margin-bottom: 0.5rem;"></div>
      <div class="skeleton skeleton-text" style="width: 60%; margin-bottom: 2rem;"></div>
    </div>

    <!-- Add New Form Button -->
    <div style="text-align: center; margin-bottom: 2rem;">
      <div class="skeleton skeleton-button" style="width: 200px; margin: 0 auto;"></div>
    </div>

    <!-- Services Grid -->
    <div class="skeleton-forms-grid">
      <div class="skeleton-form-item" v-for="n in 6" :key="`form-${n}`">
        <div class="skeleton-form-item-content">
          <div class="skeleton skeleton-text skeleton-text-lg" style="width: 70%; margin-bottom: 0.5rem;"></div>
          <div class="skeleton skeleton-text skeleton-text-sm" style="width: 50%; margin-bottom: 0.25rem;"></div>
          <div class="skeleton skeleton-text skeleton-text-sm" style="width: 30%;"></div>
        </div>
        <div class="skeleton-form-item-actions">
          <div class="skeleton"></div>
          <div class="skeleton"></div>
          <div class="skeleton"></div>
        </div>
      </div>
    </div>

    <!-- No Forms Message Skeleton (alternative state) -->
    <div v-if="showEmpty" class="skeleton-card" style="text-align: center; padding: 3rem;">
      <div class="skeleton skeleton-avatar skeleton-avatar-lg" style="margin: 0 auto 1rem;"></div>
      <div class="skeleton skeleton-text skeleton-text-lg" style="width: 50%; margin: 0 auto 0.5rem;"></div>
      <div class="skeleton skeleton-text" style="width: 70%; margin: 0 auto 1rem;"></div>
      <div class="skeleton skeleton-button" style="width: 180px; margin: 0 auto;"></div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  showEmpty: {
    type: Boolean,
    default: false
  }
})
</script>