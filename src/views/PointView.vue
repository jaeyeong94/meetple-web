<script setup lang="ts">
import MyPoint from '@/components/MyPoint.vue'
import Gap from '@/components/Gap.vue'
import StickyArea from '@/components/StickyArea.vue'
import SubHeader from '@/components/SubHeader.vue'
import PointItems from '@/components/PointItems.vue'
</script>

<template>
  <StickyArea position="top" :style="{ backgroundColor: '#fff'}">
    <SubHeader title="포인트 충전" :show-back-button="true" @back="() => {}" />
  </StickyArea>
  <div class="page">
    <MyPoint :point="631" />
    <Gap :height="20" />
    <PointItems @click="(id: number) => {}" />
  </div>
</template>

<style scoped>
.page {
  padding: 16px;
}
</style>
