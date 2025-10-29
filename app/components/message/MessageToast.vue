<template>
  <div class="corner-notification">
    {{ message.title }}
  </div>
</template>

<script setup lang="ts">
  import type { Message } from "~/types/message";

  const { message } = defineProps<{message: Message}>();
</script>