<script setup lang="ts">
import RequestMatchModal from '@/modals/RequestMatchModal.vue'
import RejectMatchModal from '@/modals/RejectMatchModal.vue'
import MatchedModal from '@/modals/MatchedModal.vue'
import BlockPartnerModal from '@/modals/BlockPartnerModal.vue'
import DeletePartnerModal from '@/modals/DeletePartnerModal.vue'
import LogoutModal from '@/modals/LogoutModal.vue'
import DeleteAccountModal from '@/modals/DeleteAccountModal.vue'
import PurchasePointModal from '@/modals/PurchasePointModal.vue'
import SelectModal from '@/modals/SelectModal.vue'
import DeepSelectModal from '@/modals/DeepSelectModal.vue'
import type { PropType } from 'vue'
import type { ModalType } from '@/types'

const props = defineProps({
  activeModal: {
    type: [String, null] as PropType<ModalType>,
    required: true,
  },
  modalPosition: {
    type: Object as PropType<{ left: string, width: string }>,
    required: true,
  },
  data: [Object, Array],
})

const emit = defineEmits(['close'])
</script>

<template>
  <section class="modal-area"
           :class="{ dimmed: props.activeModal !== null}"
           :style="props.modalPosition">
    <div class="dim" @click.stop="() => emit('close')" />
    <RequestMatchModal v-if="props.activeModal === 'request-match'" :data="props.data" />
    <RejectMatchModal v-if="props.activeModal === 'reject-match'" :data="props.data" />
    <MatchedModal v-if="props.activeModal === 'matched'" :data="props.data" />
    <BlockPartnerModal v-if="props.activeModal === 'block-partner'" :data="props.data" />
    <DeletePartnerModal v-if="props.activeModal === 'delete-partner'" :data="props.data" />
    <LogoutModal v-if="props.activeModal === 'logout'" :data="props.data" />
    <DeleteAccountModal v-if="props.activeModal === 'delete-account'" :data="props.data" />
    <PurchasePointModal v-if="props.activeModal === 'purchase-point'" :data="props.data" />
    <SelectModal v-if="props.activeModal === 'select'" :data="props.data" @close="() => emit('close')" />
    <DeepSelectModal v-if="props.activeModal === 'deep-select'" :data="props.data" @close="() => emit('close')" />

  </section>
</template>

<style scoped>
.modal-area {
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 1000;
  pointer-events: none;
}
.modal-area .dim {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, .7);
  transition: opacity .5s;
  opacity: 0;
  pointer-events: none;
}
.modal-area.dimmed .dim {
  opacity: 1;
  pointer-events: auto;
}
</style>
