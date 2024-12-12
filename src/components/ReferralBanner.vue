<script setup lang="ts">
import IcGrayArrow from '@/components/icons/IcGrayArrow.vue'
import http from '@/lib/http'
import { onMounted, ref } from 'vue'

const bannerWidth = ref('100%');

const onResize = () => {
  const pageElement = document.querySelector('.page');
  if (pageElement) {
    bannerWidth.value = `${pageElement.clientWidth - 32}px`;
  }
}

onMounted(() => {
  onResize();
  window.addEventListener('resize', onResize);
});

const share = async () => {
  if (navigator.share) {
    const referralCode = (await http.get('account/referral-code')).data.data.referralCode;
    const url = `${window.location.protocol}//${window.location.host}?referralCode=${referralCode}`;

    try {
      await navigator.share({
        title: "Meetple",
        text: "함께 미팅 나가고 싶은 친구를 초대하세요!",
        url,
      });
      console.log("공유가 성공적으로 완료되었습니다.");
    } catch (error) {
      console.error("공유가 취소되었거나 실패했습니다:", error);
    }
  } else {
    alert("공유하기 기능이 지원되지 않는 디바이스입니다.");
  }
}

</script>

<template>
  <div class="banner" :style="{ width: bannerWidth }" @click="share">
    <div class="icon">
      <img src="@/assets/images/logo.png" alt="alert-icon" />
    </div>
    <div class="container">
      <p class="title">함께 미팅 나가고 싶은 친구 초대하기</p>
      <p class="description">초대한 친구가 가입하면 캔디 10개를 드려요!</p>
    </div>
    <div class="arrow">
      <IcGrayArrow />
    </div>
  </div>
</template>

<style scoped>
.banner {
  cursor: pointer;

  position: fixed;
  bottom: 16px;
  box-sizing: border-box;
  width: calc(375px - 32px);

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: start;
  gap: 12px;
  padding: 16px;
  border-radius: 17px;
  border: 1px solid #EFEFEF;
  background: #FFF;
  box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.19);

  .icon {
    & > img {
      width: 38px;
      height: 38px;
    }
  }

  .arrow {
    margin-left: auto;
  }

  .container {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .title {
      color: #000;
      font-size: 14px;
      font-style: normal;
      font-weight: 700;
      line-height: 18px;
    }

    .description {
      color: #8E8E8E;
      font-size: 12px;
      font-style: normal;
      font-weight: 500;
      line-height: 18px;
    }
  }
}

</style>
