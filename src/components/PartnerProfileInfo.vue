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
  <ShadowBox :style="{padding: '16px'}">
    <div class="container" style="cursor: pointer;">
      <div>
        <p class="name">{{props.name}}</p>
        <p class="message">{{props.message}}</p>
        <ul class="info">
          <li class="info-item">{{props.job}}</li>
          <li class="info-item" v-if="props.school">{{props.school}}</li>
          <li class="info-item">{{props.mbti}}</li>
          <li class="info-item">{{props.location}}</li>
          <li class="info-item">{{props.age}}세</li>
        </ul>
      </div>
    </div>
  </ShadowBox>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
  gap: 8px;
}
.profile-image {
  width: 64px;
  height: 64px;
  border-radius: 32px;
  object-fit: cover;
}
.name {
  margin-left: 5px;
  font-size: 17px;
  font-weight: 700;
  color: #000;
}
.message {
  margin-left: 5px;
  margin-top: 2px;
  font-size: 13px;
  font-weight: 500;
  color: #7F7F7F;
}
.info {
  margin-top: 8px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 4px;
}
.info-item {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 28px;
  padding: 0 8px;
  background-color: #FAFAFA;
  border-radius: 14px;
  font-size: 12px;
  font-weight: 500;
  color: #666666;
}
</style>
