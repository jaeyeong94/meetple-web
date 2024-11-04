<script setup lang="ts">
</script>

<template>
  <button class="cancel-button">
    <slot />
  </button>
</template>

<style scoped>
.cancel-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  font-size: 17px;
  font-weight: 700;
  color: #000;
  background: none;
  border: none;
}
</style>
