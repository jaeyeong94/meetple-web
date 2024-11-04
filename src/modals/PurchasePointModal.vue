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
    <span class="title">포인트 구매하기</span>
    <p class="description">{{props.data?.point}} 포인트를 구매하겠습니까?</p>
    <SubmitButton :style="{backgroundColor: '#6751FF'}" @click="props.data?.onClickSubmit">구매하기</SubmitButton>
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
  color: #6751FF;
}
</style>
