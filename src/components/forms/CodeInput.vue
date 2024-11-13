<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  error: Boolean,
  value: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['input'])

const LENGTH = 6

const inputRef = ref<HTMLInputElement | null>(null)
</script>

<template>
  <div class="container">
    <div class="input" v-for="i in LENGTH" :key="i">
      <span>{{props.value[i - 1]}}</span>
    </div>
    <input
      ref="inputRef"
      type="number"
      inputmode="numeric" pattern="[0-9]*"
      :value="props.value"
      @input="(e) => {
          const target = e.target as HTMLInputElement
          const val = target.value.replace(/[^\d]/g, '').slice(0, LENGTH)
          emit('input', val)
          if (val.length !== LENGTH) return
          inputRef?.blur()
        }"
    />
  </div>
  <p class="error-message" v-if="props.error">인증번호가 올바르지 않습니다. 다시 확인해주세요.</p>
</template>

<style scoped>
.container {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
}
.input {
  flex: 1;
}
.input span {
  display: block;
  width: 100%;
  height: 40px;
  padding: 14px 0;
  font-size: 31px;
  font-weight: 700;
  color: #000;
  text-align: center;
  border: 1px solid #EAEAEA;
  border-radius: 8px;
}
input {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: none;
  border: none;
  opacity: 0;
  color: transparent;
  caret-color: transparent;
}
.error-message {
  margin-top: 12px;
  font-size: 13px;
  font-weight: 500;
  color: #EA174A;
}
</style>
