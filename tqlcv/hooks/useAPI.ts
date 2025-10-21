// Custom Hook for PostgreSQL API
// Author: Nguyen Hai Ninh

import { useState, useEffect, useCallback } from 'react';
import { Task, Subtask, Comment } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface UseAPIState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

interface UseAPIActions {
  refreshTasks: () => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'subtasks' | 'comments'>) => Promise<Task>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  addSubtask: (taskId: string, subtask: Omit<Subtask, 'id' | 'createdAt'>) => Promise<void>;
  updateSubtask: (taskId: string, subtaskId: string, updates: Partial<Subtask>) => Promise<void>;
  toggleSubtask: (taskId: string, subtaskId: string) => Promise<void>;
  deleteSubtask: (taskId: string, subtaskId: string) => Promise<void>;
  addComment: (taskId: string, comment: { content: string; authorId: string }) => Promise<void>;
  updateComment: (taskId: string, commentId: string, content: string) => Promise<void>;
  deleteComment: (taskId: string, commentId: string) => Promise<void>;
  likeComment: (taskId: string, commentId: string, userId: string) => Promise<void>;
  unlikeComment: (taskId: string, commentId: string, userId: string) => Promise<void>;
  likeTask: (taskId: string, userId: string) => Promise<void>;
  unlikeTask: (taskId: string, userId: string) => Promise<void>;
  clearError: () => void;
}

export function useAPI(): UseAPIState & UseAPIActions {
  const [state, setState] = useState<UseAPIState>({
    tasks: [],
    loading: true,
    error: null,
  });

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const response = await fetch(`${API_BASE_URL}/api/tasks`);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Không thể tải dữ liệu (${response.status}): ${errorText || 'Server error'}`);
      }

      const tasks = await response.json();

      setState({
        tasks,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error fetching tasks:', error);

      let errorMessage = 'Không thể kết nối đến server';

      if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = `Không thể kết nối đến API server (${API_BASE_URL}). Vui lòng kiểm tra server đang chạy.`;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
    }
  }, []);

  // Load tasks on mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Refresh tasks
  const refreshTasks = useCallback(async () => {
    await fetchTasks();
  }, [fetchTasks]);

  // Add task
  const addTask = useCallback(async (task: Omit<Task, 'id' | 'createdAt' | 'subtasks' | 'comments'>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          department: task.department,
          createdBy: task.createdBy,
          subtasks: task.subtasks || [],
        }),
      });

      if (!response.ok) throw new Error('Failed to create task');
      
      const newTask = await response.json();
      await refreshTasks();
      return newTask;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }, [refreshTasks]);

  // Update task
  const updateTask = useCallback(async (taskId: string, updates: Partial<Task>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error('Failed to update task');
      
      await refreshTasks();
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }, [refreshTasks]);

  // Delete task
  const deleteTask = useCallback(async (taskId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete task');
      
      await refreshTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }, [refreshTasks]);

  // Add subtask
  const addSubtask = useCallback(async (taskId: string, subtask: Omit<Subtask, 'id' | 'createdAt'>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}/subtasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subtask),
      });

      if (!response.ok) throw new Error('Failed to create subtask');
      
      await refreshTasks();
    } catch (error) {
      console.error('Error creating subtask:', error);
      throw error;
    }
  }, [refreshTasks]);

  // Update subtask
  const updateSubtask = useCallback(async (taskId: string, subtaskId: string, updates: Partial<Subtask>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}/subtasks/${subtaskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error('Failed to update subtask');
      
      await refreshTasks();
    } catch (error) {
      console.error('Error updating subtask:', error);
      throw error;
    }
  }, [refreshTasks]);

  // Toggle subtask
  const toggleSubtask = useCallback(async (taskId: string, subtaskId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}/subtasks/${subtaskId}/toggle`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to toggle subtask');
      
      await refreshTasks();
    } catch (error) {
      console.error('Error toggling subtask:', error);
      throw error;
    }
  }, [refreshTasks]);

  // Delete subtask
  const deleteSubtask = useCallback(async (taskId: string, subtaskId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}/subtasks/${subtaskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete subtask');
      
      await refreshTasks();
    } catch (error) {
      console.error('Error deleting subtask:', error);
      throw error;
    }
  }, [refreshTasks]);

  // Add comment
  const addComment = useCallback(async (taskId: string, comment: { content: string; authorId: string }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(comment),
      });

      if (!response.ok) throw new Error('Failed to create comment');
      
      await refreshTasks();
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  }, [refreshTasks]);

  // Update comment
  const updateComment = useCallback(async (commentId: string, content: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/comments/${commentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) throw new Error('Failed to update comment');

      await refreshTasks();
    } catch (error) {
      console.error('Error updating comment:', error);
      throw error;
    }
  }, [refreshTasks]);

  // Delete comment
  const deleteComment = useCallback(async (commentId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete comment');

      await refreshTasks();
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }, [refreshTasks]);

  // Like comment
  const likeComment = useCallback(async (taskId: string, commentId: string, userId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}/comments/${commentId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) throw new Error('Failed to like comment');
      
      await refreshTasks();
    } catch (error) {
      console.error('Error liking comment:', error);
      throw error;
    }
  }, [refreshTasks]);

  // Unlike comment
  const unlikeComment = useCallback(async (taskId: string, commentId: string, userId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}/comments/${commentId}/unlike`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) throw new Error('Failed to unlike comment');

      await refreshTasks();
    } catch (error) {
      console.error('Error unliking comment:', error);
      throw error;
    }
  }, [refreshTasks]);

  // Like task
  const likeTask = useCallback(async (taskId: string, userId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) throw new Error('Failed to like task');

      await refreshTasks();
    } catch (error) {
      console.error('Error liking task:', error);
      throw error;
    }
  }, [refreshTasks]);

  // Unlike task
  const unlikeTask = useCallback(async (taskId: string, userId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}/unlike`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) throw new Error('Failed to unlike task');

      await refreshTasks();
    } catch (error) {
      console.error('Error unliking task:', error);
      throw error;
    }
  }, [refreshTasks]);

  // Upload attachment
  const uploadAttachment = useCallback(async (taskId: string, file: File, userId: string) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);

      const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}/attachments`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload attachment');

      const attachment = await response.json();
      await refreshTasks();
      return attachment;
    } catch (error) {
      console.error('Error uploading attachment:', error);
      throw error;
    }
  }, [refreshTasks]);

  // Get attachments for a task
  const getAttachments = useCallback(async (taskId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}/attachments`);
      if (!response.ok) throw new Error('Failed to fetch attachments');
      return await response.json();
    } catch (error) {
      console.error('Error fetching attachments:', error);
      throw error;
    }
  }, []);

  // Delete attachment
  const deleteAttachment = useCallback(async (attachmentId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/attachments/${attachmentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete attachment');

      await refreshTasks();
    } catch (error) {
      console.error('Error deleting attachment:', error);
      throw error;
    }
  }, [refreshTasks]);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    refreshTasks,
    addTask,
    updateTask,
    deleteTask,
    addSubtask,
    updateSubtask,
    toggleSubtask,
    deleteSubtask,
    addComment,
    updateComment,
    deleteComment,
    likeComment,
    unlikeComment,
    likeTask,
    unlikeTask,
    uploadAttachment,
    getAttachments,
    deleteAttachment,
    clearError,
  };
}

