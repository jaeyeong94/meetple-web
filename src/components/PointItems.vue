<script setup lang="ts">
import IcLogo from '@/components/icons/IcLogo.vue'
import IcPointLogo from '@/components/icons/IcPointLogo.vue'
import SubmitButton from '@/components/SubmitButton.vue'
import { formatNumber } from '@/lib/utils'

const emit = defineEmits(['click'])

const props = defineProps({
  items: Array,
})

</script>

<template>
  <div class="title">
    <IcLogo />
    <IcPointLogo />
  </div>
  <ul class="point-items">
    <li v-for="(item) in props.items" :key="item.id">
      <img class="icon" src="@/assets/images/logo.png" alt="Point" />
      <p class="point"><span>{{item.charge_currency}}</span> 캔디</p>
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
