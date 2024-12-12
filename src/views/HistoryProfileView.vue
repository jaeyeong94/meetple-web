<script setup lang="ts">
import PhoneNumberCopy from '@/components/PhoneNumberCopy.vue'
import SubHeader from '@/components/SubHeader.vue'
import http from '@/lib/http'
import UserProfileInfo from '@/components/UserProfileInfo.vue'
import Questions from '@/components/Questions.vue'
import MatchingStatus from '@/components/MatchingStatus.vue'
import Gap from '@/components/Gap.vue'
import StickyArea from '@/components/StickyArea.vue'
import type MixpanelService from '@/lib/mixpanel'
import { calculateAge, formatPhoneNumber } from '@/lib/utils'
import router from '@/router'
import { useRoute } from 'vue-router'
import { useModalStore } from '@/stores/modal'
import { inject, onMounted, reactive, ref, type Ref, toRaw } from 'vue'

const route = useRoute();

const mp = inject<MixpanelService>('mixpanel')
const account: any = reactive({});
const match: any = reactive({});
const hitProfile: any = reactive({});
const notification: any = reactive([]);

const photos: Ref<any> = ref([]);
const jobs: Ref<any> = ref([]);

const tabIndex: Ref<number> = ref(0);

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
  })

  // 매치 프로필 확인
  const matchId = route.params.id;
  const findMatchProfile = match.data.hit.find((match: any) => {
    return match.id === Number(matchId);
  });

  Object.assign(hitProfile, findMatchProfile);

  if(!Object.keys(hitProfile).length) {
    await router.push('/history')
  }
})

const actionRemove = async (nickname: string) => {
  useModalStore().setModal({
    type: 'delete-partner',
    data: {
      name: nickname,
      onClickCancel: () => {
        useModalStore().setModal({ type: null })
      },
      onClickSubmit: async () => {
        const response = await http.post(`/match/hit/remove`, {
          hitId: hitProfile.id
        });
        useModalStore().setModal({ type: null })
        if(response.data.message === 'success') {
          await router.push('/history')
        }
      }
    }
  })
}

const actionBlock = async (nickname: string) => {
  useModalStore().setModal({
    type: 'block-partner',
    data: {
      name: nickname,
      onClickCancel: () => {
        useModalStore().setModal({ type: null })
      },
      onClickSubmit: async () => {
        const response = await http.post(`/match/hit/block`, {
          hitId: hitProfile.id
        });
        useModalStore().setModal({ type: null })
        if(response.data.message === 'success') {
          await router.push('/history')
        }
      }
    }
  })
}

</script>

<template>
  <StickyArea position="top" :style="{ backgroundColor: '#fff'}">
    <SubHeader title="" :more-button-data="[
      {
        title: '삭제하기',
        onClick: () => actionRemove(hitProfile.account?.accountMeta.nick_name)
      },
      {
        title: '차단하기',
        warning: true,
        onClick: () => actionBlock(hitProfile.account?.accountMeta.nick_name)
      }
]" :show-back-button="true" @back="() => {
  router.back();
}" />
  </StickyArea>
  <div class="page">
    <div v-if="match.data?.hit.length > 0">
      <div v-if="hitProfile.hit_answer">
        <MatchingStatus status="matched" />
        <Gap :height="20" />
      </div>

      <UserProfileInfo
        :name="hitProfile.account?.accountMeta.nick_name"
        :message="hitProfile.account?.accountMeta.self_introduction"
        :age="calculateAge(hitProfile.account?.birth_date)"
        :job="hitProfile.account?.accountMeta.job"
        :mbti="hitProfile.account?.accountMeta.mbti"
        :location="`${hitProfile.account?.accountMeta.occupied_area_high} ${hitProfile.account?.accountMeta.occupied_area_low}`"
        :school="hitProfile.account?.accountMeta.school"
        :image-url="hitProfile.account?.accountProfiles[0]?.image_path"
      />
      <Gap :height="20" />
      <Questions :data="hitProfile.account?.accountMeta.descriptions.map((line: any) => {
          return {
            question: line.title,
            answer: line.answer
          }
        })"/>
      <Gap :height="120" />

      <div :style="{
          position: 'fixed',
          left: '0',
          bottom: '16px',
          width: 'calc(100%)',
          display: 'flex', justifyContent: 'center', paddingBottom: '16px'
        }">
        <PhoneNumberCopy :phone-number="hitProfile.account?.phone_number" @copy="() => {
          mp?.trackEvent('click_copy_phone_number', { type: 'history', data: hitProfile })
        }" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  padding: 16px;
}
</style>
