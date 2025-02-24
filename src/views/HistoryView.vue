<script setup lang="ts">
import ReferralBanner from '@/components/ReferralBanner.vue'
import http from '@/lib/http'
import Tabs from '@/components/Tabs.vue'
import UserProfileInfo from '@/components/UserProfileInfo.vue'
import Questions from '@/components/Questions.vue'
import Empty from '@/components/Empty.vue'
import MatchingStatus from '@/components/MatchingStatus.vue'
import ProfileActions from '@/components/ProfileActions.vue'
import PartnerProfileInfo from '@/components/PartnerProfileInfo.vue'
import Gap from '@/components/Gap.vue'
import StickyArea from '@/components/StickyArea.vue'
import MainHeader from '@/components/MainHeader.vue'
import { TEST_PROFILE_URL, TEST_TABS } from '@/consts/testData'
import type MixpanelService from '@/lib/mixpanel'
import { calculateAge, ellipsis } from '@/lib/utils'
import router from '@/router'
import { useModalStore } from '@/stores/modal'
import { inject, onMounted, reactive, ref, type Ref, toRaw } from 'vue'

const mp = inject<MixpanelService>('mixpanel')
const account: any = reactive({});
const match: any = reactive({});
const notification: any = reactive([]);

const photos: Ref<any> = ref([]);
const jobs: Ref<any> = ref([]);

const tabIndex: Ref<number> = ref(1);

const accountUpdate = async () => {
  const accountResponse = await http.get('/account');
  const matchResponse = await http.get('/match');
  Object.assign(account, accountResponse.data);
  Object.assign(match, matchResponse.data);
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
  });
})

const multipleProfileMove = (id: string) => {
  router.push(`/history/profile/${id}`);
}

</script>

<template>
  <StickyArea position="top" :style="{ backgroundColor: '#fff'}">
    <MainHeader :image-url="photos[0]?.image_path" @notification="() => {
      router.push('/notification')
    }" @profile="() => {
      router.push('/profile')
    }" />
    <Tabs :tabs="TEST_TABS" :current-index="tabIndex" />
  </StickyArea>
  <div class="page">
    <div v-if="match.data?.hit.length >= 1">
      <div v-for="hitProfile in match.data.hit">
        <PartnerProfileInfo @click="() => {
          multipleProfileMove(hitProfile.id)
          mp?.trackEvent('click_profile', { type: 'history', data: hitProfile })
        }"
                            :name="hitProfile.account?.accountMeta.nick_name"
                            :message="ellipsis(hitProfile.account?.accountMeta.self_introduction ?? '', 50)"
                            :age="calculateAge(hitProfile.account?.birth_date)"
                            :job="hitProfile.account?.accountMeta.job"
                            :mbti="hitProfile.account?.accountMeta.mbti"
                            :location="`${hitProfile.account?.accountMeta.occupied_area_high} ${hitProfile.account?.accountMeta.occupied_area_low}`"
                            :school="hitProfile.account?.accountMeta.school"
        />
        <Gap :height="20" />
      </div>
      <ReferralBanner />
    </div>
    <div v-else>
      <Empty v-if="match.data" title="매칭 이력이 없어요" description="추천 매칭을 통해<br>새로운 분들을 만나보세요." style="position:absolute; top: 50%; left: 0; margin-top: -134px; width: 100%; padding: 0;" />
      <ReferralBanner />
    </div>
  </div>
</template>

<style scoped>
.page {
  padding: 16px 16px 128px 16px;
}
</style>
