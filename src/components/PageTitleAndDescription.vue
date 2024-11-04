<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <h2 class="title">{{props.title}}</h2>
  <p class="description">{{props.description}}</p>
</template>

<style scoped>
.title {
  font-size: 28px;
  font-weight: 700;
  color: #000;
}
.description {
  margin-top: 10px;
  font-size: 14px;
  font-weight: 500;
  color: #7F7F7F;
}
</style>
