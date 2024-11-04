<script setup lang="ts">
import IcLogo from '@/components/icons/IcLogo.vue'
import IcPointLogo from '@/components/icons/IcPointLogo.vue'
import SubmitButton from '@/components/SubmitButton.vue'
import { formatNumber } from '@/lib/utils'

const emit = defineEmits(['click'])

const items = [
  { id: 1, point: 5, price: 1000 },
  { id: 2, point: 10, price: 2000 },
  { id: 3, point: 15, price: 3000 },
]
</script>

<template>
  <div class="title">
    <IcLogo />
    <IcPointLogo />
  </div>
  <ul class="point-items">
    <li v-for="(item) in items" :key="item.id">
      <img class="icon" src="@/assets/images/logo.png" alt="Point" />
      <p class="point"><span>{{item.point}}</span> 포인트</p>
      <SubmitButton class="button" @click="() => emit('click', item.id)">₩ {{formatNumber(item.price)}}</SubmitButton>
    </li>
  </ul>
</template>

<style scoped>
.title {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  margin-bottom: 8px;
}
.point-items {
  display: flex;
  flex-direction: column;
  padding: 16px 0;
  gap: 24px;
  background-color: #F4F4F4;
  border-radius: 16px;
}
.point-items > li {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 9px;
  padding: 0 16px;
}
.icon {
  width: 40px;
  height: 40px;
}
.point {
  flex: 1;
  font-size: 18px;
  font-weight: 700;
  color: #000;
}
.point span {
  color: #6751FF;
}
.button {
  width: auto;
  height: 38px;
  padding: 0 18px;
  background-color: #6751FF;
}
</style>
