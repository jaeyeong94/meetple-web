<script setup lang="ts">
import { computed, type PropType, ref } from 'vue'
import IcClear from '@/components/icons/IcClear.vue'

// ✅ Props 정의
const props = defineProps({
  label: String,
  placeholder: String,
  modelValue: {
    type: String,
    required: true,
  },
  validate: {
    type: Function as PropType<(value: string) => string | null>,
    default: () => null,
  }
})

// ✅ Emits 정의
const emit = defineEmits(['update:modelValue', 'validate'])

const input = ref<HTMLInputElement | null>(null);
const focused = ref(false);

const onInput = (e: Event) => {
  const value = (e.target as HTMLInputElement).value;
  emit('update:modelValue', value);
}

// ✅ `computed`에서 `validate` 값 직접 접근 (value로 호출해야 정확함)
const validationError = computed(() => props.validate(props.value));

// ✅ 입력 필드 초기화
const onClear = () => {
  if (input.value) {
    input.value.value = '';  // ✅ 실제 input 값을 비움
    emit('input', '', validationError.value); // ✅ 변경된 validate 값 반영
  }
}

// ✅ 포커스 & 블러 핸들러
const onFocus = () => {
  focused.value = true;
}

const onBlur = () => {
  setTimeout(() => {
    focused.value = false;
  }, 100);
}
</script>

<template>
  <div class="container">
    <!-- SVG 아이콘 -->
    <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none" v-if="!focused">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M16.25 9.875C16.25 13.672 13.172 16.75 9.375 16.75C5.57804 16.75 2.5 13.672 2.5 9.875C2.5 6.07804 5.57804 3 9.375 3C13.172 3 16.25 6.07804 16.25 9.875ZM9.375 14.875C12.1364 14.875 14.375 12.6364 14.375 9.875C14.375 7.11358 12.1364 4.875 9.375 4.875C6.61358 4.875 4.375 7.11358 4.375 9.875C4.375 12.6364 6.61358 14.875 9.375 14.875Z" fill="#C2C2C2"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M16.8369 18.663L13.0869 14.913L14.4127 13.5872L18.1627 17.3372L16.8369 18.663Z" fill="#C2C2C2"/>
    </svg>

    <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none" v-else-if="focused">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M16.25 9.875C16.25 13.672 13.172 16.75 9.375 16.75C5.57804 16.75 2.5 13.672 2.5 9.875C2.5 6.07804 5.57804 3 9.375 3C13.172 3 16.25 6.07804 16.25 9.875ZM9.375 14.875C12.1364 14.875 14.375 12.6364 14.375 9.875C14.375 7.11358 12.1364 4.875 9.375 4.875C6.61358 4.875 4.375 7.11358 4.375 9.875C4.375 12.6364 6.61358 14.875 9.375 14.875Z" fill="#000000"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M16.8369 18.663L13.0869 14.913L14.4127 13.5872L18.1627 17.3372L16.8369 18.663Z" fill="#000000"/>
    </svg>


    <!-- 입력 필드 -->
    <input
      ref="input"
      class="text-input"
      :class="{ error: validationError }"
      :placeholder="props.placeholder"
      :value="props.modelValue"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
    />

    <button class="clear" @click="onClear" v-if="focused">
      <IcClear />
    </button>
  </div>
  <p class="error-message" v-if="validationError">{{ validationError }}</p>
</template>

<style scoped>
.container {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

/* SVG 아이콘 */
.input-icon {
  position: absolute;
  left: 12px; /* 아이콘 위치 */
  width: 20px;
  height: 21px;
  pointer-events: none; /* 클릭 막음 */
}

/* 입력 필드 */
.text-input {
  width: 100%;
  padding: 16px 16px 16px 40px; /* 왼쪽에 아이콘 공간 확보 */
  font-size: 16px;
  border: 1px solid #EAEAEA;
  border-radius: 8px;
  outline: none;
  font-weight: 500;
  box-sizing: border-box;
}

label {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 700;
  color: #2A2A2A;
  margin-bottom: 8px;
}

.text-input:focus {
  border-color: #6726FE;
}

.text-input.error {
  border-color: #EA174A;
}

.text-input::placeholder {
  color: #C2C2C2;
}

.clear {
  position: absolute;
  top: 50%;
  right: 16px;
  display: inline-flex;
  transform: translateY(-50%);
}

.error-message {
  font-size: 12px;
  font-weight: 500;
  color: #EA174A;
  text-align: right;
  margin-top: 5px;
}
</style>
