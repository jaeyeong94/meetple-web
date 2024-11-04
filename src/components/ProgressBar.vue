<script setup lang="ts">
const props = defineProps({
  progress: {
    type: Number,
    required: true,
  },
  processing: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div class="container">
    <div class="processing" v-if="props.processing" />
    <div class="progress" :style="{width: `${props.progress}%`}" v-else />
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  height: 3px;
  background-color: #F7F7F7;
  overflow: hidden;
}
.progress {
  height: 100%;
  background: linear-gradient(to right, #6726FE, #F742AF);
}
.processing {
  position: relative;
  width: 142px;
  height: 100%;
  background: linear-gradient(to right, #F7F7F7 0%, #9953F1 50%, #9D31E0 100%);
  animation: processing 1.5s infinite;
}
@keyframes processing {
  0% {
    left: 0;
    transform: translateX(-100%);
  }
  100% {
    left: 100%;
    transform: translateX(0%);
  }
}
</style>
