<script setup lang="ts">
import Modal from '@/components/Modal.vue'
import SubmitButton from '@/components/SubmitButton.vue'
import CancelButton from '@/components/CancelButton.vue'

const props = defineProps({
  data: Object,
})
</script>

<template>
  <Modal>
    <span class="title">정말 탈퇴하시겠습니까?</span>
    <p class="description">삭제된 정보는 다시 복구할 수 없습니다.</p>
    <SubmitButton :style="{backgroundColor: '#FF334B'}" @click="props.data?.onClickSubmit">회원탈퇴</SubmitButton>
    <CancelButton :style="{marginTop: '20px'}" @click="props.data?.onClickCancel">취소하기</CancelButton>
  </Modal>
</template>

<style scoped>
.title {
  font-size: 24px;
  font-weight: 700;
  color: #000;
}
.description {
  margin-top: 8px;
  margin-bottom: 32px;
  font-size: 14px;
  font-weight: 500;
  color: #929292;
}
</style>
