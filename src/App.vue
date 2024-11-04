<script setup lang="ts">
import { RouterView } from 'vue-router'
import ModalArea from '@/components/ModalArea.vue'
import IcMainLogo from '@/components/icons/IcMainLogo.vue'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useModalStore } from '@/stores/modal'
import { storeToRefs } from 'pinia'

const page = ref(null)
const modalStore = useModalStore()
const { modal } = storeToRefs(modalStore)
const activeModal = computed(() => modal.value)
const position = ref({ left: 0, width: 0 })
const modalPosition = computed(() => position.value)
let timeout = 0;

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
  window.addEventListener('resize', onResize);
})
onUnmounted(() => {
  window.removeEventListener('resize', onResize);
})

const data = {
  name: '트럼프',
  onClickSubmit: () => {},
  onClickCancel: () => {}
}
const data2 = {
  name: '트럼프',
  partnerProfileImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Donald_Trump_official_portrait.jpg',
  myProfileImageUrl: 'https://futureoflife.org/wp-content/uploads/2020/08/elon_musk_royal_society.jpg',
  onClickSubmit: () => {}
}
const data3 = {
  point: 15,
  onClickSubmit: () => {},
  onClickCancel: () => {}
}
</script>

<template>
  <div class="app-container">
    <div class="banner">
      <span class="subtitle">내 친구들과 함께 만나는 미팅 매칭</span>
      <IcMainLogo width="383" height="100" />
    </div>
    <img src="@/assets/images/main-background.png" class="background" alt="" />
  </div>
  <div ref="page" class="page-container">
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
.banner {
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
  .page-container {
    width: 100%;
  }
}
@media (max-width: 960px) {
  .banner {
    display: none;
  }
  .page-container {
    margin-left: 0;
  }
}
</style>
