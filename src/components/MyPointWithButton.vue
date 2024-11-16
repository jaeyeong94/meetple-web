<script setup lang="ts">
import SubmitButton from '@/components/SubmitButton.vue'
import { formatNumber } from '@/lib/utils'

const props = defineProps({
  point: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['charge'])
</script>

<template>
  <div class="my-point">
    <div class="container">
      <span class="title">나의 캔디</span>
      <span class="point">
        <img class="icon" src="@/assets/images/logo.png" alt="Point" />
        {{formatNumber(props.point)}}
      </span>
    </div>
    <SubmitButton class="btn-charge" @click="() => emit('charge')">충전하기</SubmitButton>
  </div>
</template>

<style scoped>
.my-point {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 16px;
  background-color: #F4F4F4;
  border-radius: 16px;
}
.container {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 6px;
}
.title {
  font-size: 12px;
  font-weight: 600;
  color: #898989;
}
.point {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 2px;
  font-size: 26px;
  font-weight: 700;
  color: #000;
}
.point img {
  width: 27px;
  height: 27px;
  object-fit: contain;
}
.btn-charge {
  width: auto;
  height: 36px;
  padding: 0 16px;
  background-color: #7542FD;
  font-size: 14px;
  font-weight: 700;
}
</style>
