<script setup lang="ts">
import StickyArea from '@/components/StickyArea.vue'
import SubHeader from '@/components/SubHeader.vue'
import PhoneNumberInput from '@/components/forms/PhoneNumberInput.vue'
import CodeInput from '@/components/forms/CodeInput.vue'
import PageTitleAndDescription from '@/components/PageTitleAndDescription.vue'
import Gap from '@/components/Gap.vue'
import DeepSelect from '@/components/forms/DeepSelect.vue'
import { ref } from 'vue'
import { TEST_DEEP_SELECT_OPTIONS } from '@/consts/testData'

const phoneNumber = ref('')
const code = ref('')
const location = ref('강남구')
</script>

<template>
  <StickyArea position="top" :style="{ backgroundColor: '#fff'}">
    <SubHeader title="회원가입" />
  </StickyArea>
  <div class="page">
    <PageTitleAndDescription title="휴대폰 번호를 입력하세요" description="필수입니다" />
    <Gap :height="40" />
    <PhoneNumberInput
      @input="(val: string) => phoneNumber = val"
      :value="phoneNumber"
    />
    <Gap :height="20" />
    <CodeInput
      @input="(val: string) => code = val"
      :value="code"
    />
    <Gap :height="20" />
    <DeepSelect label="거주지역" :required="true" modal-title="거주지역을 선택해주세요."
                @change="(val1: string, val2: string) => location = val2"
                :value="location"
                :options="TEST_DEEP_SELECT_OPTIONS"/>
  </div>
</template>

<style scoped>
.page {
  padding: 16px;
}
</style>
