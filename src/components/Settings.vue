<script setup lang="ts">
import IcGrayArrow from '@/components/icons/IcGrayArrow.vue'

const props = defineProps({
  options: Array<{title: string, onClick: () => void}>,
})
</script>

<template>
  <span class="title">설정</span>
  <ul class="settings">
    <li class="setting-item" :key="index" v-for="(item, index) in props.options">
      <button>
        <span class="label">{{item.title}}</span>
        <IcGrayArrow />
      </button>
    </li>
  </ul>
</template>

<style scoped>
.title {
  display: block;
  padding: 0 6px;
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 600;
  color: #676767;
}
.settings {
  display: flex;
  flex-direction: column;
  padding: 16px 0;
  gap: 24px;
  background-color: #F4F4F4;
  border-radius: 16px;
}
.setting-item > button {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 28px;
  padding-left: 22px;
  padding-right: 16px;
}
.label {
  flex: 1;
  font-size: 16px;
  font-weight: 700;
  color: #000;
  text-align: left;
}
</style>
