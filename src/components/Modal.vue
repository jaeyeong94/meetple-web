<script setup lang="ts">
</script>

<template>
  <div class="modal">
    <slot />
  </div>
</template>

<style scoped>
.modal {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24px;
  background-color: #fff;
  border-radius: 20px 20px 0 0;
  pointer-events: auto;
}
</style>
