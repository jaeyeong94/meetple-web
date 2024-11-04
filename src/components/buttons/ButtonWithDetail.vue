<script setup lang="ts">
import IcGrayArrow from '@/components/icons/IcGrayArrow.vue'

const props = defineProps({
  title: String,
  titleColor: String,
  description: String

})
</script>


<template>
  <button class="btn-with-detail">
    <div class="container">
      <span class="title" :style="{color: props.titleColor}">{{props.title}}</span>
      <p class="description">{{props.description}}</p>
    </div>
    <IcGrayArrow />
  </button>
</template>


<style scoped>
.btn-with-detail {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  width: 100%;
}
.container {
  display: flex;
  flex-direction: column;
  align-items: start;
  flex: 1;
  gap: 4px;
}
.title {
  font-size: 19px;
  font-weight: 700;
  color: #000;
}
.description {
  font-size: 13px;
  font-weight: 500;
  color: #8E8E8E;
}
</style>
