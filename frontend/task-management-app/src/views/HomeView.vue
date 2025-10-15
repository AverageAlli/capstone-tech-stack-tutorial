<template>
  <div class="tasks-view">
    <header class="tasks-header">
      <div class="header-content">
        <h1>Task Management</h1>
        <div class="header-stats" v-if="!statsLoading">
          <div class="stat">
            <span class="stat-value">{{ taskStore.stats.totalTasks }}</span>
            <span class="stat-label">Total</span>
          </div>
          <div class="stat">
            <span class="stat-value">{{ taskStore.stats.pendingTasks }}</span>
            <span class="stat-label">Pending</span>
          </div>
          <div class="stat">
            <span class="stat-value">{{ taskStore.stats.completedTasks }}</span>
            <span class="stat-label">Completed</span>
          </div>
          <div class="stat">
            <span class="stat-value">{{ taskStore.stats.completionRate }}%</span>
            <span class="stat-label">Complete</span>
          </div>
        </div>
      </div>
    </header>

    <div class="tasks-toolbar">
      <div class="toolbar-left">
        <button @click="showCreateForm = true" class="btn btn-primary">
          + Add Task
        </button>
        
        <div class="filters">
          <select v-model="currentFilter" @change="applyFilters" class="filter-select">
            <option value="">All Tasks</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          
          <select v-model="selectedCategory" @change="applyFilters" class="filter-select">
            <option value="">All Categories</option>
            <option v-for="category in taskStore.categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>
      </div>
      
      <div class="toolbar-right">
        <button @click="refreshTasks" class="btn btn-outline" :disabled="taskStore.loading">
          {{ taskStore.loading ? 'Loading...' : 'Refresh' }}
        </button>
      </div>
    </div>

    <div class="tasks-content">
      <div v-if="taskStore.error" class="error-message">
        <p>{{ taskStore.error }}</p>
        <button @click="taskStore.clearError" class="btn btn-outline">Dismiss</button>
      </div>

      <div v-if="taskStore.loading && taskStore.tasks.length === 0" class="loading-message">
        <p>Loading tasks...</p>
      </div>

      <div v-else-if="taskStore.tasks.length === 0" class="empty-state">
        <div class="empty-icon">📝</div>
        <h3>No tasks yet</h3>
        <p>Create your first task to get started with your productivity journey!</p>
        <button @click="showCreateForm = true" class="btn btn-primary">
          Create Your First Task
        </button>
      </div>

      <div v-else class="tasks-list">
        <TaskItem
          v-for="task in taskStore.tasks"
          :key="task.id"
          :task="task"
          @toggle-completion="taskStore.toggleTaskCompletion"
          @edit="editTask"
          @delete="deleteTask"
        />
      </div>
    </div>

    <!-- Task Form Modal -->
    <TaskForm
      v-if="showCreateForm || editingTask"
      :task="editingTask"
      :categories="taskStore.categories"
      @close="closeForm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useTaskStore } from '@/stores/taskStore';
import TaskItem from '@/components/TaskItem.vue';
import TaskForm from '@/components/TaskForm.vue';
import type { Task } from '@/types/task';

const taskStore = useTaskStore();

// Form state
const showCreateForm = ref(false);
const editingTask = ref<Task | null>(null);

// Filter state
const currentFilter = ref('');
const selectedCategory = ref('');
const statsLoading = ref(true);

onMounted(async () => {
  await Promise.all([
    taskStore.fetchTasks(),
    taskStore.fetchCategories(),
    taskStore.fetchStats()
  ]);
  statsLoading.value = false;
});

async function refreshTasks() {
  await Promise.all([
    applyFilters(),
    taskStore.fetchCategories(),
    taskStore.fetchStats()
  ]);
}

async function applyFilters() {
  const filters: any = {};
  
  if (currentFilter.value === 'pending') {
    filters.isCompleted = false;
  } else if (currentFilter.value === 'completed') {
    filters.isCompleted = true;
  }
  
  if (selectedCategory.value) {
    filters.category = selectedCategory.value;
  }
  
  await taskStore.fetchTasks(filters);
}

function editTask(task: Task) {
  editingTask.value = task;
}

function closeForm() {
  showCreateForm.value = false;
  editingTask.value = null;
}

async function deleteTask(id: number) {
  if (confirm('Are you sure you want to delete this task?')) {
    await taskStore.deleteTask(id);
  }
}
</script>

<style scoped>
.tasks-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.tasks-header {
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.tasks-header h1 {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 700;
  color: #111827;
}

.header-stats {
  display: flex;
  gap: 2rem;
}

.stat {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: #3b82f6;
}

.stat-label {
  display: block;
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.tasks-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.filters {
  display: flex;
  gap: 0.5rem;
}

.filter-select {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  font-size: 0.875rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
  font-size: 0.875rem;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
}

.btn-outline {
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-outline:hover {
  background: #f9fafb;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-message {
  background: #fee2e2;
  border: 1px solid #fecaca;
  color: #991b1b;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.loading-message {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  margin: 0 0 1rem;
  font-size: 1.5rem;
  color: #374151;
}

.empty-state p {
  margin: 0 0 2rem;
  color: #6b7280;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (max-width: 768px) {
  .tasks-view {
    padding: 1rem 0.5rem;
  }
  
  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .header-stats {
    width: 100%;
    justify-content: space-around;
  }
  
  .tasks-toolbar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .toolbar-left {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filters {
    width: 100%;
  }
  
  .filter-select {
    flex: 1;
  }
}
</style>
