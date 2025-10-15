<template>
  <div class="task-item" :class="{ 'completed': task.isCompleted }">
    <div class="task-checkbox">
      <input 
        type="checkbox" 
        :checked="task.isCompleted"
        @change="toggleCompletion"
        :id="`task-${task.id}`"
      />
      <label :for="`task-${task.id}`"></label>
    </div>
    
    <div class="task-content">
      <h3 class="task-title">{{ task.title }}</h3>
      <p v-if="task.description" class="task-description">{{ task.description }}</p>
      
      <div class="task-meta">
        <span v-if="task.category" class="task-category">{{ task.category }}</span>
        <span class="task-priority" :class="`priority-${task.priority}`">
          {{ priorityLabel }}
        </span>
        <span class="task-date">{{ formatDate(task.createdAt) }}</span>
        <span v-if="task.dueDate" class="task-due-date" :class="{ 'overdue': isOverdue }">
          Due: {{ formatDate(task.dueDate) }}
        </span>
      </div>
    </div>
    
    <div class="task-actions">
      <button @click="$emit('edit', task)" class="btn-edit" title="Edit Task">
        ✏️
      </button>
      <button @click="$emit('delete', task.id)" class="btn-delete" title="Delete Task">
        🗑️
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Task, TaskPriority } from '@/types/task';

interface Props {
  task: Task;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  toggleCompletion: [id: number];
  edit: [task: Task];
  delete: [id: number];
}>();

const priorityLabel = computed(() => {
  const labels: Record<TaskPriority, string> = {
    1: 'Low',
    2: 'Medium', 
    3: 'High',
    4: 'Critical'
  };
  return labels[props.task.priority];
});

const isOverdue = computed(() => {
  if (!props.task.dueDate || props.task.isCompleted) return false;
  return new Date(props.task.dueDate) < new Date();
});

function toggleCompletion() {
  emit('toggleCompletion', props.task.id);
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}
</script>

<style scoped>
.task-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  transition: all 0.2s ease;
}

.task-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.task-item.completed {
  opacity: 0.7;
  background: #f9fafb;
}

.task-checkbox {
  flex-shrink: 0;
}

.task-checkbox input[type="checkbox"] {
  width: 1.25rem;
  height: 1.25rem;
  margin: 0;
  cursor: pointer;
}

.task-content {
  flex: 1;
}

.task-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
}

.task-item.completed .task-title {
  text-decoration: line-through;
  color: #6b7280;
}

.task-description {
  margin: 0 0 0.75rem 0;
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.4;
}

.task-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.75rem;
}

.task-category {
  background: #e5e7eb;
  color: #374151;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 500;
}

.task-priority {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 500;
}

.priority-1 {
  background: #dbeafe;
  color: #1d4ed8;
}

.priority-2 {
  background: #fef3c7;
  color: #d97706;
}

.priority-3 {
  background: #fed7d7;
  color: #dc2626;
}

.priority-4 {
  background: #fecaca;
  color: #991b1b;
}

.task-date {
  color: #6b7280;
}

.task-due-date {
  color: #059669;
}

.task-due-date.overdue {
  color: #dc2626;
  font-weight: 600;
}

.task-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.btn-edit,
.btn-delete {
  background: none;
  border: none;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s ease;
}

.btn-edit:hover {
  background: #f3f4f6;
}

.btn-delete:hover {
  background: #fee2e2;
}

@media (max-width: 640px) {
  .task-item {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .task-actions {
    justify-content: flex-end;
  }
  
  .task-meta {
    flex-direction: column;
    gap: 0.25rem;
  }
}
</style>