// Enhanced Google Sheets API Service with full CRUD support
import { Task } from '../types';

// Configuration - FORCE NEW API URL
const GOOGLE_SHEETS_CONFIG = {
  // Read-only API (existing)
  apiKey: import.meta.env.VITE_GOOGLE_SHEETS_API_KEY || '',
  spreadsheetId: import.meta.env.VITE_GOOGLE_SPREADSHEET_ID || '',
  range: 'Tasks!A:H',
  baseUrl: 'https://sheets.googleapis.com/v4/spreadsheets',

  // Write API (Google Apps Script backend) - HARDCODED NEW URL
  apiBackendUrl: 'https://script.google.com/macros/s/AKfycbwsmSL9Sy8Musz8aSK15FhoKUlyVuNX9ipLugurb4w74BSsCPfI1vkInT7jnWjgH0HD/exec',
};

// Debug log to verify URL
console.log('🔧 Google Sheets Config:');
console.log('- API Backend URL:', GOOGLE_SHEETS_CONFIG.apiBackendUrl);
console.log('- ENV URL:', import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL);
console.log('- Using hardcoded URL for debugging');

// Error classes
export class GoogleSheetsError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'GoogleSheetsError';
  }
}

// Helper functions
function taskToRow(task: Task): string[] {
  return [
    task.id,
    task.title,
    task.description || '',
    task.status,
    task.department || '',
    JSON.stringify(task.subtasks || []),
    task.createdAt,
    new Date().toISOString(), // updatedAt
  ];
}

function rowToTask(row: string[]): Task | null {
  if (!row || row.length < 7) return null;

  // Skip header row and invalid data
  if (row[0] === 'ID' || typeof row[0] !== 'string' || row[0].trim() === '') {
    return null;
  }

  // Accept both task_ and test_ prefixes (and any other valid IDs)
  if (!row[0].includes('task_') && !row[0].includes('test_')) {
    console.log('⚠️ Skipping row with unexpected ID format:', row[0]);
    return null;
  }

  try {
    // Convert English status back to Vietnamese for frontend display
    const englishStatus = row[3] || 'todo';
    const statusMap: { [key: string]: string } = {
      'todo': 'Chưa làm',
      'in-progress': 'Đang làm',
      'planning': 'Lên Kế Hoạch',
      'review': 'Đang Review',
      'completed': 'Hoàn thành',
      'paused': 'Tạm dừng',
      'cancelled': 'Hủy bỏ'
    };

    const vietnameseStatus = statusMap[englishStatus] || englishStatus;

    return {
      id: row[0] || '',
      title: row[1] || '',
      description: row[2] || undefined,
      status: vietnameseStatus as any,
      department: row[4] || undefined,
      subtasks: row[5] ? JSON.parse(row[5]) : [],
      createdAt: row[6] || new Date().toISOString(),
      comments: row[8] ? JSON.parse(row[8]).map((comment: any) => ({
        ...comment,
        likes: comment.likes || 0,
        likedBy: comment.likedBy || [],
        isEdited: comment.isEdited || false
      })) : [],
    };
  } catch (error) {
    console.error('Error parsing row:', error, row);
    return null;
  }
}

// Google Sheets Service Class
export class GoogleSheetsService {
  private cache: { data: Task[] | null; timestamp: number; userId?: string } = { data: null, timestamp: 0 };
  private readonly CACHE_DURATION = 2 * 60 * 1000; // 2 minutes
  private currentUserId: string = 'u4'; // Default to NI user

  constructor() {
    if (!GOOGLE_SHEETS_CONFIG.apiKey || !GOOGLE_SHEETS_CONFIG.spreadsheetId) {
      console.warn('⚠️ Google Sheets read credentials not configured. Using localStorage fallback.');
    }
    if (!GOOGLE_SHEETS_CONFIG.apiBackendUrl) {
      console.warn('⚠️ Google Apps Script backend URL not configured. Write operations will use localStorage fallback.');
    }
  }

  // Set current user for user-specific data storage
  setCurrentUser(userId: string): void {
    if (this.currentUserId !== userId) {
      console.log(`👤 Switching user from ${this.currentUserId} to ${userId}`);
      this.currentUserId = userId;
      // Clear cache when user changes
      this.clearCache();
    }
  }

  private isCacheValid(): boolean {
    return this.cache.data !== null &&
           this.cache.userId === this.currentUserId &&
           (Date.now() - this.cache.timestamp) < this.CACHE_DURATION;
  }

  // Force clear cache and refresh data
  async clearCacheAndRefresh(): Promise<Task[]> {
    console.log('🔄 Clearing cache and forcing refresh...');
    this.cache = { data: null, timestamp: 0, userId: undefined };
    localStorage.removeItem('tasks_cache');
    return this.getTasks();
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${GOOGLE_SHEETS_CONFIG.baseUrl}/${GOOGLE_SHEETS_CONFIG.spreadsheetId}/${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new GoogleSheetsError(
          `Google Sheets API error: ${response.statusText}`,
          response.status
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof GoogleSheetsError) throw error;
      throw new GoogleSheetsError(`Network error: ${error}`);
    }
  }

  // Read tasks from Google Sheets
  async getTasks(): Promise<Task[]> {
    // Return cached data if valid
    if (this.isCacheValid()) {
      console.log('📦 Returning cached Google Sheets data');
      return this.cache.data!;
    }

    try {
      console.log('📊 Fetching tasks from Google Sheets...');

      // Use Google Apps Script for consistent API
      if (!GOOGLE_SHEETS_CONFIG.apiBackendUrl) {
        console.warn('⚠️ No Google Apps Script URL configured, using localStorage fallback');
        const fallbackTasks = this.getLocalStorageFallback();
        return fallbackTasks;
      }

      const response = await fetch(`${GOOGLE_SHEETS_CONFIG.apiBackendUrl}?action=getTasks`, {
        method: 'GET',
        mode: 'cors', // Try CORS first, fallback to no-cors if needed
      });

      let result;
      try {
        result = await response.json();
      } catch (jsonError) {
        // If CORS blocks JSON reading, try no-cors mode
        console.log('🔄 CORS blocked, retrying with no-cors mode...');
        const noCorsResponse = await fetch(`${GOOGLE_SHEETS_CONFIG.apiBackendUrl}?action=getTasks`, {
          method: 'GET',
          mode: 'no-cors',
        });

        // With no-cors, we can't read response, so assume success and use cache/localStorage
        const fallbackTasks = this.getLocalStorageFallback();
        console.log(`📱 Using localStorage fallback due to CORS: ${fallbackTasks.length} tasks`);
        return fallbackTasks;
      }

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch tasks');
      }

      const tasks = result.data || [];

      console.log('📊 Raw tasks from Google Apps Script:', tasks.length);
      console.log('✅ Successfully loaded tasks:', tasks.length);
      console.log('📋 Task IDs:', tasks.map((t: Task) => t.id));

      // Update cache
      this.cache = {
        data: tasks,
        timestamp: Date.now(),
        userId: this.currentUserId,
      };

      console.log(`✅ Loaded ${tasks.length} tasks from Google Sheets`);
      return tasks;

    } catch (error) {
      console.error('❌ Failed to fetch from Google Sheets:', error);

      // Fallback to localStorage
      const fallbackTasks = this.getLocalStorageFallback();
      console.log(`📱 Using localStorage fallback: ${fallbackTasks.length} tasks`);
      return fallbackTasks;
    }
  }

  // Write tasks to Google Sheets via Apps Script backend
  async saveTasks(tasks: Task[]): Promise<void> {
    try {
      console.log('💾 Saving tasks to Google Sheets...');

      if (!GOOGLE_SHEETS_CONFIG.apiBackendUrl) {
        console.warn('⚠️ No backend URL configured, using localStorage fallback');
        this.saveToLocalStorage(tasks);
        return;
      }

      // Note: This would require implementing a bulk update endpoint
      // For now, we'll use individual operations
      console.log('⚠️ Bulk save not implemented, use individual operations');
      this.saveToLocalStorage(tasks);

      // Update cache
      this.cache = {
        data: tasks,
        timestamp: Date.now(),
        userId: this.currentUserId,
      };

      console.log(`✅ Saved ${tasks.length} tasks (localStorage fallback)`);

    } catch (error) {
      console.error('❌ Failed to save to Google Sheets:', error);
      this.saveToLocalStorage(tasks);
      throw new GoogleSheetsError(`Save failed: ${error}`);
    }
  }

  // Add single task to Google Sheets
  async addTask(task: Task): Promise<Task> {
    try {
      console.log('➕ Adding task to Google Sheets...');

      if (!GOOGLE_SHEETS_CONFIG.apiBackendUrl) {
        console.warn('⚠️ No backend URL, using localStorage fallback');
        const tasks = await this.getTasks();
        const updatedTasks = [task, ...tasks];
        this.saveToLocalStorage(updatedTasks);
        this.cache.data = updatedTasks;
        return task;
      }

      // Convert Vietnamese status to English before sending
      const statusMap: { [key: string]: string } = {
        'Chưa làm': 'todo',
        'Đang làm': 'in-progress',
        'Lên Kế Hoạch': 'planning',
        'Đang Review': 'review',
        'Hoàn thành': 'completed',
        'Tạm dừng': 'paused',
        'Hủy bỏ': 'cancelled'
      };

      // Create task copy with English status for backend
      const taskForBackend = {
        ...task,
        status: statusMap[task.status] || task.status
      };

      console.log('🔄 Create task status mapping:', task.status, '→', taskForBackend.status);
      console.log('🌐 API URL:', GOOGLE_SHEETS_CONFIG.apiBackendUrl);

      // Use GET request with URL parameters to avoid CORS preflight
      const taskData = encodeURIComponent(JSON.stringify(taskForBackend));
      const response = await fetch(`${GOOGLE_SHEETS_CONFIG.apiBackendUrl}?action=createTask&taskData=${taskData}`, {
        method: 'GET',
        mode: 'no-cors'
      });

      // With no-cors mode, we can't read the response, so we assume success

      // Update cache optimistically
      if (this.cache.data) {
        this.cache.data = [task, ...this.cache.data];
      }

      console.log(`✅ Task added to Google Sheets: ${task.title}`);
      return task;

    } catch (error) {
      console.error('❌ Failed to add task to Google Sheets:', error);

      // Fallback to localStorage
      const tasks = await this.getTasks();
      const updatedTasks = [task, ...tasks];
      this.saveToLocalStorage(updatedTasks);
      this.cache.data = updatedTasks;

      throw error;
    }
  }

  // Update single task in Google Sheets
  async updateTask(updatedTask: Task): Promise<Task> {
    try {
      console.log('✏️ Updating task in Google Sheets...');
      console.log('📤 Task data being sent:', {
        id: updatedTask.id,
        title: updatedTask.title,
        subtasks: updatedTask.subtasks,
        comments: updatedTask.comments
      });

      // Detailed logging for debugging
      console.log('📋 Subtasks count:', updatedTask.subtasks?.length || 0);
      console.log('💬 Comments count:', updatedTask.comments?.length || 0);

      if (updatedTask.subtasks && updatedTask.subtasks.length > 0) {
        console.log('📋 Subtasks detail:', JSON.stringify(updatedTask.subtasks, null, 2));
      }
      if (updatedTask.comments && updatedTask.comments.length > 0) {
        console.log('💬 Comments detail:', JSON.stringify(updatedTask.comments, null, 2));
      }

      if (!GOOGLE_SHEETS_CONFIG.apiBackendUrl) {
        console.warn('⚠️ No backend URL, using localStorage fallback');
        const tasks = await this.getTasks();
        const updatedTasks = tasks.map(task =>
          task.id === updatedTask.id ? updatedTask : task
        );
        this.saveToLocalStorage(updatedTasks);
        this.cache.data = updatedTasks;
        return updatedTask;
      }

      // Convert Vietnamese status to English before sending
      const statusMap: { [key: string]: string } = {
        'Chưa làm': 'todo',
        'Đang làm': 'in-progress',
        'Lên Kế Hoạch': 'planning',
        'Đang Review': 'review',
        'Hoàn thành': 'completed',
        'Tạm dừng': 'paused',
        'Hủy bỏ': 'cancelled'
      };

      // Create task copy with English status for backend
      const taskForBackend = {
        ...updatedTask,
        status: statusMap[updatedTask.status] || updatedTask.status
      };

      const payload = {
        action: 'updateTask',
        task: taskForBackend
      };

      console.log('🔄 Status mapping:', updatedTask.status, '→', taskForBackend.status);
      console.log('📤 Sending POST request with payload size:', JSON.stringify(payload).length, 'bytes');
      console.log('📋 Payload subtasks:', taskForBackend.subtasks?.length || 0);
      console.log('💬 Payload comments:', taskForBackend.comments?.length || 0);
      console.log('🌐 API URL:', GOOGLE_SHEETS_CONFIG.apiBackendUrl);

      // Always use POST with no-cors for data integrity
      await fetch(GOOGLE_SHEETS_CONFIG.apiBackendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        mode: 'no-cors'
      });

      console.log('📤 POST request sent (no-cors mode)');

      // Update cache optimistically
      if (this.cache.data) {
        this.cache.data = this.cache.data.map(task =>
          task.id === updatedTask.id ? updatedTask : task
        );
      }

      console.log(`✅ Task updated in Google Sheets: ${updatedTask.title}`);
      return updatedTask;

    } catch (error) {
      console.error('❌ Failed to update task in Google Sheets:', error);

      // Fallback to localStorage
      const tasks = await this.getTasks();
      const updatedTasks = tasks.map(task =>
        task.id === updatedTask.id ? updatedTask : task
      );
      this.saveToLocalStorage(updatedTasks);
      this.cache.data = updatedTasks;

      throw error;
    }
  }

  // Delete task from Google Sheets
  async deleteTask(taskId: string): Promise<void> {
    try {
      console.log('🗑️ Deleting task from Google Sheets...');

      if (!GOOGLE_SHEETS_CONFIG.apiBackendUrl) {
        console.warn('⚠️ No backend URL, using localStorage fallback');
        const tasks = await this.getTasks();
        const updatedTasks = tasks.filter(task => task.id !== taskId);
        this.saveToLocalStorage(updatedTasks);
        this.cache.data = updatedTasks;
        return;
      }

      const response = await fetch(`${GOOGLE_SHEETS_CONFIG.apiBackendUrl}?action=deleteTask&taskId=${encodeURIComponent(taskId)}`, {
        method: 'GET',
        mode: 'no-cors'
      });

      // With no-cors mode, we can't read the response, so we assume success
      // Update cache optimistically
      if (this.cache.data) {
        this.cache.data = this.cache.data.filter(task => task.id !== taskId);
      }

      console.log(`✅ Task deleted from Google Sheets: ${taskId}`);

    } catch (error) {
      console.error('❌ Failed to delete task from Google Sheets:', error);

      // Fallback to localStorage
      const tasks = await this.getTasks();
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      this.saveToLocalStorage(updatedTasks);
      this.cache.data = updatedTasks;

      throw error;
    }
  }

  // Clear cache
  clearCache(): void {
    this.cache = { data: null, timestamp: 0, userId: undefined };
    console.log('🗑️ Google Sheets cache cleared');
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const endpoint = `?key=${GOOGLE_SHEETS_CONFIG.apiKey}`;
      await this.makeRequest(endpoint);
      return true;
    } catch {
      return false;
    }
  }

  // LocalStorage fallback methods - User-specific storage
  private getLocalStorageFallback(): Task[] {
    try {
      const storageKey = `tasks_${this.currentUserId}`;
      const stored = localStorage.getItem(storageKey);
      console.log(`📱 Loading localStorage for user ${this.currentUserId} from key: ${storageKey}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private saveToLocalStorage(tasks: Task[]): void {
    try {
      const storageKey = `tasks_${this.currentUserId}`;
      console.log(`💾 Saving localStorage for user ${this.currentUserId} to key: ${storageKey}`);
      localStorage.setItem(storageKey, JSON.stringify(tasks));
      localStorage.setItem('tasks_backup', JSON.stringify({
        tasks,
        timestamp: new Date().toISOString(),
        userId: this.currentUserId,
      }));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  // Export data
  async exportTasks(): Promise<{ tasks: Task[]; timestamp: string }> {
    const tasks = await this.getTasks();
    return {
      tasks,
      timestamp: new Date().toISOString(),
    };
  }

  // Import data
  async importTasks(tasks: Task[]): Promise<void> {
    await this.saveTasks(tasks);
  }
}

// Singleton instance
export const googleSheetsService = new GoogleSheetsService();
