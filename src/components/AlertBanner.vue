<script setup lang="ts">
import IcAlert from '@/components/icons/IcAlert.vue'

const props = defineProps({
  title: String,
  description: String
})
</script>

<template>
  <div class="banner">
    <div class="icon">
      <IcAlert />
    </div>
    <div class="container">
      <p class="title">{{props.title}}</p>
      <p class="description">{{props.description}}</p>
    </div>
  </div>
</template>

<style scoped>
.banner {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background-color: #7542FD;
  border-radius: 16px;
}
.icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #fff;
}
.container {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 2px;
}
.title {
  font-size: 14px;
  font-weight: 700;
  color: #fff;
}
.description {
  font-size: 12px;
  font-weight: 500;
  color: #fff;
  opacity: 0.65;
}
</style>
