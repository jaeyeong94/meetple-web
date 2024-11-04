<script setup lang="ts">
import type { PropType } from 'vue'
import type { NotificationType } from '@/types'
import IcNotificationType from '@/components/icons/IcNotificationType.vue'

const props = defineProps({
  type: {
    type: String as PropType<NotificationType>,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
})

const getType = () => {
  switch(props.type) {
    case 'sign-up':
      return '회원가입 완료'
    case 'verification-success':
      return '인증승인'
    case 'verification-failure':
      return '인증거절'
    case 'recommended-meeting':
      return '추천 미팅도착'
    case 'match-request':
      return '상대방 매칭 요청'
    case 'match-request-remind':
      return '상대방 매칭 요청'
    case 'matched':
      return '매칭 완료'
    case 'match-reject':
      return '상대방 매칭 거절'
    default:
      return '알림'
  }
}

const matchSuccess = props.type === 'matched' || props.type === 'recommended-meeting'
const matchFailure = props.type === 'match-reject'
</script>

<template>
  <div class="notification">
    <IcNotificationType :type="props.type" />
    <div class="container">
      <p class="top">
        <span class="type" :class="{ 'match-success': matchSuccess, 'match-failure': matchFailure }">{{getType()}}</span>·<span class="date">{{props.date}}</span>
      </p>
      <p class="content">{{props.content}}</p>
    </div>
  </div>
</template>

<style scoped>
.notification {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  padding: 16px 0;
}
.container {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.top {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  color: #B7B7B7;
}
.type {
  font-size: 13px;
  font-weight: 600;
  color: #6751FF;
}
.type.match-success {
  color: #F742AF;
}
.type.match-failure {
  color: #878787;
}
.content {
  font-size: 14px;
  color: #000;
}
</style>
