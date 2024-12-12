<script setup lang="ts">
import IcMainLogo from '@/components/icons/IcMainLogo.vue'
import SubmitButton from '@/components/SubmitButton.vue'
import type MixpanelService from '@/lib/mixpanel'
import { inject, onMounted, onUnmounted, ref } from 'vue'

let timeout = 0

const mp = inject<MixpanelService>('mixpanel')

const onboarding = localStorage.getItem('onboarding')
const onboardingState = ref(1);

const resizeBackground = () => {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    const background = document.querySelector('.background') as HTMLImageElement
    const banner = document.querySelector('.banner') as HTMLElement

    if (banner.clientWidth / banner.clientHeight < 375 / 910) {
      background.classList.add('height')
    } else {
      background.classList.remove('height')
    }
  }, 1)
}

onMounted(() => {
  resizeBackground()
  window.addEventListener('resize', resizeBackground)
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeBackground)
})

const next = () => {
  mp?.trackEvent(`onboarding_btn_${onboardingState.value}`)

  if(onboardingState.value === 3) {
    localStorage.setItem('onboarding', 'true')
    location.href = '/login'
  } else {
    onboardingState.value += 1
  }
}
</script>

<template>
  <div class="onboarding" v-if="!onboarding">
    <div class="step-01" v-show="onboardingState === 1">
      <h2>퇴근 후<br>친구와 함께</h2>
    </div>
    <div class="step-02" v-show="onboardingState === 2">
      <h2>신뢰할 수 있는<br>직장인들과</h2>
    </div>
    <div class="step-03" v-show="onboardingState === 3">
      <h2>매주 새로운 연결</h2>
    </div>
    <SubmitButton style="background-color: #6726FE" @click="next">다음</SubmitButton>
  </div>

  <div class="banner" v-else>
    <div class="container">
      <span class="subtitle">친구와 함께 직장인 미팅</span>
      <IcMainLogo />
    </div>
    <router-link to="/login" style="width: 100%; z-index: 1000;" @click="() => {
      mp?.trackEvent('start')
    }"><SubmitButton>서비스 시작하기</SubmitButton></router-link>
    <img src="@/assets/images/background.png" class="background" alt="" />
  </div>
</template>

<style scoped>
.onboarding {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100dvh;
  background-color: #000;
  box-sizing: border-box;
  overflow: hidden;
  padding: 25px 16px;

  .step-01 {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    h2 {
      font-size: 24px;
      font-weight: 700;
      color: #fff;
      text-align: center;
      line-height: 1.5;
      position:relative;
      z-index:1000;
    }

    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: url('@/assets/images/onboarding-01.png');
      background-size: cover;
      background-position: bottom;
      opacity: 0.7;
    }
  }

  .step-02 {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    h2 {
      font-size: 24px;
      font-weight: 700;
      color: #fff;
      text-align: center;
      line-height: 1.5;
      position:relative;
      z-index:1000;
    }

    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: url('@/assets/images/onboarding-02.png');
      background-size: cover;
      background-position: bottom;
      opacity: 0.7;
    }
  }

  .step-03 {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    h2 {
      font-size: 24px;
      font-weight: 700;
      color: #fff;
      text-align: center;
      line-height: 1.5;
      position:relative;
      z-index:1000;
    }

    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: url('@/assets/images/onboarding-03.png');
      background-size: cover;
      background-position: bottom;
      opacity: 0.7;
    }
  }
}

.banner {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100dvh;
  background-color: #EAE1FF;
  padding: 25px 16px;
  box-sizing: border-box;
  overflow: hidden;
}
.container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1;
}
.subtitle {
  width: fit-content;
  font-size: 16px;
  font-weight: 700;
  color: transparent;
  background: linear-gradient(to right, #6726FE, #ED2EBA);
  background-clip: text;
  -webkit-background-clip: text;
  margin-bottom: 2px;
}
.submit-button {
  margin-top: 40px;
  height: 63px;
  border-radius: 63px;
  box-shadow: 0 9px 20px 0 rgba(0, 0, 0, .45);
  z-index: 1;
}
.background {
  position: absolute;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  width: 100%;
  height: auto;
  min-height: 910px;
  object-fit: cover;
  object-position: center;
  z-index: 0;
}
.background.height {
  width: auto;
  height: 100%;
}

@media (max-width: 960px) {
  .banner {
    width: 100%;
  }
}


</style>
