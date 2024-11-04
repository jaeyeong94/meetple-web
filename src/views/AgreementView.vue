<script setup lang="ts">
import Gap from '@/components/Gap.vue'
import StickyArea from '@/components/StickyArea.vue'
import SubHeader from '@/components/SubHeader.vue'
import PageTitleAndDescription from '@/components/PageTitleAndDescription.vue'
import Checkbox from '@/components/forms/Checkbox.vue'
import Divider from '@/components/Divider.vue'
import SubmitButton from '@/components/SubmitButton.vue'
import { ref } from 'vue'

const agreement = ref([false, false, false])
</script>

<template>
  <StickyArea position="top" :style="{ backgroundColor: '#fff'}">
    <SubHeader :show-close-button="true" @close="() => {}" />
  </StickyArea>
  <div class="page">
    <PageTitleAndDescription title="동의해주세요" description="빨리요" />
    <Gap :height="40" />
    <Checkbox :main="true" name="all" title="전체 동의 하기 (선택 정보 포함)" @change="() => {
      agreement = agreement.map(() => !agreement.reduce((acc, cur) => acc && cur, true))
    }" :value="agreement.reduce((acc, cur) => acc && cur, true)" />
    <Gap :height="16" />
    <Divider />
    <Gap :height="16" />
    <Checkbox name="agreement1" title="[필수] 서비스 이용약관 동의" @change="(val: boolean) => agreement[0] = val" :value="agreement[0]" :show-detail-button="true" @detail="() => {}" />
    <Gap :height="20" />
    <Checkbox name="agreement2" title="[필수] 개인정보 수집 및 이용 동의" @change="(val: boolean) => agreement[1] = val" :value="agreement[1]" :show-detail-button="true" @detail="() => {}" />
    <Gap :height="20" />
    <Checkbox name="agreement3" title="[선택] 마케팅 목적의 개인정보 수집 및 이용 동의" @change="(val: boolean) => agreement[2] = val" :value="agreement[2]" :show-detail-button="true" @detail="() => {}" />
  </div>
  <StickyArea position="bottom" :style="{ padding: '14px 16px', boxShadow: '0 -3px 13px 0 rgba(0, 0, 0, .07)'}">
    <SubmitButton :disabled="!agreement[0] || !agreement[1]" :style="{ backgroundColor: '#6726FE' }">다음</SubmitButton>
  </StickyArea>
</template>

<style scoped>
.page {
  padding: 16px;
}
</style>
