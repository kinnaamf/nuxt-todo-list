<template>
  <Head>
    <Title>To do app</Title>
    <Body class="bg-slate-50"></Body>
  </Head>
  <div>
    <div class="space-y-12 w-2/4 mx-auto">
      <div class="mt-12">
        <h1 class="text-center text-5xl font-bold">To Do List</h1>
      </div>
      <div class="flex justify-between items-center bg-white px-4 py-4 rounded-md shadow-md">
        <input type="text" @keyup.enter="storeTask" placeholder="Enter new task" v-model="newTask.title"
               class="border border-gray-400 w-10/12 rounded-md py-2 h-10 pl-4">
        <button @click="storeTask" class="w-max bg-blue-400 text-white rounded-md h-10 px-6 font-semibold">Add task
        </button>
      </div>
      <div v-if="error">
        <h3>{{ error }}</h3>
      </div>
      <div class="flex flex-col gap-4">
        <div v-for="task in tasks" :key="task.id"
             class="flex items-center justify-between bg-white px-4 py-2 rounded-md shadow-md">
          <div class="flex gap-4 items-center w-full">
            <input type="checkbox" v-model="task.done" @change="toggleDone(task)">
            <h3 class="text-2xl font-medium" v-if="!task.editable">
              {{ task.title }}
            </h3>
            <input type="text" v-model="task.title" v-if="task.editable" placeholder="Edit your task" class="w-9/12">
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
})

const newTask = reactive<NewTask>({
  title: "",
  done: false,
});
const tasks = ref<Array<Task>>([]);

const error = ref<string | null>(null);

const getTasks = async () => {
  tasks.value = await $fetch("http://localhost:5000/tasks");
}

const storeTask = async () => {
  const title = newTask.title.trim();
  if (!title) {
    error.value = "Enter task name"
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
  } catch (e) {
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
  const res = await $fetch(`http://localhost:5000/tasks/${task.id}`, {
    method: "PATCH",
    body: {
      title: task.title
    }
  })
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
  } catch (error) {
    console.log(error)
  }
}
</script>

<style scoped lang="postcss">
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
</style>