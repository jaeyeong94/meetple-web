<script setup lang="ts">
import IcCheckActive from '@/components/icons/IcCheckActive.vue'
import IcCheck from '@/components/icons/IcCheck.vue'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  main: Boolean,
  value: {
    type: Boolean,
    required: true,
  },
  showDetailButton: Boolean,
  link: String
})

const emit = defineEmits(['change', 'detail'])
</script>

<template>
  <div class="container">
    <input
      type="checkbox"
      :id="props.name"
      :checked="props.value"
      @change="() => emit('change', !props.value)"
    />
    <label :for="props.name" :class="{main: props.main}">
      <IcCheckActive v-if="props.value" />
      <IcCheck v-else />
      <span v-if="props.link"><a :href="props.link" target="_blank">{{props.title}}</a></span>
      <span v-else>{{props.title}}</span>
    </label>
    <button @click="() => emit('detail')" v-if="!!props.showDetailButton">
    </button>
  </div>
</template>

<style scoped>
.container {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
}
input {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
}
label {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  font-size: 15px;
  font-weight: 500;
  color: #777777;
  cursor: pointer;
}
label.main {
  font-weight: 700;
  color: #000;
}
</style>
