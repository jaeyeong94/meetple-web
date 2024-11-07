<script setup lang="ts">
const props = defineProps({
  error: Boolean,
  value: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['input'])

const PLACEHOLDER = '010-1234-5678'

const formatPhoneNumber = (value: string): string => {
  const numbers = value.replace(/[^\d]/g, '');

  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;

  return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
}
</script>

<template>
  <input
    type="tel"
    :placeholder="PLACEHOLDER"
    :value="props.value"
    @input="(e) => {
      const target = e.target as HTMLInputElement;
      const val = target.value;
      const formattedVal = formatPhoneNumber(val);
      target.value = formattedVal;
      emit('input', formattedVal);
    }"
  />
  <p class="error-message" v-if="props.error">휴대폰 번호가 올바르지 않습니다. 다시 확인해주세요.</p>
</template>

<style scoped>
input {
  width: -webkit-fill-available;
  padding: 19px 15px;
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
