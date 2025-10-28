import type { Task, NewTask } from '~/types/task';

export const useTask = () => {
  const tasks = ref<Task[]>([]);
  const message = reactive<{ title: string | null; status: 'success' | 'error' | null}>({
    title: null,
    status: null,
  })
  const isVisible = ref(false);

  const newTask = reactive<NewTask>({
    title: '',
    done: false,
  });

  const showMessage = (title: string, status: string) => {
    Object.assign(message, { title, status });
    isVisible.value = true

    setTimeout(() => {
      isVisible.value = false
    }, 2500)
  }

  const getTasks = async () => {
    try {
      tasks.value = await $fetch('http://localhost:5000/tasks');
    } catch (e) {
      Object.assign(message, {
        title: 'Could not fetch data',
        status: 'error',
      })
    }
  }

  const storeTask = async () => {
    const title = newTask.title.trim()
    if (!title) {
      showMessage('Enter task name', 'error')
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
      tasks.value?.push(res);
      await nextTick(() => document.querySelector('#task--title').focus())

      showMessage('Task added!', 'success')
    } catch (e: any) {
      if (e.message.includes('NetworkError')) {
        showMessage('Network Error', 'error')
      }
    }

    newTask.title = ''
  }

  const editTask = async (task: Task) => {
    task.originalTitle = task.title
    task.editable = true;
  }

  const updateTask = async (task: Task) => {
    if (task.title.trim() === task.originalTitle?.trim()) {
      task.editable = false;
      return;
    }
    try {
      const res = await $fetch(`http://localhost:5000/tasks/${ task.id }`, {
        method: 'PATCH',
        body: {
          title: task.title
        }
      })
      task.editable = false
      showMessage('Task updated successfully', 'success')

    } catch (e) {
      showMessage('Could not update task', 'error')
    }
  }

  const toggleDone = async (task: Task) => {
    const res = await $fetch(`http://localhost:5000/tasks/${ task.id }`, {
      method: 'PATCH',
      body: {
        done: task.done
      }
    })
  }

  const deleteTask = async (id: string) => {
    try {
      const res = await $fetch(`http://localhost:5000/tasks/${ id }`, {
        method: 'DELETE',
      })
      tasks.value = tasks.value?.filter(task => task.id !== id)
      showMessage('Task deleted!', 'success')
    } catch (e) {
      showMessage('Could not delete task', 'error')
    }
  }

  return { tasks, message, isVisible, newTask, showMessage, getTasks, storeTask, editTask, updateTask, toggleDone, deleteTask }
}