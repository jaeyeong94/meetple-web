<script setup lang="ts">
import Gap from '@/components/Gap.vue'
import StickyArea from '@/components/StickyArea.vue'
import SubHeader from '@/components/SubHeader.vue'
import UserProfileInfo from '@/components/UserProfileInfo.vue'
import Questions from '@/components/Questions.vue'
import http from '@/lib/http'
import router from '@/router'
import { onMounted, type Reactive, reactive, type Ref, ref } from 'vue'
import { calculateAge } from '@/lib/utils'

const profileData: Reactive<{
  [key: string]: any
}> = reactive({});

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

  profileData.termsRequired = account.data.terms_required
  profileData.termsOptional = account.data.terms_optional
  profileData.name = account.data.name
  profileData.birthDate = account.data.birth_date
  profileData.gender = account.data.gender
  profileData.nickName = account.data.accountMeta.nick_name
  profileData.mbti = account.data.accountMeta.mbti
  profileData.occupiedAreaHigh = account.data.accountMeta.occupied_area_high
  profileData.occupiedAreaLow = account.data.accountMeta.occupied_area_low
  profileData.selfIntroduction = account.data.accountMeta.self_introduction
  profileData.school = account.data.accountMeta.school
  profileData.job = account.data.accountMeta.job
  profileData.descriptions = account.data.accountMeta.descriptions ?? []

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
    <SubHeader title="프로필 미리보기" :show-back-button="true" @back="() => router.back()" />
  </StickyArea>
  <div class="page" v-if="Object.keys(profileData).length > 0">
    <UserProfileInfo
      :name="profileData.nickName"
      :message="profileData.selfIntroduction"
      :age="calculateAge(profileData.birthDate)"
      :job="profileData.job"
      :mbti="profileData.mbti"
      :location="`${profileData.occupiedAreaHigh}, ${profileData.occupiedAreaLow}`"
      :school="profileData.school"
      :image-url="photos[0].image_path"
    />
    <Gap :height="20" />
    <Questions :data="profileData.descriptions.map((line: any) => {
        return {
          question: line.title,
          answer: line.answer
        }
      })"/>
    <Gap :height="40" />
  </div>
</template>

<style scoped>
.page {
  padding: 16px;
}
</style>
