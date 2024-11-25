<script setup lang="ts">
import ActionButton from '@/components/buttons/ActionButton.vue'
import MoreButton from '@/components/buttons/MoreButton.vue'
import Divider from '@/components/Divider.vue'
import Gap from '@/components/Gap.vue'
import IcLogo from '@/components/icons/IcLogo.vue'
import IcPointLogo from '@/components/icons/IcPointLogo.vue'
import SubmitButton from '@/components/SubmitButton.vue'
import { formatNumber } from '@/lib/utils'
import type { PropType } from 'vue'

const emit = defineEmits(['click', 'event'])

const props = defineProps({
  items: {
    type: Array as PropType<any[]>,
    required: true
  },
})

</script>

<template>
  <div class="title">
    <IcLogo />
    <IcPointLogo />
  </div>

  <Gap :height="16" />
<!--  <div class="event" @click="() => emit('event')">-->
<!--    <img class="icon" src="@/assets/images/logo.png" alt="Point" />-->
<!--    <div class="text">-->
<!--      <p class="event-title">밋플(Meetple) 오픈 Event</p>-->
<!--      <p class="event-description">캔디 30개를 무료로 드려요! (최대 30개 보유 가능)</p>-->
<!--    </div>-->
<!--    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">-->
<!--      <path d="M6.25146 14.5234L12.387 8.38788L6.25146 2.25232" stroke="#A4A4A4" stroke-width="2.1"/>-->
<!--    </svg>-->
<!--  </div>-->
<!--  <Gap :height="30" />-->

  <ul class="point-items">
    <li v-for="(item) in props.items" :key="item.id">
      <img class="icon" src="@/assets/images/logo.png" alt="Point" />
      <p class="point"><span>{{item.charge_currency}}</span> 캔디</p>
      <SubmitButton class="button" :class="{ disabled: !item.visible }" @click="() => {
        if(item.visible) {
          emit('click', item.id);
        }
      }">₩ {{formatNumber(item.price)}}</SubmitButton>
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
  padding: 0 16px;
  background-color: #F4F4F4;
  border-radius: 16px;
}
.point-items > li {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 9px;
  padding: 20px 16px;
  border-bottom: 1px solid #DFDFDF;

  &:last-child {
    border-bottom: none;
  }
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

.disabled{
  background-color: #D1D1D1;
  color: #fff;
  cursor: not-allowed;
}

.event {
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 3px;
  justify-content: space-between;
  padding: 16px;
  background-color: #E9E9FF;
  border-radius: 16px;

  .event-title {
    color: #000;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: 18px; /* 128.571% */
  }

  .event-description {
    color: #55535A;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 18px; /* 150% */
  }
}
</style>
