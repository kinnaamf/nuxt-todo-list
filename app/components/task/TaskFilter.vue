<template>
  <div class="flex justify-between">
    <div>
      <span>Filters :</span>
    </div>
    <div class="flex gap-4 items-center">
      <button class="filter-btn" @click="emit('update:modelValue', 'all')"
              :class="{ 'opacity-100' : modelValue === 'all', 'opacity-40': modelValue !== 'all' }"
      >
        All
        <TaskIcon
        />
      </button>
      <button class="filter-btn" @click="emit('update:modelValue', 'done')"
              :class="{ 'opacity-100' : modelValue === 'done', 'opacity-40': modelValue !== 'done' }"
      >
        Completed
        <CircleCheckIcon
        />
      </button>
      <button class="filter-btn" @click="emit('update:modelValue', 'todo')"
              :class="{ 'opacity-100' : modelValue === 'todo', 'opacity-40': modelValue !== 'todo' }">
        To complete
        <CircleXIcon

        />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import TaskIcon from "~/icons/TaskIcon.vue";
import CircleCheckIcon from "~/icons/CircleCheckIcon.vue";
import CircleXIcon from "~/icons/CircleXIcon.vue";

const props = defineProps<{ modelValue: 'all' | 'done' | 'todo' }>()
const emit = defineEmits(['update:modelValue'])
</script>