<script setup lang="ts">
import Modal from '@/components/Modal.vue'
import SubmitButton from '@/components/SubmitButton.vue'
import IcConnection from '@/components/icons/IcConnection.vue'

const props = defineProps({
  data: Object,
})
</script>

<template>
  <Modal>
    <div class="couple">
      <img :src="props.data?.partnerProfileImageUrl" alt="Partner profile" class="profile-image" />
      <IcConnection />
      <img :src="props.data?.myProfileImageUrl" alt="My profile" class="profile-image" />
    </div>
    <div class="container">
      <span class="title">{{props.data?.name}}님과의 매칭을 성사되었습니다.</span>
      <p class="description">상대방의 연락처를 확인하고 미팅을 진행하세요</p>
    </div>
    <SubmitButton :style="{backgroundColor: '#6751FF'}" @click="props.data?.onClickSubmit">연락처 확인하기</SubmitButton>
  </Modal>
</template>

<style scoped>
.couple {
  margin: 18px 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 4px;
}
.profile-image {
  width: 92px;
  height: 92px;
  border-radius: 46px;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, .15);
  object-fit: cover;
}
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  margin-bottom: 26px;
}
.title {
  font-size: 24px;
  font-weight: 700;
  color: #000;
}
.description {
  font-size: 14px;
  font-weight: 500;
  color: #929292;
}
</style>
