<script setup lang="ts">

import CheckIcon from "~/icons/CheckIcon.vue";
import CloseIcon from "~/icons/CloseIcon.vue";
import PencilIcon from "~/icons/PencilIcon.vue";
import TrashIcon from "~/icons/TrashIcon.vue";
import type { Task } from "~/types/task";

defineProps<{task: Task}>();
defineEmits(['editTask', 'updateTask', 'toggleDone', 'deleteTask']);

const taskDone = (task: Task) => {
  return task.done ? 'text-gray-400 line-through transition-all duration-100' : 'text-gray-900 transition-all duration-100'
}

const successBtnClass = computed(() => {return 'bg-green-600 text-white p-2 rounded-md'})
const dangerBtnClass = computed(() => {return 'bg-red-600 text-white p-2 rounded-md'})
</script>

<template>
  <div class="flex gap-4 items-center w-full mr-2">

    <input type="checkbox" v-model="task.done" @change="$emit('toggleDone', task)">

    <h3 class="text-2xl font-medium" :class="taskDone(task)" v-if="!task.editable" @dblclick="$emit('editTask', task)">
      {{ task.title }}
    </h3>
    <input type="text"
           name="edit"
           id="edit"
           v-model="task.title"
           v-if="task.editable"
           placeholder="Edit your task"
           class="text-2xl font-medium w-9/12"
           autofocus
           style="outline: none"
           @keyup.enter="$emit('updateTask', task)"
    >
  </div>

  <div class="flex gap-2 items-center">

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
    <button @click="task.editable = !task.editable; task.title = task.originalTitle"
            aria-label="Close edit menu"
            :class="dangerBtnClass"
            v-if="task.editable">
      <CloseIcon/>
    </button>

  </div>
</template>

<style scoped lang="postcss">

</style>