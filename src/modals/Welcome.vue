<script setup lang="ts">
import Modal from '@/components/Modal.vue'
import CancelButton from '@/components/CancelButton.vue'
import SubmitButton from '@/components/SubmitButton.vue'

const props = defineProps({
  data: Object,
})

const emit = defineEmits(['close'])
</script>

<template>
  <Modal>
    <span class="title" v-html="props.data?.title"></span>
    <p class="description" v-html="props.data?.message"></p>
    <CancelButton :style="{marginTop: '20px'}" @click="() => {
          emit('close')
          if(props.data?.onClickClose) {
            props.data?.onClickClose()
          }

        }"><SubmitButton :style="{backgroundColor: '#6726FE'}">알겠어요</SubmitButton></CancelButton>
  </Modal>
</template>

<style scoped>
.title {
  font-size: 24px;
  font-weight: 700;
  color: #000;
}
.description {
  margin-top: 8px;
  margin-bottom: 32px;
  font-size: 14px;
  font-weight: 500;
  color: #929292;
}
</style>
