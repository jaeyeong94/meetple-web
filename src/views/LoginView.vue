<script setup lang="ts">
import StickyArea from '@/components/StickyArea.vue'
import SubHeader from '@/components/SubHeader.vue'
import PhoneNumberInput from '@/components/forms/PhoneNumberInput.vue'
import CodeInput from '@/components/forms/CodeInput.vue'
import PageTitleAndDescription from '@/components/PageTitleAndDescription.vue'
import Gap from '@/components/Gap.vue'
import DeepSelect from '@/components/forms/DeepSelect.vue'
import SubmitButton from '@/components/SubmitButton.vue'
import router from '@/router'
import { useModalStore } from '@/stores/modal'
import { ref } from 'vue'
import { TEST_DEEP_SELECT_OPTIONS } from '@/consts/testData'
import http from '@/lib/http'

const phoneNumber = ref('')
const authPhoneNumber = ref('')
const btnState = ref(false)
const token = localStorage.getItem('token')

if(token) {
  router.push('/match')
}

const action = () => {
  http.post('/account/verification', { phoneNumber: authPhoneNumber.value })
    .then((data: any) => {
      localStorage.setItem('authPhoneNumber', authPhoneNumber.value)
      router.push('/login/code')
    })
    .catch((error: any) => {
      console.log(error, 'error')
    })
}

// useModalStore().setModal({
//   type: 'alert',
//   data: {
//     message: '확인!'
//   }
// })
</script>

<template>
  <StickyArea position="top" :style="{ backgroundColor: '#fff'}">
    <SubHeader title="" />
  </StickyArea>
  <div class="page">
    <PageTitleAndDescription title="나의 휴대폰 번호를<br>입력해주세요." description="휴대폰 번호로 로그인 또는 회원가입이 진행됩니다.<br>`-`을 제외한 숫자만 입력해주세요." />
    <Gap :height="40" />
    <PhoneNumberInput
      @input="(val: string) => {
          const newVal = val.replace(/[^0-9]/g, '')
          btnState = newVal.length === 11
          authPhoneNumber = newVal
          phoneNumber = val
      }"
      :value="phoneNumber"
    />
    <Gap :height="20" />
    <SubmitButton @click="action" :disabled="!btnState" :style="{
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
