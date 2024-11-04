<script setup lang="ts">
const props = defineProps({
  height: Number,
})
</script>

<template>
  <div class="divider" :style="{height: `${props.height || 1}px`}" />
</template>

<style scoped>
.divider {
  width: 100%;
  background-color: #F3F3F3;
}
</style>
