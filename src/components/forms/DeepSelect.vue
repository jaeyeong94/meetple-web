<script setup lang="ts">
import { computed, type PropType } from 'vue'
import IcGrayArrow from '@/components/icons/IcGrayArrow.vue'
import { useModalStore } from '@/stores/modal'
import type { DeepSelectOption } from '@/types'

const props = defineProps({
  label: String,
  required: Boolean,
  modalTitle: String,
  options: {
    type: Array as PropType<DeepSelectOption[]>,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
})

const { setModal } = useModalStore()

const emit = defineEmits(['change'])

const onClick = () => {
  setModal({
    type: 'deep-select',
    data: {
      modalTitle: props.modalTitle,
      options: props.options,
      selected: props.value,
      onChange: (val1, val2) => emit('change', val1, val2),
    }
  })
}

const selected = computed(() => {
  const options = props.options?.reduce((acc, option) => [...acc, ...option.children], [])
  return options.find((option) => option.value === props.value)
})
</script>

<template>
  <label v-if="props.label">{{props.label}}
    <span class="required" v-if="props.required">*</span>
    <span v-else>(선택사항)</span>
  </label>
  <div class="container">
    <button class="select" @click="onClick">
      <span>{{selected?.label}}</span>
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
.arrow svg {
  transform: rotate(90deg);
}
</style>
