<template>
  <NuxtPage/>
</template>

<style>
@import "~/assets/css/styles.pcss";

* {
  font-family: "Anton", sans-serif;
}

input[type="checkbox"] {
  @apply w-6 h-6;
}

input {
  @apply outline-none;
}

input[type="checkbox"]:checked {
  @apply outline-none accent-emerald-400;
}
</style>
<script setup lang="ts">
</script>