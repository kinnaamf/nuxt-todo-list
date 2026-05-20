<template>
  <button @click="$emit('store-task', $event)" class="w-max bg-slate-700 text-white rounded-md h-12 px-8 font-normal uppercase">
    Add task
  </button>
</template>