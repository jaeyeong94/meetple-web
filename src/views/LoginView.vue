<script setup lang="ts">
import StickyArea from '@/components/StickyArea.vue'
import SubHeader from '@/components/SubHeader.vue'
import PhoneNumberInput from '@/components/forms/PhoneNumberInput.vue'
import PageTitleAndDescription from '@/components/PageTitleAndDescription.vue'
import Gap from '@/components/Gap.vue'
import SubmitButton from '@/components/SubmitButton.vue'
import type MixpanelService from '@/lib/mixpanel'
import router from '@/router'
import { inject, ref } from 'vue'
import http from '@/lib/http'

const phoneNumber = ref('')
const authPhoneNumber = ref('')
const btnState = ref(false)
const token = localStorage.getItem('token')
const mp = inject<MixpanelService>('mixpanel')

if(token) {
  router.push('/match')
}

const action = () => {
  http.post('/account/verification', { phoneNumber: authPhoneNumber.value })
    .then((data: any) => {
      localStorage.setItem('authPhoneNumber', authPhoneNumber.value)

      // 심사용
      if(data.data.data.accessToken) {
        localStorage.setItem('token', data.data.data.accessToken)
        router.push('/register/auto')
        return
      }

      mp?.trackEvent('login_code_request', { phoneNumber: authPhoneNumber.value })

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
  </div>
</template>

<style scoped>
.page {
  padding: 16px;
}
</style>
