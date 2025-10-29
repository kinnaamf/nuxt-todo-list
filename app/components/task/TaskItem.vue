<template>
  <div class="task-item-container" @dblclick="$emit('editTask', task)">

    <input type="checkbox" v-model="task.done" @change="$emit('toggleDone', task)">

    <h3 class="task-title" :class="taskDone(task)" v-if="!task.editable">
      {{ task.title }}
    </h3>
    <input type="text"
           name="edit"
           id="edit"
           v-model="task.title"
           v-if="task.editable"
           placeholder="Edit your task"
           class="task-edit-input"
           autofocus
           @keyup.enter="$emit('updateTask', task)">
  </div>

  <div class="btn-container">

    <button @click="$emit('editTask', task)"
            aria-label="Edit Task"
            :class="successBtnClass"
            v-if="!task.editable">
      <PencilIcon/>
    </button>
    <button @click="$emit('deleteTask', task.id)"
            aria-label="Delete Task"
            :class="dangerBtnClass"
            v-if="!task.editable">
      <TrashIcon/>
    </button>


    <button @click="$emit('updateTask', task)"
            aria-label="Update Task"
            :class="successBtnClass"
            v-if="task.editable">
      <CheckIcon/>
    </button>
    <button @click="task.editable = false; task.title = task.originalTitle"
            aria-label="Close edit menu"
            :class="dangerBtnClass"
            v-if="task.editable">
      <CloseIcon/>
    </button>

  </div>
</template>

<script setup lang="ts">
import CheckIcon from "~/icons/CheckIcon.vue";
import CloseIcon from "~/icons/CloseIcon.vue";
import PencilIcon from "~/icons/PencilIcon.vue";
import TrashIcon from "~/icons/TrashIcon.vue";
import type { Task } from "~/types/task";

defineProps<{ task: Task }>();
defineEmits(['editTask', 'updateTask', 'toggleDone', 'deleteTask']);

const taskDone = (task: Task) => {
  return task.done ? 'task-done' : 'task-not-done';
}

const successBtnClass = computed(() => {
  return 'btn-success'
})
const dangerBtnClass = computed(() => {
  return 'btn-danger'
})

</script>