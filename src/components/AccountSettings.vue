<script setup lang="ts">
import Button from '@/components/Button.vue'

const props = defineProps({
  phoneNumber: String,
  name: String,
  birthDate: String,
})

const emit = defineEmits(['logout'])
</script>

<template>
  <ul class="account-settings">
    <li class="setting-item">
      <div>
        <span class="key">연락처</span>
        <p class="value">{{props.phoneNumber}}</p>
      </div>
      <Button @click="() => emit('logout')">로그아웃</Button>
    </li>
    <li class="setting-item">
      <div>
        <span class="key">이름</span>
        <p class="value">{{props.name}}</p>
      </div>
    </li>
    <li class="setting-item">
      <div>
        <span class="key">생년월일</span>
        <p class="value">{{props.birthDate}}</p>
      </div>
    </li>
  </ul>
</template>

<style scoped>
.account-settings {
  display: flex;
  flex-direction: column;
  gap: 42px;
}
.setting-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}
.setting-item > div {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  gap: 12px;
}
.key {
  font-size: 13px;
  font-weight: 700;
  color: #9A9A9A;
}
.value {
  font-size: 18px;
  font-weight: 600;
  color: #000;
}
</style>
