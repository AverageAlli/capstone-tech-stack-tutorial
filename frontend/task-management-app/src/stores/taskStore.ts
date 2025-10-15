import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import TaskService from '@/services/taskService';
import type { Task, TaskStats, CreateTaskRequest, UpdateTaskRequest, TaskPriority } from '@/types/task';

export const useTaskStore = defineStore('tasks', () => {
  // State
  const tasks = ref<Task[]>([]);
  const stats = ref<TaskStats>({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    completionRate: 0
  });
  const categories = ref<string[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const completedTasks = computed(() => tasks.value.filter(task => task.isCompleted));
  const pendingTasks = computed(() => tasks.value.filter(task => !task.isCompleted));
  const tasksByCategory = computed(() => {
    const grouped: Record<string, Task[]> = {};
    tasks.value.forEach(task => {
      const category = task.category || 'Uncategorized';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(task);
    });
    return grouped;
  });

  // Actions
  async function fetchTasks(filters?: {
    isCompleted?: boolean;
    category?: string;
    priority?: TaskPriority;
  }) {
    loading.value = true;
    error.value = null;
    
    try {
      tasks.value = await TaskService.getTasks(filters);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch tasks';
      console.error('Error fetching tasks:', err);
    } finally {
      loading.value = false;
    }
  }

  async function createTask(taskData: CreateTaskRequest) {
    loading.value = true;
    error.value = null;
    
    try {
      const newTask = await TaskService.createTask(taskData);
      tasks.value.unshift(newTask);
      await fetchStats(); // Update stats
      return newTask;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create task';
      console.error('Error creating task:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateTask(taskData: UpdateTaskRequest) {
    loading.value = true;
    error.value = null;
    
    try {
      await TaskService.updateTask(taskData);
      const index = tasks.value.findIndex(task => task.id === taskData.id);
      if (index !== -1) {
        // Preserve original createdAt and other required fields
        const existingTask = tasks.value[index];
        if (existingTask) {
          tasks.value[index] = { 
            ...existingTask,
            ...taskData,
            createdAt: existingTask.createdAt // Preserve original creation date
          };
        }
      }
      await fetchStats(); // Update stats
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update task';
      console.error('Error updating task:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteTask(id: number) {
    loading.value = true;
    error.value = null;
    
    try {
      await TaskService.deleteTask(id);
      tasks.value = tasks.value.filter(task => task.id !== id);
      await fetchStats(); // Update stats
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete task';
      console.error('Error deleting task:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function toggleTaskCompletion(id: number) {
    const task = tasks.value.find(t => t.id === id);
    if (!task) return;

    const updatedTask: UpdateTaskRequest = {
      ...task,
      isCompleted: !task.isCompleted
    };

    await updateTask(updatedTask);
  }

  async function fetchStats() {
    try {
      stats.value = await TaskService.getStats();
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }

  async function fetchCategories() {
    try {
      categories.value = await TaskService.getCategories();
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  }

  function clearError() {
    error.value = null;
  }

  return {
    // State
    tasks,
    stats,
    categories,
    loading,
    error,
    
    // Getters
    completedTasks,
    pendingTasks,
    tasksByCategory,
    
    // Actions
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    fetchStats,
    fetchCategories,
    clearError
  };
});