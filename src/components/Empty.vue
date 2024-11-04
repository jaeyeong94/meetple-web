<script setup lang="ts">
import IcHeart from '@/components/icons/IcGrayHeart.vue'

const props = defineProps({
  title: String,
  description: String,
})
</script>

<template>
  <div class="empty">
    <IcHeart />
    <span class="title">{{props.title}}</span>
    <p class="description">{{props.description}}</p>
  </div>
</template>

<style scoped>
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px;
}
.title {
  margin-top: 16px;
  font-size: 24px;
  font-weight: 700;
  color: #000;
}
.description {
  margin-top: 6px;
  font-size: 15px;
  font-weight: 500;
  color: #7F7F7F;
}
</style>
