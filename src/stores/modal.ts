import { type Ref, ref } from 'vue'
import { defineStore } from 'pinia'
import type { ModalType } from '@/types'

export const useModalStore = defineStore('modal', () => {
  const modal: Ref<{
    type: ModalType;
    data: any;
  }> = ref({ type: null, data: null })

  function setModal({type, data} : {type: ModalType, data: any}) {
    if(type) {
      modal.value = { type, data }
    } else {
      modal.value = { type: null, data: null }
    }
  }

  return { modal, setModal }
})
