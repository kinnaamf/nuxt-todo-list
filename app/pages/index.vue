<template>
  <Head>
    <Title>To do app</Title>
    <Body class="bg-slate-50"></Body>
  </Head>
  <div class="relative min-h-screen">

    <Transition name="slide-fade">
      <div class="absolute right-0 top-12 bg-red-600 p-4 rounded-l-md max-w-2/12" v-if="error">
        <h3 class="text-md text-white font-semibold">{{ error }}</h3>
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
          <input type="text" @keyup.enter="storeTask" placeholder="Enter new task" v-model="newTask.title"
                 @input="error = null"
                 class="border border-gray-400 w-10/12 rounded-md py-2 h-10 pl-4">
          <button @click="storeTask" class="w-max bg-slate-700 text-white rounded-md h-10 px-6 font-normal uppercase">
            Add task
          </button>
        </div>
      </Transition>

      <div class="flex flex-col gap-4">
        <TransitionGroup name="list">
          <div v-for="task in tasks" :key="task.id"
               class="flex items-center justify-between bg-white px-4 py-2 rounded-md shadow-md">
            <div class="flex gap-4 items-center w-full mr-2">
              <input type="checkbox" v-model="task.done" @change="toggleDone(task)">
              <h3 class="text-2xl font-medium"
                  :class="task.done ? 'text-gray-400 line-through transition-all duration-100' : 'text-gray-900 transition-all duration-100'"
                  v-if="!task.editable">
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
            <div class="flex gap-2 items-center" v-if="!task.editable">
              <button @click="editTask(task)" class="bg-green-600 text-white p-2 rounded-md">
                <PencilIcon/>
              </button>
              <button @click="deleteTask(task.id)" class="bg-red-500 text-white p-2 rounded-md">
                <TrashIcon/>
              </button>
            </div>
            <div class="flex gap-2 items-center" v-if="task.editable">
              <button @click="updateTask(task)" class="bg-green-600 text-white p-2 rounded-md">
                <CheckIcon/>
              </button>
              <button @click="task.editable = !task.editable" class="bg-red-500 text-white p-2 rounded-md">
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

interface Task {
  id: string;
  title: string;
  done: boolean;
  editable?: boolean;
}

interface NewTask {
  title: string;
  done: boolean;
}

onMounted(() => {
  getTasks();
  setTimeout(() => {
    showTitle.value = true
  }, 10);
  setTimeout(() => {
    showTask.value = true
  }, 10)
})

const newTask = reactive<NewTask>({
  title: "",
  done: false,
});

const showTitle = ref<boolean>(false);
const showTask = ref<boolean>(false);

const tasks = ref<Array<Task>>([]);

const error = ref<string | null>(null);

const getTasks = async () => {
  try {
    tasks.value = await $fetch("http://localhost:5000/tasks");
  } catch (e) {
    error.value = "Could not fetch data"
  }
}

const storeTask = async () => {
  const title = newTask.title.trim()
  if (!title) {
    error.value = "Enter task name"
    return;
  } else error.value = null;

  try {
    const res = await $fetch(`http://localhost:5000/tasks`, {
      method: 'POST',
      body: {
        title: newTask.title,
        done: newTask.done
      }
    })
    tasks.value.push(res);

  } catch (e: any) {
    if (e.message.includes("NetworkError")) {
      error.value = "Server is unavailable at the moment. Try again later.";
    }
  }

  newTask.title = ""
}

const editTask = async (task: Task) => {
  task.editable = true;
}

const updateTask = async (task: Task) => {
  try {
    const res = await $fetch(`http://localhost:5000/tasks/${ task.id }`, {
      method: "PATCH",
      body: {
        title: task.title
      }
    })
    task.editable = false;
  } catch (e) {
    error.value = "Could not update data"
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
    tasks.value = tasks.value.filter(t => t.id !== id)
  } catch (e) {
    error.value = "Could not delete task"
  }
}
</script>

<style lang="postcss" scoped>
input[type="checkbox"] {
  @apply w-6 h-6;
}

input {
  outline: none;
}

input[type="checkbox"]:checked {
  outline: none;
  accent-color: bisque;
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

.slide-fade-enter-from, .slide-fade-leave-to {
  @apply transform translate-x-4 opacity-0;
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
  transition: all .5s ease
}

.title-slide-enter-from {
  opacity: 0;
  transform: translateY(-30px);
}

.title-slide-leave-to {
  opacity: 1;
  transform: translateY(0);
}


.task-enter-active {
  transition: all 1s ease
}

.task-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.task-leave-to {
  opacity: 1;
  transform: translateX(0);
}
</style>