<script setup lang="ts">
import IcLogo from '@/components/icons/IcLogo.vue'
import NotificationButton from '@/components/buttons/NotificationButton.vue'
import UserProfileButton from '@/components/buttons/UserProfileButton.vue'
import type MixpanelService from '@/lib/mixpanel'
import { inject } from 'vue'

const props = defineProps({
  imageUrl: String,
  hasUnreadNotification: Boolean,
})

const mp = inject<MixpanelService>('mixpanel')
const emit = defineEmits(['notification', 'profile'])
</script>

<template>
  <header class="header">
    <div class="logo-wrapper">
      <router-link to="/match"><IcLogo /></router-link>
    </div>
    <NotificationButton :showIndicator="props.hasUnreadNotification" @click="() => {
      emit('notification')
      mp?.trackEvent('click_notification')
    }" />
    <UserProfileButton :imageUrl="props.imageUrl" @click="() => {
      emit('profile')
      mp?.trackEvent('click_profile')
    }" />
  </header>
</template>

<style scoped>
.header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 5px 16px;
}
.logo-wrapper {
  display: flex;
  flex: 1;
}
</style>
