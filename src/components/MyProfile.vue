<script setup lang="ts">
import EditButton from '@/components/buttons/EditButton.vue'

const props = defineProps({
  name: {
    type: String,
    required: false,
  },
  message: {
    type: String,
    required: false,
  },
  imageUrl: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['click'])
</script>

<template>
  <div class="my-profile">
    <div class="profile-image">
      <img src="@/assets/images/meetple-my-profile.png" alt="User profile" />
      <EditButton class="btn-upload" @click="() => emit('click')" />
    </div>
    <p class="name">{{props.name}}</p>
    <p class="message">{{props.message}}</p>
  </div>
</template>

<style scoped>
.my-profile {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.profile-image {
  position: relative;
}
.profile-image img {
  width: 116px;
  height: 116px;
  border-radius: 58px;
  object-fit: cover;
}
.btn-upload {
  position: absolute;
  bottom: 0;
  right: 0;
}
.name {
  margin-top: 12px;
  font-size: 25px;
  font-weight: 700;
  color: #000;
  word-break: break-all;
}
.message {
  margin-top: 6px;
  font-size: 13px;
  font-weight: 500;
  color: #7F7F7F;
  word-break: break-all;
}
</style>
