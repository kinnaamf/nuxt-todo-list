<script setup lang="ts">
import type { NewTask } from '~/types/task'

const props = defineProps<{ newTask: NewTask, isVisible: boolean }>()
</script>

<template>
  <input id="task--title"
         type="text"
         @keyup.enter="$emit('store-task', $event)"
         placeholder="Enter new task"
         v-model="newTask.title"
         class="border border-gray-400 w-10/12 rounded-md py-2 h-10 pl-4">
</template>

<style scoped lang="postcss">

</style>