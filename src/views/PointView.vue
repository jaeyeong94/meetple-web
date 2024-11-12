<script setup lang="ts">
import MyPoint from '@/components/MyPoint.vue'
import Gap from '@/components/Gap.vue'
import StickyArea from '@/components/StickyArea.vue'
import SubHeader from '@/components/SubHeader.vue'
import PointItems from '@/components/PointItems.vue'
import { TEST_USER } from '@/consts/testData'
import http from '@/lib/http'
import router from '@/router'
import { useModalStore } from '@/stores/modal'
import { onMounted, reactive, ref, type Ref } from 'vue'

const user = TEST_USER;

const account: any = reactive({});
const items: any = reactive([]);
const notification: any = reactive([]);

const photos: Ref<any> = ref([]);
const jobs: Ref<any> = ref([]);

const accountUpdate = async () => {
  const accountResponse = await http.get('/account');
  const itemsResponse = await http.get('/payment/item');
  Object.assign(account, accountResponse.data);
  Object.assign(items, itemsResponse.data);
}

onMounted(async () => {
  await accountUpdate()

  // 튕겨내기
  if(!account.data) {
    localStorage.removeItem('token')
    await router.push('/login')
  }

  if(account.data.accountMeta.stage !== 'approve') {
    await router.push('/register')
  }

  account.data.accountProfiles.forEach((profile: any) => {
    if(profile.type === 'photo') {
      photos.value.push(profile)
    } else if(profile.type === 'job') {
      jobs.value.push(profile)
    }
  })
})

const pointCharge = async (id: number) => {
  const action = async () => {
    http.post('/payment/buy', { itemId: id })
      .then(async (data: any) => {
        const response = data.data;
        const candyCurrency = items.data.find((item: any) => item.id === id).charge_currency
        await accountUpdate();
        useModalStore().setModal({
          type: 'alert',
          data: {
            title: '캔디 충전완료',
            message: `${candyCurrency} 캔디가 충전되었습니다.`
          }
        })
      })
      .catch((error: any) => {
        useModalStore().setModal({
          type: 'alert',
          data: {
            title: error.response.data.title,
            message: error.response.data.message
          }
        })
        console.log(error, 'error')
      })
  }

  useModalStore().setModal({
    type: 'purchase-point',
    data: {
      point: items.data.find((item: any) => item.id === id).charge_currency,
      onClickCancel: () => {
        useModalStore().setModal({ type: null })
      },
      onClickSubmit: action
    }
  })
}
</script>

<template>
  <StickyArea position="top" :style="{ backgroundColor: '#fff'}">
    <SubHeader title="포인트 충전" :show-back-button="true" @back="() => {
      router.back()
    }" />
  </StickyArea>
  <div class="page">
    <MyPoint :point="account.data?.currency || 0" />
    <Gap :height="20" />
    <PointItems :items="items.data || []" @click="(id: number) => {
      pointCharge(id)
    }" />
  </div>
</template>

<style scoped>
.page {
  padding: 16px;
}
</style>
