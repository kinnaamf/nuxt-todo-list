<template>
  <div>
    <div>
      <h1>To Do List</h1>
    </div>
    <div>
      <input type="text"
             placeholder="Enter new task"
             v-model="newTask.title"
      >
      <button @click="storeTask">Add task</button>
    </div>
    <div>
      <div>
        <div
            v-for="task in tasks"
            :key="task.id"
        >
          <input
              type="checkbox"
              v-model="task.done"
          > {{ task.title }}

          <button @click="deleteTask(task.id)">Remove task</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

interface Task {
  id: string;
  title: string;
  done: boolean;
}

interface NewTask {
  title: string;
  done: boolean;
}

const newTask = reactive<NewTask>({
  title: "",
  done: false,
});
const tasks = ref<Array<Task>>([]);

const { data: tasksData } = await useLazyFetch("http://localhost:5000/tasks");

tasks.value = tasksData.value

const storeTask = async () => {
  const title = newTask.title.trim();
  if (!title) return;

  try {
    const res = await $fetch(`http://localhost:5000/tasks`, {
      method: 'POST',
      body: {
        title: newTask.title,
        done: newTask.done
      }
    })
    tasks.value.push(res);
  } catch (error) {
    console.log(error)
  }

  newTask.title = ""
}

const deleteTask = async (id: string) => {
  try {
    const res = await useFetch(`http://localhost:5000/tasks/${ id }`, {
      method: "DELETE",
    })
    tasks.value = tasks.value.filter(t => t.id !== id)
  } catch (error) {
    console.log(error)
  }
}
</script>