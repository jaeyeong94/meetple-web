<script setup lang="ts">
import BackButton from '@/components/buttons/BackButton.vue'
import TextInput from '@/components/forms/TextInput.vue'
import TextInputSearch from '@/components/forms/TextInputSearch.vue'
import { ref, defineEmits, watch } from 'vue';
import http from '@/lib/http'

const searchQuery = ref('');
const searchResults = ref<{ schoolName: string; emailDomain: string }[]>([]);
const isLoading = ref(false);
const emit = defineEmits(['select', 'close']);

let debounceTimeout: ReturnType<typeof setTimeout> | null = null;

// ✅ 디바운스 없이 바로 검색 요청
const findUniversityList = async (q: string) => {
  isLoading.value = true;
  try {
    const response = await http.get('/account/info/university', { q });
    searchResults.value = response.data.data;
  } catch (error) {
    console.error('Error fetching university list:', error);
  } finally {
    isLoading.value = false;
  }
};

// ✅ 디바운싱 처리
watch(searchQuery, (newQuery) => {
  if (debounceTimeout) clearTimeout(debounceTimeout);

  debounceTimeout = setTimeout(() => {
    if (newQuery.trim()) {
      findUniversityList(newQuery);
    } else {
      searchResults.value = [];
    }
  }, 100);
});

// ✅ 대학교 선택 시 emit 이벤트 발생
const selectUniversity = (university: { schoolName: string; emailDomain: string }) => {
  emit('select', university);
  searchQuery.value = university.schoolName; // 선택한 대학교 이름을 검색창에 표시
  searchResults.value = []; // 리스트 초기화
};
</script>

<template>
  <div class="search-container">
    <div class="search-area" style="padding: 20px;">
      <BackButton @click="() => {
        emit('close')
      }" style="width: 50px; flex-shrink: 0;" />
      <TextInputSearch label="학교 검색" placeholder="학교 이름을 검색해보세요" v-model="searchQuery" />
    </div>

    <ul class="search-results" v-if="searchResults.length > 0">
      <li
        v-for="university in searchResults"
        :key="university.emailDomain"
        @click="selectUniversity(university)"
        class="search-item"
      >
        <span class="item-icon">
          <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M16.25 9.875C16.25 13.672 13.172 16.75 9.375 16.75C5.57804 16.75 2.5 13.672 2.5 9.875C2.5 6.07804 5.57804 3 9.375 3C13.172 3 16.25 6.07804 16.25 9.875ZM9.375 14.875C12.1364 14.875 14.375 12.6364 14.375 9.875C14.375 7.11358 12.1364 4.875 9.375 4.875C6.61358 4.875 4.375 7.11358 4.375 9.875C4.375 12.6364 6.61358 14.875 9.375 14.875Z" fill="#C2C2C2"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M16.8369 18.663L13.0869 14.913L14.4127 13.5872L18.1627 17.3372L16.8369 18.663Z" fill="#C2C2C2"/>
          </svg>
        </span>
        <span>{{ university.schoolName }}</span>
      </li>
    </ul>

    <!-- 로딩 상태 -->
<!--    <div v-if="isLoading" class="loading">검색 중...</div>-->
  </div>
</template>

<style scoped>
.search-area {
  display: flex;
  align-items: center;
  justify-content: start;
  margin-bottom: 10px;
}

.search-container {
  position: relative;
  width: 100%;
}

.search-input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  outline: none;
}

.search-results {
  list-style: none;
  margin: 5px 0 0;
  background: white;
  overflow-y: auto;
  padding: 0 20px;
}

.search-item {
  padding: 13px 10px;
  border-bottom: 1px solid #F7F8F9;
  cursor: pointer;
  display: flex;
  justify-content: start;
  align-items: center;

  &:last-child {
    border-bottom: none;
  }

  .item-icon {
    margin-right: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 22px;
    height: 22px;
    border-radius: 8px;
    background-color: #F4F5F6;

    svg {
      width: 12px;
      height: 12px;
      fill: #C2C2C2;
    }
  }
}

.search-item:hover {
  background: #f5f5f5;
}

.loading {
  margin-top: 10px;
  font-size: 14px;
  color: gray;
}
</style>
