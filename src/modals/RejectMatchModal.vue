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
    <span class="title">{{props.data?.name}}님과의<br> 매칭을 거절하시겠습니까?</span>
    <p class="description">상대방과 다시 매칭될 수 없어요! 정말 거절할까요?</p>
    <SubmitButton @click="props.data?.onClickSubmit">매칭 거절하기</SubmitButton>
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
