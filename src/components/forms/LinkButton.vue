<script setup lang="ts">
import IcGrayArrow from '@/components/icons/IcGrayArrow.vue'

const props = defineProps({
  label: String,
  required: Boolean,
  placeHolder: String,
  optionalText: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    required: true,
  },
  warningMessage: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['click'])
</script>

<template>
  <label v-if="props.label">{{props.label}}
    <span class="required" v-if="props.required">* <span style="color: #6726FE; font-size: 11px;">{{warningMessage}}</span></span>
    <span v-else style="color: #6726FE; font-size: 11px;">{{ props.optionalText }}</span>
  </label>
  <div class="container">
    <button class="select" @click="() => emit('click')">
      <span v-if="props.title">{{props.title}}</span>
      <span v-else style="color: #9B9B9B;">{{placeHolder}}</span>
      <div class="arrow">
        <IcGrayArrow />
      </div>
    </button>
  </div>
</template>

<style scoped>
.container {
  position: relative;
}
label {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 15px;
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
.select {
  width: 100%;
  padding: 16px;
  font-size: 16px;
  border: 1px solid #EAEAEA;
  border-radius: 8px;
  text-align: left;
}
.select:focus + .arrow svg {
  transform: rotate(-90deg);
}
.arrow {
  position: absolute;
  top: 50%;
  right: 16px;
  display: inline-flex;
  transform: translateY(-50%);
}
</style>
