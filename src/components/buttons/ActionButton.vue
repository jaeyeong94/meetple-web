<script setup lang="ts">
const props = defineProps({
  title: String,
})
</script>

<template>
  <button class="btn-action">{{props.title}}</button>
</template>

<style scoped>
.btn-action {
  font-size: 15px;
  font-weight: 600;
  color: #6726FE;
}
</style>
