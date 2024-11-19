<script setup lang="ts">
import AccountSettings from '@/components/AccountSettings.vue'
import Divider from '@/components/Divider.vue'
import ButtonWithDetail from '@/components/buttons/ButtonWithDetail.vue'
import Gap from '@/components/Gap.vue'
import StickyArea from '@/components/StickyArea.vue'
import SubHeader from '@/components/SubHeader.vue'
import { TEST_MORE_DATA, TEST_TABS, TEST_USER } from '@/consts/testData'
import http from '@/lib/http'
import type MixpanelService from '@/lib/mixpanel'
import { formatPhoneNumber } from '@/lib/utils'
import router from '@/router'
import { useModalStore } from '@/stores/modal'
import { inject, onMounted, reactive } from 'vue'

const mp = inject<MixpanelService>('mixpanel')
const settings = [
  { title: '문의하기', onClick: () => {} },
  { title: '공지사항', onClick: () => {} },
  { title: '계정설정', onClick: () => {} },
  { title: '이용약관', onClick: () => {} },
  { title: '개인정보 처리방침', onClick: () => {} },
];

const account: any = reactive({});

const accountUpdate = async () => {
  const accountResponse = await http.get('/account');
  Object.assign(account, accountResponse.data);
}

onMounted(async () => {
  try {
    await accountUpdate()
  } catch(e: any) {
    console.log(e, 'error')
  }

  // 튕겨내기
  if(!account.data) {
    localStorage.removeItem('token')
    await router.push('/login')
  }

  if(account.data.accountMeta.stage !== 'approve') {
    await router.push('/register')
  }
})

const tokenRemove = () => {
  localStorage.removeItem('token')
  router.push('/');
}

const leave = async () => {
  const response = await http.delete(`/account/leave`);
  if(response.data.message === 'success') {
    tokenRemove();
  }
}

const user = TEST_USER;
</script>

<template>
  <StickyArea position="top" :style="{ backgroundColor: '#fff'}">
    <SubHeader title="계정설정" :show-back-button="true" @back="() => {
      router.back()
    }" />
    <!--    <Tabs :tabs="TEST_TABS" :current-index="1" />-->
  </StickyArea>
  <div class="page">
    <AccountSettings :name="account.data?.name" :phone-number="formatPhoneNumber(account.data?.phone_number || '')" :birth-date="account.data?.birth_date.replaceAll('-', '.')" @logout="() => {
        useModalStore().setModal({
          type: 'logout',
          data: {
            onClickCancel: () => {
              useModalStore().setModal({ type: null })
            },
            onClickSubmit: () => {
              useModalStore().setModal({ type: null })
              tokenRemove();
            }
          }
        })
    }" />
    <Gap :height="20" />
    <Divider :height="5" />
    <Gap :height="20" />
    <ButtonWithDetail @click="() => {
        mp?.trackEvent('click_delete_account')
        useModalStore().setModal({
          type: 'delete-account',
          data: {
            onClickCancel: () => {
              useModalStore().setModal({ type: null })
            },
            onClickSubmit: () => {
              mp?.trackEvent('click_delete_account_submit')
              useModalStore().setModal({ type: null })
              leave();
            }
          }
        })
    }" title="회원 탈퇴하기" title-color="#FF334B" description="나의 프로필과 매칭된 이력 등이 모두 삭제됩니다." />
  </div>
</template>

<style scoped>
.page {
  padding: 16px;
}
</style>
