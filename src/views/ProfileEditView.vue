<script setup lang="ts">
import DeepSelect from '@/components/forms/DeepSelect.vue'
import TextInputSchool from '@/components/forms/TextInputSchool.vue'
import Gap from '@/components/Gap.vue'
import ProfileImage from '@/components/forms/ProfileImage.vue'
import SearchUniversity from '@/components/SearchUniversity.vue'
import StickyArea from '@/components/StickyArea.vue'
import SubHeader from '@/components/SubHeader.vue'
import TextInput from '@/components/forms/TextInput.vue'
import TextArea from '@/components/forms/TextArea.vue'
import Select from '@/components/forms/Select.vue'
import LinkButton from '@/components/forms/LinkButton.vue'
import Image from '@/components/forms/Image.vue'
import PageTitleAndDescription from '@/components/PageTitleAndDescription.vue'
import SubmitButton from '@/components/SubmitButton.vue'
import ToastContainer from '@/components/ToastContainer.vue'
import { TEST_SELECT_OPTIONS, TEST_DEEP_SELECT_OPTIONS, QUESTION1, QUESTION2 } from '@/consts/testData'
import http from '@/lib/http'
import type MixpanelService from '@/lib/mixpanel'
import router from '@/router'
import { inject, onMounted, type Reactive, reactive, type Ref, ref, toRaw } from 'vue'
import { useModalStore } from '@/stores/modal'

const toastRef = ref<InstanceType<typeof ToastContainer> | null>(null)

const mp = inject<MixpanelService>('mixpanel')
const profileData: Reactive<{
  [key: string]: any
}> = reactive({});

const account: any = reactive({});
const photos: Ref<any> = ref([]);
const jobs: Ref<any> = ref([]);
const jobRequired: Ref<any> = ref(false);
const jobName: Ref<any> = ref('');
const jobFile: FormData = new FormData();
const jobFileBase64: Ref<any> = ref('');
const submitRequired: Ref<any> = ref(true);
const findUniversityView = ref(false);
const newSchoolName = ref('');
const newSchoolEmailId = ref('');
const universityIsVerifyView = ref(false);
const universityISVerifyRetryView = ref(false);


// 대학교 선택
const choiceSchool = reactive({
  name: '',
  domain: '',
  code: '',
  list: [] as any[]
})

const textArea: Reactive<{
  [key: string]: any
}> = reactive({
  selfIntroduction: '',
  description1Answer: '',
  description2Answer: ''
});

const state: Reactive<{
  stage: 'profile' | 'job' | 'school'
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
  profileData.certFlow = account.data.accountMeta.cert_flow
  profileData.certIsJob = account.data.accountMeta.cert_is_job
  profileData.certIsSchool = account.data.accountMeta.cert_is_school
  profileData.certSchoolEmail = account.data.accountMeta.cert_school_email

  // 학교 초이스
  // if(profileData.school) {
  //   choiceSchool.name = profileData.school
  // }
  // if(profileData.certSchoolEmail) {
  //   choiceSchool.domain = profileData.certSchoolEmail.split('@')[1]
  // }

  // 텍스트 에어리어
  textArea.selfIntroduction = account.data?.accountMeta.self_introduction;
  textArea.description1Answer = profileData.descriptions[0].answer;
  textArea.description2Answer = profileData.descriptions[1].answer;

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
      setTimeout(async () => {
        await accountUpdate();
      }, 1000)
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
  // JobUploaderLoading.value = true;
  jobFile.append('file', blob, file.name);
  jobFile.append('type', 'job');
  jobRequired.value = true;
  jobFileBase64.value = base64;
}

const UpdateProfileData = () => {
  profileData.job = account.data.accountMeta.job;

  http.post('/account/profile/edit', toRaw(profileData))
    .then((data: any) => {
      useModalStore().setModal({
        type: 'alert',
        data: {
          title: '프로필 수정 완료',
          message: '프로필 수정이 완료되었습니다.'
        }
      })
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

const RequestSchool = () => {
  profileData.school = newSchoolName.value;
  profileData.certSchoolEmail = `${newSchoolEmailId.value}@${choiceSchool.domain}`;
  profileData.certIsSchool = true;

  http.post('/account/profile/edit', toRaw(profileData))
    .then((data: any) => {
      accountUpdate();
      state.stage = 'profile'
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

const RequestProfile = () => {
  http.upload('/account/profile/upload', jobFile)
    .then((data: any) => {
      accountUpdate();

      profileData.job = jobName.value;

      http.post('/account/profile/edit', toRaw(profileData))
        .then(async (data: any) => {
          return router.push('/register/auto')
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

const question1 = QUESTION1;
const question2 = QUESTION2;

const handleUniversitySelect = (university: { schoolName: string; emailDomain: string }) => {
  if (university) {
    choiceSchool.name = university.schoolName;
    choiceSchool.domain = university.emailDomain;
    newSchoolName.value = university.schoolName;
  }

  findUniversityView.value = false;
};

const sendEmail = async () => {
  if (!newSchoolEmailId.value) {
    useModalStore().setModal({
      type: 'alert',
      data: {
        title: '학교 이메일 입력',
        message: '학교 이메일을 입력해주세요.'
      }
    })
    return;
  }

  if (!choiceSchool.name) {
    useModalStore().setModal({
      type: 'alert',
      data: {
        title: '학교 선택',
        message: '학교를 선택해주세요.'
      }
    })
    return;
  }

  const response = await http.post('/account/email/university', {
    email: `${newSchoolEmailId.value}@${choiceSchool.domain}`
  })

  if (response.data.message == 'success') {
    if(universityISVerifyRetryView.value) {
      toastRef.value?.addToast('ok', '이메일을 다시 보내드렸어요.');
    } else {
      universityIsVerifyView.value = true;
      universityISVerifyRetryView.value = false;
    }
  } else {
    useModalStore().setModal({
      type: 'alert',
      data: {
        title: '학교 이메일 전송 실패',
        message: response.data.message
      }
    })
  }
}

const sendEmailCodeVerify = async () => {
  try {
    const response = await http.post('/account/verify/university', {
      code: choiceSchool.code
    });

    RequestSchool();
    universityIsVerifyView.value = false;
    universityISVerifyRetryView.value = false;
    toastRef.value?.addToast('ok', '이메일 인증에 성공했어요!');
  } catch(e: any) {
    if(e.response.data.message === 'Invalid code') {
      toastRef.value?.addToast('warning', '잘못된 인증번호에요. 다시 확인해주세요');
    } else if(e.response.data.message === 'Expired code') {
      toastRef.value?.addToast('warning', '유효기간이 만료되었어요.');
    } else {
      await router.push('/profile-edit');
    }
  }
}

</script>

<template>
  <StickyArea position="top" :style="{ backgroundColor: '#fff'}">
    <SubHeader title="프로필 수정" :action-button-data="{
      title: '미리보기',
      onClick: () => {
        router.push('/profile-preview')
        mp?.trackEvent('click_profile_preview')
      }
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
    <!--    <ProfileImage label="프로필 이미지" :required="true" :image-url="photos[0]?.image_path" @change="ProfileUploader" @error="(message: string) => {-->
    <!--      useModalStore().setModal({-->
    <!--        type: 'alert',-->
    <!--        data: {-->
    <!--          title: '이미지 업로드 실패',-->
    <!--          message-->
    <!--        }-->
    <!--      })-->
    <!--    }" />-->
    <Gap :height="20" />
    <TextInput label="닉네임" placeholder="닉네임을 입력해 주세요." :required="true" :validate="(val: string) => {
          if (val && val.length >= 10) {
            submitRequired = false;
            return '닉네임은 10자 이내로 입력해주세요.';
          }

          return null;
        }" @input="(val: string, validateValue: any) => {
          profileData.nickName = val;
          if (validateValue === null && val.length > 0) {
            submitRequired = true;
            profileData.nickName = val;
          } else {
            submitRequired = true;
            profileData.nickName = val.slice(0, 10);
          }
        }" :value="profileData.nickName || ''" />
    <Gap :height="30" />
    <LinkButton :title="profileData.job" label="커리어" place-holder="커리어를 인증해주세요" optional-text="별도 승인이 필요하며, 승인 시 자동 반영됩니다." @click="() => { state.stage = 'job' }" />
    <Gap :height="20" />
    <LinkButton :title="profileData.school" label="대학교" place-holder="대학교를 인증해주세요" optional-text="이메일 인증 시 반영됩니다." @click="() => { state.stage = 'school' }" />
    <Gap :height="60" />
    <Select label="MBTI" :required="true" @change="(val: string) => profileData.mbti = val" :value="profileData.mbti" :options="TEST_SELECT_OPTIONS" :modal-option-cols="4" />
    <Gap :height="20" />
    <DeepSelect label="거주지역" placeholder="지역을 선택해주세요." modalTitle="지역을 선택해주세요." :required="true" @change="(val: string, val2: string) => {
        profileData.occupiedAreaHigh = val
        profileData.occupiedAreaLow = val2
      }" :value="profileData.occupiedAreaLow" :view-value="`${profileData.occupiedAreaHigh} ${profileData.occupiedAreaLow}`" :options="TEST_DEEP_SELECT_OPTIONS" :modal-option-cols="4" />
    <Gap :height="20" />
    <TextArea label="자기소개" :min-length="20" :max-length="500" :required="true" placeholder="나에 대해 소개해주세요! 상세하게 작성할수록 매칭 확률이 올라갑니다." @input="(val: string) => {
          textArea.selfIntroduction = val
          if(val.length >= 20) {
            submitRequired = true;
            profileData.selfIntroduction = val
          } else {
            submitRequired = false;
            profileData.selfIntroduction = ''
          }
        }" :value="textArea.selfIntroduction || ''" />
    <Gap :height="20" />

    <TextArea :question="question1" @input="(val: string) => {
          profileData.descriptions[0].title = question1;
          textArea.description1Answer = val;

          if(val.length >= 20) {
            submitRequired = true;
            profileData.descriptions[0].answer = val;
          } else {
            submitRequired = false;
            profileData.descriptions[0].answer = '';
          }
        }" :num-lines="6" :min-length="20" :max-length="500" :value="textArea.description1Answer" :requiredMessageVisible="false" placeholder="답변을 입력해주세요." />
    <Gap :height="20" />

    <TextArea :question="question2" @input="(val: string) => {
          profileData.descriptions[1].title = question2;
          textArea.description2Answer = val;

          if(val.length >= 20) {
            submitRequired = true;
            profileData.descriptions[1].answer = val;
          } else {
            submitRequired = false;
            profileData.descriptions[1].answer = '';
          }
        }" :num-lines="6" :min-length="20" :max-length="500" :value="textArea.description2Answer" requiredMessage="(분위기, 인원수 등)" :requiredMessageVisible="true" placeholder="답변을 입력해주세요." />
    <Gap :height="20" />
    <Gap :height="40" />
  </div>

  <div class="page" v-if="Object.keys(profileData).length > 0 && state.stage === 'job'">
    <PageTitleAndDescription title="프로필에 등록될<br>커리어를 인증해주세요." description="공개 가능한 선에서 커리어 정보를 입력한 후,<br>이를 인증할 수 있는 이미지를 제출해주세요.<br>구체적으로 작성하실수록 좋아요!" />
    <Gap :height="40" />

    <TextInput label="나의 커리어" optional-text="(직무, 규모 등)" placeholder="Ex. 대기업 개발자, 스타트업 PM, 회계사 등" :validate="(val: string) => {
          if (val && val.length >= 50) {
            return '50자 이내로 입력해주세요.';
          }

          return null;
        }" @input="(val: string, validateValue: any) => {
          jobName = val;
        }" :value="jobName" />

    <span style="color: #7F7F7F; font-size: 11px; font-weight: 500; line-height: 20px;">* 상대방의 입장에서 파악이 어렵다고 판단되는 경우 승인이 거절됩니다.</span>
    <Gap :height="20" />

    <Image label="증빙 이미지 등록" :required="true" @change="JobUploader" description="증빙 이미지를 업로드해요" @error="(message: string) => {
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

  <div class="page" v-if="Object.keys(profileData).length > 0 && state.stage === 'school'" style="padding-bottom: 60px;">
    <div v-if="!universityIsVerifyView">
      <PageTitleAndDescription title="프로필에 등록될<br>대학교를 인증해주세요." description="" />
      <Gap :height="40" />

      <TextInput label="학교 검색" placeholder="졸업·재학 대학교 이름을 검색해주세요" optional-text="" :required="false" :value="newSchoolName" @click="() => {
        findUniversityView = true;
      }" />
      <Gap :height="40" />
      <TextInputSchool label="학교 이메일" placeholder="아이디 입력" optional-text="" :required="false" :value="newSchoolEmailId" :domain="choiceSchool.domain" @input="(v) => {
        newSchoolEmailId = v;
      }" />
    </div>

    <div class="content-container" v-else-if="universityIsVerifyView && !universityISVerifyRetryView">
      <div class="cert-container">
        <PageTitleAndDescription title="<span style='line-height: 38px;'>보내드린 인증번호를<br>입력해주세요</span>" description="인증 번호를 보내드렸어요. 5분 내로 인증을 완료해주세요." />
        <Gap :height="40" />
        <TextInput label="인증번호" placeholder="인증번호를 입력해주세요" optional-text="" :required="false" :value="choiceSchool.code" @input="(e) => {
            choiceSchool.code = e;
          }" :validate="() => {
            if(choiceSchool.code.length < 6 && choiceSchool.code.length > 0) {
              return '인증번호를 입력해주세요.';
            }
            return null;
          }" />
        <Gap :height="10" />
        <span class="sub-title">메일을 받지 못하신 경우 스팸 메일함을 확인해주세요</span>
        <Gap :height="40" />
        <span class="retry-title" @click="() => {
            universityISVerifyRetryView = true;
            sendEmail();
          }">이메일 다시받기</span>
      </div>
    </div>

    <div class="content-container" v-else>
      <div class="cert-container">
        <PageTitleAndDescription title="<span style='line-height: 38px;'>보내드린 인증번호를<br>입력해주세요</span>" :description="`<span style='color: #6726FE;'>${newSchoolEmailId}@${choiceSchool.domain}</span>로 인증 번호를 보내드렸어요.`" />
        <Gap :height="40" />
        <TextInput label="인증번호" placeholder="인증번호를 입력해주세요" optional-text="" :required="false" :value="choiceSchool.code" @input="(e) => {
            choiceSchool.code = e;
          }" :validate="() => {
            if(choiceSchool.code.length < 6 && choiceSchool.code.length > 0) {
              return '인증번호를 입력해주세요.';
            }
            return null;
          }" />
        <Gap :height="10" />
        <span class="sub-title">메일을 받지 못하신 경우 스팸 메일함을 확인해주세요</span>
        <Gap :height="40" />
      </div>
    </div>

  </div>

  <div class="find-university" v-if="findUniversityView">
    <SearchUniversity @select="handleUniversitySelect" @close="() => {
      findUniversityView = false;
    }" />
  </div>

  <StickyArea position="bottom" :style="{ padding: '14px 16px' }" v-if="state.stage === 'profile'">
    <SubmitButton :disabled="!submitRequired" @click="() => {
      UpdateProfileData()
      mp?.trackEvent('click_profile_edit_done')
    }" :style="{
          backgroundColor: '#6726FE',
        }">수정 완료하기</SubmitButton>
  </StickyArea>

  <StickyArea position="bottom" :style="{ padding: '14px 16px' }" v-if="state.stage === 'job'">
    <SubmitButton @click="() => {
      RequestProfile()
      mp?.trackEvent('click_profile_job_edit')
    }" :disabled="!jobName || !jobRequired" :style="{
          backgroundColor: '#6726FE',
        }">심사하기</SubmitButton>
  </StickyArea>

  <StickyArea position="bottom" :style="{ padding: '14px 16px' }" v-if="state.stage === 'school' && !universityIsVerifyView">
    <SubmitButton @click="() => {
        profileData.school = newSchoolName;
        profileData.certSchoolEmail = `${newSchoolEmailId}@${choiceSchool.domain}`;
        sendEmail();
      }" :disabled="!newSchoolName || !newSchoolEmailId" :style="{
            backgroundColor: '#6726FE',
          }">인증 메일 받기</SubmitButton>
  </StickyArea>

  <StickyArea position="bottom" :style="{ padding: '14px 16px' }" v-if="state.stage === 'school' && universityIsVerifyView">
    <SubmitButton @click="() => {
        sendEmailCodeVerify()
      }" :disabled="!newSchoolName || !newSchoolEmailId" :style="{
            backgroundColor: '#6726FE',
          }">인증하기</SubmitButton>
  </StickyArea>

  <ToastContainer ref="toastRef" />
</template>

<style scoped>
.page {
  padding: 16px;
}

.find-university {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1300;
  background-color: #fff;
}

.sub-title {
  color: #7F7F7F;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px; /* 166.667% */
}

.retry-title {
  cursor: pointer;
  color: #7F7F7F;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px; /* 142.857% */
  text-decoration-line: underline;
  text-decoration-style: solid;
  text-decoration-skip-ink: none;
  text-decoration-thickness: auto;
  text-underline-offset: auto;
  text-underline-position: from-font;
}
</style>
