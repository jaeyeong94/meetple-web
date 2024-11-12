<script setup lang="ts">
import AccountSettings from '@/components/AccountSettings.vue'
import Divider from '@/components/Divider.vue'
import ButtonWithDetail from '@/components/buttons/ButtonWithDetail.vue'
import Gap from '@/components/Gap.vue'
import StickyArea from '@/components/StickyArea.vue'
import SubHeader from '@/components/SubHeader.vue'
import { TEST_MORE_DATA, TEST_TABS, TEST_USER } from '@/consts/testData'
import http from '@/lib/http'
import router from '@/router'
import { useModalStore } from '@/stores/modal'

const settings = [
  { title: '문의하기', onClick: () => {} },
  { title: '공지사항', onClick: () => {} },
  { title: '계정설정', onClick: () => {} },
  { title: '이용약관', onClick: () => {} },
  { title: '개인정보 처리방침', onClick: () => {} },
];

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
    <AccountSettings name="일론" phone-number="010-1234-1234" birth-date="2000.01.15" @logout="() => {
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
        useModalStore().setModal({
          type: 'delete-account',
          data: {
            onClickCancel: () => {
              useModalStore().setModal({ type: null })
            },
            onClickSubmit: () => {
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
