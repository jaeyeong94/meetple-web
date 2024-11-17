<script setup lang="ts">
import { formatNumber } from '@/lib/utils'

const props = defineProps({
  point: {
    type: Number,
    required: true,
  },
})
</script>

<template>
  <div class="my-point">
    <span class="title">나의 캔디</span>
    <div class="line" />
    <span class="point">{{formatNumber(props.point)}}</span>
  </div>
</template>

<style scoped>
.my-point {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  padding: 18px;
  background-color: #F7F7F7;
  border-radius: 16px;
}
.title {
  font-size: 13px;
  font-weight: 600;
  color: #898989;
}
.line {
  flex: 1;
  border-bottom: 1px dashed #C3C3C3;
}
.point {
  font-size: 19px;
  font-weight: 700;
  color: #000;
}
</style>
