<script setup lang="ts">
import IcNotification from '@/components/icons/IcNotification.vue'

const props = defineProps({
  showIndicator: Boolean,
})
</script>


<template>
  <button class="btn-notification">
    <div class="indicator" v-if="props.showIndicator" />
    <IcNotification />
  </button>
</template>


<style scoped>
.btn-notification {
  position: relative;
  width: 28px;
  height: 28px;
  background: none;
  border: none;
}
.indicator {
  position: absolute;
  top: 0;
  right: 2px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: #2873FF;
  border: 2px solid #fff;
}
</style>
