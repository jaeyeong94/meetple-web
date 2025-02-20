<script setup lang="ts">
import router from '@/router'
import { useModalStore } from '@/stores/modal'
import { onMounted } from 'vue'

onMounted(async () => {
  useModalStore().setModal({
    type: "alert",
    data: {
      title: "결제 실패",
      message: "결제가 실패하였습니다.",
    },
  });

  await router.push({ name: 'point' })
});

</script>

<template>

</template>

<style scoped>

</style>
