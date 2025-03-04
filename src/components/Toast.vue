<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { PropType } from 'vue'
import type { ToastType } from '@/types'

const props = defineProps({
  type: {
    type: String as PropType<ToastType>,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    default: 3000 // 기본 3초 유지
  }
})

const emit = defineEmits(['close'])
const isVisible = ref(false)

onMounted(() => {
  isVisible.value = true

  setTimeout(() => {
    isVisible.value = false
    setTimeout(() => emit('close'), 500) // 애니메이션 종료 후 제거
  }, props.duration)
})
</script>

<template>
  <transition name="toast">
    <div v-if="isVisible" class="toast" :class="type">
      <svg v-if="type === 'ok'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path fill-rule="evenodd" clip-rule="evenodd"
              d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM11.2609 16.4939L16.7966 9.21017L15.2042 8L10.952 13.595L8.15119 11.1943L6.84961 12.7128L11.2609 16.4939Z"
              fill="#58FFC4"/>
      </svg>

      <svg v-if="type === 'warning'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path fill-rule="evenodd" clip-rule="evenodd"
              d="M14.5064 4.44793C13.373 2.51736 10.627 2.51736 9.49355 4.44793L2.41843 16.499C1.25444 18.4816 2.65683 21 4.92488 21H19.0751C21.3432 21 22.7456 18.4816 21.5816 16.499L14.5064 4.44793ZM13 9H11V15H13V9ZM12 18C12.5523 18 13 17.5523 13 17C13 16.4477 12.5523 16 12 16C11.4477 16 11 16.4477 11 17C11 17.5523 11.4477 18 12 18Z"
              fill="#FF5B5E"/>
      </svg>

      <svg v-if="type === 'check'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M9.76451 2.65518C10.9183 1.11494 13.2282 1.11494 14.382 2.65518C15.0142 3.49911 16.0565 3.93085 17.1003 3.78114C19.0053 3.50791 20.6386 5.1412 20.3654 7.0462C20.2157 8.08999 20.6474 9.1323 21.4913 9.76451C23.0316 10.9183 23.0316 13.2282 21.4913 14.382C20.6474 15.0142 20.2157 16.0565 20.3654 17.1003C20.6386 19.0053 19.0053 20.6386 17.1003 20.3654C16.0565 20.2157 15.0142 20.6474 14.382 21.4913C13.2282 23.0316 10.9183 23.0316 9.76451 21.4913C9.1323 20.6474 8.08999 20.2157 7.0462 20.3654C5.1412 20.6386 3.50791 19.0053 3.78114 17.1003C3.93085 16.0565 3.49911 15.0142 2.65518 14.382C1.11494 13.2282 1.11494 10.9183 2.65518 9.76451C3.49911 9.1323 3.93085 8.08999 3.78114 7.0462C3.50791 5.1412 5.1412 3.50791 7.0462 3.78114C8.08999 3.93085 9.1323 3.49911 9.76451 2.65518Z"
          fill="#6726FE"/>
      </svg>
      <span>{{ message }}</span>
    </div>
  </transition>
</template>

<style scoped>
/* 토스트 기본 스타일 */
.toast {
  position: fixed;
  bottom: 65px;
  width: 340px;
  height: 49px;
  background-color: #1A1A1C;
  transform: translateX(-50%);
  color: white;
  border-radius: 14px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 12px;
  transition: all 0.5s ease-out, opacity 0.5s ease-out;

  svg {
    margin-right: 10px;
  }
}

/* 애니메이션 */
.toast-enter-active {
  animation: slide-in 0.15s ease-out forwards, hold 1s linear 0.15s forwards;
}
.toast-leave-active {
  animation: slide-out 0.15s ease-in forwards;
}

/* 왼쪽에서 등장 */
@keyframes slide-in {
  from {
    transform: translateX(-150%);
    opacity: 0;
  }
  to {
    transform: translateX(-50%);
    opacity: 1;
  }
}

/* 1초 유지 */
@keyframes hold {
  from, to {
    transform: translateX(-50%);
  }
}

/* 오른쪽으로 사라짐 */
@keyframes slide-out {
  from {
    transform: translateX(-50%);
    opacity: 1;
  }
  to {
    transform: translateX(150%);
    opacity: 0;
  }
}
</style>
