<script setup lang="ts">
import StickyArea from '@/components/StickyArea.vue'
import SubHeader from '@/components/SubHeader.vue'
import NotificationItem from '@/components/NotificationItem.vue'
import { TEST_ACTION_DATA, TEST_NOTIFICATIONS } from '@/consts/testData'

</script>

<template>
  <StickyArea position="top" :style="{ backgroundColor: '#fff'}">
    <SubHeader title="알림" :action-button-data="TEST_ACTION_DATA" :show-back-button="true" @back="() => {}" />
  </StickyArea>
  <div class="page">
    <div v-for="notification in TEST_NOTIFICATIONS.reverse()" :key="notification.id">
      <NotificationItem :type="notification.type" :content="notification.content" :date="notification.date" />
    </div>
  </div>
</template>

<style scoped>
.page {
  padding: 16px;
}
</style>
