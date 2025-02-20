<script setup lang="ts">
import http from '@/lib/http'
import router from '@/router'
import { useModalStore } from '@/stores/modal'
import { onMounted } from 'vue'

onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const paymentType = urlParams.get("paymentType");
  const paymentKey = urlParams.get("paymentKey");
  const orderId = urlParams.get("orderId");
  const amount = urlParams.get("amount");

  const verifyResponse = await http.post('account/pay/order/verify', {
    paymentType, paymentKey, orderId, amount
  });

  // console.log(verifyResponse);

  if (verifyResponse.status === 201) {
    useModalStore().setModal({
      type: "alert",
      data: {
        title: "결제 성공",
        message: "결제가 성공하였습니다.",
      },
    });

    await router.push({ name: 'point' });
    console.log('결제 성공');
  } else {
    useModalStore().setModal({
      type: "alert",
      data: {
        title: "결제 실패",
        message: "결제가 실패하였습니다.",
      },
    });

    await router.push({ name: 'point' });
    console.error('결제 실패');
  }
});
</script>

<template>

</template>

<style scoped>

</style>
