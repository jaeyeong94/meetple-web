<script setup lang="ts">
import { ref } from 'vue'
import IcImage from '@/components/icons/IcImage.vue'
import Button from '@/components/Button.vue'

const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  required: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
    default: '',
  },
  imageUrl: {
    type: String,
    default: '',
  },
})

// `defineEmits`를 타입스크립트로 정의하여 'change'와 'error' 이벤트를 명시
const emit = defineEmits<{
  (e: 'change', imageSrc: string, file: File): void
  (e: 'error', errorMessage: string): void
}>()

const input = ref<HTMLInputElement | null>(null)
const image = ref<HTMLImageElement | null>(null)
const selected = ref(false)
const loading = ref(false)

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
      // 파일 선택 초기화
      if (input.value) {
        input.value.value = ''
      }
      return
    }

    // 파일 크기 검증
    if (file.size > MAX_FILE_SIZE) {
      emit('error', '파일 크기가 너무 큽니다. (최대 10MB)')
      // 파일 선택 초기화
      if (input.value) {
        input.value.value = ''
      }
      return
    }

    loading.value = true
    const reader = new FileReader()
    reader.onload = (e) => {
      if (image.value) {
        selected.value = true
        image.value.src = e.target?.result as string
      }
      emit('change', e.target?.result as string, file)
      loading.value = false
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
  <div class="container">
    <input
      ref="input"
      class="input"
      accept="images/*"
      type="file"
      @change="onImageChange"
    />
    <img ref="image" class="thumbnail" :src="imageUrl" alt="Thumbnail" />
    <div class="empty" v-if="!imageUrl">
      <button class="new-button" @click="() => input?.click()">
        <div class="icon">
          <IcImage width="43" height="43" />
        </div>
        <span>이미지 등록하기</span>
      </button>
      <p class="description" v-if="props.description">{{props.description}}</p>
    </div>
    <Button class="change-button" @click="() => input?.click()">
      <IcImage width="24" height="24" />
      <span>이미지 교체하기</span>
    </Button>
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
.thumbnail {
  display: block;
  width: 100%;
  height: 330px;
  border-radius: 16px;
  object-fit: cover;
}
.input {
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  opacity: 0;
}
.change-button {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 7px;
  height: 44px;
  padding: 0 16px;
  margin: 15px auto 0;
  border-radius: 22px;
}
.change-button span {
  font-size: 14px;
  font-weight: 600;
  color: #000;
}
.empty {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 330px;
  background-color: #F7F7F7;
  border-radius: 16px;
}
.empty .icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 74px;
  height: 74px;
  border-radius: 37px;
  background-color: #fff;
}
.new-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 9px;
}
.new-button span {
  font-size: 14px;
  font-weight: 700;
  color: #000;
}
.description {
  font-size: 13px;
  font-weight: 500;
  color: #A1A1A1;
  margin-top: 3px;
}
</style>
