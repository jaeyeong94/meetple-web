<script setup lang="ts">
import AlertBanner from '@/components/AlertBanner.vue'
import ButtonWithDetail from '@/components/buttons/ButtonWithDetail.vue'
import DeepSelect from '@/components/forms/DeepSelect.vue'
import Gap from '@/components/Gap.vue'
import MyProfile from '@/components/MyProfile.vue'
import StickyArea from '@/components/StickyArea.vue'
import SubHeader from '@/components/SubHeader.vue'
import TextInput from '@/components/forms/TextInput.vue'
import TextArea from '@/components/forms/TextArea.vue'
import Select from '@/components/forms/Select.vue'
import ProgressBar from '@/components/ProgressBar.vue'
import RadioButtonTabs from '@/components/forms/RadioButtonTabs.vue'
import LinkButton from '@/components/forms/LinkButton.vue'
import { TEST_ACTION_DATA, TEST_SELECT_OPTIONS, TEST_RADIO_OPTIONS, TEST_DEEP_SELECT_OPTIONS } from '@/consts/testData'
import http from '@/lib/http'
import router from '@/router'
import { onMounted, type Reactive, reactive, type Ref, ref } from 'vue'
import { validateDate } from '@/lib/utils'

const state: 'edit' | 'preview' | 'job' = 'edit';
const profileData: Reactive<{
  [key: string]: any
}> = reactive({});

const name = ref('')
const school = ref('')
const introduction = ref('')
const mbti = ref('ESTJ')
const gender = ref('male')
const birthdate = ref('')

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
    <SubHeader title="프로필 수정" :action-button-data="{
      title: '미리보기',
      onClick: () => {}
    }" :show-back-button="true" @back="() => {
      router.back();
    }" />
  </StickyArea>
  <div class="page" v-if="Object.keys(profileData).length > 0">
    <MyProfile style="align-items: start;" :image-url="photos[photos.length - 1]?.image_path" @change="() => {}" />
    <Gap :height="20" />
    <TextInput label="닉네임" placeholder="이름을 입력하세요" :required="true" @input="(val: string) => { name = val}" :value="profileData.nickName" />
    <Gap :height="20" />
    <LinkButton :title="profileData.job" label="직장 및 직무" :required="true" @click="() => {}" />
    <Gap :height="20" />
    <Select label="MBTI" :required="true" @change="(val: string) => mbti = val" :value="profileData.mbti" :options="TEST_SELECT_OPTIONS" :modal-option-cols="4" />
    <Gap :height="20" />
    <DeepSelect label="거주지역" placeholder="거주지역을 선택해주세요." modalTitle="거주지역을 선택해주세요." :required="true" @change="(val: string, val2: string) => {

      }" :value="profileData.occupiedAreaLow" :options="TEST_DEEP_SELECT_OPTIONS" :modal-option-cols="4" />
    <Gap :height="20" />
    <TextInput label="학교명" @input="(val: string) => { school = val}" :value="profileData.school" />
    <Gap :height="20" />
    <TextArea label="자개소개" :required="true" @input="(val: string) => introduction = val" :value="profileData.selfIntroduction" />
    <Gap :height="20" />

<!--    <TextArea :question="question1" @input="(val: string) => {-->
<!--        profileData.descriptions[0].title = question1;-->
<!--        profileData.descriptions[0].answer = val;-->
<!--      }" :num-lines="6" :max-length="500" :value="profileData.descriptions[0].answer" :requiredMessageVisible="false" placeholder="답변을 입력해주세요." />-->
<!--    <Gap :height="20" />-->

<!--    <TextArea :question="question2" @input="(val: string) => {-->
<!--        profileData.descriptions[1].title = question2;-->
<!--        profileData.descriptions[1].answer = val;-->
<!--      }" :num-lines="6" :max-length="500" :value="profileData.descriptions[1].answer" requiredMessage="(분위기, 인원수 등)" :requiredMessageVisible="true" placeholder="답변을 입력해주세요." />-->
<!--    <Gap :height="20" />-->

<!--    <AlertBanner title="카카오톡 오픈 프로필을 등록해주세요." description="링크된 상대방과 대화할 수 있습니다." />-->

  </div>
</template>

<style scoped>
.page {
  padding: 16px;
}
</style>
