<script setup lang="ts">
import type { Task } from "~/types/task";

const { tasks } = defineProps<{ tasks: Task[] }>();
defineEmits(['editTask', 'updateTask', 'toggleDone', 'deleteTask']);
</script>

<template>
  <TransitionGroup name="list">
    <div v-for="task in tasks" :key="task.id"
         class="flex items-center justify-between bg-white px-4 py-2 rounded-md shadow-md"
         :class="task.editable ? 'ring-2 ring-emerald-400 transition-all duration-150' : 'transition-all duration-150'">
      <TaskItem :task="task" @edit-task="$emit('editTask', task)" @update-task="$emit('updateTask', task)" @toggle-done="$emit('toggleDone', task)" @delete-task="$emit('deleteTask', task.id)" ></TaskItem>
    </div>
  </TransitionGroup>
</template>

<style scoped lang="postcss">

</style>