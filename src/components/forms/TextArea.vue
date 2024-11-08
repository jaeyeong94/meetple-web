<script setup lang="ts">
import { ref } from 'vue'
import IcQuestion from '@/components/icons/IcQuestion.vue'

const props = defineProps({
  label: String,
  question: String,
  placeholder: String,
  required: Boolean,
  requiredMessageVisible: {
    type: Boolean,
    default: true,
  },
  requiredMessage: {
    type: String,
    required: false,
  },
  value: {
    type: [String, null],
    required: true,
  },
  numLines: {
    type: Number,
    default: 4,
  },
  maxLength: {
    type: Number,
    required: false,
  },
})

const emit = defineEmits(['input'])
const val = ref(props.value)
const error = ref(false)

const textAreaUpdate = (e: any) => {
  if(val.value) {
    emit('input', props.maxLength ? val.value.slice(0, props.maxLength) : val)
    if (props.maxLength) {
      error.value = val.value.length > props.maxLength
    }
  }
}
</script>

<template>
  <label v-if="props.label">{{props.label}}
    <span class="required" v-if="props.required">*</span>
    <span v-else>(선택사항)</span>
  </label>
  <label v-if="props.question">
    <p class="question"><IcQuestion />{{props.question}}</p>
    <span class="required" v-if="props.required">*</span>
    <span v-else-if="!props.required && requiredMessageVisible && requiredMessage">{{ requiredMessage }}</span>
    <span v-else-if="!props.required && requiredMessageVisible">(선택사항)</span>
  </label>
  <textarea
    class="text-area"
    :class="{ error: error }"
    :rows="props.numLines"
    v-model="val"
    :placeholder="props.placeholder"
    @input="textAreaUpdate"
  />
  <div class="max-length" v-if="props.maxLength">
    <p class="message">{{error ? '' : ''}}</p>
    <p class="length" >
      <span :class="{ error: error }" >{{val.length}}</span>/{{props.maxLength}}
    </p>
  </div>
</template>

<style scoped>
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
.text-area {
  width: -webkit-fill-available;
  padding: 8px 12px;
  font-size: 16px;
  border: 1px solid #EAEAEA;
  border-radius: 8px;
}
.text-area:focus {
  border-color: #6726FE;
}
.text-area.error {
  border-color: #EA174A;
}
.question {
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  font-weight: 700;
  color: #6726FE;
}
.max-length {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 6px;
}
.message {
  font-size: 13px;
  font-weight: 500;
  color: #EA174A;
}
.length {
  display: flex;
  justify-content: flex-end;
  font-size: 13px;
  font-weight: 500;
  color: #C6C6C6;
  margin-top: 4px;
}
.length > span {
  color: #9A9A9A;
}
.length > span.error {
  color: #EA174A;
}
</style>
