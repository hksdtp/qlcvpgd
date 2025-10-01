// Enhanced Google Sheets API Service with full CRUD support
import { Task } from "../types";

// Configuration - FORCE NEW API URL
const GOOGLE_SHEETS_CONFIG = {
  // Read-only API (existing)
  apiKey: import.meta.env.VITE_GOOGLE_SHEETS_API_KEY || "",
  spreadsheetId: import.meta.env.VITE_GOOGLE_SPREADSHEET_ID || "",
  range: "Tasks!A:H",
  baseUrl: "https://sheets.googleapis.com/v4/spreadsheets",

  // Write API (Google Apps Script backend) - Use ENV variable
  apiBackendUrl:
    import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL ||
    "https://script.google.com/macros/s/AKfycbymXgzjCHaZ4htbCPH0DBbx19-EESLnMkK9MSpTR2ExjbjM2n0npmmtcYgm7LDsmPeK/exec",
};

// Debug log to verify URL
console.log("🔧 Google Sheets Config:");
console.log("- API Backend URL:", GOOGLE_SHEETS_CONFIG.apiBackendUrl);
console.log("- ENV URL:", import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL);

// Error classes
export class GoogleSheetsError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "GoogleSheetsError";
  }
}

// Helper functions
function taskToRow(task: Task): string[] {
  return [
    task.id,
    task.title,
    task.description || "",
    task.status,
    task.department || "",
    JSON.stringify(task.subtasks || []),
    task.createdAt,
    new Date().toISOString(), // updatedAt
  ];
}

function rowToTask(row: string[]): Task | null {
  if (!row || row.length < 7) return null;

  // Skip header row and invalid data
  if (row[0] === "ID" || typeof row[0] !== "string" || row[0].trim() === "") {
    return null;
  }

  // Accept both task_ and test_ prefixes (and any other valid IDs)
  if (!row[0].includes("task_") && !row[0].includes("test_")) {
    console.log("⚠️ Skipping row with unexpected ID format:", row[0]);
    return null;
  }

  try {
    // Convert English status back to Vietnamese for frontend display
    const englishStatus = row[3] || "todo";
    const statusMap: { [key: string]: string } = {
      "need-to-do": "Cần làm",
      todo: "Chưa làm",
      planning: "Lên Kế Hoạch",
      "in-progress": "Đang làm",
      review: "Đang Review",
      completed: "Hoàn thành",
      "on-hold": "Tồn đọng",
      paused: "Dừng",
      cancelled: "Hủy bỏ",
    };

    const vietnameseStatus = statusMap[englishStatus] || englishStatus;

    return {
      id: row[0] || "",
      title: row[1] || "",
      description: row[2] || undefined,
      status: vietnameseStatus as any,
      department: row[4] || undefined,
      subtasks: row[5] ? JSON.parse(row[5]) : [],
      createdAt: row[6] || new Date().toISOString(),
      comments: row[8]
        ? JSON.parse(row[8]).map((comment: any) => ({
            ...comment,
            likes: comment.likes || 0,
            likedBy: comment.likedBy || [],
            isEdited: comment.isEdited || false,
          }))
        : [],
    };
  } catch (error) {
    console.error("Error parsing row:", error, row);
    return null;
  }
}

// Google Sheets Service Class
export class GoogleSheetsService {
  private cache: { data: Task[] | null; timestamp: number; userId?: string } = {
    data: null,
    timestamp: 0,
  };
  private readonly CACHE_DURATION = 20 * 1000; // 20 seconds (reduced from 2 minutes for real-time sync)
  private currentUserId: string = "u4"; // Default to NI user

  // LocalStorage metadata for persistence tracking
  private localStorageMetadata = {
    key: "tasks_metadata",
    getMetadata: () => {
      try {
        const metadata = localStorage.getItem("tasks_metadata");
        return metadata
          ? JSON.parse(metadata)
          : { lastUpdate: 0, hasRecentChanges: false };
      } catch {
        return { lastUpdate: 0, hasRecentChanges: false };
      }
    },
    setMetadata: (hasRecentChanges: boolean) => {
      const metadata = {
        lastUpdate: Date.now(),
        hasRecentChanges,
      };
      localStorage.setItem("tasks_metadata", JSON.stringify(metadata));
      console.log(
        `📝 LocalStorage metadata updated: hasRecentChanges=${hasRecentChanges}`
      );
    },
  };

  constructor() {
    if (!GOOGLE_SHEETS_CONFIG.apiKey || !GOOGLE_SHEETS_CONFIG.spreadsheetId) {
      console.warn(
        "⚠️ Google Sheets read credentials not configured. Using localStorage fallback."
      );
    }
    if (!GOOGLE_SHEETS_CONFIG.apiBackendUrl) {
      console.warn(
        "⚠️ Google Apps Script backend URL not configured. Write operations will use localStorage fallback."
      );
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
    return (
      this.cache.data !== null &&
      this.cache.userId === this.currentUserId &&
      Date.now() - this.cache.timestamp < this.CACHE_DURATION
    );
  }

  // Force clear cache and refresh data
  async clearCacheAndRefresh(): Promise<Task[]> {
    console.log("🔄 Clearing cache and forcing refresh...");
    this.cache = { data: null, timestamp: 0, userId: undefined };
    localStorage.removeItem("tasks_cache");
    return this.getTasks();
  }

  private async makeRequest(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<any> {
    const url = `${GOOGLE_SHEETS_CONFIG.baseUrl}/${GOOGLE_SHEETS_CONFIG.spreadsheetId}/${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
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
    console.log("📊 Getting tasks from Google Sheets...");
    console.log("👤 Current user ID:", this.currentUserId);

    // Check for recent local changes first (highest priority)
    // Only use localStorage if changes are VERY recent (< 10 seconds)
    // This allows other users to see updates quickly
    const metadata = this.localStorageMetadata.getMetadata();
    const hasRecentChanges =
      metadata.hasRecentChanges &&
      Date.now() - metadata.lastUpdate < 10 * 1000; // 10 seconds (reduced from 5 minutes)

    if (hasRecentChanges) {
      console.log(
        "🔄 Very recent local changes detected (< 10s), prioritizing localStorage..."
      );
      const localTasks = this.getLocalStorageFallback();
      if (localTasks.length > 0) {
        console.log(
          "✅ Using localStorage data due to very recent changes:",
          localTasks.length,
          "tasks"
        );
        // Update cache with localStorage data
        this.cache = {
          data: localTasks,
          timestamp: Date.now(),
          userId: this.currentUserId,
        };
        return localTasks;
      }
    }

    // Return cached data if valid (second priority)
    // Reduced cache duration for better real-time sync
    if (this.isCacheValid()) {
      console.log("📦 Returning cached Google Sheets data");
      return this.cache.data!;
    }

    try {
      console.log("📊 Fetching tasks from Google Sheets API...");

      // Use Google Apps Script for consistent API (third priority)
      if (!GOOGLE_SHEETS_CONFIG.apiBackendUrl) {
        console.warn(
          "⚠️ No Google Apps Script URL configured, using localStorage fallback"
        );
        const fallbackTasks = this.getLocalStorageFallback();
        return fallbackTasks;
      }

      const response = await fetch(
        `${GOOGLE_SHEETS_CONFIG.apiBackendUrl}?action=getTasks`,
        {
          method: "GET",
          mode: "cors", // Try CORS first, fallback to no-cors if needed
        }
      );

      let result;
      try {
        result = await response.json();
      } catch (jsonError) {
        // If CORS blocks JSON reading, try no-cors mode
        console.log("🔄 CORS blocked, retrying with no-cors mode...");
        const noCorsResponse = await fetch(
          `${GOOGLE_SHEETS_CONFIG.apiBackendUrl}?action=getTasks`,
          {
            method: "GET",
            mode: "no-cors",
          }
        );

        // With no-cors, we can't read response, so assume success and use cache/localStorage
        const fallbackTasks = this.getLocalStorageFallback();
        console.log(
          `📱 Using localStorage fallback due to CORS: ${fallbackTasks.length} tasks`
        );
        return fallbackTasks;
      }

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch tasks");
      }

      const tasks = result.data || [];

      console.log("📊 Raw tasks from Google Apps Script:", tasks.length);
      console.log("✅ Successfully loaded tasks:", tasks.length);
      console.log(
        "📋 Task IDs:",
        tasks.map((t: Task) => t.id)
      );

      // Update cache
      this.cache = {
        data: tasks,
        timestamp: Date.now(),
        userId: this.currentUserId,
      };

      console.log(`✅ Loaded ${tasks.length} tasks from Google Sheets`);
      return tasks;
    } catch (error) {
      console.error("❌ Failed to fetch from Google Sheets:", error);

      // Fallback to localStorage
      const fallbackTasks = this.getLocalStorageFallback();
      console.log(
        `📱 Using localStorage fallback: ${fallbackTasks.length} tasks`
      );
      return fallbackTasks;
    }
  }

  // Write tasks to Google Sheets via Apps Script backend
  async saveTasks(tasks: Task[]): Promise<void> {
    try {
      console.log("💾 Saving tasks to Google Sheets...");

      if (!GOOGLE_SHEETS_CONFIG.apiBackendUrl) {
        console.warn(
          "⚠️ No backend URL configured, using localStorage fallback"
        );
        this.saveToLocalStorage(tasks);
        return;
      }

      // Note: This would require implementing a bulk update endpoint
      // For now, we'll use individual operations
      console.log("⚠️ Bulk save not implemented, use individual operations");
      this.saveToLocalStorage(tasks);

      // Update cache
      this.cache = {
        data: tasks,
        timestamp: Date.now(),
        userId: this.currentUserId,
      };

      console.log(`✅ Saved ${tasks.length} tasks (localStorage fallback)`);
    } catch (error) {
      console.error("❌ Failed to save to Google Sheets:", error);
      this.saveToLocalStorage(tasks);
      throw new GoogleSheetsError(`Save failed: ${error}`);
    }
  }

  // Add single task to Google Sheets
  async addTask(task: Task): Promise<Task> {
    try {
      console.log("➕ Adding task to Google Sheets...");

      if (!GOOGLE_SHEETS_CONFIG.apiBackendUrl) {
        console.warn("⚠️ No backend URL, using localStorage fallback");
        const tasks = await this.getTasks();
        const updatedTasks = [task, ...tasks];
        this.saveToLocalStorage(updatedTasks);
        this.cache.data = updatedTasks;
        return task;
      }

      // Convert Vietnamese status to English before sending
      const statusMap: { [key: string]: string } = {
        "Cần làm": "need-to-do",
        "Chưa làm": "todo",
        "Lên Kế Hoạch": "planning",
        "Đang làm": "in-progress",
        "Đang Review": "review",
        "Hoàn thành": "completed",
        "Tồn đọng": "on-hold",
        "Dừng": "paused",
        "Hủy bỏ": "cancelled",
      };

      // Create task copy with English status for backend
      const taskForBackend = {
        ...task,
        status: statusMap[task.status] || task.status,
      };

      console.log(
        "🔄 Create task status mapping:",
        task.status,
        "→",
        taskForBackend.status
      );
      console.log("🌐 API URL:", GOOGLE_SHEETS_CONFIG.apiBackendUrl);

      // Use POST request with CORS mode to get response
      const payload = {
        action: "createTask",
        task: taskForBackend,
      };

      const response = await fetch(GOOGLE_SHEETS_CONFIG.apiBackendUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        mode: "cors", // Changed from no-cors to cors
      });

      console.log("📤 POST request sent, status:", response.status);

      // Check if request was successful
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Parse response
      const result = await response.json();
      console.log("📥 Response received:", result);

      if (!result.success) {
        throw new Error(result.error || "Create failed");
      }

      console.log("✅ Google Sheets API confirmed create success");

      // Update cache with confirmed data
      if (this.cache.data) {
        this.cache.data = [task, ...this.cache.data];
      }

      // Update localStorage
      const tasks = this.cache.data || (await this.getTasks());
      this.saveToLocalStorage(tasks);
      this.localStorageMetadata.setMetadata(true);

      console.log(`✅ Task added to Google Sheets: ${task.title}`);
      return task;
    } catch (error) {
      console.error("❌ Failed to add task to Google Sheets:", error);

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
      console.log("✏️ Updating task in Google Sheets...");
      console.log("📤 Task data being sent:", {
        id: updatedTask.id,
        title: updatedTask.title,
        subtasks: updatedTask.subtasks,
        comments: updatedTask.comments,
      });

      // Detailed logging for debugging
      console.log("📋 Subtasks count:", updatedTask.subtasks?.length || 0);
      console.log("💬 Comments count:", updatedTask.comments?.length || 0);

      if (updatedTask.subtasks && updatedTask.subtasks.length > 0) {
        console.log(
          "📋 Subtasks detail:",
          JSON.stringify(updatedTask.subtasks, null, 2)
        );
      }
      if (updatedTask.comments && updatedTask.comments.length > 0) {
        console.log(
          "💬 Comments detail:",
          JSON.stringify(updatedTask.comments, null, 2)
        );
      }

      if (!GOOGLE_SHEETS_CONFIG.apiBackendUrl) {
        console.warn("⚠️ No backend URL, using localStorage fallback");
        const tasks = await this.getTasks();
        const updatedTasks = tasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        );
        this.saveToLocalStorage(updatedTasks);
        this.cache.data = updatedTasks;
        return updatedTask;
      }

      // Convert Vietnamese status to English before sending
      const statusMap: { [key: string]: string } = {
        "Cần làm": "need-to-do",
        "Chưa làm": "todo",
        "Lên Kế Hoạch": "planning",
        "Đang làm": "in-progress",
        "Đang Review": "review",
        "Hoàn thành": "completed",
        "Tồn đọng": "on-hold",
        "Dừng": "paused",
        "Hủy bỏ": "cancelled",
      };

      // Create task copy with English status for backend
      const taskForBackend = {
        ...updatedTask,
        status: statusMap[updatedTask.status] || updatedTask.status,
      };

      // Use GET request with URL parameters to avoid CORS preflight
      // POST with JSON triggers OPTIONS preflight which Google Apps Script doesn't handle well
      const taskDataEncoded = encodeURIComponent(JSON.stringify(taskForBackend));

      console.log(
        "🔄 Status mapping:",
        updatedTask.status,
        "→",
        taskForBackend.status
      );
      console.log(
        "📤 Sending GET request with task data size:",
        taskDataEncoded.length,
        "bytes"
      );
      console.log("📋 Task subtasks:", taskForBackend.subtasks?.length || 0);
      console.log("💬 Task comments:", taskForBackend.comments?.length || 0);
      console.log("🌐 API URL:", GOOGLE_SHEETS_CONFIG.apiBackendUrl);

      // Use GET request to avoid CORS preflight (POST with JSON triggers OPTIONS)
      const url = `${GOOGLE_SHEETS_CONFIG.apiBackendUrl}?action=updateTask&taskData=${taskDataEncoded}`;

      const response = await fetch(url, {
        method: "GET",
        mode: "cors", // Can use cors with GET (no preflight needed)
      });

      console.log("📤 GET request sent, status:", response.status);

      // Check if request was successful
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Parse response
      const result = await response.json();
      console.log("📥 Response received:", result);

      if (!result.success) {
        throw new Error(result.error || "Update failed");
      }

      console.log("✅ Google Sheets API confirmed update success");

      // Update cache with confirmed data
      if (this.cache.data) {
        this.cache.data = this.cache.data.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        );
      }

      // Update localStorage and mark as having recent changes
      const tasks = this.cache.data || (await this.getTasks());
      const updatedTasks = tasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      );
      this.saveToLocalStorage(updatedTasks);
      this.localStorageMetadata.setMetadata(true); // Mark as having recent changes

      // Clear the flag after 10 seconds to allow other users to see updates
      setTimeout(() => {
        this.localStorageMetadata.setMetadata(false);
        console.log("🔄 Recent changes flag cleared, other users can now see updates");
      }, 10000); // 10 seconds

      console.log(`✅ Task updated in Google Sheets: ${updatedTask.title}`);
      return updatedTask;
    } catch (error) {
      console.error("❌ Failed to update task in Google Sheets:", error);

      // Fallback to localStorage - still save the changes locally
      const tasks = await this.getTasks();
      const updatedTasks = tasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      );
      this.saveToLocalStorage(updatedTasks);
      this.cache.data = updatedTasks;
      this.localStorageMetadata.setMetadata(true); // Mark as having recent changes even on error

      console.log("💾 Changes saved to localStorage despite API error");
      return updatedTask; // Return the updated task instead of throwing error
    }
  }

  // Delete task from Google Sheets
  async deleteTask(taskId: string): Promise<void> {
    try {
      console.log("🗑️ Deleting task from Google Sheets...");

      if (!GOOGLE_SHEETS_CONFIG.apiBackendUrl) {
        console.warn("⚠️ No backend URL, using localStorage fallback");
        const tasks = await this.getTasks();
        const updatedTasks = tasks.filter((task) => task.id !== taskId);
        this.saveToLocalStorage(updatedTasks);
        this.cache.data = updatedTasks;
        return;
      }

      // Use GET request with CORS mode to get response
      const response = await fetch(
        `${
          GOOGLE_SHEETS_CONFIG.apiBackendUrl
        }?action=deleteTask&taskId=${encodeURIComponent(taskId)}`,
        {
          method: "GET",
          mode: "cors", // Changed from no-cors to cors
        }
      );

      console.log("📤 DELETE request sent, status:", response.status);

      // Check if request was successful
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Parse response
      const result = await response.json();
      console.log("📥 Response received:", result);

      if (!result.success) {
        throw new Error(result.error || "Delete failed");
      }

      console.log("✅ Google Sheets API confirmed delete success");

      // Update cache with confirmed deletion
      if (this.cache.data) {
        this.cache.data = this.cache.data.filter((task) => task.id !== taskId);
      }

      // Update localStorage
      const tasks = this.cache.data || (await this.getTasks());
      this.saveToLocalStorage(tasks);
      this.localStorageMetadata.setMetadata(true);

      console.log(`✅ Task deleted from Google Sheets: ${taskId}`);
    } catch (error) {
      console.error("❌ Failed to delete task from Google Sheets:", error);

      // Fallback to localStorage
      const tasks = await this.getTasks();
      const updatedTasks = tasks.filter((task) => task.id !== taskId);
      this.saveToLocalStorage(updatedTasks);
      this.cache.data = updatedTasks;

      throw error;
    }
  }

  // Clear cache
  clearCache(): void {
    this.cache = { data: null, timestamp: 0, userId: undefined };
    console.log("🗑️ Google Sheets cache cleared");
  }

  // Clear recent changes flag (call this when API sync is successful)
  clearRecentChanges(): void {
    this.localStorageMetadata.setMetadata(false);
    console.log("✅ Recent changes flag cleared");
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      // Check if API key is configured
      if (!GOOGLE_SHEETS_CONFIG.apiKey || !GOOGLE_SHEETS_CONFIG.spreadsheetId) {
        console.log("⚠️ Google Sheets API not configured, skipping health check");
        return false;
      }

      // Test with a simple metadata request
      const url = `${GOOGLE_SHEETS_CONFIG.baseUrl}/${GOOGLE_SHEETS_CONFIG.spreadsheetId}?key=${GOOGLE_SHEETS_CONFIG.apiKey}&fields=spreadsheetId,properties.title`;

      const response = await fetch(url);

      if (response.ok) {
        console.log("✅ Google Sheets API health check passed");
        return true;
      } else {
        console.warn(`⚠️ Google Sheets API health check failed: ${response.status}`);
        return false;
      }
    } catch (error) {
      console.warn("⚠️ Google Sheets API health check error:", error);
      return false;
    }
  }

  // LocalStorage fallback methods - User-specific storage
  private getLocalStorageFallback(): Task[] {
    try {
      const storageKey = `tasks_${this.currentUserId}`;
      const stored = localStorage.getItem(storageKey);
      console.log(
        `📱 Loading localStorage for user ${this.currentUserId} from key: ${storageKey}`
      );
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private saveToLocalStorage(tasks: Task[]): void {
    try {
      const storageKey = `tasks_${this.currentUserId}`;
      console.log(
        `💾 Saving localStorage for user ${this.currentUserId} to key: ${storageKey}`
      );
      localStorage.setItem(storageKey, JSON.stringify(tasks));
      localStorage.setItem(
        "tasks_backup",
        JSON.stringify({
          tasks,
          timestamp: new Date().toISOString(),
          userId: this.currentUserId,
        })
      );
    } catch (error) {
      console.error("Failed to save to localStorage:", error);
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