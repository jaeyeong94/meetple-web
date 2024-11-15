<script setup lang="ts">
import SubHeader from '@/components/SubHeader.vue'
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
import { calculateAge } from '@/lib/utils'
import router from '@/router'
import { useRoute } from 'vue-router'
import { useModalStore } from '@/stores/modal'
import { onMounted, reactive, ref, type Ref, toRaw } from 'vue'

const route = useRoute();

const account: any = reactive({});
const match: any = reactive({});
const matchProfile: any = reactive({});
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
  const findMatchProfile = match.data.recommended.find((match: any) => {
    return match.id === Number(matchId);
  });

  Object.assign(matchProfile, findMatchProfile);

  if(!Object.keys(matchProfile).length) {
    await router.push('/match')
  }
})

const answerAcceptAction = (matchId: number, nickname: string, hit_answer: boolean, hit_account: any) => {
  // 프로필, 상점, 히스토리
  // 캔디부족

  const action = async () => {
    http.post('/match/answer', {
      matchId,
      attitude: true
    })
      .then((data: any) => {
        const response = data.data;
        accountUpdate()
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

  if(hit_answer) {
    useModalStore().setModal({
      type: 'request-accept-match',
      data: {
        name: nickname,
        onClickCancel: () => {
          useModalStore().setModal({ type: null })
        },
        onClickSubmit: () => {
          action()
          useModalStore().setModal({
            type: 'matched',
            data: {
              name: nickname,
              partnerProfileImageUrl: hit_account.accountProfiles[0]?.image_path,
              myProfileImageUrl: photos.value[photos.value.length - 1]?.image_path,
              onClickClose: () => {
                useModalStore().setModal({ type: null })
                // router.push('/chat')
              }
            }
          })
        }
      }
    })
  } else {
    useModalStore().setModal({
      type: 'request-match',
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
}

const answerRejectAction = (matchId: number, nickname: string) => {
  const action = async () => {
    http.post('/match/answer', {
      matchId,
      attitude: false
    })
      .then((data: any) => {
        const response = data.data;
        accountUpdate()
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

</script>

<template>
  <StickyArea position="top" :style="{ backgroundColor: '#fff'}">
    <SubHeader title="" :show-back-button="true" @back="() => {
  router.back();
}" />
  </StickyArea>
  <div class="page">
    <div v-if="match.data?.recommended.length > 0">
      <div v-if="matchProfile.hit_answer">
        <MatchingStatus status="matched" />
        <Gap :height="20" />
      </div>

      <UserProfileInfo
        :name="matchProfile.hit_account?.accountMeta.nick_name"
        :message="matchProfile.hit_account?.accountMeta.self_introduction"
        :age="calculateAge(matchProfile.hit_account?.birth_date)"
        :job="matchProfile.hit_account?.accountMeta.job"
        :mbti="matchProfile.hit_account?.accountMeta.mbti"
        :location="`${matchProfile.hit_account?.accountMeta.occupied_area_high}, ${matchProfile.hit_account?.accountMeta.occupied_area_low}`"
        :school="matchProfile.hit_account?.school || '미입력'"
        :image-url="matchProfile.hit_account?.accountProfiles[0]?.image_path"
      />
      <Gap :height="20" />
      <Questions :data="matchProfile.hit_account?.accountMeta.descriptions.map((line: any) => {
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
        <ProfileActions v-else @close="answerRejectAction(matchProfile.id, matchProfile.hit_account.accountMeta.nick_name)" @heart="answerAcceptAction(matchProfile.id, matchProfile.hit_account.accountMeta.nick_name, matchProfile.hit_answer, matchProfile.hit_account)" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  padding: 16px;
}
</style>
