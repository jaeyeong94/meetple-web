<script setup lang="ts">
import { type PropType, ref } from 'vue'

const props = defineProps({
  placeholder: String,
  error: Boolean,
  value: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['input'])

const LENGTH = 6
const PLACEHOLDER = '123456'

const refs = ref(Array.from({ length: LENGTH }, () => null))
</script>

<template>
  <div class="container">
    <div class="input" v-for="i in LENGTH" :key="i">
      <input
        :ref="el => { if (el) refs[i - 1] = el }"
        :placeholder="PLACEHOLDER[i - 1]"
        :value="props.value[i - 1]"
        @keyup.backspace="() => {
          if (props.value.length === 0 || i === 1) return
          emit('input', props.value.slice(0, props.value.length - 1))
          refs[i - 2].focus()
        }"
        @input="(e) => {
          const target = e.target as HTMLInputElement
          const val = target.value.replace(/[^\d]/g, '').slice(0, 1)
          target.value = val
          const nextValue = (props.value + val).slice(0, LENGTH)
          emit('input', nextValue)
          if (nextValue.length === LENGTH) return
          refs[i].focus()
        }"
      />
    </div>
  </div>
  <p class="error-message" v-if="props.error">인증번호가 올바르지 않습니다. 다시 확인해주세요.</p>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
}
.input {
  flex: 1;
}
input {
  width: 100%;
  padding: 14px 0;
  font-size: 31px;
  font-weight: 700;
  color: #000;
  text-align: center;
  border: 1px solid #EAEAEA;
  border-radius: 8px;
}
input::placeholder {
  color: #DADADA;
}
.error-message {
  margin-top: 12px;
  font-size: 13px;
  font-weight: 500;
  color: #EA174A;
}
</style>
