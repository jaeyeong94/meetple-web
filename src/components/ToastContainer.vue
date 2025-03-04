<script setup lang="ts">
import { ref } from 'vue'
import Toast from './Toast.vue'
import type { ToastType } from '@/types'

interface ToastMessage {
  id: number
  type: ToastType
  message: string
  duration?: number
}

const toasts = ref<ToastMessage[]>([])

const addToast = (type: ToastType, message: string, duration = 3000) => {
  const id = Date.now() // 고유 ID 생성
  toasts.value.push({ id, type, message, duration })

  setTimeout(() => removeToast(id), duration + 1000) // 1초 유지 + 애니메이션 시간 추가
}

const removeToast = (id: number) => {
  toasts.value = toasts.value.filter(toast => toast.id !== id)
}

defineExpose({ addToast }) // 부모에서 addToast 호출 가능하게 함
</script>

<template>
  <div class="toast-container">
    <Toast
      v-for="toast in toasts"
      :key="toast.id"
      :type="toast.type"
      :message="toast.message"
      :duration="toast.duration"
      @close="removeToast(toast.id)"
    />
  </div>
</template>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 1000;
}
</style>
