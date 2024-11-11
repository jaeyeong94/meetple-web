<script setup lang="ts">
import { formatPhoneNumber } from '../lib/utils'

const props = defineProps({
  phoneNumber: String,
})

const emit = defineEmits(['copy']);
const copyToClipboard = () => {
  if (props.phoneNumber) {
    navigator.clipboard.writeText(props.phoneNumber).then(() => {
      emit('copy'); // 부모 컴포넌트에 copy 이벤트 전달
    }).catch((error) => {
      console.error('복사 실패:', error);
    });
  }
};
</script>

<template>
  <div class="phone-number-copy">
    <div class="icon">
      <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="22.5" cy="22.5" r="22.5" fill="black"/>
        <path d="M17.3176 14C17.5331 14 17.7241 14.131 17.7918 14.3306C18.1521 15.3819 19.584 18.6072 19.4731 18.9557C19.3376 19.3726 17.6933 20.5907 17.6286 21.1833C17.5639 21.776 18.7864 23.4289 20.0705 24.7273C21.8135 26.4904 24.5726 27.6489 24.7974 27.7412C25.0222 27.8336 26.7343 25.3915 27.0915 25.2396C27.4487 25.0877 32 27.4613 32 27.8663C32 28.2713 31.6428 29.6651 30.8052 30.77C30.2201 31.5414 28.9329 31.8779 27.9753 32C27.9537 32 27.9291 32 27.9075 32C27.1839 31.8868 22.1861 31.3388 17.8873 27.2409C14.3922 23.9083 13.3421 20.1142 13.0126 18.6042C13.0065 18.5834 13.0065 18.5625 13.0034 18.5417C12.9849 18.0354 13.0034 16.5344 14.1089 15.2181C14.5369 14.7088 15.2821 14.2293 15.5562 14.0625C15.6239 14.0208 15.6978 14 15.7779 14H17.3207H17.3176Z" fill="white"/>
      </svg>
    </div>
    <div class="phone-number-text" v-if="phoneNumber">
      {{ formatPhoneNumber(phoneNumber) }}
    </div>
    <button class="copy-button" @click="copyToClipboard">복사하기</button>
  </div>
</template>

<style scoped>
.phone-number-copy {
  padding: 8px;
  border-radius: 40px;
  border: 1px solid #E9E9E9;
  background-color: #fff;
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
}

.phone-number-text {
  margin: 0 16px;
  font-size: 18px;
  font-weight: bold;
}

.copy-button {
  font-size: 13px;
  font-weight: 600;
  border-radius: 40px;
  border: 1px solid #EAEAEA;
  padding: 11px;
}
</style>
