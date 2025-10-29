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
@import "~/assets/css/transitions.pcss"
</style>