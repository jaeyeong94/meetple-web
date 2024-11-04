<script setup lang="ts">
import MoreButton from '@/components/buttons/MoreButton.vue'
import BackButton from '@/components/buttons/BackButton.vue'
import ActionButton from '@/components/buttons/ActionButton.vue'
import CloseButton from '@/components/buttons/CloseButton.vue'
import type { PropType } from 'vue'

const props = defineProps({
  title: String,
  showCloseButton: Boolean,
  showBackButton: Boolean,
  moreButtonData: Object,
  actionButtonData: Object as PropType<{title: string, onClick: () => void}>
})

const emit = defineEmits(['back', 'close'])
</script>

<template>
  <header class="header">
    <div class="left">
      <BackButton @click="() => emit('back')" v-if="props.showBackButton" />
    </div>
    <h1>{{props.title}}</h1>
    <div class="right">
      <MoreButton :options="props.moreButtonData" v-if="!!props.moreButtonData" />
      <ActionButton :title="props.actionButtonData?.title"
                    @click="props.actionButtonData?.onClick"
                    v-if="!!props.actionButtonData" />
      <CloseButton @click="() => emit('close')" v-if="props.showCloseButton" />
    </div>
  </header>
</template>

<style scoped>
.header {
  position: relative;
  display: flex;
  align-items: center;
  padding: 5px 16px;
  min-height: 38px;
}
.left {
  display: flex;
  justify-content: flex-start;
  flex: 1;
}
.right {
  display: flex;
  justify-content: flex-end;
  flex: 1;
}
h1 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 18px;
  font-weight: 600;
  color: #000;
}
</style>
