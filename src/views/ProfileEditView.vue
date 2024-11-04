<script setup lang="ts">
import AlertBanner from '@/components/AlertBanner.vue'
import ButtonWithDetail from '@/components/buttons/ButtonWithDetail.vue'
import Gap from '@/components/Gap.vue'
import StickyArea from '@/components/StickyArea.vue'
import SubHeader from '@/components/SubHeader.vue'
import TextInput from '@/components/forms/TextInput.vue'
import TextArea from '@/components/forms/TextArea.vue'
import Select from '@/components/forms/Select.vue'
import ProgressBar from '@/components/ProgressBar.vue'
import RadioButtonTabs from '@/components/forms/RadioButtonTabs.vue'
import LinkButton from '@/components/forms/LinkButton.vue'
import { TEST_ACTION_DATA, TEST_SELECT_OPTIONS, TEST_RADIO_OPTIONS } from '@/consts/testData'
import { ref } from 'vue'
import { validateDate } from '@/lib/utils'

const name = ref('')
const school = ref('')
const introduction = ref('')
const mbti = ref('ESTJ')
const gender = ref('male')
const birthdate = ref('')
</script>

<template>
  <StickyArea position="top" :style="{ backgroundColor: '#fff'}">
    <ProgressBar :progress="0" :processing="true" />
    <SubHeader title="프로필" :action-button-data="TEST_ACTION_DATA" :show-back-button="true" @back="() => {}" />
  </StickyArea>
  <div class="page">
    <TextInput label="이름" placeholder="이름을 입력하세요" :required="true" @input="(val: string) => { name = val}" :value="name" />
    <Gap :height="20" />
    <TextInput label="학교명" @input="(val: string) => { school = val}" :value="school" :validate="(val: string) => val.length > 3 ? null : '학교 이름이 짧아요'" />
    <Gap :height="20" />
    <TextArea label="자개소개" :required="true" @input="(val: string) => introduction = val" :value="introduction" />
    <Gap :height="20" />
    <TextInput label="생년월일" :validate="(val: string) => {
      if (val.length < 10) return null;
      if (validateDate(val)) return null;
      return '생년월일이 올바르지 않습니다';
    }" @input="(val: string) => birthdate = val" :value="birthdate" />
    <Gap :height="20" />
    <TextArea question="나와 내 친구들은 어떤 사람인가요?" @input="(val: string) => introduction = val" :value="introduction" :num-lines="6" :max-length="120" />
    <Gap :height="20" />
    <LinkButton title="프로필 연동하기" label="프로필 연동" :required="true" @click="() => {}" />
    <Gap :height="20" />
    <RadioButtonTabs label="성별" name="gender" :required="true" @change="(val: string) => gender = val" :value="gender" :options="TEST_RADIO_OPTIONS" />
    <Gap :height="20" />
    <Select label="MBTI" :required="true" @change="(val: string) => mbti = val" :value="mbti" :options="TEST_SELECT_OPTIONS" :modal-option-cols="4" />
    <Gap :height="20" />
    <AlertBanner title="카카오톡 오픈 프로필을 등록해주세요." description="링크된 상대방과 대화할 수 있습니다." />
    <Gap :height="20" />
    <ButtonWithDetail title="회원탈퇴" title-color="#FF334B" description="지금 바로 고고" />
  </div>
</template>

<style scoped>
.page {
  padding: 16px;
}
</style>
