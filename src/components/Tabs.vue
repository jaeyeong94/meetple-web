<script setup lang="ts">
const props = defineProps({
  tabs: Array<{ title: string; to: string; }>,
  currentIndex: Number
})
</script>

<template>
  <nav>
    <div class="container">
      <template v-if="props.tabs && props.tabs.length">
        <router-link
          v-for="(tab, index) in props.tabs"
          :key="index"
          :to="tab.to"
          :class="{ 'tab': true, 'active': props.currentIndex === index }"
        >
          {{ tab.title }}
        </router-link>
      </template>
    </div>
  </nav>
</template>

<style scoped>
nav {
  padding: 6px 16px;
}
.container {
  display: flex;
  padding: 2px;
  background-color: #F3F3F3;
  border-radius: 20px;
}
.tab {
  display: inline-flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  height: 36px;
  border-radius: 18px;
  font-size: 16px;
  font-weight: 700;
  color: #909090;
}
.tab.active {
  background-color: #fff;
  color: #000;
}
</style>
