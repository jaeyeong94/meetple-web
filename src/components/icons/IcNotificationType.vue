<script setup lang="ts">
import type { PropType } from 'vue'
import type { NotificationType } from '@/types'

const props = defineProps({
  type: {
    type: String as PropType<NotificationType>,
    required: true,
  }
})

const category =
  props.type === 'recommended-meeting'
    ? 'match-success' :
  props.type === 'match-reject'
    ? 'match-failure' :
    'normal'
</script>

<template>
  <div v-if="category === 'match-success'">
    <svg width="54" height="55" viewBox="0 0 54 55" fill="none" xmlns="http://www.w3.org/2000/svg" >
      <circle cx="27" cy="27.833" r="27" fill="#FFD5EE"/>
      <g opacity="0.01">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M12 41.833H41V12.833H12V41.833Z" fill="white"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M14.4166 39.4162H38.5832V15.2495H14.4166V39.4162Z" fill="white"/>
      </g>
      <path d="M26.5 38.6982L18.0776 30.6418L16.393 29.0304C14.0672 26.8057 14.0672 23.1986 16.393 20.9739C18.7188 18.7492 22.4897 18.7492 24.8155 20.9739L26.5 22.5851L28.1846 20.9738C30.5103 18.7489 34.2812 18.749 36.607 20.9738C38.9328 23.1985 38.9328 26.8056 36.6069 29.0303L34.9225 30.6417L31.2885 34.1178L30.9998 34.3939L25.6364 29.0304" stroke="white" stroke-width="1.85" stroke-linecap="square"/>
      <rect x="26.5383" y="17.8486" width="5.91554" height="2.47091" transform="rotate(45 26.5383 17.8486)" fill="#FFD5EE"/>
    </svg>
  </div>

  <div v-else-if="category === 'match-failure'">
    <svg width="54" height="55" viewBox="0 0 54 55" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="27" cy="27.833" r="27" fill="#DFDFDF"/>
      <g opacity="0.01">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M12 41.833H41V12.833H12V41.833Z" fill="white"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M14.4166 39.4162H38.5832V15.2495H14.4166V39.4162Z" fill="white"/>
      </g>
      <path d="M26.5 38.6982L18.0776 30.6418L16.393 29.0304C14.0672 26.8057 14.0672 23.1986 16.393 20.9739C18.7188 18.7492 22.4897 18.7492 24.8155 20.9739L26.5 22.5851L28.1846 20.9738C30.5103 18.7489 34.2812 18.749 36.607 20.9738C38.9328 23.1985 38.9328 26.8056 36.6069 29.0303L34.9225 30.6417L31.2885 34.1178L30.9998 34.3939L25.6364 29.0304" stroke="white" stroke-width="1.85" stroke-linecap="square"/>
      <rect x="26.5381" y="17.8486" width="5.91554" height="2.47091" transform="rotate(45 26.5381 17.8486)" fill="#DFDFDF"/>
    </svg>
  </div>

  <div v-else>
    <svg width="54" height="55" viewBox="0 0 54 55" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="27" cy="27.833" r="27" fill="#D9D4FF"/>
      <g opacity="0.01">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M12 41.833H41V12.833H12V41.833Z" fill="white"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M14.4166 39.4162H38.5832V15.2495H14.4166V39.4162Z" fill="white"/>
      </g>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M27.8726 21.6041H17.58C17.2598 21.6041 17 21.8639 17 22.1829V31.7348C17 32.0538 17.2598 32.3136 17.58 32.3136H20.7108L21.2413 37.333H24.8977L24.3672 32.3136H24.389H27.8726L35.4174 37.333V21.6041V16.5859L27.8726 21.6041Z" stroke="white" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </div>
</template>
