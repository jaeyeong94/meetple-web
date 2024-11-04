<script setup lang="ts">
</script>

<template>
  <button class="button">
    <slot />
  </button>
</template>

<style scoped>
.button {
  display: inline-flex;
  align-items: center;
  padding: 0 10px;
  height: 32px;
  font-size: 14px;
  font-weight: 600;
  background-color: #fff;
  border: 1px solid #EAEAEA;
  border-radius: 16px;
  color: #000;
}
</style>
