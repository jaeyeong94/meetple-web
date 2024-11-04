<script setup lang="ts">
import { computed, ref } from 'vue'
import IcClear from '@/components/icons/IcClear.vue'

const props = defineProps({
  label: String,
  placeholder: String,
  required: Boolean,
  value: {
    type: String,
    required: true,
  },
  validate: {
    type: Function as PropType<(value: string) => string | null>,
    default: () => null,
  }
})

const emit = defineEmits(['input', 'validate'])

const input = ref<HTMLInputElement | null>(null);

const focused = ref(false);

const validate = computed(() => props.validate(props.value));

const onClear = () => {
  if (input.value) {
    input.value.value = '';
    emit('input', '');
  }
}

const onFocus = () => {
  focused.value = true
}

const onBlur = () => {
  setTimeout(() => {
    focused.value = false;
  }, 100)
}
</script>

<template>
  <label v-if="props.label">{{label}}
    <span class="required" v-if="props.required">*</span>
    <span v-else>(선택사항)</span>
  </label>
  <div class="container">
    <input
      ref="input"
      class="text-input"
      :class="{error: validate}"
      :placeholder="props.placeholder"
      :value="props.value"
      @input="(e) => emit('input', e.target.value)"
      @focus="onFocus"
      @blur="onBlur"
    />
    <button class="clear" @click="onClear" v-if="focused">
      <IcClear />
    </button>
  </div>
  <p class="error-message" v-if="validate">{{validate}}</p>
</template>

<style scoped>
.container {
  position: relative;
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
label > span {
  font-size: 13px;
  font-weight: 600;
  color: #9B9B9B;
}
label > span.required {
  color: #FF334B;
}
.text-input {
  width: -webkit-fill-available;
  padding: 16px 40px 16px 16px;
  font-size: 16px;
  font-weight: 500;
  border: 1px solid #EAEAEA;
  border-radius: 8px;
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
