<script setup lang="ts">
import StickyArea from '@/components/StickyArea.vue'
import SubHeader from '@/components/SubHeader.vue'
import NotificationItem from '@/components/NotificationItem.vue'
import { TEST_ACTION_DATA, TEST_NOTIFICATIONS } from '@/consts/testData'
import http from '@/lib/http'
import router from '@/router'
import dayjs from 'dayjs'
import { onMounted, reactive, ref, type Ref } from 'vue'

const account: any = reactive({});
const notification: any = reactive([]);

const accountUpdate = async () => {
  const accountResponse = await http.get('/account');
  Object.assign(account, accountResponse.data);
  Object.assign(notification, accountResponse.data.data.accountNotifications);
}

onMounted(async () => {
  await accountUpdate();

  // 튕겨내기
  if(!account.data) {
    localStorage.removeItem('token')
    await router.push('/login')
  }

  if(account.data.accountMeta.stage !== 'approve') {
    await router.push('/register')
  }
})

</script>

<template>
  <StickyArea position="top" :style="{ backgroundColor: '#fff'}">
    <SubHeader title="알림" :show-back-button="true" @back="() => {
      router.back();
    }" />
  </StickyArea>
  <div class="page">
    <div v-for="n in notification" :key="notification.id">
      <NotificationItem :type="n.type" :content="n.description" :date="dayjs(n.created_at).format('YYYY-MM-DD')" @click="() => {
        router.push(`/match/profile/${n.behavior}`)
      }" />
    </div>
  </div>
</template>

<style scoped>
.page {
  padding: 16px;
}
</style>
