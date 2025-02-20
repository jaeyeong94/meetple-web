<script setup lang="ts">
import BackButton from '@/components/buttons/BackButton.vue'
import { useModalStore } from '@/stores/modal'
import { ref, onMounted, reactive } from 'vue'
import Gap from '@/components/Gap.vue'
import IcLogo from '@/components/icons/IcLogo.vue'
import IcPointLogo from '@/components/icons/IcPointLogo.vue'
import SubmitButton from '@/components/SubmitButton.vue'
import { formatNumber } from '@/lib/utils'
import type { PropType } from 'vue'
import { clearTossPayments, loadTossPayments, type TossPaymentsSDK } from '@tosspayments/tosspayments-sdk'
import { v4 as uuidv4 } from 'uuid'
import http from '@/lib/http'

const emit = defineEmits(['click', 'event'])
const paymentOpen = ref(false)
const paymentLoading = ref(false)

const props = defineProps({
  subHeader: {
    type: String,
    required: true
  },
  items: {
    type: Array as PropType<any[]>,
    required: true
  },
  hidden: {
    type: Boolean,
    default: false
  }
})

// TossPayments 인스턴스를 저장할 ref 생성
const tossPayments = ref<TossPaymentsSDK | null>(null)
const widgets = ref<any>(null)

// ------  결제위젯 초기화 ------
const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
const customerKey = "FMjZgN_-rFwPoHMSAJEFT";

// 결제 정보
const payInfo = reactive({
  orderId: '',
  price: 0,
  amount: '',
});

onMounted(async () => {
  try {
    tossPayments.value = await loadTossPayments(clientKey);
    widgets.value = tossPayments.value.widgets({
      customerKey,
    });

    await widgets.value.setAmount({
      value: 50000,
      currency: "KRW",
    });

    await Promise.all([
      // ------  결제 UI 렌더링 ------
      widgets.value.renderPaymentMethods({
        selector: "#payment-method",
        variantKey: "DEFAULT",
      }),
      // ------  이용약관 UI 렌더링 ------
      widgets.value.renderAgreement({ selector: "#agreement", variantKey: "AGREEMENT" }),
    ]);

    console.log("TossPayments SDK 로드 성공", tossPayments.value);
  } catch (error) {
    console.error("TossPayments SDK 로드 실패", error);
  }
});

// 구매 요청
const pgCall = async (price: number, amount: string) => {
  if (!tossPayments.value) {
    console.error("TossPayments SDK가 로드되지 않았습니다.");
    return;
  }

  await widgets.value.setAmount({
    value: price,
    currency: "KRW",
  });

  payInfo.price = price;
  payInfo.amount = amount;

  paymentOpen.value = true;
}

// 결제 요청
const pgRequest = async () => {
  if (!tossPayments.value) {
    console.error("TossPayments SDK가 로드되지 않았습니다.");
    return;
  }

  const orderId = uuidv4();
  payInfo.orderId = orderId;

  try {
    paymentLoading.value = true;

    try {
      await http.post("/account/pay/order", {
        orderId,
        price: payInfo.price,
        amount: payInfo.amount,
      });

      const response = await widgets.value.requestPayment({
        orderId,
        orderName: `캔디 ${payInfo.amount}개 충전`,
        successUrl: window.location.origin + "/point/success",
        failUrl: window.location.origin + "/point/fail",
        customerEmail: "customer123@gmail.com",
        customerName: "김토스",
        customerMobilePhone: "01012341234",
      });

      console.log("결제 요청 성공", response);
    } catch (error) {
      console.error("결제 정보 저장 실패", error);
      return;
    }
  } catch (error) {
    console.error("결제 실패", error);
  } finally {
    paymentLoading.value = false;
  }
}
</script>

<template>
  <div class="payment-wrap" :class="{
      open: paymentOpen
    }">
    <div id="payment">
      <BackButton @click="() => {
        paymentOpen = false;
      }" style="margin-left: 10px; margin-top: 10px;" />
      <div id="payment-method"></div>
      <div id="agreement"></div>
      <button class="button" id="payment-button" @click="pgRequest">결제하기</button>
    </div>
  </div>

  <div :class="{
    hidden: props.hidden
  }">
    <div class="title">
      <IcLogo />
      <IcPointLogo />
      <p style="position: absolute; right: 16px; font-size: 12px; color: #898A8D;">{{props.subHeader}}</p>
    </div>

    <Gap :height="16" />
    <!--  <div class="event" @click="() => emit('event')">-->
    <!--    <img class="icon" src="@/assets/images/logo.png" alt="Point" />-->
    <!--    <div class="text">-->
    <!--      <p class="event-title">밋플(Meetple) 오픈 Event</p>-->
    <!--      <p class="event-description">캔디 30개를 무료로 드려요! (최대 30개 보유 가능)</p>-->
    <!--    </div>-->
    <!--    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">-->
    <!--      <path d="M6.25146 14.5234L12.387 8.38788L6.25146 2.25232" stroke="#A4A4A4" stroke-width="2.1"/>-->
    <!--    </svg>-->
    <!--  </div>-->
    <!--  <Gap :height="30" />-->

    <ul class="point-items">
      <li v-for="(item) in props.items" :key="item.id">
        <img class="icon" src="@/assets/images/logo.png" alt="Point" />
        <p class="point"><span>{{item.charge_currency}}</span> 캔디</p>
        <SubmitButton class="button" :class="{ disabled: !item.visible }" @click="() => {
          if(item.visible) {
            pgCall(item.price, item.charge_currency);
            emit('click', item.id);
          }
        }">₩ {{formatNumber(item.price)}}</SubmitButton>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.hidden {
  opacity: 0.4;
}

.payment-wrap {
  visibility: hidden;
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  z-index: 1000;

  &.open {
    visibility: visible;
  }
}

#payment {
  width: 700px;
  border-radius: 20px;
  overflow: hidden;
  z-index: 1000;
  background-color: rgba(255, 255, 255, 1);
  border: 1px solid #eee;

  #payment-method {
    width: 100%;
  }

  #agreement {
    width: 100%;
  }

  #payment-button {
    width: 100%;
    height: 60px;
    background-color: #3282f6;
    color: #fff;
    font-size: 18px;
    font-weight: 700;
  }
}

@media (max-width: 499px) {
  .payment-wrap {
    background-color: #fff;
    align-items: start;
    overflow: auto;

    #payment {
      width: 100%;
      border-radius: 0;
      min-height: 800px;

      #payment-button {
        position: fixed;
        bottom: 0;
        width: 100%;
        height: 50px;
        font-size: 16px;
      }
    }
  }
}

@media (max-width: 960px) {

}

.title {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  margin-bottom: 8px;
}
.point-items {
  display: flex;
  flex-direction: column;
  padding: 0 16px;
  background-color: #F4F4F4;
  border-radius: 16px;
}
.point-items > li {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 9px;
  padding: 20px 16px;
  border-bottom: 1px solid #DFDFDF;

  &:last-child {
    border-bottom: none;
  }
}
.icon {
  width: 40px;
  height: 40px;
}
.point {
  flex: 1;
  font-size: 18px;
  font-weight: 700;
  color: #000;
}
.point span {
  color: #6751FF;
}
.button {
  width: auto;
  height: 38px;
  padding: 0 18px;
  background-color: #6751FF;
}

.disabled{
  background-color: #D1D1D1;
  color: #fff;
  cursor: not-allowed;
}

.event {
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 3px;
  justify-content: space-between;
  padding: 16px;
  background-color: #E9E9FF;
  border-radius: 16px;

  .event-title {
    color: #000;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: 18px; /* 128.571% */
  }

  .event-description {
    color: #55535A;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 18px; /* 150% */
  }
}
</style>
