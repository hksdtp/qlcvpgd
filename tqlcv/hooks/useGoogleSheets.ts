// Custom Hook for Google Sheets Integration
import { useState, useEffect, useCallback } from 'react';
import { Task } from '../types';
import { googleSheetsService, GoogleSheetsError } from '../services/googleSheets';

interface UseGoogleSheetsState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  isOnline: boolean;
  lastSync: Date | null;
}

interface UseGoogleSheetsActions {
  refreshTasks: () => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<Task>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  clearError: () => void;
  exportTasks: () => Promise<{ tasks: Task[]; timestamp: string }>;
  importTasks: (tasks: Task[]) => Promise<void>;
}

export function useGoogleSheets() {
  const [state, setState] = useState<UseGoogleSheetsState>({
    tasks: [],
    loading: true,
    error: null,
    isOnline: true,
    lastSync: null,
  });

  // Check if Google Sheets is configured
  const isConfigured = useCallback(() => {
    return !!(import.meta.env.VITE_GOOGLE_SHEETS_API_KEY && 
              import.meta.env.VITE_GOOGLE_SPREADSHEET_ID);
  }, []);

  // Load tasks from Google Sheets
  const loadTasks = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) {
        setState(prev => ({ ...prev, loading: true, error: null }));
      }

      const tasks = await googleSheetsService.getTasks();
      
      setState(prev => ({
        ...prev,
        tasks,
        loading: false,
        error: null,
        isOnline: true,
        lastSync: new Date(),
      }));

      console.log(`📊 Loaded ${tasks.length} tasks from Google Sheets`);
      
    } catch (error) {
      const errorMessage = error instanceof GoogleSheetsError 
        ? error.message 
        : 'Không thể tải dữ liệu từ Google Sheets';
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
        isOnline: false,
      }));

      console.error('❌ Failed to load tasks:', error);
    }
  }, []);

  // Refresh tasks with force cache clear
  const refreshTasks = useCallback(async () => {
    console.log('🔄 Force refreshing tasks...');
    try {
      const freshTasks = await googleSheetsService.clearCacheAndRefresh();
      setState(prev => ({
        ...prev,
        tasks: freshTasks,
        lastSync: new Date(),
        error: null,
        loading: false
      }));
      console.log(`✅ Force refresh completed: ${freshTasks.length} tasks loaded`);
    } catch (error) {
      console.error('❌ Force refresh failed:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to refresh tasks',
        loading: false
      }));
    }
  }, []);

  // Add new task
  const addTask = useCallback(async (taskData: Omit<Task, 'id' | 'createdAt'>): Promise<Task> => {
    const newTask: Task = {
      ...taskData,
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      // Try to add to Google Sheets first
      const savedTask = await googleSheetsService.addTask(newTask);

      // Update local state with the saved task (may have server-side modifications)
      setState(prev => ({
        ...prev,
        tasks: [savedTask, ...prev.tasks.filter(t => t.id !== savedTask.id)], // Avoid duplicates
        loading: false,
        lastSync: new Date(),
        isOnline: true,
      }));

      console.log('✅ Task added successfully to Google Sheets:', savedTask.title);
      return savedTask;

    } catch (error) {
      const errorMessage = error instanceof GoogleSheetsError
        ? error.message
        : 'Không thể thêm công việc';

      // Still add to local state for offline functionality
      setState(prev => ({
        ...prev,
        tasks: [newTask, ...prev.tasks],
        loading: false,
        error: errorMessage,
        isOnline: false,
      }));

      console.warn('⚠️ Task added to localStorage only:', newTask.title);
      return newTask;
    }
  }, []);

  // Update existing task
  const updateTask = useCallback(async (updatedTask: Task) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      // Try to update in Google Sheets first
      const savedTask = await googleSheetsService.updateTask(updatedTask);

      // Update local state with the saved task
      setState(prev => ({
        ...prev,
        tasks: prev.tasks.map(task =>
          task.id === savedTask.id ? savedTask : task
        ),
        loading: false,
        lastSync: new Date(),
        isOnline: true,
      }));

      console.log('✅ Task updated successfully in Google Sheets:', savedTask.title);

    } catch (error) {
      const errorMessage = error instanceof GoogleSheetsError
        ? error.message
        : 'Không thể cập nhật công việc';

      // Still update local state for offline functionality
      setState(prev => ({
        ...prev,
        tasks: prev.tasks.map(task =>
          task.id === updatedTask.id ? updatedTask : task
        ),
        loading: false,
        error: errorMessage,
        isOnline: false,
      }));

      console.warn('⚠️ Task updated in localStorage only:', updatedTask.title);
      throw error;
    }
  }, []);

  // Delete task
  const deleteTask = useCallback(async (taskId: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      // Try to delete from Google Sheets first
      await googleSheetsService.deleteTask(taskId);

      // Update local state
      setState(prev => ({
        ...prev,
        tasks: prev.tasks.filter(task => task.id !== taskId),
        loading: false,
        lastSync: new Date(),
        isOnline: true,
      }));

      console.log('✅ Task deleted successfully from Google Sheets');

    } catch (error) {
      const errorMessage = error instanceof GoogleSheetsError
        ? error.message
        : 'Không thể xóa công việc';

      // Still delete from local state for offline functionality
      setState(prev => ({
        ...prev,
        tasks: prev.tasks.filter(task => task.id !== taskId),
        loading: false,
        error: errorMessage,
        isOnline: false,
      }));

      console.warn('⚠️ Task deleted from localStorage only');
      throw error;
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Export tasks
  const exportTasks = useCallback(async () => {
    return await googleSheetsService.exportTasks();
  }, []);

  // Import tasks
  const importTasks = useCallback(async (tasks: Task[]) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      await googleSheetsService.importTasks(tasks);
      
      setState(prev => ({
        ...prev,
        tasks,
        loading: false,
        lastSync: new Date(),
      }));

      console.log(`✅ Imported ${tasks.length} tasks successfully`);
      
    } catch (error) {
      const errorMessage = error instanceof GoogleSheetsError 
        ? error.message 
        : 'Không thể import dữ liệu';
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));

      throw error;
    }
  }, []);

  // Auto-sync every 5 minutes when online
  useEffect(() => {
    if (!isConfigured()) return;

    const interval = setInterval(() => {
      if (state.isOnline && !state.loading) {
        console.log('🔄 Auto-syncing with Google Sheets...');
        loadTasks(false); // Silent refresh
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [state.isOnline, state.loading, loadTasks, isConfigured]);

  // Initial load
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Health check on mount
  useEffect(() => {
    if (isConfigured()) {
      googleSheetsService.healthCheck().then(healthy => {
        setState(prev => ({ ...prev, isOnline: healthy }));
        if (healthy) {
          console.log('✅ Google Sheets connection healthy');
        } else {
          console.warn('⚠️ Google Sheets connection failed');
        }
      });
    }
  }, [isConfigured]);

  const actions: UseGoogleSheetsActions = {
    refreshTasks,
    addTask,
    updateTask,
    deleteTask,
    clearError,
    exportTasks,
    importTasks,
  };

  return {
    ...state,
    actions,
    isConfigured: isConfigured(),
  };
}
