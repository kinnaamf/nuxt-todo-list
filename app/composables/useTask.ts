import type { Task, NewTask } from '~/types/task';
import type { Message } from '~/types/message';

export const useTask = () => {
  const config = useRuntimeConfig();
  const api_url = config.public.apiBase;

  const tasks = ref<Task[]>([]);
  const message = reactive<Message>({
    title: null,
    status: null
  });

  const isLoading = ref<boolean>(false);

  const isVisible = ref(false);

  const currentFilter = ref<string>('all');

  const newTask = reactive<NewTask>({
    title: '',
    done: false,
  });

  const isEmpty = computed(() => {
    return tasks.value.length === 0;
  })

  const filteredTasks = computed(() => {
    if (currentFilter.value === 'done')
      return tasks.value.filter((t: Task) => t.done);
    if (currentFilter.value === 'todo')
      return tasks.value.filter((t: Task) => !t.done);

    return tasks.value
  });

  const showMessage = (title: string, status: string) => {
    Object.assign(message, { title, status });
    isVisible.value = true

    setTimeout(() => {
      isVisible.value = false
    }, 1000)
  }

  const getTasks = async () => {
    isLoading.value = true;

    try {
      tasks.value = await $fetch(`${ api_url }/tasks`);
      isLoading.value = false;
    } catch (e) {
      Object.assign(message, {
        title: 'Could not fetch data',
        status: 'error',
      })
    }
  }

  const storeTask = async () => {
    const title = newTask.title?.trim()
    if (!title) {
      showMessage('Enter task name', 'error')
      return;
    }

    try {
      const res: Task = await $fetch(`${ api_url }/tasks`, {
        method: 'POST',
        body: {
          title: newTask.title,
          done: newTask.done
        }
      })

      tasks.value?.push(res);

      // await nextTick(() => document.querySelector('#task--title')?.focus())

      await nextTick();
      const input = document.querySelector<HTMLInputElement>('#task--title');
      input?.focus();

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
      const res = await $fetch(`${ api_url }/tasks/${ task.id }`, {
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
    try {
      const res = await $fetch(`${ api_url }/tasks/${ task.id }`, {
        method: 'PATCH',
        body: {
          done: task.done
        }
      })
    } catch (e) {
      showMessage('Could not toggle task', 'error')
    }
  }

  const deleteTask = async (id: string) => {
    try {
      const res = await $fetch(`${ api_url }/tasks/${ id }`, {
        method: 'DELETE',
      })
      tasks.value = tasks.value?.filter(task => task.id !== id)
      showMessage('Task deleted!', 'success')
    } catch (e) {
      showMessage('Could not delete task', 'error')
    }
  }

  return {
    tasks,
    message,
    isVisible,
    newTask,
    showMessage,
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
  }
}