<script setup lang="ts">
import UploadButton from '@/components/buttons/UploadButton.vue'
import IcProfile from '@/components/icons/IcProfile.vue'
import { ref } from 'vue'

const props = defineProps({
  label: String,
  required: Boolean,
  imageUrl: String,
  loading: Boolean,
})

const emit = defineEmits<{
  (e: 'change', imageSrc: string, file: File): void
  (e: 'error', errorMessage: string): void
}>()

const input = ref<HTMLInputElement>()
const image = ref<HTMLImageElement>()
const selected = ref(false)

// 허용할 이미지 확장자 목록
const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp']

// 최대 파일 크기 (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

const onImageChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    const fileExtension = file.name.split('.').pop()?.toLowerCase()

    // 파일 확장자 검증
    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      emit('error', '지원되지 않는 파일 형식입니다. (허용된 형식: jpg, jpeg, png, gif, bmp, webp)')
      return
    }

    // 파일 크기 검증
    if (file.size > MAX_FILE_SIZE) {
      emit('error', '파일 크기가 너무 큽니다. (최대 10MB)')
      return
    }

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
  <label v-if="props.label">{{props.label}}
    <span class="required" v-if="props.required">*</span>
    <span v-else>(선택사항)</span>
  </label>
  <div class="profile-image">
    <div class="thumbnail" v-if="!imageUrl">
      <IcProfile />
    </div>
    <img ref="image" v-else-if="imageUrl" :src="imageUrl" alt="User profile"  />
    <UploadButton class="btn-upload" @click="() => input?.click()" />
    <input
      ref="input"
      class="input"
      accept="image/*"
      type="file"
      @change="onImageChange"
    />
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
  margin-bottom: 11px;
}
label > span {
  font-size: 13px;
  font-weight: 600;
  color: #9B9B9B;
}
label > span.required {
  color: #FF334B;
}
.profile-image {
  display: inline-block;
  position: relative;
  width: 120px;
  height: 120px;
}
.profile-image img {
  width: 116px;
  height: 116px;
  border-radius: 58px;
  object-fit: cover;
}
.btn-upload {
  position: absolute;
  bottom: 0;
  right: 0;
}
.input {
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  opacity: 0;
}
.thumbnail {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  border-radius: 58px;
  background: #F5F5F5;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
