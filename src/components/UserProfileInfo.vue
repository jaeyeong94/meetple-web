<script setup lang="ts">
import ShadowBox from '@/components/ShadowBox.vue'

const props = defineProps({
  name: String,
  message: String,
  age: Number,
  job: String,
  mbti: String,
  location: String,
  school: String,
  imageUrl: String,
})
</script>

<template>
  <ShadowBox>
    <img :src="props.imageUrl" alt="User profile" class="profile-image" />
    <p class="name">{{props.name}}</p>
    <p class="message">{{props.message}}</p>
    <ul class="info">
      <li class="info-item">
        <span class="title">직장 및 직무</span>
        <p class="value">{{props.job}}</p>
      </li>
      <li class="info-item">
        <span class="title">학교</span>
        <p class="value">{{props.school}}</p>
      </li>
      <li class="info-item">
        <span class="title">거주 지역</span>
        <p class="value">{{props.location}}</p>
      </li>
      <li class="info-item">
        <span class="title">MBTI</span>
        <p class="value">{{props.mbti}}</p>
      </li>
      <li class="info-item">
        <span class="title">나이</span>
        <p class="value">{{props.age}}세</p>
      </li>
    </ul>
  </ShadowBox>
</template>

<style scoped>
.profile-image {
  width: 116px;
  height: 116px;
  border-radius: 58px;
  box-shadow: 0 6px 16px 0 rgba(0, 0, 0, .15);
  object-fit: cover;
}
.name {
  margin-top: 16px;
  font-size: 26px;
  font-weight: 700;
  color: #000;
}
.message {
  margin-top: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #7F7F7F;
}
.info {
  margin-top: 26px;
  display: flex;
  flex-direction: column;
  gap: 13px;
}
.info-item {
  display: flex;
  flex-direction: row;
}
.info-item .title {
  width: 94px;
  font-size: 14px;
  font-weight: 600;
  color: #888888;
}
.info-item .value {
  font-size: 14px;
  font-weight: 500;
  color: #000;
}
</style>
