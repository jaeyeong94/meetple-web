<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import IcMore from '@/components/icons/IcMore.vue'

const props = defineProps({
  options: Array<{ title: string, warning?: boolean, onClick: () => void }>
})

const open = ref(false)
const containerRef = ref<HTMLElement | null>(null)

const onToggle = (event: Event) => {
  event.stopPropagation()
  open.value = !open.value
}

const closeOptions = (event: Event) => {
  if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
    open.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeOptions)
})

onUnmounted(() => {
  document.removeEventListener('click', closeOptions)
})
</script>

<template>
  <div class="container" ref="containerRef">
    <button class="btn-more" @click="onToggle">
      <IcMore />
    </button>
    <ul class="options" v-if="open">
      <li class="option-item" :class="{ warning: !!item.warning }" v-for="(item, index) in props.options" :key="index">
        <button @click="() => {
          item.onClick()
          open = false
        }">{{ item.title }}</button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.container {
  position: relative;
  width: 28px;
  height: 28px;
}
.btn-more {
  width: 28px;
  height: 28px;
  background: none;
  border: none;
}
.options {
  position: absolute;
  top: 36px;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: max-content;
  padding: 20px 24px;
  background: #fff;
  border: 1px solid #F2F2F2;
  box-shadow: 0 2px 7px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}
.option-item button {
  font-size: 16px;
  font-weight: 700;
  color: #000;
}
.option-item.warning button {
  color: #FF334B;
}
</style>
