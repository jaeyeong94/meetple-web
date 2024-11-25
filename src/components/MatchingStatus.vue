<script setup lang="ts">
import type { PropType } from 'vue'
import IcHeart from '@/components/icons/IcHeart.vue'
type StatusType = 'waiting' | 'matched'

const props = defineProps({
  status: String as PropType<StatusType>,
})

const color = props.status === 'matched' ? '#F742AF' : '#7542FD'
const title = props.status === 'matched' ? '상대가 매칭을 수락했어요.' : '내가 수락한 매칭'
const description = props.status === 'matched' ? '내가 수락하면 매칭이 성사됩니다.' : '문자로 결과를 알려드릴게요!'
</script>

<template>
  <div class="matching-status" :class="props.status">
    <div class="icon">
      <IcHeart :style="{width: '32px', height: '32px'}" :color="color" />
    </div>
    <div class="text">
      <span class="title">{{title}}</span>
      <p class="description">{{description}}</p>
    </div>
  </div>
</template>

<style scoped>
.matching-status {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 6px;
  gap: 12px;
  border: 1px solid #F4F4F4;
  border-radius: 31px;
}
.matching-status.waiting {
  background-color: #7542FD;
}
.matching-status.matched {
  background-color: #F742AF;
}
.icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: #fff;
}
.text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.title {
  font-size: 15px;
  font-weight: 700;
  color: #fff;
}
.description {
  font-size: 13px;
  font-weight: 500;
  color: #fff;
  opacity: 0.62;
}
</style>
