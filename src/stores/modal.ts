import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { ModalType } from '@/types'

export const useModalStore = defineStore('modal', () => {
  const modal = ref({ type: null, data: null })

  function setModal({type, data} : {type: ModalType, data: any}) {
    modal.value = { type, data }
  }

  return { modal, setModal }
})
