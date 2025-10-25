<template>
  <Head>
    <Title>To do app</Title>
    <Body class="bg-slate-50"></Body>
  </Head>
  <div class="relative min-h-screen">

    <Transition name="slide-fade">
      <div class="absolute right-0 top-12 p-4 rounded-l-md max-w-2/12 text-white"
           :class="messageClass"
           v-if="isVisible">
        {{ message.title }}
      </div>
    </Transition>

    <div class="flex flex-col gap-8 w-2/4 mx-auto relative">
      <Transition name="title-slide">
        <div class="mt-12" v-if="showTitle">
          <h1 class="text-center text-5xl font-bold title">To Do List</h1>
        </div>
      </Transition>

      <Transition name="task">
        <div class="flex justify-between items-center bg-white px-4 py-4 rounded-md shadow-md" v-if="showTask">
          <input id="task--title"
                 type="text"
                 @keyup.enter="storeTask"
                 placeholder="Enter new task"
                 v-model="newTask.title"
                 @input="isVisible = false"
                 class="border border-gray-400 w-10/12 rounded-md py-2 h-10 pl-4">
          <button @click="storeTask" class="w-max bg-slate-700 text-white rounded-md h-10 px-6 font-normal uppercase">
            Add task
          </button>
        </div>
      </Transition>

      <div class="flex flex-col gap-4">
        <TransitionGroup name="list">
          <div v-for="task in tasks" :key="task.id"
               class="flex items-center justify-between bg-white px-4 py-2 rounded-md shadow-md"
              :class="task.editable ? 'ring-2 ring-emerald-400 transition-all duration-150' : 'transition-all duration-150'">
            <div class="flex gap-4 items-center w-full mr-2">

              <input type="checkbox" v-model="task.done" @change="toggleDone(task)">

              <h3 class="text-2xl font-medium" :class="taskDone(task)" v-if="!task.editable" @dblclick="editTask(task)">
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
                     @keyup.enter="updateTask(task)"
              >
            </div>

            <div class="flex gap-2 items-center">

              <button @click="editTask(task)" aria-label="Edit Task" class="bg-green-600 text-white p-2 rounded-md" v-if="!task.editable">
                <PencilIcon/>
              </button>
              <button @click="deleteTask(task.id)" aria-label="Delete Task" class="bg-red-500 text-white p-2 rounded-md" v-if="!task.editable">
                <TrashIcon/>
              </button>


              <button @click="updateTask(task)" aria-label="Update Task" class="bg-green-600 text-white p-2 rounded-md" v-if="task.editable">
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PencilIcon from "~/icons/PencilIcon.vue";
import TrashIcon from "~/icons/TrashIcon.vue";
import CloseIcon from "~/icons/CloseIcon.vue";
import CheckIcon from "~/icons/CheckIcon.vue";

import type { Task, NewTask } from "@/types/task"

onMounted(() => {
  getTasks();
})

onMounted(async () => {
  await nextTick();
  showTitle.value = true
  showTask.value = true
})

const newTask = reactive<NewTask>({
  title: "",
  done: false,
});

const showTitle = ref<boolean>(false);
const showTask = ref<boolean>(false);

const tasks = ref<Array<Task>>([]);

const message = reactive<{ title: string | null; status: "success" | "error" | null }>({
  title: null,
  status: null
})
const isVisible = ref(false)

const taskDone = (task: Task) => {
  return task.done ? 'text-gray-400 line-through transition-all duration-100' : 'text-gray-900 transition-all duration-100'
}

const messageClass = computed(() => {
  return message.status == "success" ? 'bg-emerald-600' : 'bg-red-600';
})

const showMessage = (title: string, status: string) => {
  Object.assign(message, { title, status });
  isVisible.value = true

  setTimeout(() => {
    isVisible.value = false
  }, 2500)
}

const getTasks = async () => {
  try {
    tasks.value = await $fetch("http://localhost:5000/tasks");
  } catch (e) {
    Object.assign(message, {
      title: "Could not fetch data",
      status: "error",
    })
  }
}

const storeTask = async () => {
  const title = newTask.title.trim()
  if (!title) {
    showMessage("Enter task name", "error")
    return;
  }

  try {
    const res = await $fetch(`http://localhost:5000/tasks`, {
      method: 'POST',
      body: {
        title: newTask.title,
        done: newTask.done
      }
    })
    tasks.value.push(res);
    nextTick(() => document.querySelector('#task--title').focus())

    showMessage("Task added!", "success")
  } catch (e: any) {
    if (e.message.includes("NetworkError")) {
      showMessage("Network Error", "error")
    }
  }

  newTask.title = ""
}

const editTask = async (task: Task) => {
  task.originalTitle = task.title
  task.editable = true;
}

const updateTask = async (task: Task) => {
  if(task.title.trim() === task.originalTitle?.trim()) {
    task.editable = false;
    return;
  }
  try {
    const res = await $fetch(`http://localhost:5000/tasks/${ task.id }`, {
      method: "PATCH",
      body: {
        title: task.title
      }
    })
    task.editable = false
    showMessage("Task updated successfully", "success")

  } catch (e) {
    showMessage("Could not update task", "error")
  }
}

const toggleDone = async (task: Task) => {
  const res = await $fetch(`http://localhost:5000/tasks/${ task.id }`, {
    method: "PATCH",
    body: {
      done: task.done
    }
  })
}

const deleteTask = async (id: string) => {
  try {
    const res = await $fetch(`http://localhost:5000/tasks/${ id }`, {
      method: "DELETE",
    })
    tasks.value = tasks.value.filter(task => task.id !== id)
    showMessage("Task deleted!", "success")
  } catch (e) {
    showMessage("Could not delete task", "error")
  }
}
</script>

<style lang="postcss" scoped>
input[type="checkbox"] {
  @apply w-6 h-6;
}

input {
  @apply outline-none;
}

input[type="checkbox"]:checked {
  @apply outline-none accent-emerald-400;
}

* {
  font-family: "Anton", sans-serif;
}

.title {
  font-family: 'Bungee', sans-serif;
}

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