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
    <span class="title">{{props.data?.name}}님과의 매칭을 수락하시겠습니까?</span>
    <p class="description">매칭이 성사되는 경우 캔디 30개가 사용됩니다.</p>
    <SubmitButton :style="{backgroundColor: '#6751FF'}" @click="props.data?.onClickSubmit">매칭 요청하기</SubmitButton>
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
  color: #6726FE;
}
</style>
