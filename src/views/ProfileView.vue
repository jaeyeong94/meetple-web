<script setup lang="ts">
import MyProfile from '@/components/MyProfile.vue'
import MyPointWithButton from '@/components/MyPointWithButton.vue'
import Settings from '@/components/Settings.vue'
import Divider from '@/components/Divider.vue'
import Gap from '@/components/Gap.vue'
import StickyArea from '@/components/StickyArea.vue'
import SubHeader from '@/components/SubHeader.vue'
import { TEST_USER } from '@/consts/testData'
import http from '@/lib/http'
import router from '@/router'
import { onMounted, reactive, ref, type Ref } from 'vue'

const settings = [
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
  await accountUpdate()

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
      router.back()
    }" />
<!--    <Tabs :tabs="TEST_TABS" :current-index="1" />-->
  </StickyArea>
  <div class="page">
    <div style="cursor: pointer;" @click.capture="() => {
      router.push('/profile-edit')
    }">
      <MyProfile :name="account.data?.accountMeta?.nick_name" :message="account.data?.accountMeta.self_introduction" :image-url="photos[photos.length - 1]?.image_path" @change="() => {}" />
    </div>
<!--    <Gap :height="20" />-->
<!--    <AlertBanner title="카카오톡 오픈 프로필을 등록해주세요." description="링크된 상대방과 대화할 수 있습니다." />-->
    <Gap :height="20" />
    <MyPointWithButton :point="account.data?.currency || 0" @charge="() => {
      router.push('/point')
    }" />
    <Gap :height="20" />
    <Settings :options="settings" />
    <Gap :height="20" />
    <Divider :height="5" />
    <Gap :height="20" />
  </div>
</template>

<style scoped>
.page {
  padding: 16px;
  min-height: 100dvh;
}
</style>
