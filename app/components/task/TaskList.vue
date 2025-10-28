<script setup lang="ts">

import CloseIcon from "~/icons/CloseIcon.vue";
import CheckIcon from "~/icons/CheckIcon.vue";
import TrashIcon from "~/icons/TrashIcon.vue";
import PencilIcon from "~/icons/PencilIcon.vue";
import type { Task } from "~/types/task";

const { tasks } = defineProps<{ tasks: Task[] }>();
defineEmits(['editTask', 'updateTask', 'toggleDone', 'deleteTask']);

const taskDone = (task: Task) => {
  return task.done ? 'text-gray-400 line-through transition-all duration-100' : 'text-gray-900 transition-all duration-100'
}
</script>

<template>
  <TransitionGroup name="list">
    <div v-for="task in tasks" :key="task.id"
         class="flex items-center justify-between bg-white px-4 py-2 rounded-md shadow-md"
         :class="task.editable ? 'ring-2 ring-emerald-400 transition-all duration-150' : 'transition-all duration-150'">
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
                class="bg-green-600 text-white p-2 rounded-md"
                v-if="!task.editable">
          <PencilIcon/>
        </button>
        <button @click="$emit('deleteTask', task.id)"
                aria-label="Delete Task"
                class="bg-red-500 text-white p-2 rounded-md"
                v-if="!task.editable">
          <TrashIcon/>
        </button>


        <button @click="$emit('updateTask', task)"
                aria-label="Update Task"
                class="bg-green-600 text-white p-2 rounded-md"
                v-if="task.editable">
          <CheckIcon/>
        </button>
        <button @click="task.editable = !task.editable; task.title = task.originalTitle"
                aria-label="Close edit menu"
                class="bg-red-500 text-white p-2 rounded-md"
                v-if="task.editable">
          <CloseIcon/>
        </button>

      </div>
    </div>
  </TransitionGroup>
</template>

<style scoped lang="postcss">

</style>