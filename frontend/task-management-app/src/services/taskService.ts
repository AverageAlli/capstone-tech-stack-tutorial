import axios from 'axios';
import type { Task, TaskStats, CreateTaskRequest, UpdateTaskRequest, TaskPriority } from '@/types/task';

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
    const params = new URLSearchParams();
    if (filters?.isCompleted !== undefined) {
      params.append('isCompleted', filters.isCompleted.toString());
    }
    if (filters?.category) {
      params.append('category', filters.category);
    }
    if (filters?.priority !== undefined) {
      params.append('priority', filters.priority.toString());
    }

    const response = await api.get<Task[]>(`/tasks?${params.toString()}`);
    return response.data;
  }

  static async getTask(id: number): Promise<Task> {
    const response = await api.get<Task>(`/tasks/${id}`);
    return response.data;
  }

  static async createTask(task: CreateTaskRequest): Promise<Task> {
    const response = await api.post<Task>('/tasks', task);
    return response.data;
  }

  static async updateTask(task: UpdateTaskRequest): Promise<void> {
    await api.put(`/tasks/${task.id}`, task);
  }

  static async deleteTask(id: number): Promise<void> {
    await api.delete(`/tasks/${id}`);
  }

  static async getCategories(): Promise<string[]> {
    const response = await api.get<string[]>('/tasks/categories');
    return response.data;
  }

  static async getStats(): Promise<TaskStats> {
    const response = await api.get<TaskStats>('/tasks/stats');
    return response.data;
  }
}

export default TaskService;