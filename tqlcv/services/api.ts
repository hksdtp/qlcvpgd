// API Service for PostgreSQL Backend
// Author: Nguyen Hai Ninh

import { Task, Subtask, Comment, User } from '../types';

const API_BASE_URL = '/api';

// Error handling
export class APIError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'APIError';
  }
}

// Helper function for API calls
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new APIError(error.message || 'API request failed', response.status);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError(`Network error: ${error}`);
  }
}

// Tasks API
export const tasksAPI = {
  // Get all tasks
  async getAll(): Promise<Task[]> {
    return apiCall<Task[]>('/tasks');
  },

  // Get task by ID
  async getById(id: string): Promise<Task> {
    return apiCall<Task>(`/tasks/${id}`);
  },

  // Create task
  async create(task: Omit<Task, 'id' | 'createdAt'>): Promise<Task> {
    return apiCall<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    });
  },

  // Update task
  async update(id: string, task: Partial<Task>): Promise<Task> {
    return apiCall<Task>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(task),
    });
  },

  // Delete task
  async delete(id: string): Promise<void> {
    return apiCall<void>(`/tasks/${id}`, {
      method: 'DELETE',
    });
  },

  // Get tasks by department
  async getByDepartment(department: string): Promise<Task[]> {
    return apiCall<Task[]>(`/tasks?department=${encodeURIComponent(department)}`);
  },

  // Get tasks by status
  async getByStatus(status: string): Promise<Task[]> {
    return apiCall<Task[]>(`/tasks?status=${encodeURIComponent(status)}`);
  },
};

// Subtasks API
export const subtasksAPI = {
  // Create subtask
  async create(taskId: string, subtask: Omit<Subtask, 'id' | 'createdAt'>): Promise<Subtask> {
    return apiCall<Subtask>(`/tasks/${taskId}/subtasks`, {
      method: 'POST',
      body: JSON.stringify(subtask),
    });
  },

  // Update subtask
  async update(taskId: string, subtaskId: string, subtask: Partial<Subtask>): Promise<Subtask> {
    return apiCall<Subtask>(`/tasks/${taskId}/subtasks/${subtaskId}`, {
      method: 'PUT',
      body: JSON.stringify(subtask),
    });
  },

  // Delete subtask
  async delete(taskId: string, subtaskId: string): Promise<void> {
    return apiCall<void>(`/tasks/${taskId}/subtasks/${subtaskId}`, {
      method: 'DELETE',
    });
  },

  // Toggle subtask completion
  async toggle(taskId: string, subtaskId: string): Promise<Subtask> {
    return apiCall<Subtask>(`/tasks/${taskId}/subtasks/${subtaskId}/toggle`, {
      method: 'POST',
    });
  },
};

// Comments API
export const commentsAPI = {
  // Create comment
  async create(taskId: string, comment: Omit<Comment, 'id' | 'createdAt' | 'likes' | 'likedBy'>): Promise<Comment> {
    return apiCall<Comment>(`/tasks/${taskId}/comments`, {
      method: 'POST',
      body: JSON.stringify(comment),
    });
  },

  // Update comment
  async update(taskId: string, commentId: string, content: string): Promise<Comment> {
    return apiCall<Comment>(`/tasks/${taskId}/comments/${commentId}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    });
  },

  // Delete comment
  async delete(taskId: string, commentId: string): Promise<void> {
    return apiCall<void>(`/tasks/${taskId}/comments/${commentId}`, {
      method: 'DELETE',
    });
  },

  // Like comment
  async like(taskId: string, commentId: string, userId: string): Promise<Comment> {
    return apiCall<Comment>(`/tasks/${taskId}/comments/${commentId}/like`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  },

  // Unlike comment
  async unlike(taskId: string, commentId: string, userId: string): Promise<Comment> {
    return apiCall<Comment>(`/tasks/${taskId}/comments/${commentId}/unlike`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  },
};

// Users API
export const usersAPI = {
  // Get all users
  async getAll(): Promise<User[]> {
    return apiCall<User[]>('/users');
  },

  // Get user by ID
  async getById(id: string): Promise<User> {
    return apiCall<User>(`/users/${id}`);
  },
};

// Export/Import API
export const dataAPI = {
  // Export all data
  async export(): Promise<{ tasks: Task[]; timestamp: string }> {
    return apiCall<{ tasks: Task[]; timestamp: string }>('/data/export');
  },

  // Import data
  async import(data: { tasks: Task[] }): Promise<{ imported: number }> {
    return apiCall<{ imported: number }>('/data/import', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// Health check
export const healthAPI = {
  async check(): Promise<{ status: string; database: boolean }> {
    return apiCall<{ status: string; database: boolean }>('/health');
  },
};

// Main API object
export const api = {
  tasks: tasksAPI,
  subtasks: subtasksAPI,
  comments: commentsAPI,
  users: usersAPI,
  data: dataAPI,
  health: healthAPI,
};

export default api;

