<template>
  <div class="task-form-overlay" @click.self="$emit('close')">
    <div class="task-form">
      <div class="form-header">
        <h2>{{ isEditing ? 'Edit Task' : 'Create New Task' }}</h2>
        <button @click="$emit('close')" class="close-btn">×</button>
      </div>
      
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="title">Title *</label>
          <input
            id="title"
            v-model="form.title"
            type="text"
            required
            placeholder="Enter task title"
            class="form-control"
          />
        </div>
        
        <div class="form-group">
          <label for="description">Description</label>
          <textarea
            id="description"
            v-model="form.description"
            placeholder="Enter task description (optional)"
            class="form-control"
            rows="3"
          ></textarea>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="category">Category</label>
            <input
              id="category"
              v-model="form.category"
              type="text"
              placeholder="e.g., Development, Learning"
              class="form-control"
              list="categories"
            />
            <datalist id="categories">
              <option v-for="category in categories" :key="category" :value="category" />
            </datalist>
          </div>
          
          <div class="form-group">
            <label for="priority">Priority</label>
            <select id="priority" v-model="form.priority" class="form-control">
              <option :value="1">Low</option>
              <option :value="2">Medium</option>
              <option :value="3">High</option>
              <option :value="4">Critical</option>
            </select>
          </div>
        </div>
        
        <div class="form-group">
          <label for="dueDate">Due Date</label>
          <input
            id="dueDate"
            v-model="form.dueDate"
            type="datetime-local"
            class="form-control"
          />
        </div>
        
        <div v-if="isEditing" class="form-group">
          <label class="checkbox-label">
            <input v-model="form.isCompleted" type="checkbox" />
            Mark as completed
          </label>
        </div>
        
        <div class="form-actions">
          <button type="button" @click="$emit('close')" class="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? 'Saving...' : (isEditing ? 'Update' : 'Create') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue';
import { useTaskStore } from '@/stores/taskStore';
import type { Task, TaskPriority } from '@/types/task';

interface Props {
  task?: Task | null;
  categories: string[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  submit: [task: any];
}>();

const taskStore = useTaskStore();
const loading = ref(false);

const isEditing = !!props.task;

const form = reactive({
  title: '',
  description: '',
  category: '',
  priority: 2 as TaskPriority,
  dueDate: '',
  isCompleted: false
});

// Initialize form with task data if editing
watch(() => props.task, (task) => {
  if (task) {
    form.title = task.title;
    form.description = task.description || '';
    form.category = task.category || '';
    form.priority = task.priority;
    form.dueDate = task.dueDate ? formatDateForInput(task.dueDate) : '';
    form.isCompleted = task.isCompleted;
  }
}, { immediate: true });

function formatDateForInput(dateString: string): string {
  const date = new Date(dateString);
  return date.toISOString().slice(0, 16);
}

async function handleSubmit() {
  loading.value = true;
  
  try {
    const taskData = {
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      category: form.category.trim() || undefined,
      priority: form.priority,
      dueDate: form.dueDate || undefined
    };

    if (isEditing && props.task) {
      await taskStore.updateTask({
        ...taskData,
        id: props.task.id,
        isCompleted: form.isCompleted
      });
    } else {
      await taskStore.createTask(taskData);
    }
    
    emit('close');
  } catch (error) {
    console.error('Failed to save task:', error);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.task-form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.task-form {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1.5rem 0;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 1.5rem;
}

.form-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #6b7280;
  padding: 0;
  line-height: 1;
}

.close-btn:hover {
  color: #374151;
}

form {
  padding: 0 1.5rem 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.form-control:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

textarea.form-control {
  resize: vertical;
  min-height: 80px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: normal;
}

.checkbox-label input[type="checkbox"] {
  width: auto;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

@media (max-width: 640px) {
  .task-form-overlay {
    padding: 0.5rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column-reverse;
  }
  
  .btn {
    width: 100%;
  }
}
</style>