<script setup lang="ts">
import DeepSelect from '@/components/forms/DeepSelect.vue'
import Gap from '@/components/Gap.vue'
import ProfileImage from '@/components/forms/ProfileImage.vue'
import StickyArea from '@/components/StickyArea.vue'
import SubHeader from '@/components/SubHeader.vue'
import TextInput from '@/components/forms/TextInput.vue'
import TextArea from '@/components/forms/TextArea.vue'
import Select from '@/components/forms/Select.vue'
import LinkButton from '@/components/forms/LinkButton.vue'
import Image from '@/components/forms/Image.vue'
import PageTitleAndDescription from '@/components/PageTitleAndDescription.vue'
import SubmitButton from '@/components/SubmitButton.vue'
import { TEST_SELECT_OPTIONS, TEST_DEEP_SELECT_OPTIONS } from '@/consts/testData'
import http from '@/lib/http'
import router from '@/router'
import { onMounted, type Reactive, reactive, type Ref, ref, toRaw } from 'vue'
import { useModalStore } from '@/stores/modal'

const profileData: Reactive<{
  [key: string]: any
}> = reactive({});

const account: any = reactive({});
const photos: Ref<any> = ref([]);
const jobs: Ref<any> = ref([]);

const state: Reactive<{
  stage: 'profile' | 'job'
}> = reactive({
  stage: 'profile'
});

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

function base64ToBlob(base64: string, mimeType = 'application/octet-stream') {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}

const ProfileUploader = (base64: string, file: any) => {
  const base64Data = base64.split(',')[1];
  const mimeType = 'text/plain';
  const blob = base64ToBlob(base64Data, mimeType);
  const formData = new FormData();
  formData.append('file', blob, file.name);
  formData.append('type', 'photo');
  http.upload('/account/profile/upload', formData)
    .then((data: any) => {
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

const UpdateAndPreview = () => {
  http.post('/account/profile/update', {
    stage: 'answer',
    data: toRaw(profileData)
  })
    .then(async (data: any) => {
      if (state.stage === 'job') {
        state.stage = 'profile';
        return;
      }
      await router.push('/profile-preview')
    })
    .catch((error: any) => {
      console.log(error)
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

const question1 = '미팅에 함께 나가는 나와 내 친구들은 어떤 사람인가요?';
const question2 = '어떤 미팅을 하고 싶으신가요?';

</script>

<template>
  <StickyArea position="top" :style="{ backgroundColor: '#fff'}">
    <SubHeader title="프로필 수정" :action-button-data="{
      title: '미리보기',
      onClick: () => UpdateAndPreview()
    }" :show-back-button="true" @back="() => {
      router.back();
    }"
    v-if="state.stage === 'profile'"
    />
    <SubHeader :show-back-button="true" @back="() => {
      state.stage = 'profile'
    }"
    v-else
    />
  </StickyArea>

  <div class="page" v-if="Object.keys(profileData).length > 0 && state.stage === 'profile'">
    <ProfileImage label="프로필 이미지" :required="true" :image-url="photos[photos.length - 1]?.image_path" @change="ProfileUploader" @error="(message: string) => {
      useModalStore().setModal({
        type: 'alert',
        data: {
          title: '이미지 업로드 실패',
          message
        }
      })
    }" />
    <Gap :height="20" />
    <TextInput label="닉네임" placeholder="이름을 입력하세요" :required="true" @input="(val: string) => { profileData.nickName = val}" :value="profileData.nickName" />
    <Gap :height="20" />
    <LinkButton :title="profileData.job" label="직장 및 직무" :required="true" @click="() => { state.stage = 'job' }" />
    <Gap :height="20" />
    <Select label="MBTI" :required="true" @change="(val: string) => profileData.mbti = val" :value="profileData.mbti" :options="TEST_SELECT_OPTIONS" :modal-option-cols="4" />
    <Gap :height="20" />
    <DeepSelect label="거주지역" placeholder="거주지역을 선택해주세요." modalTitle="거주지역을 선택해주세요." :required="true" @change="(val: string, val2: string) => {
        profileData.occupiedAreaHigh = val
        profileData.occupiedAreaLow = val2
      }" :value="profileData.occupiedAreaLow" :view-value="`${profileData.occupiedAreaHigh} ${profileData.occupiedAreaLow}`" :options="TEST_DEEP_SELECT_OPTIONS" :modal-option-cols="4" />
    <Gap :height="20" />
    <TextInput label="학교명" @input="(val: string) => { profileData.school = val}" :value="profileData.school" />
    <Gap :height="20" />
    <TextArea label="자개소개" :max-length="120" :required="true" @input="(val: string) => profileData.selfIntroduction = val" :value="profileData.selfIntroduction" />
    <Gap :height="20" />

    <TextArea :question="question1" @input="(val: string) => {
          profileData.descriptions[0].title = question1;
          profileData.descriptions[0].answer = val;
        }" :num-lines="6" :max-length="500" :value="profileData.descriptions[0].answer" :requiredMessageVisible="false" placeholder="답변을 입력해주세요." />
    <Gap :height="20" />

    <TextArea :question="question2" @input="(val: string) => {
          profileData.descriptions[1].title = question2;
          profileData.descriptions[1].answer = val;
        }" :num-lines="6" :max-length="500" :value="profileData.descriptions[1].answer" requiredMessage="(분위기, 인원수 등)" :requiredMessageVisible="true" placeholder="답변을 입력해주세요." />
    <Gap :height="40" />
  </div>

  <div class="page" v-if="Object.keys(profileData).length > 0 && state.stage === 'job'">
    <PageTitleAndDescription title="프로필에 등록될<br>직장 및 직무를 인증해주세요." description="Meetple은 인증 기반의 서비스입니다.<br>공개 가능한 선에서 구체적으로 직장 및 직무를 입력한 후,<br>이를 인증할 수 있는 이미지를 제출해주세요." />
    <Gap :height="40" />

    <TextInput label="직장 및 직무" placeholder="최대한 구체적으로 작성해주세요." :required="true" :validate="(val: string) => {
          if (val && val.length >= 50) {
            return '50자 이내로 입력해주세요.';
          }

          return null;
        }" @input="(val: string, validateValue: any) => {
          profileData.job = val;
          if (validateValue === null && val.length > 0) {
            profileData.job = val;
          } else {
            profileData.job = '';
          }
        }" :value="profileData.job" />
    <Gap :height="20" />

    <Image label="증빙 이미지 등록" :required="true" :image-url="jobs[jobs.length - 1]?.image_path" @change="JobUploader" description="증빙 이미지를 업로드해요" @error="(message: string) => {
          useModalStore().setModal({
            type: 'alert',
            data: {
              title: '이미지 업로드 실패',
              message
            }
          })
        }" />
    <Gap :height="40" />
  </div>

  <StickyArea position="bottom" :style="{ padding: '14px 16px' }" v-if="state.stage === 'job'">
    <SubmitButton @click="() => UpdateAndPreview()" :disabled="!profileData.job" :style="{
          backgroundColor: '#6726FE',
        }">인증 신청하기</SubmitButton>
  </StickyArea>
</template>

<style scoped>
.page {
  padding: 16px;
}
</style>
