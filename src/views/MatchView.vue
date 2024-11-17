<script setup lang="ts">
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
    await router.push('/register/auto')
  }

  account.data.accountProfiles.forEach((profile: any) => {
    if(profile.type === 'photo') {
      photos.value.push(profile)
    } else if(profile.type === 'job') {
      jobs.value.push(profile)
    }
  })
})

const answerAcceptAction = (matchId: number, nickname: string, hit_answer: boolean, hit_account: any) => {
  const action = async () => {
    http.post('/match/answer', {
      matchId,
      attitude: true
    })
      .then(async (data: any) => {
        await accountUpdate();
        return router.push('/match');
      })
      .catch((error: any) => {
        useModalStore().setModal({
          type: 'alert',
          data: {
            title: error.response.data.title,
            message: error.response.data.message,
            onClickClose: () => {
              if(error.response.data.title === '캔디가 부족해요!') {
                router.push('/point')
              }
            }
          }
        })
        console.log(error, 'error')
      })
  }

  if(hit_answer) {
    useModalStore().setModal({
      type: 'request-accept-match',
      data: {
        name: nickname,
        onClickCancel: () => {
          useModalStore().setModal({ type: null })
        },
        onClickSubmit: async () => {
          await accountUpdate();

          if(account.data.currency < 30) {
            useModalStore().setModal({ type: null })
            return router.push('/point')
          }

          await action()

          useModalStore().setModal({
            type: 'matched',
            data: {
              name: nickname,
              partnerProfileImageUrl: hit_account.accountProfiles[0]?.image_path,
              myProfileImageUrl: photos.value[0]?.image_path,
              onClickSubmit: () => {
                useModalStore().setModal({ type: null })
                router.push(`/history/profile/${match.data.hit[0].id}`);
              }
            }
          })
        }
      }
    })
  } else {
    useModalStore().setModal({
      type: 'request-accept-match',
      data: {
        name: nickname,
        onClickCancel: () => {
          useModalStore().setModal({ type: null })
        },
        onClickSubmit: () => {
          if(account.data.currency < 30) {
            useModalStore().setModal({ type: null })
            return router.push('/point')
          }

          action()

          useModalStore().setModal({ type: null })
        }
      }
    })
  }
}

const answerRejectAction = (matchId: number, nickname: string) => {
  const action = async () => {
    http.post('/match/answer', {
      matchId,
      attitude: false
    })
      .then(async (data: any) => {
        const response = data.data;
        await accountUpdate()
        return router.push('/match');
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

  useModalStore().setModal({
    type: 'reject-match',
    data: {
      name: nickname,
      onClickCancel: () => {
        useModalStore().setModal({ type: null })
      },
      onClickSubmit: () => {
        action()
        useModalStore().setModal({ type: null })
      }
    }
  })
}

const multipleProfileMove = (id: string) => {
  router.push(`/match/profile/${id}`);
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
    <div v-if="match.data?.recommended.length === 1">
      <div v-for="matchProfile in match.data.recommended">
        <div v-if="matchProfile.hit_answer">
          <MatchingStatus status="matched" />
          <Gap :height="20" />
        </div>

        <UserProfileInfo
          :name="matchProfile.hit_account.accountMeta.nick_name"
          :message="matchProfile.hit_account.accountMeta.self_introduction"
          :age="calculateAge(matchProfile.hit_account.birth_date)"
          :job="matchProfile.hit_account.accountMeta.job"
          :mbti="matchProfile.hit_account.accountMeta.mbti"
          :location="`${matchProfile.hit_account.accountMeta.occupied_area_high} ${matchProfile.hit_account.accountMeta.occupied_area_low}`"
          :school="matchProfile.hit_account.accountMeta.school"
          :image-url="matchProfile.hit_account.accountProfiles[0]?.image_path"
        />
        <Gap :height="20" />
        <Questions :data="matchProfile.hit_account.accountMeta.descriptions.map((line: any) => {
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
          <MatchingStatus v-if="matchProfile.my_answer" status="waiting" style="padding: 6px 20px;" />
          <ProfileActions v-else @close="() => {
            answerRejectAction(matchProfile.id, matchProfile.hit_account.accountMeta.nick_name)
            mp?.trackEvent('click_reject', { type: 'match', data: matchProfile })
          }" @heart="() => {
            answerAcceptAction(matchProfile.id, matchProfile.hit_account.accountMeta.nick_name, matchProfile.hit_answer, matchProfile.hit_account)
            mp?.trackEvent('click_accept', { type: 'match', data: matchProfile })
          }" />
        </div>
      </div>
    </div>

    <div v-else-if="match.data?.recommended.length >= 2">
      <div v-for="matchProfile in match.data.recommended">
        <PartnerProfileInfo @click="() => {
          multipleProfileMove(matchProfile.id)
          mp?.trackEvent('click_profile', { type: 'match', data: matchProfile })
        }"
                            :name="matchProfile.hit_account.accountMeta.nick_name"
                            :message="ellipsis(matchProfile.hit_account.accountMeta.self_introduction, 50)"
                            :age="calculateAge(matchProfile.hit_account.birth_date)"
                            :job="matchProfile.hit_account.accountMeta.job"
                            :mbti="matchProfile.hit_account.accountMeta.mbti"
                            :location="`${matchProfile.hit_account.accountMeta.occupied_area_high} ${matchProfile.hit_account.accountMeta.occupied_area_low}`"
                            :school="matchProfile.hit_account.accountMeta.school"
                            :image-url="matchProfile.hit_account.accountProfiles[0]?.image_path" />
        <Gap :height="20" />
      </div>
    </div>

    <div v-else>
      <Empty v-if="match.data" title="추천 매칭 준비중" description="추천될 매칭이 준비중에 있어요!<br>매칭이 도착하면 알려드릴께요." style="position:absolute; top: 50%; left: 0; margin-top: -134px; width: 100%; padding: 0;" />
    </div>
  </div>
</template>

<style scoped>
.page {
  padding: 16px;
}
</style>
