<script setup lang="ts">
import ShadowBox from '@/components/ShadowBox.vue'
import IcQuestion from '@/components/icons/IcQuestion.vue'

const props = defineProps({
  data: Array<{question: string, answer: string}>,
})
</script>

<template>
  <ShadowBox class="questions">
    <div class="question-item" :key="index" v-for="(item, index) in props.data">
      <p class="question"><IcQuestion />{{item.question}}</p>
      <p class="answer">{{item.answer}}</p>
    </div>
  </ShadowBox>
</template>

<style scoped>
.questions {
  display: flex;
  flex-direction: column;
  gap: 32px;
}
.question-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.question {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  font-weight: 700;
  color: #6726FE;
}
.answer {
  font-size: 14px;
  font-weight: 500;
  color: #1B1B1B;
}
</style>
