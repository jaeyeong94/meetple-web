<script setup lang="ts">
const props = defineProps({
  imageUrl: String,
})
</script>


<template>
  <button class="btn-profile">
    <img v-if="props.imageUrl" :src="props.imageUrl" alt="User profile" class="profile-image" />
  </button>
</template>


<style scoped>
.btn-profile {
  width: 28px;
  height: 28px;
  background: none;
  border: none;
}
.profile-image {
  width: 28px;
  height: 28px;
  border-radius: 14px;
  object-fit: cover;
}
</style>
