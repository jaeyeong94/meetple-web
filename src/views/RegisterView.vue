<script setup lang="ts">
import Button from '@/components/Button.vue'
import Empty from '@/components/Empty.vue'
import DeepSelect from '@/components/forms/DeepSelect.vue'
import Image from '@/components/forms/Image.vue'
import RadioButtonTabs from '@/components/forms/RadioButtonTabs.vue'
import Select from '@/components/forms/Select.vue'
import TextArea from '@/components/forms/TextArea.vue'
import TextInput from '@/components/forms/TextInput.vue'
import Gap from '@/components/Gap.vue'
import ProgressBar from '@/components/ProgressBar.vue'
import Questions from '@/components/Questions.vue'
import StickyArea from '@/components/StickyArea.vue'
import SubHeader from '@/components/SubHeader.vue'
import PageTitleAndDescription from '@/components/PageTitleAndDescription.vue'
import Checkbox from '@/components/forms/Checkbox.vue'
import Divider from '@/components/Divider.vue'
import SubmitButton from '@/components/SubmitButton.vue'
import UserProfileInfo from '@/components/UserProfileInfo.vue'
import ProfileImage from '@/components/forms/ProfileImage.vue'
import { TEST_DEEP_SELECT_OPTIONS, TEST_RADIO_OPTIONS, TEST_SELECT_OPTIONS, QUESTION1, QUESTION2 } from '@/consts/testData'
import http from '@/lib/http'
import { calculateAge, validateDate } from '@/lib/utils'
import router from '@/router'
import { useRoute } from 'vue-router'
import { useModalStore } from '@/stores/modal'
import { onMounted, type Reactive, reactive, type Ref, ref, toRaw, watch, inject } from 'vue'

// 라우터 제한
const route = useRoute();
const routerLimit = ['auto', 'default', 'normal', 'job', 'school', 'answer', 'request', 'reject'];
const routeFlow = ['default', 'normal', 'job', 'school', 'answer'];

if(!routerLimit.includes(route.params.stage as string)) {
  router.push('/');
}

const currentStage = ref('')
const progress = ref(0)
const processing = ref(false)
const profileData: Reactive<{
  [key: string]: any
}> = reactive({})

// 기본정보
const defaultData = reactive({
  name: '',
  birthDate: '',
  gender: '',
})

// 텍스트 에어리어
const textArea: Reactive<{
  [key: string]: any
}> = reactive({
  selfIntroduction: '',
  description1Answer: '',
  description2Answer: ''
});

const termsRequired = ref( false);
const photoRequired: Ref<any> = ref(false);
const jobRequired: Ref<any> = ref(false);
const photos: Ref<any> = ref([]);
const jobs: Ref<any> = ref([]);
const root = inject<HTMLElement>('rootDiv');

// 질문
const question1 = QUESTION1;
const question2 = QUESTION2;

// 서버정보
const account: any = reactive({})

const accountUpdateDefault = async () => {
  const response = await http.get('/account')
  Object.assign(account, response.data)

  account.data.accountProfiles.forEach((profile: any) => {
    if(profile.type === 'photo') {
      photos.value.push(profile)
    } else if(profile.type === 'job') {
      jobs.value.push(profile)
    }
  })
}

const accountDataUpdate = async () => {
  const response = await http.get('/account')
  Object.assign(account, response.data)

  if(!account.data) {
    localStorage.removeItem('token')
    return router.push('/login')
  }

  if(account.data.accountMeta.stage === 'approve') {
    return router.push('/match')
  }

  if(route.params.stage === 'auto') {
    return router.push(`/register/${account.data.accountMeta.stage}`)
  }

  if(account.data.accountMeta.stage !== 'request' && account.data.accountMeta.stage !== 'reject') {
    if(['default', 'normal', 'job', 'school', 'answer', 'request', 'reject'].includes(route.params.stage as string)) {
      account.data.accountMeta.stage = route.params.stage as string;
    }
  }

  currentStage.value = account.data.accountMeta.stage

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
  profileData.descriptions[0] = profileData.descriptions[0] ?? { title: question1, answer: '' }
  profileData.descriptions[1] = profileData.descriptions[1] ?? { title: question2, answer: '' }

  account.data.accountProfiles.forEach((profile: any) => {
    if(profile.type === 'photo') {
      photos.value.push(profile)
      photoRequired.value = true
    } else if(profile.type === 'job') {
      jobs.value.push(profile)
      jobRequired.value = true
    }
  })

  // 이용약관 상태 저장
  if(profileData.termsRequired) {
    termsRequired.value = true;
  }

  if(localStorage.getItem('terms')) {
    termsRequired.value = true;
  }

  profileData.termsRequired = true;
  profileData.termsOptional = true;

  // 기본정보
  defaultData.name = account.data.name;
  defaultData.birthDate = account.data.birth_date?.replaceAll('-', '');
  defaultData.gender = account.data.gender;

  // 텍스트 에어리어
  textArea.selfIntroduction = account.data?.accountMeta.self_introduction;
  textArea.description1Answer = profileData.descriptions[0].answer;
  textArea.description2Answer = profileData.descriptions[1].answer;
}

const progressUpdate = async () => {
  if(account.data.accountMeta.stage === 'default') {
    progress.value = 0
  } else if(account.data.accountMeta.stage === 'normal') {
    progress.value = 35
  } else if(account.data.accountMeta.stage === 'job') {
    progress.value = 65
  } else if(account.data.accountMeta.stage === 'school') {
    progress.value = 80
  } else if(account.data.accountMeta.stage === 'answer') {
    progress.value = 100
  } else if(account.data.accountMeta.stage === 'request') {
    progress.value = 0
    processing.value = true
  }
}

onMounted(async () => {
  await accountDataUpdate();
  await progressUpdate();
})

watch(() => router.currentRoute.value.params.stage, async (val) => {
  await accountDataUpdate();
  await progressUpdate();
})

// 이용약관
const agreement = reactive([true, true, true]);
watch(agreement, (val) => {
  profileData.termsRequired = !!(val[0] && val[1]);
  profileData.termsOptional = !!val[2];
})
const termsAccept = () => {
  termsRequired.value = true;
  localStorage.setItem('terms', 'true');
}

function base64ToBlob(base64: string, mimeType = 'application/octet-stream') {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}

const ProfileUploaderLoading = ref(false);
const ProfileUploader = (base64: string, file: any) => {
  const base64Data = base64.split(',')[1];
  const mimeType = 'text/plain';
  const blob = base64ToBlob(base64Data, mimeType);
  const formData = new FormData();
  formData.append('file', blob, file.name);
  formData.append('type', 'photo');

  ProfileUploaderLoading.value = true;
  http.upload('/account/profile/upload', formData)
    .then(async (data: any) => {
      photoRequired.value = true;
      ProfileUpdateAction('normal', false, true);
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
    .finally(() => {
      ProfileUploaderLoading.value = false;
    })
}

const JobUploaderLoading = ref(false);
const JobUploader = (base64: string, file: any) => {
  const base64Data = base64.split(',')[1];
  const mimeType = 'text/plain';
  const blob = base64ToBlob(base64Data, mimeType);
  const formData = new FormData();
  formData.append('file', blob, file.name);
  formData.append('type', 'job');

  JobUploaderLoading.value = true;
  http.upload('/account/profile/upload', formData)
    .then(async (data: any) => {
      jobRequired.value = true;
      ProfileUpdateAction('job', false, true);
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
    .finally(() => {
      JobUploaderLoading.value = false;
    })
}

const ProfileUpdateAction = (stage: string, next: boolean = true, hold: boolean = false) => {
  let nextFlow;
  if(hold) {
    nextFlow = routeFlow[routeFlow.indexOf(currentStage.value)];
  } else {
    if(next) {
      nextFlow = routeFlow[routeFlow.indexOf(currentStage.value) + 1];
    } else {
      nextFlow = routeFlow[routeFlow.indexOf(currentStage.value) - 1];
    }
  }

  http.post('/account/profile/update', {
    stage,
    data: toRaw(profileData)
  })
    .then(async (data: any) => {
      if(nextFlow) {
        await router.push(`/register/${nextFlow}`)
      } else {
        await router.push('/register/auto');
      }

      await accountDataUpdate()
      await progressUpdate()
      window.scrollTo(0, 0);
      root!.scrollTo(0, 0);
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
</script>

<template>
  <div class="page">
    <div v-if="account.data?.accountMeta.stage === 'default' && !termsRequired">
      <StickyArea position="top" :style="{ backgroundColor: '#fff'}">
        <ProgressBar class="progress-bar" :progress="progress" :processing="processing" style="z-index:1000;" />
        <SubHeader />
      </StickyArea>
      <div class="content-container">
        <PageTitleAndDescription title="<img src='/meetple-mini-logo.png' style='width:110px; vertical-align: bottom;' /> 의 서비스<br>이용약관에 동의해주세요." description="" />
        <Gap :height="40" />
        <Checkbox :main="true" name="all" title="전체 동의 하기 (선택 정보 포함)" @change="(b) => {
      if(b) {
        agreement[0] = true
        agreement[1] = true
        agreement[2] = true
      } else {
        agreement[0] = false
        agreement[1] = false
        agreement[2] = false
      }
    }" :value="agreement.reduce((acc, cur) => acc && cur, true)" />
        <Gap :height="16" />
        <Divider />
        <Gap :height="16" />
        <Checkbox name="agreement1" :underlined="true" title="서비스 이용약관 동의" @change="(val: boolean) => {
      agreement[0] = val
    }" :value="agreement[0]" :show-detail-button="true" @detail="() => {}" link="https://seen-bison-bae.notion.site/135c10e8cd2c80fa9eaac5a035090c22?pvs=4" />
        <Gap :height="20" />
        <Checkbox name="agreement2" :underlined="true" title="개인정보 수집 및 이용 동의" @change="(val: boolean) => {
      agreement[1] = val
    }" :value="agreement[1]" :show-detail-button="true" @detail="() => {}" link="https://seen-bison-bae.notion.site/135c10e8cd2c80b28684f91f7df41e35?pvs=4" />
        <Gap :height="20" />
        <Checkbox name="agreement3" :underlined="true" title="마케팅 목적의 개인정보 수집 및 이용 동의" @change="(val: boolean) =>{
      agreement[2] = val
    }" :value="agreement[2]" :show-detail-button="true" @detail="() => {}" link="https://seen-bison-bae.notion.site/135c10e8cd2c80d5b5d8e9a72ee125aa?pvs=4" />
      </div>

    </div>

    <div v-if="account.data?.accountMeta.stage === 'default' && termsRequired">
      <StickyArea position="top" :style="{ backgroundColor: '#fff'}">
        <ProgressBar class="progress-bar" :progress="progress" :processing="processing" style="z-index:1000;" />
        <SubHeader />
      </StickyArea>
      <div class="content-container">
        <PageTitleAndDescription title="가입에 필요한 기본정보를<br>입력해주세요." description="이름은 프로필에 공개되지 않으며, 인증을 위한 정보입니다." />
        <Gap :height="40" />

        <TextInput label="이름" placeholder="이름을 입력하세요" :required="true" :validate="(val: string) => {
          if (val && !(/^[ㄱ-힣]+$/.test(val))) {
            return '이름에는 특수문자, 숫자, 알파벳이 포함될 수 없습니다.';
          }

          if (val && val.length >= 10) {
            return '이름은 10자 이내로 입력해주세요.';
          }

          return null;
        }" @input="(val: string, validateValue: any) => {
          defaultData.name = val;

          if (val && !(/^[ㄱ-힣]+$/.test(val))) {
            profileData.name = '';
          }

          if (val && val.length >= 10) {
            profileData.name = '';
          }

          if(val.length < 1) {
            profileData.name = '';
          } else {
            profileData.name = val;
          }
        }" :value="defaultData.name" />
        <Gap :height="20" />

        <TextInput label="생년월일" placeholder="20000130" :required="true" :validate="(val: string) => {
          // 값이 없다면 null 반환
          if (!val) return null;

          // 값이 올바른 날짜 형식인지 검증
          if (!validateDate(val)) {
            return '생년월일이 올바르지 않습니다';
          }

          // 나이 계산
          const formattedDate = val.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
          const age = calculateAge(formattedDate);

          // 나이가 만 20세 미만인 경우 에러 메시지 반환
          if (age < 20) {
            return '만 20세 이상만 가입 가능합니다.';
          }

          // 모든 조건을 통과하면 null 반환
          return null;
        }" @input="(val: string, validateValue: any) => {
          defaultData.birthDate = val;

          if (!val) {
            profileData.birthDate = '';
          }

          if (!validateDate(val)) {
            profileData.birthDate = '';
          }

          if (val.length == 8) {
            const formattedDate = val.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
            const age = calculateAge(formattedDate);
            if (age >= 20) {
              profileData.birthDate = formattedDate;
            }
          } else {
            profileData.birthDate = '';
          }
        }" :value="defaultData.birthDate" />
        <Gap :height="20" />

        <RadioButtonTabs label="성별" name="gender" :required="true" @change="(val: string) => {
          defaultData.gender = val;
          profileData.gender = val;
        }" :value="profileData.gender" :options="TEST_RADIO_OPTIONS" />
      </div>
    </div>

    <div v-if="account.data?.accountMeta.stage === 'normal'">
      <StickyArea position="top" :style="{ backgroundColor: '#fff'}">
        <ProgressBar class="progress-bar" :progress="progress" :processing="processing" style="z-index:1000;" />
        <SubHeader :show-back-button="true" @back="() => {
          ProfileUpdateAction('default', false)
        }" />
      </StickyArea>
      <div class="content-container">
        <PageTitleAndDescription title="프로필에 등록될 정보를<br>입력해주세요." description="연결된 상대에게 공개되는 프로필 정보입니다." />
        <Gap :height="40" />

        <ProfileImage label="프로필 이미지" :required="true" :loading="ProfileUploaderLoading" :image-url="photos[0]?.image_path" @change="ProfileUploader" @error="(message: string) => {
          useModalStore().setModal({
            type: 'alert',
            data: {
              title: '이미지 업로드 실패',
              message
            }
          })
        }" />
        <Gap :height="20" />

        <TextInput label="닉네임" placeholder="닉네임을 입력해 주세요." :required="true" :validate="(val: string) => {
          if (val && val.length >= 10) {
            return '닉네임은 10자 이내로 입력해주세요.';
          }

          return null;
        }" @input="(val: string, validateValue: any) => {
          profileData.nickName = val;
          if (validateValue === null && val.length > 0) {
            profileData.nickName = val;
          } else {
            profileData.nickName = val.slice(0, 10);
          }
        }" :value="profileData.nickName || ''" />
        <Gap :height="20" />

        <Select label="MBTI" :required="true" placeholder="MBTI를 선택해주세요." @change="(val: string) => {
          profileData.mbti = val
        }" :value="profileData.mbti" :options="TEST_SELECT_OPTIONS" :modal-option-cols="4" />
        <Gap :height="20" />

        <DeepSelect label="거주지역" placeholder="거주지역을 선택해주세요." modalTitle="거주지역을 선택해주세요." :required="true" @change="(val: string, val2: string) => {
          profileData.occupiedAreaHigh = val
          profileData.occupiedAreaLow = val2
        }" :value="profileData.occupiedAreaLow" :view-value="`${profileData.occupiedAreaHigh} ${profileData.occupiedAreaLow}`" :options="TEST_DEEP_SELECT_OPTIONS" :modal-option-cols="4" />
        <Gap :height="20" />

        <TextArea label="자기소개" :min-length="20" :max-length="500" :required="true" placeholder="나에 대해 소개해주세요! 상세하게 작성할수록 매칭 확률이 올라갑니다." @input="(val: string) => {
          textArea.selfIntroduction = val
          if(val.length >= 20) {
            profileData.selfIntroduction = val
          } else {
            profileData.selfIntroduction = ''
          }
        }" :value="textArea.selfIntroduction || ''" />
      </div>
    </div>

    <div v-if="account.data?.accountMeta.stage === 'job'">
      <StickyArea position="top" :style="{ backgroundColor: '#fff'}">
        <ProgressBar class="progress-bar" :progress="progress" :processing="processing" style="z-index:1000;" />
        <SubHeader :show-back-button="true" @back="() => {
          ProfileUpdateAction('normal', false)
        }" />
      </StickyArea>
      <div class="content-container">
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

        <Image label="증빙 이미지 등록" :required="true" :loading="JobUploaderLoading" :image-url="jobs[0]?.image_path" @change="JobUploader" description="증빙 이미지를 업로드해요" @error="(message: string) => {
          useModalStore().setModal({
            type: 'alert',
            data: {
              title: '이미지 업로드 실패',
              message
            }
          })
        }" />
        <Gap :height="20" />
      </div>
    </div>

    <div v-if="account.data?.accountMeta.stage === 'school'">
      <StickyArea position="top" :style="{ backgroundColor: '#fff'}">
        <ProgressBar class="progress-bar" :progress="progress" :processing="processing" style="z-index:1000;" />
        <SubHeader :show-back-button="true" @back="() => {
          ProfileUpdateAction('job', false)
        }" />
      </StickyArea>
      <div class="content-container">
        <PageTitleAndDescription title="프로필에 등록될 재학 및<br>졸업 대학을 입력해주세요." description="나와 더 잘 맞는 상대와 매칭될 수 있어요." />
        <Gap :height="40" />

        <TextInput label="학교명" placeholder="학교명을 입력해주세요." :required="false" :validate="(val: string) => {
            if (val && val.length >= 20) {
              return '학교명은 20자 이내로 입력해주세요.';
            }

            return null;
          }" @input="(val: string, validateValue: any) => {
            profileData.school = val;
            if (validateValue === null && val.length > 0) {
              profileData.school = val;
            } else {
              profileData.school = '';
            }
          }" :value="profileData.school" />
      </div>
    </div>

    <div v-if="account.data?.accountMeta.stage === 'answer'">
      <StickyArea position="top" :style="{ backgroundColor: '#fff'}">
        <ProgressBar class="progress-bar" :progress="progress" :processing="processing" style="z-index:1000;" />
        <SubHeader :show-back-button="true" @back="() => {
          ProfileUpdateAction('school', false)
        }" />
      </StickyArea>
      <div class="content-container">
        <PageTitleAndDescription title="프로필에 등록될<br>질문에 답변해주세요." description="보다 잘 맞는 상대와 미팅을 진행하기 위한 질문이에요.<br>상세하게 작성할 수록 매칭 확률이 올라가요!" />
        <Gap :height="40" />

        <TextArea :question="question1" @input="(val: string) => {
          profileData.descriptions[0].title = question1;
          textArea.description1Answer = val;

          if(val.length >= 20) {
            profileData.descriptions[0].answer = val;
          } else {
            profileData.descriptions[0].answer = '';
          }
        }" :num-lines="6" :min-length="20" :max-length="500" :value="textArea.description1Answer" :requiredMessageVisible="false" placeholder="답변을 입력해주세요." />
        <Gap :height="20" />

        <TextArea :question="question2" @input="(val: string) => {
          profileData.descriptions[1].title = question2;
          textArea.description2Answer = val;

          if(val.length >= 20) {
            profileData.descriptions[1].answer = val;
          } else {
            profileData.descriptions[1].answer = '';
          }
        }" :num-lines="6" :min-length="20" :max-length="500" :value="textArea.description2Answer" requiredMessage="(분위기, 인원수 등)" :requiredMessageVisible="true" placeholder="답변을 입력해주세요." />
        <Gap :height="20" />
      </div>
    </div>

    <div v-if="account.data?.accountMeta.stage === 'request'">
      <StickyArea position="top" :style="{ backgroundColor: '#fff'}">
        <ProgressBar class="progress-bar" :progress="progress" :processing="processing" style="z-index:1000;" />
        <SubHeader :show-back-button="false" @back="() => {}" />
      </StickyArea>
      <div class="content-container">
        <PageTitleAndDescription title="가입 승인을 위해<br>인증 심사중이에요." description="신뢰도 기반의 미팅을 위해 인증 절차를 진행하고 있어요.<br>인증이 승인되면 문자를 통해 안내해드릴게요!" />
        <Gap :height="40" />
        <UserProfileInfo
          :name="profileData.name"
          :message="profileData.selfIntroduction"
          :age="calculateAge(profileData.birthDate)"
          :job="profileData.job"
          :mbti="profileData.mbti"
          :location="`${profileData.occupiedAreaHigh} ${profileData.occupiedAreaLow}`"
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
      </div>
    </div>

    <div v-if="account.data?.accountMeta.stage === 'reject'">
      <Empty title="인증이 거절되었습니다." description="인증을 위한 문서나 직장 및 직무 텍스트를<br>수정하신 후 인증을 다시 진행해주세요." style="position:absolute; top: 50%; left: 0; margin-top: -134px; width: 100%; padding: 0;" />
    </div>
  </div>

  <StickyArea position="bottom" :style="{ padding: '14px 16px' }" v-if="account.data?.accountMeta.stage === 'default' && !termsRequired">
    <SubmitButton @click="termsAccept" :disabled="!agreement[0] || !agreement[1]" :style="{
          backgroundColor: '#6726FE',
        }">다음</SubmitButton>
  </StickyArea>

  <StickyArea position="bottom" :style="{ padding: '14px 16px' }" v-if="account.data?.accountMeta.stage === 'default' && termsRequired">
    <SubmitButton @click="() => {
        ProfileUpdateAction('default');
    }" :disabled="!(profileData.name && profileData.birthDate && profileData.gender)" :style="{
          backgroundColor: '#6726FE',
        }">다음</SubmitButton>
  </StickyArea>

  <StickyArea position="bottom" :style="{ padding: '14px 16px' }" v-if="account.data?.accountMeta.stage === 'normal'">
    <SubmitButton @click="ProfileUpdateAction('normal')" :disabled="!photoRequired || !profileData.nickName || !profileData.mbti || !profileData.occupiedAreaHigh || !profileData.occupiedAreaLow || !profileData.selfIntroduction" :style="{
          backgroundColor: '#6726FE',
        }">다음</SubmitButton>
  </StickyArea>

  <StickyArea position="bottom" :style="{ padding: '14px 16px' }" v-if="account.data?.accountMeta.stage === 'job'">
    <SubmitButton @click="ProfileUpdateAction('job')" :disabled="!profileData.job || !jobRequired" :style="{
          backgroundColor: '#6726FE',
        }">다음</SubmitButton>
  </StickyArea>

  <StickyArea position="bottom" :style="{ display: 'flex', flexDirection: 'row', padding: '14px 16px' }" v-if="account.data?.accountMeta.stage === 'school'">
    <Button @click="() => {
          profileData.school = '';
          ProfileUpdateAction('school')
        }" :style="{
          width: 'auto',
          padding: '0 32px',
          height: '52px',
          borderRadius: '26px',
          fontSize: '17px'
        }">건너뛰기</Button>
    <div :style="{flex: 1}" />
    <SubmitButton @click="ProfileUpdateAction('answer')" :disabled="!profileData.school" :style="{
          width: 'auto',
          padding: '0 32px',
          backgroundColor: '#6726FE',
        }">등록하고 다음</SubmitButton>
  </StickyArea>

  <StickyArea position="bottom" :style="{ display: 'flex', flexDirection: 'row', padding: '14px 16px' }" v-if="account.data?.accountMeta.stage === 'answer'">
    <SubmitButton @click="ProfileUpdateAction('request')" :disabled="!profileData.descriptions[0].answer || !profileData.descriptions[1].answer" :style="{
        backgroundColor: '#6726FE',
      }">다음</SubmitButton>

  </StickyArea>

  <StickyArea position="bottom" :style="{ padding: '14px 16px' }" v-if="account.data?.accountMeta.stage === 'reject'">
    <SubmitButton @click="ProfileUpdateAction('job', false, true)" :style="{
        backgroundColor: '#6726FE',
      }">인증 다시 진행하기</SubmitButton>
  </StickyArea>

</template>

<style scoped>
.page {
  //padding: 16px 16px 120px;
  min-height: 100dvh;
}

.content-container {
  padding: 16px 16px 120px;
}
</style>
