<template>
  <div class="skeleton-chat">
    <!-- Chat Header -->
    <div class="skeleton-chat-header">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <div class="skeleton skeleton-avatar"></div>
        <div style="flex: 1;">
          <div class="skeleton skeleton-text" style="width: 40%; margin-bottom: 0.25rem;"></div>
          <div class="skeleton skeleton-text skeleton-text-sm" style="width: 25%;"></div>
        </div>
      </div>
    </div>

    <!-- Chat Messages -->
    <div class="skeleton-chat-messages">
      <!-- Assistant Message -->
      <div class="skeleton-message">
        <div class="skeleton skeleton-avatar skeleton-avatar-sm"></div>
        <div class="skeleton-message-content">
          <div class="skeleton skeleton-text" style="width: 90%; margin-bottom: 0.25rem;"></div>
          <div class="skeleton skeleton-text" style="width: 70%;"></div>
        </div>
      </div>

      <!-- User Message -->
      <div class="skeleton-message skeleton-message-user">
        <div class="skeleton skeleton-avatar skeleton-avatar-sm"></div>
        <div class="skeleton-message-content">
          <div class="skeleton skeleton-text" style="width: 60%;"></div>
        </div>
      </div>

      <!-- Assistant Message -->
      <div class="skeleton-message">
        <div class="skeleton skeleton-avatar skeleton-avatar-sm"></div>
        <div class="skeleton-message-content">
          <div class="skeleton skeleton-text" style="width: 95%; margin-bottom: 0.25rem;"></div>
          <div class="skeleton skeleton-text" style="width: 80%; margin-bottom: 0.25rem;"></div>
          <div class="skeleton skeleton-text" style="width: 50%;"></div>
        </div>
      </div>

      <!-- User Message -->
      <div class="skeleton-message skeleton-message-user">
        <div class="skeleton skeleton-avatar skeleton-avatar-sm"></div>
        <div class="skeleton-message-content">
          <div class="skeleton skeleton-text" style="width: 75%; margin-bottom: 0.25rem;"></div>
          <div class="skeleton skeleton-text" style="width: 45%;"></div>
        </div>
      </div>

      <!-- Loading dots for assistant typing -->
      <div class="skeleton-message">
        <div class="skeleton skeleton-avatar skeleton-avatar-sm"></div>
        <div class="skeleton-message-content" style="width: 60px;">
          <div style="display: flex; gap: 0.25rem; align-items: center;">
            <div class="skeleton" style="width: 8px; height: 8px; border-radius: 50%;"></div>
            <div class="skeleton" style="width: 8px; height: 8px; border-radius: 50%;"></div>
            <div class="skeleton" style="width: 8px; height: 8px; border-radius: 50%;"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Chat Input -->
    <div class="skeleton-chat-input">
      <div class="skeleton skeleton-input"></div>
      <div class="skeleton skeleton-button"></div>
    </div>
  </div>
</template>

<script setup>
// No se necesita lógica adicional para este skeleton
</script>