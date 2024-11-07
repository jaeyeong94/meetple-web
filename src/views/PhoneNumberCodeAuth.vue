<script setup lang="ts">
import StickyArea from '@/components/StickyArea.vue'
import SubHeader from '@/components/SubHeader.vue'
import PhoneNumberInput from '@/components/forms/PhoneNumberInput.vue'
import CodeInput from '@/components/forms/CodeInput.vue'
import PageTitleAndDescription from '@/components/PageTitleAndDescription.vue'
import Gap from '@/components/Gap.vue'
import DeepSelect from '@/components/forms/DeepSelect.vue'
import SubmitButton from '@/components/SubmitButton.vue'
import { ref } from 'vue'
import { TEST_DEEP_SELECT_OPTIONS } from '@/consts/testData'

const phoneNumber = ref('')
const code = ref('')

</script>

<template>
  <StickyArea position="top" :style="{ backgroundColor: '#fff'}">
    <SubHeader title="" />
  </StickyArea>
  <div class="page">
    <PageTitleAndDescription title="나의 휴대폰 번호를<br>입력해주세요." description="휴대폰 번호로 로그인 또는 회원가입이 진행됩니다.<br>`-`을 제외한 숫자만 입력해주세요." />
    <Gap :height="40" />
    <PhoneNumberInput
      @input="(val: string) => phoneNumber = val"
      :value="phoneNumber"
    />
    <Gap :height="20" />
    <CodeInput
      @input="(val: string) => code = val"
      :value="code"
    />
    <Gap :height="20" />
    <SubmitButton :fixed="true" :style="{
      backgroundColor: '#6726FE',
      position: 'absolute',
      bottom: '16px',
      width: 'calc(100% - 32px)',
    }">인증번호 받기</SubmitButton>
<!--    <DeepSelect label="거주지역" :required="true" modal-title="거주지역을 선택해주세요."-->
<!--                @change="(val1: string, val2: string) => location = val2"-->
<!--                :value="location"-->
<!--                :options="TEST_DEEP_SELECT_OPTIONS"/>-->
  </div>
</template>

<style scoped>
.page {
  padding: 16px;
}
</style>
