<script setup lang="ts">
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

const user = {
  name: '일론',
  message: '쏘맥 고?',
  age: 26,
  job: '테슬라 CEO',
  mbti: 'ENTJ',
  location: '서울특별시',
  school: '한양대학교',
  profile_image_url: 'https://futureoflife.org/wp-content/uploads/2020/08/elon_musk_royal_society.jpg'
}

const questions = [
  {
    question: '좋아하는 음식은 무엇인가요?',
    answer: '피자'
  },
  {
    question: '좋아하는 취미는 무엇인가요?',
    answer: '로켓 만들기'
  },
  {
    question: '좋아하는 동물은 무엇인가요?',
    answer: '개'
  }
]
</script>

<template>
  <StickyArea position="top" :style="{ backgroundColor: '#fff'}">
    <MainHeader :image-url="TEST_PROFILE_URL" @notification="() => {}" @profile="() => {}" />
    <Tabs :tabs="TEST_TABS" :current-index="1" />
  </StickyArea>
  <div class="page">
    <MatchingStatus status="waiting" />
    <Gap :height="20" />
    <MatchingStatus status="matched" />
    <Gap :height="20" />
    <UserProfileInfo
      :name="user.name"
      :message="user.message"
      :age="user.age"
      :job="user.job"
      :mbti="user.mbti"
      :location="user.location"
      :school="user.school"
      :image-url="user.profile_image_url"
    />
    <Gap :height="20" />
    <Questions :data="questions"/>
    <Gap :height="20" />
    <Empty title="추천 매칭 준비중" description="추천될 매칭이 준비중에 있어요! 매칭이 도착하면 알려드릴께요." />
    <Gap :height="20" />
    <PartnerProfileInfo :name="user.name"
                        :message="user.message"
                        :age="user.age"
                        :job="user.job"
                        :mbti="user.mbti"
                        :location="user.location"
                        :school="user.school"
                        :image-url="user.profile_image_url" />
  </div>
  <StickyArea position="bottom" :style="{ display: 'flex', justifyContent: 'center', paddingBottom: '16px' }">
    <ProfileActions @close="() => {}" @heart="() => {}" />
  </StickyArea>
</template>

<style scoped>
.page {
  padding: 16px;
}
</style>
