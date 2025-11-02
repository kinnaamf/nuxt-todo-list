<template>
  <div class="flex gap-4 items-center">
    <button @click="emit('update:modelValue', 'all')">
      <TaskIcon
          :class="{ 'opacity-100' : modelValue === 'all', 'opacity-40': modelValue !== 'all' }"
      />
    </button>
    <button @click="emit('update:modelValue', 'done')">
      <CircleCheckIcon
          :class="{ 'opacity-100' : modelValue === 'done', 'opacity-40': modelValue !== 'done' }"
      />
    </button>
    <button @click="emit('update:modelValue', 'todo')">
      <CircleXIcon
          :class="{ 'opacity-100' : modelValue === 'todo', 'opacity-40': modelValue !== 'todo' }"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
import TaskIcon from "~/icons/TaskIcon.vue";
import CircleCheckIcon from "~/icons/CircleCheckIcon.vue";
import CircleXIcon from "~/icons/CircleXIcon.vue";

const props = defineProps<{ modelValue: 'all' | 'done' | 'todo' }>()
const emit = defineEmits(['update:modelValue'])
</script>