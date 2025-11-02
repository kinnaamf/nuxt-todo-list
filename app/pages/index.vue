<template>
  <Head>
    <Title>To do app</Title>
    <Body class="bg-slate-50"></Body>
  </Head>
  <main class="main-container">

    <Transition name="bounce">
      <Loader v-if="isLoading"/>
    </Transition>

    <Transition name="slide-fade">
      <MessageToast v-if="isVisible" :message="message" :class="messageClass"/>
    </Transition>

    <div class="app-container">
      <Transition name="title-slide">
        <div class="mt-12" v-if="showTitle">
          <h1 class="title">To Do List</h1>
        </div>
      </Transition>

      <TransitionGroup name="task">
        <div class="task-container" v-if="showTask">
          <TaskInput :newTask="newTask" :is-visible="isVisible" @store-task="storeTask"/>
          <TaskButton @store-task="storeTask"></TaskButton>
        </div>
      </TransitionGroup>

      <TaskFilter v-model="currentFilter"/>

      <Transition name="empty">
        <div v-if="showEmptyMessage">
          <h3 class="is-empty">
            Task list is empty
          </h3>
        </div>
      </Transition>

      <div class="task-list">
        <TaskList :tasks="filteredTasks"
                  @edit-task="editTask" @update-task="updateTask" @toggle-done="toggleDone"
                  @delete-task="deleteTask"/>
      </div>

    </div>
  </main>
</template>

<script setup lang="ts">
import TaskButton from '~/components/task/TaskButton.vue';
import TaskList from '~/components/task/TaskList.vue';
import MessageToast from "~/components/message/MessageToast.vue";
import type { Task } from "~/types/task"

onMounted(async () => {
  await getTasks();
  await nextTick();
  showTitle.value = true
  showTask.value = true
})

const {
  tasks,
  message,
  isVisible,
  newTask,
  getTasks,
  storeTask,
  editTask,
  updateTask,
  toggleDone,
  deleteTask,
  isLoading,
  isEmpty,
  currentFilter,
  filteredTasks
} = useTask()

const showTitle = ref<boolean>(false);
const showTask = ref<boolean>(false);

const showEmptyMessage = computed(() => showTask.value && isEmpty.value && !isLoading.value);

const messageClass = computed(() => {
  return message.status == 'success' ? 'bg-emerald-600' : 'bg-red-600';
})
</script>

<style lang="postcss" scoped>
@import "~/assets/css/transitions.pcss";
</style>