<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute();
const result = route.query.result;
if(result === 'success') {
  window.parent.postMessage({ status: "CERT_SUCCESS" }, "*");
} else if(result === 'fail') {
  window.parent.postMessage({ status: "CERT_FAILED" }, "*");
} else {
  window.parent.postMessage({ status: "CERT_UNDEFINED" }, "*");
}

</script>

<template>
  <div>
<!--    <h1>CertView</h1>-->
  </div>
</template>

<style scoped>

</style>
