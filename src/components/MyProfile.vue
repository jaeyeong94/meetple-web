<script setup lang="ts">
import EditButton from '@/components/buttons/EditButton.vue'
import { ref } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['change'])

const input = ref<HTMLInputElement>()
const image = ref<HTMLImageElement>()
const selected = ref(false)

const onImageChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (image.value) {
        selected.value = true
        image.value.src = e.target?.result as string
      }
      emit('change', e.target?.result as string, file)
    }
    reader.readAsDataURL(file)
  }
}
</script>

<template>
  <div class="my-profile">
    <div class="profile-image">
      <img :src="props.imageUrl" alt="User profile" />
      <EditButton class="btn-edit" @click="() => input?.click()" />
      <input
        ref="input"
        class="input"
        type="file"
        @change="onImageChange"
      />
    </div>
    <p class="name">{{props.name}}</p>
    <p class="message">{{props.message}}</p>
  </div>
</template>

<style scoped>
.my-profile {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.profile-image {
  position: relative;
}
.profile-image img {
  width: 116px;
  height: 116px;
  border-radius: 58px;
  object-fit: cover;
}
.btn-edit {
  position: absolute;
  bottom: 0;
  right: 0;
}
.name {
  margin-top: 12px;
  font-size: 25px;
  font-weight: 700;
  color: #000;
}
.message {
  margin-top: 6px;
  font-size: 13px;
  font-weight: 500;
  color: #7F7F7F;
}
.input {
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  opacity: 0;
}
</style>
