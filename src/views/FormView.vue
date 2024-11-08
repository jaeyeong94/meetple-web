<script setup lang="ts">
import Gap from '@/components/Gap.vue'
import StickyArea from '@/components/StickyArea.vue'
import SubHeader from '@/components/SubHeader.vue'
import PageTitleAndDescription from '@/components/PageTitleAndDescription.vue'
import Image from '@/components/forms/Image.vue'
import SubmitButton from '@/components/SubmitButton.vue'
import ProgressBar from '@/components/ProgressBar.vue'
</script>

<template>
  <StickyArea position="top" :style="{ backgroundColor: '#fff'}">
    <ProgressBar :progress="65" />
    <SubHeader title="프로필 등록" :show-back-button="true" @back="() => {}" />
  </StickyArea>
  <div class="page"><PageTitleAndDescription title="프로필에 등록될 직장 및 직무를 인증해주세요." description="Meetple은 인증 기반의 서비스입니다." />
    <Gap :height="20" />
    <Image label="프로필 이미지" :required="true" @change="() => {}" description="프로필 이미지를 업로드해요" />

    <Gap :height="20" />
  </div>
  <StickyArea position="bottom" :style="{ padding: '14px 16px', boxShadow: '0 -3px 13px 0 rgba(0, 0, 0, .07)'}">
    <SubmitButton :style="{ backgroundColor: '#6726FE' }">인증 신청하기</SubmitButton>
  </StickyArea>
</template>

<style scoped>
.page {
  padding: 16px;
}
</style>
