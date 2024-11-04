<script setup lang="ts">
import IcClose from '@/components/icons/IcGrayClose.vue'
import IcHeart from '@/components/icons/IcHeart.vue'

const emit = defineEmits(['close', 'heart'])
</script>

<template>
  <div class="profile-actions">
    <button @click="() => emit('close')">
      <IcClose />
    </button>
    <div class="division" />
    <button @click="() => emit('heart')">
      <IcHeart :style="{width: '50px', height: '50px'}" color="#7542FD"  />
    </button>
  </div>
</template>

<style scoped>
.profile-actions {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 32px;
  background-color: #fff;
  border: 1px solid #F0F0F0;
  border-radius: 48px;
  box-shadow: 0 4px 49px 0 rgba(0, 0, 0, .11);
}
.division {
  position: relative;
  height: 80px;
  width: 2px;
  background-color: #FFF;
  border-left: 2px solid #F0F0F0;
  margin: 0 28px;
}
.division::before {
  content: '';
  display: block;
  position: absolute;
  left: 100%;
  top: 0;
  bottom: 0;
  width: 32px;
  background: linear-gradient(90deg, #F7F7F7 0%, #FFFFFF 100%);
  z-index: -1;
}
</style>
