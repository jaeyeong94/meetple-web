<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import ModalArea from '@/components/ModalArea.vue'
import IcMainLogo from '@/components/icons/IcMainLogo.vue'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useModalStore } from '@/stores/modal'
import { storeToRefs } from 'pinia'

const route = useRoute()
const page = ref<HTMLElement | null>(null);
const pageContent = ref<HTMLElement | null>(null);
const modalStore = useModalStore()
const { modal } = storeToRefs(modalStore)
const activeModal = computed(() => modal.value)
const position = ref({ left: 0, width: 0 })
const modalPosition = computed(() => position.value)
let timeout = 0;

// ✅ 특정 경로일 때 클래스 추가
const pageClass = computed(() => {
  if (route.path.startsWith("/register/default")) {
    return "cert-page";
  } else {
    return "";
  }
});

const updateBodyClass = () => {
  const appElement = document.getElementById('app'); // ✅ `#app` 요소 가져오기
  const noScrollRoutes = ['/register/join'];
  const shouldAddNoScroll = noScrollRoutes.some(path => route.path.startsWith(path));

  if (shouldAddNoScroll || route.name === 'start') {
    document.body.classList.add('noScroll');
    appElement?.classList.add('noScroll');
  } else {
    document.body.classList.remove('noScroll');
    appElement?.classList.remove('noScroll');
  }
};

// ✅ route 변경 감지 (필요하면 watch 사용)
watch(() => route.path, (newPath) => {
  updateBodyClass();
  console.log("Route changed:", newPath);
})

const onResize = () => {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    const pagePosition = page.value.getBoundingClientRect()
    position.value = { left: `${pagePosition.left}px`, width: `${pagePosition.width}px` }
    const background = document.querySelector('.background') as HTMLImageElement
    if (window.innerWidth / window.innerHeight < 1426 / 1920) {
      background.classList.add('height')
    } else {
      background.classList.remove('height')
    }
  }, 150)
}

onMounted(() => {
  onResize();
  updateBodyClass();
  window.addEventListener('resize', onResize);
})
onUnmounted(() => {
  window.removeEventListener('resize', onResize);
})

window.addEventListener('popstate', function(event) {
  modalStore.setModal({ type: null });
}, false);
</script>

<template>
  <div class="app-container">
    <div class="banner-container">
      <span class="subtitle">친구와 함께 직장인 미팅</span>
      <IcMainLogo width="383" height="100" />
    </div>
    <img src="@/assets/images/main-background.png" class="background" alt="" />
  </div>
  <div ref="page" class="page-container" :class="pageClass">
    <RouterView />
    <ModalArea
      :activeModal="activeModal.type"
      :modal-position="modalPosition"
      :data="activeModal.data"
      @close="() => modalStore.setModal({type: null})" />
  </div>
</template>

<style scoped>
.app-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to bottom, #FFFFFF, #EAE1FF);
}
.banner-container {
  position: relative;
  width: 565px;
  margin-right: 375px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index: 1;
}
.subtitle {
  width: fit-content;
  font-size: 24px;
  font-weight: 700;
  color: transparent;
  background: linear-gradient(to right, #6726FE, #ED2EBA);
  background-clip: text;
  -webkit-background-clip: text;
  margin-bottom: 16px;
  margin-left: 13px;
}
.page-container {
  position: relative;
  box-sizing: border-box;
  background-color: #fff;
  width: 375px;
  margin-left: 565px;
  z-index: 1;
  min-height: 100vh; /* 최소 높이를 화면 높이로 설정 */
  height: auto; /* 내부 컨텐츠 크기에 맞게 자동 조절 */
  display: flex;
  flex-direction: column;
}
.page-container.cert-page {
  width: 400px;
}
.background-container {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}
.background {
  position: absolute;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  width: 100%;
  height: auto;
  min-height: 910px;
  object-fit: cover;
  object-position: center;
}
.background.height {
  width: auto;
  height: 100%;
}

@media (max-width: 499px) {
  .app-container {
    position: relative;
    background: none;
  }
  .page-container {
    width: 100%;
  }
  .background {
    display: none;
  }
}
@media (max-width: 960px) {
  .banner-container {
    display: none;
  }
  .page-container {
    margin-left: 0;
  }
}
</style>
