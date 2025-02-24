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
  <h2 class="title" v-html="props.title"></h2>
  <p class="description" v-html="props.description"></p>
</template>

<style scoped>
.title {
  white-space: pre-line;
  font-size: 28px;
  font-weight: 700;
  color: #000;
  line-height: 38px;
}
.description {
  white-space: pre-line;
  margin-top: 10px;
  font-size: 14px;
  font-weight: 500;
  color: #7F7F7F;
  line-height: 20px;
}
</style>
