<template>
  <Head>
    <Title>To do app</Title>
    <Body class="bg-slate-50"></Body>
  </Head>
  <main class="main-container">

    <Transition name="slide-fade">
      <div class="corner-notification"
           :class="messageClass"
           v-if="isVisible">
        {{ message.title }}
      </div>
    </Transition>

    <div class="app-container">
      <Transition name="title-slide">
        <div class="mt-12" v-if="showTitle">
          <h1 class="title">To Do List</h1>
        </div>
      </Transition>

      <Transition name="task">
        <div class="task-container" v-if="showTask">
          <TaskInput :newTask="newTask" :is-visible="isVisible" @store-task="storeTask" />
          <TaskButton @store-task="storeTask"></TaskButton>
        </div>
      </Transition>

      <div class="task-list">
        <TaskList :tasks="tasks" @edit-task="editTask" @update-task="updateTask" @toggle-done="toggleDone" @delete-task="deleteTask" />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import TaskButton from '~/components/task/TaskButton.vue';
import TaskList from '~/components/task/TaskList.vue';

onMounted(async () => {
  await getTasks();
  await nextTick();
  showTitle.value = true
  showTask.value = true
})

const { tasks, message, isVisible, newTask, showMessage, getTasks, storeTask, editTask, updateTask, toggleDone, deleteTask } = useTask()

const showTitle = ref<boolean>(false);
const showTask = ref<boolean>(false);

const messageClass = computed(() => {
  return message.status == 'success' ? 'bg-emerald-600' : 'bg-red-600';
})
</script>

<style lang="postcss" scoped>
.slide-fade-enter-active {
  @apply transition-all duration-500 ease-out;
}

.slide-fade-leave-active {
  @apply transition-all duration-500 ease-in;
}

.slide-fade-enter-from {
  @apply transform translate-x-4 opacity-0;
}

.slide-fade-leave-to {
  @apply transform translate-x-12 opacity-0;
}

.list-enter-active {
  @apply transition-all duration-500 ease-out;
}

.list-leave-active {
  @apply transition-all duration-500 ease-in;
}

.list-enter-from, .list-leave-to {
  @apply transform -translate-x-24 opacity-0;
}

.title-slide-enter-active {
  @apply transition-all duration-500 ease-in-out;
}

.title-slide-enter-from {
  @apply opacity-0 -translate-y-8;
}

.title-slide-leave-to {
  @apply opacity-100 translate-y-0;
}

.task-enter-active {
  @apply transition-all duration-1000 ease-in-out;
}

.task-enter-from {
  @apply opacity-0 -translate-x-8;
}

.task-leave-to {
  @apply opacity-100 translate-x-0;
}
</style>