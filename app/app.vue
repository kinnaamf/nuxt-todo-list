<template>
  <NuxtPage/>
</template>

<style>
input[type="checkbox"] {
  @apply w-6 h-6;
}

input {
  @apply outline-none;
}

input[type="checkbox"]:checked {
  @apply outline-none accent-emerald-400;
}

* {
  font-family: "Anton", sans-serif;
}
</style>
<script setup lang="ts">
</script>