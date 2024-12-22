<script setup lang="ts">
import type { PropType } from 'vue'
import IcHeart from '@/components/icons/IcHeart.vue'
type StatusType = 'waiting' | 'matched' | 'rejected'

const props = defineProps({
  status: String as PropType<StatusType>,
})
let color = '';
let title = '';
let description = '';

if(props.status === 'matched') {
  color = '#F742AF'
  title = '상대가 매칭을 수락했어요.'
  description = '내가 수락하면 매칭이 성사됩니다.'
} else if(props.status === 'rejected') {
  color = '#000'
  title = '내가 거절한 매칭.'
  description = '다음 추천 미팅으로 찾아뵐게요!'
} else {
  color = '#7542FD'
  title = '내가 수락한 매칭'
  description = '문자로 결과를 알려드릴게요!'
}
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
  border-radius: 40px;
}
.matching-status.waiting {
  background-color: #7542FD;
}
.matching-status.matched {
  background-color: #F742AF;
}
.matching-status.rejected {
  background-color: #000;
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
