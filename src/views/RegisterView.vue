<script setup lang="ts">
import Button from '@/components/Button.vue'
import Empty from '@/components/Empty.vue'
import DeepSelect from '@/components/forms/DeepSelect.vue'
import Image from '@/components/forms/Image.vue'
import Select from '@/components/forms/Select.vue'
import TextArea from '@/components/forms/TextArea.vue'
import TextInput from '@/components/forms/TextInput.vue'
import TextInputSchool from '@/components/forms/TextInputSchool.vue'
import Gap from '@/components/Gap.vue'
import ProgressBar from '@/components/ProgressBar.vue'
import Questions from '@/components/Questions.vue'
import SearchUniversity from '@/components/SearchUniversity.vue'
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
import type MixpanelService from '@/lib/mixpanel'
import { calculateAge, validateDate } from '@/lib/utils'
import router from '@/router'
import { useToastStore } from '@/stores/toast'
import { useRoute } from 'vue-router'
import { useModalStore } from '@/stores/modal'
import { onMounted, type Reactive, reactive, type Ref, ref, toRaw, watch, inject } from 'vue'
import ToastContainer from '@/components/ToastContainer.vue'

const toastRef = ref<InstanceType<typeof ToastContainer> | null>(null)

interface upHashFrontRequest {
  site_cd: string;
  ordr_idxx: string;
  req_tx: 'CERT';
  cert_method: '01';
  up_hash: string;
  cert_otp_use: 'N';
  param_opt_1?: string;
  param_opt_2?: string;
  param_opt_3?: string;
  Ret_URL: string;
  cert_enc_use_ext: 'Y';
  kcp_merchant_time: string;
  kcp_cert_lib_ver: string;
  kcp_page_submit_yn?: 'Y' | 'N';
}

const page = ref<HTMLElement | null>(null);

const certData: {
  certUp: {
    url: string;
    request: upHashFrontRequest
  } | null;
} = reactive({
  certUp: null
});

const getCertUpHash = async () => {
  try {
    const response = await http.post('/account/cert/up-hash', {});
    certData.certUp = {
      url: response.data.data.url,
      request: response.data.data.request,
    };
    await certLoading();
  } catch (error) {
    console.error('Failed to fetch certUpHash:', error);
  }
};

const certLoading = async () => {
  const certIframe = document.getElementById('certIframe') as HTMLIFrameElement;
  if (!certData.certUp || !certIframe) return;
  const existingForm = document.getElementById("certForm");
  if (existingForm) existingForm.remove();

  const form = document.createElement("form");
  form.id = "certForm";
  form.method = "POST";
  form.action = certData.certUp.url;
  form.target = certIframe.name;

  Object.entries(certData.certUp.request).forEach(([key, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = value.toString();
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
}

const handleCertCompletion = async (event: MessageEvent) => {
  if (!certData.certUp || !event.origin.includes('meetple.co.kr')) return;
  if (event.data.status === "CERT_SUCCESS") {
    window.dispatchEvent(new CustomEvent("certification-success", { detail: event.data }));
    console.log(currentStage.value, routeFlow[routeFlow.indexOf(currentStage.value) + 1]);
    const nextFlow = routeFlow[routeFlow.indexOf(currentStage.value) + 1];
    if (nextFlow) {
      await router.push(`/register/${nextFlow}`);
    } else {
      await router.push('/register/auto');
    }

    await accountDataUpdate();
    await progressUpdate();

    window.scrollTo(0, 0);
    root!.scrollTo(0, 0);
  } else if (event.data.status === "CERT_FAILED") {
    console.error("Certification Failed:", event.data);
    useModalStore().setModal({
      type: "alert",
      data: {
        title: "인증 실패",
        message: "본인 인증이 실패하였습니다. 다시 시도해주세요.",
      },
    });

    // 인증 실패 이벤트 발생
    window.dispatchEvent(new CustomEvent("certification-failed", { detail: event.data }));

    await router.push('/');
  }
};

/** ************************************************************************** */

const mp = inject<MixpanelService>('mixpanel')

// 라우터 제한
const route = useRoute();
const routerLimit = ['auto', 'default', 'normal', 'answer', 'join', 'job', 'school', 'request', 'reject'];
const routeFlow = ['default', 'normal', 'answer', 'join', 'job', 'school'];

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

// 대학교 선택
const choiceSchool = reactive({
  name: '',
  domain: '',
  code: '',
  list: [] as any[]
})

// 텍스트 에어리어
const textArea: Reactive<{
  [key: string]: any
}> = reactive({
  selfIntroduction: '',
  description1Answer: '',
  description2Answer: ''
});

const findUniversityView = ref(false);
const certIsView = ref(false);
const termsRequired = ref( false);
const photoRequired: Ref<any> = ref(false);
const jobRequired: Ref<any> = ref(false);
const photos: Ref<any> = ref([]);
const jobs: Ref<any> = ref([]);
const root = inject<HTMLElement>('rootDiv');
const schoolEmailId = ref('');
const universityIsVerifyView = ref(false);
const universityISVerifyRetryView = ref(false);

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
      // photos.value.push(profile)
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
    if(['default', 'normal', 'answer', 'join', 'job', 'school', 'request', 'reject'].includes(route.params.stage as string)) {
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
  profileData.certFlow = account.data.accountMeta.cert_flow
  profileData.certIsJob = account.data.accountMeta.cert_is_job
  profileData.certIsSchool = account.data.accountMeta.cert_is_school
  profileData.certSchoolEmail = account.data.accountMeta.cert_school_email

  // 학교 초이스
  // if(profileData.school) {
    // choiceSchool.name = profileData.school
  // }
  // if(profileData.certSchoolEmail) {
  //   schoolEmailId.value = profileData.certSchoolEmail.split('@')[0]
  //   choiceSchool.domain = profileData.certSchoolEmail.split('@')[1]
  // }

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

const findUniversityList = async (q: string) => {
  if(q) {
    const response = await http.get('/account/info/university', {
      params: {
        q
      }
    })
    choiceSchool.list = response.data.data
    return response.data.data
  } {
    const response = await http.get('/account/info/university')
    choiceSchool.list = response.data.data
    return response.data.data
  }
}

/** ******************************************************* **/
onMounted(async () => {
  await accountDataUpdate();
  await progressUpdate();

  if (route.params.stage === 'default') {
    if(profileData.name && profileData.birthDate && profileData.gender) {
      await router.push(`/register/${routeFlow[routeFlow.indexOf(currentStage.value) + 1]}`)
    } else {
      await getCertUpHash();
      window.addEventListener('message', handleCertCompletion);
    }
  }
})

watch(() => router.currentRoute.value.params.stage, async (val) => {
  await accountDataUpdate();
  await progressUpdate();

  if (route.params.stage === 'default') {
    if(profileData.name && profileData.birthDate && profileData.gender) {
      await router.push(`/register/${routeFlow[routeFlow.indexOf(currentStage.value) + 1]}`)
    } else {
      await getCertUpHash();
      window.addEventListener('message', handleCertCompletion);
    }
  }
})
/** ******************************************************* **/

// 이용약관
const agreement = reactive([true, true, true]);
watch(agreement, (val) => {
  profileData.termsRequired = !!(val[0] && val[1]);
  profileData.termsOptional = !!val[2];
})
const termsAccept = async () => {
  termsRequired.value = true;
  localStorage.setItem('terms', 'true');

  if (route.params.stage === 'default') {
    if(profileData.name && profileData.birthDate && profileData.gender) {
      await router.push(`/register/${routeFlow[routeFlow.indexOf(currentStage.value) + 1]}`)
    } else {
      await getCertUpHash();
      window.addEventListener('message', handleCertCompletion);
    }
  }
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

const ProfileUpdateAction = (stage: string) => {
  http.post('/account/profile/update', {
    stage,
    data: toRaw(profileData)
  })
    .then(async (data: any) => {
      await accountDataUpdate()
      await progressUpdate()
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

const moveRouter = async (stage: string) => {
  await router.push(`/register/${stage}`)
  window.scrollTo(0, 0)
  root!.scrollTo(0, 0)
}

const handleUniversitySelect = (university: { schoolName: string; emailDomain: string }) => {
  if (university) {
    choiceSchool.name = university.schoolName;
    choiceSchool.domain = university.emailDomain;
  }

  findUniversityView.value = false;
};

const sendEmail = async () => {
  if (!schoolEmailId.value) {
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
    // email: `${schoolEmailId.value}@${choiceSchool.domain}`
    email: 'fksak80@gmail.com'
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

    universityIsVerifyView.value = false;
    universityISVerifyRetryView.value = false;
    profileData.certIsSchool = true;
    ProfileUpdateAction('school');
    toastRef.value?.addToast('ok', '이메일 인증에 성공했어요!');
    await moveRouter('job');
  } catch(e: any) {
    if(e.response.data.message === 'Invalid code') {
      toastRef.value?.addToast('warning', '잘못된 인증번호에요. 다시 확인해주세요');
    } else if(e.response.data.message === 'Expired code') {
      toastRef.value?.addToast('warning', '유효기간이 만료되었어요.');
    } else {
      await router.push('/');
    }
    // console.log(response.data.message);
    // useModalStore().setModal({
    //   type: 'alert',
    //   data: {
    //     title: '학교 이메일 인증 실패',
    //     message: response.data.message
    //   }
    // })
  }
}

</script>

<template>
  <div class="page" ref="page">
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
<!--      <StickyArea position="top" :style="{ backgroundColor: '#fff'}">-->
<!--        <ProgressBar class="progress-bar" :progress="progress" :processing="processing" style="z-index:1000;" />-->
<!--        <SubHeader />-->
<!--      </StickyArea>-->
      <div class="content-container" v-if="!certIsView">
        <div class="cert-container">
          <StickyArea position="top" :style="{ backgroundColor: '#fff'}">
            <SubHeader :show-back-button="false" />
          </StickyArea>

          <PageTitleAndDescription title="<span style='line-height: 38px;'>안전한 미팅을 위해<br>간단한 본인인증을 해주세요.</span>" description="입력해주신 개인정보는 철저히 보호됩니다." />
          <Gap :height="40" />
        </div>
      </div>

      <div class="content-container" style="padding: 0; height: 100vh; display: flex;" v-else>
        <div class="iframe-container">
          <Transition>
            <div v-if="!certData.certUp" class="loader">
              <div class="item-1"><span></span></div>
              <div class="item-2"><span></span></div>
              <div class="item-3"><span></span></div>
              <div class="item-4"><span></span></div>
              <div class="item-5"><span></span></div>
              <div class="item-6"><span></span></div>
              <div class="item-7"><span></span></div>
              <div class="item-8"><span></span></div>
            </div>
          </Transition>
          <iframe id="certIframe" name="certIframe" class="cert-iframe" v-show="certData.certUp" style="width: 100%; height: calc(100vh)"></iframe>
        </div>
      </div>
    </div>

    <div v-if="account.data?.accountMeta.stage === 'normal'">
      <StickyArea position="top" :style="{ backgroundColor: '#fff'}">
        <ProgressBar class="progress-bar" :progress="progress" :processing="processing" style="z-index:1000;" />
        <SubHeader :show-back-button="true" @back="() => {
          router.push('/');
          // ProfileUpdateAction('default', false)
          mp?.trackEvent('click_profile_normal_back');
        }" />
      </StickyArea>
      <div class="content-container">
        <PageTitleAndDescription title="프로필에 등록될 정보를<br>입력해주세요." description="연결된 상대에게 공개되는 프로필 정보입니다." />
        <Gap :height="40" />

<!--        <ProfileImage label="프로필 이미지" :required="true" :loading="ProfileUploaderLoading" :image-url="photos[0]?.image_path" @change="ProfileUploader" @error="(message: string) => {-->
<!--          useModalStore().setModal({-->
<!--            type: 'alert',-->
<!--            data: {-->
<!--              title: '이미지 업로드 실패',-->
<!--              message-->
<!--            }-->
<!--          })-->
<!--        }" />-->
<!--        <Gap :height="20" />-->

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

        <DeepSelect label="지역" placeholder="지역을 선택해주세요." modalTitle="지역을 선택해주세요." :required="true" @change="(val: string, val2: string) => {
          profileData.occupiedAreaHigh = val
          profileData.occupiedAreaLow = val2
        }" :value="profileData.occupiedAreaLow" :view-value="`${profileData.occupiedAreaHigh} ${profileData.occupiedAreaLow}`" :options="TEST_DEEP_SELECT_OPTIONS" :modal-option-cols="4" />
        <Gap :height="20" />

        <TextArea label="자기소개" :min-length="20" :max-length="500" :required="true" placeholder="나에 대해 소개해주세요!&#13;&#10;상세하게 작성할수록 매칭 확률이 올라갑니다.&#13;&#10;&#13;&#10;하는 일, 성격, 취미, 관심사 등은 물론,&#13;&#10;‘어필 요소’를 작성해보시는 것도 좋아요!" @input="(val: string) => {
          textArea.selfIntroduction = val
          if(val.length >= 20) {
            profileData.selfIntroduction = val
          } else {
            profileData.selfIntroduction = ''
          }
        }" :value="textArea.selfIntroduction || ''" />
      </div>
    </div>

    <div v-if="account.data?.accountMeta.stage === 'answer'">
      <StickyArea position="top" :style="{ backgroundColor: '#fff'}">
        <ProgressBar class="progress-bar" :progress="progress" :processing="processing" style="z-index:1000;" />
        <SubHeader :show-back-button="true" @back="() => {
          ProfileUpdateAction('normal')
          moveRouter('normal')
          mp?.trackEvent('click_profile_answer_back');
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
        }" :num-lines="6" :min-length="20" :max-length="500" :value="textArea.description1Answer" :requiredMessageVisible="false" placeholder="회사 동료, 대학 동기 등 주로 어떤 사람들과&#13;&#10;함께 나가게 될 것 같은지 적어주세요!&#13;&#10;&#13;&#10;(어떻게 아는지, 나이대, 어떤 사람들인지 등)" />
        <Gap :height="20" />

        <TextArea :question="question2" @input="(val: string) => {
          profileData.descriptions[1].title = question2;
          textArea.description2Answer = val;

          if(val.length >= 20) {
            profileData.descriptions[1].answer = val;
          } else {
            profileData.descriptions[1].answer = '';
          }
        }" :num-lines="6" :min-length="20" :max-length="500" :value="textArea.description2Answer" requiredMessage="(분위기, 인원수 등)" :requiredMessageVisible="true" placeholder="상대방이 많이 참고하는 정보입니다!&#13;&#10;자세히 작성할수록 매칭 확률이 올라가요!&#13;&#10;&#13;&#10;미팅 분위기, 인원수, 선호하는 장소, 위치 등&#13;&#10;자유롭게 기재해주세요. 이모지도 활용해보세요." />
        <Gap :height="20" />
      </div>
    </div>

    <div v-if="account.data?.accountMeta.stage === 'join'" style="height: 100vh;" class="join-bg">
      <div class="content-container" style="padding-top: 108px;">
        <div class="text-wrap">
          <h2 class="custom title">회원가입이 완료되었습니다!<br>인증 절차를 진행해주세요</h2>
          <p class="custom description">Meetple은 인증 기반의 서비스입니다.<br>학교나 커리어 정보를 인증한 회원에 한해,<br>추천 매칭을 해드리고 있어요!<br>지금 바로 인증하고, 새로운 인연을 만나보세요.</p>
        </div>
        <Gap :height="40" />
      </div>
    </div>

    <div v-if="account.data?.accountMeta.stage === 'job'">
      <StickyArea position="top" :style="{ backgroundColor: '#fff'}">
<!--        <ProgressBar class="progress-bar" :progress="progress" :processing="processing" style="z-index:1000;" />-->
        <SubHeader :show-back-button="true" @back="() => {
          if(account.data.accountMeta.cert_flow === 'job') {
            moveRouter('join')
          } else {
            ProfileUpdateAction('school')
            moveRouter('school')
          }
          mp?.trackEvent('click_profile_job_back');
        }" />
      </StickyArea>
      <div class="content-container">
        <PageTitleAndDescription v-if="account.data.accountMeta.cert_flow === 'job'" title="프로필에 등록될<br>커리어를 인증해주세요." description="공개 가능한 선에서 커리어 정보를 입력한 후,<br>이를 인증할 수 있는 이미지를 제출해주세요.<br>구체적으로 작성하실수록 좋아요!" />
        <PageTitleAndDescription v-if="account.data.accountMeta.cert_flow === 'school'" title="프로필에 나타낼<br>커리어 정보를 입력해보세요" description="공개 가능한 선에서 커리어 정보를 입력해보세요.<br>나에 대해 더 많은 정보를 입력할수록, 매칭확률이 높아져요.<br>구체적으로 작성하실수록 좋아요!" />
        <Gap :height="40" />

        <TextInput label="나의 커리어" placeholder="Ex. 대기업 개발자, 스타트업 PM, 회계사 등" optional-text="(직무, 규모 등)" :required="false" :validate="(val: string) => {
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
        <span v-if="account.data.accountMeta.cert_flow === 'job'" style="color: #7F7F7F; font-size: 11px; font-weight: 500; line-height: 20px;">* 상대방의 입장에서 파악이 어렵다고 판단되는 경우 승인이 거절됩니다.</span>
        <Gap :height="20" />

        <Image v-if="account.data.accountMeta.cert_flow === 'job'" label="증빙 이미지 등록" :required="true" :loading="JobUploaderLoading" :image-url="jobs[0]?.image_path" @change="JobUploader" description="명함, 재직 증명서, 면허 및 자격증 등의<br>이미지를 1장 등록해주세요." @error="(message: string) => {
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
      <StickyArea position="top" :style="{ backgroundColor: '#fff'}" v-if="!universityIsVerifyView">
        <SubHeader :show-back-button="true" @back="() => {
          if(account.data.accountMeta.cert_flow === 'job') {
            ProfileUpdateAction('job')
            moveRouter('job')
          } else {
            moveRouter('join')
          }
          mp?.trackEvent('click_profile_school_back');
        }" />
      </StickyArea>

      <StickyArea position="top" :style="{ backgroundColor: '#fff'}" v-else-if="universityIsVerifyView && !universityISVerifyRetryView">
        <SubHeader :show-back-button="true" @back="() => {
          universityIsVerifyView = false;
        }" />
      </StickyArea>

      <StickyArea position="top" :style="{ backgroundColor: '#fff'}" v-else>
        <ProgressBar class="progress-bar" :progress="40" :processing="processing" style="z-index: 1000;" />
        <SubHeader :show-back-button="true" @back="() => {
          universityIsVerifyView = false;
          universityISVerifyRetryView = false;
        }" />
      </StickyArea>

      <div class="content-container" v-if="!universityIsVerifyView">
        <PageTitleAndDescription v-if="account.data.accountMeta.cert_flow === 'job'" title="프로필에 나타낼<br>대학교를 입력할 수 있어요" description="나에 대해 더 많은 정보를 입력할수록, 매칭확률이 높아져요." />
        <PageTitleAndDescription v-if="account.data.accountMeta.cert_flow === 'school'" title="프로필에 등록될<br>대학교를 인증해주세요." description="" />
        <Gap :height="40" />

        <TextInput label="학교 검색" placeholder="졸업·재학 대학교 이름을 검색해주세요" optional-text="" :required="false" :value="choiceSchool.name" @click="() => {
          findUniversityView = true;
        }" />
        <Gap :height="40" />
        <TextInputSchool v-if="profileData?.certFlow == 'school'" label="학교 이메일" placeholder="아이디 입력" optional-text="" :required="false" :value="schoolEmailId" :domain="choiceSchool.domain" @input="(v) => {
          schoolEmailId = v;
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
          <PageTitleAndDescription title="<span style='line-height: 38px;'>보내드린 인증번호를<br>입력해주세요</span>" :description="`<span style='color: #6726FE;'>${schoolEmailId}@${choiceSchool.domain}</span>로 인증 번호를 보내드렸어요.`" />
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

    <div v-if="account.data?.accountMeta.stage === 'request'">
      <StickyArea position="top" :style="{ backgroundColor: '#fff'}">
        <ProgressBar class="progress-bar" :progress="progress" :processing="processing" style="z-index:1000;" />
        <SubHeader :show-back-button="false" />
      </StickyArea>
      <div class="content-container">
        <PageTitleAndDescription title="가입 승인을 위해<br>인증 심사중이에요." description="신뢰도 기반의 미팅을 위해 인증 절차를 진행하고 있어요.<br>인증이 승인되면 문자를 통해 안내해드릴게요!" />
        <Gap :height="40" />
        <UserProfileInfo
          :name="account.data.accountMeta.nick_name"
          :message="profileData.selfIntroduction"
          :age="calculateAge(profileData.birthDate)"
          :job="profileData.job"
          :mbti="profileData.mbti"
          :location="`${profileData.occupiedAreaHigh} ${profileData.occupiedAreaLow}`"
          :school="profileData.school"
        />
<!--        :image-url="photos[0].image_path"-->
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

  <!-- --------------------------------------------------------------------------------- -->

  <div class="find-university" v-if="findUniversityView">
    <SearchUniversity @select="handleUniversitySelect" @close="() => {
      findUniversityView = false;
    }" />
  </div>

  <StickyArea position="bottom" :style="{ padding: '14px 16px' }" v-if="account.data?.accountMeta.stage === 'default' && !termsRequired">
    <SubmitButton @click="() => {
      termsAccept();
      mp?.trackEvent('click_terms_agree');
    }" :disabled="!agreement[0] || !agreement[1]" :style="{
          backgroundColor: '#6726FE',
        }">다음</SubmitButton>
  </StickyArea>

  <StickyArea position="bottom" :style="{ padding: '14px 16px' }" v-if="account.data?.accountMeta.stage === 'default' && termsRequired && !certIsView">
    <SubmitButton @click="() => {
        certIsView = true;
        mp?.trackEvent('click_cert_view');
        getCertUpHash();
    }" :style="{
          backgroundColor: '#6726FE',
        }">본인인증 하기</SubmitButton>
  </StickyArea>

  <StickyArea position="bottom" :style="{ padding: '14px 16px' }" v-if="account.data?.accountMeta.stage === 'normal'">
    <SubmitButton @click="() => {
      ProfileUpdateAction('normal')
      moveRouter('answer')
      mp?.trackEvent('click_profile_normal_update');
    }" :disabled="!profileData.nickName || !profileData.mbti || !profileData.occupiedAreaHigh || !profileData.occupiedAreaLow || !profileData.selfIntroduction" :style="{
          backgroundColor: '#6726FE',
        }">다음</SubmitButton>
  </StickyArea>

  <StickyArea position="bottom" :style="{ display: 'flex', flexDirection: 'row', padding: '14px 16px' }" v-if="account.data?.accountMeta.stage === 'answer'">
    <SubmitButton @click="() => {
      ProfileUpdateAction('answer')
      moveRouter('join')
      mp?.trackEvent('click_profile_request');
    }" :disabled="(profileData.descriptions ? !profileData.descriptions[0].answer : true) || (profileData.descriptions ? !profileData.descriptions[1].answer : true)" :style="{
        backgroundColor: '#6726FE',
      }">다음</SubmitButton>
  </StickyArea>

  <StickyArea position="bottom" style="flex-direction: column; gap: 7px;" :style="{ display: 'flex', padding: '14px 16px' }" v-if="account.data?.accountMeta.stage === 'join'">
    <SubmitButton @click="() => {
      profileData.certFlow = 'school'
      ProfileUpdateAction('join')
      moveRouter('school')
      universityIsVerifyView = false;
      universityISVerifyRetryView = false;
      mp?.trackEvent('click_join_school_choice');
    }" :style="{
        backgroundColor: '#6726FE',
    }">대학교 인증하기</SubmitButton>

    <SubmitButton @click="() => {
      profileData.certFlow = 'job'
      ProfileUpdateAction('join')
      moveRouter('job')
      mp?.trackEvent('click_join_job_choice');
    }" :style="{
        backgroundColor: '#6726FE',
    }">커리어 인증하기</SubmitButton>
  </StickyArea>

  <StickyArea position="bottom" :style="{ padding: '14px 16px' }" v-if="account.data?.accountMeta.stage === 'job'">
    <div class="job-flow" v-if="profileData.certFlow === 'job'">
      <SubmitButton @click="() => {
        ProfileUpdateAction('job')
        moveRouter('school')
        mp?.trackEvent('click_profile_job_update');
      }" :disabled="!profileData.job || !jobRequired" :style="{
            backgroundColor: '#6726FE',
          }">완료</SubmitButton>
    </div>

    <div class="school-flow" :style="{ display: 'flex', flexDirection: 'row', gap: '12px' }" v-else>
      <Button @click="() => {
        ProfileUpdateAction('request')
        router.push({ name: 'match' })

        useModalStore().setModal({
          type: 'welcome',
          data: {
            title: '환영해요!<br>Meetple의 회원이 되셨어요!',
            message: '추천 미팅 상대를을 문자로 알려드릴게요! 📮<br>문자로 보내드린 서비스 이용안내를 참고해주세요.'
          }
        })
      }" :style="{
        justifyContent: 'center',
        flex: 1,  /* 50% 영역을 자동으로 차지 */
        height: '52px',
        borderRadius: '26px',
        fontSize: '17px',
        minWidth: '120px' /* 최소 크기 설정 */
      }">건너뛰기</Button>

      <SubmitButton @click="() => {
        ProfileUpdateAction('request')
        router.push({ name: 'match' })

        useModalStore().setModal({
          type: 'welcome',
          data: {
            title: '환영해요!<br>Meetple의 회원이 되셨어요!',
            message: '추천 미팅 상대를을 문자로 알려드릴게요! 📮<br>문자로 보내드린 서비스 이용안내를 참고해주세요.'
          }
        })
    }" :disabled="!profileData.job" :style="{
        flex: 1, /* 50% 영역을 자동으로 차지 */
        backgroundColor: '#6726FE',
        height: '52px',
        minWidth: '120px' /* 최소 크기 설정 */
    }">완료</SubmitButton>
    </div>
  </StickyArea>

  <StickyArea position="bottom" :style="{ padding: '14px 16px' }" v-if="account.data?.accountMeta.stage === 'school' && !universityIsVerifyView">
    <div class="job-flow" style="display: flex;" v-if="profileData.certFlow === 'job'">
      <Button @click="() => {
        ProfileUpdateAction('request')
        moveRouter('request')
      }" :style="{
        justifyContent: 'center',
        flex: 1,  /* 50% 영역을 자동으로 차지 */
        height: '52px',
        borderRadius: '26px',
        fontSize: '17px',
        minWidth: '120px' /* 최소 크기 설정 */
      }">건너뛰기</Button>

      <SubmitButton @click="() => {
        profileData.school = choiceSchool.name
        ProfileUpdateAction('request')
        moveRouter('request')
      }" :disabled="!choiceSchool.name" :style="{
          flex: 1, /* 50% 영역을 자동으로 차지 */
          backgroundColor: '#6726FE',
          height: '52px',
          minWidth: '120px' /* 최소 크기 설정 */
      }">완료</SubmitButton>
    </div>

    <div class="school-flow" :style="{ display: 'flex', flexDirection: 'row', gap: '12px' }" v-else>
      <SubmitButton @click="() => {
        profileData.school = choiceSchool.name;
        profileData.certSchoolEmail = `${schoolEmailId}@${choiceSchool.domain}`
        sendEmail();
      }" :disabled="!choiceSchool.name || !schoolEmailId" :style="{
            backgroundColor: '#6726FE',
          }">인증 메일 받기</SubmitButton>
    </div>
  </StickyArea>

  <StickyArea position="bottom" :style="{ padding: '14px 16px' }" v-if="account.data?.accountMeta.stage === 'school' && universityIsVerifyView">
    <SubmitButton @click="() => {
      sendEmailCodeVerify();
    }" :disabled="choiceSchool.code.length < 6" :style="{
        backgroundColor: '#6726FE',
      }">인증하기</SubmitButton>
  </StickyArea>

  <StickyArea position="bottom" :style="{ padding: '14px 16px' }" v-if="account.data?.accountMeta.stage === 'reject'">
    <SubmitButton @click="() => {
      ProfileUpdateAction('job')
      mp?.trackEvent('click_profile_reject_update');
    }" :style="{
        backgroundColor: '#6726FE',
      }">인증 다시 진행하기</SubmitButton>
  </StickyArea>

  <ToastContainer ref="toastRef" />

</template>

<style scoped>
.page {
  min-height: 100vh;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.loader {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  font-size: 32px;
}
.loader div {
  position: absolute;
  top: 50%;
  left: 50%;
  will-change: transform;
}
.loader div span {
  display: block;
  width: 0.5em;
  height: 0.15em;
  background: black;
  -webkit-border-radius: 0.08em;
  border-radius: 0.08em;
}
.loader .item-1 {
  margin-left: 11.313708496px;
  margin-top: -11.313708496px;
  animation: spin_full 2s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;
}
.loader .item-1 span {
  transform: rotate(45deg) translateZ(0);
}
.loader .item-2 {
  margin-left: 0px;
  margin-top: -16px;
  animation: spin_full 2s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;
}
.loader .item-2 span {
  transform: rotate(180deg) translateZ(0);
}
.loader .item-3 {
  margin-left: -11.313708496px;
  margin-top: -11.313708496px;
  animation: spin_full 2s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;
}
.loader .item-3 span {
  transform: rotate(135deg) translateZ(0);
}
.loader .item-4 {
  margin-left: -16px;
  margin-top: 0px;
  animation: spin_full 2s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;
}
.loader .item-4 span {
  transform: rotate(270deg) translateZ(0);
}
.loader .item-5 {
  margin-left: -11.313708496px;
  margin-top: 11.313708496px;
  animation: spin_full 2s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;
}
.loader .item-5 span {
  transform: rotate(225deg) translateZ(0);
}
.loader .item-6 {
  margin-left: 0px;
  margin-top: 16px;
  animation: spin_full 2s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;
}
.loader .item-6 span {
  transform: rotate(360deg) translateZ(0);
}
.loader .item-7 {
  margin-left: 11.313708496px;
  margin-top: 11.313708496px;
  animation: spin_full 2s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;
}
.loader .item-7 span {
  transform: rotate(315deg) translateZ(0);
}
.loader .item-8 {
  margin-left: 16px;
  margin-top: 0px;
  animation: spin_full 2s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;
}
.loader .item-8 span {
  transform: rotate(450deg) translateZ(0);
}

.content-container {
  padding: 16px 16px 16px;
}

.iframe-container {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.cert-iframe {
  width: 100%;
  height: 500px;
  border: none;
}

@keyframes spin_full {
  0% {
    transform: rotate(0deg) translateZ(0);
  }
  100% {
    transform: rotate(360deg) translateZ(0);
  }
}

.custom.title {
  white-space: pre-line;
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  line-height: 38px;
}
.custom.description {
  white-space: pre-line;
  margin-top: 10px;
  font-size: 14px;
  font-weight: 500;
  color: #EAEDF1;
  line-height: 20px;
}

.join-bg {
  overflow: hidden;
  background: url('@/assets/images/join-bg.png') repeat top;
}

.find-university {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
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
