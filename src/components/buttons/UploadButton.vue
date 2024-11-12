<script setup lang="ts">
import IcImage from '@/components/icons/IcImage.vue'
</script>


<template>
  <button class="btn-upload">
    <IcImage width="25" height="25" />
  </button>
</template>


<style scoped>
.btn-upload {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background-color: #fff;
  border: 1px solid #E8E8E8;
  border-radius: 50%;
}
</style>
