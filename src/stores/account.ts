import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import type { ModalType } from '@/types'

export const accountStore = defineStore('account', () => {
  const account = reactive({});

  function setAccount({ account }: any) {
    account.value = { account }
  }

  return { account }
})
