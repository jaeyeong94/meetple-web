<script setup lang="ts">
import Modal from '@/components/Modal.vue'
import SubmitButton from '@/components/SubmitButton.vue'
import CancelButton from '@/components/CancelButton.vue'

const props = defineProps({
  data: Object,
})

const emit = defineEmits(['close'])
</script>

<template>
  <Modal>
    <span class="title">인증번호를 못 받으셨나요?</span>
    <p class="description">{{props.data?.point}} 인증번호를 다시 받으시거나, 입력하신 연락처를 확인해주세요.</p>
    <SubmitButton :style="{backgroundColor: '#6751FF'}" @click="props.data?.onClickSubmit">인증번호 다시 받기</SubmitButton>
    <CancelButton :style="{marginTop: '20px'}" @click="() => {
          emit('close')
        }">취소하기</CancelButton>
  </Modal>
</template>

<style scoped>
.title {
  font-size: 24px;
  font-weight: 700;
  color: #000;
}
.description {
  letter-spacing: -1px;
  margin-top: 8px;
  margin-bottom: 32px;
  font-size: 14px;
  font-weight: 500;
  color: #6751FF;
}
</style>
