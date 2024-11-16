<script setup lang="ts">
import Modal from '@/components/Modal.vue'
import CloseButton from '@/components/buttons/CloseButton.vue'
import Button from '@/components/Button.vue'
import { computed, type PropType, reactive } from 'vue'

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

const selected = props.data.options.find((option) => !!option.children.find((child) => child.value === props.data.selected));
const state = reactive({
  category: selected?.value
})

const category = computed(() => {
  return props.data.options.find((option) => option.value === state.category)
})

</script>

<template>
  <Modal :style="{paddingTop: '40px', paddingBottom: '40px'}">
    <p class="title">{{props.data.modalTitle}}</p>
    <div class="container">
      <ul class="category-list">
        <li v-for="(item, index) in props.data.options" :key="`category-${index}`">
          <button
            @click="() => {
              state.category = item.value
            }"
            :class="{selected: state.category === item.value }">{{item.label}}</button>
        </li>
      </ul>
      <ul class="item-list">
        <li v-for="(item, index) in category.children" :key="`item-${index}`" v-if="category">
          <button
            @click="() => {
              props.data.onChange(category.value, item.value)
              emit('close')
            }"
            :class="{selected: props.data.selected === item.value}"
            :style="{borderBottom: '1px solid #EDEDED'}"
          >{{item.label}}</button>
        </li>
      </ul>
    </div>
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
.container {
  display: flex;
  flex-direction: row;
  border: 1px solid #E2E2E2;
  border-radius: 10px;
  overflow: hidden;
  height: 60vh;
}
.category-list {
  display: flex;
  flex-direction: column;
  background-color: #F9F9F9;
  overflow: auto;
}
.category-list button {
  padding: 14px 40px 14px 17px;
  border-right: 1px solid #EFEFEF;
  border-top: 1px solid transparent;
  border-bottom: 1px solid transparent;
}
.category-list button.selected {
  border-right-color: #FFF;
  border-top-color: #EFEFEF;
  border-bottom-color: #EFEFEF;
  background-color: #FFF;
}
.item-list {
  flex: 1;
  padding: 0 24px;
  overflow: auto;
}
.item-list button {
  font-size: 14px;
  font-weight: 600;
  color: #000;
  width: 100%;
  padding: 14px 7px;
  text-align: left;
}
.item-list button.selected {
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
