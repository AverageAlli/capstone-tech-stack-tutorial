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

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority: TaskPriority;
  category?: string;
  dueDate?: string;
}

export interface UpdateTaskRequest extends CreateTaskRequest {
  id: number;
  isCompleted: boolean;
}