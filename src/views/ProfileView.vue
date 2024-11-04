<script setup lang="ts">
import Tabs from '@/components/Tabs.vue'
import MyProfile from '@/components/MyProfile.vue'
import MyPointWithButton from '@/components/MyPointWithButton.vue'
import Settings from '@/components/Settings.vue'
import AlertBanner from '@/components/AlertBanner.vue'
import AccountSettings from '@/components/AccountSettings.vue'
import Divider from '@/components/Divider.vue'
import ButtonWithDetail from '@/components/buttons/ButtonWithDetail.vue'
import Gap from '@/components/Gap.vue'
import StickyArea from '@/components/StickyArea.vue'
import SubHeader from '@/components/SubHeader.vue'
import { TEST_MORE_DATA, TEST_TABS, TEST_USER } from '@/consts/testData'

const settings = [
  { title: '문의하기', onClick: () => {} },
  { title: '공지사항', onClick: () => {} },
  { title: '계정설정', onClick: () => {} },
]

const user = TEST_USER;
</script>

<template>
  <StickyArea position="top" :style="{ backgroundColor: '#fff'}">
    <SubHeader title="테스트" :more-button-data="TEST_MORE_DATA" />
    <Tabs :tabs="TEST_TABS" :current-index="1" />
  </StickyArea>
  <div class="page">
    <MyProfile :name="user.name" :message="user.message" :image-url="user.profile_image_url" />
    <Gap :height="20" />
    <AlertBanner title="카카오톡 오픈 프로필을 등록해주세요." description="링크된 상대방과 대화할 수 있습니다." />
    <Gap :height="20" />
    <MyPointWithButton :point="1525" @charge="() => {}" />
    <Gap :height="20" />
    <Settings :options="settings" />
    <Gap :height="20" />
    <AccountSettings name="일론" phone-number="010-1234-1234" birth-date="2000.01.15" @logout="() => {}" />
    <Gap :height="20" />
    <Divider :height="5" />
    <Gap :height="20" />
    <ButtonWithDetail title="다운로드" description="지금 바로 다운로드" />
    <Gap :height="20" />
    <ButtonWithDetail title="회원탈퇴" title-color="#FF334B" description="지금 바로 고고" />
  </div>
</template>

<style scoped>
.page {
  padding: 16px;
}
</style>
