<script setup lang="ts">
import ReferralBanner from '@/components/ReferralBanner.vue'
import Banner from '@/components/ReferralBanner.vue'
import MyProfile from '@/components/MyProfile.vue'
import MyPointWithButton from '@/components/MyPointWithButton.vue'
import Settings from '@/components/Settings.vue'
import Divider from '@/components/Divider.vue'
import Gap from '@/components/Gap.vue'
import StickyArea from '@/components/StickyArea.vue'
import SubHeader from '@/components/SubHeader.vue'
import http from '@/lib/http'
import type MixpanelService from '@/lib/mixpanel'
import router from '@/router'
import { inject, onMounted, reactive, ref, type Ref } from 'vue'

const mp = inject<MixpanelService>('mixpanel')
const settings = [
  { title: '이용 가이드', onClick: () => {
      window.open('https://seen-bison-bae.notion.site/Meetple-135c10e8cd2c80e48768c5e702705b41', '_blank');
    } },
  { title: '문의하기', onClick: () => {
    window.open('https://seen-bison-bae.notion.site/136c10e8cd2c8077ae1cf0d2f78bb31d?pvs=4', '_blank');
    } },
  { title: '공지사항', onClick: () => {
    window.open('https://seen-bison-bae.notion.site/135c10e8cd2c80ae8fd9c410e2240cdb?pvs=4', '_blank');
    } },
  { title: '계정설정', onClick: () => {
    router.push('/profile-setting')
    } },
  { title: '이용약관', onClick: () => {
      window.open('https://seen-bison-bae.notion.site/135c10e8cd2c80fa9eaac5a035090c22?pvs=4', '_blank');
    } },
  { title: '개인정보 처리방침', onClick: () => {
      window.open('https://seen-bison-bae.notion.site/135c10e8cd2c80b28684f91f7df41e35?pvs=4', '_blank');
    } },
]

const account: any = reactive({});
const photos: Ref<any> = ref([]);
const jobs: Ref<any> = ref([]);

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

  account.data.accountProfiles.forEach((profile: any) => {
    if(profile.type === 'photo') {
      photos.value.push(profile)
    } else if(profile.type === 'job') {
      jobs.value.push(profile)
    }
  })
})
</script>

<template>
  <StickyArea position="top" :style="{ backgroundColor: '#fff'}">
    <SubHeader :show-back-button="true" @back="() => {
      // router.back()
      router.push('/match')
    }" />
<!--    <Tabs :tabs="TEST_TABS" :current-index="1" />-->
  </StickyArea>
  <div class="page">
      <MyProfile :name="account.data?.accountMeta?.nick_name" :message="account.data?.accountMeta.self_introduction" :image-url="photos[0]?.image_path" @click="() => {
        router.push('/profile-edit')
        mp?.trackEvent('click_profile_edit')
      }" />
<!--    <Gap :height="20" />-->
    <Gap :height="20" />
    <MyPointWithButton :point="account.data?.currency || 0" @charge="() => {
      router.push('/point')
      mp?.trackEvent('click_move_point')
    }" />
    <Gap :height="20" />
    <Settings :options="settings" />
    <Gap :height="80" />
    <div class="info">
      <p>(주) 다이버즈 Divers Inc.</p>
      <p>사업자등록번호 : 685-86-02346 l 대표 : 김도건</p>
      <p>주소 : 서울특별시 강남구 봉은사로22길 45-9, 1층 14호</p>
      <p>전화번호 : 010-2483-3511</p>
    </div>
    <ReferralBanner />
  </div>
</template>

<style scoped>
.page {
  padding: 16px 16px 128px 16px;
}

.info {
  border-top: 1px solid #91A3BD;
  padding-top: 8px;
  font-size: 12px;
  color: #91A3BD;
  text-align: left;
  line-height: 1.5;
}
</style>
