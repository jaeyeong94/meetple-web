<script setup lang="ts">
import { ref } from 'vue'
import IcImage from '@/components/icons/IcImage.vue'
import Button from '@/components/Button.vue'

const props = defineProps({
  label: String,
  required: Boolean,
  description: String,
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
      emit('change', e.target?.result as string)
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
      type="file"
      @change="onImageChange"
    />
    <img ref="image" class="thumbnail" src="" alt="Thumbnail" />
    <div class="empty" v-if="!selected">
      <button class="new-button" @click="() => input?.click()">
        <div class="icon">
          <IcImage width="43" height="43" />
        </div>
        <span>이미지 등록하기</span>
      </button>
      <p class="description" v-if="props.description">{{props.description}}</p>
    </div>
    <Button class="change-button" @click="() => input?.click()" v-if="selected">
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
