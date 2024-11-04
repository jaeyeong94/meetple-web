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
    <span class="title">{{props.data?.name}}님을 삭제하시겠습니까?</span>
    <p class="description">매칭 리스트에서 삭제됩니다.</p>
    <SubmitButton @click="props.data?.onClickSubmit">삭제하기</SubmitButton>
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
