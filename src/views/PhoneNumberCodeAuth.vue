<script setup lang="ts">
import StickyArea from '@/components/StickyArea.vue'
import SubHeader from '@/components/SubHeader.vue'
import CodeInput from '@/components/forms/CodeInput.vue'
import PageTitleAndDescription from '@/components/PageTitleAndDescription.vue'
import Gap from '@/components/Gap.vue'
import SubmitButton from '@/components/SubmitButton.vue'
import http from '@/lib/http'
import type MixpanelService from '@/lib/mixpanel'
import router from '@/router'
import { useModalStore } from '@/stores/modal'
import { inject, ref } from 'vue'

const phoneNumber = localStorage.getItem('authPhoneNumber')
const authCode = ref('')
const btnState = ref(false)
const token = localStorage.getItem('token')
const mp = inject<MixpanelService>('mixpanel')

if(!phoneNumber) {
  router.push('/login')
}

if(token) {
  router.push('/register/auto')
}

const retryAction = () => {
  useModalStore().setModal({
    type: 'code-retry',
    data: {
      onClickSubmit: () => {
        http.post('/account/verification', { phoneNumber: phoneNumber })
          .then((data: any) => {
            authCode.value = '';

            mp?.trackEvent('login_code_retry', { phoneNumber: phoneNumber })

            useModalStore().setModal({ type: null })
          })
          .catch((error: any) => {
            console.log(error, 'error')
            useModalStore().setModal({ type: null })
          })
      },
    },
  })
}

const submitAction = () => {
  const referralCode = localStorage.getItem('referralCode');

  http.post('/account/login', { phoneNumber, code: authCode.value, referralCode })
    .then((data: any) => {
      const response = data.data;
      localStorage.setItem('token', response.data.accessToken)
      localStorage.removeItem('terms');

      mp?.trackEvent('login_code_submit', { phoneNumber: phoneNumber })

      router.push('/register/auto')
    })
    .catch((error: any) => {
      useModalStore().setModal({
        type: 'alert',
        data: {
          title: error.response.data.title,
          message: error.response.data.message
        }
      })
      console.log(error, 'error')
    })
}
</script>

<template>
  <StickyArea position="top" :style="{ backgroundColor: '#fff'}">
    <SubHeader title="" :show-back-button="true" @back="() => {
      router.back()
    }" />
  </StickyArea>
  <div class="page">
    <PageTitleAndDescription title="문자로 받은 인증번호를<br>입력해주세요." description="" />
    <div style="color: #6426FE; cursor: pointer" @click="retryAction">
      혹시 인증번호를 받지 못하셨나요? >
    </div>
    <Gap :height="40" />
    <CodeInput
      @input="(val: string) => {
        btnState = val.length === 6
        authCode = val
      }"
      :value="authCode"
    />
    <Gap :height="20" />
    <SubmitButton @click="submitAction" :disabled="!btnState" :fixed="true" :style="{
      backgroundColor: '#6726FE',
      position: 'absolute',
      bottom: '16px',
      width: 'calc(100% - 32px)',
    }">인증하기</SubmitButton>
  </div>
</template>

<style scoped>
.page {
  padding: 16px;
}
</style>
