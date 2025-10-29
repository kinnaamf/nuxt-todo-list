<template>
  <TransitionGroup name="list">
    <div v-for="task in tasks" :key="task.id"
         class="task-item"
         :class="task.editable ? 'task-editable' : ''">
      <TaskItem :task="task"
                @edit-task="$emit('editTask', task)"
                @update-task="$emit('updateTask', task)"
                @toggle-done="$emit('toggleDone', task)"
                @delete-task="$emit('deleteTask', task.id)"/>
    </div>
  </TransitionGroup>
</template>

<script setup lang="ts">
import type { Task } from "~/types/task";

const { tasks } = defineProps<{ tasks: Task[] }>();
defineEmits(['editTask', 'updateTask', 'toggleDone', 'deleteTask']);
</script>