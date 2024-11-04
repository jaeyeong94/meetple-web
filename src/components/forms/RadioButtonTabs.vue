<script setup lang="ts">
import { type PropType } from 'vue'

const props = defineProps({
  label: String,
  required: Boolean,
  name: {
    type: String,
    required: true,
  },
  options: {
    type: Array as PropType<{ label: string, value: string, color: string }[]>,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['change'])
</script>

<template>
  <label class="label" v-if="props.label">{{label}}
    <span class="required" v-if="props.required">*</span>
    <span v-else>(선택사항)</span>
  </label>
  <ul class="radio-button-tabs">
    <li v-for="(option, index) in props.options" :key="index">
      <input type="radio"
             :id="option.value"
             :value="option.value"
             :name="props.name"
             :checked="option.value === props.value"
             @change="() => emit('change', option.value)"
      />
      <label :for="option.value"
             :style="{color: option.color || '#000'}">{{option.label}}</label>
    </li>
  </ul>
</template>

<style scoped>
.label {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 700;
  color: #2A2A2A;
  margin-bottom: 8px;
}
.label > span {
  font-size: 13px;
  font-weight: 600;
  color: #9B9B9B;
}
.label > span.required {
  color: #FF334B;
}
.radio-button-tabs {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  padding: 4px;
  background-color: #F5F5F5;
  border-radius: 8px;
}
.radio-button-tabs li {
  position: relative;
  flex: 1;
}
.radio-button-tabs input {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
}
.radio-button-tabs input:checked + label {
  background-color: #fff;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, .07);
}
.radio-button-tabs input:not(:checked) + label {
  color: #B2B2B2 !important;
}
.radio-button-tabs label {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  border-radius: 6px;
}
</style>
