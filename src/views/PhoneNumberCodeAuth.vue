<script setup lang="ts">
import StickyArea from '@/components/StickyArea.vue'
import SubHeader from '@/components/SubHeader.vue'
import CodeInput from '@/components/forms/CodeInput.vue'
import PageTitleAndDescription from '@/components/PageTitleAndDescription.vue'
import Gap from '@/components/Gap.vue'
import SubmitButton from '@/components/SubmitButton.vue'
import http from '@/lib/http'
import router from '@/router'
import { useModalStore } from '@/stores/modal'
import { ref } from 'vue'

const phoneNumber = localStorage.getItem('authPhoneNumber')
const authCode = ref('')
const btnState = ref(false)
const token = localStorage.getItem('token')

if(!phoneNumber) {
  router.push('/login')
}

if(token) {
  router.push('/register')
}

const retryAction = () => {
  useModalStore().setModal({
    type: 'code-retry',
    data: {
      onClickSubmit: () => {
        http.post('/account/verification', { phoneNumber: phoneNumber })
          .then((data: any) => {
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
  http.post('/account/login', { phoneNumber, code: authCode.value })
    .then((data: any) => {
      const response = data.data;
      localStorage.setItem('token', response.data.accessToken)
      router.push('/register')
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
