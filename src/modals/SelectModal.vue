<script setup lang="ts">
import Modal from '@/components/Modal.vue'
import CloseButton from '@/components/buttons/CloseButton.vue'
import Button from '@/components/Button.vue'
import type { PropType } from 'vue'

type PropData = {
  options: { label: string, value: string }[];
  modalTitle: string;
  modalOptionCols: number;
  selected: string;
  onChange: (value: string) => void;
}

const props = defineProps({
  data: {
    type: Object as PropType<PropData>,
    required: true,
  },
})

const emit = defineEmits(['close'])
</script>

<template>
  <Modal :style="{paddingTop: '40px', paddingBottom: '40px'}">
    <p class="title">{{props.data.modalTitle}}</p>
    <ul class="list" :style="{ gridTemplateColumns: `repeat(${props.data.modalOptionCols || 2}, 1fr)`}">
      <li v-for="(item, index) in props.data.options" :key="index">
        <Button @click="() => {
          props.data.onChange(item.value)
          emit('close')
        }" :class="{selected: props.data.selected === item.value}">{{item.label}}</Button>
      </li>
    </ul>
    <CloseButton class="close" @click="() => emit('close')" />
  </Modal>
</template>

<style scoped>
.title {
  display: block;
  font-size: 23px;
  font-weight: 700;
  color: #000;
  margin-bottom: 20px;
}
.list {
  display: grid;
  gap: 8px;
}
.list .button {
  width: 100%;
  height: 40px;
  border-radius: 6px;
  justify-content: center;
}
.list .button.selected {
  border-color: #6726FE;
  color: #6726FE;
}
.close {
  position: absolute;
  width: 30px;
  height: 30px;
  top: 13px;
  right: 13px;
}
</style>
