import { type Ref, ref } from 'vue'
import { defineStore } from 'pinia'

export const useToastStore = defineStore('toast', () => {
  const toast: Ref<{
    type: any;
    data: any;
  }> = ref({ type: null, data: null })

  function setToast({type, data} : {type: any, data: any}) {
    if(type) {
      toast.value = { type, data }
    } else {
      toast.value = { type: null, data: null }
    }
  }

  return { toast, setToast }
})
