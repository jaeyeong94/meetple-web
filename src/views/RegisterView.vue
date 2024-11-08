<script setup lang="ts">
import ButtonWithDetail from '@/components/buttons/ButtonWithDetail.vue'
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
import { TEST_DEEP_SELECT_OPTIONS, TEST_RADIO_OPTIONS, TEST_SELECT_OPTIONS } from '@/consts/testData'
import http from '@/lib/http'
import { calculateAge, validateDate } from '@/lib/utils'
import router from '@/router'
import { useModalStore } from '@/stores/modal'
import { onMounted, type Reactive, reactive, type Ref, ref, toRaw, watch } from 'vue'

const progress = ref(0)
const processing = ref(false)
const currentStage = ref('')
const profileData: Reactive<{
  [key: string]: any
}> = reactive({})

// 기본정보
const defaultData = reactive({
  name: '',
  birthDate: '',
  gender: '',
})

// 이미지
const photoRequired: Ref<any> = ref(false);
const jobRequired: Ref<any> = ref(false);
const photos: Ref<any> = ref([]);
const jobs: Ref<any> = ref([]);

// 질문
const question1 = '미팅에 함께 나가는 나와 내 친구들은 어떤 사람인가요?';
const question2 = '어떤 미팅을 하고 싶으신가요?';

// 서버정보
const account: any = reactive({})
const accountDataUpdate = async () => {
  const response = await http.get('/account')
  Object.assign(account, response.data)

  if(!account.data.id) {
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
  profileData.descriptions[0] = profileData.descriptions[0] ?? { title: '', answer: '' }
  profileData.descriptions[1] = profileData.descriptions[1] ?? { title: '', answer: '' }

  account.data.accountProfiles.forEach((profile: any) => {
    if(profile.type === 'photo') {
      photos.value.push(profile)
    } else if(profile.type === 'job') {
      jobs.value.push(profile)
    }
  })
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

// 이용약관
const agreement = reactive([false, false, false]);
let termsRequired = ref( false);
watch(agreement, (val) => {
  profileData.termsRequired = !!(val[0] && val[1]);
  profileData.termsOptional = !!val[2];
})
const termsAccept = () => {
  termsRequired.value = true;
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

const ProfileUploader = (base64: string, file: any) => {
  const base64Data = base64.split(',')[1];
  const mimeType = 'text/plain';
  const blob = base64ToBlob(base64Data, mimeType);
  const formData = new FormData();
  formData.append('file', blob, file.name);
  formData.append('type', 'photo');
  http.upload('/account/profile/upload', formData)
    .then((data: any) => {
      const response = data.data;
      accountDataUpdate()
      photoRequired.value = true;
    })
    .catch((error: any) => {
      useModalStore().setModal({
        type: 'alert',
        data: {
          message: error.response.data.message
        }
      })
      console.log(error, 'error')
    })
}

const JobUploader = (base64: string, file: any) => {
  const base64Data = base64.split(',')[1];
  const mimeType = 'text/plain';
  const blob = base64ToBlob(base64Data, mimeType);
  const formData = new FormData();
  formData.append('file', blob, file.name);
  formData.append('type', 'job');
  http.upload('/account/profile/upload', formData)
    .then((data: any) => {
      const response = data.data;
      accountDataUpdate()
      jobRequired.value = true;
    })
    .catch((error: any) => {
      useModalStore().setModal({
        type: 'alert',
        data: {
          message: error.response.data.message
        }
      })
      console.log(error, 'error')
    })
}

const ProfileUpdateAction = (stage: string) => {
  http.post('/account/profile/update', {
    stage,
    data: toRaw(profileData)
  })
    .then((data: any) => {
      const response = data.data;
      accountDataUpdate()
      progressUpdate()
    })
    .catch((error: any) => {
      useModalStore().setModal({
        type: 'alert',
        data: {
          message: error.response.data.message
        }
      })
      console.log(error, 'error')
    })
}

</script>

<template>
  <ProgressBar :progress="progress" :processing="processing" />
  <div class="page">
    <div v-if="account.data?.accountMeta.stage === 'default' && !termsRequired">
      <StickyArea position="top" :style="{ backgroundColor: '#fff'}">
        <SubHeader :show-close-button="true" @close="() => {
          router.push('/')
        }" />
      </StickyArea>
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
      <Checkbox name="agreement1" title="[필수] 서비스 이용약관 동의" @change="(val: boolean) =>{
      agreement[0] = val
    }" :value="agreement[0]" :show-detail-button="true" @detail="() => {}" />
      <Gap :height="20" />
      <Checkbox name="agreement2" title="[필수] 개인정보 수집 및 이용 동의" @change="(val: boolean) =>{
      agreement[1] = val
    }" :value="agreement[1]" :show-detail-button="true" @detail="() => {}" />
      <Gap :height="20" />
      <Checkbox name="agreement3" title="[선택] 마케팅 목적의 개인정보 수집 및 이용 동의" @change="(val: boolean) =>{
      agreement[2] = val
    }" :value="agreement[2]" :show-detail-button="true" @detail="() => {}" />

      <SubmitButton @click="termsAccept" :disabled="!agreement[0] || !agreement[1]" :style="{
        backgroundColor: '#6726FE',
        position: 'absolute',
        bottom: '16px',
        width: 'calc(100% - 32px)',
      }">다음</SubmitButton>
    </div>

    <div v-if="account.data?.accountMeta.stage === 'default' && termsRequired">
      <StickyArea position="top" :style="{ backgroundColor: '#fff'}">
        <SubHeader :show-back-button="true" @back="() => {
          termsRequired = false
        }" />
      </StickyArea>
      <PageTitleAndDescription title="가입에 필요한 기본정보를<br>입력해주세요." description="이름은 프로필에 공개되지 않으며, 인증을 위한 정보입니다." />
      <Gap :height="40" />

      <TextInput label="이름" placeholder="이름을 입력하세요" :required="true" :validate="(val: string) => {
        if (val && !(/^[가-힣]+$/.test(val))) {
          return '이름에는 특수문자, 숫자, 알파벳이 포함될 수 없습니다.';
        }

        if (val && val.length >= 10) {
          return '이름은 10자 이내로 입력해주세요.';
        }

        return null;
      }" @input="(val: string, validateValue: any) => {
        defaultData.name = val;
        if (validateValue === null && val.length > 1) {
          profileData.name = val;
        } else {
          profileData.name = '';
        }
      }" :value="defaultData.name" />
      <Gap :height="20" />

      <TextInput label="생년월일" placeholder="2000-01-30" :required="true" :validate="(val: string) => {
        if (!val) return null;
        if (val.length < 11 && validateDate(val)) return null;
        return '생년월일이 올바르지 않습니다';
      }" @input="(val: string, validateValue: any) => {
        defaultData.birthDate = val;
        if (validateValue && val.length > 0) {
          profileData.birthDate = val;
        } else {
          profileData.birthDate = '';
        }
      }" :value="defaultData.birthDate" />
      <Gap :height="20" />

      <RadioButtonTabs label="성별" name="gender" :required="true" @change="(val: string) => {
        defaultData.gender = val;
        profileData.gender = val;
      }" :value="defaultData.gender" :options="TEST_RADIO_OPTIONS" />

      <SubmitButton @click="ProfileUpdateAction('default')" :disabled="!profileData.name || !profileData.birthDate || !profileData.gender" :style="{
        backgroundColor: '#6726FE',
        position: 'absolute',
        bottom: '16px',
        width: 'calc(100% - 32px)',
      }">다음</SubmitButton>
    </div>

    <div v-if="account.data?.accountMeta.stage === 'normal'">
      <StickyArea position="top" :style="{ backgroundColor: '#fff'}">
        <SubHeader :show-back-button="true" @back="() => {
          account.data.accountMeta.stage = 'default';
          progressUpdate();

        }" />
      </StickyArea>
      <PageTitleAndDescription title="프로필에 등록될 정보를<br>입력해주세요." description="연결된 상대에게 공개되는 프로필 정보입니다." />
      <Gap :height="40" />

      <Image label="프로필 이미지" :required="true" @change="ProfileUploader" description="프로필 이미지를 업로드해요" />
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
          profileData.nickName = '';
        }
      }" :value="profileData.nickName" />
      <Gap :height="20" />

      <Select label="MBTI" :required="true" placeholder="MBTI를 선택해주세요." @change="(val: string) => {
        profileData.mbti = val
      }" :value="profileData.mbti" :options="TEST_SELECT_OPTIONS" :modal-option-cols="4" />
      <Gap :height="20" />

      <DeepSelect label="거주지역" placeholder="거주지역을 선택해주세요." modalTitle="거주지역을 선택해주세요." :required="true" @change="(val: string, val2: string) => {
        profileData.occupiedAreaHigh = val
        profileData.occupiedAreaLow = val2
      }" :value="profileData.occupiedAreaLow" :options="TEST_DEEP_SELECT_OPTIONS" :modal-option-cols="4" />
      <Gap :height="20" />

      <TextArea label="자개소개" :required="true" placeholder="MBTI를 선택해주세요." @input="(val: string) => {
        profileData.selfIntroduction = val
      }" :value="profileData.selfIntroduction" />

      <SubmitButton @click="ProfileUpdateAction('normal')" :disabled="!photoRequired || !profileData.nickName || !profileData.mbti || !profileData.occupiedAreaHigh || !profileData.occupiedAreaLow || !profileData.selfIntroduction" :style="{
        backgroundColor: '#6726FE',
        position: 'absolute',
        bottom: '16px',
        width: 'calc(100% - 32px)',
      }">다음</SubmitButton>
    </div>

    <div v-if="account.data?.accountMeta.stage === 'job'">
      <StickyArea position="top" :style="{ backgroundColor: '#fff'}">
        <SubHeader :show-back-button="true" @back="() => {
          ProfileUpdateAction('default')
        }" />
      </StickyArea>
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

      <Image label="증빙 이미지 등록" :required="true" @change="JobUploader" description="증빙 이미지를 업로드해요" />
      <Gap :height="20" />

      <SubmitButton @click="ProfileUpdateAction('job')" :disabled="!profileData.job || !jobRequired" :style="{
        backgroundColor: '#6726FE',
        position: 'absolute',
        bottom: '16px',
        width: 'calc(100% - 32px)',
      }">다음</SubmitButton>
    </div>

    <div v-if="account.data?.accountMeta.stage === 'school'">
      <StickyArea position="top" :style="{ backgroundColor: '#fff'}">
        <SubHeader :show-back-button="true" @back="() => {
          ProfileUpdateAction('normal')
        }" />
      </StickyArea>
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

      <div>
        <SubmitButton @click="() => {
        profileData.school = '';
        ProfileUpdateAction('school')
      }" :style="{
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: '16px',
        left: '16px',
        width: 'calc(166px)',
        color: '#000',
        border: '1px solid #E0E0E0',
      }">건너뛰기</SubmitButton>

        <SubmitButton @click="ProfileUpdateAction('school')" :disabled="!profileData.school" :style="{
        backgroundColor: '#6726FE',
        position: 'absolute',
        bottom: '16px',
        right: '16px',
        width: 'calc(166px)',
      }">등록하고 다음</SubmitButton>
      </div>
    </div>

    <div v-if="account.data?.accountMeta.stage === 'answer'">
      <StickyArea position="top" :style="{ backgroundColor: '#fff'}">
        <SubHeader :show-back-button="true" @back="() => {
          ProfileUpdateAction('job')
        }" />
      </StickyArea>
      <PageTitleAndDescription title="프로필에 등록될<br>질문에 답변해주세요." description="보다 잘 맞는 상대와 미팅을 진행하기 위한 질문이에요.<br>상세하게 작성할 수록 매칭 확률이 올라가요!" />
      <Gap :height="40" />

      <TextArea :question="question1" @input="(val: string) => {
        profileData.descriptions[0].title = question1;
        profileData.descriptions[0].answer = val;
      }" :num-lines="6" :max-length="500" :value="profileData.descriptions[0].answer" :requiredMessageVisible="false" placeholder="답변을 입력해주세요." />
      <Gap :height="20" />

      <TextArea :question="question2" @input="(val: string) => {
        profileData.descriptions[1].title = question2;
        profileData.descriptions[1].answer = val;
      }" :num-lines="6" :max-length="500" :value="profileData.descriptions[1].answer" requiredMessage="(분위기, 인원수 등)" :requiredMessageVisible="true" placeholder="답변을 입력해주세요." />
      <Gap :height="20" />

      <div>
        <SubmitButton @click="() => {
        profileData.descriptions[0].title = question1;
        profileData.descriptions[0].answer = '';
        profileData.descriptions[1].title = question2
        profileData.descriptions[1].answer = '';
        ProfileUpdateAction('answer')
      }" :style="{
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: '16px',
        left: '16px',
        width: 'calc(166px)',
        color: '#000',
        border: '1px solid #E0E0E0',
      }">건너뛰기</SubmitButton>

        <SubmitButton @click="ProfileUpdateAction('answer')" :disabled="!profileData.descriptions[0].answer || !profileData.descriptions[1].answer" :style="{
        backgroundColor: '#6726FE',
        position: 'absolute',
        bottom: '16px',
        right: '16px',
        width: 'calc(166px)',
      }">등록하고 다음</SubmitButton>
      </div>
    </div>

    <div v-if="account.data?.accountMeta.stage === 'request'">
      <StickyArea position="top" :style="{ backgroundColor: '#fff'}">
        <SubHeader :show-back-button="false" @back="() => {}" />
      </StickyArea>
      <PageTitleAndDescription title="가입 승인을 위해<br>인증 심사중이에요." description="신뢰도 기반의 미팅을 위해 인증 절차를 진행하고 있어요.<br>인증이 승인되면 문자를 통해 안내해드릴게요!" />
      <Gap :height="40" />
      <UserProfileInfo
        :name="profileData.name"
        :message="profileData.selfIntroduction"
        :age="calculateAge(profileData.birthDate)"
        :job="profileData.job"
        :mbti="profileData.mbti"
        :location="`${profileData.occupiedAreaHigh}, ${profileData.occupiedAreaLow}`"
        :school="profileData.school || '미입력'"
        :image-url="photos[photos.length - 1].image_path"
      />
      <Gap :height="20" />
      <Questions :data="profileData.descriptions.map((line: any) => {
        return {
          question: line.title,
          answer: line.answer
        }
      })"/>
    </div>

    <div v-if="account.data?.accountMeta.stage === 'reject'">
      <Empty title="인증이 거절되었습니다." description="인증을 위한 문서나 직장 및 직무 텍스트를 수정하신 후 인증을 다시 진행해주세요." style="position:absolute; top: 50%; left: 0; margin-top: -134px;" />
      <SubmitButton @click="ProfileUpdateAction('normal')" :style="{
        backgroundColor: '#6726FE',
        position: 'absolute',
        bottom: '16px',
        width: 'calc(100% - 32px)',
      }">인증 다시 진행하기</SubmitButton>
    </div>
  </div>

</template>

<style scoped>
.page {
  padding: 16px 16px 120px;
}
</style>
