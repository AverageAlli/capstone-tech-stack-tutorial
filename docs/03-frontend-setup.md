# Frontend Setup - Vue.js Application

This guide walks you through setting up the Vue.js frontend for the Task Management application.

## Prerequisites

- [Node.js 18+](https://nodejs.org/)
- npm or yarn package manager
- Code editor (VS Code recommended)

## Project Structure

```
frontend/task-management-app/
├── src/
│   ├── components/          # Reusable Vue components
│   │   ├── TaskItem.vue     # Individual task display
│   │   └── TaskForm.vue     # Task creation/editing form
│   ├── services/            # API service layer
│   │   └── taskService.ts   # API communication
│   ├── stores/              # Pinia state management
│   │   └── taskStore.ts     # Task state management
│   ├── types/               # TypeScript type definitions
│   │   └── task.ts          # Task-related types
│   ├── views/               # Page components
│   │   └── HomeView.vue     # Main task management view
│   ├── App.vue              # Root component
│   └── main.ts              # Application entry point
├── public/                  # Static assets
├── .env                     # Environment variables
├── package.json             # Dependencies and scripts
└── vite.config.ts           # Vite configuration
```

## Step 1: Create the Project

```bash
cd frontend
npm create vue@latest task-management-app -- --typescript --router --pinia --eslint
cd task-management-app
npm install
```

## Step 2: Add Required Dependencies

Install additional packages for API communication:

```bash
npm install axios @types/axios
```

## Step 3: Configure Environment Variables

Create `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

## Step 4: Define TypeScript Types

Create `src/types/task.ts`:

```typescript
export interface Task {
  id: number;
  title: string;
  description?: string;
  isCompleted: boolean;
  createdAt: string;
  completedAt?: string;
  priority: TaskPriority;
  category?: string;
  dueDate?: string;
}

export enum TaskPriority {
  Low = 1,
  Medium = 2,
  High = 3,
  Critical = 4
}

export interface TaskStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  completionRate: number;
}
```

## Step 5: Create API Service

Create `src/services/taskService.ts`:

```typescript
import axios from 'axios';
import type { Task, TaskStats, CreateTaskRequest } from '@/types/task';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export class TaskService {
  static async getTasks(filters?: {
    isCompleted?: boolean;
    category?: string;
    priority?: TaskPriority;
  }): Promise<Task[]> {
    // Implementation
  }

  static async createTask(task: CreateTaskRequest): Promise<Task> {
    // Implementation
  }

  static async updateTask(task: UpdateTaskRequest): Promise<void> {
    // Implementation
  }

  static async deleteTask(id: number): Promise<void> {
    // Implementation
  }

  static async getStats(): Promise<TaskStats> {
    // Implementation
  }
}
```

## Step 6: Set Up State Management

Create `src/stores/taskStore.ts` using Pinia:

```typescript
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import TaskService from '@/services/taskService';
import type { Task, TaskStats } from '@/types/task';

export const useTaskStore = defineStore('tasks', () => {
  // State
  const tasks = ref<Task[]>([]);
  const stats = ref<TaskStats>({ /* initial values */ });
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const completedTasks = computed(() => tasks.value.filter(task => task.isCompleted));
  const pendingTasks = computed(() => tasks.value.filter(task => !task.isCompleted));

  // Actions
  async function fetchTasks() {
    // Implementation
  }

  async function createTask(taskData: CreateTaskRequest) {
    // Implementation
  }

  async function updateTask(taskData: UpdateTaskRequest) {
    // Implementation
  }

  async function deleteTask(id: number) {
    // Implementation
  }

  return {
    // State, getters, and actions
  };
});
```

## Step 7: Create Components

### TaskItem Component (`src/components/TaskItem.vue`)

A reusable component for displaying individual tasks:

```vue
<template>
  <div class="task-item" :class="{ 'completed': task.isCompleted }">
    <div class="task-checkbox">
      <input 
        type="checkbox" 
        :checked="task.isCompleted"
        @change="toggleCompletion"
      />
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
      </div>
    </div>
    
    <div class="task-actions">
      <button @click="$emit('edit', task)" class="btn-edit">✏️</button>
      <button @click="$emit('delete', task.id)" class="btn-delete">🗑️</button>
    </div>
  </div>
</template>

<script setup lang="ts">
// Component logic
</script>

<style scoped>
/* Component styles */
</style>
```

### TaskForm Component (`src/components/TaskForm.vue`)

A modal form for creating and editing tasks:

```vue
<template>
  <div class="task-form-overlay" @click.self="$emit('close')">
    <div class="task-form">
      <div class="form-header">
        <h2>{{ isEditing ? 'Edit Task' : 'Create New Task' }}</h2>
        <button @click="$emit('close')" class="close-btn">×</button>
      </div>
      
      <form @submit.prevent="handleSubmit">
        <!-- Form fields -->
      </form>
    </div>
  </div>
</template>
```

## Step 8: Create Main View

Update `src/views/HomeView.vue`:

```vue
<template>
  <div class="tasks-view">
    <header class="tasks-header">
      <h1>Task Management</h1>
      <div class="header-stats">
        <!-- Task statistics -->
      </div>
    </header>

    <div class="tasks-toolbar">
      <button @click="showCreateForm = true" class="btn btn-primary">
        + Add Task
      </button>
      
      <div class="filters">
        <!-- Filter controls -->
      </div>
    </div>

    <div class="tasks-content">
      <!-- Task list or empty state -->
      <div v-if="taskStore.tasks.length === 0" class="empty-state">
        <h3>No tasks yet</h3>
        <p>Create your first task to get started!</p>
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
      @close="closeForm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useTaskStore } from '@/stores/taskStore';
import TaskItem from '@/components/TaskItem.vue';
import TaskForm from '@/components/TaskForm.vue';

const taskStore = useTaskStore();
const showCreateForm = ref(false);
const editingTask = ref<Task | null>(null);

onMounted(async () => {
  await taskStore.fetchTasks();
});
</script>
```

## Step 9: Build and Run

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Features

### Core Features
- **Task Management**: Create, read, update, delete tasks
- **Real-time Updates**: Immediate UI updates after API calls
- **Task Filtering**: Filter by completion status and category
- **Task Statistics**: Display completion rates and counts
- **Responsive Design**: Works on desktop and mobile devices

### UI/UX Features
- **Modal Forms**: Clean task creation/editing experience
- **Visual Feedback**: Loading states, error handling
- **Task Priorities**: Visual priority indicators
- **Due Dates**: Display and highlight overdue tasks
- **Empty States**: Helpful messaging when no tasks exist

### Technical Features
- **TypeScript**: Type-safe development
- **Pinia Store**: Centralized state management
- **Composition API**: Modern Vue.js patterns
- **Axios Integration**: Robust API communication
- **Error Handling**: User-friendly error messages
- **Environment Configuration**: Easy deployment configuration

## Styling

The application uses modern CSS with:
- **CSS Grid & Flexbox**: Responsive layouts
- **CSS Variables**: Consistent theming
- **Hover Effects**: Interactive feedback
- **Mobile-first Design**: Responsive breakpoints
- **Accessibility**: ARIA labels and keyboard navigation

## Next Steps

1. [API Integration](./04-api-integration.md)
2. [Authentication](./05-authentication.md)
3. [Deployment](./06-deployment.md)

## Development Tips

- Use Vue DevTools for debugging
- Install Volar extension for VS Code
- Enable Prettier for code formatting
- Use ESLint for code quality
- Test components in isolation