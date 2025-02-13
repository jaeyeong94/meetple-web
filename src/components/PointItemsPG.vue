<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ActionButton from '@/components/buttons/ActionButton.vue'
import MoreButton from '@/components/buttons/MoreButton.vue'
import Divider from '@/components/Divider.vue'
import Gap from '@/components/Gap.vue'
import IcLogo from '@/components/icons/IcLogo.vue'
import IcPointLogo from '@/components/icons/IcPointLogo.vue'
import SubmitButton from '@/components/SubmitButton.vue'
import { formatNumber } from '@/lib/utils'
import type { PropType } from 'vue'
import { loadTossPayments, type TossPaymentsSDK } from '@tosspayments/tosspayments-sdk'

const emit = defineEmits(['click', 'event'])

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

onMounted(async () => {
  try {
    tossPayments.value = await loadTossPayments(clientKey);
    widgets.value = tossPayments.value.widgets({
      customerKey,
    });
    console.log("TossPayments SDK 로드 성공", tossPayments.value);
  } catch (error) {
    console.error("TossPayments SDK 로드 실패", error);
  }
});

// 결제 요청
const pgCall = async (price: number, amount: string) => {
  if (!tossPayments.value) {
    console.error("TossPayments SDK가 로드되지 않았습니다.");
    return;
  }

  const tossWidgets = widgets.value;

  await tossWidgets.setAmount({
    value: price,
    currency: "KRW",
  });

  await Promise.all([
    // ------  결제 UI 렌더링 ------
    tossWidgets.renderPaymentMethods({
      selector: "#payment-method",
      variantKey: "DEFAULT",
    }),
    // ------  이용약관 UI 렌더링 ------
    tossWidgets.renderAgreement({ selector: "#agreement", variantKey: "AGREEMENT" }),
  ]);

  await tossWidgets.requestPayment({
    orderId: "IxwE0R9Y5vMJ3unlTMs4V",
    orderName: `캔디 ${amount}개 충전`,
    successUrl: window.location.origin + "/success.html",
    failUrl: window.location.origin + "/fail.html",
    customerEmail: "customer123@gmail.com",
    customerName: "홍길동",
    customerMobilePhone: "01012341234",
  });
}
</script>

<template>
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

    <div id="payment-method">

    </div>

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
