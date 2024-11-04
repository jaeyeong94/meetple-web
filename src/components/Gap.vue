<script setup lang="ts">
const props = defineProps({
  width: Number,
  height: Number,
})
</script>

<template>
  <div class="gap" :style="{
    width: props.height ? '100%' : `${props.width}px`,
    height: props.width ? '100%' : `${props.height}px`,
  }" />
</template>

<style scoped>
.gap {}
</style>
